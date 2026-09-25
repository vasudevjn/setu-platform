/**
 * Talks to Supabase. Turns rows into the app's types and back,
 * and works out which rows changed after each action.
 */
import type {
  AppNotification,
  Application,
  Internship,
  SME,
  Student,
} from '../types'
import { getClient } from './supabase'

export interface Domain {
  students: Student[]
  smes: SME[]
  internships: Internship[]
  applications: Application[]
  notifications: AppNotification[]
}

type Table = keyof Domain
type Row = Record<string, unknown>

const TABLES: Table[] = ['students', 'smes', 'internships', 'applications', 'notifications']

const iso = (v: unknown) => new Date(v as string).toISOString()
const isoOrUndef = (v: unknown) => (v ? iso(v) : undefined)
const nullable = (v: string | undefined | null) => v ?? null

/* ---- app object -> database row (fixed key order, used for comparing too) ---- */

const toRow = {
  students: (s: Student): Row => ({
    id: s.id,
    first_name: s.firstName,
    last_name: s.lastName,
    short_name: s.shortName,
    phone: s.phone,
    college: s.college,
    course: s.course,
    year: s.year,
    town: s.town,
    skills: s.skills,
    onboarded: s.onboarded,
    college_verified: s.collegeVerified,
    completed_lessons: s.completedLessons,
  }),
  smes: (s: SME): Row => ({
    id: s.id,
    name: s.name,
    kind: s.kind,
    owner_name: s.ownerName,
    owner_first_name: s.ownerFirstName,
    phone: s.phone,
    area: s.area,
    town: s.town,
    staff: s.staff,
    since_year: s.sinceYear,
    about: s.about,
    distance_km: s.distanceKm,
    verified: s.verified,
    visited_on: s.visitedOn ? s.visitedOn.slice(0, 10) : null,
    submitted_on: s.submittedOn.slice(0, 10),
    onboarded: s.onboarded,
    tone: s.tone,
  }),
  internships: (i: Internship): Row => ({
    id: i.id,
    sme_id: i.smeId,
    title: i.title,
    tasks: i.tasks,
    requirements: i.requirements,
    stipend: i.stipend,
    weeks: i.weeks,
    hours: i.hours,
    work_place: i.where,
    counts_for_credit: i.countsForCredit,
    status: i.status,
    posted_at: iso(i.postedAt),
    suggested_course_id: nullable(i.suggestedCourseId),
  }),
  applications: (a: Application): Row => ({
    id: a.id,
    internship_id: a.internshipId,
    student_id: a.studentId,
    status: a.status,
    applied_at: iso(a.appliedAt),
    decided_at: a.decidedAt ? iso(a.decidedAt) : null,
    starts_on: a.startsOn ? iso(a.startsOn) : null,
    distance_km: a.distanceKm,
    source: a.source,
  }),
  notifications: (n: AppNotification): Row => ({
    id: n.id,
    role: n.role,
    target_id: n.targetId,
    title: n.title,
    body: n.body,
    href: nullable(n.href),
    ref_id: nullable(n.refId),
    kind: nullable(n.kind),
    read: n.read,
    created_at: iso(n.at),
  }),
}

/* ---- database row -> app object ---- */

const fromRow = {
  students: (r: Row): Student => ({
    id: r.id as string,
    firstName: r.first_name as string,
    lastName: r.last_name as string,
    shortName: r.short_name as string,
    phone: r.phone as string,
    college: r.college as string,
    course: r.course as string,
    year: r.year as Student['year'],
    town: r.town as string,
    skills: (r.skills as string[]) ?? [],
    onboarded: r.onboarded as boolean,
    collegeVerified: r.college_verified as boolean,
    completedLessons: (r.completed_lessons as string[]) ?? [],
  }),
  smes: (r: Row): SME => ({
    id: r.id as string,
    name: r.name as string,
    kind: r.kind as string,
    ownerName: r.owner_name as string,
    ownerFirstName: r.owner_first_name as string,
    phone: r.phone as string,
    area: r.area as string,
    town: r.town as string,
    staff: r.staff as string,
    sinceYear: r.since_year as number,
    about: r.about as string,
    distanceKm: Number(r.distance_km),
    verified: r.verified as boolean,
    visitedOn: (r.visited_on as string | null) ?? undefined,
    submittedOn: r.submitted_on as string,
    onboarded: r.onboarded as boolean,
    tone: r.tone as SME['tone'],
  }),
  internships: (r: Row): Internship => ({
    id: r.id as string,
    smeId: r.sme_id as string,
    title: r.title as string,
    tasks: (r.tasks as string[]) ?? [],
    requirements: (r.requirements as string[]) ?? [],
    stipend: r.stipend == null ? null : Number(r.stipend),
    weeks: r.weeks as number,
    hours: r.hours as string,
    where: r.work_place as string,
    countsForCredit: r.counts_for_credit as boolean,
    status: r.status as Internship['status'],
    postedAt: iso(r.posted_at),
    suggestedCourseId: (r.suggested_course_id as string | null) ?? undefined,
  }),
  applications: (r: Row): Application => ({
    id: r.id as string,
    internshipId: r.internship_id as string,
    studentId: r.student_id as string,
    status: r.status as Application['status'],
    appliedAt: iso(r.applied_at),
    decidedAt: isoOrUndef(r.decided_at),
    startsOn: isoOrUndef(r.starts_on),
    distanceKm: Number(r.distance_km),
    source: r.source as Application['source'],
  }),
  notifications: (r: Row): AppNotification => ({
    id: r.id as string,
    role: r.role as AppNotification['role'],
    targetId: r.target_id as string,
    title: r.title as string,
    body: r.body as string,
    at: iso(r.created_at),
    read: r.read as boolean,
    href: (r.href as string | null) ?? undefined,
    refId: (r.ref_id as string | null) ?? undefined,
    kind: (r.kind as AppNotification['kind'] | null) ?? undefined,
  }),
}

