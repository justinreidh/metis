'use client'

import MetricInfo from '@/components/MetricInfo'

type Props = {
  score: number
  
}

function level(score: number) {
  if (score >= 75) return 'high'
  if (score >= 50) return 'moderate'
  return 'low'
}

function interpretation(score: number) {
  const lvl = level(score)

  if (lvl === 'high') {
    return `A high cognitive ability score indicates strong reasoning skills, fast learning capacity, and effective problem-solving under novel or complex conditions. Individuals in this range typically adapt quickly to new environments and can process abstract information with ease. This level is strongly associated with high performance in analytical, technical, and fast-paced roles. They are often able to outperform peers in tasks requiring pattern recognition and strategic thinking.`
  }

  if (lvl === 'moderate') {
    return `A moderate cognitive ability score indicates solid reasoning and learning ability with reliable performance across most tasks. Individuals in this range can understand new concepts at a reasonable pace and apply structured problem-solving approaches effectively. They may require more time or repetition in highly complex or unfamiliar situations. Overall, this level supports strong performance in most professional environments.`
  }

  return `A lower cognitive ability score indicates that abstract reasoning or rapid problem-solving may require additional time or structure. Individuals in this range often perform best in environments with clear processes, repetition, and well-defined expectations. While complex or fast-changing tasks may be more challenging, performance can be strong in structured and routine roles. External support and clear guidance can significantly improve outcomes.`
}

function barColor(score: number) {
  if (score >= 75) return 'bg-primary'
  if (score >= 50) return 'bg-primary/70'
  return 'bg-muted-foreground'
}

export default function GCATraitBlock({ score}: Props) {
  const lvl = level(score)

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-baseline text-xl font-semibold  text-foreground">
        <MetricInfo
          label="General Cognitive Ability"
          description="Measures reasoning ability, problem-solving speed, and capacity to learn new information. One of the strongest predictors of job performance across roles."
        />

        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">
            {score}%
          </div>
          <div className="text-xs text-muted-foreground">
            {lvl === 'high'
              ? 'High'
              : lvl === 'moderate'
              ? 'Moderate'
              : 'Low'}
          </div>
        </div>
      </div>

      {/* BENCHMARK */}
      <p className="text-sm text-muted-foreground">
        High Performer Benchmark: 75–99% (ideal ~85)
      </p>

      {/* PROGRESS BAR */}
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute h-4 rounded-full transition-all ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
        <div
          className="absolute top-0 h-4 w-1.5 bg-yellow-500 shadow"
          style={{ left: `85%` }}
        />
      </div>

      {/* LABELS */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Low</span>
        <span>High</span>
      </div>

      {/* INTERPRETATION */}
      <p className="text-muted-foreground leading-relaxed">
        {interpretation(score)}
      </p>
    </div>
  )
}