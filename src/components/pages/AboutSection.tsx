import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { seoFor } from '../../content/seo'
import { TAB_META } from '../../platforms'
import { TAB_SLUGS, type Lang, type Page } from '../../lib/routes'
import { PageLink } from '../seo/PageLink'
import { Accordion } from '../ui/Accordion'

interface AboutSectionProps {
  lang: Lang
  page: Extract<Page, { kind: 'home' } | { kind: 'platform' }>
}

/**
 * A collapsed "how it works" under the tool, plus one link to the matching
 * FAQ section. The full FAQ and the guides live on their own pages.
 */
export const AboutSection = ({ lang, page }: AboutSectionProps) => {
  const { t } = useTranslation()
  const tab = page.kind === 'platform' ? page.tab : null
  const copy = tab ? seoFor(lang).platforms[tab] : seoFor(lang).home

  return (
    <section className="mt-16 space-y-3">
      {/* Collapsed by default: the tool comes first, the explanation is one
          click away (and still in the page for search engines). */}
      <div className="rounded-card border-border bg-surface overflow-hidden border">
        <Accordion
          headingLevel={2}
          title={
            tab
              ? t('seo.aboutPlatform', { platform: TAB_META[tab].label })
              : t('seo.aboutTitle')
          }
        >
          <div className="space-y-3">
            {copy.intro.map((paragraph) => (
              <p
                key={paragraph}
                className="text-fg-muted text-sm leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Accordion>
      </div>
      <PageLink
        lang={lang}
        page={{ kind: 'faq' }}
        hash={tab ? TAB_SLUGS[tab] : 'general'}
        className="text-brand-400 focus-visible:ring-brand-400 inline-flex items-center gap-1.5 rounded-md px-1 text-sm font-medium underline-offset-2 outline-none hover:underline focus-visible:ring-2"
      >
        {t('seo.faqLink')}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </PageLink>
    </section>
  )
}
