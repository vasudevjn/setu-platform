import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../hooks/useApp'
import { StepFlow } from '../../components/ui/StepFlow'
import { TextField } from '../../components/ui/Field'
import { Chip } from '../../components/ui/Chip'
import { HelperNote } from '../../components/ui/HelperNote'
import { BUSINESS_KINDS, STAFF_SIZES } from '../../lib/options'
import { useToast } from '../../components/ui/Toast'
import { t } from '../../lib/i18n'

export default function SmeOnboarding() {
  const { currentSme, updateSme, setOnboarded } = useApp()
  const navigate = useNavigate()
  const { show } = useToast()
  const [step, setStep] = useState(1)
  const [name, setName] = useState(currentSme.name)
  const [kind, setKind] = useState(BUSINESS_KINDS.includes(currentSme.kind) ? currentSme.kind : '')
  const [owner, setOwner] = useState(currentSme.ownerName)
  const [phone, setPhone] = useState(currentSme.phone)
  const [area, setArea] = useState(currentSme.area)
  const [staff, setStaff] = useState(STAFF_SIZES.includes(currentSme.staff) ? currentSme.staff : '')

  const total = 3
  const phoneOk = phone.replace(/\D/g, '').length >= 10
  const back = () => (step === 1 ? navigate('/') : setStep(step - 1))

  const finish = () => {
    updateSme(currentSme.id, {
      name: name.trim(),
      kind: kind || currentSme.kind,
      ownerName: owner.trim(),
      ownerFirstName: owner.trim().split(' ')[0],
      phone,
      area: area.trim(),
      staff: staff || currentSme.staff,
    })
    setOnboarded('sme', true)
    show({ message: t('Thank you. Your profile is ready.') })
    navigate('/sme', { replace: true })
  }

  if (step === 1)
    return (
      <StepFlow step={1} total={total} title={t('What is your business called?')} onBack={back} onNext={() => setStep(2)} nextDisabled={!name.trim()}>
        <TextField label={t('Business name')} value={name} onChange={(e) => setName(e.target.value)} autoComplete="organization" />
        <div>
          <p className="mb-2 text-button font-semibold">{t('What kind of business?')}</p>
          <div role="group" aria-label={t('Kind of business')} className="flex flex-wrap gap-2.5">
            {BUSINESS_KINDS.map((k) => (
              <Chip key={k} big selected={kind === k} onClick={() => setKind(k)}>{t(k)}</Chip>
            ))}
          </div>
        </div>
      </StepFlow>
    )

  if (step === 2)
    return (
      <StepFlow step={2} total={total} title={t('Who should students ask for?')} onBack={back} onNext={() => setStep(3)} nextDisabled={!owner.trim() || !phoneOk}>
        <TextField label={t("Owner's name")} value={owner} onChange={(e) => setOwner(e.target.value)} autoComplete="name" />
        <TextField
          label={t('Mobile number')}
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          hint={t('Setu uses it to fix a visit time. Students see it only after you accept them.')}
          error={!phoneOk && phone ? t('Please enter a 10 digit mobile number.') : undefined}
        />
      </StepFlow>
    )

  return (
    <StepFlow step={3} total={total} title={t('Where is your business?')} sub={t('Students near you will see it.')} onBack={back} onNext={finish} nextLabel={t('Finish')} nextDisabled={!area.trim()}>
      <TextField label={t('Area and town')} value={area} onChange={(e) => setArea(e.target.value)} placeholder={t('Panchavati, Nashik')} />
      <div>
        <p className="mb-2 text-button font-semibold">{t('How many people work with you?')}</p>
        <div role="group" aria-label={t('Team size')} className="flex flex-wrap gap-2.5">
          {STAFF_SIZES.map((k) => (
            <Chip key={k} selected={staff === k} onClick={() => setStaff(k)}>{t(k)}</Chip>
          ))}
        </div>
      </div>
      <HelperNote>{t('Before your openings go live, someone from Setu will visit you in person. It takes about 20 minutes.')}</HelperNote>
    </StepFlow>
  )
}
