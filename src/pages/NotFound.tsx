import { Link } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { LinkButton } from '../components/ui/Button'
import { t } from '../lib/i18n'

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Link to="/" aria-label={t('Setu home')}><Logo height={38} /></Link>
      <h1 className="text-title font-bold">{t("We Couldn't Find That Page")}</h1>
      <p className="text-muted">{t("The link may be old. Let's get you back to something useful.")}</p>
      <LinkButton to="/" size="lg" full>{t('Go to Setu home')}</LinkButton>
      <LinkButton to="/continue" variant="secondary" full>{t('Continue as student, business or admin')}</LinkButton>
    </main>
  )
}
