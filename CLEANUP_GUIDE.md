# Cleanup Guide - Delete Test Users

## Quick Steps

### 1. Identify Test Users
In Supabase Dashboard → SQL Editor, run:
```sql
SELECT id, email, full_name, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

Copy the UUIDs of the 4 test accounts you want to delete.

### 2. Delete User Data
Open `supabase/cleanup-test-users.sql` and replace the placeholder UUIDs:
```sql
DELETE FROM profiles
WHERE id IN (
  'actual-uuid-1',
  'actual-uuid-2',
  'actual-uuid-3',
  'actual-uuid-4'
);
```

Run this in Supabase SQL Editor.

### 3. Delete Auth Accounts
Go to Supabase Dashboard → Authentication → Users

For each test user:
1. Click on the user
2. Click "Delete user" button
3. Confirm deletion

**Why two steps?**
- Step 2 deletes all app data (profiles, habits, logs, partnerships)
- Step 3 removes the authentication account (prevents re-login)

### 4. Verify Cleanup
Run the verification queries at the bottom of `cleanup-test-users.sql` to confirm all data is gone.

## What Gets Deleted (Automatically via CASCADE)

When you delete from `profiles`, these cascade automatically:
- ✅ `habits` (all user's habits)
- ✅ `habit_logs` (all habit completion logs)
- ✅ `partnerships` (any partnerships involving the user)
- ✅ `partner_invitations` (invitations created by the user)
- ✅ `monthly_scores` (points/scores for the user)
- ✅ `log_reviews` (reviews on the user's logs)

## Alternative: Keep One Account for Testing

If you want to keep your main RK account and only delete the 3 extra test accounts, just exclude your main account's UUID from the DELETE statement.

## Safety Tips

1. **Double-check UUIDs** - Make sure you're deleting the right accounts
2. **Backup first** (optional) - If you want to be extra safe, export data first
3. **Test on one account first** - Delete one account, verify it worked, then delete the rest
4. **RK account** - Make sure NOT to include your main account UUID!
