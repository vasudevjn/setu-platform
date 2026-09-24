import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { applicantsFor, openingsOfSme } from '../../lib/selectors'
import { PageTitle } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Button, LinkButton } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { HelperNote } from '../../components/ui/HelperNote'
import { useToast } from '../../components/ui/Toast'
import { money, plural, titleCase } from '../../lib/format'
import { t } from '../../lib/i18n'

export default function SmeOpenings() {
  const { state, currentSme, setInternshipStatus } = useApp()
  const { show } = useToast()
  const openings = openingsOfSme(state, currentSme.id)
  // Split around the count so the bold count can sit anywhere in the translated sentence.
  const [appliedPre, appliedPost] = t('{students} applied', { students: '\u0001' }).split('\u0001')

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title={t('Openings')}
        sub={openings.length ? t('{openings} from {name}', { openings: plural(openings.length, 'opening'), name: currentSme.name }) : undefined}
        action={
          openings.length > 0 ? (
            <LinkButton to="/sme/post" size="sm" icon={<Plus className="size-4" aria-hidden="true" />} className="max-sm:hidden">
              {t('Post an opening')}
            </LinkButton>
          ) : undefined
        }
      />

      {!currentSme.verified && (
        <HelperNote tone="apricot">{t('Students will see your openings after Setu visits you. Anjali will call to fix a time.')}</HelperNote>
      )}

      {openings.length === 0 ? (
        <EmptyState title={t('No openings yet')} body={t('Post an opening and students near you can apply.')} action={<LinkButton to="/sme/post" full>{t('Post an opening')}</LinkButton>} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {openings.map((i) => {
            const apps = applicantsFor(state, i.id)
            const waiting = apps.filter((a) => a.status === 'waiting').length
            const live = i.status === 'live'
            return (
              <li key={i.id}>
                <Card className="flex h-full flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-heading font-semibold leading-snug">{t(i.title)}</h2>
                    <Tag tone={!live ? 'stone' : currentSme.verified ? 'trust' : 'honey'}>{!live ? t('Closed') : currentSme.verified ? t('Live') : t('Waiting for visit')}</Tag>
                  </div>
                  <p className="mt-1 text-detail text-muted">
                    {money(i.stipend)} · {plural(i.weeks, 'week')} · {t(i.hours)}
                  </p>
                  <p className="mt-3 text-body">
                    {appliedPre}
                    <span className="font-semibold">{plural(apps.length, 'student')}</span>
                    {appliedPost}
                    {waiting > 0 && <span className="text-muted"> · {t('{n} new', { n: waiting })}</span>}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:mt-auto sm:pt-4">
                    <LinkButton to={`/sme/openings/${i.id}/applicants`} variant={apps.length ? 'primary' : 'secondary'} full>
                      {t('Look at applicants')}
                    </LinkButton>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInternshipStatus(i.id, live ? 'closed' : 'live')
                        show({ message: live ? t('Opening closed. Students can no longer see it.') : t('Opening is live again.') })
                      }}
                    >
                      {live ? t('Close this opening') : t('Open it again')}
                    </Button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 px-4 pointer-events-none sm:hidden">
        {openings.length > 0 && (
          <LinkButton to="/sme/post" size="lg" full icon={<Plus className="size-5" aria-hidden="true" />} className="pointer-events-auto shadow-lift">
            {t('Post an opening')}
          </LinkButton>
        )}
      </div>
      <Link to="/sme/help" className="text-center font-semibold text-teal underline-offset-4 hover:underline">
        {titleCase(t('Need help? Talk to Anjali'))}
      </Link>
    </div>
  )
}
