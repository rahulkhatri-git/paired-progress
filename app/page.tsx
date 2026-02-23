"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function Home() {
  const [view, setView] = useState<View>("landing")
  const [authOpen, setAuthOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

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
          setView("onboarding")
        }}
      />
    </div>
  )
}
