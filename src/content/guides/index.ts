import type { Lang } from '../../lib/routes'
import type { Guide } from './types'
import { en } from './en'

export type { Guide, GuideSection } from './types'

/** Shared across languages, so translations pair up (hreflang). */
export const GUIDE_SLUGS = [
  'see-who-unfollowed-you-on-instagram',
  'are-instagram-unfollower-apps-safe',
  'bluesky-who-doesnt-follow-you-back',
  'download-your-x-twitter-archive',
  'github-who-doesnt-follow-you-back',
  'instagram-action-blocked',
] as const

/** English ships with the app; other languages load on demand (own chunk). */
const loaders: Record<Exclude<Lang, 'en'>, () => Promise<Guide[]>> = {
  tr: () => import('./tr').then((m) => m.tr),
  de: () => import('./de').then((m) => m.de),
  fr: () => import('./fr').then((m) => m.fr),
  es: () => import('./es').then((m) => m.es),
}

const loaded: Partial<Record<Lang, Guide[]>> = { en }

/** Load a language's guides (no-op once loaded). */
export const loadGuides = async (lang: Lang) => {
  if (lang === 'en' || loaded[lang]) return
  loaded[lang] = await loaders[lang]()
}

/** Guides in a language; English until that language has loaded. */
export const guidesFor = (lang: Lang): Guide[] => loaded[lang] ?? en

export const findGuide = (lang: Lang, slug: string): Guide | undefined =>
  guidesFor(lang).find((guide) => guide.slug === slug)
