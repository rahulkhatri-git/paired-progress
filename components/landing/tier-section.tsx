export function TierSection() {
  const tiers = [
    {
      emoji: "\u{1F949}",
      name: "Bronze",
      description: "The baseline. Just show up and get it done. Building consistency is the real win.",
      example: "Run 1 km",
      points: "1 pt",
      color: "border-orange-200 bg-orange-50",
      textColor: "text-orange-700",
      tagColor: "bg-orange-100 text-orange-700",
    },
    {
      emoji: "\u{1F948}",
      name: "Silver",
      description: "Push a little further. This is where growth happens and effort meets intention.",
      example: "Run 3 km",
      points: "3 pts",
      color: "border-slate-200 bg-slate-50",
      textColor: "text-slate-600",
      tagColor: "bg-slate-100 text-slate-700",
    },
    {
      emoji: "\u{1F947}",
      name: "Gold",
      description: "The stretch goal. Hit this and you know you gave it everything. Maximum points.",
      example: "Run 5 km",
      points: "5 pts",
      color: "border-amber-200 bg-amber-50",
      textColor: "text-amber-700",
      tagColor: "bg-amber-100 text-amber-700",
    },
  ]

  return (
    <section id="tiers" className="bg-card py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            Tiered Goal System
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Three levels. One shared mission.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Every habit has three tiers so you always have something to aim for, whether it is a tough day or you are feeling unstoppable.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border ${tier.color} p-6 transition-all duration-200 hover:shadow-md`}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl">{tier.emoji}</span>
                <div>
                  <h3 className={`text-xl font-bold ${tier.textColor}`}>
                    {tier.name}
                  </h3>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${tier.tagColor}`}>
                    {tier.points}
                  </span>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {tier.description}
              </p>
              <div className="rounded-lg border border-border/40 bg-background/80 px-4 py-2.5">
                <p className="text-xs font-medium text-muted-foreground">Example</p>
                <p className="text-sm font-semibold text-foreground">{tier.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
