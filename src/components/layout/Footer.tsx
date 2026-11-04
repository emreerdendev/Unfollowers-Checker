import { useState } from 'react'
import { Globe, ShieldCheck, Heart, Mail, CircleDot } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrivacyDialog } from './PrivacyDialog'
import { DiscordIcon } from '../ui/BrandIcons'

const REPO_URL = 'https://github.com/emreerdendev/Unfollowers-Checker'
const ISSUES_URL = 'https://github.com/emreerdendev/Unfollowers-Checker/issues'
const SITE_URL = 'https://emreerden.dev'
const SPONSOR_URL = 'https://github.com/sponsors/emreerdendev'
const CONTACT_EMAIL = 'emreerden@pm.me'
const DISCORD_URL = 'https://discord.gg/2C8pYMVAw5'
/** PSIBS! — Product, Startup, Indie, Build, Software! */
const COMMUNITY_NAME = 'PSIBS!'
const COMMUNITY_FULL_NAME = 'Product, Startup, Indie, Build, Software'
const COFFEE_URL = 'https://www.buymeacoffee.com/emreerdendev'
const COFFEE_BUTTON_IMG =
  'https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'

/** Separator between items in a row; rows stack on phones, where it's hidden. */
const Dot = () => (
  <span aria-hidden="true" className="text-border hidden sm:inline">
    •
  </span>
)

/** Lucide 1.x dropped the GitHub brand mark, so the logo stays as inline SVG. */
const GithubIcon = () => (
  <svg
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 496 512"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
  </svg>
)

export const Footer = () => {
  const { t } = useTranslation()
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const linkClass =
    'inline-flex items-center gap-2 rounded-md px-2 py-1 outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-brand-400'

  const rowClass =
    'flex flex-col items-center justify-center gap-x-2 gap-y-2 sm:flex-row sm:flex-wrap'

  return (
    <footer className="text-fg-muted mx-auto w-full max-w-3xl px-4 py-8 text-sm sm:px-6">
      <div className="rounded-card border-border bg-surface/40 flex flex-col items-center gap-4 border px-4 py-6 sm:px-8">
        {/* Top — privacy, the legal fine print and the project's own links. */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => setPrivacyOpen(true)}
            className={`cursor-pointer ${linkClass}`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>{t('footer.privacy')}</span>
          </button>

          <p className="text-fg-muted/80 max-w-md text-center text-xs">
            {t('footer.disclaimer')}
          </p>

          <div className={`mt-1 ${rowClass}`}>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-brand-400 ${linkClass}`}
            >
              <GithubIcon />
              <span>{t('footer.viewSource')}</span>
            </a>

            <Dot />

            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <CircleDot className="h-4 w-4" aria-hidden="true" />
              <span>{t('footer.reportIssue')}</span>
            </a>
          </div>
        </div>

        <hr className="border-border w-full max-w-md" />

        {/* Bottom — the author: contact, community, support. */}
        <div className="flex flex-col items-center gap-3">
          <div className={rowClass}>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span>emreerden.dev</span>
            </a>

            <Dot />

            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{t('footer.contact', { email: CONTACT_EMAIL })}</span>
            </a>
          </div>

          {/* Support is the one link we want to stand out — a brand-colored badge,
              next to Buy Me a Coffee's own button. */}
          <div className={rowClass}>
            <a
              href={SPONSOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 hover:text-brand-300 focus-visible:ring-brand-400 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium transition-colors outline-none focus-visible:ring-2"
            >
              <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
              <span>{t('footer.support')}</span>
            </a>

            <Dot />

            <a
              href={COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-visible:ring-brand-400 rounded-lg transition-opacity outline-none hover:opacity-90 focus-visible:ring-2"
            >
              <img
                src={COFFEE_BUTTON_IMG}
                alt="Buy Me a Coffee"
                width={217}
                height={60}
                loading="lazy"
                className="h-8 w-auto"
              />
            </a>
          </div>

          <a
            href={DISCORD_URL}
            title={`${COMMUNITY_NAME} — ${COMMUNITY_FULL_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:ring-brand-400 focus-visible:ring-offset-bg inline-flex items-center gap-3 rounded-lg bg-[#5865F2] px-4 py-2 text-left text-white shadow-sm transition-colors outline-none hover:bg-[#4752C4] focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <DiscordIcon className="h-6 w-6 shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold tracking-wider text-white/75 uppercase">
                {COMMUNITY_NAME}
              </span>
              <span className="font-medium">{t('footer.discord')}</span>
            </span>
          </a>
        </div>
      </div>

      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  )
}
