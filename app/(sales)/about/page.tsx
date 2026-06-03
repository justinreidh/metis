// app/about/page.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">About Metis</h1>
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
            <h2 className="text-3xl font-semibold mb-6">The Science of Better Hiring</h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                For decades, organizations have relied primarily on resumes, interviews,
                and intuition when making hiring decisions. While these methods remain
                common, research consistently shows that they are often poor predictors
                of future job performance when used alone.
                </p>

                <p>
                Industrial-organizational psychologists have spent more than a century
                studying what actually predicts workplace success. Across thousands of
                studies involving millions of employees, two factors repeatedly emerge
                as among the strongest predictors of performance:
                <strong> General Cognitive Ability (GCA)</strong> and
                <strong> personality traits</strong>.
                </p>

                <p>
                At Metis, we build our assessments around these evidence-based predictors,
                helping organizations move beyond guesswork and toward hiring decisions
                grounded in scientific research.
                </p>
            </div>
            </section>

            <section>
            <h2 className="text-3xl font-semibold mb-8">
                Why General Cognitive Ability Matters
            </h2>

            <div className="bg-card p-8 rounded-2xl border">
                <div className="space-y-6 text-muted-foreground">
                <p>
                    General Cognitive Ability—sometimes called general intelligence or
                    "g"—measures an individual's capacity to learn, reason, solve
                    problems, identify patterns, and adapt to new situations.
                </p>

                <p>
                    Decades of meta-analytic research have found that cognitive ability
                    is one of the strongest predictors of job performance across virtually
                    every industry. Employees with stronger cognitive abilities tend to:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                    <li>Learn new skills more quickly</li>
                    <li>Adapt faster to changing environments</li>
                    <li>Solve complex problems more effectively</li>
                    <li>Require less time to reach full productivity</li>
                    <li>Perform better in training and development programs</li>
                </ul>

                <p>
                    The predictive power of cognitive ability becomes even stronger as
                    job complexity increases, making it particularly valuable when hiring
                    for professional, technical, managerial, and leadership roles.
                </p>
                </div>
            </div>
            </section>

            <section>
            <h2 className="text-3xl font-semibold mb-8">
                The Role of Personality
            </h2>

            <div className="bg-card p-8 rounded-2xl border">
                <div className="space-y-6 text-muted-foreground">
                <p>
                    Cognitive ability explains how effectively someone can learn and solve
                    problems. Personality helps explain how they are likely to behave once
                    they are on the job.
                </p>

                <p>
                    Metis uses assessments based on the Big Five personality framework,
                    one of the most extensively researched models in psychology.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                    <h4 className="font-semibold text-foreground mb-2">
                        Conscientiousness
                    </h4>
                    <p>
                        Associated with reliability, organization, persistence, and
                        achievement orientation. Research consistently identifies
                        conscientiousness as one of the strongest personality predictors
                        of job performance.
                    </p>
                    </div>

                    <div>
                    <h4 className="font-semibold text-foreground mb-2">
                        Extraversion
                    </h4>
                    <p>
                        Often valuable in leadership, sales, customer-facing, and team-based
                        roles where communication and influence are important.
                    </p>
                    </div>

                    <div>
                    <h4 className="font-semibold text-foreground mb-2">
                        Agreeableness
                    </h4>
                    <p>
                        Associated with cooperation, teamwork, empathy, and positive
                        workplace relationships.
                    </p>
                    </div>

                    <div>
                    <h4 className="font-semibold text-foreground mb-2">
                        Emotional Stability
                    </h4>
                    <p>
                        Linked to resilience, stress tolerance, and the ability to perform
                        effectively under pressure.
                    </p>
                    </div>
                </div>

                <p>
                    Different roles require different behavioral strengths. Personality
                    assessments help organizations identify candidates whose natural
                    tendencies align with the demands of the position.
                </p>
                </div>
            </div>
            </section>

            <section>
            <h2 className="text-3xl font-semibold mb-8">
                Why We Measure Both
            </h2>

            <div className="bg-card p-8 rounded-2xl border">
                <div className="space-y-6 text-muted-foreground">
                <p>
                    The most effective hiring systems do not rely on a single measure.
                    Cognitive ability and personality provide complementary information.
                </p>

                <p>
                    Cognitive ability helps predict how quickly someone can learn and solve
                    problems. Personality helps predict how they are likely to approach
                    their work, collaborate with others, and respond to challenges.
                </p>

                <p>
                    When combined, these assessments provide a more complete picture of
                    candidate potential than resumes or unstructured interviews alone.
                </p>

                <p>
                    Our goal is not to replace human judgment—it is to augment it with
                    objective, scientifically validated data that improves hiring accuracy
                    and reduces costly hiring mistakes.
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
                Metis Talent was created to bridge the gap between academic research and real-world hiring needs.
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
            Make data-backed hiring decisions with Metis Talent.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}