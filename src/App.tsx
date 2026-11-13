import { useCallback, useEffect, useMemo, useState } from 'react'
import { Toaster } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Unfollowers } from './components/features/unfollowers/Unfollowers'
import { AboutSection } from './components/pages/AboutSection'
import { FaqPage } from './components/pages/FaqPage'
import { ChangelogPage } from './components/pages/ChangelogPage'
import { NotFoundPage } from './components/pages/NotFoundPage'
import { GuideArticle, GuidesIndex } from './components/seo/Guides'
import { HeaderAuth, HeaderToggles } from './components/layout/HeaderActions'
import { HomeView } from './components/pages/HomeView'
import { PlatformHero } from './components/pages/PlatformHero'
import { PlatformSelector } from './components/features/PlatformSelector'
import { PENDING_AUTH_KEY } from './api/client'
import { loadLanguage } from './i18n'
import { useTheme } from './hooks/useTheme'
import { ActiveTabContext, type SetTabOptions } from './hooks/activeTab'
import { RouteContext, type NavigateOptions } from './hooks/route'
import { GUIDE_SLUGS } from './content/guides'
import { getPageMeta } from './seo/meta'
import {
  parsePath,
  pathFor,
  toLang,
  type NavigablePage,
  type Page,
  type Route,
} from './lib/routes'
import type { SelectorTab } from './platforms'

const readRoute = () => parsePath(window.location.pathname, GUIDE_SLUGS)

const SIGN_IN_PLATFORMS: readonly string[] = [
  'github',
  'bluesky',
  'gitlab',
  'mastodon',
]

/**
 * The route on load. OAuth callbacks redirect to "/", so if a sign-in was
 * just started, land on that platform's page instead of home (the list then
 * loads there; Unfollowers clears the marker).
 */
const readInitialRoute = (): Route => {
  const route = readRoute()
  if (route.page.kind !== 'home') return route
  let pending: string | null = null
  try {
    pending = localStorage.getItem(PENDING_AUTH_KEY)
  } catch {
    // storage unavailable
  }
  if (!pending || !SIGN_IN_PLATFORMS.includes(pending)) return route
  const page: Page = { kind: 'platform', tab: pending as SelectorTab }
  const { search, hash } = window.location
  window.history.replaceState(
    null,
    '',
    pathFor(route.lang, page) + search + hash,
  )
  return { ...route, page }
}

const setMeta = (selector: string, attr: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

function App() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const lang = toLang(i18n.resolvedLanguage)

  const [route, setRoute] = useState<Route>(readInitialRoute)
  // Active platform tab lives here so the header (AuthStatus) and the main view
  // share it — the header reflects the platform you're currently on. A platform
  // URL picks it; on other pages it keeps the last one.
  const [tab, setTabState] = useState<SelectorTab>(() =>
    route.page.kind === 'platform' ? route.page.tab : 'github',
  )

  // The URL is the source of truth for the page; the language is i18n's, and
  // the URL follows it (an unprefixed path is English).
  const navigate = useCallback(
    (page: NavigablePage, options: NavigateOptions = {}) => {
      const path = pathFor(toLang(i18n.resolvedLanguage), page)
      const { pathname, search, hash } = window.location
      if (path !== pathname) {
        const method = options.replace ? 'replaceState' : 'pushState'
        // Keep the query (e.g. ?auth_error=) only when we're replacing in place.
        window.history[method](
          null,
          '',
          options.replace ? path + search + hash : path,
        )
      }
      const next = parsePath(path, GUIDE_SLUGS)
      setRoute(next)
      if (next.page.kind === 'platform') setTabState(next.page.tab)
    },
    [i18n],
  )

  const setTab = useCallback(
    (next: SelectorTab, options?: SetTabOptions) =>
      navigate({ kind: 'platform', tab: next }, options),
    [navigate],
  )

  // Back / forward.
  useEffect(() => {
    const onPop = () => {
      const next = readRoute()
      setRoute(next)
      if (next.page.kind === 'platform') setTabState(next.page.tab)
      if (next.lang !== toLang(i18n.resolvedLanguage))
        void loadLanguage(next.lang)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [i18n])

  const { page } = route
  const current = useMemo<Route>(() => ({ ...route, lang }), [route, lang])

  // Keep the URL's language prefix in step with the chosen language: on load
  // (an unprefixed URL for a visitor who prefers another language) and on
  // every language switch.
  // A 404 keeps the URL that was asked for.
  useEffect(() => {
    const path = pathFor(lang, page)
    const { pathname, search, hash } = window.location
    if (path && path !== pathname)
      window.history.replaceState(null, '', path + search + hash)
  }, [lang, page])

  // <head> for client-side navigations (the prerendered HTML has it on load).
  useEffect(() => {
    const meta = getPageMeta(lang, page)
    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('link[rel="canonical"]', 'href', meta.url)
    setMeta('meta[property="og:url"]', 'content', meta.url)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)
  }, [lang, page])

  return (
    <RouteContext value={{ route: current, navigate }}>
      <ActiveTabContext value={{ tab, setTab }}>
        <div className="flex min-h-screen flex-col">
          <Header
            actions={
              <>
                <HeaderAuth />
                <HeaderToggles />
              </>
            }
            tabs={
              page.kind === 'platform' && (
                <PlatformSelector
                  value={tab}
                  onChange={(next) => setTab(next)}
                />
              )
            }
          />
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
                <PlatformHero lang={lang} tab={tab} />
                <Unfollowers />
                <AboutSection lang={lang} page={{ kind: 'platform', tab }} />
              </div>
            ) : (
              <>
                <HomeView lang={lang} />
                <AboutSection lang={lang} page={page} />
              </>
            )}
          </main>
          <Footer />
          <Toaster richColors theme={theme} position="bottom-right" />
        </div>
      </ActiveTabContext>
    </RouteContext>
  )
}

export default App
