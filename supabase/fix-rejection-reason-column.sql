-- Fix column name mismatch: challenge_reason → rejection_reason
-- Run this in Supabase SQL Editor

-- Option 1: If column is named 'challenge_reason', rename it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'habit_logs' AND column_name = 'challenge_reason'
  ) THEN
    ALTER TABLE habit_logs RENAME COLUMN challenge_reason TO rejection_reason;
  END IF;
END $$;

-- Option 2: If column doesn't exist at all, create it
ALTER TABLE habit_logs 
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Verify the fix
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'habit_logs' 
AND column_name IN ('rejection_reason', 'challenge_reason');
