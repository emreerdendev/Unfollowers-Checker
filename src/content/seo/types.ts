import type { SelectorTab } from '../../platforms'

export interface Faq {
  q: string
  a: string
}

/** Search-facing copy for one page: <head> metadata plus the on-page section. */
export interface PageCopy {
  /** <title>; keep it under ~60 characters. */
  title: string
  /** <meta name="description">; keep it under ~155 characters. */
  description: string
  heading: string
  /** Answer-first paragraphs shown under the tool. */
  intro: string[]
  faq: Faq[]
}

export interface SeoContent {
  home: PageCopy
  platforms: Record<SelectorTab, PageCopy>
  /** Questions that apply everywhere; the FAQ page's "General" section. */
  general: Faq[]
  guides: { title: string; description: string; heading: string; intro: string }
  faq: {
    title: string
    description: string
    heading: string
    intro: string
    general: string
  }
  notFound: { title: string; body: string; backHome: string }
}
