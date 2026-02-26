# Review Workflow Testing Guide

## ✅ What Was Implemented

The Review/Approve Workflow allows partners to review each other's habit logs and provide accountability through approvals or challenges.

### Features Built:
1. **`useLogReviews` hook** - Backend logic for approving/challenging logs
2. **`ReviewLogModal` component** - Full-featured review UI
3. **"Needs Review" badge** - Shows on partner habit cards when logs need review
4. **Review button** - One-click access to review modal
5. **Approved/Challenged status** - Shows outcome after review

---

## 🧪 How to Test

### Prerequisites:
- Two user accounts in partnership
- User 2 should have at least one shared habit
- User 2 should log that habit today

### Test 1: See "Needs Review" Badge

1. **As User 2** (partner):
   - Go to dashboard
   - Log a habit (any tier or binary completion)
   - Note: Habit logs require review by default

2. **As User 1** (reviewer):
   - Refresh dashboard
   - Look at partner section (right side)
   - Should see "⚠️ Needs Your Review" badge on partner's habit card
   - Should see yellow "Review Log" button

**Expected:**
- [ ] Badge appears on partner habit card
- [ ] Button says "Review Log" with eye icon
- [ ] Card has amber/yellow styling

---

### Test 2: Approve a Log

1. **As User 1**, click "Review Log" button
2. **Review Modal opens** showing:
   - Partner's name
   - Habit name
   - What they logged (tier/value)
   - Time logged
   - Emotion (if provided)
   - Note (if provided)
   - Photo (if uploaded)

3. Click "Approve & Award Point" button

**Expected:**
- [ ] Modal shows all log details correctly
- [ ] Toast appears: "Log approved!"
- [ ] Modal closes
- [ ] Partner habit card updates to show "✓ Approved" (green badge)
- [ ] "Needs Review" badge disappears

---

### Test 3: Challenge a Log

1. **As User 2**, log another habit (or same habit next day)
2. **As User 1**, click "Review Log" on the new log
3. In review modal, click "Challenge This Log" (red button)
4. **Challenge form appears**:
   - Text area for reason
   - "Submit Challenge" button
5. Enter reason: "Photo doesn't show full workout"
6. Click "Submit Challenge"

**Expected:**
- [ ] Challenge mode shows text area
- [ ] Can't submit without reason
- [ ] Toast appears: "Challenge submitted"
- [ ] Modal closes
- [ ] Partner habit card shows "✗ Challenged" (red badge)
- [ ] "Needs Review" badge disappears

---

### Test 4: View Challenge Reason (User 2 Perspective)

1. **As User 2**, refresh dashboard
2. Look at your habit that was challenged
3. Should see some indication of challenge

**Expected:**
- [ ] User 2 can see their log was challenged
- [ ] Challenge reason is visible (future enhancement)

---

### Test 5: Multiple Logs in One Day

1. **As User 2**, have multiple shared habits
2. Log all of them today
3. **As User 1**, check partner section

**Expected:**
- [ ] Each logged habit shows "Needs Review" badge
- [ ] Can review each one individually
- [ ] Approving one doesn't affect others

---

### Test 6: Already Reviewed Logs

1. **As User 1**, approve a log
2. Refresh page
3. Look at same habit card

**Expected:**
- [ ] "✓ Approved" badge persists
- [ ] "Review Log" button no longer appears
- [ ] Can't review same log twice

---

### Test 7: Challenge Mode - Cancel

1. **As User 1**, open review modal
2. Click "Challenge This Log"
3. Start typing reason
4. Click "Cancel" button

**Expected:**
- [ ] Returns to review mode
- [ ] Challenge text is cleared
- [ ] Can still approve or challenge again

---

### Test 8: Modal Info Text

Check the information notes in the modal:

**Review Mode:**
> "Approved logs earn an extra accountability point. Challenges help maintain habit standards."

**Challenge Mode:**
> "Challenges are final. Your partner will be notified and this log won't count toward their score."

**Expected:**
- [ ] Info text is clear and helpful
- [ ] Explains consequences of actions

---

### Test 9: Edge Cases

**No Photo When Required:**
- If habit requires photo but log has no photo
- Should still be able to review/challenge

**Binary vs Tiered:**
- Binary habits show "✓ Complete"
- Tiered habits show tier emoji (🥉🥈🥇) + value
- Both can be reviewed

**Partner Name Display:**
- Modal should show partner's actual name (e.g., "Rahul")
- Not generic "Partner"

---

## 🐛 Known Limitations (Not Bugs)

1. **No Real-time** - Need to refresh to see updated review status
2. **Points Not Calculated** - Points system not implemented yet (Phase 2, next feature)
3. **No Notification** - User 2 doesn't get notified of challenges yet
4. **Challenge Reason Not Visible** - User 2 can't see challenge reason yet (UI enhancement needed)

---

## ✅ Test Results

### Passing Tests:
```
Test 1 (Badge visibility): 
Test 2 (Approve log): 
Test 3 (Challenge log): 
Test 4 (View challenge): 
Test 5 (Multiple logs): 
Test 6 (Already reviewed): 
Test 7 (Cancel challenge): 
Test 8 (Info text): 
Test 9 (Edge cases): 
```

### Issues Found:
```
1. ________________________________
2. ________________________________
3. ________________________________
```

---

## 📊 Success Criteria

Review Workflow is working if:
- [ ] "Needs Review" badge shows on unreviewed logs
- [ ] Review button opens modal with correct details
- [ ] Can approve logs successfully
- [ ] Can challenge logs with reason
- [ ] Approved/challenged status persists
- [ ] Can't review same log twice
- [ ] Review button disappears after review

---

## 🚀 After Testing

Report results and any bugs found. Once confirmed working, we can proceed to:

**Next Feature: Monthly Points System**
- Calculate points based on completions + reviews
- Display scores in PointsBar
- Track monthly leaderboard

---

**Test Date:** _____________  
**Tester:** _____________  
**Result:** PASS / FAIL / PARTIAL
