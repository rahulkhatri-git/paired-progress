"use client"

import { Trophy } from "lucide-react"

interface PointsBarProps {
  yourName: string
  yourPoints: number
  partnerName: string
  partnerPoints: number
}

export function PointsBar({
  yourName,
  yourPoints,
  partnerName,
  partnerPoints,
}: PointsBarProps) {
  const youWinning = yourPoints >= partnerPoints
  const diff = Math.abs(yourPoints - partnerPoints)

  return (
    <div className="border-b border-border/60 bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
            {yourName.charAt(0)}
          </div>
          <span className="text-sm font-medium text-foreground">{yourName}</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {yourPoints} pts
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-medium text-muted-foreground">
            {youWinning
              ? `You're ahead by ${diff}!`
              : diff === 0
                ? "Tied!"
                : `${partnerName} leads by ${diff}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600">
            {partnerPoints} pts
          </span>
          <span className="text-sm font-medium text-foreground">{partnerName}</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/15 text-xs font-bold text-orange-600">
            {partnerName.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  )
}
