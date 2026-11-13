/**
 * Build-time prerender entry (run by scripts/prerender.mjs, never shipped to
 * the browser). Renders every public page to static HTML with its <head>
 * metadata so crawlers that don't run JavaScript still see real content.
 */
import { renderToString } from 'react-dom/server'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { en } from '../i18n/locales/en'
import { tr } from '../i18n/locales/tr'
import { de } from '../i18n/locales/de'
import { fr } from '../i18n/locales/fr'
import { es } from '../i18n/locales/es'
import { GUIDE_SLUGS, loadGuides } from '../content/guides'
import { loadSeoContent } from '../content/seo'
import {
  DEFAULT_LANG,
  LANGS,
  TAB_ORDER,
  langsFor,
  pathFor,
  type Lang,
  type NavigablePage,
  type Page,
} from '../lib/routes'
import { getPageMeta, type PageMeta } from './meta'
import { StaticPage } from './StaticPage'

const RESOURCES = { en, tr, de, fr, es }

export interface RenderedPage {
  /** URL path; "/404" for the not-found page (written as 404.html). */
  path: string
  markup: string
  meta: PageMeta
  /** Whether the page belongs in the sitemap. */
  indexable: boolean
}

const ALL_PAGES: NavigablePage[] = [
  { kind: 'home' },
  ...TAB_ORDER.map((tab) => ({ kind: 'platform', tab }) as const),
  { kind: 'faq' },
  { kind: 'guides' },
  ...GUIDE_SLUGS.map((slug) => ({ kind: 'guide', slug }) as const),
  { kind: 'changelog' },
]

const markupFor = (lang: Lang, page: Page) => {
  const i18n = createInstance()
  void i18n.use(initReactI18next).init({
    resources: Object.fromEntries(
      Object.entries(RESOURCES).map(([code, translation]) => [
        code,
        { translation },
      ]),
    ),
    lng: lang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    initAsync: false,
  })

  return renderToString(
    <I18nextProvider i18n={i18n}>
      <StaticPage lang={lang} page={page} />
    </I18nextProvider>,
  )
}

/** Every page in every language it exists in, plus the 404 page. */
export const renderAll = async (): Promise<RenderedPage[]> => {
  // Page copy and guides load per language in the app; here we need them all.
  await Promise.all(
    LANGS.map((lang) => Promise.all([loadSeoContent(lang), loadGuides(lang)])),
  )

  const pages: RenderedPage[] = ALL_PAGES.flatMap((page) =>
    langsFor(page).map((lang) => ({
      path: pathFor(lang, page),
      markup: markupFor(lang, page),
      meta: getPageMeta(lang, page),
      indexable: true,
    })),
  )

  const notFound: Page = { kind: 'notFound' }
  pages.push({
    path: '/404',
    markup: markupFor(DEFAULT_LANG, notFound),
    meta: getPageMeta(DEFAULT_LANG, notFound),
    indexable: false,
  })
  return pages
}
