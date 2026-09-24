import { Link, useParams } from 'react-router-dom'
import { useApp } from '../../hooks/useApp'
import { findInternship, findSme } from '../../lib/selectors'
import { CheckBurst } from '../../components/brand/Spot'
import { Card } from '../../components/ui/Card'
import { ApplicationTimeline } from '../../components/student/ApplicationTimeline'
import { LinkButton } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { t } from '../../lib/i18n'

export default function Applied() {
  const { id } = useParams()
  const { state, currentStudent } = useApp()
  const application = state.applications.find((a) => a.id === id)
  const internship = application && findInternship(state, application.internshipId)
  const sme = internship && findSme(state, internship.smeId)

  if (!application || !internship || !sme) {
    return <EmptyState title={t("We couldn't find that application")} body={t('Go to your applications to see everything you have sent.')} action={<LinkButton to="/student/applications" full>{t('My applications')}</LinkButton>} />
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center pt-8 text-center">
      <CheckBurst size={136} />
      <h1 className="mt-6 text-title font-bold lg:text-[2rem]">{t('Application Sent!')}</h1>
      <p className="mt-3 max-w-sm text-body text-muted">
        {t("Nice work, {name}. {owner} usually replies within 3 days. We'll send you an SMS as soon as you have a reply.", { name: currentStudent.firstName, owner: sme.ownerFirstName })}
      </p>

      <Card className="mt-8 w-full p-5 text-left">
        <h2 className="text-body font-semibold">{t('What Happens Next')}</h2>
        <div className="mt-4">
          <ApplicationTimeline application={application} internship={internship} sme={sme} />
        </div>
      </Card>

      <div className="mt-8 flex w-full flex-col gap-3">
        <LinkButton to="/student" variant="secondary" size="lg" full>
          {t('See more openings near me')}
        </LinkButton>
        <Link to="/student/applications" className="min-h-11 py-2 font-semibold text-teal underline-offset-4 hover:underline">
          {t('Go to My Applications')}
        </Link>
      </div>
    </div>
  )
}
