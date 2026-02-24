# Phase 2: Partner Features - Implementation Plan

## 🎯 Goal
Transform Paired Progress from a single-user app into a couples habit tracker with full partner accountability features.

---

## 📋 Core Features

### 1. Partner Linking & Management
**Priority: HIGH - Foundation for everything else**

#### Features:
- **Send Partner Invite**
  - Generate unique invite link/code
  - Send via email or copy link
  - Track pending invitations
  
- **Accept Partner Request**
  - View incoming invitations
  - Accept/decline
  - One partner at a time (can extend to multiple later)

- **Manage Partnership**
  - View partner's profile
  - See partnership since date
  - Unlink partner (with confirmation)

#### Database Changes Needed:
```sql
-- New table: partnerships
CREATE TABLE partnerships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'active', 'ended')),
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_partnership UNIQUE (user1_id, user2_id)
);

-- New table: partner_invitations
CREATE TABLE partner_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  inviter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### UI Components:
- `SendInviteModal` - Generate and share invite link
- `InviteList` - Show pending invitations (sent/received)
- `PartnerProfileCard` - Display partner info
- `UnlinkPartnerDialog` - Confirmation for ending partnership

---

### 2. Partner Habit Visibility
**Priority: HIGH - Core accountability feature**

#### Features:
- **See Partner's Habits**
  - Only habits marked as `is_shared: true`
  - Real-time updates when partner logs
  - Different visual style (dimmed/read-only)

- **Habit Privacy Controls**
  - Toggle share/unshare per habit
  - Indicator showing if habit is shared
  - Option to hide from partner

- **Partner Activity Feed**
  - Recent partner logs
  - Completion notifications
  - Milestone celebrations

#### Database Changes:
```sql
-- Update habits table (already has is_shared column)
-- Add index for partner queries
CREATE INDEX idx_habits_partner_shared 
  ON habits(user_id, is_shared) 
  WHERE is_shared = true;

-- Update habit_logs with requires_review flag
ALTER TABLE habit_logs 
  ADD COLUMN IF NOT EXISTS requires_review BOOLEAN DEFAULT false;
```

#### UI Components:
- `PartnerHabitCard` - Read-only partner habit display
- `PartnerActivityFeed` - Timeline of partner's activities
- `HabitPrivacyToggle` - Share/unshare switch in edit modal

---

### 3. Review & Approve Workflow
**Priority: MEDIUM - Key accountability feature**

#### Features:
- **Review Partner Logs**
  - View partner's logs that need review
  - See photo proof, values, emotions
  - Timeline view of daily progress

- **Approve/Challenge System**
  - ✅ Approve log - Validates partner's effort
  - ⚠️ Challenge log - Request clarification/proof
  - Add comment/feedback
  - Track approval history

- **Challenge Resolution**
  - Partner sees challenge notification
  - Can respond with explanation
  - Can add additional proof (photo)
  - Re-submit for review

#### Database Changes:
```sql
-- Add review columns to habit_logs (some already exist)
ALTER TABLE habit_logs 
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS approved BOOLEAN,
  ADD COLUMN IF NOT EXISTS challenge_reason TEXT,
  ADD COLUMN IF NOT EXISTS challenge_response TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- New table: log_reviews
