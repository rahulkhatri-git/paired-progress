import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CTASectionProps {
  onOpenAuth: () => void
}

export function CTASection({ onOpenAuth }: CTASectionProps) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center md:px-16">
          <div className="absolute inset-0 -z-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground/5" />
          </div>
          <div className="relative z-10">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              Ready to build better habits as a team?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-base text-primary-foreground/80">
              Join couples who are growing stronger together. Free to start, no credit card required.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={onOpenAuth}
              className="mt-8 gap-2 px-8 text-base font-semibold"
            >
              Start Free Today
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
