import { UserPlus, ListChecks, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Invite Your Partner",
    description:
      "Sign up and send a quick invite link. Once they join, your habits are linked and the fun begins.",
  },
  {
    icon: ListChecks,
    step: "02",
    title: "Create Tiered Habits",
    description:
      "Set habits with Bronze, Silver, and Gold targets. Choose binary or measurable types, set priorities, and share them.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Track & Compete",
    description:
      "Log daily, review each other's entries, and check weekly insights. Earn points and crown a weekly winner.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            Simple to Start
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Up and running in 3 steps
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-px w-full bg-border md:block" />
              )}
              <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <span className="mb-2 text-xs font-bold tracking-widest text-primary">
                STEP {step.step}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
