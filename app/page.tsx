// app/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Smarter Hiring Decisions
              <br />
              <span className="text-indigo-600">Start with Better Data</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Metis Talent delivers validated pre-employment assessments that help recruiters and hiring managers
              identify top talent faster — with science-backed cognitive and personality insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button size="lg" className="text-lg px-10 py-7 rounded-xl" asChild>
                <Link href="/auth/signup">
                  Start Free Trial
                </Link>
              </Button>
              
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Trusted by growing teams • 7-day free trial • Cancel anytime
            </p>
          </div>
        </div>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.12),transparent_50%)]"></div>
        </div>
      </header>

      {/* Trust / Stats Bar */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600">92%</div>
              <p className="text-gray-600 mt-2">Higher quality hires</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">40%</div>
              <p className="text-gray-600 mt-2">Faster time-to-hire</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">3.2×</div>
              <p className="text-gray-600 mt-2">Better prediction of performance</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">24/7</div>
              <p className="text-gray-600 mt-2">Candidate self-serve testing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Now only 2 cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for modern hiring teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two powerful, science-backed assessments in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl">Cognitive Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Evaluate problem-solving, critical thinking, attention to detail and learning ability with validated GCA-style tests.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Big Five Personality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Understand work style, team fit, leadership potential and resilience using the scientifically-backed Big Five model.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits / How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              From candidate invite to hiring decision in minutes
            </h2>

            <div className="space-y-20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6">1. Invite Candidates</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Add candidates manually or import from your ATS. Send personalized assessment links in seconds.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 shadow-inner">
                  <div className="aspect-video bg-white rounded-lg shadow-md flex items-center justify-center text-gray-400">
                    Candidate invite screen preview
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                <div className="order-1 md:order-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                    
                  </div>
                  <h3 className="text-3xl font-bold mb-6">2. Get Rich Insights</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Receive percentile scores, trait breakdowns, and fit recommendations instantly after completion.
                  </p>
                </div>
                <div className="order-2 md:order-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-inner">
                  <div className="aspect-video bg-white rounded-lg shadow-md flex items-center justify-center text-gray-400">
                    Results dashboard preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Start making better hires today
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
            14-day free trial • No credit card required • Cancel anytime
          </p>

          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-12 py-8 text-indigo-700 bg-white hover:bg-gray-100 rounded-xl shadow-2xl" 
            asChild
          >
            <Link href="/signup">
              Create Your Free Account →
            </Link>
          </Button>

          <p className="mt-8 text-indigo-100">
            Already have an account? <Link href="/login" className="underline hover:text-white">Sign in</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white">Metis Talent</h3>
              <p className="mt-2">Science-backed pre-employment assessments</p>
            </div>

            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © {new Date().getFullYear()} Metis Talent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}