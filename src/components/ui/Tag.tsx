import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type TagTone = 'money' | 'neutral' | 'credit' | 'trust' | 'leaf' | 'honey' | 'stone' | 'apricot'

const tones: Record<TagTone, string> = {
  money: 'bg-apricot-mist text-apricot-text',
  apricot: 'bg-apricot-mist text-apricot-text',
  neutral: 'bg-stone-mist text-stone',
  credit: 'bg-teal-mist text-teal',
  trust: 'bg-teal-mist text-teal',
  leaf: 'bg-leaf-mist text-leaf',
  honey: 'bg-honey-mist text-honey',
  stone: 'bg-stone-mist text-stone',
}

export function Tag({ tone = 'neutral', icon, children, className }: { tone?: TagTone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-tag font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
