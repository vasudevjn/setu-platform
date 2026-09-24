import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Building2, ChevronDown, Clock, GraduationCap, HandHeart, IndianRupee, MapPin, MessageCircle, ShieldCheck, UserCheck } from 'lucide-react'
import { Logo } from '../../components/brand/Logo'
import { LanguageButton } from '../../components/navigation/LanguageButton'
import { BridgeArt, Sparkle } from '../../components/brand/Spot'
import { LinkButton } from '../../components/ui/Button'
import { Tag } from '../../components/ui/Tag'
import { Avatar } from '../../components/ui/Avatar'
import { Timeline } from '../../components/ui/Timeline'
import { InternshipCard } from '../../components/internship/InternshipCard'
import { mockInternships } from '../../data/mockInternships'
import { mockSMEs } from '../../data/mockSMEs'
import { t } from '../../lib/i18n'

const faqs = [
  { q: 'Who can use Setu?', a: 'Final-year students at our partner college, and verified businesses in the pilot town.' },
  { q: 'Does it cost anything?', a: 'No. The pilot is free for students and businesses.' },
  { q: 'How do I know an opening is real?', a: 'Our team visits every business in person before it can post. Only openings from visited businesses are shown, with the date of the visit.' },
  { q: 'Will my internship count for credit?', a: 'Yes. When you finish, our team sends your college a completion letter that it can use for your AICTE credit.' },
  { q: 'Will I be paid?', a: 'Each opening shows the stipend up front, or says "Unpaid". You know before you apply.' },
  { q: 'I run a small business. How much time does this take?', a: 'Posting an opening takes about 10 minutes. After that, you only look at the students who apply.' },
  { q: 'What if an intern does not work out?', a: 'Tell our team. We will help you find a replacement from the applicant list.' },
]

function Section({ id, className = '', children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-20 px-4 py-14 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/50 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <Link to="/" aria-label={t('Setu home')} className="grid min-h-12 place-items-center">
          <Logo height={30} />
        </Link>
        <nav aria-label={t('Main')} className="hidden items-center gap-6 text-button font-semibold text-muted lg:flex">
          <a href="#how" className="hover:text-teal">{t('How it works')}</a>
          <a href="#students" className="hover:text-teal">{t('For students')}</a>
          <a href="#business" className="hover:text-teal">{t('For businesses')}</a>
          <a href="#faq" className="hover:text-teal">{t('FAQ')}</a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageButton showName />
          <LinkButton to="/sme" variant="secondary" size="sm" className="max-sm:hidden">
            {t("I'm a business")}
          </LinkButton>
          <LinkButton to="/student" size="sm" className="max-sm:hidden">
            {t('Find an internship')}
          </LinkButton>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="px-4 pb-10 pt-10 lg:pb-16 lg:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Tag tone="trust" icon={<ShieldCheck className="size-3.5" aria-hidden="true" />}>{t('Pilot in Nashik')}</Tag>
          <h1 className="mt-4 text-[2.5rem] font-bold leading-[1.1] tracking-tight sm:text-[3.25rem] lg:text-[3.75rem]">
            {t('Real internships,')}
            <br />
            <span className="text-teal">{t('close to home.')}</span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.125rem] text-muted">
            {t('Setu connects final-year students with verified local businesses — so you can get real work experience without leaving your town.')}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <LinkButton to="/student" size="lg" iconRight={<ArrowRight className="size-5" aria-hidden="true" />}>
              {t('Find an internship')}
            </LinkButton>
            <LinkButton to="/sme" size="lg" variant="secondary">
              {t("I'm a business")}
            </LinkButton>
          </div>
          <p className="mt-4 flex items-center gap-2 text-detail text-muted">
            <BadgeCheck className="size-4 text-teal" aria-hidden="true" />
            {t('Free for students and businesses during the pilot.')}
          </p>
        </div>

        <div className="relative">
          <div className="rounded-[32px] bg-white p-5 shadow-card sm:p-8">
            <BridgeArt className="h-auto w-full" />
            <ol className="mt-4 grid grid-cols-3 text-center text-detail font-semibold">
              <li className="text-muted">{t('Student')}</li>
              <li className="text-teal">Setu</li>
              <li className="text-muted">{t('Local business')}</li>
            </ol>
          </div>
          <Sparkle className="absolute -right-2 -top-3 text-apricot" size={28} />
        </div>
      </div>
    </section>
  )
}

