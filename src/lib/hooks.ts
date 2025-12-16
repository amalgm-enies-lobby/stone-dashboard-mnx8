import { useQuery } from '@tanstack/react-query'
import { fetchTickerData } from './massive'
import { MAG7_TICKERS } from './constants'

const API_KEY = import.meta.env.VITE_MASSIVE_API_KEY || ''

// Debug logging
console.log('🔑 API Key loaded:', API_KEY ? `${API_KEY.slice(0, 10)}...` : 'MISSING')

/**
 * Hook to fetch data for a single ticker
 */
export function useTickerData(ticker: string) {
  return useQuery({
    queryKey: ['ticker', ticker],
    queryFn: () => fetchTickerData(ticker, API_KEY),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!API_KEY,
  })
}

/**
 * Hook to fetch data for all Magnificent 7 tickers
 * Uses a single query to fetch all tickers sequentially to avoid rate limits
 */
export function useAllTickersData() {
  return useQuery({
    queryKey: ['all-tickers'],
    queryFn: async () => {
      const results = []

      // Fetch tickers sequentially with a delay to avoid rate limits (free tier: 5 req/min)
      for (let i = 0; i < MAG7_TICKERS.length; i++) {
        const info = MAG7_TICKERS[i]
        try {
          console.log(`Fetching ${info.ticker} (${i + 1}/${MAG7_TICKERS.length})...`)
          const data = await fetchTickerData(info.ticker, API_KEY)
          results.push(data)
          console.log(`✓ Successfully fetched ${info.ticker}`)

          // Wait 15 seconds between requests (5 requests per minute = 1 request every 12 seconds)
          // Adding 3 second buffer to be safe
          if (i < MAG7_TICKERS.length - 1) {
            console.log(`Waiting 15 seconds before next request...`)
            await new Promise(resolve => setTimeout(resolve, 15000))
          }
        } catch (error) {
          console.error(`✗ Failed to fetch ${info.ticker}:`, error)
          // Continue with other tickers even if one fails
        }
      }

      return results
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - cache longer since we're rate limited
    retry: 1,
    enabled: !!API_KEY,
  })
}
