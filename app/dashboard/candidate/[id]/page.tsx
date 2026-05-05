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
import MetricInfo from '@/components/MetricInfo'
import CandidateDeepAnalysis from '@/components/CandidateDeepAnalysis'
import PersonalityTraitBlock from '@/components/PersonalityTraitBlock'

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
                {/* Overall Percentile Section */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-10 text-center">
                <p className="uppercase tracking-widest text-primary text-sm font-medium mb-3">
                    Overall Candidate Percentile:
                </p>

                <div
                    className={`text-7xl font-bold tracking-tighter ${
                    result.overall_score >= 75
                        ? 'text-green-600'
                        : result.overall_score >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                >
                    {result.overall_score}
                    
                </div>

                <p className="mt-6 text-muted-foreground">
                    Percentile relative to broader candidate population
                </p>

                <div className="mt-6 max-w-2xl mx-auto">
                    {result.overall_score >= 75 ? (
                    <p className="text-muted-foreground leading-relaxed">
                        This candidate appears <span className="font-medium text-foreground">highly competitive</span>{' '}
                        relative to the broader candidate pool. Strong performance suggests above-average
                        cognitive ability and personality alignment on traits commonly associated with job
                        success, including conscientiousness, emotional stability, and interpersonal fit.
                    </p>
                    ) : result.overall_score >= 50 ? (
                    <p className="text-muted-foreground leading-relaxed">
                        This candidate appears <span className="font-medium text-foreground">above average</span>{' '}
                        overall and may be a strong potential hire depending on role requirements.
                        Results suggest a reasonably solid balance of cognitive ability and workplace-relevant
                        personality traits.
                    </p>
                    ) : (
                    <p className="text-muted-foreground leading-relaxed">
                        This candidate may be <span className="font-medium text-foreground">less competitive</span>{' '}
                        relative to the broader pool. Lower results can indicate weaker alignment on one or
                        more predictive dimensions such as cognitive ability, conscientiousness, or emotional
                        stability, and may warrant additional review.
                    </p>
                    )}
                </div>
                </div>


                {/* Top Predictors Summary */}
                <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                    title: 'General Cognitive Ability',
                    value: result.gca_percentile,
                    description:
                        'Measures reasoning ability, learning speed, and problem-solving.',
                    },
                    {
                    title: 'Conscientiousness',
                    value: Math.round(
                        result.personality_percentiles?.conscientiousness ?? 0
                    ),
                    description:
                        'Strong predictor of reliability, discipline, and follow-through.',
                    },
                    {
                    title: 'Emotional Stability',
                    value: Math.round(
                        result.personality_percentiles?.emotional_stability ?? 0
                    ),
                    description:
                        'Reflects resilience, composure, and performance under stress.',
                    },
                ].map((metric) => {
                    const colorClass =
                    metric.value >= 75
                        ? 'text-blue-500'
                        : metric.value >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'

                    const summary =
                    metric.value >= 75
                        ? 'Strong'
                        : metric.value >= 50
                        ? 'Above Average'
                        : 'Needs Review'

                    return (
                    <Card key={metric.title} className="border shadow-sm">
                        <CardHeader className="pb-3">
                        <CardTitle className="text-base leading-snug">
                            {metric.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {metric.description}
                        </CardDescription>
                        </CardHeader>

                        <CardContent>
                        <div className={`text-3xl font-bold ${colorClass}`}>
                            {metric.value}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {summary}
                        </p>
                        </CardContent>
                    </Card>
                    )
                })}
                </div>

                <CandidateDeepAnalysis
                name={candidate.name}
                gca={result.gca_percentile}
                conscientiousness={result.personality_percentiles.conscientiousness}
                emotional_stability={result.personality_percentiles.emotional_stability}
                agreeableness={result.personality_percentiles.agreeableness}
                extraversion={result.personality_percentiles.extraversion}
                openness={result.personality_percentiles.openness}
                />

            

                <Separator />

                {/* GCA Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-foreground">
                    <MetricInfo
                        label="General Cognitive Ability (GCA)"
                        description="Measures reasoning ability, problem solving, pattern recognition, and learning speed. General cognitive ability is one of the strongest predictors of job performance across roles."
                    />
                    </h3>
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
                  <h3 className="text-xl font-semibold mb-6 text-foreground">Big Five Personality Results</h3>
                  <div className="space-y-10">
                    {Object.entries(result.personality_percentiles || {}).map(([traitKey, percentileValue]) => {
                        const trait = traitKey as keyof typeof HIGH_PERFORMER_BENCHMARKS.personality
                        const benchmark = HIGH_PERFORMER_BENCHMARKS.personality[trait]
                        const score = typeof percentileValue === 'number' ? Math.round(percentileValue) : null

                        if (!benchmark || score === null) return null

                        return (
                        <PersonalityTraitBlock
                            key={trait}
                            trait={trait}
                            score={score}
                            benchmark={benchmark}
                            description={{
                            conscientiousness: 'Reflects organization, discipline, reliability, and follow-through. Often the strongest personality predictor of job performance.', 
                            emotional_stability: 'Measures resilience to stress, emotional regulation, and consistency under pressure.', 
                            agreeableness: 'Captures cooperativeness, empathy, trust, and interpersonal harmony.', 
                            extraversion: 'Reflects sociability, assertiveness, energy, and comfort with interpersonal engagement.', 
                            intellect_imagination: 'Measures curiosity, creativity, adaptability, and receptiveness to new ideas.',
                            }[trait] || 'Personality trait measured by assessment.'}
                        />
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