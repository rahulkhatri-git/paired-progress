import { Target, Users, BarChart3, Trophy, Camera, Shield } from "lucide-react"

const features = [
  {
    icon: Trophy,
    title: "Tiered Goals",
    description:
      "Set Bronze, Silver, and Gold tiers for every habit. Push each other to reach higher every week.",
    badge: "Core",
  },
  {
    icon: Users,
    title: "Partner Accountability",
    description:
      "Review your partner's logs, approve or challenge entries, and keep each other honest.",
    badge: "Social",
  },
  {
    icon: BarChart3,
    title: "Weekly Insights",
    description:
      "Get side-by-side stats, streak tracking, and a weekly winner based on total points earned.",
    badge: "Analytics",
  },
  {
    icon: Target,
    title: "Priority Levels",
    description:
      "Mark habits as Low, Medium, or High priority so you both know what matters most.",
    badge: "Organize",
  },
  {
    icon: Camera,
    title: "Photo Proof",
    description:
      "Require photo evidence for key habits. See it to believe it, then approve or ask questions.",
    badge: "Verify",
  },
  {
    icon: Shield,
    title: "Forgiveness Days",
    description:
      "Life happens. Use forgiveness days to skip a day without breaking your streak.",
    badge: "Flexible",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-card py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            Everything You Need
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Designed for couples who grow together
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Every feature is built with two people in mind. Share, compete, support, and celebrate your progress as a team.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border/60 bg-background p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                  {feature.badge}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
