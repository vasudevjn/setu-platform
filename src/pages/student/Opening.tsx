import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, ShieldCheck } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { applicationFor, findInternship, findSme, isVisibleToStudents } from '../../lib/selectors'
import { BackButton } from '../../components/ui/PageHeader'
import { Avatar } from '../../components/ui/Avatar'
import { FactGrid } from '../../components/internship/FactGrid'
import { Button, LinkButton } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Card, SectionLabel } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'
import { shortDate } from '../../lib/format'
import { cn } from '../../lib/cn'

export default function Opening() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, currentStudent, apply, toggleSave } = useApp()
  const { show } = useToast()
  const [sending, setSending] = useState(false)

  const internship = id ? findInternship(state, id) : undefined
  const sme = internship ? findSme(state, internship.smeId) : undefined

  if (!internship || !sme || !isVisibleToStudents(state, internship)) {
    return (
      <div className="pt-2">
        <BackButton to="/student" />
        <EmptyState
          title="This opening isn't available"
          body="It may have closed, or the business is still waiting for a Setu visit. Here are the openings you can apply to."
          action={<LinkButton to="/student" full>See openings near me</LinkButton>}
        />
      </div>
    )
  }

  const application = applicationFor(state, internship.id, currentStudent.id)
  const applied = application && application.status !== 'withdrawn'
  const saved = state.saved.includes(internship.id)

  const onApply = () => {
    setSending(true)
    // A short, honest pause so the tap feels received on slow phones
    window.setTimeout(() => {
      const res = apply(internship.id, currentStudent.id)
      if (res.duplicate) {
        show({ message: 'You already applied to this opening.' })
        setSending(false)
        navigate(`/student/applications/${res.id}`)
        return
      }
      navigate(`/student/applied/${res.id}`)
    }, 450)
  }

  return (
    <div className="-mx-4 lg:mx-0">
      {/* Hero */}
      <div className="bg-linear-to-b from-apricot/[0.17] to-apricot/[0.27] px-4 pb-5 pt-3 lg:rounded-card lg:px-8 lg:pt-6">
        <div className="flex items-center justify-between">
          <BackButton to="/student" label="Back to openings" />
          <button
            type="button"
            onClick={() => toggleSave(internship.id)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save this opening'}
            className={cn('grid size-12 place-items-center rounded-full hover:bg-white/60', saved ? 'text-heart' : 'text-heart/80')}
          >
            <Heart className={cn('size-6', saved && 'fill-current')} aria-hidden="true" />
          </button>
        </div>
        <Avatar name={sme.name} tone="white" size="lg" className="mt-2 shadow-card" />
        <h1 className="mt-4 text-title font-bold lg:text-[1.75rem]">{internship.title}</h1>
        <p className="text-body text-muted">
          {sme.name} · {sme.kind}
        </p>
      </div>

      <div className="grid gap-6 px-4 pb-36 pt-2 lg:pb-4 lg:grid-cols-[1fr_320px] lg:px-0 lg:pt-6">
        <div className="flex flex-col gap-6">
          <FactGrid internship={internship} sme={sme} />

          <section>
            <h2 className="text-body font-bold">What You'll Do</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-button text-ink/90 marker:text-muted">
              {internship.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          {/* Trust / verification */}
          <section aria-label="Verification" className="flex gap-3 rounded-card border border-line bg-white p-4">
            <ShieldCheck className="mt-0.5 size-6 shrink-0 text-teal" aria-hidden="true" />
            <div>
              <p className="text-button font-semibold">Visited by Setu on {shortDate(sme.visitedOn)}.</p>
              <p className="text-detail text-muted">
                Owner: {sme.ownerName}, running since {sme.sinceYear}.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-body font-bold">Who We're Looking For</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-button text-ink/90 marker:text-muted">
              {internship.requirements.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-body font-bold">About the Business</h2>
            <p className="mt-2 text-body text-muted">{sme.about}</p>
            <p className="mt-2 text-detail text-muted">
              {sme.staff} · {sme.area} · Since {sme.sinceYear}
            </p>
            <p className="mt-1 text-detail text-muted">{internship.where} · {internship.hours}</p>
          </section>

          <section aria-label="What the business will see">
            <SectionLabel>What {sme.ownerFirstName} will see</SectionLabel>
            <Card className="mt-2 flex items-center gap-3 p-4">
              <Avatar name={currentStudent.shortName} tone="apricot" />
              <div className="min-w-0">
                <p className="font-semibold">{currentStudent.shortName}</p>
                <p className="text-detail text-muted">
                  {currentStudent.course} · {currentStudent.year} · {currentStudent.skills.join(', ')}
                </p>
              </div>
            </Card>
            <p className="mt-2 text-detail text-muted">Your phone number stays hidden until {sme.ownerFirstName} accepts you.</p>
          </section>
        </div>

        {/* Sticky CTA on phones, side card on desktop */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/60 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-nav lg:sticky lg:top-8 lg:z-auto lg:h-fit lg:rounded-card lg:border-0 lg:p-5 lg:shadow-card">
          <div className="mx-auto max-w-xl">
            {applied ? (
              <>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="font-semibold">You applied</p>
                  <StatusBadge status={application!.status} />
                </div>
                <LinkButton to={`/student/applications/${application!.id}`} size="lg" full>
                  See my application
                </LinkButton>
              </>
            ) : (
              <>
                <Button size="lg" full loading={sending} onClick={onApply}>
                  {sending ? 'Sending…' : 'Apply with my profile'}
                </Button>
                <p className="mt-2 text-center text-detail text-muted">Free. You can withdraw any time.</p>
              </>
            )}
            <p className="mt-2 hidden text-center text-detail text-muted lg:block">
              Not sure? <Link to="/student" className="font-semibold text-teal underline underline-offset-4">Look at other openings</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
