import { Link } from 'react-router-dom'
import { Heart, MapPin, ShieldCheck } from 'lucide-react'
import type { Application, Internship, SME } from '../../types'
import { Avatar } from '../ui/Avatar'
import { Tag } from '../ui/Tag'
import { StatusBadge } from '../ui/StatusBadge'
import { cn } from '../../lib/cn'
import { money, plural } from '../../lib/format'
import { t } from '../../lib/i18n'

interface Props {
  internship: Internship
  sme: SME
  saved?: boolean
  onToggleSave?: () => void
  application?: Application
  className?: string
}

/**
 * Answers the student's first questions on the card: is it real, pay, time, distance, credit.
 * The whole card is one tap target (the title link stretches over it). The heart sits above it.
 */
export function InternshipCard({ internship, sme, saved, onToggleSave, application, className }: Props) {
  const applied = application && application.status !== 'withdrawn'
  const to = applied ? `/student/applications/${application!.id}` : `/student/openings/${internship.id}`
  return (
    <article
      className={cn(
        'relative flex flex-col rounded-card bg-white p-4 shadow-card transition-shadow duration-200 focus-within:shadow-lift hover:shadow-lift',
        className,
      )}
    >
      <div className="flex gap-3">
        <Avatar name={sme.name} tone={sme.tone} />
        <div className="min-w-0 flex-1">
          <h2 className="text-heading font-semibold leading-snug">
            <Link to={to} className="after:absolute after:inset-0 after:rounded-card after:content-['']">
              {t(internship.title)}
              <span className="sr-only">{', '}{applied ? t('see your application') : t('view opening')}</span>
            </Link>
          </h2>
          <p className="text-detail text-muted">{sme.name}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-detail text-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {t('{km} km away', { km: sme.distanceKm })}
            </span>
            {sme.verified && (
              <span className="inline-flex items-center gap-1 font-semibold text-teal">
                <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                <span aria-hidden="true">{t('Visited')}</span>
                <span className="sr-only">{t('Visited by Setu')}</span>
              </span>
            )}
          </p>
        </div>
        {onToggleSave && (
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={!!saved}
            aria-label={saved ? t('Remove {title} from saved', { title: t(internship.title) }) : t('Save {title}', { title: t(internship.title) })}
            className={cn(
              'relative z-10 -mr-2 -mt-2 grid size-12 shrink-0 place-items-center rounded-full hover:bg-apricot-mist',
              saved ? 'text-heart' : 'text-muted',
            )}
          >
            <Heart className={cn('size-6', saved && 'fill-current')} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {applied && <StatusBadge status={application!.status} />}
        <Tag tone="money">{money(internship.stipend)}</Tag>
        <Tag tone="neutral">{plural(internship.weeks, 'week')}</Tag>
        {internship.countsForCredit && <Tag tone="credit">{t('Counts for credit')}</Tag>}
      </div>
    </article>
  )
}

export function BackLinkText({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="font-semibold text-teal underline-offset-4 hover:underline">
      {children}
    </Link>
  )
}
