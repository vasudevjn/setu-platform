import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Avatar, toneFor } from '../ui/Avatar'
import { Tag } from '../ui/Tag'
import type { Internship } from '../../types'
import { useApp } from '../../hooks/useApp'
import { applicationFor, findSme } from '../../lib/selectors'
import { useToast } from '../ui/Toast'

/** Manual, assisted matching (a v1 decision): the Setu team adds a student who suits an opening. */
export function MatchSheet({ internship, onClose }: { internship: Internship | null; onClose: () => void }) {
  const { state, apply } = useApp()
  const { show } = useToast()
  const sme = internship ? findSme(state, internship.smeId) : undefined
  const candidates = internship
    ? state.students
        .filter((s) => s.onboarded && s.collegeVerified)
        .map((s) => ({ s, app: applicationFor(state, internship.id, s.id) }))
    : []

  return (
    <Sheet open={!!internship} onClose={onClose} title={internship ? `Match students to ${internship.title}` : ''}>
      {internship && sme && (
        <div className="flex flex-col gap-3">
          <p className="text-muted">
            Pick students you think would suit {sme.name}. They are added to the applicant list, marked "Added by Setu". The student is told about it.
          </p>
          <ul className="flex flex-col gap-2">
            {candidates.map(({ s, app }) => {
              const already = app && app.status !== 'withdrawn'
              return (
                <li key={s.id} className="flex items-center gap-3 rounded-card bg-white p-3 shadow-card">
                  <Avatar name={s.shortName} size="sm" tone={toneFor(s.id)} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{s.shortName}</p>
                    <p className="text-detail text-muted">{s.course} · {s.skills.join(', ')}</p>
                  </div>
                  {already ? (
                    <Tag tone="neutral">Applied</Tag>
                  ) : (
                    <Button
                      size="sm"
                      variant="soft"
                      aria-label={`Add ${s.shortName} to ${internship.title}`}
                      onClick={() => {
                        apply(internship.id, s.id, 'setu')
                        show({ message: `${s.shortName} added to ${internship.title}.` })
                      }}
                    >
                      Add
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </Sheet>
  )
}
