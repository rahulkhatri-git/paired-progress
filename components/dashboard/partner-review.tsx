/*
 * PHASE 3 FEATURE - NOT IMPLEMENTED YET
 * This component contains dummy/placeholder data and is not functional.
 * TODO: Implement with real partner data and review workflow
 */

"use client"

import { useState } from "react"
import { ArrowLeft, Check, X, MessageCircle, Clock, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ReviewItem {
  id: string
  partnerName: string
  partnerInitial: string
  habitName: string
  tierAchieved: string
  tierMedal: string
  tierValue: string
  logTime: string
  pendingSince: string
  photoUrl?: string
  note?: string
  streak: number
}

const REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    partnerName: "Sarah",
    partnerInitial: "S",
    habitName: "Morning Workout",
    tierAchieved: "Gold",
    tierMedal: "\ud83e\udd47",
    tierValue: "10,500 steps",
    logTime: "Logged 2:34 PM - 3:19 PM",
    pendingSince: "2 hours ago",
    photoUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    note: "Crushed it today! \ud83d\udcaa",
    streak: 12,
  },
  {
    id: "r2",
    partnerName: "Sarah",
    partnerInitial: "S",
    habitName: "Read Together",
    tierAchieved: "Silver",
    tierMedal: "\ud83e\udd48",
    tierValue: "28 min",
    logTime: "Logged 9:15 PM - 9:43 PM",
    pendingSince: "45 min ago",
    streak: 5,
  },
  {
    id: "r3",
    partnerName: "Sarah",
    partnerInitial: "S",
    habitName: "Hydration",
    tierAchieved: "Bronze",
    tierMedal: "\ud83e\udd49",
    tierValue: "6 glasses",
    logTime: "Logged throughout the day",
    pendingSince: "30 min ago",
    note: "Barely made it but I did!",
    streak: 18,
  },
]

interface PartnerReviewProps {
  onBack: () => void
  onChallenge: () => void
}

export function PartnerReview({ onBack, onChallenge }: PartnerReviewProps) {
  const [reviews, setReviews] = useState(REVIEWS)
  const [rejectConfirm, setRejectConfirm] = useState<string | null>(null)
  const [photoExpanded, setPhotoExpanded] = useState<string | null>(null)
  const [swipeX, setSwipeX] = useState<Record<string, number>>({})
  const [swipeStart, setSwipeStart] = useState<Record<string, number>>({})

  function handleApprove(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  function handleReject(id: string) {
    setRejectConfirm(id)
  }

  function confirmReject() {
    if (rejectConfirm) {
      setReviews((prev) => prev.filter((r) => r.id !== rejectConfirm))
      setRejectConfirm(null)
      onChallenge()
    }
  }

  function handleTouchStart(id: string, x: number) {
    setSwipeStart((prev) => ({ ...prev, [id]: x }))
  }

  function handleTouchMove(id: string, x: number) {
    const start = swipeStart[id]
    if (start !== undefined) {
      setSwipeX((prev) => ({ ...prev, [id]: x - start }))
    }
  }

  function handleTouchEnd(id: string) {
    const dx = swipeX[id] || 0
    if (dx > 80) {
      handleApprove(id)
    } else if (dx < -80) {
      handleReject(id)
    }
    setSwipeX((prev) => ({ ...prev, [id]: 0 }))
    setSwipeStart((prev) => {
      const n = { ...prev }
      delete n[id]
      return n
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 md:px-6">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">{"Review Partner's Habits"}</h1>
            <p className="text-xs text-muted-foreground">
              {reviews.length > 0 ? `${reviews.length} pending` : "All caught up"}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 md:px-6">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">All caught up!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No pending reviews right now. Check back later.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="relative overflow-hidden rounded-xl border border-border/60 bg-card"
                onTouchStart={(e) => handleTouchStart(review.id, e.touches[0].clientX)}
                onTouchMove={(e) => handleTouchMove(review.id, e.touches[0].clientX)}
                onTouchEnd={() => handleTouchEnd(review.id)}
                style={{
                  transform: `translateX(${swipeX[review.id] || 0}px)`,
                  transition: swipeX[review.id] ? "none" : "transform 0.3s ease",
                }}
              >
                {/* Swipe indicators */}
                {(swipeX[review.id] || 0) > 20 && (
                  <div className="absolute inset-y-0 left-0 z-10 flex w-16 items-center justify-center bg-primary/20">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                )}
                {(swipeX[review.id] || 0) < -20 && (
                  <div className="absolute inset-y-0 right-0 z-10 flex w-16 items-center justify-center bg-destructive/20">
                    <X className="h-6 w-6 text-destructive" />
                  </div>
                )}

                <div className="p-4">
                  {/* Partner info + pending time */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-600">
                        {review.partnerInitial}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground">{review.partnerName}</span>
                        <p className="text-xs text-muted-foreground">{review.habitName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {review.pendingSince}
                    </div>
                  </div>

                  {/* Tier achieved */}
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-xl">{review.tierMedal}</span>
                    <div>
                      <span className="text-sm font-semibold text-foreground">{review.tierAchieved}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{review.tierValue}</span>
                    </div>
                  </div>

                  {/* Log time */}
                  <p className="mb-3 text-xs text-muted-foreground">{review.logTime}</p>

                  {/* Photo proof */}
                  {review.photoUrl && (
                    <button
                      onClick={() => setPhotoExpanded(review.photoUrl || null)}
                      className="mb-3 w-full overflow-hidden rounded-lg"
                    >
                      <img
                        src={review.photoUrl}
                        alt={`Photo proof for ${review.habitName}`}
                        className="h-40 w-full object-cover transition-transform hover:scale-[1.02]"
                        crossOrigin="anonymous"
                      />
                    </button>
                  )}

                  {/* Note */}
                  {review.note && (
                    <div className="mb-3 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                      <p className="text-sm text-foreground">{review.note}</p>
                    </div>
                  )}

                  {/* Streak */}
                  <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    {review.partnerName} completed this habit {review.streak} days in a row
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(review.id)}
                      className="flex-1 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(review.id)}
                      className="flex-1 gap-1.5"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      aria-label="Ask question"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-muted-foreground">
              Swipe right to approve, swipe left to reject
            </p>
          </div>
        )}
      </main>

      {/* Reject confirmation */}
      <AlertDialog open={!!rejectConfirm} onOpenChange={(open) => !open && setRejectConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this habit log?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? Sarah will be notified that you rejected this completion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject} className="bg-destructive text-white hover:bg-destructive/90">
              Yes, Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo expanded overlay */}
      {photoExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4"
          onClick={() => setPhotoExpanded(null)}
          role="button"
          tabIndex={0}
          aria-label="Close expanded photo"
          onKeyDown={(e) => e.key === "Escape" && setPhotoExpanded(null)}
        >
          <img
            src={photoExpanded}
            alt="Expanded proof photo"
            className="max-h-[80vh] max-w-full rounded-xl object-contain"
            crossOrigin="anonymous"
          />
        </div>
      )}
    </div>
  )
}
