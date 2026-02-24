# Photo Upload Fix - Supabase Storage Setup

## Issue
Photo uploads are failing with: `StorageApiError: new row violates row-level security policy`

## Root Cause
Row Level Security (RLS) is blocking uploads. Even "public" buckets have RLS enabled by default.

## ✅ SOLUTION: Disable RLS or Add Policies

### Option 1: Disable RLS (Quickest - Recommended for Development)

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Disable RLS on storage.objects for the habit-photos bucket
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

**OR** if you want to keep RLS enabled for other buckets but allow all operations on `habit-photos`:

```sql
-- Allow all operations on habit-photos bucket
CREATE POLICY "Allow all operations on habit-photos"
ON storage.objects
FOR ALL
USING (bucket_id = 'habit-photos');
```

### Option 2: Add Specific Policies (Better for Production)

If you want fine-grained control, go to SQL Editor and run:

```sql
-- Policy 1: Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload to habit-photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'habit-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow everyone to view photos
CREATE POLICY "Anyone can view habit-photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'habit-photos');

-- Policy 3: Allow users to update their own photos
CREATE POLICY "Users can update their habit-photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'habit-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow users to delete their own photos  
CREATE POLICY "Users can delete their habit-photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'habit-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

## Solution

### Step 1: Create Storage Bucket
1. Go to your Supabase Dashboard: https://foustpjpxeuonbsdwyxj.supabase.co
2. Click on **Storage** in the left sidebar
3. Click **"New bucket"** or **"Create a new bucket"**
4. Configure the bucket:
   - **Name**: `habit-photos`
   - **Public bucket**: ✅ Check this (or configure RLS policies)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: `image/*` (or leave empty for all types)

### Step 2: Set Up Row Level Security (RLS) Policies (OPTIONAL - Skip if bucket is public)

**⚠️ IMPORTANT: If you made the bucket PUBLIC in Step 1, SKIP THIS STEP! Public buckets don't need policies.**

Only follow this if you want more control with a private bucket:

#### Option A: Using SQL Editor (Recommended)
Go to SQL Editor in Supabase and run this:

```sql
-- Policy 1: Allow authenticated users to upload
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'habit-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow public read access
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'habit-photos');

-- Policy 3: Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'habit-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Option B: Using Policy Editor UI
If adding via Storage → Policies → New Policy, use ONLY the expressions:

**Policy 1 (INSERT):**
- WITH CHECK expression:
```sql
bucket_id = 'habit-photos' 
AND (storage.foldername(name))[1] = auth.uid()::text
```

**Policy 2 (SELECT):**
- USING expression:
```sql
bucket_id = 'habit-photos'
```

**Policy 3 (DELETE):**
- USING expression:
```sql
bucket_id = 'habit-photos' 
AND (storage.foldername(name))[1] = auth.uid()::text
```

### Step 3: Verify
1. Try uploading a photo through the app
2. Check the Storage section in Supabase to see if the file appears
3. If you see clearer error messages now, follow them to debug

## ✅ Recommended: Quick Public Bucket Setup (You're Done!)

**Since you already have a public bucket, you're all set!** Just test the upload:

1. ✅ Bucket named `habit-photos` - DONE
2. ✅ "Public bucket" checked - DONE
3. 🧪 Test photo upload in your app

That's it! No policies needed for public buckets.

## Troubleshooting

**Error: "Bucket not found"**
- Make sure the bucket name is exactly `habit-photos` (lowercase, with hyphen)

**Error: "Permission denied"**
- If using RLS, make sure the policies are correctly applied
- Or simply make the bucket public for now

**Error: "File too large"**
- Increase file size limit in bucket settings
- Or compress images before upload (can add this to the app later)
