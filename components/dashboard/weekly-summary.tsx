/*
 * PHASE 3 FEATURE - NOT IMPLEMENTED YET
 * This component contains dummy/placeholder data and is not functional.
 * TODO: Implement with real weekly statistics and partner data
 */

"use client"

import { ArrowLeft, Trophy, TrendingUp, Flame, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WeeklySummaryProps {
  onBack: () => void
}

const STATS = [
  { label: "Habits completed", you: "18/21", partner: "15/21" },
  { label: "Gold tier hits", you: "8", partner: "5" },
  { label: "Perfect days", you: "2", partner: "1" },
  { label: "Current streak", you: "23 days", partner: "18 days" },
]

const INSIGHTS = [
  { icon: Flame, color: "text-orange-500", bgColor: "bg-orange-500/10", text: "Hot Streak: You hit Gold on workouts 6/7 days" },
  { icon: ThumbsUp, color: "text-primary", bgColor: "bg-primary/10", text: "Partner Support: Sarah approved all your habits" },
  { icon: TrendingUp, color: "text-emerald-500", bgColor: "bg-emerald-500/10", text: "Improvement: +15% better than last week" },
]

export function WeeklySummary({ onBack }: WeeklySummaryProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Celebratory header */}
      <header className="relative overflow-hidden border-b border-border/60 bg-primary/5">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />
        </div>
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 md:px-6">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">Week 3 Results</h1>
            <p className="text-xs text-muted-foreground">Feb 17 - Feb 23, 2026</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-6">
          {/* Winner card */}
          <div className="overflow-hidden rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-400/5 to-amber-500/10 p-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/15">
              <Trophy className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">You won this week!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">185 pts</span>
              {" vs "}
              <span className="font-semibold text-orange-600">162 pts</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Choose your reward!</p>
          </div>

          {/* Side-by-side comparison */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Comparison
            </h3>
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
              {/* Column headers */}
              <div className="grid grid-cols-3 border-b border-border/60 bg-muted/30 px-4 py-2.5">
                <span className="text-xs font-medium text-muted-foreground">Stat</span>
                <span className="text-center text-xs font-semibold text-primary">You</span>
                <span className="text-right text-xs font-semibold text-orange-600">Sarah</span>
              </div>
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`grid grid-cols-3 px-4 py-3 ${
                    i < STATS.length - 1 ? "border-b border-border/40" : ""
                  }`}
                >
                  <span className="text-sm text-foreground">{stat.label}</span>
                  <span className="text-center text-sm font-semibold text-foreground">{stat.you}</span>
                  <span className="text-right text-sm font-medium text-muted-foreground">{stat.partner}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Insights
            </h3>
            <div className="flex flex-col gap-3">
              {INSIGHTS.map((insight) => {
                const Icon = insight.icon
                return (
                  <div
                    key={insight.text}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${insight.bgColor}`}>
                      <Icon className={`h-4 w-4 ${insight.color}`} />
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{insight.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mood correlation */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Mood Correlation
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm text-foreground">
                  When you workout, your mood averages <span className="font-bold text-primary">8.2/10</span>
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-sm text-foreground">
                  When you skip meditation, mood drops to <span className="font-bold text-amber-600">5.1/10</span>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3 pt-4">
            <Button onClick={onBack} className="w-full max-w-xs">
              Start Next Week
            </Button>
            <button className="text-sm text-muted-foreground transition-colors hover:text-primary">
              View Full History
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
