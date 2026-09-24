import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useMatches } from 'react-router-dom'
import {
  Bell,
  Briefcase,
  Building2,
  ClipboardList,
  GraduationCap,
  House,
  LayoutDashboard,
  List,
  ListChecks,
  MessageSquare,
  User,
  ChevronsUpDown,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { Role } from '../../types'
import { Logo } from '../brand/Logo'
import { RoleSwitcher, roleName } from './RoleSwitcher'
import { useApp } from '../../hooks/useApp'
import { cn } from '../../lib/cn'
import { Avatar } from '../ui/Avatar'
import { LanguageButton } from './LanguageButton'
import { t } from '../../lib/i18n'

interface NavItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  end?: boolean
  /** Shorter label for very narrow phones */
  short?: string
}

const nav: Record<Role, NavItem[]> = {
  student: [
    { to: '/student', label: 'Home', icon: House, end: true },
    { to: '/student/applications', label: 'My Applications', icon: Briefcase },
    { to: '/student/profile', label: 'Profile', icon: User },
  ],
  sme: [
    { to: '/sme', label: 'Home', icon: House, end: true },
    { to: '/sme/openings', label: 'Openings', icon: List },
    { to: '/sme/help', label: 'Help', icon: MessageSquare },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/smes', label: 'SMEs', icon: Building2 },
    { to: '/admin/openings', label: 'Openings', icon: ListChecks },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/applications', label: 'Applications', short: 'Apps', icon: ClipboardList },
  ],
}

interface RouteHandle {
  /** No top bar or bottom nav on phones (detail, flows). */
  focus?: boolean
  /** Page draws its own top area on phones. */
  ownTop?: boolean
  /** No chrome at all (onboarding). */
  bare?: boolean
}

export function useUnread(role: Role) {
  const { state, currentStudent, currentSme } = useApp()
  const target = role === 'student' ? currentStudent.id : role === 'sme' ? currentSme.id : 'admin'
  return state.notifications.filter((n) => n.role === role && n.targetId === target && !n.read).length
}

export function BellLink({ role, className }: { role: Role; className?: string }) {
  const unread = useUnread(role)
  if (role === 'admin') return null
  return (
    <Link
      to={role === 'student' ? '/student/notifications' : '/sme/notifications'}
      aria-label={unread ? t('Notifications, {n} new', { n: unread }) : t('Notifications')}
      className={cn('relative grid size-12 place-items-center rounded-full hover:bg-stone-mist', className)}
    >
      <Bell className="size-6" aria-hidden="true" />
      {unread > 0 && <span aria-hidden="true" className="absolute right-3 top-3 size-2.5 rounded-full bg-apricot ring-2 ring-cream" />}
    </Link>
  )
}

export function DemoChip({ onClick, className, onDark }: { onClick: () => void; className?: string; onDark?: boolean }) {
  const { state } = useApp()
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('Demo mode. You are {role}. Change role.', { role: state.role ? roleName[state.role] : t('a visitor') })}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-detail font-semibold',
        onDark ? 'border-white/40 text-white hover:bg-white/10' : 'border-line bg-white text-muted hover:border-teal hover:text-teal',
        className,
      )}
    >
      {t('Demo')}<span className="max-[379px]:hidden"> · {state.role ? roleName[state.role] : t('Choose')}</span>
      <ChevronsUpDown className="size-3.5" aria-hidden="true" />
    </button>
  )
}

