"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { NotificationData } from "./notification-stack"

const TYPE_CONFIG: Record<
  string,
  {
    emoji: string
    accent: string
    bg: string
    border: string
  }
> = {
  "partner-logged": {
    emoji: "🏋️",
    accent: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
  },
  "needs-review": {
    emoji: "👀",
    accent: "text-orange-600",
    bg: "bg-orange-500/5",
    border: "border-orange-500/20",
  },
  "forgiveness-used": {
    emoji: "🛡️",
    accent: "text-amber-600",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
  },
  "streak-milestone": {
    emoji: "🔥",
    accent: "text-orange-500",
    bg: "bg-orange-500/5",
    border: "border-orange-500/20",
  },
  "partner-challenged": {
    emoji: "⚠️",
    accent: "text-amber-600",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
  },
}

interface NotificationBellProps {
  notifications: NotificationData[]
  onDismiss: (id: string) => void
}

export function NotificationBell({ notifications, onDismiss }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.length

  function formatTimeAgo(date: Date): string {
    const diff = Date.now() - date.getTime()
    const sec = Math.floor(diff / 1000)
    if (sec < 60) return "Just now"
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    return `${hr}h ago`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${
            unreadCount > 0 ? "animate-jiggle" : ""
          }`}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-2 rounded-full bg-muted p-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => {
                const config = TYPE_CONFIG[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={`relative border-b border-border/60 p-3 transition-colors hover:bg-accent/50 ${config.bg}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg" aria-hidden="true">
                        {config.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">
                          {notification.message}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                        {notification.actionLabel && notification.onAction && (
                          <Button
                            variant="link"
                            size="sm"
                            className={`mt-1 h-auto p-0 text-xs ${config.accent}`}
                            onClick={() => {
                              notification.onAction?.()
                              onDismiss(notification.id)
                              setOpen(false)
                            }}
                          >
                            {notification.actionLabel} →
                          </Button>
                        )}
                      </div>
                      <button
                        onClick={() => onDismiss(notification.id)}
                        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                        aria-label="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
