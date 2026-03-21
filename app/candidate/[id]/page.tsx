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
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle } from 'lucide-react'
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
    notFound()
  }

  // Fetch results
  const { data: result, error: resultError } = await supabase
    .from('results')
    .select('*')
    .eq('candidate_id', id)
    .single()

  const hasResults = !!result && !resultError

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header / Back */}
        <div className="mb-10">
          <Button variant="ghost" size="sm" className="mb-6 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50" asChild>
            <a href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </a>
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {candidate.name}
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Candidate details & assessment results
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Personal Information Card */}
          <Card className="border-none shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Personal Information</CardTitle>
              <CardDescription>Basic profile and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-lg font-semibold">{candidate.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-lg">{candidate.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <Badge
                      variant={
                        candidate.status === 'completed'
                          ? 'default'
                          : candidate.status === 'in_progress'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="px-4 py-1 text-sm"
                    >
                      {candidate.status?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Added On</dt>
                  <dd className="mt-1 text-lg">
                    {new Date(candidate.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Results Card */}
          <Card className="border-none shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Assessment Results</CardTitle>
              <CardDescription>
                Scores compared to typical high-performer benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!hasResults ? (
                <div className="space-y-6 py-10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">No results yet</h3>
                    <p className="text-gray-600 mt-2 max-w-md">
                      This candidate has not completed their assessment or results are still processing.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* GCA */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">General Cognitive Ability (GCA)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                      <div>
                        <p className="text-sm text-gray-500">Raw Score</p>
                        <p className="text-3xl font-bold mt-1">{result.gca_score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Percentile</p>
                        <p className="text-3xl font-bold mt-1">{result.gca_percentile}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">High Performer Benchmark</p>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-3 bg-gray-100 rounded-full">
                            <div
                              className="h-3 bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${result.gca_percentile}%` }}
                            />
                          </div>
                          <div
                            className="absolute top-0 h-3 w-1 bg-yellow-500 shadow-sm"
                            style={{ left: '85%' }} // approximate ideal center
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span className="font-medium text-indigo-700">75–99%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-8" />

                  {/* Personality */}
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Big Five Personality Traits</h3>
                    <div className="space-y-8">
                      {Object.entries(result.personality_percentiles || {}).map(([traitKey, percentileValue]) => {
                        const trait = traitKey as keyof typeof HIGH_PERFORMER_BENCHMARKS.personality
                        const benchmark = HIGH_PERFORMER_BENCHMARKS.personality[trait]
                        const score = typeof percentileValue === 'number' ? Math.round(percentileValue) : null
                        const raw = result.personality_scores?.[trait] ?? null

                        if (!benchmark || score === null) return null

                        return (
                          <div key={trait} className="space-y-3">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-medium capitalize text-lg">
                                {trait.replace('_', ' ')}
                              </h4>
                              <div className="text-right">
                                <span className="text-2xl font-bold">{score}%</span>
                                {raw !== null && (
                                  <span className="text-sm text-gray-500 ml-2">(Raw: {raw})</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-2">
                                High Performer Benchmark: {benchmark.min}–{benchmark.max}% (ideal ~{benchmark.ideal})
                              </p>
                              <div className="relative pt-1">
                                <div className="overflow-hidden h-4 bg-gray-100 rounded-full">
                                  <div
                                    className="h-4 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-700"
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                                <div
                                  className="absolute top-0 h-4 w-1.5 bg-yellow-500 shadow-md"
                                  style={{ left: `${benchmark.ideal}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Low</span>
                                <span>Ideal</span>
                                <span>High</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-10 text-sm text-gray-500 italic">
                      Note: Benchmarks are directional averages from research on high performers (e.g., managers, leaders). Conscientiousness is the strongest general predictor of job success.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}