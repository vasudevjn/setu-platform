import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BellRing } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { PageTitle } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { relativeDay } from '../lib/format'
import { cn } from '../lib/cn'
import type { Role } from '../types'

export default function Notifications({ role }: { role: Role }) {
  const { state, currentStudent, currentSme, markRead } = useApp()
  const target = role === 'student' ? currentStudent.id : currentSme.id
  const mine = state.notifications.filter((n) => n.role === role && n.targetId === target)
  const unreadCount = mine.filter((n) => !n.read).length

  // Reading the page marks everything as read, after the first paint so the "new" dots are visible once.
  useEffect(() => {
    if (unreadCount === 0) return
    const t = window.setTimeout(() => markRead(role, target), 1200)
    return () => window.clearTimeout(t)
  }, [unreadCount, role, target, markRead])

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <PageTitle title="Notifications" sub="In a real launch, each of these also goes to you by SMS." />
      {mine.length === 0 ? (
        <EmptyState title="Nothing new yet" body={role === 'student' ? 'When a business replies to an application, you will see it here.' : 'When a student applies to your opening, you will see it here.'} />
      ) : (
        <ul className="flex flex-col gap-3">
          {mine.map((n) => (
            <li key={n.id}>
              <Link to={n.href ?? '#'} className="flex items-start gap-3 rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-lift">
                <span className={cn('mt-0.5 grid size-10 shrink-0 place-items-center rounded-full', n.read ? 'bg-stone-mist text-stone' : 'bg-apricot-mist text-apricot-text')}>
                  <BellRing className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug">
                    {n.title}
                    {!n.read && <span className="ml-2 rounded-full bg-apricot-mist px-2 py-0.5 text-tag text-apricot-text">New</span>}
                  </p>
                  <p className="text-body text-muted">{n.body}</p>
                  <p className="mt-1 text-detail text-muted">{relativeDay(n.at)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