function Trust() {
  const items = [
    { icon: ShieldCheck, title: t('Visited in person'), body: t('Our team meets every business before it can post. You see the date and the owner’s name.') },
    { icon: IndianRupee, title: t('Pay shown first'), body: t('Every opening shows the stipend, or says “Unpaid”. No vague words.') },
    { icon: GraduationCap, title: t('Counts for credit'), body: t('We send your college a completion letter when you finish your internship.') },
  ]
  return (
    <section className="bg-teal px-4 py-12 text-white lg:py-16" aria-labelledby="trust-h">
      <div className="mx-auto max-w-6xl">
        <p className="text-tag font-bold uppercase tracking-[0.14em] text-white">{t('Why you can trust it')}</p>
        <h2 id="trust-h" className="mt-2 max-w-2xl text-[1.75rem] font-bold leading-tight lg:text-[2.25rem]">
          {t('Setu only shows openings from businesses we have visited.')}
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-card bg-white/10 p-5">
              <Icon className="size-8 text-apricot" aria-hidden="true" />
              <h3 className="mt-3 text-heading font-semibold">{title}</h3>
              <p className="mt-1 text-white">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function How() {
  const steps = [
    { n: 1, title: t('A business posts an opening'), body: t('The owner answers a few simple questions. Role, weeks and stipend.') },
    { n: 2, title: t('Setu visits and verifies'), body: t('We meet the owner in person. Only then does the opening go live.') },
    { n: 3, title: t('You see it and apply'), body: t('Openings near you show pay, time, distance and credit. Apply with one tap.') },
    { n: 4, title: t('The owner replies'), body: t('You see your status in the app, and we send you an SMS. If it is not the right fit, we show you other openings.') },
  ]
  return (
    <Section id="how">
      <p className="label-caps">{t('How Setu works')}</p>
      <h2 className="mt-2 max-w-2xl text-[1.75rem] font-bold leading-tight lg:text-[2.25rem]">{t('A Bridge Between Your College and the Shops in Your Town.')}</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="rounded-card bg-white p-5 shadow-card">
            <span className="grid size-10 place-items-center rounded-full bg-apricot-mist text-heading font-bold text-apricot-text">{s.n}</span>
            <h3 className="mt-3 text-heading font-semibold leading-snug">{s.title}</h3>
            <p className="mt-1 text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Benefits({ id, label, title, tone, cta, items }: { id: string; label: string; title: string; tone: 'cream' | 'white'; cta: React.ReactNode; items: Array<{ icon: typeof Clock; title: string; body: string }> }) {
  return (
    <Section id={id} className={tone === 'white' ? 'bg-white' : ''}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <div>
          <p className="label-caps">{label}</p>
          <h2 className="mt-2 text-[1.75rem] font-bold leading-tight lg:text-[2.25rem]">{title}</h2>
          <div className="mt-6">{cta}</div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map(({ icon: Icon, title: itemTitle, body }) => (
            <li key={itemTitle} className={`rounded-card p-5 ${tone === 'white' ? 'bg-cream' : 'bg-white shadow-card'}`}>
              <span className="grid size-11 place-items-center rounded-avatar bg-teal-mist text-teal">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-heading font-semibold leading-snug">{itemTitle}</h3>
              <p className="mt-1 text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function Example() {
  const internship = mockInternships[0]
  const sme = mockSMEs.find((s) => s.id === internship.smeId)!
  return (
    <Section id="example">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="label-caps">{t('What it feels like')}</p>
          <h2 className="mt-2 text-[1.75rem] font-bold leading-tight lg:text-[2.25rem]">{t('Everything You Ask Before You Trust an Opening, Answered Up Front.')}</h2>
          <ul className="mt-5 space-y-3 text-body">
            {[
              [t('Is it real?'), t('Visited by Setu, with the date.')],
              [t('How much will I get paid?'), t('The stipend is on the card.')],
              [t('How far is it?'), t('Distance from your home.')],
              [t('Will it count for credit?'), t('A clear tag on every opening.')],
              [t('What happens after I apply?'), t('A timeline that tells you what is next.')],
            ].map(([q, a]) => (
              <li key={q} className="flex gap-3">
                <BadgeCheck className="mt-1 size-5 shrink-0 text-teal" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{q}</span> <span className="text-muted">{a}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          role="img"
          aria-label={t('Example of the Setu student app: an Accounts Intern opening at Sharma Traders, visited by Setu, and a What happens next timeline after applying.')}
          className="mx-auto w-full max-w-sm rounded-[40px] border-[10px] border-ink bg-cream p-4 shadow-lift"
        >
          <div className="pointer-events-none flex flex-col gap-4" inert>
            <div>
              <p className="text-muted">{t('Good morning,')}</p>
              <p className="text-[1.75rem] font-bold leading-tight">Priya</p>
              <p className="text-muted">{t('3 new openings near you this week')}</p>
            </div>
            <InternshipCard internship={internship} sme={sme} />
            <div className="rounded-card bg-white p-4 shadow-card">
              <p className="label-caps mb-3">{t('What happens next')}</p>
              <Timeline
                steps={[
                  { title: t('You applied'), detail: t('Today'), state: 'done' },
                  { title: t('Ramesh looks at your profile'), detail: t('Usually 1–3 days'), state: 'current' },
                  { title: t('You hear back'), detail: t("We'll notify you"), state: 'todo' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <LinkButton to="/student" variant="secondary" size="lg" iconRight={<ArrowRight className="size-5" aria-hidden="true" />}>
          {t('Try it yourself')}
        </LinkButton>
      </div>
    </Section>
  )
}

function Stories() {
  const quotes = [
    { who: 'Priya', role: t('Final-year BCom student'), text: t('I needed an internship for my credits but did not want to move to a big city. Through Setu I found one at a trading firm 15 minutes from home.') },
    { who: 'Ramesh', role: t('Runs a 40-person manufacturing unit'), text: t('I have wanted to hire interns for years but never had time to screen anyone. I posted a role on Monday and had three good students to meet by Friday.') },
  ]
  return (
    <Section className="bg-white">
      <p className="label-caps">{t('What we are building toward')}</p>
      <h2 className="mt-2 max-w-2xl text-[1.75rem] font-bold leading-tight lg:text-[2.25rem]">{t('Stories From Our Pilot Plan.')}</h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {quotes.map((q) => (
          <li key={q.who} className="flex flex-col gap-4 rounded-card bg-cream p-6">
            <blockquote className="text-[1.0625rem]">“{q.text}”</blockquote>
            <div className="mt-auto flex items-center gap-3">
              <Avatar name={q.who} size="sm" tone="apricot" />
              <div>
                <p className="font-semibold leading-snug">{q.who}</p>
                <p className="text-detail text-muted">{q.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-detail text-muted">{t('These are illustrative quotes from our launch plan, not real customers yet. We will replace them with real stories after the pilot.')}</p>
    </Section>
  )
}

function Faq() {
  return (
    <Section id="faq">
      <div className="mx-auto max-w-3xl">
        <p className="label-caps">{t('Questions')}</p>
        <h2 className="mt-2 text-[1.75rem] font-bold leading-tight lg:text-[2.25rem]">{t('Things People Ask Us.')}</h2>
        <div className="mt-6 flex flex-col gap-2">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-card bg-white shadow-card">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-card px-5 py-3 font-semibold">
                {t(f.q)}
                <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-body text-muted">{t(f.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

function FinalCta() {
  return (
    <section className="px-4 pb-16">
      <div className="mx-auto max-w-6xl rounded-[32px] bg-teal px-6 py-12 text-center text-white lg:py-16">
        <div className="flex justify-center">
          <Logo variant="reversed" height={44} />
        </div>
        <h2 className="mx-auto mt-6 max-w-2xl text-[1.75rem] font-bold leading-tight lg:text-[2.5rem]">{t('Real internships, close to home.')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">{t('Students in Nashik can look at openings today. Business owners can ask Setu to visit and post their first opening.')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton to="/student" variant="apricot" size="lg">
            {t('Find an internship')}
          </LinkButton>
          <LinkButton to="/sme" size="lg" className="border border-white/50 bg-transparent hover:bg-white/10">
            {t("I'm a business")}
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line/60 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo height={34} />
          <p className="mt-3 max-w-xs text-detail text-muted">{t('Setu means bridge. A pilot connecting final-year students with visited local businesses in Nashik.')}</p>
        </div>
        <nav aria-label={t('Demo roles')} className="flex flex-col gap-1 text-button">
          <p className="label-caps mb-1">{t('Try the prototype as')}</p>
          <Link className="min-h-11 py-2 font-semibold text-teal underline-offset-4 hover:underline" to="/student">{t('A student')}</Link>
          <Link className="min-h-11 py-2 font-semibold text-teal underline-offset-4 hover:underline" to="/sme">{t('A business owner')}</Link>
          <Link className="min-h-11 py-2 font-semibold text-teal underline-offset-4 hover:underline" to="/admin">{t('Setu team')}</Link>
        </nav>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <div>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-button focus:bg-teal focus:px-4 focus:py-3 focus:text-white">
        {t('Skip to main content')}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Trust />
        <How />
        <Benefits
          id="students"
          label={t('For students')}
          title={t('Real work experience, without leaving your town.')}
          tone="white"
          cta={<LinkButton to="/student" size="lg">{t('Find an internship')}</LinkButton>}
          items={[
            { icon: IndianRupee, title: t('Pay, time and distance first'), body: t('See the stipend, weeks and how far it is before you tap anything.') },
            { icon: MapPin, title: t('Close to home'), body: t('Only openings in your town. No moving to a big city.') },
            { icon: Clock, title: t('Always know what is next'), body: t('A simple timeline after you apply, and an SMS when there is news.') },
            { icon: HandHeart, title: t('Kind if it is not this time'), body: t('We never say “rejected”. We show you other openings near you.') },
          ]}
        />
        <Benefits
          id="business"
          label={t('For businesses')}
          title={t('Meet students who are ready to learn, without a hiring process.')}
          tone="cream"
          cta={<LinkButton to="/sme" size="lg" variant="secondary">{t("I'm a business")}</LinkButton>}
          items={[
            { icon: Building2, title: t('Post in about 10 minutes'), body: t('One question at a time. Tap to pick, or speak instead of typing.') },
            { icon: UserCheck, title: t('Confirmed final-years'), body: t('Each student is confirmed by their college before they can apply.') },
            { icon: MessageCircle, title: t('A real person to call'), body: t('Anjali from Setu is one tap away by call or chat.') },
            { icon: ShieldCheck, title: t('Students’ numbers stay private'), body: t('You see a student’s phone number only after you accept them.') },
          ]}
        />
        <Example />
        <Stories />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
