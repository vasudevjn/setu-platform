import { useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { PageTitle } from '../../components/ui/PageHeader'
import { Chip } from '../../components/ui/Chip'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import { findInternship, findSme, findStudent } from '../../lib/selectors'
import { relativeDay, statusLabel } from '../../lib/format'
import { useToast } from '../../components/ui/Toast'
import type { ApplicationStatus } from '../../types'

const CHOICES: ApplicationStatus[] = ['waiting', 'accepted', 'not_selected', 'completed']
type Filter = 'all' | ApplicationStatus

export default function AdminApplications() {
  const { state, setStatus } = useApp()
  const { show } = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const list = state.applications
    .filter((a) => a.status !== 'withdrawn')
    .filter((a) => filter === 'all' || a.status === filter)
    .sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt))

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Applications" sub="Change a status when you have spoken to the business or the student." />
      <div role="group" aria-label="Filter applications" className="flex flex-wrap gap-2">
        <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        {CHOICES.map((c) => (
          <Chip key={c} selected={filter === c} onClick={() => setFilter(c)}>{statusLabel[c]}</Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title="Nothing here" body="No applications match this filter." />
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((a) => {
            const st = findStudent(state, a.studentId)
            const i = findInternship(state, a.internshipId)
            const sme = i && findSme(state, i.smeId)
            if (!st || !i || !sme) return null
            const selectId = `status-${a.id}`
            return (
              <li key={a.id}>
                <Card className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
                  <div className="min-w-0 flex-1 basis-56">
                    <p className="font-semibold leading-snug">{st.shortName} <span className="font-normal text-muted">applied to</span> {i.title}</p>
                    <p className="text-detail text-muted">{sme.name} · {relativeDay(a.appliedAt)}{a.source === 'setu' ? ' · Added by Setu' : ''}</p>
                  </div>
                  <StatusBadge status={a.status} />
                  <div>
                    <label htmlFor={selectId} className="sr-only">Status for {st.shortName} at {sme.name}</label>
                    <select
                      id={selectId}
                      value={a.status}
                      onChange={(e) => {
                        const next = e.target.value as ApplicationStatus
                        setStatus(a.id, next)
                        show({ message: `${st.shortName} is now "${statusLabel[next]}". ${next === 'waiting' ? '' : 'They have been told.'}`.trim() })
                      }}
                      className="min-h-11 rounded-button border border-line bg-white px-3 text-body"
                    >
                      {CHOICES.map((c) => (
                        <option key={c} value={c}>{statusLabel[c]}</option>
                      ))}
                    </select>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
