import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { titleCase } from '../../lib/format'

export function BackButton({ to, label = 'Go back', onClick }: { to?: string; label?: string; onClick?: () => void }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => (onClick ? onClick() : to ? navigate(to) : window.history.length > 1 ? navigate(-1) : navigate('/'))}
      className="-ml-2 grid size-12 place-items-center rounded-full text-ink hover:bg-stone-mist"
    >
      <ChevronLeft className="size-7" aria-hidden="true" />
    </button>
  )
}

/** Simple page title used inside the shell. */
export function PageTitle({ title, sub, action }: { title: string; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-title font-bold">{titleCase(title)}</h1>
        {sub && <p className="mt-1 text-body text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  )
}
