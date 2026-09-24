import { Link, useNavigate } from 'react-router-dom'
import { Building2, GraduationCap, ShieldCheck } from 'lucide-react'
import { Logo } from '../components/brand/Logo'
import { useApp } from '../hooks/useApp'
import type { Role } from '../types'

export default function Continue() {
  const { setRole, setOnboarded, state } = useApp()
  const navigate = useNavigate()
  const options: Array<{ role: Role; icon: typeof Building2; title: string; sub: string; to: string }> = [
    { role: 'student', icon: GraduationCap, title: 'Student', sub: 'Priya, final-year BCom. Browse openings and apply.', to: '/student' },
    { role: 'sme', icon: Building2, title: 'Business', sub: 'Post an opening and look at applicants.', to: '/sme' },
    { role: 'admin', icon: ShieldCheck, title: 'Setu Admin', sub: 'Verify businesses and help with matches.', to: '/admin' },
  ]
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-4 py-10">
      <Link to="/" aria-label="Setu home" className="self-start">
        <Logo height={38} />
      </Link>
      <div>
        <h1 className="text-title font-bold">Continue as</h1>
        <p className="mt-1 text-muted">This is a prototype. There is no login. Pick who you want to be.</p>
      </div>
      <div className="flex flex-col gap-3">
        {options.map(({ role, icon: Icon, title, sub, to }) => (
          <div key={role} className="rounded-card bg-white p-4 shadow-card">
            <button
              type="button"
              onClick={() => {
                setRole(role)
                navigate(to)
              }}
              className="flex min-h-14 w-full items-center gap-3 text-left"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-avatar bg-teal-mist text-teal">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-heading font-semibold">{title}</span>
                <span className="block text-detail text-muted">{sub}</span>
              </span>
            </button>
            {role !== 'admin' && (
              <button
                type="button"
                className="mt-1 min-h-11 rounded-button px-1 text-detail font-semibold text-teal underline underline-offset-4"
                onClick={() => {
                  setRole(role)
                  setOnboarded(role, false)
                  navigate(`${to}/onboarding`)
                }}
              >
                See the first-time setup
              </button>
            )}
          </div>
        ))}
      </div>
      {state.role && <p className="text-detail text-muted">Last time you were: {state.role === 'sme' ? 'Business' : state.role === 'admin' ? 'Setu Admin' : 'Student'}.</p>}
    </main>
  )
}
