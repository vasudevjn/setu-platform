import { cn } from '../../lib/cn'
import { initials } from '../../lib/format'

const tones = {
  apricot: 'bg-apricot-mist text-apricot-text',
  teal: 'bg-teal-mist text-teal',
  leaf: 'bg-leaf-mist text-leaf',
  honey: 'bg-honey-mist text-honey',
  white: 'bg-white text-apricot-text',
} as const

const sizes = { sm: 'size-9 text-tag rounded-full', md: 'size-12 text-body rounded-avatar', lg: 'size-20 text-[1.5rem] rounded-avatar', xs: 'size-8 text-[0.6875rem] rounded-full' }

export function Avatar({ name, tone = 'apricot', size = 'md', className }: { name: string; tone?: keyof typeof tones; size?: keyof typeof sizes; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('inline-grid shrink-0 place-items-center font-bold', tones[tone], sizes[size], className)}>
      {initials(name)}
    </span>
  )
}

const cycle: Array<keyof typeof tones> = ['apricot', 'teal', 'honey', 'leaf']
export function toneFor(key: string): keyof typeof tones {
  let h = 0
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return cycle[h % cycle.length]
}
