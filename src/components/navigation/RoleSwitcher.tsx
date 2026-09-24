import { useNavigate } from 'react-router-dom'
import { Building2, GraduationCap, ShieldCheck, RotateCcw } from 'lucide-react'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { useApp } from '../../hooks/useApp'
import { useToast } from '../ui/Toast'
import type { Role } from '../../types'
import { cn } from '../../lib/cn'

export const roleHome: Record<Role, string> = { student: '/student', sme: '/sme', admin: '/admin' }
export const roleName: Record<Role, string> = { student: 'Student', sme: 'Business', admin: 'Setu Admin' }

/** Demo-only: there is no login in this prototype, so anyone can switch role. */
export function RoleSwitcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, setRole, setCurrentSme, resetDemo } = useApp()
  const navigate = useNavigate()
  const { show } = useToast()

  const go = (role: Role) => {
    setRole(role)
    onClose()
    navigate(roleHome[role])
  }

  const options: Array<{ role: Role; icon: typeof Building2; sub: string }> = [
    { role: 'student', icon: GraduationCap, sub: 'Priya, final-year BCom' },
    { role: 'sme', icon: Building2, sub: 'A local business owner' },
    { role: 'admin', icon: ShieldCheck, sub: 'Setu field team' },
  ]

  return (
    <Sheet open={open} onClose={onClose} title="Continue As">
      <p className="mb-4 text-muted">This is a demo. There is no login. Pick who you want to be.</p>
      <div className="flex flex-col gap-2.5">
        {options.map(({ role, icon: Icon, sub }) => (
          <button
            key={role}
            type="button"
            onClick={() => go(role)}
            aria-current={state.role === role ? 'true' : undefined}
            className={cn(
              'flex min-h-16 items-center gap-3 rounded-card border bg-white p-3 text-left transition-colors hover:border-teal',
              state.role === role ? 'border-teal ring-2 ring-teal/20' : 'border-line',
            )}
          >
            <span className="grid size-11 place-items-center rounded-avatar bg-teal-mist text-teal">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">{roleName[role]}</span>
              <span className="block text-detail text-muted">{sub}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label htmlFor="which-business" className="text-button font-semibold">
          Which business?
        </label>
        <p className="mb-2 text-detail text-muted">Used when you continue as Business. Pick a business Setu has not visited yet to see the waiting state.</p>
        <select
          id="which-business"
          value={state.currentSmeId}
          onChange={(e) => setCurrentSme(e.target.value)}
          className="min-h-12 w-full rounded-button border border-line bg-white px-3 text-body"
        >
          {state.smes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.verified ? '(visited)' : '(waiting for visit)'}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 border-t border-line/70 pt-4">
        <Button
          variant="ghost"
          size="sm"
          icon={<RotateCcw className="size-4" aria-hidden="true" />}
          onClick={async () => {
            await resetDemo()
            show({ message: 'Demo data is back to the start.' })
            onClose()
          }}
        >
          Reset demo data
        </Button>
      </div>
    </Sheet>
  )
}
