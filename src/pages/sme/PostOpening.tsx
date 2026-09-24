import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Pencil } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import { StepFlow } from '../../components/ui/StepFlow'
import { TextArea, TextField } from '../../components/ui/Field'
import { Chip } from '../../components/ui/Chip'
import { HelperNote } from '../../components/ui/HelperNote'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Avatar } from '../../components/ui/Avatar'
import { Timeline } from '../../components/ui/Timeline'
import { CheckBurst } from '../../components/brand/Spot'
import { LinkButton } from '../../components/ui/Button'
import { useSpeech } from '../../hooks/useSpeech'
import { useToast } from '../../components/ui/Toast'
import { HOURS_CHOICES, STIPEND_CHOICES, TASK_CHIPS, WEEK_CHOICES } from '../../lib/options'
import { money, plural, titleFromTasks, titleCase } from '../../lib/format'
import { t } from '../../lib/i18n'
import { cn } from '../../lib/cn'
import { PARTNER_COLLEGE } from '../../lib/config'

const TASK_SENTENCE: Record<string, string> = {
  Billing: 'Prepare bills and invoices',
  'GST entries': 'Enter GST entries in our books',
  'Stock records': 'Keep stock records up to date',
  'Customer calls': 'Call customers and answer their questions',
  'Social media': 'Post on social media and reply to messages',
  Delivery: 'Help with deliveries and dispatch',
}

type StipendChoice = number | 'other' | 'unpaid' | null

