-- Run this in Supabase SQL Editor to check if challenge data exists
-- Replace USER_1_ID with actual User 1's ID

SELECT 
  h.name as habit_name,
  h.is_shared,
  hl.log_date,
  hl.completed,
  hl.requires_review,
  hl.reviewed_by,
  hl.approved,
  hl.rejection_reason,
  hl.reviewed_at,
  p.full_name as reviewer_name
FROM habit_logs hl
JOIN habits h ON h.id = hl.habit_id
LEFT JOIN profiles p ON p.id = hl.reviewed_by
WHERE hl.user_id = 'USER_1_ID'
  AND hl.log_date = CURRENT_DATE
ORDER BY hl.created_at DESC;
