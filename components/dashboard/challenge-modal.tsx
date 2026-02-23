"use client"

import { useState } from "react"
import { AlertTriangle, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface ChallengeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChallengeModal({ open, onOpenChange }: ChallengeModalProps) {
  const [rebuttalMode, setRebuttalMode] = useState(false)
  const [rebuttal, setRebuttal] = useState("")

  function handleAccept() {
    onOpenChange(false)
    setRebuttalMode(false)
    setRebuttal("")
  }

  function handleSubmitRebuttal() {
    setRebuttalMode(false)
    setRebuttal("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 sm:mx-0">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <DialogTitle className="text-amber-600">Habit Challenged</DialogTitle>
          <DialogDescription>
            {"Sarah doesn't think your \"Morning Workout\" qualifies for the tier you logged."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Your original log */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your original log
            </p>
            <div className="flex items-center gap-2">
              <span className="text-base">{"\ud83e\udd47"}</span>
              <span className="text-sm font-semibold text-foreground">45 minutes, Gold tier</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Your note: &quot;Quick gym session&quot;</p>
          </div>

          {/* Partner reason */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600">
              {"Sarah's reason"}
            </p>
            <p className="text-sm text-foreground">
              &quot;Photo shows you at home, not at gym&quot;
            </p>
          </div>

          {/* Rebuttal */}
          {rebuttalMode ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your rebuttal (one chance)
              </p>
              <Textarea
                placeholder="Explain why this should count..."
                value={rebuttal}
                onChange={(e) => setRebuttal(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setRebuttalMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleSubmitRebuttal}
                  disabled={!rebuttal.trim()}
                >
                  Submit Rebuttal
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Info note */}
              <div className="rounded-lg bg-muted/50 px-3 py-2">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {"In case of disagreement, your partner's veto stands. You can submit one rebuttal for Sarah to reconsider."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button onClick={handleAccept} className="w-full">
                  Accept &amp; Remove
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setRebuttalMode(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Submit Rebuttal
                  </Button>
                  <Button variant="outline" className="gap-1.5">
                    <Phone className="h-4 w-4" />
                    Call Partner
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Bottom note */}
          <p className="text-center text-xs text-muted-foreground">
            This habit will be marked as incomplete for today
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
