-- Run this in Supabase SQL Editor to check actual column names

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'habit_logs' 
AND column_name LIKE '%reason%'
ORDER BY column_name;
