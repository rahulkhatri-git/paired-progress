"use client"

import { History } from "lucide-react"
import { TierProgressBar } from "./tier-progress-bar"

interface HabitDay {
  day: string
  completed: boolean
}

export interface HabitCardData {
  id: string
  name: string
  type: "binary" | "tiered"
  currentValue?: number
  bronze?: number
  silver?: number
  gold?: number
  unit?: string
  emoji?: string
  completed: boolean
  days: HabitDay[]
}

interface HabitCardProps {
  habit: HabitCardData
  isPartner?: boolean
  onLog?: (id: string) => void
  onEdit?: (id: string) => void
  onViewHistory?: (id: string) => void
}

export function HabitCard({ habit, isPartner, onLog, onEdit, onViewHistory }: HabitCardProps) {
  const completedGlow = habit.completed ? "ring-1 ring-primary/20 shadow-[0_0_12px_rgba(13,148,136,0.08)]" : ""

  return (
    <div
      onClick={() => !isPartner && onEdit && onEdit(habit.id)}
      className={`rounded-xl border border-border/60 bg-card p-4 transition-all hover:shadow-md ${completedGlow} ${!isPartner && onEdit ? "cursor-pointer" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {habit.emoji && <span className="text-lg">{habit.emoji}</span>}
          <h4 className="text-sm font-semibold text-foreground">{habit.name}</h4>
        </div>
        <div className="flex items-center gap-2">
          {!isPartner && onViewHistory && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onViewHistory(habit.id)
              }}
              className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="View log history"
            >
              <History className="h-3.5 w-3.5" />
            </button>
          )}
          {!isPartner && onLog && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onLog(habit.id)
              }}
              className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              Log
            </button>
          )}
          {isPartner && habit.completed && (
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Done
            </span>
          )}
        </div>
      </div>

      {habit.type === "tiered" &&
        habit.currentValue !== undefined &&
        habit.bronze !== undefined &&
        habit.silver !== undefined &&
        habit.gold !== undefined &&
        habit.unit && (
          <TierProgressBar
            currentValue={habit.currentValue}
            bronze={habit.bronze}
            silver={habit.silver}
            gold={habit.gold}
            unit={habit.unit}
          />
        )}

      {habit.type === "binary" && (
        <div className="mb-2 flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
              habit.completed
                ? "border-primary bg-primary/10"
                : "border-border bg-background"
            }`}
          >
            {habit.completed && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {habit.completed ? "Completed today" : "Not yet completed"}
          </span>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1">
        {habit.days.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-medium text-muted-foreground">{d.day}</span>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] ${
                d.completed
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground/40"
              }`}
            >
              {d.completed ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{"--"}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
