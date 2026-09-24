import type { Application, Internship, SME } from '../../types'
import { Timeline, type TimelineStep } from '../ui/Timeline'
import { plural, relativeDay, startsIn } from '../../lib/format'
import { t } from '../../lib/i18n'

/** Builds "What happens next" from the real application status. */
export function ApplicationTimeline({ application, internship, sme }: { application: Application; internship: Internship; sme: SME }) {
  const owner = sme.ownerFirstName
  const s = application.status
  let steps: TimelineStep[]

  if (s === 'waiting' || s === 'withdrawn') {
    steps = [
      { title: t('You applied'), detail: relativeDay(application.appliedAt), state: 'done' },
      { title: t('{owner} looks at your profile', { owner }), detail: t('Usually 1 to 3 days'), state: 'current' },
      { title: t('You hear back'), detail: t('By SMS and in the app'), state: 'todo' },
      { title: t('Start your internship'), detail: t('We share a joining checklist'), state: 'todo' },
    ]
  } else if (s === 'accepted') {
    steps = [
      { title: t('You applied'), detail: relativeDay(application.appliedAt), state: 'done' },
      { title: t('{owner} looked at your profile', { owner }), detail: t('Done'), state: 'done' },
      { title: t('You heard back'), detail: t('Accepted · {when}', { when: application.decidedAt ? relativeDay(application.decidedAt) : t('Today') }), state: 'done' },
      { title: t('Start your internship'), detail: startsIn(application.startsOn), state: 'current' },
    ]
  } else if (s === 'completed') {
    steps = [
      { title: t('You applied'), detail: relativeDay(application.appliedAt), state: 'done' },
      { title: t('{owner} looked at your profile', { owner }), detail: t('Done'), state: 'done' },
      { title: t('You heard back'), detail: t('Accepted'), state: 'done' },
      { title: t('You finished your internship'), detail: t('{duration} at {business}', { duration: plural(internship.weeks, 'week'), business: sme.name }), state: 'done' },
    ]
  } else {
    steps = [
      { title: t('You applied'), detail: relativeDay(application.appliedAt), state: 'done' },
      { title: t('{owner} looked at your profile', { owner }), detail: t('Done'), state: 'done' },
      { title: t('You heard back'), detail: t('Not this time'), state: 'done' },
    ]
  }
  return <Timeline steps={steps} />
}
