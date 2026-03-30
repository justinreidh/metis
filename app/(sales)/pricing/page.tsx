// app/pricing/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: "Starter",
    price: "49",
    interval: "per month",
    description: "Perfect for small teams and startups",
    features: [
      "Up to 10 assessments per month",
      "Cognitive Ability Tests",
      "Big Five Personality Assessment",
      "Basic reporting",
      "Email support",
      "Candidate self-serve portal"
    ],
    cta: "Start Free Trial",
    popular: false,
    href: "/auth/signup"
  },
  {
    name: "Professional",
    price: "99",
    interval: "per month",
    description: "Best for growing teams",
    features: [
      "Up to 50 assessments per month",
      "Everything in Starter",
      "Advanced analytics & insights",
      "Role-specific benchmarks",
      "Team collaboration tools",
      "Priority email support",
      "API access"
    ],
    cta: "Start Free Trial",
    popular: true,
    href: "/auth/signup"
  },
  {
    name: "Enterprise",
    price: "Custom",
    interval: "",
    description: "For large organizations",
    features: [
      "Unlimited assessments",
      "Everything in Professional",
      "Custom assessment creation",
      "SSO & advanced security",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise option available",
      "SLA & compliance support"
    ],
    cta: "Contact Sales",
    popular: false,
    href: "/contact"
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">Simple, transparent pricing</h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your hiring needs. All plans include a 7-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border-none shadow-xl relative ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-6 py-1 text-sm font-medium">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                  {plan.interval && (
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  )}
                </div>
                <CardDescription className="mt-3">{plan.description}</CardDescription>
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

                <Button 
                  className={`w-full py-6 text-lg ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ / Note */}
        <div className="mt-20 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Have questions about pricing?</h3>
          <p className="text-muted-foreground mb-8">
            Our plans are flexible. Need something custom? We're happy to create a plan that fits your exact needs.
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