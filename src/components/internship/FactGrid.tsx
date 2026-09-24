import { GraduationCap, IndianRupee, MapPin, Clock } from 'lucide-react'
import type { Internship, SME } from '../../types'
import { money, plural } from '../../lib/format'
import { t } from '../../lib/i18n'

/** The four facts students ask about before they trust a listing. */
export function FactGrid({ internship, sme }: { internship: Internship; sme: SME }) {
  const facts = [
    { icon: IndianRupee, label: 'Stipend', value: money(internship.stipend) },
    { icon: Clock, label: 'Duration', value: `${plural(internship.weeks, 'week')} · ${t(internship.hours)}` },
    { icon: MapPin, label: 'Distance', value: t('{km} km from home', { km: sme.distanceKm }) },
    { icon: GraduationCap, label: 'Credit', value: internship.countsForCredit ? t('Counts for AICTE credit') : t('Credit not confirmed') },
  ]
  return (
    <dl className="grid grid-cols-2 gap-3">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-card bg-white p-3.5 shadow-card">
          <dt className="flex items-center gap-1.5 text-detail text-muted">
            <Icon className="size-4" aria-hidden="true" />
            {t(label)}
          </dt>
          <dd className="mt-1 text-body font-semibold leading-snug">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
