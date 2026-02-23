# Testing Guide for Paired Progress MVP

## Prerequisites
- Supabase project set up (see SUPABASE_SETUP.md)
- Environment variables configured in `.env.local`
- Dev server running on http://localhost:3001

## Test Checklist

### 1. Authentication Flow
- [ ] **Sign Up**
  - Go to http://localhost:3001
  - Click "Start Free"
  - Enter name, email, password
  - Should redirect to onboarding
  
- [ ] **Verify in Supabase**
  - Go to Supabase dashboard → Table Editor → profiles
  - Your user should appear with correct email and name
  
- [ ] **Sign Out**
  - Go to Profile & Settings
  - Click "Sign Out"
  - Should redirect to landing page
  
- [ ] **Sign In**
  - Click "Start Free" again
  - Enter same email/password
  - Should go straight to dashboard (skip onboarding)

### 2. Habit Creation
- [ ] **Create Binary Habit**
  - Click the "+" FAB button
  - Name: "Meditation"
  - Type: Binary
  - Fill in "Why" and optionally upload photo
  - Click "Create Habit"
  - Should appear in dashboard

- [ ] **Create Tiered Habit**
  - Click "+" again
  - Name: "Morning Walk"
  - Type: Tiered
  - Bronze: 5000, Silver: 8000, Gold: 10000
  - Unit: steps
  - Click "Create Habit"
  - Should appear in dashboard
  
- [ ] **Verify in Supabase**
  - Go to Supabase → Table Editor → habits
  - Both habits should appear with correct data

### 3. Habit Logging
- [ ] **Log Binary Habit**
  - Click on a binary habit card
  - Should show completion checkmark
  - Select mood (optional)
  - Upload photo (optional)
  - Click "Log Habit"
  - Card should update to show completed
  
- [ ] **Log Tiered Habit**
  - Click on a tiered habit card
  - Enter value (e.g., 7500)
  - Should show Silver tier reached
  - Select mood
  - Upload photo
  - Click "Log Habit"
  - Card should show progress and tier badge
  
- [ ] **Try Logging Same Habit Twice**
  - Try to log the same habit again
  - Should get error: "You have already logged this habit today"
  
- [ ] **Verify in Supabase**
  - Go to Supabase → Table Editor → habit_logs
  - Your logs should appear
  - Check `tier_achieved`, `emotion`, `photo_url` fields
  
- [ ] **Check Photo Upload**
  - Go to Supabase → Storage → habit-photos
  - Your uploaded photos should be there

### 4. Profile Settings
- [ ] **Load Settings**
  - Go to Profile & Settings
  - Settings should load from database
  
- [ ] **Toggle Notifications**
  - Toggle "Daily reminders" off
  - Should see "Settings saved!" toast
  - Refresh page
  - Setting should still be off (persisted)
  
- [ ] **Change Forgiveness Days**
  - Click + to increase to 2
  - Should save automatically
  - Refresh page
  - Should still be 2
  
- [ ] **Verify in Supabase**
  - Go to Supabase → Table Editor → profiles
  - Your profile should show updated settings
  
- [ ] **Export Data**
  - Click "Export My Data"
  - JSON file should download
  - Open it - should contain your profile, habits, and logs

### 5. Dashboard Features
- [ ] **Week Navigation**
  - Click left/right arrows in header
  - Week label should change
  - Habit completion checkmarks should update
  
- [ ] **Empty States**
  - If you have no habits, should show "Create your first habit"
  - Partner section shows "Coming soon" (Phase 2 feature)
  
- [ ] **Points Display**
  - Top bar should show points (currently mock data)
  - Will be real in future iteration

### 6. Error Handling
- [ ] **Invalid Login**
  - Try logging in with wrong password
  - Should show error toast
  
- [ ] **Network Error Simulation**
  - Turn off internet
  - Try creating a habit
  - Should show error toast
  - Turn internet back on
  
- [ ] **Missing Required Fields**
  - Try creating habit without name
  - "Create Habit" button should be disabled

### 7. Mobile Responsiveness
- [ ] **Resize Browser**
  - Make window narrow (mobile width)
  - Dashboard should stack vertically
  - All modals should fit on screen
  - FAB button should be accessible

## Expected Results Summary

✅ **Authentication works end-to-end**  
✅ **Habits save to database**  
✅ **Logs save with photos and emotions**  
✅ **Settings persist in database**  
✅ **Data export works**  
✅ **No console errors**  
✅ **Mobile responsive**

## Common Issues & Fixes

### "Invalid API key"
- Check `.env.local` has correct keys
- Restart dev server after changing `.env.local`

### "relation profiles does not exist"
- Run the schema.sql in Supabase SQL Editor

### Photos don't upload
- Check `habit-photos` bucket exists in Supabase Storage
- Make sure bucket is public OR has RLS policies

### Settings don't save
- Check browser console for errors
- Verify profiles table has notification columns

## Ready for Deployment?

If all tests pass:
- ✅ Authentication working
- ✅ Habits CRUD working
- ✅ Logging working with photos
- ✅ Settings persisting
- ✅ No critical errors

**You're ready to deploy to Vercel!**

See deployment instructions below:

```bash
# 1. Push to GitHub
git add .
git commit -m "Production-ready MVP"
git push

# 2. Deploy on Vercel
# Visit vercel.com and import your GitHub repo
# Add environment variables in Vercel dashboard
# Deploy!
```
