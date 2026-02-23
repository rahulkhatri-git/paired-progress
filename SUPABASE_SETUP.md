# Supabase Setup Guide

Follow these steps to set up your Supabase backend for Paired Progress.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: paired-progress (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for MVP
5. Click "Create new project"
6. Wait 2-3 minutes for database provisioning

## Step 2: Get API Keys

1. In your project dashboard, click the **Settings** icon (gear) in the sidebar
2. Click **API** under Project Settings
3. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)
   - **service_role** key (click "Reveal" - keep this secret!)

## Step 3: Configure Environment Variables

1. Open `/Users/rahulk/Documents/paired-progress/.env.local`
2. Replace the placeholder values with your actual keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

3. Save the file

## Step 4: Run Database Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query** button
3. Open the file: `/Users/rahulk/Documents/paired-progress/supabase/schema.sql`
4. Copy ALL the contents
5. Paste into the Supabase SQL Editor
6. Click **Run** (or press Cmd+Enter)
7. You should see "Success. No rows returned"

This creates:
- ✅ `profiles` table (user profiles)
- ✅ `habits` table (habit definitions)
- ✅ `habit_logs` table (daily habit tracking)
- ✅ Row Level Security policies
- ✅ Auto-trigger to create profile on signup
- ✅ Enums for habit types, priorities, emotions, tiers

## Step 5: Set Up Storage for Photos

1. In Supabase dashboard, click **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Fill in:
   - **Name**: `habit-photos`
   - **Public bucket**: Toggle ON (or set RLS policies if you want private)
4. Click **Save**

### Optional: Configure Storage RLS Policies

If you want private photo storage with user-level access:

1. Go to Storage > **habit-photos** > Policies
2. Add policy for INSERT:
```sql
create policy "Users can upload own photos"
on storage.objects for insert
with check (bucket_id = 'habit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

3. Add policy for SELECT:
```sql
create policy "Users can view own photos"
on storage.objects for select
using (bucket_id = 'habit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 6: Verify Setup

1. Restart your Next.js dev server:
```bash
cd /Users/rahulk/Documents/paired-progress
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)
3. Click "Start Free" and create an account
4. If signup works without errors, you're good!

## Step 7: Check Database

1. Go to Supabase dashboard > **Table Editor**
2. You should see:
   - `profiles` table with your new user
   - `habits` table (empty for now)
   - `habit_logs` table (empty for now)

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the FULL anon key (it's very long)
- Make sure there are no spaces before/after the key in `.env.local`
- Restart the dev server after changing `.env.local`

### "relation profiles does not exist"
- You didn't run the schema SQL
- Go back to Step 4 and run the full schema

### Profile not created on signup
- Check Supabase dashboard > **Database** > **Functions**
- Verify `handle_new_user` function exists
- Check **Database** > **Triggers** for `on_auth_user_created`

### Storage bucket not found
- Make sure you created the `habit-photos` bucket (Step 5)
- Check spelling - it must be exactly `habit-photos`

## Next Steps

Once setup is complete:
1. ✅ Authentication working
2. ✅ Database tables created
3. ✅ Storage bucket ready
4. 🔄 Now you can create habits and log them!

## Security Notes

- **Never commit `.env.local`** to git (it's in `.gitignore`)
- The `anon` key is safe to expose in frontend code
- The `service_role` key should NEVER be in frontend code (only use in API routes)
- Row Level Security (RLS) ensures users can only access their own data
