"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, Eye, Flame, AlertTriangle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

/* ------------------------------------------------------------------ */
/*  Notification Types                                                */
/* ------------------------------------------------------------------ */
export type NotificationType =
  | "partner-logged"
  | "needs-review"
  | "forgiveness-used"
  | "streak-milestone"
  | "partner-challenged"

export interface NotificationData {
  id: string
  type: NotificationType
  message: string
  timestamp: Date
  actionLabel?: string
  onAction?: () => void
  /** True = card won't auto-dismiss (requires user action) */
  persistent?: boolean
}

/* ------------------------------------------------------------------ */
/*  Config per type (icon, accent colours, emoji)                     */
/* ------------------------------------------------------------------ */
const TYPE_CONFIG: Record<
  NotificationType,
  {
    icon: React.ReactNode
    accent: string
    bg: string
    border: string
    emoji: string
  }
> = {
  "partner-logged": {
    icon: <span className="text-base" aria-hidden="true">{"🏋️"}</span>,
    accent: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
    emoji: "🏋️",
  },
  "needs-review": {
    icon: <Eye className="h-4 w-4 text-orange-500" />,
    accent: "text-orange-600",
    bg: "bg-orange-500/5",
    border: "border-orange-500/20",
    emoji: "👀",
  },
  "forgiveness-used": {
    icon: <Calendar className="h-4 w-4 text-amber-500" />,
    accent: "text-amber-600",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    emoji: "🛡️",
  },
  "streak-milestone": {
    icon: <Flame className="h-4 w-4 text-orange-500" />,
    accent: "text-orange-500",
    bg: "bg-orange-500/5",
    border: "border-orange-500/20",
    emoji: "🔥",
  },
  "partner-challenged": {
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    accent: "text-amber-600",
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    emoji: "⚠️",
  },
}

/* ------------------------------------------------------------------ */
/*  Individual notification card                                      */
/* ------------------------------------------------------------------ */
function NotificationCard({
  notification,
  onDismiss,
}: {
  notification: NotificationData
  onDismiss: (id: string) => void
}) {
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(100)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const config = TYPE_CONFIG[notification.type]
  const AUTO_DISMISS_MS = 5000

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss(notification.id), 300)
  }, [notification.id, onDismiss])

  useEffect(() => {
    if (notification.persistent) return

    const step = 50
    const decrement = (step / AUTO_DISMISS_MS) * 100

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement
        return next < 0 ? 0 : next
      })
    }, step)

    timerRef.current = setTimeout(() => {
      dismiss()
    }, AUTO_DISMISS_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [dismiss, notification.persistent])

  /* Pause auto-dismiss on hover */
  function handleMouseEnter() {
    if (notification.persistent) return
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  function handleMouseLeave() {
    if (notification.persistent) return

    const remainMs = (progress / 100) * AUTO_DISMISS_MS
    if (remainMs <= 0) {
      dismiss()
      return
    }

    const step = 50
    const decrement = (step / AUTO_DISMISS_MS) * 100

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement
        return next < 0 ? 0 : next
      })
    }, step)

    timerRef.current = setTimeout(() => {
      dismiss()
    }, remainMs)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden rounded-xl border shadow-lg shadow-foreground/[0.04] transition-all duration-300
        ${config.bg} ${config.border}
        ${exiting
          ? "translate-y-[-8px] scale-95 opacity-0"
          : "translate-y-0 scale-100 opacity-100 animate-in slide-in-from-top-2 fade-in-0"
        }
      `}
      role="alert"
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/60">
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">
            {notification.message}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {formatTimeAgo(notification.timestamp)}
          </p>
        </div>

        {/* Action button (if applicable) */}
        {notification.actionLabel && notification.onAction && (
          <Button
            variant="outline"
            size="sm"
            className={`shrink-0 text-xs ${config.accent}`}
            onClick={() => {
              notification.onAction?.()
              dismiss()
            }}
          >
            {notification.actionLabel}
          </Button>
        )}

        {/* Dismiss X */}
        <button
          onClick={dismiss}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {!notification.persistent && (
        <div className="h-0.5 w-full bg-foreground/5">
          <div
            className={`h-full transition-[width] ease-linear ${
              notification.type === "partner-challenged"
                ? "bg-amber-400/50"
                : notification.type === "streak-milestone"
                  ? "bg-orange-400/50"
                  : "bg-primary/30"
            }`}
            style={{ width: `${progress}%`, transitionDuration: "50ms" }}
          />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stack container -- renders at the top of the dashboard            */
/* ------------------------------------------------------------------ */
export function NotificationStack({
  notifications,
  onDismiss,
}: {
  notifications: NotificationData[]
  onDismiss: (id: string) => void
}) {
  if (notifications.length === 0) return null

  return (
    <div
      className="fixed left-1/2 top-[72px] z-50 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hook for managing notifications                                   */
/* ------------------------------------------------------------------ */
export function useNotifications(initial: NotificationData[] = []) {
  const [items, setItems] = useState<NotificationData[]>(initial)

  const push = useCallback((n: Omit<NotificationData, "id" | "timestamp">) => {
    setItems((prev) => [
      ...prev,
      {
        ...n,
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date(),
      },
    ])
  }, [])

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { items, push, dismiss }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return "Just now"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  return `${hr}h ago`
}
