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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50" 
          asChild
        >
          <a href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </a>
        </Button>

        {/* Candidate Name + Personal Info Inline */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {candidate.name}
          </h1>
          
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>{' '}
              <span className="font-medium">{candidate.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>{' '}
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
              <span className="text-gray-500">Added on:</span>{' '}
              <span className="font-medium">
                {new Date(candidate.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        

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
                <AlertCircle className="h-14 w-14 text-gray-400 mb-4" />
                <h3 className="text-2xl font-medium text-gray-700">No results available yet</h3>
                <p className="text-gray-600 mt-3 max-w-md">
                  This candidate has not completed the assessment or the results are still being processed.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Overall Score - Prominent Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-10 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow">
                      <Trophy className="h-12 w-12 text-amber-500" />
                    </div>
                  </div>
                  
                  <p className="uppercase tracking-widest text-indigo-600 text-sm font-medium mb-2">
                    Overall Candidate Score
                  </p>
                  <div className="text-7xl font-bold text-gray-900 tracking-tighter">
                    {result.overall_score}
                    <span className="text-4xl font-normal text-gray-400">/100</span>
                  </div>
                  <p className="mt-4 text-gray-600 max-w-md mx-auto">
                    This score combines cognitive ability and key personality traits, 
                    weighted toward the strongest predictors of job performance.
                  </p>
                  <a href='/learn'>
                    <p className="font-medium mb-2">How this score is calculated</p>
                  </a>
                  
                </div>

                
                <Separator />

                {/* GCA Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-6">General Cognitive Ability (GCA)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-sm text-gray-500">Raw Score</p>
                      <p className="text-4xl font-bold mt-2">{result.gca_score}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Percentile</p>
                      <p className="text-4xl font-bold mt-2 text-indigo-600">{result.gca_percentile}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-3">High Performer Benchmark</p>
                      <div className="relative">
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
                            style={{ width: `${result.gca_percentile}%` }}
                          />
                        </div>
                        <div
                          className="absolute top-0 h-3 w-1 bg-yellow-500 shadow"
                          style={{ left: '85%' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
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
                  <h3 className="text-xl font-semibold mb-6">Big Five Personality Traits</h3>
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
                            <h4 className="font-medium text-lg capitalize">
                              {trait.replace('_', ' ')}
                            </h4>
                            <div className="text-right">
                              <span className="text-3xl font-bold">{score}%</span>
                              {raw !== null && (
                                <span className="text-sm text-gray-500 ml-3">(Raw: {raw})</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-2">
                              High Performer Benchmark: {benchmark.min}–{benchmark.max}% (ideal ~{benchmark.ideal})
                            </p>
                            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="absolute h-4 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all"
                                style={{ width: `${score}%` }}
                              />
                              <div
                                className="absolute top-0 h-4 w-1.5 bg-yellow-500 shadow"
                                style={{ left: `${benchmark.ideal}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                              <span>Low</span>
                              <span>Mid</span>
                              <span>High</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-6 text-sm text-gray-500 italic border-t">
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