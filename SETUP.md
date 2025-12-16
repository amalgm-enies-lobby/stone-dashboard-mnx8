# Setup & Implementation Details

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure API key
cp .env.example .env
# Edit .env and add your Polygon.io API key

# 3. Start development server
npm run dev
```

The dev server will start at [http://localhost:5173](http://localhost:5173)

## Implementation Details

### Design System Customization

The stone theme is defined in `src/index.css` using CSS custom properties:

- **Background**: Pure black (`#000`)
- **Card surfaces**: `--card: 20 4% 4%` (stone-950 equivalent)
- **Borders**: `--border: 12 7% 20%` (stone-800 equivalent)
- **Text**: `--foreground: 60 9% 96%` (stone-100)
- **Muted text**: `--muted-foreground: 24 6% 63%` (stone-400)

To adjust the theme colors, edit the CSS variables in `src/index.css` at the `:root` selector.

### Chart Colors

The 7 tickers have distinct colors defined in `src/lib/constants.ts`:

```typescript
export const MAG7_TICKERS = [
  { ticker: 'AAPL', name: 'Apple', color: 'hsl(173, 58%, 39%)' },
  { ticker: 'MSFT', name: 'Microsoft', color: 'hsl(12, 76%, 61%)' },
  // ... etc
]
```

These colors are used consistently across:
- Line chart series
- Legend items
- Badge accents

### Data Normalization

The price chart (`src/components/PriceChart.tsx`) implements two normalization modes:

#### Raw Price Mode
Displays actual closing prices in dollars. Each ticker's price is plotted directly from the API data.

#### Indexed Mode (Base 100)
Normalizes all stocks to start at 100 for easier performance comparison:

```typescript
// For each data point
const indexedValue = (currentClose / firstClose) * 100
```

This allows you to see relative performance regardless of absolute price differences. For example:
- A stock that went from $100 to $110 shows as 100 → 110
- A stock that went from $1000 to $1100 also shows as 100 → 110

The normalization logic is in `transformDataForChart()` function.

### API Integration

The Polygon.io client (`src/lib/massive.ts`) fetches two types of data:

1. **Previous Day Snapshot**: Latest OHLC + volume via `/v2/aggs/ticker/{ticker}/prev`
2. **90-Day History**: Daily bars via `/v2/aggs/ticker/{ticker}/range/1/day/{from}/{to}`

Data fetching is managed by `@tanstack/react-query` with:
- 5-minute stale time
- Automatic retry (2 attempts)
- Parallel fetching for all 7 tickers

### Component Architecture

```
Dashboard (main layout)
├── TickerCard (x7) - Individual stock cards
├── AggregateStats - Market overview metrics
└── PriceChart - Multi-series line chart
    ├── ChartContainer (shadcn/ui wrapper)
    ├── LineChart (recharts)
    └── ChartTooltipContent (custom tooltip)
```

### Responsive Behavior

The layout uses Tailwind's responsive utilities:

- **Mobile** (< 640px): Single column, stacked cards
- **Tablet** (640px - 1024px): 2 columns
- **Desktop** (1024px - 1280px): 3 columns
- **Large Desktop** (> 1280px): 4 columns

Maximum width is constrained to `max-w-7xl` (~1400px) and centered.

### Error Handling

Three error states are handled:

1. **Missing API Key**: Shows setup instructions
2. **API Failure**: Displays error message with retry
3. **Loading**: Shows skeleton components

See `src/components/ErrorState.tsx` and `src/components/LoadingState.tsx`.

### Customization Points

#### Adding New Tickers

Edit `src/lib/constants.ts`:

```typescript
export const MAG7_TICKERS = [
  // Add new ticker here
  { ticker: 'GOOGL', name: 'Alphabet', color: 'hsl(197, 37%, 24%)' },
]
```

#### Changing Date Range

Edit `src/lib/massive.ts`:

```typescript
export function get90DaysAgo(): string {
  const date = new Date()
  date.setDate(date.getDate() - 180) // Change to 180 days
  return date.toISOString().split('T')[0]
}
```

#### Modifying Card Layout

Edit `src/components/TickerCard.tsx` to change:
- Data fields displayed
- Hover effects
- Badge styling

#### Chart Customization

In `src/components/PriceChart.tsx`:
- Change line thickness: `strokeWidth={2}` → `strokeWidth={3}`
- Toggle dots: `dot={false}` → `dot={true}`
- Adjust tooltip format in `formatter` prop

### Performance Notes

- **Bundle Size**: ~865KB (256KB gzipped) - mainly due to recharts
- **Font Loading**: Inter weights 400, 500, 600, 700 are loaded
- **Caching**: React Query caches data for 5 minutes
- **Chart Rendering**: Recharts uses SVG (performant for this use case)

To reduce bundle size, consider:
- Lazy loading the chart component
- Using dynamic imports for recharts
- Reducing Inter font weights if not all are needed

### TypeScript Configuration

The project uses strict TypeScript with:
- `verbatimModuleSyntax: true` - Requires `type` imports for type-only imports
- Path aliases: `@/*` maps to `src/*`
- React 19 types
- Vite-specific types via `vite/client`

### Known Limitations

1. **Market Cap**: Not available from Polygon.io free tier, shows "—" placeholder
2. **Real-time Updates**: Data refreshes only on component mount (add polling if needed)
3. **Historical Data**: Limited to what Polygon.io free tier provides
4. **Weekend Data**: Markets closed, previous day might be Friday

### Development Tips

- Use React DevTools to inspect query cache
- Check Network tab for API calls (they use query params for auth)
- Skeleton loaders maintain layout shift prevention
- Color contrast meets WCAG AA standards on dark background

### Production Deployment

Before deploying:

1. Set `VITE_MASSIVE_API_KEY` environment variable on your hosting platform
2. Run `npm run build` to generate production bundle
3. Serve the `dist/` folder as a static site
4. Consider adding a CDN for font files
5. Enable gzip/brotli compression on your server

### Troubleshooting

**Issue**: "API Key Required" error
- **Solution**: Ensure `.env` file exists with `VITE_MASSIVE_API_KEY=your_key`
- Remember to restart dev server after adding `.env`

**Issue**: TypeScript errors about imports
- **Solution**: Use `import type { ... }` for type-only imports

**Issue**: Chart not rendering
- **Solution**: Check browser console for recharts errors
- Ensure data array is not empty

**Issue**: Styles not applying
- **Solution**: Clear Vite cache: `rm -rf node_modules/.vite` and restart

## Additional Resources

- [Polygon.io API Docs](https://polygon.io/docs/stocks/getting-started)
- [Recharts Documentation](https://recharts.org/en-US/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
