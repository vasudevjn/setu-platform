import { useState } from 'react'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { CheckField, TextField } from '../ui/Field'
import { useApp } from '../../hooks/useApp'
import { useToast } from '../ui/Toast'
import type { SME } from '../../types'

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
      title={sme ? `Verify ${sme.name}` : 'Verify'}
      footer={
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            full
            onClick={() => {
              if (!sme) return
              if (!visited) return setTried(true)
              verifySme(sme.id, new Date(date).toISOString())
              show({ message: `${sme.name} is verified. Their openings are now visible to students.` })
              close()
            }}
          >
            Verify business
          </Button>
          <Button full variant="ghost" onClick={close}>
            Cancel
          </Button>
        </div>
      }
    >
      {sme && (
        <div className="flex flex-col gap-4">
          <p className="text-muted">
            Students will see "Visited by Setu" with the date and owner name, {sme.ownerName}. Only verify after you have met them in person.
          </p>
          <TextField label="Date of visit" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
          <CheckField
            label={<>I visited <strong>{sme.name}</strong> in person and met {sme.ownerName}.</>}
            checked={visited}
            onChange={setVisited}
            error={tried && !visited ? 'Please confirm the visit to verify this business.' : undefined}
          />
        </div>
      )}
    </Sheet>
  )
}
