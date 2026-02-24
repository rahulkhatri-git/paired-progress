"use client"

import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "./notification-bell"
import type { NotificationData } from "./notification-stack"

interface DashboardHeaderProps {
  weekLabel: string
  onPrevWeek: () => void
  onNextWeek: () => void
  onProfileClick: () => void
  notifications: NotificationData[]
  onDismissNotification: (id: string) => void
}

export function DashboardHeader({
  weekLabel,
  onPrevWeek,
  onNextWeek,
  onProfileClick,
  notifications,
  onDismissNotification,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="hidden text-base font-bold tracking-tight text-foreground sm:inline">
            Paired Progress
          </span>
        </a>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPrevWeek}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-foreground md:min-w-[180px]">
            {weekLabel}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onNextWeek}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell 
            notifications={notifications}
            onDismiss={onDismissNotification}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={onProfileClick}
            aria-label="Profile"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}
