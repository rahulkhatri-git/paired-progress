'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import type { Partnership, PartnerInvitation, PartnerProfile } from '@/lib/types/partnerships'
import { toast } from 'sonner'

export function usePartnership() {
  const [partnership, setPartnership] = useState<Partnership | null>(null)
  const [partner, setPartner] = useState<PartnerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchPartnership = async () => {
    if (!user) {
      setPartnership(null)
      setPartner(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Get active partnership
      const { data: partnershipData, error: partnershipError } = await supabase
        .from('partnerships')
        .select('*')
        .eq('status', 'active')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single()

      if (partnershipError) {
        if (partnershipError.code === 'PGRST116') {
          // No partnership found - this is okay
          setPartnership(null)
          setPartner(null)
        } else {
          throw partnershipError
        }
      } else if (partnershipData) {
        setPartnership(partnershipData)

        // Get partner's profile
        const partnerId = partnershipData.user1_id === user.id 
          ? partnershipData.user2_id 
          : partnershipData.user1_id

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .eq('id', partnerId)
          .single()

        if (profileError) throw profileError

        setPartner({
          ...profileData,
          partnership_since: partnershipData.accepted_at || partnershipData.created_at,
        })
      }
    } catch (err: any) {
      console.error('Error fetching partnership:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const unlinkPartner = async (): Promise<boolean> => {
    if (!partnership || !user) {
      toast.error('No active partnership')
      return false
    }

    try {
      const { error } = await supabase
        .from('partnerships')
        .update({ status: 'ended', ended_at: new Date().toISOString() })
        .eq('id', partnership.id)

      if (error) throw error

      toast.success('Partnership ended')
      setPartnership(null)
      setPartner(null)
      return true
    } catch (err: any) {
      console.error('Error ending partnership:', err)
      toast.error(err.message || 'Failed to end partnership')
      return false
    }
  }

  useEffect(() => {
    fetchPartnership()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return {
    partnership,
    partner,
    loading,
    error,
    hasPartner: !!partnership,
    unlinkPartner,
    refetch: fetchPartnership,
  }
}

export function useInvitations() {
  const [invitations, setInvitations] = useState<PartnerInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchInvitations = async () => {
    if (!user) {
      setInvitations([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Get pending invitations (sent or received)
      const { data, error } = await supabase
        .from('partner_invitations')
        .select('*')
        .or(`inviter_id.eq.${user.id},invitee_email.eq.${user.email}`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvitations(data || [])
    } catch (err: any) {
      console.error('Error fetching invitations:', err)
    } finally {
      setLoading(false)
    }
  }

  const createInvitation = async (email?: string): Promise<PartnerInvitation | null> => {
    if (!user) {
      toast.error('You must be logged in')
      return null
    }

    try {
      // Generate 6-character code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      
      // Expires in 7 days
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const { data, error } = await supabase
        .from('partner_invitations')
        .insert({
          code,
          inviter_id: user.id,
          invitee_email: email,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Send email if email provided
      if (email) {
        try {
          const inviteUrl = `${window.location.origin}/?invite=${code}`
          await fetch('/api/send-invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              inviterName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Someone',
              inviteeEmail: email,
              inviteCode: code,
              inviteUrl,
            }),
          })
          toast.success('Invitation sent via email!')
        } catch (emailError) {
          console.error('Failed to send email:', emailError)
          toast.success('Invitation created! (Email sending failed, share the code manually)')
        }
      } else {
        toast.success('Invitation created!')
      }

      setInvitations((prev) => [data, ...prev])
      return data
    } catch (err: any) {
      console.error('Error creating invitation:', err)
      toast.error(err.message || 'Failed to create invitation')
      return null
    }
  }

  const acceptInvitation = async (code: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in')
      return false
    }

    try {
      // Get invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('partner_invitations')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('status', 'pending')
        .single()

      if (inviteError || !invitation) {
        toast.error('Invalid or expired invitation code')
        return false
      }

      // Check if expired
      if (new Date(invitation.expires_at) < new Date()) {
        toast.error('This invitation has expired')
        return false
      }

      // Can't invite yourself
      if (invitation.inviter_id === user.id) {
        toast.error("You can't accept your own invitation")
        return false
      }

      // Check if user already has a partner
      const { data: existingPartnership } = await supabase
        .from('partnerships')
        .select('id')
        .eq('status', 'active')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single()

      if (existingPartnership) {
        toast.error('You already have an active partner')
        return false
      }

      // Create partnership
      const { error: partnershipError } = await supabase
        .from('partnerships')
        .insert({
          user1_id: invitation.inviter_id,
          user2_id: user.id,
          status: 'active',
          invited_by: invitation.inviter_id,
          accepted_at: new Date().toISOString(),
        })

      if (partnershipError) throw partnershipError

      // Update invitation status
      await supabase
        .from('partner_invitations')
        .update({ 
          status: 'accepted',
          accepted_by: user.id,
          accepted_at: new Date().toISOString(),
        })
        .eq('id', invitation.id)

      toast.success('Partnership accepted! 🎉')
      return true
    } catch (err: any) {
      console.error('Error accepting invitation:', err)
      toast.error(err.message || 'Failed to accept invitation')
      return false
    }
  }

  const cancelInvitation = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('partner_invitations')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error

      setInvitations((prev) => prev.filter((inv) => inv.id !== id))
      toast.success('Invitation cancelled')
      return true
    } catch (err: any) {
      console.error('Error cancelling invitation:', err)
      toast.error(err.message || 'Failed to cancel invitation')
      return false
    }
  }

  useEffect(() => {
    fetchInvitations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return {
    invitations,
    loading,
    createInvitation,
    acceptInvitation,
    cancelInvitation,
    refetch: fetchInvitations,
  }
}
