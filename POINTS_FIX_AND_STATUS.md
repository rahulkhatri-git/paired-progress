# Points System Fix + Phase 2 Status

## 🐛 Critical Bug Fixed: Challenge Points

**Before (WRONG):**
- Gold tier (3pts) challenged → 3pts - 1pt = **2pts** ❌
- Binary (3pts) challenged → 3pts - 1pt = **2pts** ❌

**After (CORRECT):**
- Gold tier (3pts) challenged → 0pts - 1pt = **-1pt** ✅
- Binary (3pts) challenged → 0pts - 1pt = **-1pt** ✅

**Logic:**
```typescript
const wasChallenged = log.reviewed_by && log.approved === false

// Base points ONLY if NOT challenged
if (log.completed && !wasChallenged) {
  // Award 1/2/3 points based on tier
}

// Then apply bonus/penalty
if (log.reviewed_by) {
  if (log.approved) {
    totalPoints += 1  // Approval bonus
  } else {
    totalPoints -= 1  // Challenge penalty (base already not counted)
  }
}
```

**Examples:**
| Scenario | Base | Review | Total |
|----------|------|--------|-------|
| Gold tier, no review | 3 | 0 | **3** |
| Gold tier, approved | 3 | +1 | **4** |
| Gold tier, challenged | 0 | -1 | **-1** |
| Binary, no review | 3 | 0 | **3** |
| Binary, approved | 3 | +1 | **4** |
| Binary, challenged | 0 | -1 | **-1** |

---

## ✅ Supabase Realtime: ALREADY WORKING

**Location:** `lib/hooks/useMonthlyScores.ts` lines 174-220

**What it does:**
- Subscribes to user's `habit_logs` changes
- Subscribes to partner's `habit_logs` changes
- Auto-calls `refetchScores()` on ANY change
- No manual refresh needed

**Test it:**
1. User 1: Log a habit
2. User 2: See score update within 2-3 seconds
3. User 2: Challenge the log
4. User 1: See score drop within 2-3 seconds

---

## ❌ URL Invite Handling: NOT IMPLEMENTED

**Current System:**
1. User A: Generate invite code "ABC123"
2. User A: Manually copy/paste code to User B
3. User B: Enter code in "Accept Invite" modal

**Missing Feature:**
1. User A: Share link `paired-progress.app/invite/ABC123`
2. User B: Click link → Auto-opens accept modal with code pre-filled
3. User B: Just clicks "Accept"

**Implementation needed:**
- Add route: `app/invite/[code]/page.tsx`
- Parse code from URL
- Auto-open `AcceptInviteModal` with code
- Handle errors (expired, invalid, already accepted)

**Priority:** Low (current system works, this is just convenience)

---

## Phase 2 Status Update

### ✅ COMPLETE:
- Partner invitations (code-based) ✅
- Habit sharing (public/private) ✅
- Partner visibility ✅
- Review workflow (approve/challenge/overturn) ✅
- Points system (FIXED: challenge now removes base + penalty) ✅
- Real-time updates (Supabase Realtime) ✅

### ❌ NOT IMPLEMENTED:
- URL invite handling (convenience feature, not critical)
- Rebuttal system (intentionally skipped for psychology reasons)

### 🎯 Phase 2: **99% Complete**

**Remaining optional:**
- URL invite handling (nice-to-have)
- Phase 1 polish (bugs/UX)
- Phase 3 planning

**Ready for:** Full user testing with partner!
