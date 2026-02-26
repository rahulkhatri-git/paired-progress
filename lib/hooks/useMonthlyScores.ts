"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import type { HabitLog } from "@/lib/types/habits"

interface MonthlyScore {
  user_id: string
  total_points: number
  logs_count: number
  streaks_count: number
  gold_tiers_count: number
}

/**
 * Points calculation rules:
 * - Binary completion: 3 points (same as gold tier)
 * - Bronze tier: 1 point
 * - Silver tier: 2 points
 * - Gold tier: 3 points
 * - 7-day streak: +3 bonus (calculated separately)
 * - Partner approval: +1 bonus (on top of base points)
 * - Partner challenge: NO base points (0 pts, not negative)
 * 
 * Example:
 * - Gold tier approved: 3 (base) + 1 (approval) = 4 pts
 * - Gold tier challenged: 0 pts (base removed, no penalty)
 * - Binary approved: 3 (base) + 1 (approval) = 4 pts
 * - Binary challenged: 0 pts (base removed, no penalty)
 * 
 * Philosophy: Challenge removes points but doesn't punish further.
 * Accountability through transparency, not harsh penalties.
 */

export function useMonthlyScores(partnerId?: string) {
  const { user } = useAuth()
  const [userScore, setUserScore] = useState(0)
  const [partnerScore, setPartnerScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const calculatePointsFromLogs = async (userId: string): Promise<number> => {
    try {
      // Get current month's date range
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const startDate = monthStart.toISOString().split('T')[0]
      const endDate = monthEnd.toISOString().split('T')[0]

      // Fetch all logs for this month
      const { data: logs, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('log_date', startDate)
        .lte('log_date', endDate)

      if (error) throw error
      if (!logs || logs.length === 0) return 0

      let totalPoints = 0

      // Calculate points from each log
      logs.forEach((log: HabitLog) => {
        // Check if log was challenged (reviewed and NOT approved)
        const wasChallenged = log.reviewed_by && log.approved === false
        
        // Base points from completion/tier (ONLY if not challenged)
        if (log.completed && !wasChallenged) {
          if (log.tier_achieved === 'gold') {
            totalPoints += 3
          } else if (log.tier_achieved === 'silver') {
            totalPoints += 2
          } else if (log.tier_achieved === 'bronze') {
            totalPoints += 1
          } else {
            // Binary completion = 3 points (same as gold)
            totalPoints += 3
          }
        }

        // Approval bonus (only if approved, no penalty if challenged)
        if (log.reviewed_by && log.approved) {
          totalPoints += 1
        }
      })

      // Calculate 7-day streaks bonus
      const streakBonus = calculateStreakBonus(logs)
      totalPoints += streakBonus

      return totalPoints
    } catch (err) {
      console.error('Error calculating points:', err)
      return 0
    }
  }

  const calculateStreakBonus = (logs: HabitLog[]): number => {
    // Group logs by date
    const logsByDate = logs.reduce((acc, log) => {
      if (!acc[log.log_date]) {
        acc[log.log_date] = []
      }
      acc[log.log_date].push(log)
      return acc
    }, {} as Record<string, HabitLog[]>)

    // Get sorted dates
    const dates = Object.keys(logsByDate).sort()
    
    let streakCount = 0
    let currentStreak = 0
    let lastDate: Date | null = null

    dates.forEach(dateStr => {
      const date = new Date(dateStr)
      const hasCompletedLog = logsByDate[dateStr].some(log => log.completed)
      
      if (!hasCompletedLog) {
        currentStreak = 0
        lastDate = null
        return
      }

      if (!lastDate) {
        currentStreak = 1
      } else {
        const daysDiff = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff === 1) {
          currentStreak++
          
          // Award bonus for each 7-day streak
          if (currentStreak % 7 === 0) {
            streakCount++
          }
        } else {
          currentStreak = 1
        }
      }
      
      lastDate = date
    })

    return streakCount * 3 // 3 points per 7-day streak
  }

  const fetchScores = async () => {
    if (!user) {
      setUserScore(0)
      setPartnerScore(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Calculate user's score
      const userPoints = await calculatePointsFromLogs(user.id)
      setUserScore(userPoints)

      // Calculate partner's score if partnerId provided
      if (partnerId) {
        const partnerPoints = await calculatePointsFromLogs(partnerId)
        setPartnerScore(partnerPoints)
      } else {
        setPartnerScore(0)
      }
    } catch (err) {
      console.error('Error fetching scores:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()
  }, [user?.id, partnerId])

  // Subscribe to real-time updates on habit_logs for immediate score refresh
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('habit_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'habit_logs',
          filter: `user_id=eq.${user.id}`, // Only user's own logs
        },
        (payload) => {
          console.log('Habit log changed:', payload)
          // Refetch scores when logs change
          fetchScores()
        }
      )
      .subscribe()

    // Also listen to partner's logs if they challenge/approve
    if (partnerId) {
      const partnerChannel = supabase
        .channel('partner_logs_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'habit_logs',
            filter: `user_id=eq.${partnerId}`, // Partner's logs
          },
          (payload) => {
            console.log('Partner log changed:', payload)
            // Refetch scores when partner's logs change
            fetchScores()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
        supabase.removeChannel(partnerChannel)
      }
    }

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, partnerId])

  return {
    userScore,
    partnerScore,
    loading,
    refetch: fetchScores,
  }
}
