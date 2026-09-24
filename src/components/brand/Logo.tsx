import logo from '../../assets/logo.png'
import logoReversed from '../../assets/logo-reversed.png'
import mark from '../../assets/logo-mark.png'
import markReversed from '../../assets/logo-mark-reversed.png'

interface LogoProps {
  /** Use "reversed" only on Deep Teal. Never on photos or other colours. */
  variant?: 'primary' | 'reversed'
  /** Below 24px tall, the brand rules say to use the mark on its own. */
  markOnly?: boolean
  /** Height in px. Width follows the original aspect ratio. */
  height?: number
  className?: string
}

/** The supplied Setu logo. Never stretched, recoloured or given effects. */
export function Logo({ variant = 'primary', markOnly = false, height = 32, className }: LogoProps) {
  const useMark = markOnly || height < 24
  const src = useMark ? (variant === 'reversed' ? markReversed : mark) : variant === 'reversed' ? logoReversed : logo
  return <img src={src} alt="Setu" height={height} style={{ height, width: 'auto', maxWidth: 'none', flexShrink: 0 }} className={className} draggable={false} />
}
