type Props = { onBegin: () => void };

export default function Introduction({ onBegin }: Props) {
  return (
    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '4rem auto' }}>
      <h1>Welcome to Your Assessment</h1>
      
      <p style={{ fontSize: '1.2rem', lineHeight: 1.6, margin: '2rem 0' }}>
        Thank you for taking the time to complete this assessment. 
        It consists of two parts designed to help us better understand your abilities and work style:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', margin: '3rem 0' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.8rem' }}>
          <h2>1. General Cognitive Ability (GCA) Test</h2>
          <p>Measures problem-solving, reasoning, and critical thinking under time pressure (7.5 minutes).</p>
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.8rem' }}>
          <h2>2. Personality Assessment</h2>
          <p>Based on the Big Five model — assesses traits like openness, conscientiousness, extraversion, agreeableness, and emotional stability. Untimed.</p>
        </div>
      </div>

      <p style={{ margin: '2rem 0', fontStyle: 'italic' }}>
        The entire process usually takes 20–35 minutes. Please complete it in one sitting in a quiet environment.
      </p>

      <button
        onClick={onBegin}
        style={{
          padding: '1rem 3rem',
          fontSize: '1.3rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Start Assessment
      </button>
    </div>
  );
}