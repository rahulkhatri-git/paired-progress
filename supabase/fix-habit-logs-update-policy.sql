-- Fix RLS: Allow partners to update habit_logs for review purposes
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can only update their own logs" ON habit_logs;

-- Create comprehensive UPDATE policy for habit_logs
CREATE POLICY "Users can update own logs and partners can review"
  ON habit_logs FOR UPDATE
  USING (
    -- User can update their own logs
    auth.uid() = user_id
    OR
    -- OR partner can update review fields (reviewed_by, approved, rejection_reason, reviewed_at)
    EXISTS (
      SELECT 1 FROM partnerships
      WHERE status = 'active'
      AND (
        (user1_id = auth.uid() AND user2_id = habit_logs.user_id)
        OR 
        (user2_id = auth.uid() AND user1_id = habit_logs.user_id)
      )
    )
  );

-- Verify the policy was created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'habit_logs' 
AND cmd = 'UPDATE';
