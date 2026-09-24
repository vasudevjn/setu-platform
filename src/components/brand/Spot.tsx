import { Check } from 'lucide-react'
import mark from '../../assets/logo-mark.png'

/** Simple spot illustrations in Teal and Apricot, as the style guide asks. */

export function Sparkle({ className = '', size = 18 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 2.5c.6 4.6 2.9 6.9 9.5 9.5-6.6 2.6-8.9 4.9-9.5 9.5-.6-4.6-2.9-6.9-9.5-9.5 6.6-2.6 8.9-4.9 9.5-9.5Z" />
    </svg>
  )
}

export function CheckBurst({ size = 128 }: { size?: number }) {
  const inner = size * 0.68
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-teal-mist" />
      <div
        className="relative grid place-items-center rounded-full bg-teal text-white shadow-lift animate-pop"
        style={{ width: inner, height: inner }}
      >
        <Check strokeWidth={3} style={{ width: inner * 0.5, height: inner * 0.5 }} />
      </div>
      <Sparkle className="absolute -top-1 right-0 text-apricot" size={size * 0.2} />
      <Sparkle className="absolute bottom-2 -left-2 text-apricot" size={size * 0.14} />
    </div>
  )
}

/** College <-> Setu <-> Local business, drawn as a bridge. */
export function BridgeArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 260" className={className} role="img" aria-label="Setu is a bridge between your college and a local business">
      {/* sun */}
      <circle cx="260" cy="150" r="46" fill="#F4A261" />
      {/* river */}
      <rect x="0" y="196" width="520" height="64" rx="0" fill="#E6F2F1" />
      <path d="M0 214c40-8 60 8 100 0s60-8 100 0 60 8 100 0 60-8 100 0 60 8 120 0" stroke="#0F6B6B" strokeOpacity=".25" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M0 236c40-8 60 8 100 0s60-8 100 0 60 8 100 0 60-8 100 0 60 8 120 0" stroke="#0F6B6B" strokeOpacity=".18" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* bridge arch + deck */}
      <path d="M96 196a164 150 0 0 1 328 0" stroke="#0F6B6B" strokeWidth="18" fill="none" strokeLinecap="round" />
      <rect x="40" y="188" width="440" height="16" rx="8" fill="#0F6B6B" />
      {/* college */}
      <g transform="translate(6 96)">
        <path d="M6 92V58l44-30 44 30v34z" fill="#FFFFFF" stroke="#26263A" strokeWidth="4" strokeLinejoin="round" />
        <path d="M6 58l44-30 44 30" fill="#FDF0E4" stroke="#26263A" strokeWidth="4" strokeLinejoin="round" />
        <rect x="40" y="62" width="20" height="30" rx="3" fill="#0F6B6B" />
        <path d="M50 8v20" stroke="#26263A" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 8h16l-5 5 5 5H50" fill="#F4A261" stroke="#26263A" strokeWidth="3" strokeLinejoin="round" />
      </g>
      {/* local shop */}
      <g transform="translate(420 96)">
        <rect x="6" y="46" width="88" height="46" rx="4" fill="#FFFFFF" stroke="#26263A" strokeWidth="4" />
        <path d="M0 46 10 22h80l10 24Z" fill="#F4A261" stroke="#26263A" strokeWidth="4" strokeLinejoin="round" />
        <rect x="18" y="58" width="26" height="34" rx="3" fill="#E6F2F1" stroke="#26263A" strokeWidth="3" />
        <rect x="56" y="58" width="26" height="20" rx="3" fill="#0F6B6B" />
      </g>
    </svg>
  )
}

export function MarkBadge({ size = 40 }: { size?: number }) {
  return <img src={mark} alt="" aria-hidden="true" style={{ height: size, width: 'auto' }} />
}
