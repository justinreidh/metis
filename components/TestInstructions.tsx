type Props = {
  title: string;
  instructions: string;   // HTML string for formatting
  buttonText: string;
  onStart: () => void;
};

export default function TestInstructions({ title, instructions, buttonText, onStart }: Props) {
  return (
    <div style={{ maxWidth: '700px', margin: '4rem auto', textAlign: 'center' }}>
      <h1>{title} Instructions</h1>
      
      <div 
        style={{ 
          fontSize: '1.15rem', 
          lineHeight: 1.7, 
          textAlign: 'left', 
          margin: '2.5rem 0',
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #e0e0e0'
        }}
        dangerouslySetInnerHTML={{ __html: instructions }}
      />

      <button
        onClick={onStart}
        style={{
          padding: '1rem 3rem',
          fontSize: '1.3rem',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '2rem'
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}