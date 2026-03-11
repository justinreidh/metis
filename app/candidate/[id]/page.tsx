// app/dashboard/[id]/page.tsx
import { createClient } from '@/lib/supabase/server' // ← Use server client (more secure)
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
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { HIGH_PERFORMER_BENCHMARKS } from '@/lib/constants'


interface CandidatePageProps {
  params: Promise<{ id: string }>
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const { id } = await params

  const supabase = await createClient()

  // Fetch candidate
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single()

  if (candidateError || !candidate) {
    notFound() // Shows Next.js 404 page
  }

  // Fetch results (assuming one row per candidate)
  const { data: result, error: resultError } = await supabase
    .from('results')
    .select('*')
    .eq('candidate_id', id)
    .single()

  // Optional: show loading-like skeleton if no results yet
  const hasResults = !!result && !resultError

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button variant="outline" asChild><a href="/dashboard">← Back to Dashboard</a></Button>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Details</h1>
        <p className="text-muted-foreground">
          Viewing information for {candidate.name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic candidate details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
              <dd className="text-lg font-medium">{candidate.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="text-lg">{candidate.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd>
                <Badge
                  variant={
                    candidate.status === 'completed'
                      ? 'default'
                      : candidate.status === 'in_progress'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {candidate.status?.replace('_', ' ') || 'Unknown'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
              <dd>{new Date(candidate.created_at).toLocaleDateString()}</dd>
            </div>
          </CardContent>
        </Card>

        {/* Scores Card */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Results</CardTitle>
            <CardDescription>
              Compared to high-performer benchmarks (typical for medium-high complexity roles)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasResults ? (
              <div className="space-y-4 py-6">
                
                <p className="text-muted-foreground">
                  No results available yet. Assessment may still be in progress.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* GCA Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">General Cognitive Ability (GCA)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Raw Score</p>
                      <p className="text-2xl font-bold">{result.gca_score}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Percentile</p>
                      <p className="text-2xl font-bold">{result.gca_percentile}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">High Performer Benchmark</p>
                      <div className="space-y-1">
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div
                            className="bg-primary rounded-full h-2.5"
                            style={{ width: `${result.gca_percentile}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span className="font-medium text-primary">75–99% (typical high performer)</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personality Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Big Five Personality Traits (Percentiles)</h3>
                  <div className="space-y-6">
                    {Object.entries(result.personality_percentiles || {}).map(([traitKey, percentileValue]) => {
                      const trait = traitKey as keyof typeof HIGH_PERFORMER_BENCHMARKS.personality
                      const benchmark = HIGH_PERFORMER_BENCHMARKS.personality[trait]
                      const score = typeof percentileValue === 'number' ? Math.round(percentileValue) : null
                      const raw = result.personality_scores?.[trait] ?? null

                      if (!benchmark || score === null) return null

                      return (
                        <div key={trait} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                          <div className="md:col-span-1">
                            <p className="font-medium capitalize">{trait.replace('_', ' ')}</p>
                            <p className="text-2xl font-bold">{score}%</p>
                            {raw !== null && (
                              <p className="text-sm text-muted-foreground">(Raw: {raw})</p>
                            )}
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-sm text-muted-foreground mb-1">
                              High Performer Benchmark: {benchmark.min}–{benchmark.max}% (ideal ~{benchmark.ideal})
                            </p>
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-3 mb-1 text-xs flex rounded bg-secondary">
                                <div
                                  style={{ width: `${score}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                                />
                              </div>
                              {/* Optional: marker for ideal */}
                              <div
                                className="absolute top-0 h-3 w-1 bg-yellow-500"
                                style={{ left: `${benchmark.ideal}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Low</span>
                              
                              <span>High</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-6">
                  <p>Note: Benchmarks are directional averages from research on high performers (e.g., managers, leaders). Conscientiousness is the strongest general predictor of success across roles.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}