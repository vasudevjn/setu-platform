import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppNotification,
  Application,
  ApplicationStatus,
  Internship,
  Role,
  SME,
  Student,
} from '../types'
import { mockStudents, DEMO_STUDENT_ID } from '../data/mockStudents'
import { mockSMEs, DEMO_SME_ID } from '../data/mockSMEs'
import { mockInternships } from '../data/mockInternships'
import { mockApplications } from '../data/mockApplications'
import { findInternship, findSme, findStudent, type Snapshot } from '../lib/selectors'
import { isRemote } from '../lib/supabase'
import { DbError, diff, fetchAll, push, resetRemote, sameDomain, subscribe, type Domain } from '../lib/db'
import { useToast } from '../components/ui/Toast'

/** Local mode: the whole demo lives here. */
const STORAGE_KEY = 'setu.demo.v1'
/** Remote mode: only this browser's own choices live here (role, who I am, saved openings). */
const UI_KEY = 'setu.ui.v1'

export interface AppState extends Snapshot {
  version: 1
  role: Role | null
  currentStudentId: string
  currentSmeId: string
  saved: string[]
  notifications: AppNotification[]
}

function seed(): AppState {
  return {
    version: 1,
    role: null,
    currentStudentId: DEMO_STUDENT_ID,
    currentSmeId: DEMO_SME_ID,
    students: structuredClone(mockStudents),
    smes: structuredClone(mockSMEs),
    internships: structuredClone(mockInternships),
    applications: structuredClone(mockApplications),
    saved: [],
    notifications: [],
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed?.version === 1) return parsed
    }
  } catch {
    /* storage can be blocked; fall back to seed data */
  }
  return seed()
}

/** Remote mode start: your own choices from this browser, and no shared rows until they load. */
function loadUi(): AppState {
  const base: AppState = { ...seed(), students: [], smes: [], internships: [], applications: [], notifications: [] }
  try {
    const raw = localStorage.getItem(UI_KEY)
    if (raw) {
      const ui = JSON.parse(raw) as Partial<AppState>
      return {
        ...base,
        role: ui.role ?? null,
        currentStudentId: ui.currentStudentId ?? base.currentStudentId,
        currentSmeId: ui.currentSmeId ?? base.currentSmeId,
        saved: ui.saved ?? [],
      }
    }
  } catch {
    /* storage can be blocked */
  }
  return base
}

const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
const nowIso = () => new Date().toISOString()
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString()

type Action =
  | { type: 'replace'; state: AppState }
  | { type: 'setRole'; role: Role | null }
  | { type: 'setSme'; id: string }
  | { type: 'updateStudent'; id: string; patch: Partial<Student> }
  | { type: 'updateSme'; id: string; patch: Partial<SME> }
  | { type: 'setOnboarded'; role: 'student' | 'sme'; value: boolean }
  | { type: 'apply'; id: string; internshipId: string; studentId: string; source: 'student' | 'setu' }
  | { type: 'setStatus'; id: string; status: ApplicationStatus; silent?: boolean }
  | { type: 'verifySme'; id: string; visitedOn: string }
  | { type: 'addInternship'; internship: Internship }
  | { type: 'setInternshipStatus'; id: string; status: Internship['status'] }
  | { type: 'toggleSave'; internshipId: string }
  | { type: 'markRead'; role: Role; targetId: string }
  | { type: 'reset' }

