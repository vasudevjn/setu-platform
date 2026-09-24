import { tm } from './i18n'

/**
 * Notifications are saved in English, with the names filled in. This list holds the English
 * templates they are built from, so screens can show them in the reader's language.
 */
export const NOTES = {
  applied: '{student} applied for {opening}',
  appliedBody: 'Have a look at their profile when you have a minute.',
  accepted: '{owner} accepted your application',
  acceptedBody: '{opening} at {business}. Open to see when you start.',
  notSelected: 'Not this time for {opening}',
  notSelectedBody: 'Thank you for applying. There are other openings near you.',
  completed: 'Internship completed at {business}',
  completedBody: 'Well done. We will send your college a completion letter.',
  verified: 'Setu has visited you',
  verifiedBody: 'Your business is verified. Your openings are now live for students.',
  newOpening: 'New opening from {business}',
  newOpeningLive: '{opening} is live.',
  newOpeningWaiting: '{opening} is waiting for a Setu visit.',
} as const

export const NOTE_TEMPLATES: readonly string[] = Object.values(NOTES)

/** Show a saved notification title or body in the current language. */
export const showNote = (text: string) => tm(text, NOTE_TEMPLATES)
