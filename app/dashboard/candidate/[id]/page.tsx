// app/dashboard/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle, Trophy } from 'lucide-react'
import { HIGH_PERFORMER_BENCHMARKS } from '@/lib/constants'

interface CandidatePageProps {
  params: Promise<{ id: string }>
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const { id } = await params

  const supabase = await createClient()

  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single()

  if (candidateError || !candidate) {
    notFound()
  }

  const { data: result, error: resultError } = await supabase
    .from('results')
    .select('*')
    .eq('candidate_id', id)
    .single()

  const hasResults = !!result && !resultError

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        

        {/* Candidate Name + Personal Info Inline */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {candidate.name}
          </h1>
          
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Email:</span>{' '}
              <span className="font-medium text-foreground">{candidate.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>{' '}
              <Badge
                variant={
                  candidate.status === 'completed'
                    ? 'default'
                    : candidate.status === 'in_progress'
                      ? 'secondary'
                      : 'outline'
                }
                className="ml-1"
              >
                {candidate.status?.replace('_', ' ') || 'Unknown'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Added on:</span>{' '}
              <span className="font-medium text-foreground">
                {new Date(candidate.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Assessment Results */}
        <Card className="border-none shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">Assessment Results</CardTitle>
            <CardDescription>
              Compared to typical high-performer benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasResults ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-14 w-14 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-medium text-foreground">No results available yet</h3>
                <p className="text-muted-foreground mt-3 max-w-md">
                  This candidate has not completed the assessment or the results are still being processed.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Overall Score - Prominent Section */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-10 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-background rounded-full shadow">
                      <Trophy className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  
                  <p className="uppercase tracking-widest text-primary text-sm font-medium mb-2">
                    Overall Candidate Score
                  </p>
                  <div className="text-7xl font-bold text-foreground tracking-tighter">
                    {result.overall_score}
                    <span className="text-4xl font-normal text-muted-foreground">/100</span>
                  </div>
                  <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                    This score combines cognitive ability and key personality traits, 
                    weighted toward the strongest predictors of job performance.
                  </p>
                </div>

            

                <Separator />

                {/* GCA Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-foreground">General Cognitive Ability (GCA)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-sm text-muted-foreground">Raw Score</p>
                      <p className="text-4xl font-bold mt-2 text-foreground">{result.gca_score}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Percentile</p>
                      <p className="text-4xl font-bold mt-2 text-primary">{result.gca_percentile}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">High Performer Benchmark</p>
                      <div className="relative">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-3 bg-primary rounded-full"
                            style={{ width: `${result.gca_percentile}%` }}
                          />
                        </div>
                        <div
                          className="absolute top-0 h-3 w-1 bg-yellow-500 shadow"
                          style={{ left: '85%' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>0%</span>
                        <span className="font-medium">75–99%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personality Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-foreground">Big Five Personality Traits</h3>
                  <div className="space-y-10">
                    {Object.entries(result.personality_percentiles || {}).map(([traitKey, percentileValue]) => {
                      const trait = traitKey as keyof typeof HIGH_PERFORMER_BENCHMARKS.personality
                      const benchmark = HIGH_PERFORMER_BENCHMARKS.personality[trait]
                      const score = typeof percentileValue === 'number' ? Math.round(percentileValue) : null
                      const raw = result.personality_scores?.[trait] ?? null

                      if (!benchmark || score === null) return null

                      return (
                        <div key={trait} className="space-y-4">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-medium text-lg capitalize text-foreground">
                              {trait.replace('_', ' ')}
                            </h4>
                            <div className="text-right">
                              <span className="text-3xl font-bold text-foreground">{score}%</span>
                              
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              High Performer Benchmark: {benchmark.min}–{benchmark.max}% (ideal ~{benchmark.ideal})
                            </p>
                            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                              <div
                                className="absolute h-4 bg-primary rounded-full transition-all"
                                style={{ width: `${score}%` }}
                              />
                              <div
                                className="absolute top-0 h-4 w-1.5 bg-yellow-500 shadow"
                                style={{ left: `${benchmark.ideal}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                              <span>Low</span>
                              <span>Ideal</span>
                              <span>High</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-6 text-sm text-muted-foreground italic border-t border-border">
                  Note: Benchmarks are directional averages from research on high performers. 
                  Conscientiousness is the strongest predictor of job success across most roles.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}