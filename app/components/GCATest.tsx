'use client'

import { useState, useEffect, useRef } from 'react'
import { questions as GCAQuestions } from '@/lib/questions/gca'

type Props = {
  onComplete: (responses: Record<number, number>) => void
}

export default function GCATest({ onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(450) // 7.5 min = 450 seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const question = GCAQuestions[currentIndex]
  const isLastQuestion = currentIndex === GCAQuestions.length - 1

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSelect = (optionIndex: number) => {
    setResponses((prev) => ({ ...prev, [question.id]: optionIndex }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    onComplete(responses)
  }

  const handleAutoSubmit = () => {
    // You could also show a message like "Time's up!" before submitting
    onComplete(responses)
  }

  // Optional: prevent going back (common in timed tests)
  // If you want to allow going back, add a Previous button and logic

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h1>GCA Test</h1>
        <div style={{
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: timeLeft < 60 ? 'red' : 'inherit'
        }}>
          Time: {formatTime(timeLeft)}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
          Question {currentIndex + 1} of {GCAQuestions.length}
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.5 }}>{question.question}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {question.options.map((option, idx) => (
          <label
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              background: responses[question.id] === idx ? '#e6f3ff' : 'white',
              transition: 'all 0.15s'
            }}
          >
            <input
              type="radio"
              name={`q${question.id}`}
              checked={responses[question.id] === idx}
              onChange={() => handleSelect(idx)}
              style={{ width: '1.25rem', height: '1.25rem' }}
            />
            {option}
          </label>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleNext}
          disabled={responses[question.id] === undefined} // optional: require answer
          style={{
            padding: '0.9rem 2.5rem',
            fontSize: '1.1rem',
            background: isLastQuestion ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: responses[question.id] === undefined ? 'not-allowed' : 'pointer',
            opacity: responses[question.id] === undefined ? 0.6 : 1
          }}
        >
          {isLastQuestion ? 'Finish GCA → Personality' : 'Next Question'}
        </button>
      </div>

      {timeLeft === 0 && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>
          Time's up! Submitting automatically...
        </div>
      )}
    </div>
  )
}