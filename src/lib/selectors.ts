import type { Application, Internship, SME, Student } from '../types'

export interface Snapshot {
  students: Student[]
  smes: SME[]
  internships: Internship[]
  applications: Application[]
}

export const findSme = (s: Snapshot, id: string) => s.smes.find((x) => x.id === id)
export const findStudent = (s: Snapshot, id: string) => s.students.find((x) => x.id === id)
export const findInternship = (s: Snapshot, id: string) => s.internships.find((x) => x.id === id)

/** An opening is trusted, and shown to students, only when its business has been visited by Setu. */
export function isVisibleToStudents(s: Snapshot, i: Internship) {
  const sme = findSme(s, i.smeId)
  return !!sme?.verified && i.status === 'live'
}

export function visibleOpenings(s: Snapshot) {
  return s.internships
    .filter((i) => isVisibleToStudents(s, i))
    .sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt))
}

export function applicantsFor(s: Snapshot, internshipId: string) {
  return s.applications
    .filter((a) => a.internshipId === internshipId && a.status !== 'withdrawn')
    .sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt))
}

export function applicationFor(s: Snapshot, internshipId: string, studentId: string) {
  return s.applications.find((a) => a.internshipId === internshipId && a.studentId === studentId)
}

export function studentApplications(s: Snapshot, studentId: string) {
  return s.applications
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt))
}

export function openingsOfSme(s: Snapshot, smeId: string) {
  return s.internships
    .filter((i) => i.smeId === smeId)
    .sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt))
}

export function waitingCountForSme(s: Snapshot, smeId: string) {
  const ids = new Set(s.internships.filter((i) => i.smeId === smeId).map((i) => i.id))
  return s.applications.filter((a) => ids.has(a.internshipId) && a.status === 'waiting').length
}

/** Openings a student could still apply to (visible, and not already applied). */
export function otherOpeningsFor(s: Snapshot, studentId: string, excludeInternshipId?: string) {
  return visibleOpenings(s).filter((i) => {
    if (i.id === excludeInternshipId) return false
    const app = applicationFor(s, i.id, studentId)
    return !app || app.status === 'withdrawn'
  })
}
