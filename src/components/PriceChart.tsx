import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import type { AggregateBar } from '@/lib/massive'
import { MAG7_TICKERS } from '@/lib/constants'

interface PriceChartProps {
  data: Array<{
    ticker: string
    aggregates: AggregateBar[]
  }>
}

type NormalizationMode = 'raw' | 'indexed'

export function PriceChart({ data }: PriceChartProps) {
  const [mode, setMode] = useState<NormalizationMode>('raw')

  // Transform data for recharts
  const chartData = transformDataForChart(data, mode)

  const chartConfig = MAG7_TICKERS.reduce(
    (acc, ticker) => {
      acc[ticker.ticker] = {
        label: ticker.name,
        color: ticker.color,
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className="border-stone-800 bg-stone-950">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl text-stone-100">
              90-Day Price Performance
            </CardTitle>
            <CardDescription className="text-stone-400">
              Comparative analysis of the Magnificent 7 stocks
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('raw')}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'raw'
                  ? 'border-stone-700 bg-stone-800 text-stone-100'
                  : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-300'
              }`}
            >
              Raw Price
            </button>
            <button
              onClick={() => setMode('indexed')}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'indexed'
                  ? 'border-stone-700 bg-stone-800 text-stone-100'
                  : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-300'
              }`}
            >
              Indexed (100)
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(12, 7%, 20%)" />
              <XAxis
                dataKey="date"
                stroke="hsl(24, 6%, 63%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }}
              />
              <YAxis
                stroke="hsl(24, 6%, 63%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  mode === 'indexed' ? value.toFixed(0) : `$${value.toFixed(0)}`
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    }}
                    formatter={(value) =>
                      mode === 'indexed'
                        ? Number(value).toFixed(2)
                        : `$${Number(value).toFixed(2)}`
                    }
                  />
                }
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                iconType="line"
              />
              {MAG7_TICKERS.map((ticker) => (
                <Line
                  key={ticker.ticker}
                  type="monotone"
                  dataKey={ticker.ticker}
                  name={ticker.name}
                  stroke={ticker.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

/**
 * Transform aggregate data into chart-ready format
 */
function transformDataForChart(
  data: Array<{ ticker: string; aggregates: AggregateBar[] }>,
  mode: NormalizationMode
) {
  // Get all unique timestamps
  const timestamps = new Set<number>()
  data.forEach((item) => {
    item.aggregates.forEach((bar) => timestamps.add(bar.t))
  })

  const sortedTimestamps = Array.from(timestamps).sort((a, b) => a - b)

  // Calculate base values for indexing (first closing price for each ticker)
  const baseValues: Record<string, number> = {}
  if (mode === 'indexed') {
    data.forEach((item) => {
      if (item.aggregates.length > 0) {
        baseValues[item.ticker] = item.aggregates[0].c
      }
    })
  }

  // Build chart data
  const chartData = sortedTimestamps.map((timestamp) => {
    const point: Record<string, number | string> = {
      date: timestamp,
    }

    data.forEach((item) => {
      const bar = item.aggregates.find((b) => b.t === timestamp)
      if (bar) {
        if (mode === 'indexed') {
          const base = baseValues[item.ticker]
          point[item.ticker] = base ? (bar.c / base) * 100 : 100
        } else {
          point[item.ticker] = bar.c
        }
      }
    })

    return point
  })

  return chartData
}
