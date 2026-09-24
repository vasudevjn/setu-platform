import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { findInternship, findSme, otherOpeningsFor, studentApplications } from '../../lib/selectors'
import { PageTitle } from '../../components/ui/PageHeader'
import { Chip } from '../../components/ui/Chip'
import { Avatar } from '../../components/ui/Avatar'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import { LinkButton } from '../../components/ui/Button'
import { relativeDay, plural, startsIn } from '../../lib/format'
import type { ApplicationStatus } from '../../types'

type Filter = 'all' | ApplicationStatus

export default function Applications() {
  const { state, currentStudent } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const all = studentApplications(state, currentStudent.id).filter((a) => a.status !== 'withdrawn')
  const list = all.filter((a) => filter === 'all' || a.status === filter)
  const otherCount = otherOpeningsFor(state, currentStudent.id).length

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="My applications" sub={all.length ? `You have applied to ${plural(all.length, 'opening')}.` : undefined} />

      {all.length === 0 ? (
        <EmptyState
          title="You haven't applied yet"
          body="When you apply, you can see here where each application is. It takes one tap."
          action={<LinkButton to="/student" full>See openings near me</LinkButton>}
        />
      ) : (
        <>
          <div role="group" aria-label="Filter applications" className="flex flex-wrap gap-2">
            <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
            <Chip selected={filter === 'waiting'} onClick={() => setFilter('waiting')}>Waiting to hear</Chip>
            <Chip selected={filter === 'accepted'} onClick={() => setFilter('accepted')}>Accepted</Chip>
            <Chip selected={filter === 'not_selected'} onClick={() => setFilter('not_selected')}>Not this time</Chip>
          </div>

          {list.length === 0 && <p className="text-muted">Nothing here yet.</p>}

          <ul className="grid gap-3 sm:grid-cols-2">
            {list.map((a) => {
              const internship = findInternship(state, a.internshipId)
              const sme = internship && findSme(state, internship.smeId)
              if (!internship || !sme) return null
              return (
                <li key={a.id}>
                  <Link
                    to={`/student/applications/${a.id}`}
                    className="flex h-full flex-col gap-3 rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-lift"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={sme.name} tone={sme.tone} />
                      <div className="min-w-0 flex-1">
                        <h2 className="text-heading font-semibold leading-snug">{internship.title}</h2>
                        <p className="text-muted">{sme.name}</p>
                      </div>
                      <ChevronRight className="mt-1 size-5 shrink-0 text-muted" aria-hidden="true" />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <StatusBadge status={a.status} label={a.status === 'accepted' ? `Accepted · ${startsIn(a.startsOn).replace('Starts', 'starts')}` : undefined} />
                      <span className="text-detail text-muted">Applied {relativeDay(a.appliedAt).toLowerCase()}</span>
                    </div>
                    {a.status === 'not_selected' && (
                      <p className="text-body text-muted">
                        Not this time. {otherCount > 0 ? `Here ${otherCount === 1 ? 'is' : 'are'} ${plural(otherCount, 'other opening')} near you.` : 'More openings are on the way.'}
                      </p>
                    )}
                    {a.status === 'waiting' && <p className="text-detail text-muted">{sme.ownerFirstName} usually replies within 3 days.</p>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
