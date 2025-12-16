import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { TrendingUp, TrendingDown, Volume2 } from 'lucide-react'
import type { PreviousDayData } from '@/lib/massive'

interface TickerCardProps {
  ticker: string
  name: string
  data: PreviousDayData
}

export function TickerCard({ ticker, name, data }: TickerCardProps) {
  const change = data.close - data.open
  const changePercent = (change / data.open) * 100
  const isPositive = change >= 0

  return (
    <Card className="group border-stone-800 bg-stone-950 transition-all hover:border-stone-700 hover:shadow-lg hover:shadow-stone-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-stone-100">
              {ticker}
            </CardTitle>
            <p className="text-sm text-stone-400">{name}</p>
          </div>
          <Badge
            variant={isPositive ? 'success' : 'destructive'}
            className="flex items-center gap-1"
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? '+' : ''}
            {changePercent.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-3xl font-bold text-stone-100">
            ${data.close.toFixed(2)}
          </div>
          <div
            className={`text-sm font-medium ${
              isPositive ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}${change.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-stone-800 pt-3 text-xs">
          <div>
            <p className="text-stone-500">Open</p>
            <p className="font-medium text-stone-300">${data.open.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-stone-500">High</p>
            <p className="font-medium text-stone-300">${data.high.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-stone-500">Low</p>
            <p className="font-medium text-stone-300">${data.low.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-stone-500">VWAP</p>
            <p className="font-medium text-stone-300">${data.vwap.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border-t border-stone-800 pt-2 text-xs text-stone-400">
          <Volume2 className="h-3.5 w-3.5" />
          <span>
            {(data.volume / 1_000_000).toFixed(1)}M vol
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
