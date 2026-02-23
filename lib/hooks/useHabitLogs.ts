'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import type { HabitLog, CreateHabitLogInput } from '@/lib/types/habits'
import { toast } from 'sonner'

export function useHabitLogs(habitId?: string) {
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchLogs = async () => {
    if (!user) {
      setLogs([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      let query = supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false })

      if (habitId) {
        query = query.eq('habit_id', habitId)
      }

      const { data, error } = await query

      if (error) throw error
      setLogs(data || [])
    } catch (err: any) {
      console.error('Error fetching habit logs:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const createLog = async (input: CreateHabitLogInput): Promise<HabitLog | null> => {
    if (!user) {
      toast.error('You must be logged in')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .insert({
          user_id: user.id,
          log_date: input.log_date || new Date().toISOString().split('T')[0],
          ...input,
        })
        .select()
        .single()

      if (error) throw error

      setLogs((prev) => [data, ...prev])
      toast.success('Habit logged successfully!')
      return data
    } catch (err: any) {
      console.error('Error creating habit log:', err)
      if (err.code === '23505') {
        toast.error('You have already logged this habit today')
      } else {
        toast.error(err.message || 'Failed to log habit')
      }
      return null
    }
  }

  const updateLog = async (id: string, updates: Partial<CreateHabitLogInput>): Promise<HabitLog | null> => {
    if (!user) {
      toast.error('You must be logged in')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setLogs((prev) => prev.map((log) => (log.id === id ? data : log)))
      toast.success('Log updated successfully!')
      return data
    } catch (err: any) {
      console.error('Error updating habit log:', err)
      toast.error(err.message || 'Failed to update log')
      return null
    }
  }

  const deleteLog = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in')
      return false
    }

    try {
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setLogs((prev) => prev.filter((log) => log.id !== id))
      toast.success('Log deleted successfully!')
      return true
    } catch (err: any) {
      console.error('Error deleting habit log:', err)
      toast.error(err.message || 'Failed to delete log')
      return false
    }
  }

  const getLogForDate = (habitId: string, date: string): HabitLog | undefined => {
    return logs.find((log) => log.habit_id === habitId && log.log_date === date)
  }

  useEffect(() => {
    fetchLogs()
  }, [user?.id, habitId])

  return {
    logs,
    loading,
    error,
    createLog,
    updateLog,
    deleteLog,
    getLogForDate,
    refetch: fetchLogs,
  }
}
