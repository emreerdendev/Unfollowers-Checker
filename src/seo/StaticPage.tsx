import { useTranslation } from 'react-i18next'
import { Header } from '../components/layout/Header'
import { HomeView } from '../components/pages/HomeView'
import { PlatformHero } from '../components/pages/PlatformHero'
import { AboutSection } from '../components/pages/AboutSection'
import { FaqPage } from '../components/pages/FaqPage'
import { ChangelogPage } from '../components/pages/ChangelogPage'
import { NotFoundPage } from '../components/pages/NotFoundPage'
import { GuideArticle, GuidesIndex } from '../components/seo/Guides'
import { PageLink } from '../components/seo/PageLink'
import { TAB_META } from '../platforms'
import { TAB_ORDER, type Lang, type Page } from '../lib/routes'

/**
 * What crawlers (and visitors, until the script loads) see in #root. It is the
 * app's own layout and components; only the interactive parts (sign-in, the
 * tool itself) are left out, and React replaces it all on mount.
 */
export const StaticPage = ({ lang, page }: { lang: Lang; page: Page }) => {
  const { t } = useTranslation()

  // The platform tabs as plain links: crawlable, and the same row the app shows.
  const tabs = page.kind === 'platform' && (
    <nav
      aria-label={t('selector.label')}
      className="flex max-w-full gap-1 overflow-x-auto"
    >
      {TAB_ORDER.map((tab) => {
        const { label, icon: Icon } = TAB_META[tab]
        return (
          <PageLink
            key={tab}
            lang={lang}
            page={{ kind: 'platform', tab }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
              page.tab === tab ? 'bg-brand-500 text-bg' : 'text-fg-muted'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </PageLink>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header actions={<div className="h-9 w-20" />} tabs={tabs} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 sm:px-6">
        {page.kind === 'guide' ? (
          <GuideArticle lang={lang} slug={page.slug} />
        ) : page.kind === 'guides' ? (
          <GuidesIndex lang={lang} />
        ) : page.kind === 'faq' ? (
          <FaqPage lang={lang} />
        ) : page.kind === 'changelog' ? (
          <ChangelogPage lang={lang} />
        ) : page.kind === 'notFound' ? (
          <NotFoundPage lang={lang} />
        ) : page.kind === 'platform' ? (
          <div className="flex flex-col gap-8 pt-16 sm:pt-14">
            <PlatformHero lang={lang} tab={page.tab} />
            {/* Holds the tool's place so the page doesn't jump when it mounts. */}
            <div className="min-h-48" aria-hidden="true" />
            <AboutSection lang={lang} page={page} />
          </div>
        ) : (
          <>
            <HomeView lang={lang} />
            <AboutSection lang={lang} page={page} />
          </>
        )}
      </main>
    </div>
  )
}
