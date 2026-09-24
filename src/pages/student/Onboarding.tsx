import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../hooks/useApp'
import { StepFlow } from '../../components/ui/StepFlow'
import { TextField, CheckField, SelectField } from '../../components/ui/Field'
import { Chip } from '../../components/ui/Chip'
import { HelperNote } from '../../components/ui/HelperNote'
import { COURSES, SKILLS } from '../../lib/options'
import { PARTNER_COLLEGE } from '../../lib/config'
import { useToast } from '../../components/ui/Toast'
import { t } from '../../lib/i18n'

export default function StudentOnboarding() {
  const { currentStudent, updateStudent, setOnboarded } = useApp()
  const navigate = useNavigate()
  const { show } = useToast()
  const [step, setStep] = useState(1)
  const [first, setFirst] = useState(currentStudent.firstName)
  const [last, setLast] = useState(currentStudent.lastName)
  const [phone, setPhone] = useState(currentStudent.phone)
  const [course, setCourse] = useState(currentStudent.course)
  const [final, setFinal] = useState(false)
  const [skills, setSkills] = useState<string[]>(currentStudent.skills)
  const [tried, setTried] = useState(false)

  const total = 3
  const phoneOk = phone.replace(/\D/g, '').length >= 10
  const toggle = (s: string) => setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

  const back = () => (step === 1 ? navigate('/') : setStep(step - 1))

  const finish = () => {
    updateStudent(currentStudent.id, {
      firstName: first.trim(),
      lastName: last.trim(),
      shortName: `${first.trim()} ${last.trim().charAt(0).toUpperCase()}.`,
      phone,
      course,
      skills,
      college: PARTNER_COLLEGE,
      collegeVerified: true,
    })
    setOnboarded('student', true)
    show({ message: t("You're all set, {name}.", { name: first.trim() }) })
    navigate('/student', { replace: true })
  }

  if (step === 1)
    return (
      <StepFlow step={1} total={total} title={t("What's your name?")} sub={t('Businesses see your first name and the first letter of your surname.')} onBack={back} onNext={() => setStep(2)} nextDisabled={!first.trim() || !last.trim() || !phoneOk}>
        <TextField label={t('First name')} value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" />
        <TextField label={t('Surname')} value={last} onChange={(e) => setLast(e.target.value)} autoComplete="family-name" />
        <TextField
          label={t('Mobile number')}
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          hint={t('We only use it for SMS updates. Businesses see it only after they accept you.')}
          error={!phoneOk && phone ? t('Please enter a 10 digit mobile number.') : undefined}
        />
      </StepFlow>
    )

  if (step === 2)
    return (
      <StepFlow
        step={2}
        total={total}
        title={t('Where do you study?')}
        sub={t('Setu is only for final-year students at our partner college for now.')}
        onBack={back}
        onNext={() => {
          setTried(true)
          if (final) setStep(3)
        }}
      >
        <SelectField label={t('College')} defaultValue={PARTNER_COLLEGE} disabled>
          <option>{t(PARTNER_COLLEGE)}</option>
        </SelectField>
        <div>
          <p className="mb-2 text-button font-semibold">{t('Your course')}</p>
          <div role="group" aria-label={t('Your course')} className="flex flex-wrap gap-2">
            {COURSES.map((c) => (
              <Chip key={c} selected={course === c} onClick={() => setCourse(c)}>{t(c)}</Chip>
            ))}
          </div>
        </div>
        <CheckField label={t('I am in my final year')} checked={final} onChange={setFinal} error={tried && !final ? t('Please tick this to continue. Setu is for final-year students.') : undefined} />
        <HelperNote>{t('Your college confirms you are a final-year student. Businesses see this tick on your profile.')}</HelperNote>
      </StepFlow>
    )

  return (
    <StepFlow step={3} total={total} title={t('What can you do?')} sub={t('Pick any that fit. This helps businesses see how you can help.')} onBack={back} onNext={finish} nextLabel={t('Finish and see openings')} nextDisabled={skills.length === 0}>
      <div role="group" aria-label={t('Your skills')} className="flex flex-wrap gap-2">
        {SKILLS.map((s) => (
          <Chip key={s} kind="pick" selected={skills.includes(s)} onClick={() => toggle(s)}>{t(s)}</Chip>
        ))}
      </div>
    </StepFlow>
  )
}
