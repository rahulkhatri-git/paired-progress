"use client"

import { History } from "lucide-react"
import type { Habit, HabitLog } from "@/lib/types/habits"
import { format } from "date-fns"

interface PartnerHabitCardProps {
  habit: Habit
  logs: HabitLog[]
  partnerName: string
}

export function PartnerHabitCard({ habit, logs, partnerName }: PartnerHabitCardProps) {
  // Find today's log
  const today = format(new Date(), 'yyyy-MM-dd')
  const todayLog = logs.find((log) => log.habit_id === habit.id && log.log_date === today)

  // Determine completion status
  const isCompleted = habit.type === 'binary' 
    ? todayLog?.completed 
    : todayLog?.tier_achieved && todayLog.tier_achieved !== 'none'

  // Get tier or value display
  const getProgressDisplay = () => {
    if (!todayLog) return null
    
    if (habit.type === 'binary') {
      return todayLog.completed ? '✓ Complete' : null
    }

    if (todayLog.tier_achieved && todayLog.tier_achieved !== 'none') {
      const tierEmoji = {
        bronze: '🥉',
        silver: '🥈',
        gold: '🥇',
      }[todayLog.tier_achieved]
      
      return (
        <span className="flex items-center gap-1 text-xs font-semibold">
          {tierEmoji} {todayLog.tier_achieved.charAt(0).toUpperCase() + todayLog.tier_achieved.slice(1)}
          {todayLog.value && habit.unit && (
            <span className="text-muted-foreground ml-1">({todayLog.value} {habit.unit})</span>
          )}
        </span>
      )
    }

    if (todayLog.value && habit.unit) {
      return `${todayLog.value} ${habit.unit}`
    }

    return null
  }

  return (
    <div className="relative rounded-xl border border-border/60 bg-card p-4 transition-all">
      {/* Partner Badge */}
      <div className="absolute right-3 top-3">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          {partnerName}
        </span>
      </div>

      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-3 flex items-center justify-between">
        {isCompleted ? (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-600">
              {getProgressDisplay() || 'Completed'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">Not logged today</span>
          </div>
        )}
      </div>

      {/* Photo Preview (if exists) */}
      {todayLog?.photo_url && (
        <div className="mt-3 overflow-hidden rounded-lg">
          <img
            src={todayLog.photo_url}
            alt={`${habit.name} proof`}
            className="h-32 w-full object-cover"
          />
        </div>
      )}

      {/* Emotion + Note */}
      {todayLog && (todayLog.emotion || todayLog.note) && (
        <div className="mt-3 rounded-lg bg-muted/30 p-3 text-sm">
          {todayLog.emotion && (
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Feeling:</span>
              <span className="capitalize">{todayLog.emotion}</span>
            </div>
          )}
          {todayLog.note && (
            <p className="text-xs text-muted-foreground">{todayLog.note}</p>
          )}
        </div>
      )}

      {/* Needs Review Badge */}
      {todayLog?.requires_review && !todayLog.reviewed_by && (
        <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center">
          <span className="text-xs font-semibold text-amber-700">
            Needs Your Review
          </span>
        </div>
      )}
    </div>
  )
}