export default function PostOpening() {
  const { currentSme, addInternship } = useApp()
  const navigate = useNavigate()
  const { show } = useToast()

  const [step, setStep] = useState(1)
  const [chips, setChips] = useState<string[]>([])
  const [text, setText] = useState('')
  const [weeks, setWeeks] = useState<number | null>(null)
  const [stipend, setStipend] = useState<StipendChoice>(null)
  const [otherAmount, setOtherAmount] = useState('')
  const [atShop, setAtShop] = useState(true)
  const [elsewhere, setElsewhere] = useState('')
  const [hours, setHours] = useState('10–5')
  const [title, setTitle] = useState('')
  const [tried, setTried] = useState(false)
  const [posted, setPosted] = useState(false)
  const [posting, setPosting] = useState(false)

  const total = 5
  const goBack = () => (step === 1 ? navigate('/sme') : setStep(step - 1))
  const next = () => {
    setTried(false)
    setStep(step + 1)
  }

  const appendSpoken = useCallback((spoken: string) => setText((cur) => (cur ? `${cur} ${spoken}` : spoken)), [])
  const speech = useSpeech(appendSpoken)

  const stipendValue: number | null | undefined =
    stipend === 'unpaid' ? null : stipend === 'other' ? (Number(otherAmount) > 0 ? Number(otherAmount) : undefined) : typeof stipend === 'number' ? stipend : undefined

  // "where" is saved, so it stays English. "whereShown" is the same place worded in the chosen language.
  const isShop = currentSme.kind.toLowerCase().includes('retail')
  const areaFirst = currentSme.area.split(',')[0]
  const where = atShop ? `At our ${isShop ? 'shop' : 'place'}, ${areaFirst}` : elsewhere.trim()
  const whereShown = atShop
    ? isShop
      ? t('At our shop, {area}', { area: t(areaFirst) })
      : t('At our place, {area}', { area: t(areaFirst) })
    : elsewhere.trim()
  const autoTitle = titleFromTasks(chips)
  const finalTitle = (title || autoTitle).trim()

  const publish = () => {
    setPosting(true)
    const tasks = [
      ...text.split(/\n|\.\s+/).map((line) => line.trim().replace(/\.$/, '')).filter(Boolean),
      ...chips.filter((c) => TASK_SENTENCE[c]).map((c) => TASK_SENTENCE[c]),
    ]
    window.setTimeout(() => {
      addInternship({
        smeId: currentSme.id,
        title: finalTitle || 'Intern',
        tasks: tasks.length ? tasks : ['Help our team with day to day work'],
        requirements: [`Final-year student at ${PARTNER_COLLEGE}`, 'Careful, regular and on time', 'Happy to learn on the job'],
        stipend: stipendValue ?? null,
        weeks: weeks ?? 8,
        hours,
        where: where || `At our place, ${currentSme.area.split(',')[0]}`,
        countsForCredit: true,
      })
      setPosted(true)
      setPosting(false)
      show({ message: t('Your opening is posted.') })
    }, 500)
  }

  if (posted) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-8 text-center">
        <CheckBurst size={136} />
        <h1 className="mt-6 text-title font-bold lg:text-[2rem]">{titleCase(currentSme.verified ? t('Your opening is live.') : t('Your opening is saved.'))}</h1>
        <p className="mt-3 max-w-sm text-body text-muted">
          {currentSme.verified ? t("We'll help you review the first applications.") : t('It goes live for students as soon as Setu visits you. Anjali will call you to fix a time.')}
        </p>
        <Card className="mt-8 w-full p-5 text-left">
          <p className="label-caps">{t('What happens next')}</p>
          <div className="mt-4">
            <Timeline
              steps={[
                { title: t('You posted your opening'), detail: t('Today'), state: 'done' },
                currentSme.verified
                  ? { title: t('Students near you see it'), detail: t('Right away'), state: 'current' }
                  : { title: t('Setu visits you'), detail: t('Anjali will call to fix a time'), state: 'current' },
                { title: t('You look at the students'), detail: t("We'll tell you when someone applies"), state: 'todo' },
                { title: t('You pick who you like'), detail: t('Setu lets the others know kindly'), state: 'todo' },
              ]}
            />
          </div>
        </Card>
        <div className="mt-8 flex w-full flex-col gap-3">
          <LinkButton to="/sme/openings" size="lg" full>
            {t('See my openings')}
          </LinkButton>
          <LinkButton to="/sme" variant="ghost" full>
            {t('Go to home')}
          </LinkButton>
        </div>
      </div>
    )
  }

  if (step === 1)
    return (
      <StepFlow
        step={1}
        total={total}
        title={t('What will the intern help you with?')}
        sub={t('Pick any that fit. You can add your own words too.')}
        onBack={goBack}
        onNext={() => {
          if (chips.length === 0 && !text.trim()) return setTried(true)
          next()
        }}
      >
        <div role="group" aria-label={t('Tasks')} className="flex flex-wrap gap-2.5">
          {TASK_CHIPS.map((c) => (
            <Chip key={c} kind="pick" selected={chips.includes(c)} onClick={() => setChips((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]))}>
              {t(c)}
            </Chip>
          ))}
        </div>
        <TextArea
          label={t('Or say it in your own words')}
          hideLabel
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('Enter daily bills in Tally and keep our stock register up to date.')}
          hint={speech.supported ? t('Easier to say it? Tap the mic and speak.') : t('You can type here. Voice typing is not available on this browser.')}
          error={tried && chips.length === 0 && !text.trim() ? t('Please pick at least one thing, or write it in your own words.') : undefined}
          corner={
            speech.supported ? (
              <button
                type="button"
                onClick={speech.toggle}
                aria-pressed={speech.listening}
                aria-label={speech.listening ? t('Stop listening') : t('Speak instead of typing')}
                className={cn('grid size-12 place-items-center rounded-full text-white transition-colors', speech.listening ? 'bg-heart animate-pulse' : 'bg-teal hover:bg-teal-hover')}
              >
                <Mic className="size-5" aria-hidden="true" />
              </button>
            ) : undefined
          }
        />
        <HelperNote tone="apricot">{t('Clear tasks help the right students apply.')}</HelperNote>
      </StepFlow>
    )

  if (step === 2)
    return (
      <StepFlow step={2} total={total} title={t('How long is the internship?')} sub={t('Most students in their final year can give 6 to 12 weeks.')} onBack={goBack} onNext={() => (weeks ? next() : setTried(true))}>
        <div role="group" aria-label={t('Duration')} className="grid grid-cols-2 gap-3">
          {WEEK_CHOICES.map((w) => (
            <Chip key={w} big selected={weeks === w} onClick={() => setWeeks(w)} className="justify-center">
              {plural(w, 'week')}
            </Chip>
          ))}
        </div>
        {tried && !weeks && <p role="alert" className="text-detail text-error">{t('Please pick how long the internship is.')}</p>}
      </StepFlow>
    )

  if (step === 3)
    return (
      <StepFlow
        step={3}
        total={total}
        title={t('Will you pay a stipend?')}
        sub={t('Students see the stipend first, so being clear helps them trust you.')}
        onBack={goBack}
        onNext={() => (stipendValue !== undefined ? next() : setTried(true))}
      >
        <div role="group" aria-label={t('Stipend')} className="flex flex-wrap gap-2.5">
          {STIPEND_CHOICES.map((s) => (
            <Chip key={s} big selected={stipend === s} onClick={() => setStipend(s)}>
              {t('₹{amount}/month', { amount: s.toLocaleString('en-IN') })}
            </Chip>
          ))}
          <Chip big selected={stipend === 'other'} onClick={() => setStipend('other')}>{t('Other')}</Chip>
          <Chip big selected={stipend === 'unpaid'} onClick={() => setStipend('unpaid')}>{t('Unpaid')}</Chip>
        </div>
        {stipend === 'other' && (
          <TextField label={t('Stipend per month (₹)')} type="number" inputMode="numeric" min={0} value={otherAmount} onChange={(e) => setOtherAmount(e.target.value)} placeholder={t('For example 4500')} />
        )}
        {tried && stipendValue === undefined && (
          <p role="alert" className="text-detail text-error">
            {t('Please add the stipend, or pick "Unpaid".')}
          </p>
        )}
        <HelperNote tone="apricot">{t('There are no fees to post on Setu. The pilot is free for businesses.')}</HelperNote>
      </StepFlow>
    )

  if (step === 4)
    return (
      <StepFlow step={4} total={total} title={t('Where is the work?')} onBack={goBack} onNext={() => (atShop || elsewhere.trim() ? next() : setTried(true))}>
        <div role="group" aria-label={t('Where')} className="flex flex-col gap-2.5">
          <Chip big selected={atShop} onClick={() => setAtShop(true)} className="justify-start">
            {t('At my place · {area}', { area: t(currentSme.area) })}
          </Chip>
          <Chip big selected={!atShop} onClick={() => setAtShop(false)} className="justify-start">
            {t('Somewhere else')}
          </Chip>
        </div>
        {!atShop && <TextField label={t('Address or area')} value={elsewhere} onChange={(e) => setElsewhere(e.target.value)} error={tried && !elsewhere.trim() ? t('Please tell students where to go.') : undefined} />}
        <div>
          <p className="mb-2 text-button font-semibold">{t('Working hours')}</p>
          <div role="group" aria-label={t('Working hours')} className="flex flex-wrap gap-2.5">
            {HOURS_CHOICES.map((h) => (
              <Chip key={h} big selected={hours === h} onClick={() => setHours(h)}>{t(h)}</Chip>
            ))}
          </div>
        </div>
      </StepFlow>
    )

  return (
    <StepFlow
      step={5}
      total={total}
      title={t('Have a look before you post')}
      sub={t('This is how students will see your opening.')}
      onBack={goBack}
      onNext={publish}
      nextLabel={t('Post opening')}
      nextLoading={posting}
      footnote={currentSme.verified ? t('Free to post. You can close it any time.') : t('Students see it after Setu visits you.')}
    >
      <Card className="p-4">
        <div className="flex gap-3">
          <Avatar name={currentSme.name} tone={currentSme.tone} />
          <div className="min-w-0 flex-1">
            <h2 className="text-heading font-semibold leading-snug">{t(finalTitle)}</h2>
            <p className="text-muted">{currentSme.name}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Tag tone="money">{money(stipendValue ?? null)}</Tag>
          <Tag tone="neutral">{plural(weeks ?? 8, 'week')}</Tag>
          <Tag tone="credit">{t('Counts for credit')}</Tag>
        </div>
        <p className="mt-3 text-body text-muted">
          {whereShown || t(currentSme.area)} · {t(hours)}
        </p>
      </Card>
      <TextField label={t('Opening title')} value={title} placeholder={t(autoTitle)} onChange={(e) => setTitle(e.target.value)} hint={t('You can change the name students see.')} />
      <ul className="flex flex-col gap-2">
        {[
          { label: t('Tasks'), change: t('Change tasks'), value: [...(text.trim() ? [text.trim()] : []), ...chips.map((c) => t(c))].join(', '), to: 1 },
          { label: t('Duration'), change: t('Change duration'), value: plural(weeks ?? 8, 'week'), to: 2 },
          { label: t('Stipend'), change: t('Change stipend'), value: money(stipendValue ?? null), to: 3 },
          { label: t('Where'), change: t('Change where'), value: `${whereShown || t(currentSme.area)}, ${t(hours)}`, to: 4 },
        ].map((r) => (
          <li key={r.label} className="flex items-start justify-between gap-3 rounded-button bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="text-detail text-muted">{r.label}</p>
              <p className="break-words font-medium">{r.value}</p>
            </div>
            <button type="button" onClick={() => setStep(r.to)} className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-button px-2 font-semibold text-teal hover:bg-teal-mist" aria-label={r.change}>
              <Pencil className="size-4" aria-hidden="true" /> {t('Change')}
            </button>
          </li>
        ))}
      </ul>
    </StepFlow>
  )
}
