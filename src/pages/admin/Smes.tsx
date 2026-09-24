import { useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { PageTitle } from '../../components/ui/PageHeader'
import { Chip } from '../../components/ui/Chip'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { VerifyDialog } from '../../components/admin/VerifyDialog'
import { SmeDetailSheet } from '../../components/admin/SmeDetailSheet'
import { openingsOfSme } from '../../lib/selectors'
import { shortDate, plural } from '../../lib/format'
import type { SME } from '../../types'
import { t } from '../../lib/i18n'

type Filter = 'all' | 'waiting' | 'verified'

export default function AdminSmes() {
  const { state } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const [verifying, setVerifying] = useState<SME | null>(null)
  const [viewing, setViewing] = useState<SME | null>(null)
  const list = state.smes.filter((s) => (filter === 'all' ? true : filter === 'verified' ? s.verified : !s.verified))

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={t('SMEs')} sub={t('{visited} visited, {waiting} waiting for a visit', { visited: state.smes.filter((s) => s.verified).length, waiting: state.smes.filter((s) => !s.verified).length })} />
      <div role="group" aria-label={t('Filter businesses')} className="flex flex-wrap gap-2">
        <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>{t('All')}</Chip>
        <Chip selected={filter === 'waiting'} onClick={() => setFilter('waiting')}>{t('Waiting for visit')}</Chip>
        <Chip selected={filter === 'verified'} onClick={() => setFilter('verified')}>{t('Visited')}</Chip>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((s) => {
          const openings = openingsOfSme(state, s.id)
          return (
            <li key={s.id}>
              <Card className="flex h-full flex-col gap-3 p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <Avatar name={s.name} tone={s.tone} />
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="text-heading font-semibold leading-snug">{s.name}</p>
                    <p className="text-detail text-muted">{t(s.kind)} · {t(s.area)}</p>
                    <p className="text-detail text-muted">{t('Owner: {name}', { name: s.ownerName })}</p>
                  </div>
                  <Tag tone={s.verified ? 'leaf' : 'honey'}>{s.verified ? t('Visited {date}', { date: shortDate(s.visitedOn) }) : t('Submitted {date}', { date: shortDate(s.submittedOn) })}</Tag>
                </div>
                <p className="text-detail text-muted">{plural(openings.length, 'opening')} · {s.verified ? t('Shown to students') : t('Hidden from students until verified')}</p>
                <div className="mt-auto flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setViewing(s)} aria-label={t('View {name}', { name: s.name })}>{t('View')}</Button>
                  {!s.verified && <Button size="sm" onClick={() => setVerifying(s)} aria-label={t('Verify {name}', { name: s.name })}>{t('Verify')}</Button>}
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
      <VerifyDialog sme={verifying} onClose={() => setVerifying(null)} />
      <SmeDetailSheet sme={viewing} onClose={() => setViewing(null)} onVerify={(s) => { setViewing(null); setVerifying(s) }} />
    </div>
  )
}
