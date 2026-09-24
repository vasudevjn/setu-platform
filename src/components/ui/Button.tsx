import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'apricot'
type Size = 'md' | 'lg' | 'sm'

const base =
  'relative inline-flex items-center justify-center gap-2 font-semibold text-button rounded-button select-none whitespace-nowrap transition-[transform,background-color,box-shadow,border-color] duration-150 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary: 'bg-teal text-white hover:bg-teal-hover shadow-card',
  secondary: 'bg-white text-ink border border-line hover:border-teal hover:bg-cream',
  soft: 'bg-teal-mist text-teal hover:brightness-95',
  ghost: 'text-teal hover:bg-teal-mist',
  apricot: 'bg-apricot text-ink hover:brightness-95',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-11 px-4',
  md: 'min-h-12 px-5',
  lg: 'min-h-14 px-6 text-[1.0625rem]',
}

interface Common {
  variant?: Variant
  size?: Size
  full?: boolean
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
}

type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement>
type LinkButtonProps = Common & Omit<LinkProps, 'className'> & { className?: string }

function classes({ variant = 'primary', size = 'md', full, className }: Common & { className?: string }) {
  return cn(base, variants[variant], sizes[size], full && 'w-full', className)
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, full, loading, icon, iconRight, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes({ variant, size, full, className })}
      {...rest}
    >
      {loading ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
})

export function LinkButton({ variant, size, full, icon, iconRight, className, children, loading: _l, ...rest }: LinkButtonProps) {
  return (
    <Link className={classes({ variant, size, full, className })} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  )
}

export function ExternalButton({
  variant,
  size,
  full,
  icon,
  className,
  children,
  ...rest
}: Common & { className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes({ variant, size, full, className })} {...rest}>
      {icon}
      {children}
    </a>
  )
}
