'use client'

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { QUESTIONS as PersonalityQuestions, calculateTraitScores, LIKERT_OPTIONS, LikertValue, BigFiveTrait } from '@/lib/questions/personality';
import { questions as GCAQuestions } from '@/lib/questions/gca';
import { createClient } from '@/lib/supabase/client';
import GCATest from '../components/GCATest'
// Import calculateTraitScores

export default function Test() {
  const params = useSearchParams();
  const token = params.get('token');
  const [candidate, setCandidate] = useState<any>(null);
  const [currentTest, setCurrentTest] = useState<'gca' | 'personality' | 'done'>('gca');
  const [gcaResponses, setGcaResponses] = useState<Record<number, number>>({});
  const [personalityResponses, setPersonalityResponses] = useState<Record<number, number>>({});

  const supabase = createClient()

  useEffect(() => {
    async function validateToken() {
      const { data, error } = await supabase.from('candidates').select('*').eq('token', token).single();
      if (error || !data || new Date(data.token_expires) < new Date()) {
        alert('Invalid or expired link');
        return;
      }
      setCandidate(data);
      await supabase.from('candidates').update({ status: 'in_progress' }).eq('id', data.id);
    }
    if (token) validateToken();
  }, [token]);

  if (!candidate) return <div>Loading...</div>;

  const handleGcaComplete = (responses: Record<number, number>) => {
    setGcaResponses(responses)
    setCurrentTest('personality')
  }

  const handleSubmit = async () => {
    

    // Save responses
    await supabase.from('responses').insert([
      { candidate_id: candidate.id, test_type: 'gca', responses: gcaResponses },
      { candidate_id: candidate.id, test_type: 'personality', responses: personalityResponses },
    ]);

    // Calculate scores
    const personalityScores = calculateTraitScores(personalityResponses as Record<number, LikertValue>);
    const gcaScore = GCAQuestions.reduce((acc, q) => acc + (gcaResponses[q.id] === q.correctIndex ? 1 : 0), 0);

    // Norms (sample; adjust as needed)
    const bigFiveNorms = {
      extraversion: { mean: 29.5, sd: 8.5 },
      agreeableness: { mean: 35.2, sd: 7.2 },
      conscientiousness: { mean: 33.8, sd: 7.8 },
      emotional_stability: { mean: 30.1, sd: 8.4 },
      intellect_imagination: { mean: 32.4, sd: 7.6 },
    };

    const personalityPercentiles: Record<string, number> = {};
    Object.entries(personalityScores).forEach(([trait, score]) => {
      const { mean, sd } = bigFiveNorms[trait as BigFiveTrait];
      const z = (score - mean) / sd;
      personalityPercentiles[trait] = Math.round(cdf(z) * 100);  // Percentile via CDF
    });

    const gcaNorms = { mean: 15, sd: 5 };  // Placeholder; calibrate with real data
    const gcaZ = (gcaScore - gcaNorms.mean) / gcaNorms.sd;
    const gcaPercentile = Math.round(cdf(gcaZ) * 100);

    await supabase.from('results').insert({
      candidate_id: candidate.id,
      personality_scores: personalityScores,
      personality_percentiles: personalityPercentiles,
      gca_score: gcaScore,
      gca_percentile: gcaPercentile,
    });

    await supabase.from('candidates').update({ status: 'completed', token: null }).eq('id', candidate.id);  // Invalidate token
    setCurrentTest('done');
  };

  // Helper: Cumulative Distribution Function for normal dist (approx)
  function cdf(z: number): number {
    return 1 / (1 + Math.exp(-1.654 * z));  // Logistic approx for simplicity
  }

  return (
    <div>
      {currentTest === 'gca' && (
        <GCATest onComplete={handleGcaComplete} />
      )}
      {currentTest === 'personality' && (
        <div>
          <h1>Personality Test</h1>
          {PersonalityQuestions.map(q => (
            <div key={q.id}>
              <p>{q.text}</p>
              {LIKERT_OPTIONS.map((opt, idx) => (
                <label key={idx}>
                  <input type="radio" name={`q${q.id}`} onChange={() => setPersonalityResponses({ ...personalityResponses, [q.id]: idx + 1 as LikertValue })} />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
      {currentTest === 'done' && <h1>Thank you! Your assessment is complete.</h1>}
    </div>
  );
}