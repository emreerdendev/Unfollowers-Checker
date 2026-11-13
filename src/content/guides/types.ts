import type { SelectorTab } from '../../platforms'

export interface GuideSection {
  heading?: string
  paragraphs?: string[]
  /** Rendered as an ordered list. */
  steps?: string[]
  /** Rendered as a bullet list. */
  bullets?: string[]
}

export interface Guide {
  /** Shared across languages so the translations pair up (hreflang). */
  slug: string
  title: string
  description: string
  /** ISO date. */
  published: string
  /** The platform page the guide's call to action links to. */
  platform: SelectorTab
  sections: GuideSection[]
}
