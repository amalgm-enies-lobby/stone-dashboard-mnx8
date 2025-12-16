# Magnificent 7 Dashboard

A premium stone-themed finance dashboard tracking the performance of the Magnificent 7 tech stocks (AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA) built with React, TypeScript, and Vite.

![Dashboard Preview](preview.png)

## Features

- **Real-time Stock Data**: Live tracking of the Magnificent 7 stocks via Polygon.io REST API
- **Interactive Charts**: Multi-series line chart with raw price and indexed (base 100) normalization modes
- **Performance Metrics**: Comprehensive aggregate statistics including best/worst performers, average moves, and market sentiment
- **Premium Design**: Stone-themed UI using TailwindCSS and shadcn/ui components with smooth animations and hover states
- **Responsive Layout**: Fully responsive design that adapts to all screen sizes
- **Type-Safe**: Built with TypeScript for enhanced developer experience and code reliability

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS with custom stone theme
- **Components**: shadcn/ui (Card, Badge, Skeleton, Chart)
- **Charts**: Recharts for data visualization
- **Data Fetching**: @tanstack/react-query for efficient data management
- **Fonts**: Inter via @fontsource
- **Icons**: Lucide React

## API Integration

This dashboard uses the **Polygon.io REST API** (formerly referenced as Massive in the docs):

- **Previous Day Endpoint**: `/v2/aggs/ticker/{stocksTicker}/prev` - Latest trading day data
- **Aggregates Endpoint**: `/v2/aggs/ticker/{stocksTicker}/range/{multiplier}/{timespan}/{from}/{to}` - Historical 90-day data

Authentication follows the quickstart pattern using query parameter authentication (`?apiKey=...`).

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A free API key from [Polygon.io](https://polygon.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stone-mag7-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your Polygon.io API key to `.env`:
   ```env
   VITE_MASSIVE_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build production bundle (TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Card, Badge, Skeleton, Chart)
│   ├── AggregateStats.tsx   # Market overview statistics
│   ├── Dashboard.tsx        # Main dashboard layout
│   ├── ErrorState.tsx       # Error fallback UI
│   ├── LoadingState.tsx     # Loading skeleton UI
│   ├── PriceChart.tsx       # Multi-series line chart with normalization
│   └── TickerCard.tsx       # Individual stock card component
├── lib/
│   ├── constants.ts     # Magnificent 7 tickers configuration
│   ├── hooks.ts         # React Query hooks
│   ├── massive.ts       # Polygon.io API client
│   └── utils.ts         # Utility functions (cn helper)
├── App.tsx              # Root component with QueryClientProvider
├── main.tsx             # Application entry point
└── index.css            # Global styles with stone theme CSS variables
```

## Design System

### Color Palette

The dashboard uses a sophisticated stone theme:

- **Background**: Pure black (`#000`)
- **Surfaces**: Stone-950 (`bg-stone-950`) with stone-800 borders
- **Text**: Stone-100 for primary text, stone-400 for secondary labels
- **Accents**: Emerald (success), Red (destructive)

### Typography

Uses the Inter font family with premium features:
- Font weights: 400, 500, 600, 700
- Optimized with OpenType features (`cv11`, `ss01`)
- Smooth antialiasing for crisp rendering

### Layout

- Maximum width: 1400px (via Tailwind's `max-w-7xl`)
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Generous spacing and padding for premium feel

## Data Normalization

The price chart supports two visualization modes:

1. **Raw Price**: Displays actual closing prices in dollars
2. **Indexed (100)**: Normalizes all stocks to a base value of 100 at the start of the period for easier performance comparison

Toggle between modes using the buttons in the chart header.

## Component Highlights

### TickerCard
- Displays ticker symbol, company name, latest close price, and day change
- Shows OHLC (Open, High, Low, Close) and VWAP data
- Volume displayed in millions with compact formatting
- Hover state with subtle elevation and border changes
- Color-coded badges for gains (green) and losses (red)

### PriceChart
- Multi-series line chart comparing all 7 stocks
- Raw and indexed normalization modes
- Interactive tooltips with formatted dates and values
- Responsive legend with color coding
- Smooth line interpolation

### AggregateStats
- Best/worst performers with percentage changes
- Average move across all stocks
- Gainers/losers/unchanged count
- Market cap placeholder (data not available from API)

## Error Handling

The dashboard includes comprehensive error handling:

- **Missing API Key**: Clear instructions for setup
- **API Failures**: Graceful error state with retry capability
- **Loading States**: Skeleton components maintain layout during data fetch

## Browser Support

- Modern browsers with ES2022 support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Optimizations

- React Query caching with 5-minute stale time
- Automatic retry logic (2 attempts)
- Optimized re-renders with memoization
- Lazy loading and code splitting ready

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Data provided by [Polygon.io](https://polygon.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Font from [Google Fonts](https://fonts.google.com/specimen/Inter)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and TailwindCSS
