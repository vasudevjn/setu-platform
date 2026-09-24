import { MessageCircle, Phone } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Card } from '../ui/Card'
import { ExternalButton } from '../ui/Button'
import { SETU_SUPPORT } from '../../lib/config'

/** A real person, one tap away. Central to how SME owners come to trust Setu. */
export function SupportCard({ businessName, compact }: { businessName?: string; compact?: boolean }) {
  const text = encodeURIComponent(`Hello ${SETU_SUPPORT.name}, I need help${businessName ? ` with ${businessName}` : ''} on Setu.`)
  const tel = `tel:${SETU_SUPPORT.phone}`
  const chat = `https://wa.me/${SETU_SUPPORT.phone.replace('+', '')}?text=${text}`

  // Home screen: name, role and two round buttons on one row, as in the mockup.
  if (compact) {
    const round = 'grid size-11 shrink-0 place-items-center rounded-full bg-teal-mist text-teal hover:brightness-95'
    return (
      <Card className="flex items-center gap-3 p-3.5">
        <Avatar name={SETU_SUPPORT.name} tone="apricot" />
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-snug">{SETU_SUPPORT.name}</p>
          <p className="text-detail text-muted">{SETU_SUPPORT.role}</p>
        </div>
        <a href={tel} className={round} aria-label={`Call ${SETU_SUPPORT.name} from Setu`}>
          <Phone className="size-5" aria-hidden="true" />
        </a>
        <a href={chat} target="_blank" rel="noopener noreferrer" className={round} aria-label={`Chat with ${SETU_SUPPORT.name} from Setu on WhatsApp`}>
          <MessageCircle className="size-5" aria-hidden="true" />
        </a>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <p className="text-detail font-semibold text-muted">Need help?</p>
      <div className="mt-2 flex items-center gap-3">
        <Avatar name={SETU_SUPPORT.name} tone="apricot" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">Talk to {SETU_SUPPORT.name} from Setu</p>
          <p className="text-detail text-muted">{SETU_SUPPORT.role}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <ExternalButton href={tel} variant="soft" icon={<Phone className="size-5" aria-hidden="true" />} aria-label={`Call ${SETU_SUPPORT.name} from Setu`}>
          Call
        </ExternalButton>
        <ExternalButton
          href={chat}
          target="_blank"
          rel="noopener noreferrer"
          variant="soft"
          icon={<MessageCircle className="size-5" aria-hidden="true" />}
          aria-label={`Chat with ${SETU_SUPPORT.name} from Setu on WhatsApp`}
        >
          Chat
        </ExternalButton>
      </div>
    </Card>
  )
}
