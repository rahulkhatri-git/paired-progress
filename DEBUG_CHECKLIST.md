# Debug Checklist: Why You Don't See Changes

## 1. Check Vercel Deployment Status ⏱️

**Go to:** https://vercel.com/rahulkhatri-gits-projects/paired-progress/deployments

**Look for:**
- Latest commit: `01b6183` - "fix: show challenge status to user + real-time score updates"
- Status: Should be "Ready" (green checkmark)
- If still "Building" → Wait 1-2 minutes
- If "Error" → Check build logs

## 2. Hard Refresh Browser 🔄

**Chrome/Edge:** `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
**Safari:** `Cmd + Option + R`

**Why:** Vercel/CDN caching might serve old JavaScript bundle

## 3. Verify You Have Test Data 🧪

**The changes ONLY show if:**
- You have a **shared habit** (is_shared: true)
- You **logged it today**
- Your **partner challenged** it

**To test:**
1. User A: Create/log a shared habit
2. User B: See "Can Review" button → Click → Challenge with reason
3. User A: Refresh → Should see red "⚠️ Challenged" box

## 4. Check Console for Real-time Subscription 🔌

**Open browser console (F12):**
```
Look for: "Subscribed to habit_logs_changes"
```

If you don't see this, Supabase Realtime might not be enabled.

**Enable Realtime:**
1. Go to Supabase Dashboard
2. Settings → Database → Replication
3. Enable replication for `habit_logs` table

## 5. Quick Test Scenario 📝

**User A (You):**
1. Go to dashboard: https://paired-progress.vercel.app/dashboard
2. Create a shared habit: "Test Habit" (toggle "Share with partner")
3. Log it today

**User B (Partner):**
1. Go to dashboard
2. See "Test Habit" in partner section
3. Click "Can Review" → Challenge with reason: "Testing"

**User A (Back to you):**
1. Hard refresh (Cmd+Shift+R)
2. **Expected:** Red box on "Test Habit" card:
   ```
   ⚠️ Challenged by [Partner Name]
   "Testing"
   ```
3. Click History button → Should see challenge in log history

## 6. What Deployment ID to Check

**Latest commit should be:** `01b6183`

**If Vercel shows older commit:**
- Check GitHub: https://github.com/rahulkhatri-git/paired-progress/commits/main
- Should see 3 recent commits:
  - `01b6183` - fix: show challenge status
  - `f426332` - feat: immediate score refresh
  - `e477d86` - fix: binary = 3pts

**If commits are there but Vercel hasn't deployed:**
- Trigger manual deploy in Vercel dashboard
- Or: Make a trivial commit (add space to README)

## 7. Current Database State

**Check if you have challenged logs in Supabase:**

```sql
SELECT 
  hl.id,
  hl.log_date,
  hl.reviewed_by,
  hl.approved,
  hl.rejection_reason,
  h.name as habit_name
FROM habit_logs hl
JOIN habits h ON h.id = hl.habit_id
WHERE hl.user_id = 'YOUR_USER_ID'
  AND hl.reviewed_by IS NOT NULL
ORDER BY hl.log_date DESC
LIMIT 10;
```

If no results → You haven't been challenged yet, create test scenario above.

## 8. Known Issue: Local Dev Server

The local dev server (port 3001) fails due to `uv_interface_addresses` error.
This is a known Node.js/Next.js issue on some systems.

**Solution:** Test on Vercel deployment instead of local.
