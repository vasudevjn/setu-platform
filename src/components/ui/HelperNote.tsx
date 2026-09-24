import type { ReactNode } from 'react'
import { ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Sparkle } from '../brand/Spot'

/** Reassures at the moment of doubt. teal = trust note, apricot = tip. */
export function HelperNote({ tone = 'teal', icon, children, className }: { tone?: 'teal' | 'apricot'; icon?: ReactNode; children: ReactNode; className?: string }) {
  const teal = tone === 'teal'
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-card px-4 py-3.5 text-button',
        teal ? 'bg-teal-mist text-teal' : 'bg-apricot-mist text-apricot-text',
        className,
      )}
    >
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        {icon ?? (teal ? <ShieldCheck className="size-5" /> : <Sparkle size={22} />)}
      </span>
      <div>{children}</div>
    </div>
  )
}
