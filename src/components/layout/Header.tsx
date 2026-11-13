import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, CircleHelp } from 'lucide-react'
import { PageLink } from '../seo/PageLink'
import { toLang } from '../../lib/routes'
import { useHideOnScroll } from '../../hooks/useHideOnScroll'

interface HeaderProps {
  /** Right side of the bar: sign-in/profile, theme, language. */
  actions: ReactNode
  /** Platform tabs, shown in a tab hanging from the bar's bottom line. */
  tabs?: ReactNode
}

const navLinkClass =
  'text-fg-muted hover:text-fg focus-visible:ring-brand-400 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 sm:px-2.5'

/**
 * The one sticky block on every page. A full-width bar — site name · FAQ ·
 * Guides on the left, actions on the right — and, on platform pages, the
 * platform tabs in a tab hanging from its bottom line, which tucks up behind
 * the bar while scrolling down and returns on scrolling up.
 */
export const Header = ({ actions, tabs }: HeaderProps) => {
  const { t, i18n } = useTranslation()
  const lang = toLang(i18n.resolvedLanguage)
  const tabsHidden = useHideOnScroll(Boolean(tabs))

  return (
    <header className="sticky top-0 z-30">
      {/* z-20 over the tab strip below: both blur their backdrop, which makes
          each its own stacking context, so the language menu and sign-in
          popover would otherwise slide under the tabs. */}
      <div className="border-border bg-bg/90 relative z-20 border-b backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-1 px-4 sm:gap-2 sm:px-6">
          <PageLink
            lang={lang}
            page={{ kind: 'home' }}
            className="focus-visible:ring-brand-400 flex min-w-0 shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-2"
          >
            <img
              src="/favicon.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0"
            />
            <span className="sr-only min-[480px]:not-sr-only">
              {t('header.title')}
            </span>
          </PageLink>

          <span
            aria-hidden="true"
            className="text-border hidden px-0.5 min-[480px]:inline"
          >
            •
          </span>

          {/* Pull the first link in by its own padding so brand · FAQ gaps match. */}
          <nav className="mr-auto flex items-center min-[480px]:-ml-2.5">
            <PageLink
              lang={lang}
              page={{ kind: 'faq' }}
              className={navLinkClass}
            >
              <CircleHelp className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{t('nav.faq')}</span>
            </PageLink>
            <PageLink
              lang={lang}
              page={{ kind: 'guides' }}
              className={navLinkClass}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">
                {t('footer.guides')}
              </span>
            </PageLink>
          </nav>

          {actions}
        </div>
      </div>

      {tabs && (
        // The strip around the hanging tab is see-through, so it lets clicks
        // through to the page scrolling underneath.
        // Keyboard focus inside brings it back even while tucked away.
        <div
          className={`pointer-events-none relative z-10 px-4 transition-[translate,opacity] duration-300 ease-out focus-within:translate-y-0 focus-within:opacity-100 motion-reduce:transition-none sm:px-6 ${
            tabsHidden
              ? '-translate-y-full opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="border-border bg-bg/90 pointer-events-auto mx-auto w-fit max-w-full rounded-b-2xl border border-t-0 px-1.5 pt-1.5 pb-1.5 backdrop-blur">
            {tabs}
          </div>
        </div>
      )}
    </header>
  )
}
