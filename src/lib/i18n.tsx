import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Language support: English, Hindi and Marathi.
 *
 * How it works
 * - The English text IS the key: t('Apply with my profile'). If a language has no entry, English shows.
 * - Placeholders use {name}: t('Hello, {name}', { name }).
 * - Never call t() at module level. Keep English in constants and call t() when rendering.
 * - Values saved in the database stay English. Only what is shown on screen is translated.
 * - Notifications are saved in English. Screens translate them with tm() (see src/lib/notes.ts).
 */

export type Lang = 'en' | 'hi' | 'mr'

export const LANGS: { code: Lang; name: string; short: string; locale: string }[] = [
  { code: 'en', name: 'English', short: 'EN', locale: 'en-IN' },
  { code: 'hi', name: 'हिन्दी', short: 'हिं', locale: 'hi-IN' },
  { code: 'mr', name: 'मराठी', short: 'मरा', locale: 'mr-IN' },
]

type Dict = Record<string, string>

const STORAGE_KEY = 'setu.lang.v1'
const loaders: Record<Exclude<Lang, 'en'>, () => Promise<{ default: Dict }>> = {
  hi: () => import('../i18n/hi'),
  mr: () => import('../i18n/mr'),
}
const dicts: Partial<Record<Lang, Dict>> = {}

function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'hi' || v === 'mr'
}

function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (isLang(q)) {
      localStorage.setItem(STORAGE_KEY, q)
      return q
    }
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch {
    /* storage can be blocked, fall through */
  }
  return 'en'
}

let current: Lang = initialLang()

export const getLang = () => current

/** Locale for dates. Latin digits are forced so numbers look the same in every language. */
export function getLocale() {
  const base = LANGS.find((l) => l.code === current)?.locale ?? 'en-IN'
  return `${base}-u-nu-latn`
}

async function ensure(lang: Lang) {
  if (lang === 'en' || dicts[lang]) return
  dicts[lang] = (await loaders[lang]()).default
}

/** Fills {name} placeholders. Works on any string. */
export function fmt(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))
}

/** Translate a fixed English string. Falls back to English when there is no entry. */
export function t(en: string, vars?: Record<string, string | number>) {
  const hit = current === 'en' ? undefined : dicts[current]?.[en]
  return fmt(hit ?? en, vars)
}

const templateCache = new Map<string, { re: RegExp; keys: string[] }>()
function compile(template: string) {
  let c = templateCache.get(template)
  if (!c) {
    const keys: string[] = []
    const src = template
      .split(/(\{\w+\})/)
      .map((part) => {
        const m = /^\{(\w+)\}$/.exec(part)
        if (m) {
          keys.push(m[1])
          return '(.+?)'
        }
        return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      })
      .join('')
    c = { re: new RegExp(`^${src}$`), keys }
    templateCache.set(template, c)
  }
  return c
}

/**
 * Translate a saved English message that has values in it, like a notification.
 * `templates` are the English templates it may have been built from.
 */
export function tm(text: string, templates: readonly string[]) {
  if (current === 'en') return text
  for (const tpl of templates) {
    if (!tpl.includes('{')) {
      if (tpl === text) return t(tpl)
      continue
    }
    const { re, keys } = compile(tpl)
    const m = re.exec(text)
    if (m) {
      const vars: Record<string, string> = {}
      keys.forEach((k, i) => (vars[k] = t(m[i + 1])))
      return t(tpl, vars)
    }
  }
  return t(text)
}

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => Promise<void>
}
const Ctx = createContext<LangCtx>({ lang: 'en', setLang: async () => {} })

export const useLang = () => useContext(Ctx)

/** Holds the chosen language. Loads the word list first so screens never flash English. */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(current)
  const [ready, setReady] = useState(current === 'en')

  useEffect(() => {
    document.documentElement.lang = current
    if (current === 'en') return
    let alive = true
    ensure(current).then(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])

  const setLang = useCallback(async (next: Lang) => {
    if (next === current) return
    await ensure(next)
    current = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = next
    setLangState(next)
    setReady(true)
  }, [])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  return <Ctx.Provider value={value}>{ready ? children : null}</Ctx.Provider>
}

/**
 * Re-creates everything inside it when the language changes, so every screen redraws in the new
 * language. Put it around the routes only, not around the data layer.
 */
export function LangBoundary({ children }: { children: ReactNode }) {
  const { lang } = useLang()
  return <Fragment key={lang}>{children}</Fragment>
}
