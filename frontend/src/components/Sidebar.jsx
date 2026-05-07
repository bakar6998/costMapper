import ChatBubble from './ChatBubble.jsx';
import VoiceControls from './VoiceControls.jsx';

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
      {[90, 70, 100, 60, 80].map((w, i) => (
        <div
          key={i}
          style={{
            height: 13,
            width: `${w}%`,
            background: '#e2e8f0',
            borderRadius: 6,
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

function CostIndexBar({ index }) {
  const pct = (index / 10) * 100;
  const color = index <= 3 ? '#22c55e' : index <= 6 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 5 }}>
        <span>Cost index</span>
        <strong style={{ color }}>{index} / 10</strong>
      </div>
      <div style={{ height: 7, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 99,
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  );
}

function CostRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <strong style={{ color: '#0f172a' }}>{value}</strong>
    </div>
  );
}

export default function Sidebar({ selectedCity, costData, loading }) {
  const summaryText = costData && !costData.error ? costData.summary : null;

  return (
    <div style={{
      width: 320,
      height: '100vh',
      background: '#fff',
      boxShadow: '-2px 0 20px rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      padding: '22px 20px',
      overflowY: 'auto',
      zIndex: 1000,
    }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
          🌍 Mappcoster
        </h2>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
          Click anywhere on the map
        </p>
      </div>

      {!selectedCity && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#cbd5e1' }}>
          <span style={{ fontSize: 44 }}>🗺️</span>
          <p style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.5 }}>
            Click a city on the map to explore its cost of living
          </p>
        </div>
      )}

      {selectedCity && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              {selectedCity.city}
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              {selectedCity.country}
            </p>
          </div>

          {loading && <Skeleton />}

          {costData?.error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#ef4444', fontSize: 13 }}>
              {costData.error}
            </div>
          )}

          {costData && !costData.error && (
            <>
              <ChatBubble text={costData.summary} />
              <CostIndexBar index={costData.overall_index} />
              <div>
                <CostRow label="Monthly rent" value={costData.monthly_rent_usd} />
                <CostRow label="Average meal" value={`$${costData.meal_usd}`} />
                <CostRow label="Transport / mo" value={`$${costData.transport_monthly_usd}`} />
                <CostRow label="Internet / mo" value={`$${costData.internet_monthly_usd}`} />
              </div>
              <VoiceControls textToSpeak={summaryText} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
