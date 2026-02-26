# Testing: Challenge Fixes & Real-time Score Updates

## Fix 1: User Can Now See Challenges ✅

### Test Case 1: Challenge Visibility on Habit Card
**Steps:**
1. User A logs a shared habit (e.g., "Run 5km")
2. User B challenges it with reason: "No photo proof"
3. **User A's device:** Check habit card
4. **Expected:** Red bordered box shows:
   ```
   ⚠️ Challenged by [Partner Name]
   "No photo proof"
   ```

### Test Case 2: Challenge Visibility in Log History
**Steps:**
1. Continuing from Test Case 1
2. User A clicks History button on the challenged habit
3. **Expected:** Today's log shows red box with:
   - "⚠️ Challenged by Partner"
   - "Reason: 'No photo proof'"

### Test Case 3: Approval Visibility
**Steps:**
1. User A logs a shared habit
2. User B approves it
3. **User A's device:** Check habit card
4. **Expected:** Green bordered box shows:
   ```
   ✓ Approved by [Partner Name] (+1 pt bonus)
   ```

### Test Case 4: Multiple Challenges in History
**Steps:**
1. User A logs shared habits on Mon, Tue, Wed
2. User B challenges Mon & Wed, approves Tue
3. User A opens History modal
4. **Expected:**
   - Mon: Red box "Challenged"
   - Tue: Green box "Approved"
   - Wed: Red box "Challenged"

---

## Fix 2: Real-time Score Updates ✅

### Test Case 5: Challenge Removes Points Immediately
**Steps:**
1. User A has 6 points (2 binary habits logged today, both shared)
2. User B challenges one of them
3. **User A's device (WITHOUT refresh):**
4. **Expected:** Score drops from 6 → 2 points instantly
5. **Expected:** PointsBar updates immediately

### Test Case 6: Approval Adds Points Immediately
**Steps:**
1. User A has 3 points (1 binary habit logged today, shared)
2. User B approves it
3. **User A's device (WITHOUT refresh):**
4. **Expected:** Score increases from 3 → 4 points instantly
5. **Expected:** PointsBar updates immediately

### Test Case 7: Partner Logs Habit (Real-time)
**Steps:**
1. Both users at 6 points each
2. User B logs a new binary habit (shared)
3. **User A's device (WITHOUT refresh):**
4. **Expected:** PointsBar updates to show "User B leads by 3"

### Test Case 8: Cross-device Real-time Updates
**Setup:** User A on mobile, User B on desktop
**Steps:**
1. User A (mobile): Logs habit → 3 points
2. User B (desktop): Challenges it
3. **User A (mobile):** Watch for updates
4. **Expected (within 2-3 seconds):**
   - Challenge badge appears on habit card
   - Score drops to 2 points
   - PointsBar updates

---

## Private Habits & Points (Current Behavior)

### Current Implementation: Private habits award full points ✅

**Test Case 9: Private Habits Award Points**
**Steps:**
1. User A creates private habit (is_shared: false)
2. User A logs it → Earns 3 points
3. **Expected:** Score increases by 3
4. **Partner cannot see this habit or review it**

**Test Case 10: Mix of Private & Shared Habits**
**Steps:**
1. User A: 1 private binary (3pts) + 1 shared binary (3pts) = 6 pts
2. User B: 2 shared binary (6pts)
3. PointsBar: "Tied!"
4. User B challenges User A's shared habit
5. **Expected:** 
   - User A: 5 pts (3 private + 2 shared after -1 penalty)
   - User B: 6 pts
   - PointsBar: "User B leads by 1"

---

## What to Test

### Priority 1: Challenge Visibility ⭐⭐⭐
1. Test Case 1: Challenge badge on habit card
2. Test Case 2: Challenge in history modal
3. Test Case 3: Approval badge

### Priority 2: Real-time Score Updates ⭐⭐⭐
1. Test Case 5: Challenge removes points instantly
2. Test Case 6: Approval adds points instantly
3. Test Case 8: Cross-device updates

### Priority 3: Edge Cases ⭐
1. Multiple challenges in one day
2. Challenge → Delete log → Re-log → Challenge again
3. Network disconnection during challenge

---

## Known Limitations

1. **No Rebuttal System Yet:** User can see challenge but cannot respond
   - Future: Add "Respond" button to provide counter-evidence
   - Future: Add `rebuttals` table for dispute resolution

2. **Real-time Requires Supabase Realtime:** 
   - Ensure Realtime is enabled in Supabase project settings
   - Check browser console for "Subscribed to habit_logs_changes" message

3. **Private Habits Philosophy:**
   - Currently: All habits award full points (simple, fair)
   - Alternative: Could reduce private habit points or cap them
   - Decision deferred to user feedback
