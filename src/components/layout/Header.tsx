import { useTranslation } from 'react-i18next'
import { HeaderActions } from './HeaderActions'
import { useActiveTab } from '../../hooks/activeTab'

/** When the Instagram script was last fixed; shown on the "working again" badge. */
const INSTAGRAM_FIX_DATE = Date.UTC(2026, 9, 20)
/** The badge is news, not a fixture: it hides itself after this many days. */
const INSTAGRAM_FIX_BADGE_DAYS = 45

const showInstagramFixBadge = () =>
  Date.now() - INSTAGRAM_FIX_DATE <
  INSTAGRAM_FIX_BADGE_DAYS * 24 * 60 * 60 * 1000

/** A tilted, gently wiggling sticker on the title announcing the Instagram fix. */
const InstagramFixBadge = () => {
  const { t, i18n } = useTranslation()
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(INSTAGRAM_FIX_DATE)

  return (
    // Phones: its own centred row above the title (no room to overlap).
    // sm and up: a sticker tilted over the title's top-left corner.
    <span className="pointer-events-none mb-3 flex -rotate-3 justify-center select-none sm:absolute sm:-top-12 sm:-left-20 sm:mb-0 sm:-rotate-8">
      <span className="border-bg from-brand-400 shadow-brand-500/30 motion-safe:animate-wiggle flex flex-col items-start rounded-lg border-2 bg-linear-to-r to-teal-500 px-2.5 py-1 text-left shadow-lg sm:px-3 sm:py-1.5">
        <span className="font-mono text-[10px] tracking-wider text-neutral-950/70 uppercase sm:text-[11px]">
          {date}
        </span>
        <span className="text-sm leading-tight font-bold text-neutral-950 sm:text-base">
          {t('header.instagramFixed')}
        </span>
      </span>
    </span>
  )
}

export const Header = () => {
  const { t } = useTranslation()
  const { tab } = useActiveTab()
  return (
    <header className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="flex justify-end pt-4">
        <HeaderActions />
      </div>
      <div className="pt-8 pb-10 text-center sm:pt-12">
        <h1 className="relative inline-block text-4xl font-bold tracking-tight sm:text-5xl">
          {tab === 'instagram' && showInstagramFixBadge() && (
            <InstagramFixBadge />
          )}
          {t('header.title')}
        </h1>
        <p className="text-fg-muted mx-auto mt-3 max-w-md text-base sm:text-lg">
          {t('header.subtitle')}
        </p>
      </div>
    </header>
  )
}
