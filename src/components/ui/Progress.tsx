import { cn } from '../../lib/cn'

/** Segmented progress bar, as in the "Post an opening" mockup. */
export function SegmentBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < step ? 'bg-teal' : 'bg-stone-mist')} />
      ))}
    </div>
  )
}
