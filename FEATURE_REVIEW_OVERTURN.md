# Feature: Review Decision Management & Overturn

## What Changed

After reviewing a partner's log (approve/challenge), you now see:

### 1. Partner Habit Card Shows Your Decision
**Before:** After reviewing, showed generic "✓ Approved" or "✗ Challenged"
**After:** Shows **"✓ You Approved"** or **"✗ You Challenged"** with eye icon

**Why:** Makes it clear this is YOUR decision, and you can click to view/change it

### 2. Review Modal Shows Current Decision
**New "View Review" Mode:**
- Shows your current decision (Approved or Challenged)
- If challenged, displays your original reason
- Provides "Changed your mind?" section

### 3. Overturn Capability
**From Approval → Challenge:**
- Click "Change to Challenge"
- Enter new reason
- Submit

**From Challenge → Approval:**
- Click "Change to Approve"
- Instantly changes decision
- No reason needed

### 4. Points Auto-adjust
- Overturning triggers real-time score updates
- Partner sees updated score immediately (via Supabase Realtime)

---

## User Flow

### Scenario 1: View Your Approval
1. You previously approved partner's "Run 5km" log
2. Partner habit card shows: **"✓ You Approved"** 👁️
3. Click → Modal opens in "View Review" mode
4. See: "Your Decision: ✓ Approved"
5. Option: "Change to Challenge" (if you reconsider)

### Scenario 2: View Your Challenge
1. You previously challenged partner's log with reason: "No photo proof"
2. Partner habit card shows: **"✗ You Challenged"** 👁️
3. Click → Modal opens in "View Review" mode
4. See: "Your Decision: ✗ Challenged"
5. See: Your reason: "No photo proof"
6. Option: "Change to Approve" (if they provide evidence)

### Scenario 3: Overturn Challenge → Approval
1. Click **"✗ You Challenged"** on habit card
2. Modal shows your challenge reason
3. Click "Change to Approve"
4. Instantly updates:
   - Database: `approved = true`
   - Partner's score: +2 points (+1 for overturning -1 penalty, +1 for approval bonus)
   - Habit card: Changes to **"✓ You Approved"**

### Scenario 4: Overturn Approval → Challenge
1. Click **"✓ You Approved"** on habit card
2. Modal shows your approval decision
3. Click "Change to Challenge"
4. Enter new reason: "Photo looks suspicious"
5. Submit → Updates:
   - Database: `approved = false`, stores new reason
   - Partner's score: -2 points (-1 for removing approval bonus, -1 for challenge penalty)
   - Habit card: Changes to **"✗ You Challenged"**

---

## Future: Rebuttal System 🔮

**Not yet implemented, but prepared for:**

User receives challenge → Sees reason → Click "Respond" →
- Opens rebuttal modal
- User provides counter-evidence (text/photo)
- Partner gets notification: "Rebuttal received"
- Partner can view rebuttal and decide to overturn or maintain challenge

**Database ready:** Can add `rebuttals` table:
```sql
CREATE TABLE rebuttals (
  id uuid PRIMARY KEY,
  log_id uuid REFERENCES habit_logs(id),
  user_id uuid REFERENCES profiles(id),
  rebuttal_text text,
  rebuttal_photo_url text,
  created_at timestamptz
);
```

---

## Technical Details

**Modified Files:**
- `components/dashboard/partner-habit-card.tsx` - Shows "You Approved" vs "You Challenged"
- `components/dashboard/review-log-modal.tsx` - Added "view" mode for reviewing decisions

**Key Logic:**
```typescript
const isAlreadyReviewed = !!log.reviewed_by
const wasApproved = log.approved
const mode = isAlreadyReviewed ? 'view' : 'review'
```

**Overturn Actions:**
- Reuses existing `onApprove()` and `onChallenge()` functions
- Database automatically handles updates to `reviewed_at`, `approved`, `rejection_reason`
- Real-time subscriptions auto-refresh scores
