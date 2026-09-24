import type { ReactNode } from 'react'
import { Sparkle } from '../brand/Spot'
import { titleCase } from '../../lib/format'

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card bg-white px-6 py-10 text-center shadow-card">
      <span className="grid size-14 place-items-center rounded-full bg-apricot-mist text-apricot">
        <Sparkle size={26} />
      </span>
      <h2 className="text-heading font-semibold">{titleCase(title)}</h2>
      <p className="max-w-sm text-muted">{body}</p>
      {action && <div className="mt-2 w-full max-w-xs">{action}</div>}
    </div>
  )
}
