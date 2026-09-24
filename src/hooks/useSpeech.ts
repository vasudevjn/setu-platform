import { useCallback, useEffect, useRef, useState } from 'react'
import { LANGS, getLang } from '../lib/i18n'

interface RecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>; resultIndex: number }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

type Ctor = new () => RecognitionLike

function getCtor(): Ctor | null {
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/** Optional voice typing for the "Post an opening" mic. Falls back cleanly when unsupported. */
export function useSpeech(onText: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const rec = useRef<RecognitionLike | null>(null)
  const supported = typeof window !== 'undefined' && !!getCtor()

  useEffect(() => () => rec.current?.stop(), [])

  const toggle = useCallback(() => {
    if (listening) {
      rec.current?.stop()
      return
    }
    const C = getCtor()
    if (!C) return
    const r = new C()
    r.lang = LANGS.find((l) => l.code === getLang())?.locale ?? 'en-IN' // listens in the chosen language
    r.interimResults = false
    r.continuous = false
    r.onresult = (e) => {
      let t = ''
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript
      if (t.trim()) onText(t.trim())
    }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    rec.current = r
    setListening(true)
    r.start()
  }, [listening, onText])

  return { supported, listening, toggle }
}
