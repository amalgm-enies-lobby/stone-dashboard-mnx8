// Massive REST API client for stock data
// Docs: https://massive.com/docs/rest/quickstart

const API_BASE = 'https://api.polygon.io'

export interface PreviousDayData {
  ticker: string
  close: number
  high: number
  low: number
  open: number
  volume: number
  vwap: number
  timestamp?: number
  transactions?: number
}

export interface AggregateBar {
  c: number // close
  h: number // high
  l: number // low
  o: number // open
  t: number // timestamp
  v: number // volume
  vw: number // volume weighted
  n?: number // number of transactions
}

export interface AggregatesResponse {
  ticker: string
  adjusted: boolean
  queryCount: number
  resultsCount: number
  results: AggregateBar[]
  status: string
  request_id?: string
}

export interface PreviousCloseResponse {
  ticker: string
  adjusted: boolean
  queryCount: number
  resultsCount: number
  results: PreviousDayData[]
  status: string
  request_id?: string
}

/**
 * Fetches the previous day's data for a ticker
 * Endpoint: /v2/aggs/ticker/{stocksTicker}/prev
 */
export async function fetchPreviousDay(
  ticker: string,
  apiKey: string
): Promise<PreviousDayData> {
  const url = `${API_BASE}/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch previous day data for ${ticker}: ${response.status} ${response.statusText}`
      )
    }

    const data: PreviousCloseResponse = await response.json()

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`No previous day data available for ${ticker}`)
    }

    return {
      ...data.results[0],
      ticker,
    }
  } catch (error) {
    console.error(`Error fetching previous day for ${ticker}:`, error)
    throw error
  }
}

/**
 * Fetches historical aggregate bars for a ticker
 * Endpoint: /v2/aggs/ticker/{stocksTicker}/range/{multiplier}/{timespan}/{from}/{to}
 */
export async function fetchAggregates(
  ticker: string,
  from: string,
  to: string,
  apiKey: string,
  multiplier = 1,
  timespan: 'day' | 'week' | 'month' = 'day'
): Promise<AggregateBar[]> {
  const url = `${API_BASE}/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`

  try {
    console.log(`🔍 Fetching: ${url}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch aggregates for ${ticker}: ${response.status} ${response.statusText}`
      )
    }

    const data: AggregatesResponse = await response.json()
    console.log(`📊 API Response for ${ticker}:`, {
      status: data.status,
      resultsCount: data.resultsCount,
      hasResults: !!data.results,
      from,
      to
    })

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error(`❌ API returned no data:`, data)
      throw new Error(`No aggregate data available for ${ticker}. Check date range: ${from} to ${to}`)
    }

    return data.results
  } catch (error) {
    console.error(`Error fetching aggregates for ${ticker}:`, error)
    throw error
  }
}

/**
 * Helper to get date string 90 days ago
 */
export function get90DaysAgo(): string {
  // Use a fixed date range that we know has valid stock data
  // December 15, 2024 minus 90 days = September 16, 2024
  return '2024-09-16'
}

/**
 * Helper to get today's date string
 */
export function getToday(): string {
  // Use December 13, 2024 (Friday) as the latest date with complete market data
  // (Avoiding weekend dates when markets are closed)
  return '2024-12-13'
}

/**
 * Fetches both previous day and 90-day historical data for a ticker
 * Optimized for rate limits: uses only aggregates endpoint and derives previous day from it
 */
export async function fetchTickerData(ticker: string, apiKey: string) {
  const from = get90DaysAgo()
  const to = getToday()

  // Only fetch aggregates - we can get the previous day from the last bar
  const aggregates = await fetchAggregates(ticker, from, to, apiKey)

  // Get the most recent bar as "previous day" data
  const lastBar = aggregates[aggregates.length - 1]
  const previousDay: PreviousDayData = {
    ticker,
    close: lastBar.c,
    high: lastBar.h,
    low: lastBar.l,
    open: lastBar.o,
    volume: lastBar.v,
    vwap: lastBar.vw,
    timestamp: lastBar.t,
    transactions: lastBar.n,
  }

  return {
    ticker,
    previousDay,
    aggregates,
  }
}
