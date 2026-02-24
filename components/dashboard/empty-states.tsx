"use client"

import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Copy, PartyPopper } from "lucide-react"
import { useState } from "react"

/* ------------------------------------------------------------------ */
/*  Shared wrapper for consistent spacing, alignment, & card surface  */
/* ------------------------------------------------------------------ */
function EmptyShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 py-14 text-center ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Inline SVG illustrations (warm teal palette, no external assets)  */
/* ------------------------------------------------------------------ */

function RocketIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      {/* Sky circle */}
      <circle cx="60" cy="60" r="56" fill="oklch(0.94 0.02 168)" />
      {/* Stars */}
      <circle cx="30" cy="28" r="2" fill="oklch(0.55 0.15 168)" opacity="0.4" />
      <circle cx="88" cy="35" r="1.5" fill="oklch(0.55 0.15 168)" opacity="0.3" />
      <circle cx="45" cy="16" r="1" fill="oklch(0.55 0.15 168)" opacity="0.5" />
      <circle cx="78" cy="20" r="1.5" fill="oklch(0.55 0.15 168)" opacity="0.35" />
      {/* Rocket body */}
      <path
        d="M60 28C60 28 50 50 50 70C50 78 54 85 60 88C66 85 70 78 70 70C70 50 60 28 60 28Z"
        fill="oklch(0.55 0.15 168)"
      />
      {/* Window */}
      <circle cx="60" cy="55" r="6" fill="oklch(0.94 0.02 168)" />
      <circle cx="60" cy="55" r="4" fill="oklch(0.65 0.12 168)" />
      {/* Fins */}
      <path d="M50 72L40 82L50 80Z" fill="oklch(0.65 0.12 168)" />
      <path d="M70 72L80 82L70 80Z" fill="oklch(0.65 0.12 168)" />
      {/* Flame */}
      <ellipse cx="60" cy="92" rx="5" ry="8" fill="#f59e0b" opacity="0.8" />
      <ellipse cx="60" cy="94" rx="3" ry="5" fill="#fbbf24" />
    </svg>
  )
}

function PartnerIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      {/* Background */}
      <circle cx="60" cy="60" r="56" fill="oklch(0.94 0.02 168)" />
      {/* Left person */}
      <circle cx="42" cy="48" r="10" fill="oklch(0.55 0.15 168)" />
      <path d="M26 82C26 70 33 62 42 62C51 62 58 70 58 82" fill="oklch(0.55 0.15 168)" opacity="0.7" />
      {/* Right person */}
      <circle cx="78" cy="48" r="10" fill="oklch(0.65 0.12 168)" />
      <path d="M62 82C62 70 69 62 78 62C87 62 94 70 94 82" fill="oklch(0.65 0.12 168)" opacity="0.7" />
      {/* Heart connector */}
      <path
        d="M60 60C60 55 55 50 52 53C50 56 60 66 60 66C60 66 70 56 68 53C65 50 60 55 60 60Z"
        fill="#f87171"
        opacity="0.8"
      />
      {/* Dashed link */}
      <line x1="52" y1="70" x2="68" y2="70" stroke="oklch(0.55 0.15 168)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
    </svg>
  )
}

function CelebrationIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      {/* Background */}
      <circle cx="60" cy="60" r="56" fill="oklch(0.94 0.02 168)" />
      {/* Trophy */}
      <path d="M48 45H72V55C72 63 67 70 60 72C53 70 48 63 48 55V45Z" fill="#f59e0b" />
      <rect x="55" y="72" width="10" height="8" rx="1" fill="#d97706" />
      <rect x="50" y="80" width="20" height="4" rx="2" fill="#d97706" />
      {/* Trophy handles */}
      <path d="M48 48C44 48 40 52 40 56C40 60 44 62 48 62" stroke="#f59e0b" strokeWidth="3" fill="none" />
      <path d="M72 48C76 48 80 52 80 56C80 60 76 62 72 62" stroke="#f59e0b" strokeWidth="3" fill="none" />
      {/* Star on trophy */}
      <path d="M60 52L62 56L66 57L63 60L64 64L60 62L56 64L57 60L54 57L58 56Z" fill="oklch(0.94 0.02 168)" />
      {/* Confetti */}
      <rect x="30" y="30" width="4" height="4" rx="1" fill="oklch(0.55 0.15 168)" transform="rotate(20 32 32)" opacity="0.7" />
      <rect x="85" y="35" width="3" height="6" rx="1" fill="#f87171" transform="rotate(-15 87 38)" opacity="0.6" />
      <rect x="35" y="75" width="4" height="3" rx="1" fill="#f59e0b" transform="rotate(30 37 77)" opacity="0.5" />
      <rect x="80" y="70" width="5" height="3" rx="1" fill="oklch(0.65 0.12 168)" transform="rotate(-25 83 72)" opacity="0.6" />
      <circle cx="25" cy="50" r="2" fill="oklch(0.55 0.15 168)" opacity="0.4" />
      <circle cx="95" cy="55" r="2.5" fill="#f59e0b" opacity="0.4" />
      <circle cx="40" cy="20" r="1.5" fill="#f87171" opacity="0.5" />
      <circle cx="80" cy="22" r="2" fill="oklch(0.65 0.12 168)" opacity="0.45" />
    </svg>
  )
}

function WaitingIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      {/* Background */}
      <circle cx="60" cy="60" r="56" fill="oklch(0.94 0.02 168)" />
      {/* Clock body */}
      <circle cx="60" cy="58" r="24" fill="oklch(0.55 0.15 168)" opacity="0.15" />
      <circle cx="60" cy="58" r="22" stroke="oklch(0.55 0.15 168)" strokeWidth="2.5" fill="none" />
      {/* Clock hands */}
      <line x1="60" y1="58" x2="60" y2="44" stroke="oklch(0.55 0.15 168)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="58" x2="72" y2="58" stroke="oklch(0.55 0.15 168)" strokeWidth="2" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="60" cy="58" r="2.5" fill="oklch(0.55 0.15 168)" />
      {/* Hour markers */}
      <circle cx="60" cy="39" r="1.5" fill="oklch(0.55 0.15 168)" opacity="0.6" />
      <circle cx="79" cy="58" r="1.5" fill="oklch(0.55 0.15 168)" opacity="0.6" />
      <circle cx="60" cy="77" r="1.5" fill="oklch(0.55 0.15 168)" opacity="0.6" />
      <circle cx="41" cy="58" r="1.5" fill="oklch(0.55 0.15 168)" opacity="0.6" />
      {/* Zzz */}
      <text x="82" y="38" fill="oklch(0.55 0.15 168)" fontSize="10" fontWeight="600" opacity="0.5">z</text>
      <text x="88" y="30" fill="oklch(0.55 0.15 168)" fontSize="12" fontWeight="600" opacity="0.4">z</text>
      <text x="95" y="22" fill="oklch(0.55 0.15 168)" fontSize="14" fontWeight="600" opacity="0.3">z</text>
    </svg>
  )
}

/* ================================================================== */
/*  1. No Habits Yet                                                  */
/* ================================================================== */
export function EmptyNoHabits({ onCreateHabit }: { onCreateHabit: () => void }) {
  return (
    <EmptyShell>
      <RocketIllustration />
      <h3 className="mt-5 text-lg font-bold text-foreground text-balance">
        Create your first habit
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Start small, aim high. Set up a habit you and your partner can work on
        together and watch each other grow.
      </p>
      <Button onClick={onCreateHabit} className="mt-6 gap-2">
        <Plus className="h-4 w-4" />
        Create a Habit
      </Button>
    </EmptyShell>
  )
}

/* ================================================================== */
/*  2. No Partner Linked                                              */
/* ================================================================== */
interface EmptyNoPartnerProps {
  onSendInvite?: () => void
  onAcceptInvite?: () => void
}

export function EmptyNoPartner({ onSendInvite, onAcceptInvite }: EmptyNoPartnerProps) {
  return (
    <EmptyShell>
      <PartnerIllustration />
      <h3 className="mt-5 text-lg font-bold text-foreground text-balance">
        Invite your accountability partner
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Everything is better together. Send your partner an invite link and start
        building habits side by side.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <Button onClick={onSendInvite} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Send Invite
        </Button>
        <Button variant="outline" className="gap-2" onClick={onAcceptInvite}>
          <Copy className="h-4 w-4" />
          Accept Invite
        </Button>
      </div>
    </EmptyShell>
  )
}

/* ================================================================== */
/*  3. All Habits Done Today                                          */
/* ================================================================== */
export function EmptyAllDone() {
  return (
    <EmptyShell>
      <CelebrationIllustration />
      <h3 className="mt-5 text-lg font-bold text-foreground text-balance">
        {"You're all caught up!"}
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Every habit checked off for today. Enjoy the rest of your evening --
        you both earned it.
      </p>
      <div className="mt-5 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
        <PartyPopper className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-primary">Great job, team!</span>
      </div>
    </EmptyShell>
  )
}

/* ================================================================== */
/*  4. No Pending Reviews                                             */
/* ================================================================== */
export function EmptyNoPendingReviews() {
  return (
    <EmptyShell>
      <WaitingIllustration />
      <h3 className="mt-5 text-lg font-bold text-foreground text-balance">
        {"Your partner hasn't logged anything yet"}
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        No habits are waiting for your review. Check back later or send a
        friendly nudge.
      </p>
      <Button variant="outline" className="mt-6">
        Send a Nudge
      </Button>
    </EmptyShell>
  )
}
