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
              GCA and Big Five personality scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasResults ? (
              <div className="space-y-4 py-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <p className="text-muted-foreground">
                  No results available yet. Assessment may still be in progress.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* GCA */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">General Cognitive Ability (GCA)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Raw Score</dt>
                      <dd className="text-2xl font-bold">{result.gca_score}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Percentile</dt>
                      <dd className="text-2xl font-bold">{result.gca_percentile}%</dd>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personality */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Big Five Personality Traits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {Object.entries(result.personality_percentiles || {}).map(([trait, percentile]) => (
                      <div key={trait}>
                        <dt className="text-sm font-medium capitalize text-muted-foreground">
                          {trait.replace('_', ' ')}
                        </dt>
                        <dd className="text-xl font-bold">FILL IN WITH PERCENTILE SCORE--percentile%</dd>
                        <dd className="text-sm text-muted-foreground">
                          (Raw score: {result.personality_scores?.[trait as keyof typeof result.personality_scores] ?? 'N/A'})
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}