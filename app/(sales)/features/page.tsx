// app/features/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Users, Clock, Target, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">Powerful Features</h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to make smarter, faster, and more confident hiring decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Cognitive Ability Testing</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                Scientifically validated tests that measure problem-solving, logical reasoning, 
                attention to detail, and learning agility.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• General Cognitive Ability (GCA)</li>
                <li>• Verbal, numerical, and abstract reasoning</li>
                <li>• Timed and untimed options</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Big Five Personality Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                Deep insights into work style, team fit, leadership potential, and resilience using 
                the gold-standard Big Five personality model.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Extraversion</li>
                <li>• Agreeableness</li>
                <li>• Conscientiousness</li>
                <li>• Emotional Stability</li>
                <li>• Intellect / Imagination</li>
              </ul>
            </CardContent>
          </Card>

          

          {/* Feature 3 */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Performance Prediction</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className='mb-4'>
                Our weighted overall score helps predict on-the-job success by combining cognitive 
                ability with key personality traits. This allows you to rapidly: 
                
                
              </p>
              <ul className="space-y-2 text-sm">
                    <li>• Predict job performance</li>
                    <li>• See competence beyond the resume</li>
                    <li>• Understand a candidate's workstyle</li>
                    
              </ul>
            </CardContent>
          </Card>

          
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to hire better?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today and see the difference data-driven hiring makes.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Free Trial →</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}