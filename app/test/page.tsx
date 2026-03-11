'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QUESTIONS as PersonalityQuestions, calculateTraitScores, LikertValue, BigFiveTrait } from '@/lib/questions/personality'
import { questions as GCAQuestions } from '@/lib/questions/gca'
import { createClient } from '@/lib/supabase/client'
import GCATest from '../../components/GCATest'
import PersonalityTest from '../../components/PersonalityTest'   // ← new import
import Introduction from '../../components/Introduction'
import TestInstructions from '../../components/TestInstructions'

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
  const [currentTest, setCurrentTest] = useState<'gca' | 'personality' | 'done'>('gca')
  const [gcaResponses, setGcaResponses] = useState<Record<number, number>>({})
  const [personalityResponses, setPersonalityResponses] = useState<Record<number, number>>({})
  const [phase, setPhase] = useState<TestPhase>('intro');

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
        alert('Invalid link. Contact the organization who invited you to receive a new assessment link.')
        return
      }

      if (new Date(data.token_expires) < new Date()) {
        alert('Expired link. Contact the organization who invited you to receive a new assessment link.')
        return
      }

      setCandidate(data)
      await supabase.from('candidates').update({ status: 'in_progress' }).eq('id', data.id)
      setPhase('intro');
    }
    validateToken()
  }, [token, supabase])

  if (!candidate) return <div>Loading...</div>

  const handleStartGCA = () => setPhase('gca');
  const handleGcaComplete = (responses: Record<number, number>) => {
    setGcaResponses(responses)
    setPhase('personality-instructions');
  }

  const handleStartPersonality = () => setPhase('personality');
  const handlePersonalityComplete = (responses: Record<number, number>) => {
    setPersonalityResponses(responses)
    // Immediately proceed to save & finish (no extra button needed in parent)
    handleFinalSubmit(responses)
    setPhase('done')
  }

  const handleFinalSubmit = async (personalityRes: Record<number, number> = personalityResponses) => {
    // Use latest responses (important if called directly)
    const finalPersonalityResponses = personalityRes

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

    await supabase.from('results').insert({
      candidate_id: candidate.id,
      personality_scores: personalityScores,
      personality_percentiles: personalityPercentiles,
      gca_score: gcaScore,
      gca_percentile: gcaPercentile,
    })

    await supabase
      .from('candidates')
      .update({ status: 'completed', token: null })
      .eq('id', candidate.id)

    setCurrentTest('done')
  }

  function cdf(z: number): number {
    return 1 / (1 + Math.exp(-1.654 * z)) // Logistic approximation
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
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
              <li>Answer as quickly and accurately as possible — there is no penalty for guessing.</li>
              <li>Once you begin, you cannot pause the timer.</li>
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
              <li>There are no right or wrong answers — answer honestly based on how you generally are.</li>
              <li>The test is untimed — take as long as you need to read each statement carefully.</li>
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
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Thank You!</h1>
          <p style={{ fontSize: '1.3rem', marginTop: '1.5rem' }}>
            Your assessment is now complete.<br/>
            Results have been recorded and will be reviewed shortly.
          </p>
        </div>
      )}
    </div>
  )
}