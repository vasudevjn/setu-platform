import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { Shell } from './components/navigation/Shell'

const page = (loader: () => Promise<{ default: React.ComponentType }>) => ({
  lazy: async () => ({ Component: (await loader()).default }),
})

const routes: RouteObject[] = [
  { path: '/', ...page(() => import('./pages/Landing/Landing')) },
  { path: '/continue', ...page(() => import('./pages/Continue')) },

  {
    path: '/student',
    element: <Shell role="student" />,
    children: [
      { index: true, ...page(() => import('./pages/student/Home')) },
      { path: 'onboarding', handle: { bare: true }, ...page(() => import('./pages/student/Onboarding')) },
      { path: 'openings/:id', handle: { focus: true }, ...page(() => import('./pages/student/Opening')) },
      { path: 'applied/:id', handle: { focus: true }, ...page(() => import('./pages/student/Applied')) },
      { path: 'applications', ...page(() => import('./pages/student/Applications')) },
      { path: 'applications/:id', handle: { focus: true }, ...page(() => import('./pages/student/ApplicationStatus')) },
      { path: 'profile', ...page(() => import('./pages/student/Profile')) },
      { path: 'notifications', lazy: async () => ({ Component: () => <NotificationsFor role="student" /> }) },
      { path: '*', element: <Navigate to="/student" replace /> },
    ],
  },

  {
    path: '/sme',
    element: <Shell role="sme" />,
    children: [
      { index: true, handle: { ownTop: true }, ...page(() => import('./pages/sme/Home')) },
      { path: 'onboarding', handle: { bare: true }, ...page(() => import('./pages/sme/Onboarding')) },
      { path: 'openings', ...page(() => import('./pages/sme/Openings')) },
      { path: 'openings/:id/applicants', handle: { ownTop: true }, ...page(() => import('./pages/sme/Applicants')) },
      { path: 'post', handle: { focus: true }, ...page(() => import('./pages/sme/PostOpening')) },
      { path: 'help', ...page(() => import('./pages/sme/Help')) },
      { path: 'profile', handle: { focus: true }, ...page(() => import('./pages/sme/Profile')) },
      { path: 'notifications', lazy: async () => ({ Component: () => <NotificationsFor role="sme" /> }) },
      { path: '*', element: <Navigate to="/sme" replace /> },
    ],
  },

  {
    path: '/admin',
    element: <Shell role="admin" wide />,
    children: [
      { index: true, ...page(() => import('./pages/admin/Dashboard')) },
      { path: 'smes', ...page(() => import('./pages/admin/Smes')) },
      { path: 'openings', ...page(() => import('./pages/admin/Openings')) },
      { path: 'students', ...page(() => import('./pages/admin/Students')) },
      { path: 'applications', ...page(() => import('./pages/admin/Applications')) },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },

  { path: '*', ...page(() => import('./pages/NotFound')) },
]

const Notifications = lazy(() => import('./pages/Notifications'))
function NotificationsFor({ role }: { role: 'student' | 'sme' }) {
  return (
    <Suspense fallback={null}>
      <Notifications role={role} />
    </Suspense>
  )
}

export const router = createBrowserRouter(routes)
