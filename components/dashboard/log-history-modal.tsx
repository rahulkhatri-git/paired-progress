"use client"

import { useState, useEffect } from "react"
import { X, TrendingUp, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useHabitLogs } from "@/lib/hooks/useHabitLogs"
import { useHabits } from "@/lib/hooks/useHabits"
import type { HabitLog } from "@/lib/types/habits"

interface LogHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habitId: string | null
}

const MOODS = {
  struggled: { emoji: "😫", label: "Struggled", color: "text-red-600" },
  fine: { emoji: "😐", label: "Fine", color: "text-gray-600" },
  good: { emoji: "😊", label: "Good", color: "text-green-600" },
  amazing: { emoji: "🔥", label: "Amazing", color: "text-orange-600" },
}

const TIERS = {
  bronze: { medal: "🥉", label: "Bronze", color: "text-amber-700" },
  silver: { medal: "🥈", label: "Silver", color: "text-gray-500" },
  gold: { medal: "🥇", label: "Gold", color: "text-yellow-500" },
}

export function LogHistoryModal({ open, onOpenChange, habitId }: LogHistoryModalProps) {
  const { logs } = useHabitLogs()
  const { habits } = useHabits()
  const [weekLogs, setWeekLogs] = useState<(HabitLog | null)[]>([])

  const habit = habits.find((h) => h.id === habitId)

  useEffect(() => {
    if (!habitId || !open) return

    // Get past 7 days
    const dates: string[] = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }

    // Map logs to dates
    const logsForWeek = dates.map((date) => {
      const log = logs.find((l) => l.habit_id === habitId && l.log_date === date)
      return log || null
    })

    setWeekLogs(logsForWeek)
  }, [habitId, logs, open])

  if (!habit) return null

  const getDayLabel = (daysAgo: number) => {
    if (daysAgo === 0) return "Today"
    if (daysAgo === 1) return "Yesterday"
    
    const date = new Date()
    date.setDate(date.getDate() - (6 - daysAgo))
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <DialogTitle className="text-lg">{habit.name}</DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">Past 7 days of activity</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {weekLogs.map((log, index) => {
            const daysAgo = 6 - index
            const isToday = daysAgo === 0
            
            return (
              <div
                key={index}
                className={`rounded-xl border p-4 transition-all ${
                  log
                    ? "border-primary/20 bg-primary/5"
                    : "border-border/40 bg-muted/20"
                } ${isToday ? "ring-2 ring-primary/30" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        {getDayLabel(daysAgo)}
                      </span>
                      {isToday && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                          Today
                        </span>
                      )}
                    </div>

                    {log ? (
                      <div className="mt-3 space-y-3">
                        {/* Tiered habit value */}
                        {habit.type === "tiered" && log.value !== undefined && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="text-2xl font-bold text-foreground">
                                {log.value}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {habit.unit}
                              </span>
                            </div>
                            
                            {log.tier_achieved && log.tier_achieved !== "none" && (
                              <div className="flex items-center gap-1">
                                <span className="text-lg">
                                  {TIERS[log.tier_achieved as keyof typeof TIERS].medal}
                                </span>
                                <span className={`text-xs font-semibold ${TIERS[log.tier_achieved as keyof typeof TIERS].color}`}>
                                  {TIERS[log.tier_achieved as keyof typeof TIERS].label}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Binary habit */}
                        {habit.type === "binary" && (
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-primary">Completed</span>
                          </div>
                        )}

                        {/* Emotion */}
                        {log.emotion && (
                          <div className="flex items-center gap-2">
                            <span className="text-base">{MOODS[log.emotion as keyof typeof MOODS].emoji}</span>
                            <span className={`text-sm font-medium ${MOODS[log.emotion as keyof typeof MOODS].color}`}>
                              Felt {MOODS[log.emotion as keyof typeof MOODS].label}
                            </span>
                          </div>
                        )}

                        {/* Photo */}
                        {log.photo_url && (
                          <div className="mt-2">
                            <img
                              src={log.photo_url}
                              alt="Habit proof"
                              className="h-32 w-full rounded-lg object-cover"
                            />
                          </div>
                        )}

                        {/* Partner Review Status */}
                        {log.reviewed_by && (
                          <div className={`mt-2 rounded-lg border p-2 ${
                            log.approved
                              ? 'border-green-500/30 bg-green-500/5'
                              : 'border-red-500/30 bg-red-500/5'
                          }`}>
                            <div className="text-xs font-semibold ${log.approved ? 'text-green-700' : 'text-red-700'}">
                              {log.approved ? '✓ Approved by Partner' : '⚠️ Challenged by Partner'}
                            </div>
                            {!log.approved && log.rejection_reason && (
                              <p className="mt-1 text-xs text-red-600">
                                Reason: "{log.rejection_reason}"
                              </p>
                            )}
                            {log.approved && (
                              <p className="mt-1 text-xs text-green-600">
                                +1 point bonus awarded
                              </p>
                            )}
                          </div>
                        )}

                        {/* Note */}
                        {log.note && (
                          <div className="rounded-lg bg-muted/50 p-2">
                            <p className="text-xs text-muted-foreground">{log.note}</p>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="text-xs text-muted-foreground">
                          Logged at {new Date(log.logged_at).toLocaleTimeString("en-US", { 
                            hour: "numeric", 
                            minute: "2-digit",
                            hour12: true 
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span>Not logged</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {weekLogs.filter((l) => l !== null).length}
            </div>
            <div className="text-xs text-muted-foreground">Days Logged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round((weekLogs.filter((l) => l !== null).length / 7) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {weekLogs.filter((l) => l !== null).length}
            </div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>

        <div className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
          📌 Past logs are read-only to maintain accountability. Only today's log can be edited.
        </div>
      </DialogContent>
    </Dialog>
  )
}
