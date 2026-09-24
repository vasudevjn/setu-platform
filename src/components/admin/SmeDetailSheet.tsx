import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Tag } from '../ui/Tag'
import type { SME } from '../../types'
import { useApp } from '../../hooks/useApp'
import { openingsOfSme } from '../../lib/selectors'
import { shortDate } from '../../lib/format'
import { t } from '../../lib/i18n'

export function SmeDetailSheet({ sme, onClose, onVerify }: { sme: SME | null; onClose: () => void; onVerify: (s: SME) => void }) {
  const { state } = useApp()
  const openings = sme ? openingsOfSme(state, sme.id) : []
  return (
    <Sheet
      open={!!sme}
      onClose={onClose}
      title={sme?.name ?? ''}
      footer={
        sme && !sme.verified ? (
          <Button size="lg" full onClick={() => onVerify(sme)}>
            {t('Verify business')}
          </Button>
        ) : undefined
      }
    >
      {sme && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Tag tone={sme.verified ? 'leaf' : 'honey'}>{sme.verified ? t('Visited {date}', { date: shortDate(sme.visitedOn) }) : t('Waiting for visit')}</Tag>
            <Tag tone="neutral">{t(sme.kind)}</Tag>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body">
            <dt className="text-muted">{t('Owner')}</dt><dd>{sme.ownerName}</dd>
            <dt className="text-muted">{t('Phone')}</dt><dd>{sme.phone}</dd>
            <dt className="text-muted">{t('Area')}</dt><dd>{t(sme.area)}</dd>
            <dt className="text-muted">{t('Team')}</dt><dd>{t(sme.staff)}</dd>
            <dt className="text-muted">{t('Since')}</dt><dd>{sme.sinceYear}</dd>
            <dt className="text-muted">{t('Asked to join')}</dt><dd>{shortDate(sme.submittedOn)}</dd>
          </dl>
          <p className="text-muted">{t(sme.about)}</p>
          <div>
            <p className="font-semibold">{t('Openings ({count})', { count: openings.length })}</p>
            <ul className="mt-1 list-disc pl-5 text-muted marker:text-teal">
              {openings.map((o) => (
                <li key={o.id}>{t(o.title)}</li>
              ))}
              {openings.length === 0 && <li className="list-none">{t('None yet')}</li>}
            </ul>
          </div>
        </div>
      )}
    </Sheet>
  )
}