function note(n: Omit<AppNotification, 'id' | 'at' | 'read'>): AppNotification {
  return { ...n, id: uid('note'), at: nowIso(), read: false }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'replace':
      return action.state
    case 'setRole':
      return { ...state, role: action.role }
    case 'setSme':
      return { ...state, currentSmeId: action.id }
    case 'updateStudent':
      return { ...state, students: state.students.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)) }
    case 'updateSme':
      return { ...state, smes: state.smes.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)) }
    case 'setOnboarded':
      return action.role === 'student'
        ? { ...state, students: state.students.map((s) => (s.id === state.currentStudentId ? { ...s, onboarded: action.value } : s)) }
        : { ...state, smes: state.smes.map((s) => (s.id === state.currentSmeId ? { ...s, onboarded: action.value } : s)) }

    case 'apply': {
      const internship = findInternship(state, action.internshipId)
      const sme = internship && findSme(state, internship.smeId)
      const student = findStudent(state, action.studentId)
      if (!internship || !sme || !student) return state
      const existing = state.applications.find(
        (a) => a.internshipId === action.internshipId && a.studentId === action.studentId,
      )
      if (existing && existing.status !== 'withdrawn') return state
      const app: Application = {
        id: action.id,
        internshipId: action.internshipId,
        studentId: action.studentId,
        status: 'waiting',
        appliedAt: nowIso(),
        distanceKm: sme.distanceKm,
        source: action.source,
      }
      const applications = existing
        ? state.applications.map((a) => (a.id === existing.id ? { ...app, id: existing.id } : a))
        : [app, ...state.applications]
      return {
        ...state,
        applications,
        notifications: [
          note({
            role: 'sme',
            targetId: sme.id,
            title: `${student.shortName} applied for ${internship.title}`,
            body: 'Have a look at their profile when you have a minute.',
            href: `/sme/openings/${internship.id}/applicants`,
            refId: app.id,
            kind: 'info',
          }),
          ...state.notifications,
        ],
      }
    }

    case 'setStatus': {
      const app = state.applications.find((a) => a.id === action.id)
      if (!app) return state
      const internship = findInternship(state, app.internshipId)
      const sme = internship && findSme(state, internship.smeId)
      const isDecision = action.status === 'accepted' || action.status === 'not_selected'
      const updated: Application = {
        ...app,
        status: action.status,
        decidedAt: isDecision || action.status === 'completed' ? nowIso() : undefined,
        startsOn: action.status === 'accepted' ? inDays(3) : action.status === 'completed' ? app.startsOn : undefined,
      }
      let notifications = state.notifications
      if (action.status === 'waiting') {
        // Undo: take back the decision message
        notifications = notifications.filter((n) => !(n.refId === app.id && n.kind === 'decision'))
      } else if (!action.silent && internship && sme) {
        const text =
          action.status === 'accepted'
            ? { title: `${sme.ownerFirstName} accepted your application`, body: `${internship.title} at ${sme.name}. ${'Open to see when you start.'}` }
            : action.status === 'not_selected'
              ? { title: `Not this time for ${internship.title}`, body: 'Thank you for applying. There are other openings near you.' }
              : action.status === 'completed'
                ? { title: `Internship completed at ${sme.name}`, body: 'Well done. We will send your college a completion letter.' }
                : null
        if (text) {
          notifications = [
            note({ role: 'student', targetId: app.studentId, ...text, href: `/student/applications/${app.id}`, refId: app.id, kind: 'decision' }),
            ...notifications,
          ]
        }
      }
      return { ...state, applications: state.applications.map((a) => (a.id === app.id ? updated : a)), notifications }
    }

    case 'verifySme': {
      const sme = findSme(state, action.id)
      if (!sme) return state
      const smes = state.smes.map((s) => (s.id === action.id ? { ...s, verified: true, visitedOn: action.visitedOn } : s))
      return {
        ...state,
        smes,
        notifications: [
          note({
            role: 'sme',
            targetId: sme.id,
            title: 'Setu has visited you',
            body: 'Your business is verified. Your openings are now live for students.',
            href: '/sme/openings',
            kind: 'info',
          }),
          ...state.notifications,
        ],
      }
    }

    case 'addInternship': {
      const sme = findSme(state, action.internship.smeId)
      return {
        ...state,
        internships: [action.internship, ...state.internships],
        notifications: sme
          ? [
              note({
                role: 'admin',
                targetId: 'admin',
                title: `New opening from ${sme.name}`,
                body: `${action.internship.title}${sme.verified ? ' is live.' : ' is waiting for a Setu visit.'}`,
                href: '/admin/openings',
                kind: 'info',
              }),
              ...state.notifications,
            ]
          : state.notifications,
      }
    }

    case 'setInternshipStatus':
      return { ...state, internships: state.internships.map((i) => (i.id === action.id ? { ...i, status: action.status } : i)) }

    case 'toggleSave':
      return {
        ...state,
        saved: state.saved.includes(action.internshipId)
          ? state.saved.filter((x) => x !== action.internshipId)
          : [...state.saved, action.internshipId],
      }

    case 'markRead':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.role === action.role && n.targetId === action.targetId ? { ...n, read: true } : n,
        ),
      }

    case 'reset':
      return { ...seed(), role: state.role }
  }
}

export type DataStatus =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; kind: 'empty' | 'missing' | 'network' | 'other'; message: string; detail?: string }

