-- Cleanup script to delete test users and all their associated data
-- This will cascade delete all related records (habits, logs, partnerships, invitations, etc.)

-- INSTRUCTIONS:
-- 1. First, identify the user IDs you want to delete by running:
--    SELECT id, email, full_name, created_at FROM profiles ORDER BY created_at DESC;
--
-- 2. Then replace the placeholder UUIDs below with the actual user IDs
-- 3. Run this script in Supabase SQL Editor

-- ============================================================================
-- STEP 1: Delete from profiles (cascades to most tables)
-- ============================================================================
-- The ON DELETE CASCADE constraints will automatically delete:
-- - habits (user_id FK)
-- - habit_logs (via habits cascade)
-- - partnerships (user1_id and user2_id FKs)
-- - partner_invitations (inviter_id FK)
-- - monthly_scores (user_id FK)

DELETE FROM profiles
WHERE id IN (
  'USER_ID_1_HERE',
  'USER_ID_2_HERE',
  'USER_ID_3_HERE',
  'USER_ID_4_HERE'
);

-- ============================================================================
-- STEP 2: Delete from auth.users (optional - removes authentication)
-- ============================================================================
-- This removes the users from Supabase Auth entirely
-- Only run this if you want to completely remove their accounts

-- Note: You need to run this separately for each user in the Supabase Dashboard
-- Go to: Authentication > Users > Click the user > Delete user

-- Alternatively, if you have admin access, you can use:
-- DELETE FROM auth.users WHERE id IN (...);
-- But this typically requires service role key

-- ============================================================================
-- STEP 3: Verify deletion
-- ============================================================================
-- Run these queries to confirm all data is deleted:

-- Check profiles
SELECT COUNT(*) as remaining_profiles FROM profiles 
WHERE id IN ('USER_ID_1_HERE', 'USER_ID_2_HERE', 'USER_ID_3_HERE', 'USER_ID_4_HERE');

-- Check habits
SELECT COUNT(*) as remaining_habits FROM habits 
WHERE user_id IN ('USER_ID_1_HERE', 'USER_ID_2_HERE', 'USER_ID_3_HERE', 'USER_ID_4_HERE');

-- Check partnerships
SELECT COUNT(*) as remaining_partnerships FROM partnerships 
WHERE user1_id IN ('USER_ID_1_HERE', 'USER_ID_2_HERE', 'USER_ID_3_HERE', 'USER_ID_4_HERE')
   OR user2_id IN ('USER_ID_1_HERE', 'USER_ID_2_HERE', 'USER_ID_3_HERE', 'USER_ID_4_HERE');

-- All counts should return 0
