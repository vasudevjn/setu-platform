import type { Application, Internship, SME } from '../../types'
import { Timeline, type TimelineStep } from '../ui/Timeline'
import { relativeDay, startsIn } from '../../lib/format'

/** Builds "What happens next" from the real application status. */
export function ApplicationTimeline({ application, internship, sme }: { application: Application; internship: Internship; sme: SME }) {
  const owner = sme.ownerFirstName
  const s = application.status
  let steps: TimelineStep[]

  if (s === 'waiting' || s === 'withdrawn') {
    steps = [
      { title: 'You applied', detail: relativeDay(application.appliedAt), state: 'done' },
      { title: `${owner} looks at your profile`, detail: 'Usually 1 to 3 days', state: 'current' },
      { title: 'You hear back', detail: 'By SMS and in the app', state: 'todo' },
      { title: 'Start your internship', detail: 'We share a joining checklist', state: 'todo' },
    ]
  } else if (s === 'accepted') {
    steps = [
      { title: 'You applied', detail: relativeDay(application.appliedAt), state: 'done' },
      { title: `${owner} looked at your profile`, detail: 'Done', state: 'done' },
      { title: 'You heard back', detail: `Accepted · ${application.decidedAt ? relativeDay(application.decidedAt) : 'Today'}`, state: 'done' },
      { title: 'Start your internship', detail: startsIn(application.startsOn), state: 'current' },
    ]
  } else if (s === 'completed') {
    steps = [
      { title: 'You applied', detail: relativeDay(application.appliedAt), state: 'done' },
      { title: `${owner} looked at your profile`, detail: 'Done', state: 'done' },
      { title: 'You heard back', detail: 'Accepted', state: 'done' },
      { title: 'You finished your internship', detail: `${internship.weeks} weeks at ${sme.name}`, state: 'done' },
    ]
  } else {
    steps = [
      { title: 'You applied', detail: relativeDay(application.appliedAt), state: 'done' },
      { title: `${owner} looked at your profile`, detail: 'Done', state: 'done' },
      { title: 'You heard back', detail: 'Not this time', state: 'done' },
    ]
  }
  return <Timeline steps={steps} />
}