export function Shell({ role, wide }: { role: Role; wide?: boolean }) {
  const { state, setRole, currentStudent, currentSme } = useApp()
  const location = useLocation()
  const matches = useMatches()
  const handle = (matches[matches.length - 1]?.handle ?? {}) as RouteHandle
  const [switcher, setSwitcher] = useState(false)

  useEffect(() => {
    if (state.role !== role) setRole(role)
  }, [role, state.role, setRole])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  // First-time users go through the short setup
  const onboarded = role === 'student' ? currentStudent.onboarded : role === 'sme' ? currentSme.onboarded : true
  if (!onboarded && !location.pathname.endsWith('/onboarding')) {
    return <Navigate to={`/${role}/onboarding`} replace />
  }

  const items = nav[role]
  const showTop = !handle.focus && !handle.ownTop && !handle.bare
  const showBottom = !handle.focus && !handle.bare
  const userName = role === 'student' ? currentStudent.shortName : role === 'sme' ? currentSme.name : 'Anjali'
  const userSub = role === 'student' ? t('Student') : role === 'sme' ? t('Business') : t('Setu team')

  return (
    <div className="min-h-dvh lg:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-button focus:bg-teal focus:px-4 focus:py-3 focus:text-white"
      >
        {t('Skip to main content')}
      </a>

      {/* Desktop sidebar */}
      {!handle.bare && (
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line/70 bg-white px-4 py-6 lg:flex">
          <Link to="/" aria-label={t('Setu home')} className="mb-8 px-2">
            <Logo height={34} />
          </Link>
          <nav aria-label={t('{role} navigation', { role: roleName[role] })} className="flex flex-col gap-1">
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-12 items-center gap-3 rounded-button px-3 text-button font-semibold transition-colors',
                    isActive ? 'bg-teal-mist text-teal' : 'text-muted hover:bg-stone-mist hover:text-ink',
                  )
                }
              >
                <Icon className="size-5" aria-hidden="true" />
                {t(label)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            {role !== 'admin' && (
              <Link
                to={role === 'student' ? '/student/notifications' : '/sme/notifications'}
                className="flex min-h-12 items-center gap-3 rounded-button px-3 text-button font-semibold text-muted hover:bg-stone-mist hover:text-ink"
              >
                <NotifCount role={role} />
                {t('Notifications')}
              </Link>
            )}
            <div className="flex items-center gap-3 rounded-card bg-cream p-3">
              <Avatar name={userName} size="sm" tone="teal" />
              <div className="min-w-0">
                <p className="truncate text-button font-semibold">{userName}</p>
                <p className="text-detail text-muted">{userSub}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <LanguageButton showName className="justify-center" />
              <DemoChip onClick={() => setSwitcher(true)} className="justify-center" />
            </div>
          </div>
        </aside>
      )}

      <div className="min-w-0 flex-1">
        {showTop && (
          <header className="sticky top-0 z-30 flex items-center justify-between bg-cream/95 px-4 py-2 backdrop-blur lg:hidden">
            <Link to="/" aria-label={t('Setu home')} className="grid min-h-12 shrink-0 place-items-center">
              <Logo height={24} />
            </Link>
            <div className="flex items-center gap-1">
              <LanguageButton />
              <DemoChip onClick={() => setSwitcher(true)} />
              <BellLink role={role} />
            </div>
          </header>
        )}

        <main
          id="main"
          tabIndex={-1}
          className={cn(
            'mx-auto w-full px-4 lg:px-10 lg:pb-16 lg:pt-10',
            wide ? 'max-w-6xl' : 'max-w-4xl',
            showBottom ? 'pb-32' : 'pb-10',
            handle.bare ? 'pt-2 lg:pt-10' : showTop ? 'pt-2' : 'pt-3',
          )}
        >
          <div key={location.pathname} className="animate-rise">
            <Outlet context={{ openSwitcher: () => setSwitcher(true) }} />
          </div>
        </main>

        {showBottom && (
          <nav
            aria-label={t('{role} navigation', { role: roleName[role] })}
            className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line/60 bg-white shadow-nav lg:hidden"
          >
            <ul className="mx-auto flex max-w-lg">
              {items.map(({ to, label, short, icon: Icon, end }) => (
                <li key={to} className="min-w-0 flex-1">
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-16 flex-col items-center justify-center gap-0.5 px-0.5 text-[0.75rem] max-[359px]:text-[0.6875rem] font-semibold',
                        isActive ? 'text-teal' : 'text-muted',
                      )
                    }
                  >
                    <Icon className="size-6" aria-hidden="true" />
                    {short ? (
                      <>
                        <span className="min-[400px]:hidden">{t(short)}</span>
                        <span className="max-[399px]:hidden">{t(label)}</span>
                      </>
                    ) : (
                      <span>{t(label)}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <RoleSwitcher open={switcher} onClose={() => setSwitcher(false)} />
    </div>
  )
}

function NotifCount({ role }: { role: Role }) {
  const n = useUnread(role)
  return (
    <span className="relative">
      <Bell className="size-5" aria-hidden="true" />
      {n > 0 && <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-apricot ring-2 ring-white" />}
      {n > 0 && <span className="sr-only">{t('{n} new', { n })}</span>}
    </span>
  )
}

