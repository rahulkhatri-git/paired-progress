# Partner Profile RLS Fix - Debug Session Summary

## Problem
Users could not see their partner's profile data (name, email, avatar) after accepting partnership invitations. The dashboard showed "Send Invite" / "Accept Invite" buttons instead of displaying the partner's habits, even though the partnership record existed in Supabase.

## Root Cause
The `profiles` table had an overly restrictive RLS policy that only allowed users to view their own profile:

```sql
-- Old policy (broken)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

When the app tried to fetch a partner's profile using their ID, Supabase returned 0 rows because the RLS policy blocked cross-user reads.

## Debug Process

### Evidence from Runtime Logs
1. **Partnership fetch succeeded**: Logs showed partnership records were found with `status: "active"`
2. **Profile fetch failed silently**: No errors in app logs, but Supabase returned 0 rows
3. **PGRST116 error**: "Cannot coerce the result to a single JSON object" - means query returned 0 rows
4. **After RLS fix**: Profile query returned `partnerName: "Rahul Khatri"` successfully

## Solution
Updated the RLS policy to allow users to view their partner's profile when they have an active partnership:

```sql
-- New policy (fixed)
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
```

## Files Changed
1. **supabase/fix-profiles-rls.sql** - New SQL script to fix RLS policy
2. **lib/hooks/usePartnership.ts** - Added fallback for missing profiles (defensive)
3. **supabase/SETUP_PHASE2.md** - Updated setup docs with critical RLS fix step

## Verification
- Before: `partnerHabitsCount: 0`, profile fetch returned 0 rows
- After: `partnerHabitsCount: 4`, `partnerName: "Rahul Khatri"` displayed correctly

## Impact
**Critical fix** - Without this RLS policy update, the core partnership feature is completely non-functional. Users will see the invite UI instead of their partner's habits.

## Date
February 24, 2026
