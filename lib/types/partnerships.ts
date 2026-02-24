export interface Partnership {
  id: string
  user1_id: string
  user2_id: string
  status: 'pending' | 'active' | 'ended'
  invited_by: string
  invited_at: string
  accepted_at?: string
  ended_at?: string
  created_at: string
  updated_at: string
}

export interface PartnerInvitation {
  id: string
  code: string
  inviter_id: string
  invitee_email?: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  expires_at: string
  accepted_by?: string
  accepted_at?: string
  created_at: string
}

export interface LogReview {
  id: string
  log_id: string
  reviewer_id: string
  action: 'approve' | 'challenge'
  comment?: string
  created_at: string
}

export interface MonthlyScore {
  id: string
  user_id: string
  month_start: string
  total_points: number
  logs_count: number
  streaks_count: number
  gold_tiers_count: number
  created_at: string
  updated_at: string
}

export interface PartnerProfile {
  id: string
  full_name?: string
  email: string
  avatar_url?: string
  partnership_since?: string
}
