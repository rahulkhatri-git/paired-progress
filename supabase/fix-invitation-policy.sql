-- Fix for "permission denied for table users" error
-- Run this in Supabase SQL Editor to fix the invitation policies

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view their invitations" ON partner_invitations;

-- Recreate without auth.users access
CREATE POLICY "Users can view their invitations"
  ON partner_invitations FOR SELECT
  USING (
    auth.uid() = inviter_id OR 
    auth.uid() = accepted_by OR
    invitee_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Alternative: If you don't have email in profiles, use this simpler version
-- This allows users to see invites they created or accepted
/*
DROP POLICY IF EXISTS "Users can view their invitations" ON partner_invitations;

CREATE POLICY "Users can view their invitations"
  ON partner_invitations FOR SELECT
  USING (
    auth.uid() = inviter_id OR 
    auth.uid() = accepted_by
  );
*/
