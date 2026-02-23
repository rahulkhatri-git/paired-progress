"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PointsBar } from "@/components/dashboard/points-bar"
import { HabitCard } from "@/components/dashboard/habit-card"
import { LogHabitModal } from "@/components/dashboard/log-habit-modal"
import { PartnerReview } from "@/components/dashboard/partner-review"
import { ChallengeModal } from "@/components/dashboard/challenge-modal"
import { WeeklySummary } from "@/components/dashboard/weekly-summary"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { CreateHabitModal } from "@/components/dashboard/create-habit-modal"
import {
  EmptyNoHabits,
  EmptyNoPartner,
  EmptyAllDone,
  EmptyNoPendingReviews,
} from "@/components/dashboard/empty-states"
import {
  NotificationStack,
  useNotifications,
} from "@/components/dashboard/notification-stack"
import type { NotificationType } from "@/components/dashboard/notification-stack"
import type { HabitCardData } from "@/components/dashboard/habit-card"
import { useAuth } from "@/lib/auth-context"
import { useHabits } from "@/lib/hooks/useHabits"
import { useHabitLogs } from "@/lib/hooks/useHabitLogs"
import { calculateTierAchieved } from "@/lib/utils/habits"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getWeekDates(weekOffset: number = 0) {
  const dates: string[] = []
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

type DashboardView = "dashboard" | "review" | "summary" | "profile"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { habits, loading: habitsLoading } = useHabits()
  const { logs, loading: logsLoading } = useHabitLogs()
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [logHabitId, setLogHabitId] = useState<string | null>(null)
  const [challengeOpen, setChallengeOpen] = useState(false)
  const [createHabitOpen, setCreateHabitOpen] = useState(false)
  const [view, setView] = useState<DashboardView>("dashboard")
  const [weekOffset, setWeekOffset] = useState(0)

  /* Demo state -- toggles empty-state previews */
  const [emptyPreview, setEmptyPreview] = useState<
    "none" | "no-habits" | "no-partner" | "all-done" | "no-reviews"
  >("none")

  /* Notification system */
  const { items: notifications, push: pushNotification, dismiss: dismissNotification } = useNotifications([
    {
      id: "demo-1",
      type: "partner-logged" as NotificationType,
      message: "Sarah just logged 'Morning Workout'",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: "demo-2",
      type: "needs-review" as NotificationType,
      message: "2 habits waiting for your review",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      actionLabel: "Review",
      onAction: () => setView("review"),
      persistent: true,
    },
    {
      id: "demo-3",
      type: "streak-milestone" as NotificationType,
      message: "10 day streak on meditation!",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
  ])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  const weekDates = getWeekDates(weekOffset)
  const today = new Date().toISOString().split('T')[0]

  // Transform habits into HabitCardData format
  const YOUR_HABITS: HabitCardData[] = habits.map((habit) => {
    const todayLog = logs.find((log) => log.habit_id === habit.id && log.log_date === today)
    const weekLogs = logs.filter((log) => 
      log.habit_id === habit.id && weekDates.includes(log.log_date)
    )
    
    const days = weekDates.map((date) => {
      const log = weekLogs.find((l) => l.log_date === date)
      return {
        day: DAYS[weekDates.indexOf(date)],
        completed: log ? (log.completed || !!log.tier_achieved) : false,
      }
    })

    if (habit.type === 'binary') {
      return {
        id: habit.id,
        name: habit.name,
        type: 'binary',
        emoji: '✓',
        completed: !!todayLog?.completed,
        days,
      }
    } else {
      return {
        id: habit.id,
        name: habit.name,
        type: 'tiered',
        currentValue: todayLog?.value || 0,
        bronze: habit.bronze_target || 0,
        silver: habit.silver_target || 0,
        gold: habit.gold_target || 0,
        unit: habit.unit || '',
        emoji: '🎯',
        completed: !!todayLog,
        days,
      }
    }
  })

  const loading = authLoading || habitsLoading || logsLoading

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const weekLabel = `Week of ${fmt(weekStart)}-${fmt(weekEnd)}`

  function handleLog(habitId: string) {
    setLogHabitId(habitId)
    setLogModalOpen(true)
  }

  if (view === "review") {
    return <PartnerReview onBack={() => setView("dashboard")} onChallenge={() => setChallengeOpen(true)} />
  }

  if (view === "summary") {
    return <WeeklySummary onBack={() => setView("dashboard")} />
  }

  if (view === "profile") {
    return <ProfileSettings onBack={() => setView("dashboard")} />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Floating notifications */}
      <NotificationStack
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      <DashboardHeader
        weekLabel={weekLabel}
        onPrevWeek={() => setWeekOffset((p) => p - 1)}
        onNextWeek={() => setWeekOffset((p) => p + 1)}
        onProfileClick={() => setView("profile")}
      />

      <PointsBar
        yourName="You"
        yourPoints={185}
        partnerName="Sarah"
        partnerPoints={162}
      />

      {/* Quick actions */}
      <div className="mx-auto w-full max-w-6xl px-4 py-3 md:px-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setView("review")}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/10 text-[10px] font-bold text-orange-600">
                3
              </span>
              Review Partner
            </button>
            <button
              onClick={() => setView("summary")}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              Weekly Summary
            </button>
            <button
              onClick={() => setChallengeOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              View Challenge
            </button>
          </div>

          {/* Empty state & notification demo toggles */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Preview:
            </span>
            {(
              [
                { key: "none", label: "Default" },
                { key: "no-habits", label: "No Habits" },
                { key: "no-partner", label: "No Partner" },
                { key: "all-done", label: "All Done" },
                { key: "no-reviews", label: "No Reviews" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setEmptyPreview(opt.key)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all ${
                  emptyPreview === opt.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {opt.label}
              </button>
            ))}
            <span className="mx-1 h-3 w-px shrink-0 bg-border" />
            {(
              [
                { type: "partner-logged" as NotificationType, label: "+Logged" },
                { type: "forgiveness-used" as NotificationType, label: "+Forgiveness" },
                { type: "partner-challenged" as NotificationType, label: "+Challenge" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.type}
                onClick={() =>
                  pushNotification({
                    type: opt.type,
                    message:
                      opt.type === "partner-logged"
                        ? "Sarah just logged 'Evening Yoga'"
                        : opt.type === "forgiveness-used"
                          ? "You used a forgiveness day (1 remaining)"
                          : "Sarah challenged your workout log",
                    persistent: opt.type === "partner-challenged",
                    actionLabel: opt.type === "partner-challenged" ? "View" : undefined,
                    onAction:
                      opt.type === "partner-challenged"
                        ? () => setChallengeOpen(true)
                        : undefined,
                  })
                }
                className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground transition-all hover:bg-accent"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split-screen habits */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 md:px-6">
        {/* Empty state previews */}
        {emptyPreview === "no-habits" ? (
          <EmptyNoHabits onCreateHabit={() => setCreateHabitOpen(true)} />
        ) : emptyPreview === "no-partner" ? (
          <EmptyNoPartner />
        ) : emptyPreview === "all-done" ? (
          <EmptyAllDone />
        ) : emptyPreview === "no-reviews" ? (
          <EmptyNoPendingReviews />
        ) : (
          /* Default dashboard with habit columns */
          YOUR_HABITS.length === 0 ? (
            <EmptyNoHabits onCreateHabit={() => setCreateHabitOpen(true)} />
          ) : (
          <div className="grid gap-6 md:grid-cols-2">
          {/* Your habits */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Your Habits</h2>
              <span className="text-xs font-medium text-muted-foreground">
                {YOUR_HABITS.filter((h) => h.completed).length}/{YOUR_HABITS.length} done
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {YOUR_HABITS.map((habit) => (
                <HabitCard key={habit.id} habit={habit} onLog={handleLog} />
              ))}
            </div>
          </section>

          {/* Partner habits - TODO: will be implemented in Phase 2 */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Partner's Habits</h2>
              <span className="text-xs font-medium text-muted-foreground">
                Coming soon
              </span>
            </div>
            <EmptyNoPartner />
          </section>
        </div>
          )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setCreateHabitOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
        aria-label="Create new habit"
      >
        <Plus className="h-6 w-6" />
      </button>

      <LogHabitModal
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
        habitId={logHabitId}
        habits={YOUR_HABITS}
      />

      <ChallengeModal
        open={challengeOpen}
        onOpenChange={setChallengeOpen}
      />

      <CreateHabitModal
        open={createHabitOpen}
        onOpenChange={setCreateHabitOpen}
      />
    </div>
  )
}
