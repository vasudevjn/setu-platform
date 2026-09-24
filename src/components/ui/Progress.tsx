import { cn } from '../../lib/cn'
import { t } from '../../lib/i18n'

/** Segmented progress bar, as in the "Post an opening" mockup. */
export function SegmentBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={t('Step {step} of {total}', { step, total })}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < step ? 'bg-teal' : 'bg-stone-mist')} />
      ))}
    </div>
  )
}
