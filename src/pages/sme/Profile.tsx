import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, LogOut, ShieldCheck } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { PageTitle, BackButton } from '../../components/ui/PageHeader'
import { Card, SectionLabel } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { TextField } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { HelperNote } from '../../components/ui/HelperNote'
import { SupportCard } from '../../components/sme/SupportCard'
import { useToast } from '../../components/ui/Toast'
import { shortDate } from '../../lib/format'

export default function SmeProfile() {
  const { currentSme, updateSme, setOnboarded } = useApp()
  const { show } = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState(currentSme.name)
  const [owner, setOwner] = useState(currentSme.ownerName)
  const [phone, setPhone] = useState(currentSme.phone)
  const [area, setArea] = useState(currentSme.area)
  const dirty = name !== currentSme.name || owner !== currentSme.ownerName || phone !== currentSme.phone || area !== currentSme.area
  const phoneOk = phone.replace(/\D/g, '').length >= 10

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex items-center gap-1">
        <BackButton to="/sme/help" label="Back to help" />
      </div>
      <PageTitle title="Business profile" />

      <Card className="flex items-center gap-4 p-5">
        <Avatar name={currentSme.name} tone={currentSme.tone} size="lg" />
        <div className="min-w-0">
          <p className="text-heading font-semibold leading-snug">{currentSme.name}</p>
          <p className="text-muted">{currentSme.kind} · {currentSme.area}</p>
        </div>
      </Card>

      {currentSme.verified ? (
        <HelperNote icon={<ShieldCheck className="size-6" />}>
          <p className="font-semibold">Visited by Setu on {shortDate(currentSme.visitedOn)}</p>
          <p>Students can see your openings and that we met you in person.</p>
        </HelperNote>
      ) : (
        <HelperNote tone="apricot" icon={<Clock className="size-6" />}>
          <p className="font-semibold">Waiting for a Setu visit</p>
          <p>Anjali will call you to fix a time. Your openings go live for students after the visit.</p>
        </HelperNote>
      )}

      <Card className="flex flex-col gap-5 p-5">
        <SectionLabel>Your details</SectionLabel>
        <TextField label="Business name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Owner's name" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <TextField label="Mobile number" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={!phoneOk ? 'Please enter a 10 digit mobile number.' : undefined} />
        <TextField label="Area and town" value={area} onChange={(e) => setArea(e.target.value)} />
        <Button
          size="lg"
          full
          disabled={!dirty || !phoneOk || !name.trim() || !owner.trim() || !area.trim()}
          onClick={() => {
            updateSme(currentSme.id, { name: name.trim(), ownerName: owner.trim(), ownerFirstName: owner.trim().split(' ')[0], phone, area: area.trim() })
            show({ message: 'Profile saved.' })
          }}
        >
          Save changes
        </Button>
      </Card>

      <SupportCard businessName={currentSme.name} />

      <Card className="flex flex-col gap-2 p-5">
        <SectionLabel>Demo tools</SectionLabel>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => { setOnboarded('sme', false); navigate('/sme/onboarding') }}>
            Show first-time setup
          </Button>
          <Button variant="ghost" icon={<LogOut className="size-4" aria-hidden="true" />} onClick={() => navigate('/')}>
            Leave demo
          </Button>
        </div>
      </Card>
    </div>
  )
}
