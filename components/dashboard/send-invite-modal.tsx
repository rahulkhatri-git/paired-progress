"use client"

import { useState } from "react"
import { Copy, Check, Mail, Link as LinkIcon } from "lucide-react"
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
import type { PartnerInvitation } from "@/lib/types/partnerships"

interface SendInviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SendInviteModal({ open, onOpenChange, onSuccess }: SendInviteModalProps) {
  const { createInvitation } = useInvitations()
  const [loading, setLoading] = useState(false)
  const [invitation, setInvitation] = useState<PartnerInvitation | null>(null)
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")

  async function handleCreateInvite() {
    setLoading(true)
    try {
      const invite = await createInvitation(email || undefined)
      if (invite) {
        setInvitation(invite)
        onSuccess?.()
      }
    } finally {
      setLoading(false)
    }
  }

  function handleCopyLink() {
    if (!invitation) return
    
    const inviteUrl = `${window.location.origin}/?invite=${invitation.code}`
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleReset() {
    setInvitation(null)
    setEmail("")
    setCopied(false)
  }

  function handleClose() {
    handleReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <DialogTitle className="text-center">
            {invitation ? "Invitation Ready!" : "Invite Your Partner"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {invitation
              ? "Share this link with your partner to start your journey together."
              : "Create an invite link to connect with your accountability partner."}
          </DialogDescription>
        </DialogHeader>

        {!invitation ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="partner-email">Partner's Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="partner-email"
                  type="email"
                  placeholder="partner@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll send them an email with the invite link
              </p>
            </div>

            <Button 
              onClick={handleCreateInvite} 
              disabled={loading || !email.trim()} 
              className="w-full"
            >
              {loading ? "Sending..." : "Send Invitation Email"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Invitation Code */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Invitation Code
              </div>
              <div className="flex items-center justify-center rounded-lg bg-background p-4">
                <span className="text-3xl font-bold tracking-wider text-primary">
                  {invitation.code}
                </span>
              </div>
            </div>

            {/* Copy Link Button */}
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Invite Link
                </>
              )}
            </Button>

            {/* Info */}
            <div className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">How it works:</p>
              <ol className="ml-4 list-decimal space-y-1 text-xs">
                <li>Share the link or code with your partner</li>
                <li>They'll sign up or log in</li>
                <li>They enter the code to connect</li>
                <li>Start tracking habits together!</li>
              </ol>
            </div>

            {/* Expiry Notice */}
            <p className="text-center text-xs text-muted-foreground">
              This invite expires in 7 days
            </p>

            <Button onClick={handleClose} variant="outline" className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
