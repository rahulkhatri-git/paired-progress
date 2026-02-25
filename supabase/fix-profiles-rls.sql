-- Fix RLS policy on profiles table to allow viewing partner profiles
-- This enables users in an active partnership to see each other's profile data

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create new policy that allows:
-- 1. Users to view their own profile
-- 2. Users to view their partner's profile (if they have an active partnership)
CREATE POLICY "Users can view own and partner profile" ON profiles
  FOR SELECT
  USING (
    auth.uid() = id OR
    id IN (
      SELECT user1_id FROM partnerships 
      WHERE user2_id = auth.uid() AND status = 'active'
      UNION
      SELECT user2_id FROM partnerships 
      WHERE user1_id = auth.uid() AND status = 'active'
    )
  );
