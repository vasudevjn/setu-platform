import { Link, useOutletContext } from 'react-router-dom'
import { Bell, Clock, Plus } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { greeting, plural, titleCase } from '../../lib/format'
import { applicantsFor, openingsOfSme, waitingCountForSme } from '../../lib/selectors'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Avatar, toneFor } from '../../components/ui/Avatar'
import { LinkButton } from '../../components/ui/Button'
import { SupportCard } from '../../components/sme/SupportCard'
import { HelperNote } from '../../components/ui/HelperNote'
import { DemoChip, useUnread } from '../../components/navigation/Shell'
import { findStudent } from '../../lib/selectors'
import { t } from '../../lib/i18n'
import { LanguageButton } from '../../components/navigation/LanguageButton'

export default function SmeHome() {
  const { state, currentSme } = useApp()
  const { openSwitcher } = useOutletContext<{ openSwitcher: () => void }>()
  const unread = useUnread('sme')
  const openings = openingsOfSme(state, currentSme.id).filter((i) => i.status === 'live')
  const waiting = waitingCountForSme(state, currentSme.id)
  // Split around the count so the bold count can sit anywhere in the translated sentence.
  const [appliedPre, appliedPost] = t('{students} applied', { students: '\u0001' }).split('\u0001')

  return (
    <div className="-mx-4 flex flex-col gap-4 lg:mx-0">
      {/* Teal hero, as in the mockup */}
      <header className="rounded-b-[28px] bg-teal px-4 pb-8 pt-3 text-white lg:rounded-card lg:px-8 lg:pb-9 lg:pt-6">
        <div className="flex items-center justify-between">
          <p className="text-body font-medium text-white/90">{currentSme.name}</p>
          <div className="flex items-center gap-1 lg:hidden">
            <LanguageButton onDark />
            <DemoChip onDark onClick={openSwitcher} />
            <Link to="/sme/notifications" aria-label={unread ? t('Notifications, {n} new', { n: unread }) : t('Notifications')} className="relative grid size-12 place-items-center rounded-full hover:bg-white/10">
              <Bell className="size-6" aria-hidden="true" />
              {unread > 0 && <span aria-hidden="true" className="absolute right-3 top-3 size-2.5 rounded-full bg-apricot ring-2 ring-teal" />}
            </Link>
          </div>
        </div>
        <h1 className="mt-4 text-title font-bold leading-tight lg:text-[2rem]">
          {t('{greeting}, {name}', { greeting: titleCase(greeting()), name: currentSme.ownerFirstName })}
        </h1>
        <p className="mt-1 text-body text-white/90">
          {!currentSme.verified
            ? t('Setu will visit you before your openings go live.')
            : waiting > 0
              ? t('You have {applicants} to look at.', { applicants: plural(waiting, 'new applicant') })
              : openings.length > 0
                ? t('No new students yet. We will tell you when someone applies.')
                : t('Post your first opening. It takes about 10 minutes.')}
        </p>
      </header>

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        {!currentSme.verified && (
          <HelperNote tone="apricot" icon={<Clock className="size-6" />}>
            {t('Anjali from Setu will call you to fix a time to visit. You can post an opening now. Students see it once we have visited.')}
          </HelperNote>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {openings.length === 0 ? (
              <Card className="flex flex-col gap-3 p-5">
                <h2 className="text-heading font-semibold">{titleCase(t('You have no openings yet'))}</h2>
                <p className="text-muted">{t('Tell us what you need help with. One question at a time.')}</p>
                <LinkButton to="/sme/post" size="lg" full>
                  {t('Post an opening')}
                </LinkButton>
              </Card>
            ) : (
              openings.slice(0, 3).map((i, idx) => {
                const apps = applicantsFor(state, i.id)
                const shown = apps.slice(0, 3)
                return (
                  <Card key={i.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-detail text-muted">{t('Your opening')}</p>
                        <h2 className="text-heading font-semibold leading-snug">{t(i.title)}</h2>
                      </div>
                      <Tag tone={currentSme.verified ? 'trust' : 'honey'}>{currentSme.verified ? t('Live') : t('Waiting for visit')}</Tag>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      {shown.length > 0 && (
                        <div className="flex -space-x-2">
                          {shown.map((a) => {
                            const st = findStudent(state, a.studentId)!
                            return <Avatar key={a.id} name={st.shortName} size="sm" tone={toneFor(st.id)} className="ring-2 ring-white" />
                          })}
                        </div>
                      )}
                      <p className="text-body">
                        {appliedPre}
                        <span className="font-semibold">{plural(apps.length, 'student')}</span>
                        {appliedPost}
                      </p>
                    </div>
                    <LinkButton to={`/sme/openings/${i.id}/applicants`} variant={idx === 0 ? 'primary' : 'secondary'} size="lg" full className="mt-4">
                      {t('Look at applicants')}
                    </LinkButton>
                  </Card>
                )
              })
            )}
          </div>

          <div className="flex flex-col gap-4">
            <SupportCard businessName={currentSme.name} compact />
            {openings.length > 0 && (
              <LinkButton to="/sme/post" variant="secondary" size="lg" full icon={<Plus className="size-5" aria-hidden="true" />}>
                {t('Post another opening')}
              </LinkButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
