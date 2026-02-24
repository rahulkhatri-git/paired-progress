"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInvitations } from "@/lib/hooks/usePartnership"

interface AcceptInviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCode?: string
  onSuccess?: () => void
}

export function AcceptInviteModal({ 
  open, 
  onOpenChange, 
  initialCode = "",
  onSuccess 
}: AcceptInviteModalProps) {
  const { acceptInvitation } = useInvitations()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(initialCode)

  async function handleAccept() {
    if (!code.trim()) return

    setLoading(true)
    try {
      const success = await acceptInvitation(code)
      if (success) {
        onSuccess?.()
        onOpenChange(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Accept Partner Invitation</DialogTitle>
          <DialogDescription className="text-center">
            Enter the 6-character code your partner shared with you.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-code">Invitation Code</Label>
            <Input
              id="invite-code"
              placeholder="ABC123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-2xl font-bold tracking-wider uppercase"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleAccept} 
              disabled={!code.trim() || loading}
            >
              {loading ? "Accepting..." : "Accept Invitation"}
            </Button>
          </div>

          <div className="rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Note:</p>
            <p className="mt-1">
              You can only have one partner at a time. Accepting this invitation will connect you for mutual accountability.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
