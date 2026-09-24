import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { PageTitle } from '../../components/ui/PageHeader'
import { StatCard } from '../../components/admin/StatCard'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { VerifyDialog } from '../../components/admin/VerifyDialog'
import { SmeDetailSheet } from '../../components/admin/SmeDetailSheet'
import { findInternship, findSme, findStudent, isVisibleToStudents } from '../../lib/selectors'
import { relativeDay, shortDate } from '../../lib/format'
import type { SME } from '../../types'
import { t } from '../../lib/i18n'

export default function AdminDashboard() {
  const { state } = useApp()
  const [verifying, setVerifying] = useState<SME | null>(null)
  const [viewing, setViewing] = useState<SME | null>(null)

  const verified = state.smes.filter((s) => s.verified).length
  const live = state.internships.filter((i) => isVisibleToStudents(state, i)).length
  const apps = state.applications.filter((a) => a.status !== 'withdrawn')
  const accepted = apps.filter((a) => a.status === 'accepted' || a.status === 'completed').length
  const completed = apps.filter((a) => a.status === 'completed').length
  const queue = state.smes.filter((s) => !s.verified).sort((a, b) => +new Date(a.submittedOn) - +new Date(b.submittedOn))
  const recent = [...apps].sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt)).slice(0, 6)
  const held = state.internships.filter((i) => i.status === 'live' && !isVisibleToStudents(state, i)).length

  return (
    <div className="flex flex-col gap-6">
      <PageTitle title={t('Dashboard')} sub={t('Nashik pilot · BCOM Arts & Commerce College')} />

      <section aria-label={t('Numbers')} className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatCard value={verified} label={t('Verified SMEs')} />
        <StatCard value={live} label={t('Live openings')} hint={held ? t('{count} waiting for a visit', { count: held }) : undefined} />
        <StatCard value={apps.length} label={t('Applications')} />
        <StatCard value={accepted} label={t('Accepted')} />
        <StatCard value={completed} label={t('Completed')} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="queue">
          <h2 id="queue" className="text-heading font-semibold">{t('SME Verification Queue')}</h2>
          <p className="mb-3 text-detail text-muted">{t('Verify only after an in-person visit.')}</p>
          {queue.length === 0 ? (
            <Card className="p-5 text-muted">{t('Everyone in the queue has been visited. Nice work.')}</Card>
          ) : (
            <ul className="flex flex-col gap-3">
              {queue.map((s) => (
                <li key={s.id}>
                  <Card className="flex flex-wrap items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug">{s.name}</p>
                      <p className="text-detail text-muted">{t(s.town)} · {t('Submitted {date}', { date: shortDate(s.submittedOn) })}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setViewing(s)} aria-label={t('View {name}', { name: s.name })}>{t('View')}</Button>
                      <Button size="sm" onClick={() => setVerifying(s)} aria-label={t('Verify {name}', { name: s.name })}>{t('Verify')}</Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="recent">
          <div className="flex items-end justify-between">
            <h2 id="recent" className="text-heading font-semibold">{t('Recent Applications')}</h2>
            <Link to="/admin/applications" className="inline-flex min-h-11 items-center gap-1 font-semibold text-teal">
              {t('See All')} <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-2 flex flex-col gap-2">
            {recent.map((a) => {
              const st = findStudent(state, a.studentId)
              const i = findInternship(state, a.internshipId)
              const sme = i && findSme(state, i.smeId)
              return (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-card bg-white p-3 shadow-card">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{st?.shortName} · {i && t(i.title)}</p>
                    <p className="text-detail text-muted">{sme?.name} · {relativeDay(a.appliedAt)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <VerifyDialog sme={verifying} onClose={() => setVerifying(null)} />
      <SmeDetailSheet
        sme={viewing}
        onClose={() => setViewing(null)}
        onVerify={(s) => {
          setViewing(null)
          setVerifying(s)
        }}
      />
    </div>
  )
}
