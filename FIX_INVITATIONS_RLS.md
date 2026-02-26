# Partner Invitation RLS Fix

## Problem
Users cannot accept partner invitations because the RLS policy on `partner_invitations` is too restrictive.

### Root Cause
The SELECT policy only allows users to view invitations where:
- They are the inviter (`inviter_id`)
- They already accepted it (`accepted_by`)
- Their email matches `invitee_email`

**But when accepting via invite link/code:**
- New users don't match any of these conditions
- They can't READ the invitation to accept it
- Result: "Invalid or expired invitation code" error

### Evidence from Debug Logs
```json
{"message":"ALL invitations with code (no filters)","data":{"totalAllInvites":0}}
```
Even querying ALL invitations returns 0 rows due to RLS blocking the SELECT.

## Solution
Run the SQL script: `supabase/fix-invitations-rls.sql`

This adds a 4th condition to the SELECT policy:
```sql
OR (status = 'pending' AND code IS NOT NULL)
```

**Why this is safe:**
- Codes are randomly generated (6-char alphanumeric)
- Knowing a code proves you have the invitation
- Only pending invitations are accessible
- Users still need proper permissions to UPDATE/DELETE

## Steps to Fix
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/fix-invitations-rls.sql`
3. Run the script
4. Test: Generate new invite → Accept in incognito window

## Testing
After applying the fix, the logs should show:
```json
{"message":"ALL invitations with code","data":{"totalAllInvites":1,"statuses":["pending"]}}
{"message":"invitation fetch result","data":{"hasInvitation":true}}
{"message":"SUCCESS - partnership created"}
```
