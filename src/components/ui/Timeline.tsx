import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import { t } from '../../lib/i18n'

export type StepState = 'done' | 'current' | 'todo'
export interface TimelineStep {
  title: string
  detail: string
  state: StepState
}

/** The "What happens next" pattern. A core Setu UX pattern: no silence after any action. */
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => {
        const last = i === steps.length - 1
        return (
          <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0" aria-current={s.state === 'current' ? 'step' : undefined}>
            {!last && <span aria-hidden="true" className={cn('absolute left-[13px] top-8 bottom-0 w-0.5', 'bg-line')} />}
            <span
              aria-hidden="true"
              className={cn(
                'relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2',
                s.state === 'done' && 'border-teal bg-teal text-white',
                s.state === 'current' && 'border-teal bg-white',
                s.state === 'todo' && 'border-line bg-white',
              )}
            >
              {s.state === 'done' && <Check className="size-4" strokeWidth={3} />}
              {s.state === 'current' && <span className="size-2.5 rounded-full bg-teal" />}
            </span>
            <div className="-mt-0.5">
              <p className={cn('text-body font-semibold', s.state === 'todo' ? 'text-muted' : 'text-ink')}>
                {s.title}
                <span className="sr-only">{s.state === 'done' ? ` ${t('(done)')}` : s.state === 'current' ? ` ${t('(now)')}` : ` ${t('(later)')}`}</span>
              </p>
              <p className="text-detail text-muted">{s.detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
