-- Fix RLS policy for partner_invitations to allow code-based invitation lookup
-- This allows users to accept invitations using invite codes/links

-- Drop the old restrictive policies
DROP POLICY IF EXISTS "Users can view their invitations" ON partner_invitations;
DROP POLICY IF EXISTS "Users can view their invitations or pending invites by code" ON partner_invitations;

-- Create new policy that allows:
-- 1. Users to view invitations they sent (inviter_id)
-- 2. Users to view invitations they accepted (accepted_by)
-- 3. Users to view invitations sent to their email (invitee_email from profiles)
-- 4. ANYONE to view pending invitations by code (for accepting invite links)
CREATE POLICY "Users can view their invitations or pending invites by code"
  ON partner_invitations FOR SELECT
  USING (
    auth.uid() = inviter_id OR 
    auth.uid() = accepted_by OR
    invitee_email = (SELECT email FROM profiles WHERE id = auth.uid()) OR
    (status = 'pending' AND code IS NOT NULL)
  );
