import { useState } from 'react'
import {
  BookOpen,
  CircleHelp,
  Globe,
  ShieldCheck,
  Heart,
  Mail,
  CircleDot,
  History,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrivacyDialog } from './PrivacyDialog'
import { DiscordIcon, GithubIcon } from '../ui/BrandIcons'
import { PageLink } from '../seo/PageLink'
import { PixelLinkStrip, type StripLink } from '../ui/PixelLinkStrip'
import { toLang } from '../../lib/routes'

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

export const Footer = () => {
  const { t, i18n } = useTranslation()
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const lang = toLang(i18n.resolvedLanguage)

  const linkClass =
    'inline-flex items-center gap-2 rounded-md px-2 py-1 outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-brand-400'

  // The cards (Discord, Support, Buy Me a Coffee) are h-7. The plain text
  // links are only as tall as their text (h-4, tight leading): a taller
  // invisible box would add unseen space, so stacked rows would look
  // unevenly spaced.
  const plainLink =
    'hover:text-fg focus-visible:ring-brand-400 inline-flex h-4 items-center gap-1.5 rounded-sm px-2 leading-none transition-colors outline-none focus-visible:ring-2'
  const card =
    'focus-visible:ring-brand-400 inline-flex h-7 items-center gap-1.5 px-2.5 font-medium transition-colors outline-none focus-visible:ring-2'

  // Grouped: contact, community, sponsorship.
  const authorGroups: StripLink[][] = [
    [
      {
        id: 'site',
        href: SITE_URL,
        rel: 'me author',
        className: plainLink,
        children: (
          <>
            <Globe className="h-4 w-4" aria-hidden="true" />
            emreerden.dev
          </>
        ),
      },
      {
        id: 'mail',
        href: `mailto:${CONTACT_EMAIL}`,
        className: plainLink,
        children: (
          <>
            <Mail className="h-4 w-4" aria-hidden="true" />
            {t('footer.contact', { email: CONTACT_EMAIL })}
          </>
        ),
      },
    ],
    [
      {
        id: 'discord',
        href: DISCORD_URL,
        title: `${t('footer.discord')} — ${COMMUNITY_FULL_NAME}`,
        className: `${card} rounded-md bg-[#5865F2] text-white hover:bg-[#4752C4]`,
        children: (
          <>
            <DiscordIcon className="h-4 w-4" />
            {COMMUNITY_NAME}
          </>
        ),
      },
    ],
    [
      {
        id: 'sponsor',
        href: SPONSOR_URL,
        className: `${card} border-brand-500/30 bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 hover:text-brand-300 rounded-full border`,
        children: (
          <>
            <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
            {t('footer.sponsor')}
          </>
        ),
      },
      {
        id: 'coffee',
        href: COFFEE_URL,
        className:
          'focus-visible:ring-brand-400 inline-flex h-7 rounded-md transition-opacity outline-none hover:opacity-90 focus-visible:ring-2',
        children: (
          <img
            src={COFFEE_BUTTON_IMG}
            alt="Buy Me a Coffee"
            width={217}
            height={60}
            loading="lazy"
            decoding="async"
            className="h-7 w-auto"
          />
        ),
      },
    ],
  ]

  const rowClass =
    'flex flex-col items-center justify-center gap-x-2 gap-y-2 sm:flex-row sm:flex-wrap'

  return (
    <footer className="text-fg-muted text-sm">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-card border-border bg-surface/40 flex flex-col items-center gap-4 border px-4 py-6 sm:px-8">
          {/* Privacy, the legal fine print and the project's own links. */}
          <nav
            aria-label={t('footer.siteLinks')}
            className="flex flex-col items-center gap-1.5"
          >
            <div className={rowClass}>
              <button
                onClick={() => setPrivacyOpen(true)}
                className={`cursor-pointer ${linkClass}`}
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>{t('footer.privacy')}</span>
              </button>

              <Dot />
              <PageLink
                lang={lang}
                page={{ kind: 'faq' }}
                className={linkClass}
              >
                <CircleHelp className="h-4 w-4" aria-hidden="true" />
                <span>{t('nav.faq')}</span>
              </PageLink>

              <Dot />
              <PageLink
                lang={lang}
                page={{ kind: 'guides' }}
                className={linkClass}
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>{t('footer.guides')}</span>
              </PageLink>
              <Dot />
              <PageLink
                lang={lang}
                page={{ kind: 'changelog' }}
                className={linkClass}
              >
                <History className="h-4 w-4" aria-hidden="true" />
                <span>{t('nav.changelog')}</span>
              </PageLink>
            </div>

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
                <GithubIcon className="h-4 w-4" />
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
          </nav>
        </div>
      </div>

      {/* The author strip: full width on a faint, twinkling pixel grid. */}
      <PixelLinkStrip
        groups={authorGroups}
        label={t('footer.authorLabel')}
        className="border-border border-y"
        separatorClassName="text-border"
      />

      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  )
}