CREATE TABLE log_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_id UUID REFERENCES habit_logs(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id),
  action TEXT CHECK (action IN ('approve', 'challenge')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### UI Components:
- `PartnerReview` (already exists - needs enhancement)
- `ReviewModal` - Detailed review interface
- `ChallengeModal` (already exists - needs wiring)
- `ChallengeResponseModal` - Reply to challenges
- `ReviewHistoryDrawer` - See all reviews for a habit

---

### 4. Points & Competition
**Priority: LOW-MEDIUM - Fun engagement feature**

#### Features:
- **Point System**
  - Points for logging habits
  - Bonus for achieving gold tier
  - Bonus for consecutive days
  - Weekly point totals

- **Weekly Leaderboard**
  - Side-by-side comparison
  - Winner badge
  - Streak indicators
  - Friendly competition vibe

- **Achievements & Milestones**
  - First week complete
  - 30-day streak
  - Gold tier achievements
  - Partner milestones (both completed)

#### Point Calculation Logic:
```typescript
// Points system (MONTHLY reset)
const POINTS = {
  binary_complete: 10,
  bronze_tier: 10,
  silver_tier: 15,
  gold_tier: 20,
  streak_bonus_per_day: 2, // 2pts * streak days
  both_completed_bonus: 10, // When both partners complete same habit
  week_perfect_bonus: 50, // All habits done all week
  month_perfect_bonus: 200, // All habits done all month
}
```

#### Database Changes:
```sql
-- New table: monthly_scores (changed from weekly_scores)
CREATE TABLE monthly_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  month_start DATE NOT NULL,
  total_points INTEGER DEFAULT 0,
  logs_count INTEGER DEFAULT 0,
  streaks_count INTEGER DEFAULT 0,
  gold_tiers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_month UNIQUE (user_id, month_start)
);
```

#### UI Components:
- `PointsBar` (already exists - needs monthly point calculation)
- `MonthlyLeaderboard` - Full month comparison view
- `AchievementBadge` - Show unlocked achievements
- `PointsBreakdown` - Detailed score explanation
- `MonthlyProgressChart` - Visual progress over the month

---

### 5. Real-time Updates
**Priority: MEDIUM - Better UX**

#### Features:
- **Live Partner Activity**
  - See when partner logs in real-time
  - New log notification
  - Challenge notification
  - Approval notification

- **Supabase Realtime**
  - Subscribe to partner's habit_logs changes
  - Subscribe to partnerships table
  - Subscribe to reviews

#### Implementation:
```typescript
// Example: Subscribe to partner logs
const { data: partnership } = await supabase
  .from('partnerships')
  .select('user1_id, user2_id')
  .eq('status', 'active')
  .single()

const partnerId = partnership.user1_id === user.id 
  ? partnership.user2_id 
  : partnership.user1_id

supabase
  .channel('partner-logs')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'habit_logs',
      filter: `user_id=eq.${partnerId}`,
    },
    (payload) => {
      // Show notification
      pushNotification({
        type: 'partner-logged',
        message: `${partnerName} just logged a habit!`,
      })
      // Refresh partner habits
      refetchPartnerLogs()
    }
  )
  .subscribe()
```

---

## 🏗️ Implementation Order

### Week 1: Foundation
1. **Database Schema**
   - Create partnerships table
   - Create partner_invitations table
   - Add indexes
   - RLS policies

2. **Partner Linking**
   - Generate invite codes
   - Send/accept invitations
   - Store partnership

### Week 2: Visibility
3. **Partner Habit Display**
   - Fetch partner's shared habits
   - Display in Partner's Habits section
   - Privacy controls

4. **Basic Notifications**
   - Partner logged notification
   - Add to notification bell

### Week 3: Accountability
5. **Review System**
   - Review interface
   - Approve/challenge actions
   - Review history

6. **Challenge Workflow**
   - Challenge notifications
   - Response mechanism
   - Resolution flow

### Week 4: Engagement
7. **Points System**
   - Calculate points
   - Weekly totals
   - Leaderboard display

8. **Real-time Updates**
   - Supabase subscriptions
   - Live notifications
   - Auto-refresh

---

## 🎨 UX Considerations

### Partner Invitation Flow
```
User A                           User B
   │                               │
   ├─ Click "Invite Partner"       │
   ├─ Generate invite link         │
   ├─ Copy/send to User B          │
   │                               │
   │                          ┌────┤ Opens link
   │                          │    ├─ Sign up/login
   │                          │    ├─ See invitation
   │                          │    ├─ Click "Accept"
   │                          └────┤
   │                               │
   ├─ Notification: "X accepted!" ─┤
   ├─ Partnership active           ├─ Partnership active
   ├─ See partner's habits         ├─ See partner's habits
   │                               │
```

### Review Workflow
```
User logs habit → Photo/value saved → Notification sent to partner
                                           ↓
                     Partner clicks "Review" → Sees details
                                           ↓
                        ┌──────────────────┴──────────────────┐
                        │                                     │
                   ✅ Approve                            ⚠️ Challenge
                        │                                     │
                Points awarded                    Notification to user
                Badge shown                       Requests response
                        │                                     │
                        └─────────────────────────────────────┘
```

---

## 🔐 Security & Privacy

### RLS Policies Needed

```sql
-- Partners can see each other's shared habits
CREATE POLICY "Partners can view shared habits"
ON habits FOR SELECT
USING (
  is_shared = true AND
  user_id IN (
    SELECT CASE 
      WHEN user1_id = auth.uid() THEN user2_id
      WHEN user2_id = auth.uid() THEN user1_id
    END
    FROM partnerships
    WHERE status = 'active'
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

-- Partners can see each other's logs (for shared habits)
CREATE POLICY "Partners can view logs for shared habits"
ON habit_logs FOR SELECT
USING (
  habit_id IN (
    SELECT id FROM habits
    WHERE is_shared = true
    AND user_id IN (
      SELECT CASE 
        WHEN user1_id = auth.uid() THEN user2_id
        WHEN user2_id = auth.uid() THEN user1_id
      END
      FROM partnerships
      WHERE status = 'active'
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  )
);
```

---

## 📊 Success Metrics

### Must Have:
- ✅ Users can link with partner
- ✅ Partner's shared habits visible
- ✅ Review/approve workflow works
- ✅ Notifications show partner activity

### Nice to Have:
- Points system accurate
- Real-time updates < 2 seconds
- Achievement badges unlock properly

---

## 🚀 Testing Strategy

### Phase 1 Testing (Internal - You & Co-founder)
- **Goal**: Verify all features work end-to-end
- **Duration**: 1 week of daily use
- **Test Cases**:
  - [ ] Create different habit types (binary & tiered)
  - [ ] Log habits daily with photos
  - [ ] Edit habits and logs
  - [ ] View log history
  - [ ] Test on mobile & desktop
  - [ ] Test all notification flows
  - [ ] Verify photo uploads work
  - [ ] Test edge cases (delete, errors, etc.)

### Phase 2 Testing (With Real Users - Couples)
- **Goal**: Validate partner features with real accountability
- **Duration**: 2-3 weeks with 2-3 test couples
- **Test Cases**:
  - [ ] Partner invitation flow
  - [ ] Shared habit visibility
  - [ ] Review & approve workflow
  - [ ] Challenge & response flow
  - [ ] Points calculation accuracy
  - [ ] Real-time notification delivery
  - [ ] Privacy controls work properly
  - [ ] Monthly leaderboard display
  - [ ] Gather UX feedback
  - [ ] Identify pain points

**After Phase 2 testing: Public beta launch!**

---

## 💡 Design Decisions (CONFIRMED)

1. **Multiple Partners**: ✅ **One partner only** - Keeps it simple and focused on couples
   
2. **Challenge Limits**: ✅ **Unlimited challenges** - Trust-based system, monitor for abuse later

3. **Point Reset**: ✅ **Monthly leaderboard** - More substantial competition window

4. **Privacy Default**: ✅ **Shared by default** - Opt-out model for privacy
   - New habits are shared unless explicitly marked private during creation
   - Can toggle privacy in edit modal
   - Encourages accountability by default

---

## 🎯 Phase 2 Success = 
**Two partners can hold each other accountable through shared habits, reviews, and friendly competition!**
