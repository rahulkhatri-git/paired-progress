# Edge Function Deployment Guide

## Problem
User can still log in after deleting account because the Supabase Auth user isn't deleted (only app data is deleted).

## Solution
Deploy the `delete-account` Edge Function that uses service role key to delete both profile and auth account.

---

## Option 1: Manual Deployment via Supabase Dashboard (EASIEST)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   - Click "Edge Functions" in the left sidebar

2. **Create New Function**
   - Click "Create a new function"
   - Name: `delete-account`
   - Click "Create function"

3. **Copy the Code**
   - Open `supabase/functions/delete-account/index.ts`
   - Copy ALL the code
   - Paste it into the editor in Supabase Dashboard

4. **Deploy**
   - Click "Deploy function"
   - Wait for deployment to complete

5. **Test**
   - Try deleting an account from the app
   - User should NOT be able to log back in

---

## Option 2: Install Supabase CLI

### Fix Homebrew Permissions First
```bash
sudo chown -R $(whoami) /opt/homebrew/Cellar
```

### Then Install Supabase CLI
```bash
brew install supabase/tap/supabase
```

### Deploy Function
```bash
cd /Users/rahulk/Documents/paired-progress
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy delete-account
```

---

## Option 3: Use NPM (if brew fails)

```bash
npm install -g supabase
cd /Users/rahulk/Documents/paired-progress
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy delete-account
```

---

## Verification

After deployment, test:
1. Go to Profile & Settings → Danger Zone
2. Click "Delete Account"
3. Type "DELETE" and confirm
4. Try logging back in - should fail with "Invalid login credentials"

---

## What the Edge Function Does

```typescript
// 1. Verifies user is authenticated
// 2. Deletes profile (cascades to habits, logs, partnerships)
// 3. Deletes auth account using service role key
// 4. Returns success
```

**Why we need it:** Client-side code cannot delete auth users (requires service role key). The Edge Function runs server-side with proper permissions.
