// app/test/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QUESTIONS as PersonalityQuestions, calculateTraitScores, LikertValue, BigFiveTrait } from '@/lib/questions/personality'
import { questions as GCAQuestions } from '@/lib/questions/gca'
import { createClient } from '@/lib/supabase/client'
import GCATest from '../../components/GCATest'
import PersonalityTest from '../../components/PersonalityTest'
import Introduction from '../../components/Introduction'
import TestInstructions from '../../components/TestInstructions'
import { Trophy } from 'lucide-react'

type TestPhase = 
  | 'intro' 
  | 'gca-instructions' 
  | 'gca' 
  | 'personality-instructions' 
  | 'personality' 
  | 'done';

export default function Test() {
  const params = useSearchParams()
  const token = params.get('token')
  const [candidate, setCandidate] = useState<any>(null)
  const [phase, setPhase] = useState<TestPhase>('intro')
  const [gcaResponses, setGcaResponses] = useState<Record<number, number>>({})
  const [personalityResponses, setPersonalityResponses] = useState<Record<number, number>>({})

  const supabase = createClient()

  useEffect(() => {
    async function validateToken() {
      if (!token) return
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('token', token)
        .single()

      if (error || !data) {
        alert('Invalid link. Contact the organization who invited you.')
        return
      }

      if (new Date(data.token_expires) < new Date()) {
        alert('This link has expired. Please request a new one.')
        return
      }

      setCandidate(data)
      await supabase.from('candidates').update({ status: 'in_progress' }).eq('id', data.id)
      setPhase('intro')
    }
    validateToken()
  }, [token, supabase])

  if (!candidate) return <div className="min-h-screen flex items-center justify-center">Loading assessment...</div>

  const handleStartGCA = () => setPhase('gca')
  const handleGcaComplete = (responses: Record<number, number>) => {
    setGcaResponses(responses)
    setPhase('personality-instructions')
  }

  const handleStartPersonality = () => setPhase('personality')

  const handlePersonalityComplete = (responses: Record<number, number>) => {
    setPersonalityResponses(responses)
    handleFinalSubmit(responses)
  }

  // Calculate and store overall score
  const handleFinalSubmit = async (personalityRes: Record<number, number> = personalityResponses) => {
    const finalPersonalityResponses = personalityRes

    // Save raw responses
    await supabase.from('responses').insert([
      { candidate_id: candidate.id, test_type: 'gca', responses: gcaResponses },
      { candidate_id: candidate.id, test_type: 'personality', responses: finalPersonalityResponses },
    ])

    // Calculate scores
    const personalityScores = calculateTraitScores(finalPersonalityResponses as Record<number, LikertValue>)
    const gcaScore = GCAQuestions.reduce(
      (acc, q) => acc + (gcaResponses[q.id] === q.correctIndex ? 1 : 0),
      0
    )

    const bigFiveNorms = {
      extraversion: { mean: 29.5, sd: 8.5 },
      agreeableness: { mean: 35.2, sd: 7.2 },
      conscientiousness: { mean: 33.8, sd: 7.8 },
      emotional_stability: { mean: 30.1, sd: 8.4 },
      intellect_imagination: { mean: 32.4, sd: 7.6 },
    }

    const personalityPercentiles: Record<string, number> = {}
    Object.entries(personalityScores).forEach(([trait, score]) => {
      const { mean, sd } = bigFiveNorms[trait as BigFiveTrait]
      const z = (score - mean) / sd
      personalityPercentiles[trait] = Math.round(cdf(z) * 100)
    })

    const gcaNorms = { mean: 15, sd: 5 }
    const gcaZ = (gcaScore - gcaNorms.mean) / gcaNorms.sd
    const gcaPercentile = Math.round(cdf(gcaZ) * 100)

    // ==================== OVERALL SCORE CALCULATION ====================
    const conscientiousness = personalityPercentiles.conscientiousness || 0
    const otherTraitsAvg = (
      (personalityPercentiles.extraversion || 0) +
      (personalityPercentiles.agreeableness || 0) +
      (personalityPercentiles.emotional_stability || 0) +
      (personalityPercentiles.intellect_imagination || 0)
    ) / 4

    const overallScore = Math.round(
      (gcaPercentile * 0.50) +           // 50% weight
      (conscientiousness * 0.20) +       // 20% weight
      (otherTraitsAvg * 0.30)            // 30% weight
    )
    // =================================================================

    await supabase.from('results').insert({
      candidate_id: candidate.id,
      personality_scores: personalityScores,
      personality_percentiles: personalityPercentiles,
      gca_score: gcaScore,
      gca_percentile: gcaPercentile,
      overall_score: overallScore,           // ← New field
    })

    await supabase
      .from('candidates')
      .update({ status: 'completed', token: null })
      .eq('id', candidate.id)

    setPhase('done')
  }

  function cdf(z: number): number {
    return 1 / (1 + Math.exp(-1.654 * z))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        {phase === 'intro' && <Introduction onBegin={() => setPhase('gca-instructions')} />}

        {phase === 'gca-instructions' && (
          <TestInstructions 
            title="General Cognitive Ability (GCA) Test"
            instructions={`
              <p>This test measures your general reasoning, problem-solving, and critical thinking skills.</p>
              <ul>
                <li>You will have <strong>7 minutes and 30 seconds</strong> to complete all questions.</li>
                <li>Each question has multiple-choice options — select the one you believe is correct.</li>
                <li>The test is timed and will auto-submit when time runs out.</li>
                <li>Answer as quickly and accurately as possible.</li>
              </ul>
              <p style="margin-top: 1.5rem; font-weight: bold;">When you're ready, click "Begin GCA Test".</p>
            `}
            buttonText="Begin GCA Test"
            onStart={handleStartGCA}
          />
        )}

        {phase === 'gca' && <GCATest onComplete={handleGcaComplete} />}

        {phase === 'personality-instructions' && (
          <TestInstructions 
            title="Personality Assessment"
            instructions={`
              <p>This section assesses your typical ways of thinking, feeling, and behaving using the Big Five model.</p>
              <ul>
                <li>You will see a series of statements. For each one, indicate how accurately it describes you.</li>
                <li>There are no right or wrong answers — answer honestly.</li>
                <li>The test is untimed — take as long as you need.</li>
                <li>All questions must be answered to submit.</li>
              </ul>
              <p style="margin-top: 1.5rem; font-weight: bold;">When you're ready, click "Begin Personality Assessment".</p>
            `}
            buttonText="Begin Personality Assessment"
            onStart={handleStartPersonality}
          />
        )}

        {phase === 'personality' && <PersonalityTest onComplete={handlePersonalityComplete} />}

        {phase === 'done' && (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
              <Trophy className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your assessment is complete.<br />
              Results have been recorded and will be reviewed shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}