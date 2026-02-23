"use client"

import { useState, useCallback } from "react"
import { ArrowLeft, ArrowRight, Check, Copy, Mail, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StepHabitForm } from "./step-habit-form"
import { StepMotivation } from "./step-motivation"

interface OnboardingFlowProps {
  onComplete: () => void
}

const steps = [
  { label: "Invite Partner", number: 1 },
  { label: "Create Habit", number: 2 },
  { label: "Your Why", number: 3 },
]

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [partnerEmail, setPartnerEmail] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(
      `https://pairedprogress.app/invite?ref=${Date.now()}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
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
            <span className="text-sm font-bold text-foreground">Setup</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="mx-auto w-full max-w-2xl px-6 pt-6">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 rounded-full transition-colors ${
                      index < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <span
                className={`hidden text-[11px] font-medium sm:block ${
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8">
        {currentStep === 0 && (
          <div className="flex flex-1 flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Invite your partner
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Habits are better together. Send an invite so you can hold each other accountable.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="partner-email">Partner email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="partner-email"
                    type="email"
                    placeholder="partner@example.com"
                    className="pl-10"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {"We'll"} send them an invite to join your shared space.
                </p>
              </div>

              <div className="relative flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">
                  or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Share invite link</Label>
                <div className="flex gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-secondary/50 px-3 py-2">
                    <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm text-muted-foreground">
                      pairedprogress.app/invite/...
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="gap-2 shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <p className="mb-4 text-center text-xs text-muted-foreground">
                You can also skip this step and invite your partner later.
              </p>
            </div>
          </div>
        )}

        {currentStep === 1 && <StepHabitForm />}
        {currentStep === 2 && <StepMotivation />}

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-border/60 pt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} className="gap-2">
            {currentStep === steps.length - 1 ? (
              <>
                Complete Setup
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
