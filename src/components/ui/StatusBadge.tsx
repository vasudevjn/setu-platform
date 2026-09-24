import { Check, Clock, Undo2 } from 'lucide-react'
import type { ApplicationStatus } from '../../types'
import { Tag, type TagTone } from './Tag'
import { statusLabel } from '../../lib/format'

const tone: Record<ApplicationStatus, TagTone> = {
  waiting: 'honey',
  accepted: 'leaf',
  not_selected: 'stone',
  completed: 'leaf',
  withdrawn: 'stone',
}

/** Status is always shown with words, never colour alone. "Not this time" has no icon, as in the style guide. */
export function StatusBadge({ status, label }: { status: ApplicationStatus; label?: string }) {
  const icon =
    status === 'waiting' ? (
      <Clock className="size-3.5" aria-hidden="true" />
    ) : status === 'accepted' || status === 'completed' ? (
      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
    ) : status === 'withdrawn' ? (
      <Undo2 className="size-3.5" aria-hidden="true" />
    ) : undefined
  return (
    <Tag tone={tone[status]} icon={icon}>
      {label ?? statusLabel[status]}
    </Tag>
  )
}
