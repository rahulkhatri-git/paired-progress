# URGENT FIX: Column Name Mismatch

## Problem Found
**The challenge is failing silently due to a column name mismatch.**

The code tries to update `rejection_reason` but the database might have `challenge_reason` instead.

## Solution: Run This SQL in Supabase

```sql
-- Fix column name mismatch
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'habit_logs' AND column_name = 'challenge_reason'
  ) THEN
    ALTER TABLE habit_logs RENAME COLUMN challenge_reason TO rejection_reason;
  END IF;
END $$;

-- Ensure column exists
ALTER TABLE habit_logs 
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
```

## How to Apply

1. **Go to Supabase Dashboard**
2. **SQL Editor** → New Query
3. **Paste the SQL above**
4. **Click "Run"**
5. **Verify**: Should see "Success. No rows returned"

## After Running SQL

1. **User 2**: Try challenging User 1's log again
2. **Check browser console for**: `"Challenge saved successfully for log: xxx"`
3. **User 1**: Hard refresh → Should see red challenge box

## Why This Happened

The schema file (`phase2-schema.sql` line 194) defined:
```sql
ADD COLUMN IF NOT EXISTS challenge_reason TEXT,
```

But the code (`useLogReviews.ts` line 106) uses:
```sql
rejection_reason: reason,
```

**Mismatch = Silent failure**

## Verification Query

After applying fix, run this to verify column exists:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'habit_logs' 
AND column_name = 'rejection_reason';
```

Should return one row.
