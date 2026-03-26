// app/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Image from "next/image"

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col pt-16 md:pt-20">
        {/* Hero Section */}
        <header className="relative bg-gradient-to-br from-background via-background to-muted">
          <div className="container mx-auto px-6 py-24 md:py-32 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground">
                Smarter Hiring Decisions
                <br />
                <span className="text-primary">Start with Better Data</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Metis Talent delivers rapid pre-employment assessments that help recruiters and hiring managers
                identify top talent faster — with science-backed cognitive and personality insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Button size="lg" className="text-lg px-10 py-7 rounded-xl" asChild>
                  <Link href="/auth/signup">
                    Start Free Trial
                  </Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Trusted by growing teams • 7-day free trial • Cancel anytime
              </p>
            </div>
          </div>

          {/* Subtle background pattern using muted colors */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.12),transparent_50%)]"></div>
          </div>
        </header>

        {/* Trust / Stats Bar */}
        <section className="py-12 bg-card border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary">92%</div>
                <p className="text-muted-foreground mt-2">Higher quality hires</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">40%</div>
                <p className="text-muted-foreground mt-2">Faster time-to-hire</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">3.2×</div>
                <p className="text-muted-foreground mt-2">Better prediction of performance</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">24/7</div>
                <p className="text-muted-foreground mt-2">Candidate self-serve testing</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Built for modern hiring teams
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Two powerful, science-backed assessments in one platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {/* Cognitive Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Cognitive Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Evaluate problem-solving, critical thinking, attention to detail and learning ability with rapid, GCA-style tests.
                  </p>
                </CardContent>
              </Card>

              {/* Personality Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Big Five Personality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Understand work style, team fit, leadership potential and resilience using the scientifically-backed Big Five model.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits / How it works */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
                From candidate invite to hiring decision in minutes
              </h2>

              <div className="space-y-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                      <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-bold mb-6 text-foreground">1. Invite Candidates</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Quickly add candidates and automatically send personalized assessment links.
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-2xl p-8 shadow-inner">
                    <div className="aspect-video bg-card rounded-lg shadow-md overflow-hidden relative">
                      <Image
                        src="/candidatelist.png"
                        alt="Candidate list dashboard preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                  <div className="order-1 md:order-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                      <ArrowRight className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-bold mb-6 text-foreground">2. Get Rich Insights</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Receive percentile scores, trait breakdowns, and fit recommendations instantly after completion.
                    </p>
                  </div>
                  <div className="order-2 md:order-1 bg-muted/50 rounded-2xl p-8 shadow-inner">
                    <div className="aspect-video bg-card rounded-lg shadow-md overflow-hidden relative">
                      <Image
                        src="/detailpage.png"
                        alt="Candidate detail dashboard preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Start making better hires today
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
              7-day free trial • Cancel anytime
            </p>

            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-12 py-8 rounded-xl shadow-2xl" 
              asChild
            >
              <Link href="/auth/signup">
                Create Your Free Account →
              </Link>
            </Button>

            <p className="mt-8 opacity-80">
              Already have an account?{' '}
              <Link href="/auth/login" className="underline hover:opacity-100">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-footer text-primary-foreground py-12 ">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold">Metis Talent</h3>
                <p className="mt-2">Science-backed pre-employment assessments</p>
              </div>

              <div className="flex gap-8">
                <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground">Terms</Link>
                <Link href="/contact" className="hover:text-foreground">Contact</Link>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border text-center text-sm">
              © {new Date().getFullYear()} Metis Talent. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}