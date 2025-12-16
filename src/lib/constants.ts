// Magnificent 7 tickers and their company nicknames
// Currently showing only Tesla to avoid API rate limits
export const MAG7_TICKERS = [
  // { ticker: 'AAPL', name: 'Apple', color: 'hsl(173, 58%, 39%)' },
  // { ticker: 'MSFT', name: 'Microsoft', color: 'hsl(12, 76%, 61%)' },
  // { ticker: 'GOOGL', name: 'Alphabet', color: 'hsl(197, 37%, 24%)' },
  // { ticker: 'AMZN', name: 'Amazon', color: 'hsl(43, 74%, 66%)' },
  // { ticker: 'META', name: 'Meta', color: 'hsl(27, 87%, 67%)' },
  // { ticker: 'NVDA', name: 'NVIDIA', color: 'hsl(142, 71%, 45%)' },
  { ticker: 'TSLA', name: 'Tesla', color: 'hsl(0, 72%, 51%)' },
] as const

export type TickerInfo = (typeof MAG7_TICKERS)[number]
