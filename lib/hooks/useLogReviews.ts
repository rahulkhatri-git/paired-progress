"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface LogReview {
  id: string
  log_id: string
  reviewer_id: string
  action: 'approve' | 'challenge'
  comment: string | null
  created_at: string
}

export function useLogReviews() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Approve a partner's habit log
   */
  const approveLog = async (logId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Create review record
      const { error: reviewError } = await supabase
        .from('log_reviews')
        .insert({
          log_id: logId,
          reviewer_id: user.id,
          action: 'approve',
          comment: null,
        })

      if (reviewError) throw reviewError

      // Update the log to mark as reviewed
      const { error: updateError } = await supabase
        .from('habit_logs')
        .update({
          reviewed_by: user.id,
          approved: true,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', logId)

      if (updateError) throw updateError

      toast.success('Log approved!')
      return true
    } catch (err: any) {
      console.error('Error approving log:', err)
      setError(err)
      toast.error(err.message || 'Failed to approve log')
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Challenge a partner's habit log
   */
  const challengeLog = async (logId: string, reason: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      if (!reason.trim()) {
        throw new Error('Please provide a reason for the challenge')
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Create review record with challenge reason
      const { error: reviewError } = await supabase
        .from('log_reviews')
        .insert({
          log_id: logId,
          reviewer_id: user.id,
          action: 'challenge',
          comment: reason,
        })

      if (reviewError) throw reviewError

      // Update the log to mark as challenged
      const { error: updateError } = await supabase
        .from('habit_logs')
        .update({
          reviewed_by: user.id,
          approved: false,
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', logId)

      if (updateError) {
        console.error('Error updating habit_logs:', updateError)
        throw updateError
      }

      console.log('Challenge saved successfully for log:', logId)
      toast.success('Challenge submitted')
      return true
    } catch (err: any) {
      console.error('Error challenging log:', err)
      setError(err)
      toast.error(err.message || 'Failed to challenge log')
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch reviews for a specific log
   */
  const getLogReviews = async (logId: string): Promise<LogReview[]> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('log_reviews')
        .select('*')
        .eq('log_id', logId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (err: any) {
      console.error('Error fetching log reviews:', err)
      return []
    }
  }

  return {
    approveLog,
    challengeLog,
    getLogReviews,
    loading,
    error,
  }
}
