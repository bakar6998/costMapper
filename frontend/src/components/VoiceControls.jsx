import { useVoice } from '../hooks/useVoice.js';

export default function VoiceControls({ onTranscript, textToSpeak }) {
  const { listening, supported, startListening, stopListening, speak } = useVoice({ onTranscript });

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {supported && (
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            padding: '7px 16px',
            borderRadius: 99,
            border: 'none',
            background: listening ? '#ef4444' : '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            animation: listening ? 'mic-pulse 1s ease-in-out infinite' : 'none',
          }}
        >
          {listening ? '⏹ Stop' : '🎤 Speak'}
        </button>
      )}
      {textToSpeak && (
        <button
          onClick={() => speak(textToSpeak)}
          style={{
            padding: '7px 16px',
            borderRadius: 99,
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            color: '#0f172a',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          🔊 Read aloud
        </button>
      )}
    </div>
  );
}
