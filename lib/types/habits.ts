export type HabitType = 'binary' | 'tiered'
export type PriorityLevel = 'low' | 'medium' | 'high'
export type EmotionType = 'struggled' | 'fine' | 'good' | 'amazing'
export type TierAchieved = 'none' | 'bronze' | 'silver' | 'gold'

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  type: HabitType
  
  // Tiered habit config
  bronze_target?: number
  silver_target?: number
  gold_target?: number
  unit?: string
  
  // Settings
  priority: PriorityLevel
  requires_photo: boolean
  is_shared: boolean
  
  // Motivation
  why_statement?: string
  why_photo_url?: string
  
  // Schedule
  active_days: boolean[]
  reminder_time?: string
  
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  logged_at: string
  log_date: string
  
  // For tiered habits
  value?: number
  tier_achieved?: TierAchieved
  
  // For binary habits
  completed: boolean
  
  // Photo proof
  photo_url?: string
  
  // Emotion tracking
  emotion?: EmotionType
  note?: string
  
  // Partner review
  requires_review: boolean
  reviewed_by?: string
  approved?: boolean
  rejection_reason?: string
  reviewed_at?: string
  
  created_at: string
}

export interface CreateHabitInput {
  name: string
  description?: string
  type: HabitType
  bronze_target?: number
  silver_target?: number
  gold_target?: number
  unit?: string
  priority?: PriorityLevel
  requires_photo?: boolean
  is_shared?: boolean
  why_statement?: string
  why_photo_url?: string
  active_days?: boolean[]
  reminder_time?: string
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  id: string
}

export interface CreateHabitLogInput {
  habit_id: string
  log_date?: string
  value?: number
  tier_achieved?: TierAchieved
  completed?: boolean
  photo_url?: string
  emotion?: EmotionType
  note?: string
}
