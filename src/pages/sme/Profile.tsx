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
import { t } from '../../lib/i18n'
import { LanguageButton } from '../../components/navigation/LanguageButton'

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
        <BackButton to="/sme/help" label={t('Back to help')} />
      </div>
      <PageTitle title={t('Business profile')} />

      <Card className="flex items-center gap-4 p-5">
        <Avatar name={currentSme.name} tone={currentSme.tone} size="lg" />
        <div className="min-w-0">
          <p className="text-heading font-semibold leading-snug">{currentSme.name}</p>
          <p className="text-muted">{t(currentSme.kind)} · {t(currentSme.area)}</p>
        </div>
      </Card>

      {currentSme.verified ? (
        <HelperNote icon={<ShieldCheck className="size-6" />}>
          <p className="font-semibold">{t('Visited by Setu on {date}', { date: shortDate(currentSme.visitedOn) })}</p>
          <p>{t('Students can see your openings and that we met you in person.')}</p>
        </HelperNote>
      ) : (
        <HelperNote tone="apricot" icon={<Clock className="size-6" />}>
          <p className="font-semibold">{t('Waiting for a Setu visit')}</p>
          <p>{t('Anjali will call you to fix a time. Your openings go live for students after the visit.')}</p>
        </HelperNote>
      )}

      <Card className="flex flex-col gap-5 p-5">
        <SectionLabel>{t('Your details')}</SectionLabel>
        <TextField label={t('Business name')} value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label={t("Owner's name")} value={owner} onChange={(e) => setOwner(e.target.value)} />
        <TextField label={t('Mobile number')} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={!phoneOk ? t('Please enter a 10 digit mobile number.') : undefined} />
        <TextField label={t('Area and town')} value={area} onChange={(e) => setArea(e.target.value)} />
        <Button
          size="lg"
          full
          disabled={!dirty || !phoneOk || !name.trim() || !owner.trim() || !area.trim()}
          onClick={() => {
            updateSme(currentSme.id, { name: name.trim(), ownerName: owner.trim(), ownerFirstName: owner.trim().split(' ')[0], phone, area: area.trim() })
            show({ message: t('Profile saved.') })
          }}
        >
          {t('Save changes')}
        </Button>
      </Card>

      <SupportCard businessName={currentSme.name} />

      <Card className="flex flex-col items-start gap-2 p-5">
        <SectionLabel>{t('Language')}</SectionLabel>
        <p className="text-muted">{t('Use Setu in English, Hindi or Marathi.')}</p>
        <LanguageButton showName />
      </Card>

      <Card className="flex flex-col gap-2 p-5">
        <SectionLabel>{t('Demo tools')}</SectionLabel>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => { setOnboarded('sme', false); navigate('/sme/onboarding') }}>
            {t('Show first-time setup')}
          </Button>
          <Button variant="ghost" icon={<LogOut className="size-4" aria-hidden="true" />} onClick={() => navigate('/')}>
            {t('Leave demo')}
          </Button>
        </div>
      </Card>
    </div>
  )
}
