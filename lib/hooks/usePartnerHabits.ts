'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import type { Habit, HabitLog } from '@/lib/types/habits'
import { usePartnership } from './usePartnership'

export function usePartnerHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const { partner, partnership } = usePartnership()
  const supabase = createClient()

  const fetchPartnerHabits = async () => {
    if (!user || !partner) {
      setHabits([])
      setLogs([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Fetch partner's shared habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', partner.id)
        .eq('is_shared', true)
        .order('created_at', { ascending: true })

      if (habitsError) throw habitsError

      setHabits(habitsData || [])

      // Fetch today's logs for partner's shared habits
      if (habitsData && habitsData.length > 0) {
        const habitIds = habitsData.map((h) => h.id)
        const today = new Date().toISOString().split('T')[0]

        const { data: logsData, error: logsError } = await supabase
          .from('habit_logs')
          .select('*')
          .in('habit_id', habitIds)
          .eq('log_date', today)

        if (logsError) throw logsError
        setLogs(logsData || [])
      } else {
        setLogs([])
      }
    } catch (err: any) {
      console.error('Error fetching partner habits:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartnerHabits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, partner?.id])

  return {
    habits,
    logs,
    loading,
    error,
    refetch: fetchPartnerHabits,
  }
}
