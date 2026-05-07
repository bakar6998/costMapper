# Mappcoster

> Interactive world map where AI tells you the cost of living for any city — with voice.

Click anywhere on the map, and Claude instantly returns rent, meals, transport, internet costs, and a cost-of-living index for that city. Results are read aloud via browser TTS, and the mic button lets you speak a city name instead of clicking.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React-Leaflet |
| Backend | Node.js, Express |
| AI | Claude (Anthropic API) |
| Cache | Redis (1-hour TTL per city) |
| Map data | OpenStreetMap + Nominatim reverse geocoding |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |

---

## Project Structure

```
mappcoster/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.jsx           # Leaflet map, click-to-geocode, marker
│   │   │   ├── Sidebar.jsx       # Cost data panel with index bar + skeleton
│   │   │   ├── ChatBubble.jsx    # AI summary display
│   │   │   └── VoiceControls.jsx # Mic input + read-aloud button
│   │   ├── hooks/
│   │   │   ├── useVoice.js       # SpeechRecognition + SpeechSynthesis
│   │   │   └── useChat.js        # Cost API fetch hook
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   └── chat.js               # POST /api/chat → Claude → JSON response
│   ├── middleware/
│   │   └── rateLimit.js          # 20 req/min per IP
│   ├── cache/
│   │   └── redis.js              # Redis get/set helpers
│   ├── index.js
│   └── package.json
│
├── .env.example
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Redis running locally (`redis-server`) or a Redis URL
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone & configure

```bash
git clone https://github.com/your-username/mappcoster.git
cd mappcoster
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 2. Start the backend

```bash
cd backend
npm install
node index.js
# Runs on http://localhost:3001
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and click anywhere on the map.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | required |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `PORT` | Backend port | `3001` |

---

## How It Works

1. User clicks a point on the map
2. Frontend reverse-geocodes the coordinates via Nominatim to get city + country
3. Frontend sends `POST /api/chat` with `{ city, country }` to the backend
4. Backend checks Redis — if cached, returns immediately
5. Otherwise, calls the Claude API with a structured prompt requesting a JSON cost breakdown
6. Response is cached in Redis for 1 hour and returned to the frontend
7. Sidebar displays rent, meals, transport, internet costs, and a visual cost index bar
8. User can click "Read aloud" to hear the AI summary via browser TTS

---

## Features

- Click-to-query any city on an interactive world map
- AI-powered cost of living data (rent, food, transport, internet, index score)
- Visual cost index bar (green → amber → red)
- Animated skeleton loader while fetching
- Redis caching — repeat queries are instant, no extra API calls
- Rate limiting (20 req/min per IP)
- Voice input via browser microphone
- Text-to-speech readout of the AI summary
