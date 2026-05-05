'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Candidate = {
  id: string
  name: string
  email: string
  results?: { overall_score: number }[]
}

type Props = {
  candidate: Candidate
}

function getScoreColor(score: number) {
  if (score < 25) return 'text-red-600'
  if (score < 50) return 'text-orange-600'
  if (score < 75) return 'text-yellow-600'
  return 'text-green-600'
}

function getDotColor(score: number) {
  if (score < 25) return 'bg-red-600'
  if (score < 50) return 'bg-orange-500'
  if (score < 75) return 'bg-yellow-500'
  return 'bg-green-600'
}

export default function CandidateItem({ candidate }: Props) {
  const score = candidate.results?.[0]?.overall_score
  const hasScore = typeof score === 'number'

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors">

      {/* Left: identity (clickable area) */}
      <Link
        href={`/dashboard/candidate/${candidate.id}`}
        className="flex-1 min-w-0"
      >
        <div className="cursor-pointer">
          <div className="font-medium">{candidate.name}</div>
          <div className="text-sm text-muted-foreground">
            {candidate.email}
          </div>
        </div>
      </Link>

      {/* Right: score + action */}
      <div className="flex items-center gap-6 mt-4 sm:mt-0">

        {/* Score */}
        {hasScore && (
          <div className="flex items-center gap-2">
            
            <div className="text-right">
              <div className={`text-xl font-bold ${getScoreColor(score!)}`}>
                {score}
              </div>
              <div className="text-xs text-muted-foreground">
                Score
              </div>
            </div>
          </div>
        )}

        {!hasScore && (
          <div className="text-sm text-muted-foreground">
            No score yet
          </div>
        )}

        {/* View Details Button */}
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/candidate/${candidate.id}`}>
            View Details
          </Link>
        </Button>

      </div>
    </div>
  )
}