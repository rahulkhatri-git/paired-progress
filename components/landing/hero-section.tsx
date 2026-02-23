import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onOpenAuth: () => void
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary">
              Couples Habit Tracking
            </span>
          </div>

          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl md:leading-tight">
            Build Better Habits
            <span className="relative inline-block">
              <span className="relative z-10 text-primary"> Together</span>
              <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-primary/10 md:bottom-2 md:h-4" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Track habits with your partner using tiered goals. Celebrate wins together, hold each other accountable, and watch your progress grow side by side.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" onClick={onOpenAuth} className="gap-2 px-8 text-base">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" asChild className="gap-2 px-8 text-base">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          <div className="mt-16 w-full max-w-2xl">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-lg shadow-primary/5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary/20 text-xs font-bold text-primary">
                      A
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-bold text-secondary-foreground">
                      J
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">This Week</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="text-primary">185 pts</span>
                  <span>vs</span>
                  <span>162 pts</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Morning Run", tier: "Gold", value: "5.2 km", icon: "🥇" },
                  { name: "Read Together", tier: "Silver", value: "25 min", icon: "🥈" },
                  { name: "Meal Prep", tier: "Bronze", value: "2 meals", icon: "🥉" },
                  { name: "Meditation", tier: "Gold", value: "15 min", icon: "🥇" },
                ].map((habit) => (
                  <div
                    key={habit.name}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{habit.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{habit.name}</p>
                        <p className="text-xs text-muted-foreground">{habit.value}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary">{habit.tier}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
