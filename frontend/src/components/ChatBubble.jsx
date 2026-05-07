export default function ChatBubble({ text }) {
  if (!text) return null;
  return (
    <div style={{
      background: '#f0f4ff',
      border: '1px solid #c7d7f9',
      borderRadius: 12,
      padding: '10px 14px',
      fontSize: 14,
      lineHeight: 1.5,
      color: '#1e293b',
    }}>
      {text}
    </div>
  );
}
