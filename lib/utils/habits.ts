import type { Habit, HabitLog, TierAchieved } from '@/lib/types/habits'

export function calculateTierAchieved(value: number, habit: Habit): TierAchieved {
  if (habit.type === 'binary') {
    return 'none'
  }

  if (!habit.bronze_target || !habit.silver_target || !habit.gold_target) {
    return 'none'
  }

  if (value >= habit.gold_target) {
    return 'gold'
  } else if (value >= habit.silver_target) {
    return 'silver'
  } else if (value >= habit.bronze_target) {
    return 'bronze'
  }

  return 'none'
}

export function calculatePoints(log: HabitLog): number {
  if (log.completed && !log.tier_achieved) {
    return 10
  }

  switch (log.tier_achieved) {
    case 'bronze':
      return 5
    case 'silver':
      return 10
    case 'gold':
      return 15
    default:
      return 0
  }
}

export function calculateTotalPoints(logs: HabitLog[]): number {
  return logs.reduce((total, log) => total + calculatePoints(log), 0)
}

export function getTierColor(tier: TierAchieved): string {
  switch (tier) {
    case 'bronze':
      return 'text-amber-600 bg-amber-500/10'
    case 'silver':
      return 'text-gray-600 bg-gray-500/10'
    case 'gold':
      return 'text-yellow-500 bg-yellow-500/10'
    default:
      return 'text-muted-foreground bg-muted'
  }
}

export function getTierProgress(value: number, habit: Habit): number {
  if (habit.type === 'binary') {
    return value ? 100 : 0
  }

  const target = habit.gold_target || 100
  return Math.min((value / target) * 100, 100)
}

export function getStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
  )

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const log of sortedLogs) {
    const logDate = new Date(log.log_date)
    logDate.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function formatUnit(unit: string | undefined, value: number): string {
  if (!unit) return value.toString()

  const pluralUnits: Record<string, string> = {
    step: 'steps',
    minute: 'minutes',
    min: 'min',
    page: 'pages',
    serving: 'servings',
    glass: 'glasses',
    hour: 'hours',
    meal: 'meals',
  }

  if (value === 1) {
    return `${value} ${unit}`
  }

  const plural = pluralUnits[unit.toLowerCase()] || unit + 's'
  return `${value} ${plural}`
}
