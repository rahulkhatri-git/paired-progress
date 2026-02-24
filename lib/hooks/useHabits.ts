'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import type { Habit, CreateHabitInput, UpdateHabitInput } from '@/lib/types/habits'
import { toast } from 'sonner'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchHabits = async () => {
    if (!user) {
      setHabits([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setHabits(data || [])
    } catch (err: any) {
      console.error('Error fetching habits:', err)
      setError(err)
      toast.error('Failed to load habits')
    } finally {
      setLoading(false)
    }
  }

  const createHabit = async (input: CreateHabitInput): Promise<Habit | null> => {
    if (!user) {
      toast.error('You must be logged in to create habits')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          ...input,
        })
        .select()
        .single()

      if (error) throw error

      setHabits((prev) => [data, ...prev])
      toast.success('Habit created successfully!')
      return data
    } catch (err: any) {
      console.error('Error creating habit:', err)
      toast.error(err.message || 'Failed to create habit')
      return null
    }
  }

  const updateHabit = async (input: UpdateHabitInput): Promise<Habit | null> => {
    if (!user) {
      toast.error('You must be logged in')
      return null
    }

    try {
      const { id, ...updates } = input
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setHabits((prev) => prev.map((h) => (h.id === id ? data : h)))
      toast.success('Habit updated successfully!')
      return data
    } catch (err: any) {
      console.error('Error updating habit:', err)
      toast.error(err.message || 'Failed to update habit')
      return null
    }
  }

  const deleteHabit = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in')
      return false
    }

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setHabits((prev) => prev.filter((h) => h.id !== id))
      toast.success('Habit deleted successfully!')
      return true
    } catch (err: any) {
      console.error('Error deleting habit:', err)
      toast.error(err.message || 'Failed to delete habit')
      return false
    }
  }

  useEffect(() => {
    fetchHabits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    refetch: fetchHabits,
  }
}
