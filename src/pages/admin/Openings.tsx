import { useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { PageTitle } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Button } from '../../components/ui/Button'
import { MatchSheet } from '../../components/admin/MatchSheet'
import { applicantsFor, findSme, isVisibleToStudents } from '../../lib/selectors'
import { money, plural } from '../../lib/format'
import { useToast } from '../../components/ui/Toast'
import type { Internship } from '../../types'
import { t } from '../../lib/i18n'

export default function AdminOpenings() {
  const { state, setInternshipStatus } = useApp()
  const { show } = useToast()
  const [matching, setMatching] = useState<Internship | null>(null)

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={t('Openings')} sub={t('Every opening, including ones students cannot see yet.')} />
      <ul className="grid gap-3 md:grid-cols-2">
        {state.internships.map((i) => {
          const sme = findSme(state, i.smeId)!
          const visible = isVisibleToStudents(state, i)
          const apps = applicantsFor(state, i.id)
          return (
            <li key={i.id}>
              <Card className="flex h-full flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-heading font-semibold leading-snug">{t(i.title)}</p>
                    <p className="text-muted">{sme.name}</p>
                  </div>
                  <Tag tone={visible ? 'leaf' : i.status === 'closed' ? 'stone' : 'honey'}>
                    {visible ? t('Visible to students') : i.status === 'closed' ? t('Closed') : t('Hidden: not visited yet')}
                  </Tag>
                </div>
                <p className="text-detail text-muted">
                  {money(i.stipend)} · {plural(i.weeks, 'week')} · {t('{n} km', { n: sme.distanceKm })} · {plural(apps.length, 'applicant')}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Button size="sm" variant="soft" onClick={() => setMatching(i)}>{t('Assist with matching')}</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setInternshipStatus(i.id, i.status === 'live' ? 'closed' : 'live')
                      show({ message: i.status === 'live' ? t('Opening closed.') : t('Opening is live again.') })
                    }}
                  >
                    {i.status === 'live' ? t('Close') : t('Reopen')}
                  </Button>
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
      <MatchSheet internship={matching} onClose={() => setMatching(null)} />
    </div>
  )
}