interface AppContextValue {
  state: AppState
  currentStudent: Student
  currentSme: SME
  /** 'remote' = saved in Supabase and shared. 'local' = only in this browser. */
  mode: 'local' | 'remote'
  data: DataStatus
  reload: () => void
  setRole: (role: Role | null) => void
  setCurrentSme: (id: string) => void
  updateStudent: (id: string, patch: Partial<Student>) => void
  updateSme: (id: string, patch: Partial<SME>) => void
  setOnboarded: (role: 'student' | 'sme', value: boolean) => void
  apply: (internshipId: string, studentId: string, source?: 'student' | 'setu') => { id: string; duplicate: boolean }
  setStatus: (id: string, status: ApplicationStatus, opts?: { silent?: boolean }) => void
  verifySme: (id: string, visitedOn: string) => void
  addInternship: (data: Omit<Internship, 'id' | 'postedAt' | 'status'>) => Internship
  setInternshipStatus: (id: string, status: Internship['status']) => void
  toggleSave: (internshipId: string) => void
  markRead: (role: Role, targetId: string) => void
  resetDemo: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

const domainOf = (s: AppState): Domain => ({
  students: s.students,
  smes: s.smes,
  internships: s.internships,
  applications: s.applications,
  notifications: s.notifications,
})

export function AppProvider({ children }: { children: ReactNode }) {
  const { show } = useToast()
  const [state, setState] = useState<AppState>(() => (isRemote ? loadUi() : load()))
  const [data, setData] = useState<DataStatus>(isRemote ? { status: 'loading' } : { status: 'ready' })
  const ref = useRef(state)

  // The reducer makes ids and timestamps, so it runs exactly once per action, here.
  const commit = useCallback((next: AppState) => {
    ref.current = next
    setState(next)
  }, [])

  /* ---- remote mode: write queue ---- */
  const pending = useRef(0) // writes not finished yet
  const epoch = useRef(0) // goes up on every local write, so an older fetch can be thrown away
  const chain = useRef<Promise<void>>(Promise.resolve())
  const refreshTimer = useRef<number | undefined>(undefined)

  const refresh = useCallback(
    async (initial = false) => {
      const started = epoch.current
      try {
        const next = await fetchAll()
        // A write started while we were reading. Its own finish triggers a fresh read.
        if (epoch.current !== started || pending.current > 0) return
        if (initial && next.students.length === 0) {
          setData({ status: 'error', kind: 'empty', message: 'The database has no demo data yet.' })
          return
        }
        if (next.students.length === 0) return
        const cur = ref.current
        if (!sameDomain(domainOf(cur), next)) commit({ ...cur, ...next })
        setData((d) => (d.status === 'ready' ? d : { status: 'ready' }))
      } catch (e) {
        if (initial) {
          const kind = e instanceof DbError ? e.kind : 'other'
          setData({
            status: 'error',
            kind,
            message: e instanceof Error ? e.message : 'Something went wrong.',
            detail: e instanceof DbError ? e.detail : undefined,
          })
        }
        // Later background reads fail quietly and try again on the next tick.
      }
    },
    [commit],
  )

  const refreshSoon = useCallback(
    (ms = 250) => {
      window.clearTimeout(refreshTimer.current)
      refreshTimer.current = window.setTimeout(() => void refresh(), ms)
    },
    [refresh],
  )

  const queueWrite = useCallback(
    (prev: AppState, next: AppState) => {
      const ops = diff(domainOf(prev), domainOf(next))
      if (!ops.length) return
      epoch.current++
      pending.current++
      chain.current = chain.current
        .then(() => push(ops))
        .catch(() => {
          show({ message: 'That change could not be saved. Showing the saved version.' })
        })
        .finally(() => {
          pending.current--
          // Whether it worked or not, show what the database really holds.
          if (pending.current === 0) refreshSoon(0)
        })
    },
    [show, refreshSoon],
  )

  const run = useCallback(
    (action: Action) => {
      const prev = ref.current
      const next = reducer(prev, action)
      if (next === prev) return
      commit(next)
      if (isRemote) queueWrite(prev, next)
    },
    [commit, queueWrite],
  )

  /* ---- remote mode: load, then stay fresh ---- */
  useEffect(() => {
    if (!isRemote) return
    let stopped = false
    let unsubscribe: (() => void) | undefined
    void refresh(true)
    subscribe(() => refreshSoon()).then(
      (stop) => (stopped ? stop() : (unsubscribe = stop)),
      () => {
        /* live updates are optional; the timer below still refreshes */
      },
    )
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshSoon(0)
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    const timer = window.setInterval(onVisible, 20000)
    return () => {
      stopped = true
      unsubscribe?.()
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
      window.clearInterval(timer)
      window.clearTimeout(refreshTimer.current)
    }
  }, [refresh, refreshSoon])

  const reload = useCallback(() => {
    setData({ status: 'loading' })
    void refresh(true)
  }, [refresh])

  /* ---- keep this browser's own choices ---- */
  useEffect(() => {
    try {
      if (isRemote) {
        const { role, currentStudentId, currentSmeId, saved } = state
        localStorage.setItem(UI_KEY, JSON.stringify({ role, currentStudentId, currentSmeId, saved }))
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      }
    } catch {
      /* ignore */
    }
  }, [state])

  // Local mode only: keep two open tabs in sync, handy when demoing student and business side by side.
  // In remote mode the database does this.
  useEffect(() => {
    if (isRemote) return
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      try {
        const next = JSON.parse(e.newValue) as AppState
        if (next?.version === 1 && JSON.stringify(next) !== JSON.stringify(ref.current)) {
          // Each tab keeps its own selected role
          commit({ ...next, role: ref.current.role, currentSmeId: ref.current.currentSmeId })
        }
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [commit])

  const setRole = useCallback((role: Role | null) => run({ type: 'setRole', role }), [run])
  const setCurrentSme = useCallback((id: string) => run({ type: 'setSme', id }), [run])
  const updateStudent = useCallback((id: string, patch: Partial<Student>) => run({ type: 'updateStudent', id, patch }), [run])
  const updateSme = useCallback((id: string, patch: Partial<SME>) => run({ type: 'updateSme', id, patch }), [run])
  const setOnboarded = useCallback((role: 'student' | 'sme', value: boolean) => run({ type: 'setOnboarded', role, value }), [run])

  const apply = useCallback<AppContextValue['apply']>(
    (internshipId, studentId, source = 'student') => {
      const existing = ref.current.applications.find((a) => a.internshipId === internshipId && a.studentId === studentId)
      if (existing && existing.status !== 'withdrawn') return { id: existing.id, duplicate: true }
      const id = existing?.id ?? uid('app')
      run({ type: 'apply', id, internshipId, studentId, source })
      return { id, duplicate: false }
    },
    [run],
  )

  const setStatus = useCallback<AppContextValue['setStatus']>(
    (id, status, opts) => run({ type: 'setStatus', id, status, silent: opts?.silent }),
    [run],
  )
  const verifySme = useCallback((id: string, visitedOn: string) => run({ type: 'verifySme', id, visitedOn }), [run])
  const addInternship = useCallback<AppContextValue['addInternship']>(
    (input) => {
      const internship: Internship = { ...input, id: uid('int'), postedAt: nowIso(), status: 'live' }
      run({ type: 'addInternship', internship })
      return internship
    },
    [run],
  )
  const setInternshipStatus = useCallback((id: string, status: Internship['status']) => run({ type: 'setInternshipStatus', id, status }), [run])
  const toggleSave = useCallback((internshipId: string) => run({ type: 'toggleSave', internshipId }), [run])
  const markRead = useCallback((role: Role, targetId: string) => run({ type: 'markRead', role, targetId }), [run])

  const resetDemo = useCallback(async () => {
    if (!isRemote) {
      run({ type: 'reset' })
      return
    }
    epoch.current++
    pending.current++
    try {
      await chain.current
      await resetRemote()
      const next = await fetchAll()
      commit({ ...ref.current, ...next, saved: [] })
    } catch {
      show({ message: 'Could not reset the demo data. Please try again.' })
    } finally {
      pending.current--
      if (pending.current === 0) refreshSoon(0)
    }
  }, [run, commit, show, refreshSoon])

  const value = useMemo<AppContextValue>(() => {
    const currentStudent = state.students.find((s) => s.id === state.currentStudentId) ?? state.students[0]
    const currentSme = state.smes.find((s) => s.id === state.currentSmeId) ?? state.smes[0]
    return {
      state,
      currentStudent,
      currentSme,
      mode: isRemote ? 'remote' : 'local',
      data,
      reload,
      setRole,
      setCurrentSme,
      updateStudent,
      updateSme,
      setOnboarded,
      apply,
      setStatus,
      verifySme,
      addInternship,
      setInternshipStatus,
      toggleSave,
      markRead,
      resetDemo,
    }
  }, [state, data, reload, setRole, setCurrentSme, updateStudent, updateSme, setOnboarded, apply, setStatus, verifySme, addInternship, setInternshipStatus, toggleSave, markRead, resetDemo])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
