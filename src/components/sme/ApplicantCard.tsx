import { Lock, Phone } from 'lucide-react'
import type { Application, Student } from '../../types'
import { Avatar, toneFor } from '../ui/Avatar'
import { Tag } from '../ui/Tag'
import { Button, ExternalButton } from '../ui/Button'
import { StatusBadge } from '../ui/StatusBadge'
import { startsIn } from '../../lib/format'
import { PARTNER_COLLEGE_SHORT } from '../../lib/config'

interface Props {
  application: Application
  student: Student
  onAccept: () => void
  onDecline: () => void
}

export function ApplicantCard({ application, student, onAccept, onDecline }: Props) {
  const s = application.status
  return (
    <article className="rounded-card bg-white p-4 shadow-card" aria-label={`Applicant ${student.shortName}`}>
      <div className="flex items-center gap-3">
        <Avatar name={student.shortName} tone={toneFor(student.id)} />
        <div className="min-w-0">
          <h2 className="text-heading font-semibold leading-snug">{student.shortName}</h2>
          <p className="text-detail text-muted">
            {student.course}, {PARTNER_COLLEGE_SHORT} · {application.distanceKm} km
          </p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Skills">
        {student.skills.map((k) => (
          <li key={k}>
            <Tag tone="neutral">{k}</Tag>
          </li>
        ))}
      </ul>

      {application.source === 'setu' && <p className="mt-3 text-detail text-teal">Added by Setu, who thought this student would suit you.</p>}

      {s === 'waiting' && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={onAccept} aria-label={`Accept ${student.shortName}`}>Accept</Button>
            <Button variant="secondary" onClick={onDecline} aria-label={`Not this time for ${student.shortName}`}>Not this time</Button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-detail text-muted">
            <Lock className="size-3.5" aria-hidden="true" />
            Phone number is shared after you accept.
          </p>
        </>
      )}

      {s === 'accepted' && (
        <div className="mt-4 flex flex-col gap-3">
          <StatusBadge status="accepted" label={`Accepted · ${startsIn(application.startsOn).replace('Starts', 'starts')}`} />
          <div className="flex flex-wrap items-center gap-3 rounded-button bg-leaf-mist p-3">
            <div className="min-w-0 flex-1">
              <p className="text-detail text-leaf">Phone number</p>
              <p className="font-semibold text-ink">{student.phone}</p>
            </div>
            <ExternalButton href={`tel:${student.phone.replace(/\s/g, '')}`} variant="secondary" size="sm" icon={<Phone className="size-4" aria-hidden="true" />} aria-label={`Call ${student.shortName}`}>
              Call
            </ExternalButton>
          </div>
        </div>
      )}

      {s === 'not_selected' && (
        <div className="mt-4 flex flex-col gap-2">
          <StatusBadge status="not_selected" />
          <p className="text-detail text-muted">Setu has let {student.firstName} know kindly, so you don't have to.</p>
        </div>
      )}

      {s === 'completed' && (
        <div className="mt-4">
          <StatusBadge status="completed" />
        </div>
      )}
    </article>
  )
}
