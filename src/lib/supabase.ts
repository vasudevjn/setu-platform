/**
 * Supabase connection.
 *
 * If the URL and key are set, the app saves everything to Supabase ("remote mode").
 * If not, it runs on the browser's localStorage ("local mode"), same as before.
 *
 * Vercel's Supabase integration adds NEXT_PUBLIC_* names, so both spellings work.
 * The key is the public anon (or publishable) key. It is safe to ship in the browser.
 * Never put the service_role or secret key in this app.
 */
import type { SupabaseClient } from '@supabase/supabase-js'

const env = import.meta.env

const url = (env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const key = (
  env.VITE_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim()

export const isRemote = url !== '' && key !== ''

let client: Promise<SupabaseClient> | null = null

/** Loads the Supabase library on first use, so local mode never downloads it. */
export function getClient(): Promise<SupabaseClient> {
  if (!client) {
    client = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        realtime: { params: { eventsPerSecond: 5 } },
      }),
    )
  }
  return client
}
