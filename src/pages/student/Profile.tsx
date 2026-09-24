import { useState } from 'react'
import { BadgeCheck, LogOut, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../hooks/useApp'
import { PageTitle } from '../../components/ui/PageHeader'
import { Card, SectionLabel } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { TextField } from '../../components/ui/Field'
import { Chip } from '../../components/ui/Chip'
import { Button } from '../../components/ui/Button'
import { Tag } from '../../components/ui/Tag'
import { HelperNote } from '../../components/ui/HelperNote'
import { useToast } from '../../components/ui/Toast'
import { COURSES, SKILLS } from '../../lib/options'

export default function StudentProfile() {
  const { currentStudent, updateStudent, setOnboarded } = useApp()
  const { show } = useToast()
  const navigate = useNavigate()
  const [first, setFirst] = useState(currentStudent.firstName)
  const [last, setLast] = useState(currentStudent.lastName)
  const [phone, setPhone] = useState(currentStudent.phone)
  const [course, setCourse] = useState(currentStudent.course)
  const [skills, setSkills] = useState(currentStudent.skills)

  const phoneOk = phone.replace(/\D/g, '').length >= 10
  const dirty =
    first !== currentStudent.firstName || last !== currentStudent.lastName || phone !== currentStudent.phone || course !== currentStudent.course || skills.join() !== currentStudent.skills.join()

  const save = () => {
    updateStudent(currentStudent.id, {
      firstName: first.trim(),
      lastName: last.trim(),
      shortName: `${first.trim()} ${last.trim().charAt(0).toUpperCase()}.`,
      phone,
      course,
      skills,
    })
    show({ message: 'Profile saved.' })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <PageTitle title="Profile" />

      <Card className="flex items-center gap-4 p-5">
        <Avatar name={`${currentStudent.firstName} ${currentStudent.lastName}`} size="lg" />
        <div className="min-w-0">
          <p className="text-heading font-semibold">{currentStudent.firstName} {currentStudent.lastName}</p>
          <p className="text-muted">{currentStudent.course} · {currentStudent.year}</p>
          <p className="text-detail text-muted">{currentStudent.college}</p>
        </div>
      </Card>
      {currentStudent.collegeVerified && (
        <div>
          <Tag tone="trust" icon={<BadgeCheck className="size-3.5" aria-hidden="true" />}>
            Confirmed by your college
          </Tag>
        </div>
      )}

      <HelperNote icon={<ShieldCheck className="size-6" />}>
        Businesses see your first name, course, skills and distance. They see your phone number only after they accept you.
      </HelperNote>

      <Card className="flex flex-col gap-5 p-5">
        <SectionLabel>Your details</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="First name" value={first} onChange={(e) => setFirst(e.target.value)} />
          <TextField label="Surname" value={last} onChange={(e) => setLast(e.target.value)} />
        </div>
        <TextField label="Mobile number" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={!phoneOk ? 'Please enter a 10 digit mobile number.' : undefined} />
        <div>
          <p className="mb-2 text-button font-semibold">Course</p>
          <div role="group" aria-label="Course" className="flex flex-wrap gap-2">
            {COURSES.map((c) => (
              <Chip key={c} selected={course === c} onClick={() => setCourse(c)}>{c}</Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-button font-semibold">Skills</p>
          <div role="group" aria-label="Skills" className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <Chip key={s} kind="pick" selected={skills.includes(s)} onClick={() => setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))}>{s}</Chip>
            ))}
          </div>
        </div>
        <Button size="lg" full disabled={!dirty || !phoneOk || !first.trim() || !last.trim() || skills.length === 0} onClick={save}>
          Save changes
        </Button>
      </Card>

      <Card className="flex flex-col gap-2 p-5">
        <SectionLabel>Demo tools</SectionLabel>
        <p className="text-muted">This is a prototype. You can see the first-time setup again, or go back to the start.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => { setOnboarded('student', false); navigate('/student/onboarding') }}>
            Show first-time setup
          </Button>
          <Button variant="ghost" icon={<LogOut className="size-4" aria-hidden="true" />} onClick={() => navigate('/')}>
            Leave demo
          </Button>
        </div>
      </Card>
    </div>
  )
}
