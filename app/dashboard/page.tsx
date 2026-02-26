"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PointsBar } from "@/components/dashboard/points-bar"
import { HabitCard } from "@/components/dashboard/habit-card"
import { PartnerHabitCard } from "@/components/dashboard/partner-habit-card"
import { LogHabitModal } from "@/components/dashboard/log-habit-modal"
import { PartnerReview } from "@/components/dashboard/partner-review"
import { ChallengeModal } from "@/components/dashboard/challenge-modal"
import { WeeklySummary } from "@/components/dashboard/weekly-summary"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { CreateHabitModal } from "@/components/dashboard/create-habit-modal"
import { EditHabitModal } from "@/components/dashboard/edit-habit-modal"
import { LogHistoryModal } from "@/components/dashboard/log-history-modal"
import { SendInviteModal } from "@/components/dashboard/send-invite-modal"
import { AcceptInviteModal } from "@/components/dashboard/accept-invite-modal"
import { ReviewLogModal } from "@/components/dashboard/review-log-modal"
import {
  EmptyNoHabits,
  EmptyNoPartner,
  EmptyNoSharedHabits,
  EmptyAllDone,
  EmptyNoPendingReviews,
} from "@/components/dashboard/empty-states"
import { useNotifications } from "@/components/dashboard/notification-stack"
import type { HabitCardData } from "@/components/dashboard/habit-card"
import { useAuth } from "@/lib/auth-context"
import { useHabits } from "@/lib/hooks/useHabits"
import { useHabitLogs } from "@/lib/hooks/useHabitLogs"
import { usePartnership } from "@/lib/hooks/usePartnership"
import { usePartnerHabits } from "@/lib/hooks/usePartnerHabits"
import { useLogReviews } from "@/lib/hooks/useLogReviews"
import { useMonthlyScores } from "@/lib/hooks/useMonthlyScores"
import type { Habit, HabitLog } from "@/lib/types/habits"

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
  const { habits, loading: habitsLoading, refetch: refetchHabits } = useHabits()
  const { logs, loading: logsLoading, refetch: refetchLogs } = useHabitLogs()
  const { partner, hasPartner, loading: partnershipLoading } = usePartnership()
  const { 
    habits: partnerHabits, 
    logs: partnerLogs, 
    loading: partnerHabitsLoading,
    refetch: refetchPartnerHabits
  } = usePartnerHabits()
  const { approveLog, challengeLog } = useLogReviews()
  const { userScore, partnerScore, refetch: refetchScores } = useMonthlyScores(partner?.id)
  
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [logHabitId, setLogHabitId] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editHabitId, setEditHabitId] = useState<string | null>(null)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [historyHabitId, setHistoryHabitId] = useState<string | null>(null)
  const [sendInviteOpen, setSendInviteOpen] = useState(false)
  const [acceptInviteOpen, setAcceptInviteOpen] = useState(false)
  const [createHabitOpen, setCreateHabitOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewHabit, setReviewHabit] = useState<Habit | null>(null)
  const [reviewLog, setReviewLog] = useState<HabitLog | null>(null)
  const [view, setView] = useState<DashboardView>("dashboard")
  const [weekOffset, setWeekOffset] = useState(0)
  const [partnerSectionCollapsed, setPartnerSectionCollapsed] = useState(false)

  /* Notification system */
  const { items: notifications, dismiss: dismissNotification } = useNotifications()

  // Handle review modal
  const handleOpenReview = (habit: Habit, log: HabitLog) => {
    setReviewHabit(habit)
    setReviewLog(log)
    setReviewModalOpen(true)
  }

  const handleApproveLog = async () => {
    if (!reviewLog) return
    const success = await approveLog(reviewLog.id)
    if (success) {
      refetchPartnerHabits()
      refetchScores() // Update scores after approval
    }
  }

  const handleChallengeLog = async (reason: string) => {
    if (!reviewLog) return
    const success = await challengeLog(reviewLog.id, reason)
    if (success) {
      refetchPartnerHabits()
      refetchScores() // Update scores after challenge
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  // Real-time updates for partner actions
  useEffect(() => {
    if (!user || !partner?.id) return

    const supabase = createClient()
    
    // Subscribe to partner's habit log changes (for review updates)
    const channel = supabase
      .channel('partner_habit_logs_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habit_logs',
          filter: `user_id=eq.${user.id}`, // Listen to changes on YOUR logs (partner reviewing them)
        },
        (payload) => {
          console.log('Real-time: Your log reviewed by partner', payload.eventType)
          // Refresh your own logs to show challenge/approval status
          refetchLogs()
          refetchScores()
        }
      )
      .subscribe()

    // Subscribe to partner's logs (when they log/update habits you're viewing)
    const partnerChannel = supabase
      .channel('partner_logs_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habit_logs',
          filter: `user_id=eq.${partner.id}`, // Listen to partner's logs
        },
        (payload) => {
          console.log('Real-time: Partner logged a habit', payload.eventType)
          // Refresh partner habits and logs
          refetchPartnerHabits()
          refetchScores()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(partnerChannel)
    }
  }, [user, partner?.id, refetchLogs, refetchPartnerHabits, refetchScores])

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render dashboard if no user
  if (!user) {
    return null
  }

  const weekDates = getWeekDates(weekOffset)
  const today = new Date().toISOString().split('T')[0]

  // Transform habits into HabitCardData format with today's log info
  const YOUR_HABITS: (HabitCardData & { todayLog?: HabitLog })[] = habits.map((habit) => {
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
        todayLog,
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
        todayLog,
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

  function handleEdit(habitId: string) {
    setEditHabitId(habitId)
    setEditModalOpen(true)
  }

  function handleViewHistory(habitId: string) {
    setHistoryHabitId(habitId)
    setHistoryModalOpen(true)
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
      <DashboardHeader
        weekLabel={weekLabel}
        onPrevWeek={() => setWeekOffset((p) => p - 1)}
        onNextWeek={() => setWeekOffset((p) => p + 1)}
        onProfileClick={() => setView("profile")}
        notifications={notifications}
        onDismissNotification={dismissNotification}
      />

      {/* Only show PointsBar if user has a partner */}
      {hasPartner && partner && (
        <PointsBar
          yourName={user?.user_metadata?.full_name || "You"}
          yourPoints={userScore}
          partnerName={partner.full_name || "Partner"}
          partnerPoints={partnerScore}
        />
      )}

      {/* Split-screen habits */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 md:px-6">
        {/* Always show 2-column layout with partner section */}
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          {/* Your habits */}
          <section className={partnerSectionCollapsed ? "" : "md:col-span-1"}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Your Habits</h2>
              {YOUR_HABITS.length > 0 && (
                <span className="text-xs font-medium text-muted-foreground">
                  {YOUR_HABITS.filter((h) => h.completed).length}/{YOUR_HABITS.length} done
                </span>
              )}
            </div>
            
            {YOUR_HABITS.length === 0 ? (
              <EmptyNoHabits onCreateHabit={() => setCreateHabitOpen(true)} />
            ) : (
              <div className={`grid gap-3 ${partnerSectionCollapsed ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
                {YOUR_HABITS.map((habitData) => (
                  <HabitCard 
                    key={habitData.id} 
                    habit={habitData} 
                    todayLog={habitData.todayLog}
                    partnerName={partner?.full_name?.split(' ')[0]}
                    onLog={handleLog} 
                    onEdit={handleEdit}
                    onViewHistory={handleViewHistory}
                  />
                ))}
              </div>
            )}
          </section>

            {/* Partner habits - collapsed to side */}
            {partnerSectionCollapsed ? (
              <div className="hidden md:flex md:flex-col md:w-16 border-l border-border/60 pl-4">
                <button
                  onClick={() => setPartnerSectionCollapsed(false)}
                  className="sticky top-24 flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-card p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Expand partner section"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span className="text-[10px] font-medium [writing-mode:vertical-lr]">Partner</span>
                </button>
              </div>
            ) : (
              <section className="md:w-80 lg:w-96">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    {partner?.full_name || 'Partner'}'s Habits
                  </h2>
                  <div className="flex items-center gap-2">
                    {hasPartner && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {partnerHabits.filter((h) => {
                          const today = new Date().toISOString().split('T')[0]
                          const log = partnerLogs.find((l) => l.habit_id === h.id && l.log_date === today)
                          return h.type === 'binary' ? log?.completed : (log?.tier_achieved && log.tier_achieved !== 'none')
                        }).length}/{partnerHabits.length} done
                      </span>
                    )}
                    <button
                      onClick={() => setPartnerSectionCollapsed(true)}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Collapse partner section"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {hasPartner ? (
                  partnerHabits.length > 0 ? (
                    <div className="grid gap-3">
                      {partnerHabits.map((habit) => (
                        <PartnerHabitCard
                          key={habit.id}
                          habit={habit}
                          logs={partnerLogs}
                          partnerName={partner?.full_name?.split(' ')[0] || 'Partner'}
                          onReview={handleOpenReview}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyNoSharedHabits partnerName={partner?.full_name?.split(' ')[0]} />
                  )
                ) : (
                  <EmptyNoPartner 
                    onSendInvite={() => setSendInviteOpen(true)}
                    onAcceptInvite={() => setAcceptInviteOpen(true)}
                  />
                )}
            </section>
          )}
        </div>
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
        habits={habits}
        onSuccess={() => {
          refetchHabits()
          refetchLogs()
          refetchScores() // Update score immediately after logging
        }}
      />

      <CreateHabitModal
        open={createHabitOpen}
        onOpenChange={setCreateHabitOpen}
        onSuccess={() => {
          refetchHabits()
        }}
      />

      <EditHabitModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        habitId={editHabitId}
        onSuccess={() => {
          refetchHabits()
        }}
      />

      <LogHistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        habitId={historyHabitId}
      />

      <SendInviteModal
        open={sendInviteOpen}
        onOpenChange={setSendInviteOpen}
      />

      <AcceptInviteModal
        open={acceptInviteOpen}
        onOpenChange={setAcceptInviteOpen}
        onSuccess={() => {
          // Partnership accepted - page will reload automatically
        }}
      />

      {/* Review Log Modal */}
      {reviewHabit && reviewLog && (
        <ReviewLogModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          habit={reviewHabit}
          log={reviewLog}
          partnerName={partner?.full_name || 'Partner'}
          onApprove={handleApproveLog}
          onChallenge={handleChallengeLog}
        />
      )}
    </div>
  )
}
