import { Award, BadgeCheck } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { PageTitle } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Avatar, toneFor } from '../../components/ui/Avatar'
import { certifiedCourses } from '../../lib/courses'
import { plural } from '../../lib/format'
import { t } from '../../lib/i18n'

export default function AdminStudents() {
  const { state } = useApp()
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={t('Students')} sub={t('{count} at BCOM Arts & Commerce College', { count: plural(state.students.length, 'student') })} />
      <ul className="grid gap-3 md:grid-cols-2">
        {state.students.map((s) => {
          const apps = state.applications.filter((a) => a.studentId === s.id && a.status !== 'withdrawn')
          const certified = certifiedCourses(s)
          return (
            <li key={s.id}>
              <Card className="flex h-full flex-col gap-3 p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <Avatar name={s.shortName} tone={toneFor(s.id)} />
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="text-heading font-semibold leading-snug">{s.firstName} {s.lastName}</p>
                    <p className="text-detail text-muted">{t(s.course)} · {t(s.year)}</p>
                    <p className="text-detail text-muted">{s.phone}</p>
                  </div>
                  {s.collegeVerified && <Tag tone="trust" icon={<BadgeCheck className="size-3.5" aria-hidden="true" />}>{t('College confirmed')}</Tag>}
                </div>
                <ul className="flex flex-wrap gap-2" aria-label={t('Skills')}>
                  {s.skills.map((k) => (
                    <li key={k}><Tag tone="neutral">{t(k)}</Tag></li>
                  ))}
                </ul>
                {certified.length > 0 && (
                  <ul className="flex flex-wrap gap-2" aria-label={t('Setu Certified courses')}>
                    {certified.map((c) => (
                      <li key={c.id}><Tag tone="trust" icon={<Award className="size-3.5" aria-hidden="true" />}>{t('Setu Certified · {title}', { title: t(c.title) })}</Tag></li>
                    ))}
                  </ul>
                )}
                <p className="text-detail text-muted">{t('{applications}, {accepted} accepted', { applications: plural(apps.length, 'application'), accepted: apps.filter((a) => a.status === 'accepted' || a.status === 'completed').length })}</p>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
