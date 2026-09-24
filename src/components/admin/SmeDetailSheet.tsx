import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Tag } from '../ui/Tag'
import type { SME } from '../../types'
import { useApp } from '../../hooks/useApp'
import { openingsOfSme } from '../../lib/selectors'
import { shortDate } from '../../lib/format'

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
            Verify business
          </Button>
        ) : undefined
      }
    >
      {sme && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Tag tone={sme.verified ? 'leaf' : 'honey'}>{sme.verified ? `Visited ${shortDate(sme.visitedOn)}` : 'Waiting for visit'}</Tag>
            <Tag tone="neutral">{sme.kind}</Tag>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body">
            <dt className="text-muted">Owner</dt><dd>{sme.ownerName}</dd>
            <dt className="text-muted">Phone</dt><dd>{sme.phone}</dd>
            <dt className="text-muted">Area</dt><dd>{sme.area}</dd>
            <dt className="text-muted">Team</dt><dd>{sme.staff}</dd>
            <dt className="text-muted">Since</dt><dd>{sme.sinceYear}</dd>
            <dt className="text-muted">Asked to join</dt><dd>{shortDate(sme.submittedOn)}</dd>
          </dl>
          <p className="text-muted">{sme.about}</p>
          <div>
            <p className="font-semibold">Openings ({openings.length})</p>
            <ul className="mt-1 list-disc pl-5 text-muted marker:text-teal">
              {openings.map((o) => (
                <li key={o.id}>{o.title}</li>
              ))}
              {openings.length === 0 && <li className="list-none">None yet</li>}
            </ul>
          </div>
        </div>
      )}
    </Sheet>
  )
}
