# Market Analysis WiznAlgo

Institutional-grade AI-powered market analysis platform. Real-time order flow, smart money analytics, VWAP, volume profile, and predictive analytics for professional traders.

## Features

- **TradingView-style Charts** — Real-time candlestick charts with volume, crosshair, zoom, and multi-timeframe support
- **AI Prediction Engine** — LSTM & Transformer-based directional forecasting with confidence scores
- **Order Flow Analysis** — Aggressive buyer/seller detection, bid/ask imbalance, delta volume
- **VWAP Analytics** — Institutional bias, mean reversion, premium/discount zones
- **Volume Profile** — HVN/LVN detection, point of control, value area
- **Absorption Detection** — Hidden institutional order identification at key levels
- **Liquidity Detection** — Stop-loss cluster mapping and liquidity pool tracking
- **Smart Money Concept** — Order blocks, breaker blocks, fair value gaps, BOS/CHoCH
- **Multi-Pair AI Scanner** — Real-time signal table with sortable columns and filtering
- **Mini Chart Grid** — AI predictions with confidence scores for all pairs

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Premium landing page with hero, features, pricing, testimonials |
| Dashboard | `/dashboard` | Main trading dashboard with chart, order flow, volume profile, watchlist |
| AI Predictions | `/predictions` | Grid of mini charts with AI prediction cards |
| AI Signals | `/signals` | Sortable/filterable signal scanner table |
| Analysis Detail | `/analysis/[pair]` | Deep AI analysis with narrative, institutional analysis, liquidity map |
| Strategy | `/strategy` | Trading strategy explanations with algorithm formulas |

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TailwindCSS 4**
- **Framer Motion** — Smooth animations
- **Lightweight Charts** — TradingView charting library
- **Zustand** — State management
- **Lucide React** — Icons

### Planned Backend
- Node.js / FastAPI
- Python AI Engine (TensorFlow/PyTorch)
- WebSocket server for real-time data
- Redis caching
- PostgreSQL database

### Planned AI/ML
- LSTM networks for temporal pattern recognition
- Transformer models for cross-asset correlation
- Reinforcement Learning for adaptive strategies
- Time-series analysis and feature engineering

## Getting Started

### Prerequisites
- Node.js 20+ (recommended: 22.x)
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/WiznAlgo/WiznAlgo.git
cd WiznAlgo

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npx vercel
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles & theme
│   ├── dashboard/         # Main trading dashboard
│   ├── predictions/       # AI prediction grid
│   ├── signals/           # AI signal scanner
│   ├── analysis/[pair]/   # Detailed AI analysis
│   └── strategy/          # Strategy explanations
├── components/
│   ├── landing/           # Landing page components
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Ticker.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── AITechSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── Footer.tsx
│   ├── dashboard/         # Dashboard layout components
│   │   ├── DashboardShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── AIPanel.tsx
│   ├── charts/            # Chart components
│   │   └── TradingChart.tsx
│   └── ui/                # Shared UI components
│       ├── GlassCard.tsx
│       ├── SignalBadge.tsx
│       └── ConfidenceBar.tsx
├── lib/                   # Utilities & data
│   └── market-data.ts     # Mock data generation
└── store/                 # State management
    └── market-store.ts    # Zustand store
```

## Design

- **Dark mode premium** with glassmorphism effects
- **Color palette**: Black, Neon Blue (#00d4ff), Purple (#7c3aed), Green (#00ff88) for bullish, Red (#ff3b5c) for bearish
- **Responsive**: Mobile & desktop layouts
- **Animations**: Framer Motion transitions and hover effects
- **Grid background**: Subtle futuristic grid pattern

## Supported Pairs

| Category | Pairs |
|----------|-------|
| Crypto | BTCUSD, ETHUSD |
| Forex | EURUSD, GBPUSD, USDJPY |
| Indices | US30, NAS100, SPX500 |
| Commodities | XAUUSD |

## Algorithm Reference

### VWAP
```
VWAP = Σ(Price × Volume) / Σ(Volume)
```

### Order Flow Imbalance
```
Imbalance = (BuyVolume - SellVolume) / TotalVolume
```

### Absorption Detection
```
IF (Volume > 2σ) AND (|ΔPrice| < 0.5σ) → Absorption Detected
```

### Volume Profile
```
VP[price] = Σ Volume(candles where Low ≤ price ≤ High)
```

### AI Prediction
```
Signal = Transformer(LSTM(VWAP_dev, Delta, Absorption, Liquidity, Momentum, VP))
Output: BUY / SELL / HOLD + Confidence Score
```

## License

MIT
