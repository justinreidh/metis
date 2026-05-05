'use client'

import MetricInfo from '@/components/MetricInfo'
import { TRAIT_TEXT } from '@/lib/traitText'



type Props = {
  trait: string
  score: number
  benchmark: {
    min: number
    max: number
    ideal: number
  }
  description: string
}

function level(score: number) {
  if (score >= 75) return 'high'
  if (score >= 50) return 'moderate'
  return 'low'
}

function interpretation(trait: string, score: number) {
  const lvl = level(score)

  const name = trait.replace('_', ' ')

  const texts: Record<string, Record<string, string>> = TRAIT_TEXT

  return texts[trait]?.[lvl] || `${name} shows a mixed profile on this dimension.`
}

function formatLabel(trait: string) {
  return trait
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function PersonalityTraitBlock({
  trait,
  score,
  benchmark,
  description,
}: Props) {
  const lvl = level(score)

  const barColor =
    lvl === 'high'
      ? 'bg-primary'
      : lvl === 'moderate'
      ? 'bg-primary/70'
      : 'bg-muted-foreground'

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-baseline">
        <div className="font-semibold">
          <MetricInfo
            label={formatLabel(trait)}
            description={description}
          />
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{score}%</div>
        </div>
      </div>

      {/* BENCHMARK LABEL */}
      <p className="text-sm text-muted-foreground">
        High Performer Benchmark: {benchmark.min}–{benchmark.max}% (ideal ~{benchmark.ideal})
      </p>

      {/* PROGRESS BAR */}
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute h-4 rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
        <div
          className="absolute top-0 h-4 w-1.5 bg-yellow-500 shadow"
          style={{ left: `${benchmark.ideal}%` }}
        />
      </div>

      {/* LABELS */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Low</span>
        <span>High</span>
      </div>

      {/* INTERPRETATION */}
      <p className="text-muted-foreground leading-relaxed">
        {interpretation(trait, score)}
      </p>
    </div>
  )
}