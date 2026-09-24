import type { ApplicationStatus, Internship, SME } from '../types'

export function money(stipend: number | null) {
  return stipend == null ? 'Unpaid' : `₹${stipend.toLocaleString('en-IN')} / month`
}

export function shortDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  // A plain date ("2025-10-11") has no time, so read it as is. A timestamp shows in Indian time.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: dateOnly ? 'UTC' : 'Asia/Kolkata' })
}

export function daysBetween(fromIso: string, to = new Date()) {
  const a = new Date(fromIso)
  a.setHours(0, 0, 0, 0)
  const b = new Date(to)
  b.setHours(0, 0, 0, 0)
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function relativeDay(iso: string) {
  const n = daysBetween(iso)
  if (n <= 0) return 'Today'
  if (n === 1) return 'Yesterday'
  return `${n} days ago`
}

export function startsIn(iso?: string) {
  if (!iso) return 'Starts soon'
  const n = -daysBetween(iso)
  if (n <= 0) return 'Starts today'
  if (n === 1) return 'Starts tomorrow'
  return `Starts in ${n} days`
}

export function greeting(now = new Date()) {
  const h = now.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function initials(name: string) {
  const parts = name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}

export const statusLabel: Record<ApplicationStatus, string> = {
  waiting: 'Waiting to hear',
  accepted: 'Accepted',
  not_selected: 'Not this time',
  completed: 'Completed',
  withdrawn: 'Withdrawn',
}

export function visitedText(sme: SME) {
  return sme.verified && sme.visitedOn ? `Visited by Setu · ${shortDate(sme.visitedOn)}` : ''
}

/** Turns "what will the intern help with" picks into a sensible opening title. */
export function titleFromTasks(tasks: string[]) {
  const map: Record<string, string> = {
    Billing: 'Billing Assistant',
    'GST entries': 'Accounts Intern',
    'Stock records': 'Inventory Assistant',
    'Customer calls': 'Customer Support Intern',
    'Social media': 'Social Media Intern',
    Delivery: 'Delivery Assistant',
  }
  const first = tasks.find((t) => map[t])
  return first ? map[first] : 'Intern'
}

export function isNewThisWeek(i: Internship) {
  return daysBetween(i.postedAt) <= 7
}
