## Phase 2 Database Setup Instructions

Follow these steps to set up the Phase 2 database in Supabase:

### Step 1: Update Habits Table
Run this first to add the `is_shared` column:

```bash
supabase/update-habits-shared.sql
```

Go to Supabase Dashboard → SQL Editor → New Query, paste the contents of the file, and run it.

### Step 2: Create Phase 2 Tables
Run the full Phase 2 schema:

```bash
supabase/phase2-schema.sql
```

This will create:
- `partnerships` - stores active/ended partnerships
- `partner_invitations` - manages invite codes
- `log_reviews` - approve/challenge workflow
- `monthly_scores` - monthly point tracking

### Step 3: Verify Setup

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('partnerships', 'partner_invitations', 'log_reviews', 'monthly_scores');
```

You should see all 4 tables listed.

### Step 4: Test Invitations

1. Go to your deployed app
2. Click "Send Invite" in the Partner section
3. Generate an invite code
4. Open a private/incognito window
5. Sign up with a different email
6. Accept the invite using the code
7. Verify partnership created in Supabase

### Notes

- RLS policies are automatically set up for all tables
- All policies follow the principle of least privilege
- Partners can only view shared habits (not private ones)
- Monthly scores reset automatically on the 1st of each month

### Troubleshooting

If you see "permission denied" errors:
1. Check that RLS is enabled on all tables
2. Verify policies are created correctly
3. Make sure the user is authenticated
4. Check browser console for detailed error messages
