# Testing: Immediate Score Refresh After Logging

## Test Case 1: Binary Habit Logging
**Steps:**
1. User has 0 points initially
2. Create a binary habit (e.g., "Meditate")
3. Log the binary habit for today
4. **Expected**: Score updates from 0 → 3 points immediately (without page refresh)

## Test Case 2: Tiered Habit - Bronze Tier
**Steps:**
1. User has 0 points initially
2. Create a tiered habit (e.g., "Run" with bronze: 5km, silver: 10km, gold: 15km)
3. Log 5km (bronze tier)
4. **Expected**: Score updates from 0 → 1 point immediately

## Test Case 3: Tiered Habit - Silver Tier
**Steps:**
1. Continuing from Test Case 2 (user has 1 point)
2. Edit the log and change value to 10km (silver tier)
3. **Expected**: Score updates from 1 → 2 points immediately

## Test Case 4: Tiered Habit - Gold Tier
**Steps:**
1. Continuing from Test Case 3 (user has 2 points)
2. Edit the log and change value to 15km (gold tier)
3. **Expected**: Score updates from 2 → 3 points immediately

## Test Case 5: Multiple Habits in Same Day
**Steps:**
1. User has 0 points initially
2. Log binary habit #1 → **Expected**: 0 → 3 points immediately
3. Log binary habit #2 → **Expected**: 3 → 6 points immediately
4. Log tiered habit (gold) → **Expected**: 6 → 9 points immediately

## Test Case 6: Deleting a Log
**Steps:**
1. User has 6 points (2 binary habits logged)
2. Delete one binary habit log
3. **Expected**: Score updates from 6 → 3 points immediately

## Test Case 7: Partner Approves Your Shared Habit
**Steps:**
1. User has 3 points (1 binary habit logged, shared with partner)
2. Partner approves the habit
3. **Expected**: User's score updates from 3 → 4 points immediately (on partner's device)
4. Refresh user's device → **Expected**: Shows 4 points

## Test Case 8: Partner Challenges Your Shared Habit
**Steps:**
1. User has 3 points (1 binary habit logged, shared with partner)
2. Partner challenges the habit
3. **Expected**: User's score updates from 3 → 2 points immediately (on partner's device)
4. Refresh user's device → **Expected**: Shows 2 points

## Test Case 9: PointsBar Updates for Both Users
**Steps:**
1. User A: 3 points, User B: 6 points
2. PointsBar shows "User B leads by 3"
3. User A logs a gold-tier habit
4. **Expected**: PointsBar updates to "User B leads by 0" (tied at 6-6) immediately
5. User A logs another binary habit
6. **Expected**: PointsBar updates to "You're ahead by 3!" immediately

## Test Case 10: Editing Existing Log (Update)
**Steps:**
1. User has 3 points (1 binary habit logged)
2. Edit the log (e.g., change mood or photo)
3. **Expected**: Score remains 3 points (no point change since completion status unchanged)
4. Edit tiered habit log from bronze (1pt) to gold (3pt)
5. **Expected**: Score updates by +2 points immediately

## Summary
All CRUD operations (Create, Update, Delete) on habit logs should trigger an **immediate score refresh** without requiring manual page reload. The PointsBar should reflect updated scores in real-time.
