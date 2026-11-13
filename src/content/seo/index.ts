import type { Lang } from '../../lib/routes'
import type { SeoContent } from './types'
import { en } from './en'

export type { Faq, PageCopy, SeoContent } from './types'

/** English ships with the app; other languages load on demand (own chunk). */
const loaders: Record<Exclude<Lang, 'en'>, () => Promise<SeoContent>> = {
  tr: () => import('./tr').then((m) => m.tr),
  de: () => import('./de').then((m) => m.de),
  fr: () => import('./fr').then((m) => m.fr),
  es: () => import('./es').then((m) => m.es),
}

const loaded: Partial<Record<Lang, SeoContent>> = { en }

/** Load a language's page copy (no-op once loaded). */
export const loadSeoContent = async (lang: Lang) => {
  if (lang === 'en' || loaded[lang]) return
  loaded[lang] = await loaders[lang]()
}

/** Page copy in a language; English until that language has loaded. */
export const seoFor = (lang: Lang): SeoContent => loaded[lang] ?? en
