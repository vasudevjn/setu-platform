import { useParams } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { applicantsFor, findInternship, findStudent } from '../../lib/selectors'
import { BackButton } from '../../components/ui/PageHeader'
import { ApplicantCard } from '../../components/sme/ApplicantCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { LinkButton } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { plural, titleCase } from '../../lib/format'
import { certifiedCourses } from '../../lib/courses'
import { t } from '../../lib/i18n'

export default function Applicants() {
  const { id } = useParams()
  const { state, currentSme, setStatus } = useApp()
  const { show } = useToast()
  const internship = id ? findInternship(state, id) : undefined

  if (!internship || internship.smeId !== currentSme.id) {
    return (
      <div className="flex flex-col gap-4">
        <BackButton to="/sme/openings" />
        <EmptyState title={t("We couldn't find that opening")} body={t('Go back to see your openings.')} action={<LinkButton to="/sme/openings" full>{t('My openings')}</LinkButton>} />
      </div>
    )
  }

  // Setu Certified students are shown first. Otherwise, most recent application first.
  const apps = applicantsFor(state, internship.id).sort((a, b) => {
    const certA = certifiedCourses(findStudent(state, a.studentId)!).length > 0 ? 0 : 1
    const certB = certifiedCourses(findStudent(state, b.studentId)!).length > 0 ? 0 : 1
    return certA - certB
  })

  const accept = (appId: string, name: string) => {
    setStatus(appId, 'accepted')
    show({ message: t('{name} is accepted. We let them know.', { name }), action: { label: t('Undo'), onClick: () => setStatus(appId, 'waiting') } })
  }
  const decline = (appId: string, name: string) => {
    setStatus(appId, 'not_selected')
    show({ message: t('Done. Setu will let {name} know kindly.', { name }), action: { label: t('Undo'), onClick: () => setStatus(appId, 'waiting') } })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <div className="flex items-center gap-2">
          <BackButton to="/sme/openings" label={t('Back to openings')} />
          <p className="text-detail text-muted">{t(internship.title)}</p>
        </div>
        <h1 className="mt-1 text-title font-bold">{titleCase(t('{students} applied', { students: plural(apps.length, 'student') }))}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-detail text-muted">
          <ShieldCheck className="size-4 text-teal" aria-hidden="true" />
          {t('Each is a confirmed final-year student')}
        </p>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          title={t('No students yet')}
          body={t('When a student applies, you will see them here. Anjali from Setu can also suggest students for you.')}
          action={<LinkButton to="/sme/help" variant="secondary" full>{t('Talk to Anjali')}</LinkButton>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {apps.map((a) => {
            const student = findStudent(state, a.studentId)!
            return (
              <li key={a.id}>
                <ApplicantCard application={a} student={student} onAccept={() => accept(a.id, student.shortName)} onDecline={() => decline(a.id, student.shortName)} />
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-center text-detail text-muted">
        {t('Not sure? Anjali can help you decide.')}
        <br />
        {t("We let students know kindly, so you don't have to.")}
      </p>
    </div>
  )
}
