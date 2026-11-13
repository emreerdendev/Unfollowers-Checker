import type { SelectorTab } from '../platforms'

/**
 * URL scheme. Pure (no browser globals) so the build-time prerender can share it.
 *
 *   /                      home (English)
 *   /instagram             a platform page (English)
 *   /tr, /tr/instagram     the same pages in another language
 *   /faq                   frequently asked questions
 *   /guides, /guides/:slug long-form guides
 *   /changelog             release notes (English only, unprefixed)
 *   anything else          not found (served as 404.html with a 404 status)
 */

export const LANGS = ['en', 'tr', 'de', 'fr', 'es'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'en'

export const SITE_URL = 'https://unfollowerschecker.com'

export const TAB_SLUGS: Record<SelectorTab, string> = {
  github: 'github',
  bluesky: 'bluesky',
  gitlab: 'gitlab',
  mastodon: 'mastodon',
  instagram: 'instagram',
  twitter: 'x-twitter',
}

export const TAB_ORDER: SelectorTab[] = [
  'github',
  'bluesky',
  'gitlab',
  'mastodon',
  'instagram',
  'twitter',
]

export type Page =
  | { kind: 'home' }
  | { kind: 'platform'; tab: SelectorTab }
  | { kind: 'faq' }
  | { kind: 'guides' }
  | { kind: 'guide'; slug: string }
  | { kind: 'changelog' }
  | { kind: 'notFound' }

/** Every page a link can point at (a 404 is only ever reached, not linked). */
export type NavigablePage = Exclude<Page, { kind: 'notFound' }>

export interface Route {
  lang: Lang
  page: Page
  /** Whether the language came from the URL (vs. the unprefixed default). */
  explicitLang: boolean
}

export const isLang = (value: string): value is Lang =>
  (LANGS as readonly string[]).includes(value)

/** Narrow an i18n language code to a URL language (English if unsupported). */
export const toLang = (code: string | undefined): Lang =>
  code && isLang(code) ? code : DEFAULT_LANG

const tabForSlug = (slug: string): SelectorTab | undefined =>
  TAB_ORDER.find((tab) => TAB_SLUGS[tab] === slug)

/** Parse a pathname. Paths that match no page resolve to `notFound`. */
export const parsePath = (
  pathname: string,
  guideSlugs: readonly string[],
): Route => {
  const segments = pathname.split('/').filter(Boolean)
  let lang: Lang = DEFAULT_LANG
  let explicitLang = false
  if (segments[0] && isLang(segments[0])) {
    lang = segments.shift() as Lang
    explicitLang = true
  }

  const [first, second, third] = segments
  const route = (page: Page): Route => ({ lang, page, explicitLang })
  if (third) return route({ kind: 'notFound' })
  if (!first) return route({ kind: 'home' })
  if (first === 'faq' && !second) return route({ kind: 'faq' })
  if (first === 'changelog' && !second && !explicitLang)
    return route({ kind: 'changelog' })
  if (first === 'guides') {
    if (!second) return route({ kind: 'guides' })
    if (guideSlugs.includes(second))
      return route({ kind: 'guide', slug: second })
    return route({ kind: 'notFound' })
  }
  const tab = !second ? tabForSlug(first) : undefined
  return route(tab ? { kind: 'platform', tab } : { kind: 'notFound' })
}

/**
 * Build the canonical path for a page in a language. The changelog has a
 * single English URL; `notFound` has no path of its own (it keeps whatever
 * URL was requested), so it returns null.
 */
export function pathFor(lang: Lang, page: NavigablePage): string
export function pathFor(lang: Lang, page: Page): string | null
export function pathFor(lang: Lang, page: Page): string | null {
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
  switch (page.kind) {
    case 'platform':
      return `${prefix}/${TAB_SLUGS[page.tab]}`
    case 'faq':
      return `${prefix}/faq`
    case 'guides':
      return `${prefix}/guides`
    case 'guide':
      return `${prefix}/guides/${page.slug}`
    case 'changelog':
      return '/changelog'
    case 'notFound':
      return null
    default:
      return prefix || '/'
  }
}

/** Languages a page exists in (for hreflang alternates and the sitemap). */
export const langsFor = (page: Page): readonly Lang[] =>
  page.kind === 'changelog'
    ? [DEFAULT_LANG]
    : page.kind === 'notFound'
      ? []
      : LANGS
