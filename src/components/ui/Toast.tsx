import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ToastInput {
  message: string
  action?: { label: string; onClick: () => void }
  ms?: number
}
interface ToastItem extends ToastInput {
  id: number
}

const ToastContext = createContext<{ show: (t: ToastInput) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<ToastItem | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const dismiss = useCallback(() => setItem(null), [])
  const show = useCallback((t: ToastInput) => {
    window.clearTimeout(timer.current)
    setItem({ ...t, id: Date.now() })
    timer.current = window.setTimeout(() => setItem(null), t.ms ?? (t.action ? 7000 : 4000))
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])
  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 lg:bottom-8"
      >
        {item && (
          <div
            key={item.id}
            className="pointer-events-auto flex w-full max-w-md animate-rise items-center gap-3 rounded-button bg-ink py-3 pl-4 pr-2 text-white shadow-lift"
          >
            <CheckCircle2 className="size-5 shrink-0 text-apricot" aria-hidden="true" />
            <p className="flex-1 text-button font-medium">{item.message}</p>
            {item.action && (
              <button
                type="button"
                onClick={() => {
                  item.action?.onClick()
                  dismiss()
                }}
                className="min-h-11 rounded-button px-3 text-button font-bold text-apricot hover:bg-white/10"
              >
                {item.action.label}
              </button>
            )}
            <button type="button" aria-label="Dismiss message" onClick={dismiss} className="grid size-11 place-items-center rounded-button hover:bg-white/10">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
