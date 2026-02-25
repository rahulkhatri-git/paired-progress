# Phase 2 Testing Checklist - Current Implementation

**Date:** February 24, 2026  
**Testing URL:** https://paired-progress.vercel.app/dashboard

---

## 🎯 What We're Testing

These features are already implemented and deployed:
1. ✅ Partner invitation system
2. ✅ Partnership creation and display
3. ✅ Partner habit visibility
4. ✅ Habit privacy controls (shared/private)
5. ✅ Partner profile display

---

## 🧪 Test Scenarios

### Test 1: Partnership Display ✅
**Goal:** Verify existing partnership shows correctly

**Steps:**
1. Go to https://paired-progress.vercel.app/dashboard
2. Log in as User 1 (existing partnership)

**Expected Results:**
- [ ] PointsBar shows "You vs [Partner Name]" at top
- [ ] Partner section on right shows "[Partner Name]'s Habits"
- [ ] Partner's habits are visible (read-only cards)
- [ ] Partner habit cards show completion status
- [ ] NO "Send Invite" or "Accept Invite" buttons (you're already partnered)

**Actual Results:**
```
PointsBar: ___________________________
Partner name displayed: _______________
Number of partner habits visible: _____
```

---

### Test 2: Habit Privacy - Create Shared Habit
**Goal:** Verify shared habits are visible to partner

**Steps:**
1. As User 1, click "Create Habit" button
2. Fill in habit details:
   - Name: "Test Shared Habit"
   - Type: Binary or Tiered (your choice)
3. **IMPORTANT:** Ensure "Share with partner" toggle is ON (green)
4. Click Create

**Switch to Partner Account:**
5. Open incognito window or different browser
6. Log in as User 2 (the partner)
7. Go to dashboard

**Expected Results:**
- [ ] Toggle was ON by default when creating
- [ ] "Test Shared Habit" appears in User 2's partner section
- [ ] Habit card shows User 1's name
- [ ] Card is read-only (no edit/delete buttons)

**Actual Results:**
```
Shared habit visible to partner: YES / NO
Partner can see habit name: __________
```

---

### Test 3: Habit Privacy - Create Private Habit
**Goal:** Verify private habits are hidden from partner

**Steps:**
1. As User 1, click "Create Habit" again
2. Fill in habit details:
   - Name: "Test Private Habit"
   - Type: Binary or Tiered (your choice)
3. **IMPORTANT:** Turn OFF "Share with partner" toggle (gray)
4. Click Create

**Verify in Your View:**
5. Check your own habits list
6. Verify "Test Private Habit" appears in YOUR habits section

**Switch to Partner Account:**
7. Go to User 2's dashboard
8. Look at the partner section

**Expected Results:**
- [ ] "Test Private Habit" appears in YOUR habits (User 1)
- [ ] "Test Private Habit" does NOT appear in User 2's partner section
- [ ] Only "Test Shared Habit" is visible to partner

**Actual Results:**
```
Private habit visible in your view: YES / NO
Private habit visible to partner: YES / NO
Only shared habits visible to partner: YES / NO
```

---

### Test 4: Edit Habit - Change Privacy
**Goal:** Verify toggling privacy updates partner's view

**Steps:**
1. As User 1, find "Test Private Habit" in your habits
2. Click the edit button (pencil icon)
3. In the Edit modal, find "Share with partner" toggle
4. Turn it ON (green)
5. Click Save

**Switch to Partner:**
6. Go to User 2's dashboard
7. Refresh if needed (or wait for real-time update)

**Expected Results:**
- [ ] Edit modal has "Share with partner" toggle
- [ ] After turning ON, habit now appears in User 2's partner section
- [ ] "Test Private Habit" is now visible to partner

**Now Test Reverse:**
8. As User 1, edit "Test Shared Habit"
9. Turn OFF "Share with partner" toggle
10. Save changes
11. Check User 2's dashboard

**Expected Results:**
- [ ] After turning OFF, habit disappears from User 2's partner section
- [ ] "Test Shared Habit" no longer visible to partner

**Actual Results:**
```
Can toggle privacy in Edit modal: YES / NO
Partner sees habit after sharing: YES / NO
Partner stops seeing after unsharing: YES / NO
```

---

### Test 5: Partner Habit Details Display
**Goal:** Verify partner habit cards show correct information

**Steps:**
1. As User 1, create a tiered habit (if you don't have one):
   - Name: "Workout"
   - Type: Tiered
   - Bronze: 20 min, Silver: 30 min, Gold: 45 min
   - Share with partner: ON
2. Log this habit with Silver tier (30 minutes)

**Switch to Partner:**
3. Go to User 2's dashboard
4. Look at the partner habit card for "Workout"

**Expected Results:**
- [ ] Habit name "Workout" is displayed
- [ ] Shows completion status (checkmark if logged today)
- [ ] Shows tier badges (Bronze, Silver, Gold)
- [ ] If logged, shows which tier achieved (Silver highlighted)
- [ ] Shows progress value (e.g., "30 min")
- [ ] Card is read-only (no log button)

**Actual Results:**
```
Habit name visible: ___________________
Completion status shown: YES / NO
Tier information displayed: YES / NO
Logged value visible: _________________
```

---

### Test 6: Multiple Habits Visibility
**Goal:** Verify mix of shared/private habits work correctly

**Steps:**
1. As User 1, ensure you have:
   - At least 2 shared habits
   - At least 1 private habit

2. Count your habits:
   - Your view: Total habits = _____
   - Shared habits = _____
   - Private habits = _____

**Switch to Partner:**
3. Go to User 2's dashboard
4. Count habits in partner section

**Expected Results:**
- [ ] User 2 sees only the shared habits count (not private)
- [ ] Number of partner habits = number of User 1's shared habits
- [ ] Private habits are completely invisible to partner

**Actual Results:**
```
User 1 total habits: _____
User 1 shared habits: _____
User 2 sees partner habits: _____
Match shared count: YES / NO
```

---

### Test 7: Profile Settings - Partnership Info
**Goal:** Verify partnership details in profile

**Steps:**
1. As User 1, click profile icon (top right)
2. Look for "Partnership" or "Linked with" section

**Expected Results:**
- [ ] Shows partner's name (e.g., "Linked with Rahul Khatri")
- [ ] Shows duration (e.g., "Together for X days")
- [ ] Shows partner's initial/avatar
- [ ] Has "Unlink Partner" option (don't click it!)

**Actual Results:**
```
Partner name displayed: _______________
Duration shown: _______________________
Unlink option available: YES / NO
```

---

### Test 8: PointsBar Display
**Goal:** Verify PointsBar shows both users

**Steps:**
1. Look at the top of dashboard

**Expected Results:**
- [ ] PointsBar is visible at top
- [ ] Shows "You" with your name
- [ ] Shows "vs" in middle
- [ ] Shows partner's name
- [ ] Currently shows 0 pts for both (points system not implemented yet)

**Actual Results:**
```
PointsBar visible: YES / NO
Your name shown: ______________________
Partner name shown: ___________________
Points displayed: YES / NO (should be 0/0)
```

---

### Test 9: Empty State - No Shared Habits
**Goal:** Verify what partner sees when you have no shared habits

**Steps:**
1. As User 1, edit ALL your habits
2. Turn OFF "Share with partner" for all habits
3. Save changes

**Switch to Partner:**
4. Go to User 2's dashboard
5. Look at partner section

**Expected Results:**
- [ ] Partner section shows empty state
- [ ] Message like "No shared habits yet" or similar
- [ ] Does NOT show your private habits

**Restore:**
6. Turn sharing back ON for at least one habit

**Actual Results:**
```
Empty state shown: YES / NO
Message displayed: ____________________
Private habits remain hidden: YES / NO
```

---

### Test 10: New User Flow (Optional)
**Goal:** Test full invitation flow with fresh accounts

**Prerequisites:** You need a second email address

**Steps:**
1. As User 1 (existing user), go to dashboard
2. Click "Send Invite" button (if you see it - you might not if already partnered)
3. Generate invite code
4. Copy the code (e.g., "ABC123")

**New User:**
5. Open incognito window
6. Go to https://paired-progress.vercel.app
7. Sign up with NEW email
8. After signup, look at dashboard

**Expected Results:**
- [ ] New user sees "Accept Invite" button on empty partner section
- [ ] Click "Accept Invite"
- [ ] Enter the 6-character code
- [ ] Partnership is created
- [ ] New user now sees User 1's shared habits

**Note:** Only test this if you want to create a new partnership. Skip if testing with existing partnership.

**Actual Results:**
```
Invite flow completed: YES / NO / SKIPPED
New user sees habits: YES / NO / SKIPPED
```

---

## 📝 Test Results Summary

Fill this out after completing tests:

### ✅ Passing Tests
List test numbers that passed:
```
Test #: _____ (description)
Test #: _____ (description)
```

### ❌ Failing Tests
List any issues found:
```
Test #: _____ 
Issue: ________________________________
Expected: _____________________________
Actual: _______________________________
```

### 🐛 Bugs Discovered
Any unexpected behavior:
```
1. ___________________________________
2. ___________________________________
3. ___________________________________
```

---

## 🎯 Success Criteria

Phase 2 current features are working if:
- [ ] Partner's name displays correctly
- [ ] Shared habits visible to partner
- [ ] Private habits hidden from partner
- [ ] Can toggle habit privacy in Create/Edit modals
- [ ] Partner habit cards are read-only
- [ ] PointsBar shows both users (even if scores are 0)
- [ ] Profile shows partnership info

---

## 📸 Optional: Screenshots

If you encounter issues, take screenshots of:
1. Dashboard with partner section
2. Create Habit modal (showing toggle)
3. Edit Habit modal (showing toggle)
4. Profile settings (partnership section)
5. Partner habit cards

Save to: `/screenshots/phase2-testing/`

---

## 🚀 After Testing

Once testing is complete:
1. Report results (passing/failing tests)
2. List any bugs or issues found
3. Confirm if ready to proceed with Review Workflow implementation
4. Or request fixes for any failing tests

---

**Testing Started:** _____________ (date/time)  
**Testing Completed:** _____________ (date/time)  
**Tester:** _____________  
**Overall Result:** PASS / FAIL / PARTIAL
