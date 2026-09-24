export type Role = 'student' | 'sme' | 'admin'

export type ApplicationStatus =
  | 'waiting'
  | 'accepted'
  | 'not_selected'
  | 'completed'
  | 'withdrawn'

export type InternshipStatus = 'live' | 'closed'

export interface Student {
  id: string
  firstName: string
  lastName: string
  /** Shown to businesses, e.g. "Priya K." */
  shortName: string
  phone: string
  college: string
  course: string
  year: 'Final year'
  town: string
  skills: string[]
  onboarded: boolean
  collegeVerified: boolean
}

export interface SME {
  id: string
  name: string
  kind: string
  ownerName: string
  ownerFirstName: string
  phone: string
  area: string
  town: string
  staff: string
  sinceYear: number
  about: string
  /** Distance from the demo student's home, in km. */
  distanceKm: number
  verified: boolean
  /** ISO date of the in-person Setu visit. Only set when verified. */
  visitedOn?: string
  /** ISO date the business asked to join. */
  submittedOn: string
  onboarded: boolean
  tone: 'apricot' | 'teal'
}

export interface Internship {
  id: string
  smeId: string
  title: string
  tasks: string[]
  requirements: string[]
  /** Rupees per month. null means unpaid. */
  stipend: number | null
  weeks: number
  hours: string
  where: string
  countsForCredit: boolean
  status: InternshipStatus
  postedAt: string
}

export interface Application {
  id: string
  internshipId: string
  studentId: string
  status: ApplicationStatus
  appliedAt: string
  decidedAt?: string
  /** Set when the business accepts: the internship start date. */
  startsOn?: string
  distanceKm: number
  /** 'setu' when the Setu team added the student on their behalf. */
  source: 'student' | 'setu'
}

export interface AppNotification {
  id: string
  role: Role
  /** studentId or smeId the note belongs to (admin: 'admin') */
  targetId: string
  title: string
  body: string
  at: string
  read: boolean
  href?: string
  /** Application id this note is about, so an undo can remove it. */
  refId?: string
  kind?: 'decision' | 'info'
}
