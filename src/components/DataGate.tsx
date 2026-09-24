import type { ReactNode } from 'react'
import { Logo } from './brand/Logo'
import { Button } from './ui/Button'
import { useApp } from '../hooks/useApp'
import { supabaseHost } from '../lib/supabase'
import { titleCase } from '../lib/format'
import { t } from '../lib/i18n'

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
            {t('Getting things ready…')}
          </p>
        ) : (
          <div role="alert" className="flex w-full flex-col items-center gap-3 rounded-card bg-white p-6 shadow-card">
            <h1 className="text-heading font-semibold">{titleCase(titleFor(data.kind))}</h1>
            <p className="text-muted">{bodyFor(data.kind)}</p>
            <div className="w-full break-words rounded-button bg-cream px-3 py-2 text-left text-detail text-muted">
              <p>{t('Project: {host}', { host: supabaseHost || t('unknown') })}</p>
              <p>{t('Supabase said: {message}', { message: data.detail ?? data.message })}</p>
            </div>
            <div className="mt-2 w-full max-w-xs">
              <Button onClick={reload} full>
                {t('Try again')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function titleFor(kind: 'empty' | 'missing' | 'network' | 'other') {
  if (kind === 'network') return t('Cannot reach the database')
  if (kind === 'other') return t('Something went wrong')
  return t('The database is not set up yet')
}

function bodyFor(kind: 'empty' | 'missing' | 'network' | 'other') {
  if (kind === 'network') return t('Check your internet connection and try again.')
  if (kind === 'other') return t('Please try again. If it keeps happening, check the Supabase URL and key.')
  if (kind === 'missing') return t('This Supabase project does not have the Setu tables yet. Check that the migrations ran on the project shown below, then try again.')
  return t('The tables exist but have no demo data. Run the seed migration, or call reset_demo_data() in the Supabase SQL editor, then try again.')
}
