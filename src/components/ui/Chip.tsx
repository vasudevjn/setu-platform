import { Check, Plus } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { titleNode } from '../../lib/format'

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  selected?: boolean
  onClick?: () => void
  /** filter: dark ink when active (All / Paid). pick: teal with a tick, "+" when off. */
  kind?: 'filter' | 'pick'
  big?: boolean
}

export function Chip({ selected, onClick, kind = 'filter', big, className, children, ...rest }: ChipProps) {
  const isPick = kind === 'pick'
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        // Looks like the style guide chip (about 36px). An invisible strip on top and bottom keeps the tap area at 44px.
        'relative inline-flex items-center gap-1.5 rounded-full font-semibold border transition-[background-color,border-color,transform] duration-150 active:scale-[0.97] after:absolute after:-inset-y-1 after:inset-x-0 after:content-[\'\']',
        big ? 'min-h-10 px-4 text-button' : 'min-h-9 px-3.5 text-detail',
        selected
          ? isPick
            ? 'bg-teal text-white border-teal'
            : 'bg-ink text-white border-ink'
          : 'bg-white text-ink border-line hover:border-teal',
        className,
      )}
      {...rest}
    >
      {isPick && (selected ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />)}
      {titleNode(children)}
    </button>
  )
}
