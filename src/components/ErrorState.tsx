import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message }: ErrorStateProps) {
  const hasNoApiKey = !import.meta.env.VITE_MASSIVE_API_KEY

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <Card className="border-destructive/50 bg-stone-950">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">
            {hasNoApiKey ? 'API Key Required' : 'Error Loading Data'}
          </CardTitle>
          <CardDescription className="text-base">
            {hasNoApiKey ? (
              <>
                Please set your Polygon.io API key in the{' '}
                <code className="rounded bg-stone-900 px-1.5 py-0.5 text-stone-300">
                  .env
                </code>{' '}
                file
              </>
            ) : (
              message || 'Failed to load stock data. Please try again later.'
            )}
          </CardDescription>
        </CardHeader>
        {hasNoApiKey && (
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-stone-900 p-4 text-sm">
              <p className="mb-2 font-semibold text-stone-300">Setup Instructions:</p>
              <ol className="list-inside list-decimal space-y-1 text-stone-400">
                <li>
                  Get a free API key from{' '}
                  <a
                    href="https://polygon.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 underline hover:text-stone-100"
                  >
                    polygon.io
                  </a>
                </li>
                <li>
                  Create a <code className="text-stone-300">.env</code> file in the project root
                </li>
                <li>
                  Add: <code className="text-stone-300">VITE_MASSIVE_API_KEY=your_key_here</code>
                </li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
