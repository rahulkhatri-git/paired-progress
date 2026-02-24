-- Phase 2: Partner Features Database Schema
-- Run this in Supabase SQL Editor after Phase 1 is complete

-- ============================================================================
-- PARTNERSHIPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS partnerships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'ended')),
  invited_by UUID NOT NULL REFERENCES profiles(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique partnership (regardless of order)
  CONSTRAINT unique_partnership UNIQUE (user1_id, user2_id),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Index for faster partner lookups
CREATE INDEX IF NOT EXISTS idx_partnerships_user1 ON partnerships(user1_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_partnerships_user2 ON partnerships(user2_id) WHERE status = 'active';

-- ============================================================================
-- PARTNER INVITATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS partner_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  inviter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_email TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_by UUID REFERENCES profiles(id),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for code lookups
CREATE INDEX IF NOT EXISTS idx_invitations_code ON partner_invitations(code) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_invitations_inviter ON partner_invitations(inviter_id);

-- ============================================================================
-- LOG REVIEWS TABLE (for approve/challenge workflow)
-- ============================================================================
CREATE TABLE IF NOT EXISTS log_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_id UUID NOT NULL REFERENCES habit_logs(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL CHECK (action IN ('approve', 'challenge')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for log review lookups
CREATE INDEX IF NOT EXISTS idx_log_reviews_log ON log_reviews(log_id);
CREATE INDEX IF NOT EXISTS idx_log_reviews_reviewer ON log_reviews(reviewer_id);

-- ============================================================================
-- MONTHLY SCORES TABLE (for points/competition)
-- ============================================================================
CREATE TABLE IF NOT EXISTS monthly_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month_start DATE NOT NULL,
  total_points INTEGER DEFAULT 0,
  logs_count INTEGER DEFAULT 0,
  streaks_count INTEGER DEFAULT 0,
  gold_tiers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_month UNIQUE (user_id, month_start)
);

-- Index for score lookups
CREATE INDEX IF NOT EXISTS idx_monthly_scores_user_month ON monthly_scores(user_id, month_start);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_scores ENABLE ROW LEVEL SECURITY;

-- PARTNERSHIPS POLICIES
-- Users can view their own partnerships
CREATE POLICY "Users can view their own partnerships"
  ON partnerships FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can create partnerships (when accepting invite)
CREATE POLICY "Users can create partnerships"
  ON partnerships FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can update their own partnerships (e.g., end partnership)
CREATE POLICY "Users can update their partnerships"
  ON partnerships FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- INVITATIONS POLICIES
-- Users can view invitations they sent or received
CREATE POLICY "Users can view their invitations"
  ON partner_invitations FOR SELECT
  USING (
    auth.uid() = inviter_id OR 
    auth.uid() = accepted_by OR
    invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Users can create invitations
CREATE POLICY "Users can create invitations"
  ON partner_invitations FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

-- Users can update invitations (accept/cancel)
CREATE POLICY "Users can update invitations"
  ON partner_invitations FOR UPDATE
  USING (auth.uid() = inviter_id OR status = 'pending');

-- LOG REVIEWS POLICIES
-- Users can view reviews on their own logs or logs they reviewed
CREATE POLICY "Users can view relevant reviews"
  ON log_reviews FOR SELECT
  USING (
    auth.uid() = reviewer_id OR
    EXISTS (
      SELECT 1 FROM habit_logs
      WHERE habit_logs.id = log_reviews.log_id
      AND habit_logs.user_id = auth.uid()
    )
  );

-- Users can create reviews (only for partner's logs)
CREATE POLICY "Users can review partner logs"
  ON log_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM habit_logs
      INNER JOIN habits ON habits.id = habit_logs.habit_id
      WHERE habit_logs.id = log_reviews.log_id
      AND habits.user_id IN (
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

-- MONTHLY SCORES POLICIES
-- Users can view their own and their partner's scores
CREATE POLICY "Users can view their and partner scores"
  ON monthly_scores FOR SELECT
  USING (
    auth.uid() = user_id OR
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

-- System can create and update scores
CREATE POLICY "Users can manage their own scores"
  ON monthly_scores FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- UPDATE EXISTING TABLES
-- ============================================================================

-- Add partner-related columns to habit_logs if not exists
ALTER TABLE habit_logs 
  ADD COLUMN IF NOT EXISTS requires_review BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS approved BOOLEAN,
  ADD COLUMN IF NOT EXISTS challenge_reason TEXT,
  ADD COLUMN IF NOT EXISTS challenge_response TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Index for review queries
CREATE INDEX IF NOT EXISTS idx_habit_logs_requires_review 
  ON habit_logs(user_id, requires_review) 
  WHERE requires_review = true;

-- ============================================================================
-- PARTNER VISIBILITY POLICIES (Update existing habits/logs policies)
-- ============================================================================

-- Drop existing policies if they conflict (adjust names as needed)
-- DROP POLICY IF EXISTS "Users can view own habits" ON habits;
-- DROP POLICY IF EXISTS "Users can view own logs" ON habit_logs;

-- Partners can view each other's SHARED habits
CREATE POLICY "Partners can view shared habits"
  ON habits FOR SELECT
  USING (
    auth.uid() = user_id OR (
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
    )
  );

-- Partners can view logs for shared habits
CREATE POLICY "Partners can view logs for shared habits"
  ON habit_logs FOR SELECT
  USING (
    auth.uid() = user_id OR
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

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get partner ID
CREATE OR REPLACE FUNCTION get_partner_id(p_user_id UUID)
RETURNS UUID AS $$
  SELECT CASE 
    WHEN user1_id = p_user_id THEN user2_id
    WHEN user2_id = p_user_id THEN user1_id
  END
  FROM partnerships
  WHERE status = 'active'
  AND (user1_id = p_user_id OR user2_id = p_user_id)
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to check if users are partners
CREATE OR REPLACE FUNCTION are_partners(p_user1_id UUID, p_user2_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM partnerships
    WHERE status = 'active'
    AND (
      (user1_id = p_user1_id AND user2_id = p_user2_id) OR
      (user1_id = p_user2_id AND user2_id = p_user1_id)
    )
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partnerships_updated_at
  BEFORE UPDATE ON partnerships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER monthly_scores_updated_at
  BEFORE UPDATE ON monthly_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- DONE!
-- ============================================================================
-- Phase 2 database schema is now complete.
-- Next: Implement partner invitation UI and logic in the app.
