import { useState } from 'react'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { CheckField, TextField } from '../ui/Field'
import { useApp } from '../../hooks/useApp'
import { useToast } from '../ui/Toast'
import type { SME } from '../../types'
import { t } from '../../lib/i18n'

/** Bold business name inside a translated sentence: the name is swapped in at the marker. */
const MARK = '\uE000'
function visitLabel(sme: SME) {
  const parts = t('I visited {business} in person and met {owner}.', { business: MARK, owner: sme.ownerName }).split(MARK)
  if (parts.length !== 2) return parts.join(sme.name)
  return (
    <>
      {parts[0]}
      <strong>{sme.name}</strong>
      {parts[1]}
    </>
  )
}

/** Verification means a real visit. The box is never pre-ticked. */
export function VerifyDialog({ sme, onClose }: { sme: SME | null; onClose: () => void }) {
  const { verifySme } = useApp()
  const { show } = useToast()
  const today = new Date().toISOString().slice(0, 10)
  const [visited, setVisited] = useState(false)
  const [date, setDate] = useState(today)
  const [tried, setTried] = useState(false)

  const close = () => {
    setVisited(false)
    setTried(false)
    setDate(today)
    onClose()
  }

  return (
    <Sheet
      open={!!sme}
      onClose={close}
      title={sme ? t('Verify {name}', { name: sme.name }) : t('Verify')}
      footer={
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            full
            onClick={() => {
              if (!sme) return
              if (!visited) return setTried(true)
              verifySme(sme.id, new Date(date).toISOString())
              show({ message: t('{name} is verified. Their openings are now visible to students.', { name: sme.name }) })
              close()
            }}
          >
            {t('Verify business')}
          </Button>
          <Button full variant="ghost" onClick={close}>
            {t('Cancel')}
          </Button>
        </div>
      }
    >
      {sme && (
        <div className="flex flex-col gap-4">
          <p className="text-muted">
            {t('Students will see "Visited by Setu" with the date and owner name, {owner}. Only verify after you have met them in person.', { owner: sme.ownerName })}
          </p>
          <TextField label={t('Date of visit')} type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
          <CheckField
            label={visitLabel(sme)}
            checked={visited}
            onChange={setVisited}
            error={tried && !visited ? t('Please confirm the visit to verify this business.') : undefined}
          />
        </div>
      )}
    </Sheet>
  )
}
