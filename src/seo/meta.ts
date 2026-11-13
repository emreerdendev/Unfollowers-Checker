import { seoFor, type Faq } from '../content/seo'
import { findGuide } from '../content/guides'
import { CHANGELOG } from '../content/changelog'
import { TAB_META } from '../platforms'
import {
  DEFAULT_LANG,
  SITE_URL,
  TAB_ORDER,
  TAB_SLUGS,
  langsFor,
  pathFor,
  type Lang,
  type Page,
} from '../lib/routes'

/** Everything a page needs in its <head>. Pure, so the prerender shares it. */
export interface PageMeta {
  lang: Lang
  title: string
  description: string
  /** The page's main heading, used on its share image. */
  heading: string
  url: string
  /** Absolute URL of the page's 1200×630 share image. */
  image: string
  /** e.g. "noindex" for the 404 page. */
  robots?: string
  alternates: { hreflang: string; href: string }[]
  jsonLd: object[]
}

const SITE_NAME = 'Unfollowers Checker'
const REPO_URL = 'https://github.com/emreerdendev/Unfollowers-Checker'
const DEFAULT_IMAGE = `${SITE_URL}/og-v3.png`

/** The author, defined once per page and referenced by @id elsewhere. */
const PERSON_ID = `${SITE_URL}/#emre-erden`
const PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Emre Erden',
  url: 'https://emreerden.dev',
  sameAs: [
    'https://emreerden.dev',
    'https://github.com/emreerdendev',
    'https://x.com/emreerdendev',
    'https://www.linkedin.com/in/emreerdendev',
  ],
}
const AUTHOR_REF = { '@id': PERSON_ID }

const absolute = (path: string) => `${SITE_URL}${path}`

/**
 * File name (without extension) of a page's share image, generated at build
 * by scripts/og-images.mjs: "/" → "home", "/tr/instagram" → "tr-instagram".
 */
export const ogImageKey = (path: string) =>
  path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')

export interface FaqSection {
  /** Anchor on the FAQ page: "general" or the platform's URL slug. */
  id: string
  title: string
  items: Faq[]
}

/** The FAQ page: general questions first, then one section per platform. */
export const faqSections = (lang: Lang): FaqSection[] => {
  const content = seoFor(lang)
  return [
    {
      id: 'general',
      title: content.faq.general,
      items: [...content.home.faq, ...content.general],
    },
    ...TAB_ORDER.map((tab) => ({
      id: TAB_SLUGS[tab],
      title: TAB_META[tab].label,
      items: content.platforms[tab].faq,
    })),
  ]
}

const faqJsonLd = (faq: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
})

/** Home › … › page, mirroring the visible breadcrumbs. */
const breadcrumbJsonLd = (
  lang: Lang,
  trail: { name: string; page: Page }[],
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { name: SITE_NAME, page: { kind: 'home' } as Page },
    ...trail,
  ].map(({ name, page }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: absolute(pathFor(lang, page) ?? '/'),
  })),
})

export const getPageMeta = (lang: Lang, page: Page): PageMeta => {
  const content = seoFor(lang)

  if (page.kind === 'notFound') {
    return {
      lang,
      title: `${content.notFound.title} — ${SITE_NAME}`,
      description: content.notFound.body,
      heading: content.notFound.title,
      url: absolute('/'),
      image: DEFAULT_IMAGE,
      robots: 'noindex',
      alternates: [],
      jsonLd: [],
    }
  }

  const path = pathFor(lang, page)
  const url = absolute(path)
  const image = absolute(`/og/${ogImageKey(path)}.png`)
  const alternates: PageMeta['alternates'] = langsFor(page).map((l) => ({
    hreflang: l,
    href: absolute(pathFor(l, page)),
  }))
  alternates.push({
    hreflang: 'x-default',
    href: absolute(pathFor(DEFAULT_LANG, page)),
  })
  const base = { lang, url, image, alternates }

  if (page.kind === 'guide') {
    const guide = findGuide(lang, page.slug)
    if (guide) {
      return {
        ...base,
        title: `${guide.title} — ${SITE_NAME}`,
        description: guide.description,
        heading: guide.title,
        jsonLd: [
          PERSON,
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.description,
            datePublished: guide.published,
            dateModified: guide.published,
            inLanguage: lang,
            author: AUTHOR_REF,
            mainEntityOfPage: url,
            image,
          },
          breadcrumbJsonLd(lang, [
            { name: content.guides.heading, page: { kind: 'guides' } },
            { name: guide.title, page },
          ]),
        ],
      }
    }
  }

  if (page.kind === 'faq') {
    return {
      ...base,
      title: content.faq.title,
      description: content.faq.description,
      heading: content.faq.heading,
      jsonLd: [
        faqJsonLd(faqSections(lang).flatMap((section) => section.items)),
        breadcrumbJsonLd(lang, [{ name: content.faq.heading, page }]),
      ],
    }
  }

  if (page.kind === 'guides' || page.kind === 'guide') {
    return {
      ...base,
      title: content.guides.title,
      description: content.guides.description,
      heading: content.guides.heading,
      jsonLd: [
        breadcrumbJsonLd(lang, [
          { name: content.guides.heading, page: { kind: 'guides' } },
        ]),
      ],
    }
  }

  if (page.kind === 'changelog') {
    return {
      ...base,
      title: `Changelog — ${SITE_NAME}`,
      heading: 'Changelog',
      description:
        'What’s new in Unfollowers Checker: new platforms, fixes and improvements, newest first.',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Changelog',
          url,
          dateModified: CHANGELOG[0]?.date,
          author: AUTHOR_REF,
        },
        PERSON,
        breadcrumbJsonLd(lang, [{ name: 'Changelog', page }]),
      ],
    }
  }

  const copy =
    page.kind === 'platform' ? content.platforms[page.tab] : content.home
  return {
    ...base,
    title: copy.title,
    description: copy.description,
    heading: copy.heading,
    jsonLd: [
      PERSON,
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        url,
        description: copy.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any (web browser)',
        inLanguage: lang,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: AUTHOR_REF,
        sameAs: [REPO_URL],
      },
      ...(page.kind === 'platform'
        ? [breadcrumbJsonLd(lang, [{ name: TAB_META[page.tab].label, page }])]
        : []),
    ],
  }
}
