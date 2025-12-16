import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'
import type { PreviousDayData } from '@/lib/massive'
import { MAG7_TICKERS } from '@/lib/constants'

interface AggregateStatsProps {
  tickersData: Array<{
    ticker: string
    previousDay: PreviousDayData
  }>
}

export function AggregateStats({ tickersData }: AggregateStatsProps) {
  const stats = calculateStats(tickersData)

  return (
    <Card className="border-stone-800 bg-stone-950">
      <CardHeader>
        <CardTitle className="text-2xl text-stone-100">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Best Performer */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <TrendingUp className="h-4 w-4" />
              <span>Best Performer</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-100">
                  {stats.bestPerformer.ticker}
                </span>
                <Badge variant="success">
                  +{stats.bestPerformer.change.toFixed(2)}%
                </Badge>
              </div>
              <p className="text-sm text-stone-500">
                {MAG7_TICKERS.find((t) => t.ticker === stats.bestPerformer.ticker)?.name}
              </p>
            </div>
          </div>

          {/* Worst Performer */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <TrendingDown className="h-4 w-4" />
              <span>Worst Performer</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-100">
                  {stats.worstPerformer.ticker}
                </span>
                <Badge variant="destructive">
                  {stats.worstPerformer.change.toFixed(2)}%
                </Badge>
              </div>
              <p className="text-sm text-stone-500">
                {MAG7_TICKERS.find((t) => t.ticker === stats.worstPerformer.ticker)?.name}
              </p>
            </div>
          </div>

          {/* Average Move */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <Activity className="h-4 w-4" />
              <span>Average Move</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-100">
                {stats.averageMove >= 0 ? '+' : ''}
                {stats.averageMove.toFixed(2)}%
              </div>
              <p className="text-sm text-stone-500">Across all 7 stocks</p>
            </div>
          </div>

          {/* Total Market Cap */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <DollarSign className="h-4 w-4" />
              <span>Total Market Cap</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-100">—</div>
              <p className="text-sm text-stone-500">Data not available</p>
            </div>
          </div>
        </div>

        {/* Additional metrics */}
        <div className="mt-6 grid gap-4 border-t border-stone-800 pt-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-stone-400">Gainers</p>
            <p className="text-xl font-semibold text-emerald-500">
              {stats.gainers}
            </p>
          </div>
          <div>
            <p className="text-sm text-stone-400">Losers</p>
            <p className="text-xl font-semibold text-red-500">
              {stats.losers}
            </p>
          </div>
          <div>
            <p className="text-sm text-stone-400">Unchanged</p>
            <p className="text-xl font-semibold text-stone-400">
              {stats.unchanged}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function calculateStats(
  tickersData: Array<{
    ticker: string
    previousDay: PreviousDayData
  }>
) {
  const changes = tickersData.map((item) => {
    const change = item.previousDay.close - item.previousDay.open
    const changePercent = (change / item.previousDay.open) * 100
    return {
      ticker: item.ticker,
      change: changePercent,
    }
  })

  const bestPerformer = changes.reduce((best, current) =>
    current.change > best.change ? current : best
  )

  const worstPerformer = changes.reduce((worst, current) =>
    current.change < worst.change ? current : worst
  )

  const averageMove =
    changes.reduce((sum, item) => sum + item.change, 0) / changes.length

  const gainers = changes.filter((item) => item.change > 0).length
  const losers = changes.filter((item) => item.change < 0).length
  const unchanged = changes.filter((item) => item.change === 0).length

  return {
    bestPerformer,
    worstPerformer,
    averageMove,
    gainers,
    losers,
    unchanged,
  }
}
