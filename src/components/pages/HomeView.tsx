import { useTranslation } from 'react-i18next'
import { ArrowRight, Check } from 'lucide-react'
import { seoFor } from '../../content/seo'
import { TAB_META } from '../../platforms'
import { TAB_ORDER, type Lang } from '../../lib/routes'
import { PageLink } from '../seo/PageLink'
import { showInstagramFixBadge } from '../../lib/instagramFix'

const TRUST_KEYS = [
  'home.trustFree',
  'home.trustNoPassword',
  'home.trustNothingStored',
  'home.trustOpenSource',
] as const

const STEPS = [
  ['home.step1Title', 'home.step1Body'],
  ['home.step2Title', 'home.step2Body'],
  ['home.step3Title', 'home.step3Body'],
] as const

/**
 * The landing page: what it does in one line, the platforms as cards (each a
 * real link to its own page), and three steps. Pure, so the prerender renders
 * exactly this.
 */
export const HomeView = ({ lang }: { lang: Lang }) => {
  const { t } = useTranslation()
  const fixed = showInstagramFixBadge()

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-4 pt-6 text-center sm:pt-10">
        <h1 className="text-fg max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {seoFor(lang).home.heading}
        </h1>
        <p className="text-fg-muted max-w-lg text-base sm:text-lg">
          {t('home.lead')}
        </p>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {TRUST_KEYS.map((key) => (
            <li
              key={key}
              className="text-fg-muted inline-flex items-center gap-1.5 text-sm"
            >
              <Check className="text-brand-400 h-4 w-4" aria-hidden="true" />
              {t(key)}
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="pick-platform" className="space-y-4">
        <h2
          id="pick-platform"
          className="text-fg text-lg font-semibold tracking-tight"
        >
          {t('home.pickTitle')}
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TAB_ORDER.map((tab) => {
            const { label, icon: Icon } = TAB_META[tab]
            return (
              <li key={tab}>
                <PageLink
                  lang={lang}
                  page={{ kind: 'platform', tab }}
                  className="group rounded-card border-border bg-surface hover:border-brand-500/50 hover:bg-surface-hover focus-visible:ring-brand-400 flex h-full items-center gap-3 border p-4 transition-colors outline-none focus-visible:ring-2"
                >
                  <span className="bg-bg text-fg ring-border flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-fg flex items-center gap-2 font-semibold">
                      {label}
                      {tab === 'instagram' && fixed && (
                        <span className="motion-safe:animate-wiggle rounded-full bg-linear-to-r from-green-400 to-teal-500 px-2 py-0.5 text-[11px] font-bold text-neutral-950">
                          {t('home.fixed')}
                        </span>
                      )}
                    </span>
                    <span className="text-fg-muted mt-0.5 block text-sm leading-snug">
                      {t(`home.method.${tab}`)}
                    </span>
                  </span>
                  <ArrowRight
                    className="text-fg-muted group-hover:text-brand-400 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </PageLink>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="how-it-works" className="space-y-4">
        <h2
          id="how-it-works"
          className="text-fg text-lg font-semibold tracking-tight"
        >
          {t('home.howTitle')}
        </h2>
        <ol className="flex flex-col gap-3">
          {STEPS.map(([title, body], index) => (
            <li
              key={title}
              className="rounded-card border-border flex gap-3 border p-4"
            >
              <span className="bg-brand-500/15 text-brand-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <span>
                <span className="text-fg block font-medium">{t(title)}</span>
                <span className="text-fg-muted mt-1 block text-sm leading-relaxed">
                  {t(body)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