/* ---- errors ---- */

export class DbError extends Error {
  kind: 'missing' | 'network' | 'other'
  /** What Supabase actually said, to help find the cause. */
  detail: string
  constructor(message: string, kind: DbError['kind'], detail = message) {
    super(message)
    this.kind = kind
    this.detail = detail
  }
}

function fail(error: { message: string; code?: string }): never {
  const code = error.code ?? ''
  const detail = [code, error.message].filter(Boolean).join(': ')
  // PGRST205 / 42P01: the table is not in the database yet, so the migrations have not run.
  if (code === 'PGRST205' || code === '42P01' || /schema cache|does not exist/i.test(error.message)) {
    throw new DbError('The Setu tables are not in this database yet.', 'missing', detail)
  }
  if (/fetch|network|failed to/i.test(error.message)) throw new DbError(error.message, 'network', detail)
  throw new DbError(error.message, 'other', detail)
}

/* ---- read ---- */

const ORDER: Record<Table, { column: string; ascending: boolean }[]> = {
  students: [{ column: 'position', ascending: true }, { column: 'id', ascending: true }],
  smes: [{ column: 'position', ascending: true }, { column: 'id', ascending: true }],
  internships: [{ column: 'posted_at', ascending: false }, { column: 'id', ascending: true }],
  applications: [{ column: 'applied_at', ascending: false }, { column: 'id', ascending: true }],
  notifications: [{ column: 'created_at', ascending: false }, { column: 'id', ascending: true }],
}

export async function fetchAll(): Promise<Domain> {
  const db = await getClient()
  const results = await Promise.all(
    TABLES.map(async (t) => {
      let q = db.from(t).select('*')
      for (const o of ORDER[t]) q = q.order(o.column, { ascending: o.ascending })
      const { data, error } = await q
      if (error) fail(error)
      return (data ?? []) as Row[]
    }),
  )
  const [students, smes, internships, applications, notifications] = results
  return {
    students: students.map(fromRow.students),
    smes: smes.map(fromRow.smes),
    internships: internships.map(fromRow.internships),
    applications: applications.map(fromRow.applications),
    notifications: notifications.map(fromRow.notifications),
  }
}

/** True when both hold the same rows. Order does not matter. */
export function sameDomain(a: Domain, b: Domain) {
  return TABLES.every((t) => {
    const key = (list: { id: string }[]) =>
      JSON.stringify(
        [...list].sort((x, y) => (x.id < y.id ? -1 : 1)).map((r) => (toRow[t] as (x: unknown) => Row)(r)),
      )
    return key(a[t] as { id: string }[]) === key(b[t] as { id: string }[])
  })
}

/* ---- write ---- */

export type Op =
  | { table: Table; kind: 'insert'; rows: Row[] }
  | { table: Table; kind: 'update'; ids: string[]; patch: Row }
  | { table: Table; kind: 'delete'; ids: string[] }

/** Compares two states and lists the database changes needed to get from one to the other. */
export function diff(prev: Domain, next: Domain): Op[] {
  const ops: Op[] = []
  for (const t of TABLES) {
    const map = toRow[t] as (x: unknown) => Row
    const before = new Map((prev[t] as { id: string }[]).map((r) => [r.id, map(r)]))
    const afterIds = new Set<string>()
    const inserts: Row[] = []
    // Rows with the same change are sent together, e.g. "mark all as read".
    const updates = new Map<string, { ids: string[]; patch: Row }>()

    for (const r of next[t] as { id: string }[]) {
      afterIds.add(r.id)
      const row = map(r)
      const old = before.get(r.id)
      if (!old) {
        inserts.push(row)
        continue
      }
      const patch: Row = {}
      for (const k of Object.keys(row)) {
        if (k !== 'id' && JSON.stringify(row[k]) !== JSON.stringify(old[k])) patch[k] = row[k]
      }
      if (Object.keys(patch).length) {
        const sig = JSON.stringify(patch)
        const g = updates.get(sig)
        if (g) g.ids.push(r.id)
        else updates.set(sig, { ids: [r.id], patch })
      }
    }
    if (inserts.length) ops.push({ table: t, kind: 'insert', rows: inserts })
    for (const u of updates.values()) ops.push({ table: t, kind: 'update', ids: u.ids, patch: u.patch })
    // Only notifications are ever removed (an undo takes back a decision message).
    if (t === 'notifications') {
      const gone = [...before.keys()].filter((id) => !afterIds.has(id))
      if (gone.length) ops.push({ table: t, kind: 'delete', ids: gone })
    }
  }
  return ops
}

export async function push(ops: Op[]) {
  const db = await getClient()
  for (const op of ops) {
    const q = db.from(op.table)
    const { error } =
      op.kind === 'insert'
        ? await q.insert(op.rows)
        : op.kind === 'update'
          ? await q.update(op.patch).in('id', op.ids)
          : await q.delete().in('id', op.ids)
    if (error) fail(error)
  }
}

/** Puts the demo data back to the start (SQL function reset_demo_data). */
export async function resetRemote() {
  const db = await getClient()
  const { error } = await db.rpc('reset_demo_data')
  if (error) fail(error)
}

/** Calls onChange when any row changes, in this browser or another. Returns a stop function. */
export async function subscribe(onChange: () => void): Promise<() => void> {
  const db = await getClient()
  const channel = db
    .channel('setu-changes')
    .on('postgres_changes', { event: '*', schema: 'public' }, onChange)
    .subscribe()
  return () => {
    void db.removeChannel(channel)
  }
}
