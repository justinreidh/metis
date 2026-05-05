'use client'

import React from 'react'

interface Props {
  name: string
  gca: number
  conscientiousness: number
  emotional_stability: number
  agreeableness: number
  extraversion: number
  openness: number
}

function level(score: number) {
  if (score >= 75) return 'high'
  if (score >= 50) return 'moderate'
  return 'low'
}

function levelLabel(lvl: string) {
  if (lvl === 'high') return 'strong'
  if (lvl === 'moderate') return 'moderate'
  return 'weak'
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="py-6 border-t border-border first:border-t-0 first:pt-0">
      <h4 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h4>
      <div className="text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  )
}

export default function CandidateDeepAnalysis({
  name,
  gca,
  conscientiousness,
  emotional_stability,
  agreeableness,
  extraversion,
  openness,
}: Props) {
  const gcaLevel = level(gca)
  const consLevel = level(conscientiousness)
  const estLevel = level(emotional_stability)

  return (
    <div className="mt-12">
      {/* SINGLE UNIFIED CARD */}
      <div className="bg-card border border-border rounded-2xl p-8 space-y-8">

        {/* HEADER */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            General Candidate Overview
          </h3>

          <p className="text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">{name}</span> scores in the{' '}
            <span className="font-medium">{gca}th percentile</span> for cognitive ability,
            the <span className="font-medium">{conscientiousness}th percentile</span> for conscientiousness,
            and the <span className="font-medium">{emotional_stability}th percentile</span> for emotional stability.
          </p>

          <p className="text-muted-foreground leading-relaxed mt-4">
            This suggests a{' '}
            <span className="font-medium text-foreground">{levelLabel(gcaLevel)}</span>{' '}
            level of cognitive ability, a{' '}
            <span className="font-medium text-foreground">{levelLabel(consLevel)}</span>{' '}
            level of conscientiousness, and a{' '}
            <span className="font-medium text-foreground">{levelLabel(estLevel)}</span>{' '}
            level of emotional stability.
          </p>
        </div>

        

      </div>
    </div>
  )
}