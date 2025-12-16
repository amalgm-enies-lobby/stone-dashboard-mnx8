import { useAllTickersData } from '@/lib/hooks'
import { MAG7_TICKERS } from '@/lib/constants'
import { LoadingState } from './LoadingState'
import { ErrorState } from './ErrorState'
import { TickerCard } from './TickerCard'
import { PriceChart } from './PriceChart'
import { AggregateStats } from './AggregateStats'

export function Dashboard() {
  const { isLoading, isError, data } = useAllTickersData()

  if (isLoading) {
    return <LoadingState />
  }

  if (isError || !data || data.length === 0) {
    return <ErrorState />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <header className="border-b border-stone-800 bg-stone-950/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-stone-100 sm:text-5xl md:text-6xl">
              Magnificent 7 Dashboard
            </h1>
            <p className="mt-3 text-lg text-stone-400 sm:mt-4">
              Real-time performance tracking for the tech giants that move markets
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Ticker Cards Grid */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((tickerData) => {
              if (!tickerData) return null
              const info = MAG7_TICKERS.find((t) => t.ticker === tickerData.ticker)
              if (!info) return null

              return (
                <TickerCard
                  key={tickerData.ticker}
                  ticker={tickerData.ticker}
                  name={info.name}
                  data={tickerData.previousDay}
                />
              )
            })}
          </div>
        </section>

        {/* Aggregate Stats */}
        <section>
          <AggregateStats tickersData={data.filter((d): d is NonNullable<typeof d> => d !== undefined)} />
        </section>

        {/* Price Chart */}
        <section>
          <PriceChart data={data.filter((d): d is NonNullable<typeof d> => d !== undefined)} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-stone-500">
            Data provided by{' '}
            <a
              href="https://polygon.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-300"
            >
              Polygon.io
            </a>{' '}
            • Updated daily
          </p>
        </div>
      </footer>
    </div>
  )
}
