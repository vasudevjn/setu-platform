import { useState } from 'react'
import { Check, Languages } from 'lucide-react'
import { Sheet } from '../ui/Sheet'
import { LANGS, t, useLang } from '../../lib/i18n'
import { cn } from '../../lib/cn'

/**
 * Small button that opens the language choice. Each language is written in its own script,
 * so people can find theirs even when the screen is in a language they do not read.
 */
export function LanguageButton({ className, onDark, showName }: { className?: string; onDark?: boolean; showName?: boolean }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const current = LANGS.find((l) => l.code === lang)!

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${t('Change language')}: ${current.name}`}
        className={cn(
          'inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-detail font-semibold',
          !showName && 'min-w-11',
          onDark ? 'border-white/40 text-white hover:bg-white/10' : 'border-line bg-white text-muted hover:border-teal hover:text-teal',
          className,
        )}
      >
        <Languages className="size-4" aria-hidden="true" />
        {/* On narrow phones only the icon shows, to keep the top bar on one line. The name stays for screen readers. */}
        <span className={showName ? undefined : 'max-[419px]:sr-only'}>{showName ? current.name : current.short}</span>
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={t('Choose Language')}>
        <ul className="flex flex-col gap-2.5 pb-2">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                lang={l.code}
                aria-current={l.code === lang ? 'true' : undefined}
                onClick={async () => {
                  await setLang(l.code)
                  setOpen(false)
                }}
                className={cn(
                  'flex min-h-14 w-full items-center justify-between gap-3 rounded-card border bg-white px-4 text-left text-body font-semibold transition-colors hover:border-teal',
                  l.code === lang ? 'border-teal ring-2 ring-teal/20' : 'border-line',
                )}
              >
                {l.name}
                {l.code === lang && <Check className="size-5 text-teal" strokeWidth={3} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  )
}
