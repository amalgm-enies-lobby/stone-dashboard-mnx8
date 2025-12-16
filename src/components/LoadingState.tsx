import { Card, CardContent, CardHeader } from './ui/card'
import { Skeleton } from './ui/skeleton'
import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      {/* Hero skeleton */}
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-12 w-3/4" />
        <Skeleton className="mx-auto h-6 w-1/2" />
        <div className="flex items-center justify-center gap-2 mt-4 text-stone-400 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading stock data (~90 seconds due to API rate limits)...</span>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="bg-stone-950 border-stone-800">
            <CardHeader>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart skeleton */}
      <Card className="bg-stone-950 border-stone-800">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
