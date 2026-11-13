import { seoFor } from '../../content/seo'
import { faqSections } from '../../seo/meta'
import { TAB_META } from '../../platforms'
import { TAB_ORDER, TAB_SLUGS, type Lang } from '../../lib/routes'
import { Breadcrumbs } from './Breadcrumbs'
import { Accordion } from '../ui/Accordion'

const iconFor = (id: string) => {
  const tab = TAB_ORDER.find((t) => TAB_SLUGS[t] === id)
  return tab ? TAB_META[tab].icon : null
}

/**
 * Every question in one place: general first, then a section per platform,
 * each with an anchor (/faq#instagram) the platform pages link to.
 */
export const FaqPage = ({ lang }: { lang: Lang }) => {
  const copy = seoFor(lang).faq

  return (
    <div className="flex flex-col gap-10 pt-6">
      <div className="space-y-3">
        <Breadcrumbs lang={lang} items={[{ label: copy.heading }]} />
        <h1 className="text-fg text-2xl font-semibold tracking-tight sm:text-3xl">
          {copy.heading}
        </h1>
        <p className="text-fg-muted leading-relaxed">{copy.intro}</p>
      </div>

      {faqSections(lang).map((section) => {
        const Icon = iconFor(section.id)
        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`faq-${section.id}`}
            className="scroll-mt-20 space-y-3"
          >
            <h2
              id={`faq-${section.id}`}
              className="text-fg flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
              {section.title}
            </h2>
            <div className="divide-border rounded-card border-border bg-surface divide-y overflow-hidden border">
              {section.items.map(({ q, a }) => (
                <Accordion key={q} title={q}>
                  <p className="text-fg-muted text-sm leading-relaxed">{a}</p>
                </Accordion>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
