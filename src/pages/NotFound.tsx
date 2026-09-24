import { Link } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { LinkButton } from '../components/ui/Button'

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Link to="/" aria-label="Setu home"><Logo height={38} /></Link>
      <h1 className="text-title font-bold">We Couldn't Find That Page</h1>
      <p className="text-muted">The link may be old. Let's get you back to something useful.</p>
      <LinkButton to="/" size="lg" full>Go to Setu home</LinkButton>
      <LinkButton to="/continue" variant="secondary" full>Continue as student, business or admin</LinkButton>
    </main>
  )
}
