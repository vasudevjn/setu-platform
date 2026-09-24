import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Phone, ShieldCheck } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { findInternship, findSme, otherOpeningsFor } from '../../lib/selectors'
import { BackButton } from '../../components/ui/PageHeader'
import { Card, SectionLabel } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { ApplicationTimeline } from '../../components/student/ApplicationTimeline'
import { Avatar } from '../../components/ui/Avatar'
import { Button, ExternalButton, LinkButton } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { InternshipCard } from '../../components/internship/InternshipCard'
import { Sheet } from '../../components/ui/Sheet'
import { HelperNote } from '../../components/ui/HelperNote'
import { useToast } from '../../components/ui/Toast'
import { money, plural, startsIn, titleCase } from '../../lib/format'
import { t } from '../../lib/i18n'

export default function ApplicationStatusPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, currentStudent, setStatus, toggleSave } = useApp()
  const { show } = useToast()
  const [confirm, setConfirm] = useState(false)

  const application = state.applications.find((a) => a.id === id && a.studentId === currentStudent.id)
  const internship = application && findInternship(state, application.internshipId)
  const sme = internship && findSme(state, internship.smeId)

  if (!application || !internship || !sme) {
    return (
      <div className="flex flex-col gap-4">
        <BackButton to="/student/applications" label={t('Back to my applications')} />
        <EmptyState title={t("We couldn't find that application")} body={t('Go back to see everything you have sent.')} action={<LinkButton to="/student/applications" full>{t('My applications')}</LinkButton>} />
      </div>
    )
  }

  const others = otherOpeningsFor(state, currentStudent.id, internship.id)
  const s = application.status

  const headline =
    s === 'accepted' ? t('{owner} accepted you!', { owner: sme.ownerFirstName })
    : s === 'not_selected' ? t('Not this time.')
    : s === 'completed' ? t('Internship completed')
    : s === 'withdrawn' ? t('You withdrew this application')
    : t('Waiting to hear')
  const subline =
    s === 'accepted' ? t('{when}. Well done, {name}.', { when: startsIn(application.startsOn), name: currentStudent.firstName })
    : s === 'not_selected' ? others.length > 0 ? t('Here are {count} near you.', { count: plural(others.length, 'other opening') }) : t('More openings are on the way. We will tell you.')
    : s === 'completed' ? t('Setu will send your college a completion letter.')
    : s === 'withdrawn' ? t('You can apply again any time.')
    : t("{owner} usually replies within 3 days. We'll send you an SMS.", { owner: sme.ownerFirstName })

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <BackButton to="/student/applications" label={t('Back to my applications')} />

      <header className="rounded-card bg-white p-5 shadow-card">
        <div className="flex items-center gap-3">
          <Avatar name={sme.name} tone={sme.tone} />
          <div className="min-w-0">
            <p className="font-semibold leading-snug">{t(internship.title)}</p>
            <p className="text-detail text-muted">{sme.name} · {money(internship.stipend)}</p>
          </div>
        </div>
        <div className="mt-4">
          <StatusBadge status={s} />
          <h1 className="mt-2 text-title font-bold">{titleCase(headline)}</h1>
          <p className="mt-1 text-body text-muted">{subline}</p>
        </div>
      </header>

      {s === 'accepted' && (
        <Card className="flex flex-col gap-3 p-5">
          <SectionLabel>{t('Your first day')}</SectionLabel>
          <p>
            {t('{where}, {hours}. Ask for {owner}.', { where: t(internship.where), hours: t(internship.hours), owner: sme.ownerFirstName })}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ExternalButton href={`tel:${sme.phone.replace(/\s/g, '')}`} variant="soft" icon={<Phone className="size-5" aria-hidden="true" />}>
              {t('Call {owner}', { owner: sme.ownerFirstName })}
            </ExternalButton>
          </div>
          <p className="text-detail text-muted">{t('{owner} can now see your phone number too.', { owner: sme.ownerFirstName })}</p>
        </Card>
      )}

      <Card className="p-5">
        <SectionLabel>{s === 'waiting' ? t('What happens next') : t('Where you are')}</SectionLabel>
        <div className="mt-4">
          <ApplicationTimeline application={application} internship={internship} sme={sme} />
        </div>
      </Card>

      {s === 'not_selected' && (
        <section className="flex flex-col gap-3" aria-label={t('Other openings')}>
          <HelperNote tone="apricot">
            {t('Every business can only take a few interns. It says nothing bad about you. Keep going.')}
          </HelperNote>
          {others.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {others.slice(0, 4).map((i) => (
                <InternshipCard key={i.id} internship={i} sme={findSme(state, i.smeId)!} saved={state.saved.includes(i.id)} onToggleSave={() => toggleSave(i.id)} />
              ))}
            </div>
          )}
          <LinkButton to="/student" variant={others.length ? 'secondary' : 'primary'} size="lg" full>
            {t('See more openings near me')}
          </LinkButton>
        </section>
      )}

      {s !== 'not_selected' && (
        <p className="flex items-start gap-2 text-detail text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
          {t('Your phone number is hidden from businesses until they accept you.')}
        </p>
      )}

      {s === 'waiting' && (
        <div className="flex flex-col gap-3">
          <LinkButton to="/student" size="lg" full>
            {t('See more openings near me')}
          </LinkButton>
          <Button variant="ghost" onClick={() => setConfirm(true)}>
            {t('Withdraw my application')}
          </Button>
        </div>
      )}
      {s === 'withdrawn' && (
        <LinkButton to={`/student/openings/${internship.id}`} size="lg" full>
          {t('View opening')}
        </LinkButton>
      )}
      {(s === 'accepted' || s === 'completed') && (
        <Link to="/student/applications" className="min-h-11 py-2 text-center font-semibold text-teal underline-offset-4 hover:underline">
          {t('Back to My Applications')}
        </Link>
      )}

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title={t('Withdraw this application?')}
        footer={
          <div className="flex flex-col gap-2">
            <Button
              full
              size="lg"
              onClick={() => {
                setStatus(application.id, 'withdrawn', { silent: true })
                setConfirm(false)
                show({ message: t('Application withdrawn.') })
                navigate('/student/applications')
              }}
            >
              {t('Yes, withdraw')}
            </Button>
            <Button full variant="secondary" data-autofocus onClick={() => setConfirm(false)}>
              {t('Keep my application')}
            </Button>
          </div>
        }
      >
        <p className="text-body text-muted">{t('{owner} will no longer see your profile. You can apply again later.', { owner: sme.ownerFirstName })}</p>
      </Sheet>
    </div>
  )
}
