// app/pricing/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plan = {
  name: "Professional",
  price: "49",
  interval: "per month",
  description: "Simple, transparent pricing for growing teams",
  features: [
    "Unlimited candidates",
    "Cognitive Ability Assessment (CGA)",
    "Big Five Personality Assessment",
    "Candidate self-serve portal",
    "Basic reporting & insights",
    "Email support"
  ],
  cta: "Start Free Trial",
  href: "/auth/signup"
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            One simple, transparent price
          </h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            Includes a 7-day free trial.
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="border-none shadow-xl w-full max-w-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>

              <div className="mt-4">
                <span className="text-5xl font-bold text-foreground">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>

              <CardDescription className="mt-3">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full py-6 text-lg" asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">
            Have questions about pricing?
          </h3>
          <p className="text-muted-foreground mb-8">
            We’re happy to help with any questions about the platform.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Talk to Sales</Link>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-16">
          All prices are in USD. Cancel anytime. No hidden fees.
        </div>
      </div>
    </div>
  )
}