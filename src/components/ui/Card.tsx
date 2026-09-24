import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-white rounded-card shadow-card', className)} {...rest} />
}

/** Section divider label: ALL CAPS with letter spacing. */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('label-caps', className)}>{children}</p>
}
