import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../hooks/useApp'
import { greeting, isNewThisWeek, plural } from '../../lib/format'
import { applicationFor, findSme, visibleOpenings } from '../../lib/selectors'
import { HelperNote } from '../../components/ui/HelperNote'
import { Chip } from '../../components/ui/Chip'
import { InternshipCard } from '../../components/internship/InternshipCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { t } from '../../lib/i18n'

type Filter = 'all' | 'paid' | 'credit'

export default function StudentHome() {
  const { state, currentStudent, toggleSave } = useApp()
  const [filter, setFilter] = useState<Filter>('all')

  const openings = visibleOpenings(state)
  const newCount = openings.filter(isNewThisWeek).length
  const shown = openings.filter((i) => (filter === 'paid' ? i.stipend != null : filter === 'credit' ? i.countsForCredit : true))
  const waiting = state.applications.filter((a) => a.studentId === currentStudent.id && a.status === 'waiting').length

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-detail text-muted">{greeting()},</p>
        <h1 className="text-title font-bold lg:text-[2rem]">{currentStudent.firstName}</h1>
        <p className="mt-1 text-body text-muted">
          {newCount === 0 ? t('No new openings this week. Check back soon.') : t('{count} near you this week', { count: plural(newCount, 'new opening') })}
        </p>
      </header>

      <HelperNote>{t('Our team visits every business in person before it can post here.')}</HelperNote>

      {waiting > 0 && (
        <p className="text-body text-muted">
          {t('You have {count} waiting for a reply.', { count: plural(waiting, 'application') })}{' '}
          <Link to="/student/applications" className="font-semibold text-teal underline underline-offset-4">
            {t('See where they are')}
          </Link>
        </p>
      )}

      <div role="group" aria-label={t('Filter openings')} className="flex flex-wrap gap-2">
        <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>{t('All')}</Chip>
        <Chip selected={filter === 'paid'} onClick={() => setFilter('paid')}>{t('Paid')}</Chip>
        <Chip selected={filter === 'credit'} onClick={() => setFilter('credit')}>{t('Counts for credit')}</Chip>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={t('Nothing matches that filter')}
          body={t('Try another filter. New openings from visited businesses show up here.')}
          action={<Button full variant="secondary" onClick={() => setFilter('all')}>{t('Show all openings')}</Button>}
        />
      ) : (
        <section aria-label={t('Openings near you')} className="grid gap-3 sm:grid-cols-2">
          {shown.map((i) => {
            const sme = findSme(state, i.smeId)!
            return (
              <InternshipCard
                key={i.id}
                internship={i}
                sme={sme}
                saved={state.saved.includes(i.id)}
                onToggleSave={() => toggleSave(i.id)}
                application={applicationFor(state, i.id, currentStudent.id)}
              />
            )
          })}
        </section>
      )}
      <p className="text-center text-detail text-muted">{t('Showing openings in Nashik only, for now.')}</p>
    </div>
  )
}
