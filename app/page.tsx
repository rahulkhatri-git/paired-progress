"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TierSection } from "@/components/landing/tier-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { AuthModal } from "@/components/auth-modal"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { useAuth } from "@/lib/auth-context"

type View = "landing" | "onboarding" | "complete"

function HomeContent() {
  const [view, setView] = useState<View>("landing")
  const [authOpen, setAuthOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const inviteCode = searchParams.get('invite')

  useEffect(() => {
    if (!loading && user) {
      // If user is logged in and there's an invite code, redirect to accept it
      if (inviteCode) {
        router.push(`/invite/${inviteCode}`)
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router, inviteCode])

  // Auto-open auth modal if there's an invite code
  useEffect(() => {
    if (inviteCode && !user && !loading) {
      setAuthOpen(true)
    }
  }, [inviteCode, user, loading])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (view === "onboarding") {
    return <OnboardingFlow onComplete={() => setView("complete")} />
  }

  if (view === "complete") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {"You're all set!"}
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Your first habit is created and your partner invite is on the way. Start logging today and build momentum together.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-8 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <main>
        <HeroSection onOpenAuth={() => setAuthOpen(true)} />
        {inviteCode && !user && (
          <div className="bg-primary/5 border-y border-primary/20 py-4">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <p className="text-sm font-medium text-primary">
                🎉 You've been invited to join Paired Progress! Sign up to accept the invitation.
              </p>
            </div>
          </div>
        )}
        <FeaturesSection />
        <HowItWorksSection />
        <TierSection />
        <CTASection onOpenAuth={() => setAuthOpen(true)} />
      </main>
      <Footer />
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          setAuthOpen(false)
          // If there's an invite code, user will be redirected by the effect above
          if (!inviteCode) {
            setView("onboarding")
          }
        }}
      />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
