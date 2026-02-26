# URGENT: Challenge Not Showing - Debug Steps

## Run This SQL Query in Supabase

**Replace `USER_1_ID` with User 1's actual UUID:**

```sql
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
```

## What to Check

### 1. Is `reviewed_by` populated?
**Expected:** Should have User 2's UUID
**If NULL:** Challenge didn't save properly - check `useLogReviews` hook

### 2. Is `approved` set to `false`?
**Expected:** `approved = false` for challenge
**If NULL or TRUE:** Challenge logic failed

### 3. Is `rejection_reason` populated?
**Expected:** Should have the challenge reason text
**If NULL:** Reason wasn't saved

### 4. Is the habit `is_shared = true`?
**Expected:** `is_shared = true`
**If FALSE:** Can't challenge private habits

## Common Issues

### Issue 1: Vercel Not Deployed Yet
**Check:** https://vercel.com → Latest commit should be `92195a3`
**Solution:** Wait for deployment or trigger manual deploy

### Issue 2: Browser Cache
**Check:** Press `Cmd + Shift + R` (hard refresh)
**Solution:** Clear browser cache completely

### Issue 3: React State Not Refreshing
**Check browser console:**
```
Look for: "Habit log changed" or "Partner log changed"
```
**If not showing:** Realtime not working - check Supabase Realtime settings

### Issue 4: Wrong User ID
**Verify in browser console:**
```javascript
// Open console (F12) on User 1's dashboard
// Run this:
await (await fetch('/.netlify/functions/auth')).json()
// Or check Network tab for user_id in requests
```

## Expected Behavior

**When User 2 challenges User 1's log:**
1. Database: `habit_logs` row updates with `reviewed_by`, `approved=false`, `rejection_reason`
2. User 1's browser: Realtime subscription fires
3. `refetchScores()` and `refetchLogs()` called
4. HabitCard re-renders with red challenge box

## Quick Test

**On User 1's browser console:**
```javascript
// Check if todayLog has challenge data
const logs = await supabase.from('habit_logs').select('*').eq('log_date', new Date().toISOString().split('T')[0])
console.log('Today logs:', logs.data)
// Look for reviewed_by, approved, rejection_reason fields
```

## Manual Verification

1. **Go to Supabase Dashboard** → Table Editor → `habit_logs`
2. **Find today's log for User 1**
3. **Check these columns:**
   - `requires_review`: should be `true`
   - `reviewed_by`: should have User 2's UUID
   - `approved`: should be `false`
   - `rejection_reason`: should have text

If ALL these are correct but UI still doesn't show → **It's a frontend cache/deployment issue**

## Force Deployment

```bash
git commit --allow-empty -m "force deploy"
git push origin main
```
