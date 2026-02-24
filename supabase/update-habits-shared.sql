-- Update habits table to support shared/private habits
-- Run this in Supabase SQL Editor

-- Add is_shared column (defaults to true for new habits created in Phase 2)
ALTER TABLE habits 
  ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT true;

-- For existing habits, default to shared
UPDATE habits SET is_shared = true WHERE is_shared IS NULL;

-- Index for shared habit queries
CREATE INDEX IF NOT EXISTS idx_habits_shared ON habits(user_id, is_shared) WHERE is_shared = true;

-- Done!
