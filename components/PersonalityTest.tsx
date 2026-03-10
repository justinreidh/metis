'use client'

import { useState } from 'react'
import {
  QUESTIONS as PersonalityQuestions,
  LIKERT_OPTIONS,
  LikertValue,
} from '@/lib/questions/personality'

type Props = {
  onComplete: (responses: Record<number, number>) => void
}

export default function PersonalityTest({ onComplete }: Props) {
  const [responses, setResponses] = useState<Record<number, number>>({})

  const handleChange = (questionId: number, value: LikertValue) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const allAnswered = PersonalityQuestions.every((q) => responses[q.id] !== undefined)

  const handleSubmit = () => {
    onComplete(responses)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Personality Assessment</h1>

      <p style={{ textAlign: 'center', color: '#555', marginBottom: '2rem' }}>
        Please indicate how much you agree or disagree with each statement.
      </p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '2rem',
          fontSize: '1.05rem',
        }}
      >
        <thead>
          <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <th style={{ padding: '1rem', textAlign: 'left', width: '55%' }}>Statement</th>
            {LIKERT_OPTIONS.map((option, idx) => (
              <th
                key={idx}
                style={{
                  padding: '1rem 0.5rem',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  minWidth: '90px',
                }}
              >
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PersonalityQuestions.map((q, index) => (
            <tr
              key={q.id}
              style={{
                background: index % 2 === 0 ? 'white' : '#f9f9f9',
                borderBottom: '1px solid #eee',
              }}
            >
              <td style={{ padding: '1.1rem', verticalAlign: 'top' }}>
                {index + 1}. {q.text}
              </td>
              {LIKERT_OPTIONS.map((_, optIndex) => {
                const value = optIndex + 1 as LikertValue
                const isSelected = responses[q.id] === value

                return (
                  <td key={optIndex} style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      id={`q${q.id}-${optIndex}`}
                      checked={isSelected}
                      onChange={() => handleChange(q.id, value)}
                      style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          title={allAnswered ? 'Submit your responses' : 'Please answer all questions'}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            background: allAnswered ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            opacity: allAnswered ? 1 : 0.7,
            transition: 'background 0.2s',
          }}
        >
          Submit Personality Assessment
        </button>

        {!allAnswered && (
          <p style={{ color: '#6c757d', marginTop: '1rem', fontSize: '0.95rem' }}>
            Please answer all questions to continue
          </p>
        )}
      </div>
    </div>
  )
}