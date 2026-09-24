import type { ReactNode } from 'react'
import { Logo } from './brand/Logo'
import { Button } from './ui/Button'
import { useApp } from '../hooks/useApp'

/** Shows the app once data is ready. In local mode this is instant. */
export function DataGate({ children }: { children: ReactNode }) {
  const { data, reload } = useApp()
  if (data.status === 'ready') return <>{children}</>

  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <Logo height={36} />
        {data.status === 'loading' ? (
          <p role="status" className="text-muted">
            Getting things ready…
          </p>
        ) : (
          <div role="alert" className="flex w-full flex-col items-center gap-3 rounded-card bg-white p-6 shadow-card">
            <h1 className="text-heading font-semibold">{titleFor(data.kind)}</h1>
            <p className="text-muted">{bodyFor(data.kind)}</p>
            {data.kind !== 'network' && (
              <p className="w-full break-words rounded-button bg-cream px-3 py-2 text-left text-detail text-muted">{data.message}</p>
            )}
            <div className="mt-2 w-full max-w-xs">
              <Button onClick={reload} full>
                Try again
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function titleFor(kind: 'empty' | 'missing' | 'network' | 'other') {
  if (kind === 'network') return 'Cannot reach the database'
  if (kind === 'other') return 'Something went wrong'
  return 'The database is not set up yet'
}

function bodyFor(kind: 'empty' | 'missing' | 'network' | 'other') {
  if (kind === 'network') return 'Check your internet connection and try again.'
  if (kind === 'other') return 'Please try again. If it keeps happening, check the Supabase URL and key.'
  if (kind === 'missing') return 'The tables are missing. Push the supabase/migrations folder to the branch Supabase watches, then try again.'
  return 'The tables exist but have no demo data. Run the seed migration, or call reset_demo_data() in the Supabase SQL editor, then try again.'
}
