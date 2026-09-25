import type { ReactNode } from 'react'
import type { ApplicationStatus, Internship, SME } from '../types'
import { getLang, getLocale, t } from './i18n'

export function money(stipend: number | null) {
  return stipend == null ? t('Unpaid') : t('₹{amount} / month', { amount: stipend.toLocaleString('en-IN') })
}

export function shortDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  // A plain date ("2025-10-11") has no time, so read it as is. A timestamp shows in Indian time.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso)
  return d.toLocaleDateString(getLang() === 'en' ? 'en-GB' : getLocale(), { day: 'numeric', month: 'short', timeZone: dateOnly ? 'UTC' : 'Asia/Kolkata' })
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
  if (n <= 0) return t('Today')
  if (n === 1) return t('Yesterday')
  return t('{n} days ago', { n })
}

export function startsIn(iso?: string) {
  if (!iso) return t('Starts soon')
  const n = -daysBetween(iso)
  if (n <= 0) return t('Starts today')
  if (n === 1) return t('Starts tomorrow')
  return t('Starts in {n} days', { n })
}

export function greeting(now = new Date()) {
  const h = now.getHours()
  if (h < 12) return t('Good morning')
  if (h < 17) return t('Good afternoon')
  return t('Good evening')
}

export function initials(name: string) {
  const parts = name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/** "1 week" / "8 weeks". Pass English words. Each form is a translation key: "{n} week", "{n} weeks". */
export function plural(n: number, one: string, many = `${one}s`) {
  return t(`{n} ${n === 1 ? one : many}`, { n })
}

/** Read at the moment of use, so it follows the chosen language. */
export const statusLabel: Record<ApplicationStatus, string> = {
  get waiting() {
    return t('Waiting to hear')
  },
  get accepted() {
    return t('Accepted')
  },
  get not_selected() {
    return t('Not this time')
  },
  get completed() {
    return t('Completed')
  },
  get withdrawn() {
    return t('Withdrawn')
  },
}

export function visitedText(sme: SME) {
  return sme.verified && sme.visitedOn ? t('Visited by Setu · {date}', { date: shortDate(sme.visitedOn) }) : ''
}

/** Turns "what will the intern help with" picks into a sensible opening title. */
export function titleFromTasks(tasks: string[]) {
  const map: Record<string, string> = {
    Billing: 'Billing Assistant',
    'GST entries': 'Accounts Intern',
    'Stock records': 'Inventory Assistant',
    'Customer calls': 'Customer Support Intern',
    'Social media': 'Social Media Intern',
    'Google listing': 'Digital Transformation Intern',
    'WhatsApp Business': 'Digital Transformation Intern',
    'Digital payments': 'Digital Transformation Intern',
    Delivery: 'Delivery Assistant',
  }
  const first = tasks.find((task) => map[task])
  return first ? map[first] : 'Intern'
}

export function isNewThisWeek(i: Internship) {
  return daysBetween(i.postedAt) <= 7
}

const SMALL_WORDS = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'at', 'by', 'in', 'of', 'on', 'to', 'as', 'per', 'vs'])

/**
 * Title Case for headings, buttons and navigation ("My Applications").
 * Small words stay lower case unless first or last. Words already in capitals (GST, AICTE) are left alone.
 */
export function titleCase(text: string) {
  if (getLang() !== 'en') return text // Hindi and Marathi have no capital letters
  const parts = text.split(/(\s+)/)
  const wordIdx = parts.map((p, i) => (p.trim() && /[A-Za-z]/.test(p) ? i : -1)).filter((i) => i >= 0)
  const first = wordIdx[0]
  const last = wordIdx[wordIdx.length - 1]
  return parts
    .map((part, i) => {
      if (!part.trim()) return part
      const bare = part.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '').toLowerCase()
      if (i !== first && i !== last && SMALL_WORDS.has(bare)) return part
      // Capitalise the first letter, but only when the word starts with a letter (leave "₹4,000/month" and "10–5" alone).
      return part.replace(/^([("'“]*)([a-z])/, (_m, lead: string, ch: string) => lead + ch.toUpperCase())
    })
    .join('')
}

/** Title-cases plain text children (used by buttons and chips). Anything else passes through. */
export function titleNode(node: ReactNode): ReactNode {
  if (typeof node === 'string') return titleCase(node)
  if (Array.isArray(node)) return node.map((n) => (typeof n === 'string' ? titleCase(n) : n))
  return node
}
