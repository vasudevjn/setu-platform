import type { ReactNode } from 'react'
import { BackButton } from './PageHeader'
import { SegmentBar } from './Progress'
import { Button } from './Button'

interface StepFlowProps {
  step: number
  total: number
  title: string
  sub?: string
  children: ReactNode
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  nextLoading?: boolean
  /** Extra line under the primary button */
  footnote?: ReactNode
}

/** One question per screen. Shared by onboarding and "Post an opening". */
export function StepFlow({ step, total, title, sub, children, onBack, onNext, nextLabel = 'Continue', nextDisabled, nextLoading, footnote }: StepFlowProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-xl flex-col">
      <div className="flex items-center justify-between">
        <BackButton label="Go back one step" onClick={onBack} />
        <p className="text-button text-muted">
          Step {step} of {total}
        </p>
      </div>
      <div className="mt-1">
        <SegmentBar step={step} total={total} />
      </div>
      <form
        className="flex flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          if (!nextDisabled) onNext()
        }}
      >
        <div className="mt-6 flex-1">
          <h1 className="text-title font-bold">{title}</h1>
          {sub && <p className="mt-2 text-body text-muted">{sub}</p>}
          <div className="mt-6 flex flex-col gap-5">{children}</div>
        </div>
        <div className="safe-bottom sticky bottom-0 -mx-4 mt-8 bg-cream/95 px-4 pb-4 pt-3 backdrop-blur lg:static lg:mx-0 lg:px-0">
          <Button type="submit" size="lg" full disabled={nextDisabled} loading={nextLoading}>
            {nextLabel}
          </Button>
          {footnote && <div className="mt-2 text-center text-detail text-muted">{footnote}</div>}
        </div>
      </form>
    </div>
  )
}
