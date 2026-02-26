"use client"

import { useState } from "react"
import { X, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Habit, HabitLog } from "@/lib/types/habits"
import { format } from "date-fns"

interface ReviewLogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habit: Habit
  log: HabitLog
  partnerName: string
  onApprove: () => Promise<void>
  onChallenge: (reason: string) => Promise<void>
}

export function ReviewLogModal({
  open,
  onOpenChange,
  habit,
  log,
  partnerName,
  onApprove,
  onChallenge,
}: ReviewLogModalProps) {
  const [mode, setMode] = useState<'review' | 'challenge'>('review')
  const [challengeReason, setChallengeReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleApprove = async () => {
    setSubmitting(true)
    try {
      await onApprove()
      onOpenChange(false)
      resetState()
    } finally {
      setSubmitting(false)
    }
  }

  const handleChallengeSubmit = async () => {
    if (!challengeReason.trim()) return
    
    setSubmitting(true)
    try {
      await onChallenge(challengeReason)
      onOpenChange(false)
      resetState()
    } finally {
      setSubmitting(false)
    }
  }

  const resetState = () => {
    setMode('review')
    setChallengeReason('')
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) resetState()
    onOpenChange(open)
  }

  // Get tier display
  const getTierDisplay = () => {
    if (habit.type === 'binary') {
      return log.completed ? '✓ Completed' : 'Not completed'
    }

    if (log.tier_achieved && log.tier_achieved !== 'none') {
      const tierEmoji = {
        bronze: '🥉',
        silver: '🥈',
        gold: '🥇',
      }[log.tier_achieved]
      
      return `${tierEmoji} ${log.tier_achieved.charAt(0).toUpperCase() + log.tier_achieved.slice(1)}`
    }

    return 'No tier achieved'
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 sm:mx-0">
            {mode === 'review' ? (
              <Check className="h-6 w-6 text-primary" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            )}
          </div>
          <DialogTitle>
            {mode === 'review' ? `Review ${partnerName}'s Log` : 'Challenge Log'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'review' 
              ? `${partnerName} logged this habit. Review it to award accountability points.`
              : 'Explain why this log doesn\'t meet the habit standards.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Habit Info */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Habit
            </p>
            <p className="font-semibold text-foreground">{habit.name}</p>
          </div>

          {/* Log Details */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What {partnerName} logged
            </p>
            
            <div className="space-y-2">
              {/* Tier/Completion */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {getTierDisplay()}
                </span>
                {log.value && habit.unit && (
                  <span className="text-sm text-muted-foreground">
                    ({log.value} {habit.unit})
                  </span>
                )}
              </div>

              {/* Time */}
              <p className="text-xs text-muted-foreground">
                Logged {format(new Date(log.logged_at), 'h:mm a')}
              </p>

              {/* Emotion */}
              {log.emotion && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Feeling:</span>
                  <span className="capitalize font-medium">{log.emotion}</span>
                </div>
              )}

              {/* Note */}
              {log.note && (
                <div className="rounded-md bg-background/50 p-2">
                  <p className="text-sm text-foreground">{log.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photo Proof */}
          {log.photo_url && (
            <div className="overflow-hidden rounded-lg border border-border/60">
              <img
                src={log.photo_url}
                alt="Proof photo"
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {mode === 'review' ? (
            /* Review Actions */
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={handleApprove}
                disabled={submitting}
                className="w-full gap-2"
              >
                <Check className="h-4 w-4" />
                {submitting ? 'Approving...' : 'Approve & Award Point'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setMode('challenge')}
                disabled={submitting}
                className="w-full gap-2"
              >
                <X className="h-4 w-4" />
                Challenge This Log
              </Button>
            </div>
          ) : (
            /* Challenge Mode */
            <div className="flex flex-col gap-3 pt-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Reason for challenge *
                </label>
                <Textarea
                  placeholder={`Explain why this doesn't meet the standard...`}
                  value={challengeReason}
                  onChange={(e) => setChallengeReason(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={submitting}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Be specific and constructive. {partnerName} will see this.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setMode('review')}
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleChallengeSubmit}
                  disabled={!challengeReason.trim() || submitting}
                  className="flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Challenge'}
                </Button>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {mode === 'review' 
                ? 'Approved logs earn an extra accountability point. Challenges help maintain habit standards.'
                : 'Challenges are final. Your partner will be notified and this log won\'t count toward their score.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
