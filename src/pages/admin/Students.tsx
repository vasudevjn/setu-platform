import { BadgeCheck } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { PageTitle } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Avatar, toneFor } from '../../components/ui/Avatar'
import { plural } from '../../lib/format'

export default function AdminStudents() {
  const { state } = useApp()
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Students" sub={`${plural(state.students.length, 'student')} at BCOM Arts & Commerce College`} />
      <ul className="grid gap-3 md:grid-cols-2">
        {state.students.map((s) => {
          const apps = state.applications.filter((a) => a.studentId === s.id && a.status !== 'withdrawn')
          return (
            <li key={s.id}>
              <Card className="flex h-full flex-col gap-3 p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <Avatar name={s.shortName} tone={toneFor(s.id)} />
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="text-heading font-semibold leading-snug">{s.firstName} {s.lastName}</p>
                    <p className="text-detail text-muted">{s.course} · {s.year}</p>
                    <p className="text-detail text-muted">{s.phone}</p>
                  </div>
                  {s.collegeVerified && <Tag tone="trust" icon={<BadgeCheck className="size-3.5" aria-hidden="true" />}>College confirmed</Tag>}
                </div>
                <ul className="flex flex-wrap gap-2" aria-label="Skills">
                  {s.skills.map((k) => (
                    <li key={k}><Tag tone="neutral">{k}</Tag></li>
                  ))}
                </ul>
                <p className="text-detail text-muted">{plural(apps.length, 'application')}, {apps.filter((a) => a.status === 'accepted' || a.status === 'completed').length} accepted</p>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
