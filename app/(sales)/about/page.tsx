// app/about/page.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-10" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">About Metis Talent</h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            Building better hiring through science and technology
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-12">
          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Metis Talent, we believe hiring should be driven by data, not intuition. 
              Our mission is to help organizations make better hiring decisions by combining 
              rigorous scientific assessment with modern technology.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6">The Problem We Solve</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Traditional hiring relies heavily on resumes and interviews, which are poor predictors 
              of actual job performance. Studies show that cognitive ability and certain personality 
              traits are far better indicators of success — yet most companies still don't measure them properly.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Approach</h2>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-card p-8 rounded-2xl">
                <h3 className="font-semibold text-xl mb-4">Science First</h3>
                <p className="text-muted-foreground">
                  Our assessments are built on decades of industrial-organizational psychology research. 
                  We use validated tools including General Cognitive Ability tests and the Big Five personality model.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl">
                <h3 className="font-semibold text-xl mb-4">Candidate Experience</h3>
                <p className="text-muted-foreground">
                  We design our assessments to be fair, respectful, and engaging. Candidates receive 
                  a professional experience that reflects well on your organization.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6">Why Metis?</h2>
            <div className="space-y-6 text-muted-foreground">
              <p>
                The name "Metis" comes from Greek mythology, representing wisdom, skill, and practical intelligence. 
                We believe great hiring requires both cognitive sharpness and deep human insight.
              </p>
              <p>
                Founded by a team of I/O psychologists and experienced recruiters, Metis Talent was created 
                to bridge the gap between academic research and real-world hiring needs.
              </p>
            </div>
          </section>

          <section className="bg-card border border-border rounded-3xl p-10">
            <h2 className="text-3xl font-semibold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="font-semibold mb-2">Scientific Rigor</h3>
                <p className="text-sm text-muted-foreground">We never compromise on validity and reliability.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-semibold mb-2">Fairness First</h3>
                <p className="text-sm text-muted-foreground">Every candidate deserves a fair and unbiased process.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-semibold mb-2">Practical Impact</h3>
                <p className="text-sm text-muted-foreground">We build tools that actually move the needle on hiring outcomes.</p>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to hire smarter?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join hundreds of companies making better hiring decisions with Metis Talent.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}