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

export default function Applicants() {
  const { id } = useParams()
  const { state, currentSme, setStatus } = useApp()
  const { show } = useToast()
  const internship = id ? findInternship(state, id) : undefined

  if (!internship || internship.smeId !== currentSme.id) {
    return (
      <div className="flex flex-col gap-4">
        <BackButton to="/sme/openings" />
        <EmptyState title="We couldn't find that opening" body="Go back to see your openings." action={<LinkButton to="/sme/openings" full>My openings</LinkButton>} />
      </div>
    )
  }

  const apps = applicantsFor(state, internship.id)

  const accept = (appId: string, name: string) => {
    setStatus(appId, 'accepted')
    show({ message: `${name} is accepted. We let them know.`, action: { label: 'Undo', onClick: () => setStatus(appId, 'waiting') } })
  }
  const decline = (appId: string, name: string) => {
    setStatus(appId, 'not_selected')
    show({ message: `Done. Setu will let ${name} know kindly.`, action: { label: 'Undo', onClick: () => setStatus(appId, 'waiting') } })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <div className="flex items-center gap-2">
          <BackButton to="/sme/openings" label="Back to openings" />
          <p className="text-detail text-muted">{internship.title}</p>
        </div>
        <h1 className="mt-1 text-title font-bold">{titleCase(`${plural(apps.length, 'student')} applied`)}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-detail text-muted">
          <ShieldCheck className="size-4 text-teal" aria-hidden="true" />
          Each is a confirmed final-year student
        </p>
      </div>

      {apps.length === 0 ? (
        <EmptyState title="No students yet" body="When a student applies, you will see them here. Anjali from Setu can also suggest students for you." action={<LinkButton to="/sme/help" variant="secondary" full>Talk to Anjali</LinkButton>} />
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
        Not sure? Anjali can help you decide.
        <br />
        We let students know kindly, so you don't have to.
      </p>
    </div>
  )
}
