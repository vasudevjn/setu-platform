import { Link } from 'react-router-dom'
import { ChevronDown, Building2 } from 'lucide-react'
import { PageTitle } from '../../components/ui/PageHeader'
import { SupportCard } from '../../components/sme/SupportCard'
import { Card } from '../../components/ui/Card'
import { useApp } from '../../hooks/useApp'
import { titleCase } from '../../lib/format'
import { t } from '../../lib/i18n'

export default function SmeHelp() {
  const { currentSme } = useApp()
  const faqs = [
    { q: t('How do I post an opening?'), a: t('Tap "Post an opening" and answer five short questions. It takes about 10 minutes. You can speak your answers instead of typing.') },
    { q: t('Does it cost anything?'), a: t('No. The pilot is free for students and businesses.') },
    { q: t('What does "Not this time" mean for a student?'), a: t("Setu lets the student know kindly, so you don't have to. They see other openings near them.") },
    { q: t("When do I see a student's phone number?"), a: t('After you accept them. Before that, we keep it private to protect students.') },
    { q: t('What if an intern does not work out?'), a: t('Tell Anjali. We will help you find a replacement from your applicant list.') },
  ]
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <PageTitle title={t('Help')} sub={t('A real person from Setu is one tap away.')} />
      <SupportCard businessName={currentSme.name} />

      <section aria-label={t('Common questions')} className="flex flex-col gap-2">
        <h2 className="text-heading font-semibold">{titleCase(t('Common questions'))}</h2>
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-card bg-white shadow-card">
            <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-card px-4 py-3 font-semibold">
              {f.q}
              <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="px-4 pb-4 text-body text-muted">{f.a}</p>
          </details>
        ))}
      </section>

      <Card className="p-2">
        <Link to="/sme/profile" className="flex min-h-14 items-center gap-3 rounded-card px-3 font-semibold hover:bg-cream">
          <Building2 className="size-5 text-teal" aria-hidden="true" />
          {titleCase(t('Business profile'))}
        </Link>
      </Card>
    </div>
  )
}
