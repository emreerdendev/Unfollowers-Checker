import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { seoFor } from '../../content/seo'
import { findGuide, guidesFor } from '../../content/guides'
import { TAB_META } from '../../platforms'
import type { Lang } from '../../lib/routes'
import { PageLink } from './PageLink'
import { Breadcrumbs } from '../pages/Breadcrumbs'

const formatDate = (lang: Lang, iso: string) =>
  new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))

/** List of every guide in the language. */
export const GuidesIndex = ({ lang }: { lang: Lang }) => {
  const copy = seoFor(lang).guides
  return (
    <div className="flex flex-col gap-8 pt-6">
      <div className="space-y-3">
        <Breadcrumbs lang={lang} items={[{ label: copy.heading }]} />
        <h1 className="text-fg text-2xl font-semibold tracking-tight sm:text-3xl">
          {copy.heading}
        </h1>
        <p className="text-fg-muted leading-relaxed">{copy.intro}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {guidesFor(lang).map((guide) => (
          <li key={guide.slug}>
            <PageLink
              lang={lang}
              page={{ kind: 'guide', slug: guide.slug }}
              className="rounded-card border-border bg-surface hover:border-brand-500/40 hover:bg-surface-hover focus-visible:ring-brand-400 block border px-4 py-4 transition-colors outline-none focus-visible:ring-2"
            >
              <span className="text-fg block font-medium">{guide.title}</span>
              <span className="text-fg-muted mt-1 block text-sm leading-relaxed">
                {guide.description}
              </span>
            </PageLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** One guide, rendered as an article. */
export const GuideArticle = ({ lang, slug }: { lang: Lang; slug: string }) => {
  const { t } = useTranslation()
  const guide = findGuide(lang, slug)
  if (!guide) return <GuidesIndex lang={lang} />

  const toolLink = (
    <PageLink
      lang={lang}
      page={{ kind: 'platform', tab: guide.platform }}
      className="bg-brand-500 text-bg hover:bg-brand-600 focus-visible:ring-brand-400 focus-visible:ring-offset-bg inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {t('seo.openTool', { platform: TAB_META[guide.platform].label })}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </PageLink>
  )

  return (
    <article className="flex flex-col gap-8 pt-6">
      <div className="space-y-3">
        <Breadcrumbs
          lang={lang}
          items={[
            {
              label: seoFor(lang).guides.heading,
              page: { kind: 'guides' },
            },
            { label: guide.title },
          ]}
        />
        <h1 className="text-fg text-2xl font-semibold tracking-tight sm:text-3xl">
          {guide.title}
        </h1>
        <p className="text-fg-muted text-sm">
          <time dateTime={guide.published}>
            {t('seo.published', { date: formatDate(lang, guide.published) })}
          </time>
        </p>
      </div>

      {guide.sections.map((section, index) => (
        <section key={section.heading ?? index} className="space-y-3">
          {section.heading && (
            <h2 className="text-fg text-lg font-semibold tracking-tight">
              {section.heading}
            </h2>
          )}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-fg-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
          {section.steps && (
            <ol className="text-fg-muted marker:text-brand-400 list-decimal space-y-2 pl-5 leading-relaxed">
              {section.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
          {section.bullets && (
            <ul className="text-fg-muted marker:text-brand-400 list-disc space-y-2 pl-5 leading-relaxed">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <div className="rounded-card border-brand-500/30 bg-brand-500/10 flex flex-col items-start gap-3 border px-4 py-4">
        <p className="text-fg text-sm">{guide.description}</p>
        {toolLink}
      </div>
    </article>
  )
}
