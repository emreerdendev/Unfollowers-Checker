import { useTranslation } from 'react-i18next'
import { INSTAGRAM_FIX_DATE } from '../../lib/instagramFix'

/**
 * A tilted, gently wiggling sticker announcing the Instagram fix. The caller
 * places and tilts it via `className`.
 */
export const InstagramFixBadge = ({
  className = '',
}: {
  className?: string
}) => {
  const { t, i18n } = useTranslation()
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(INSTAGRAM_FIX_DATE)

  return (
    <span className={`pointer-events-none z-10 flex select-none ${className}`}>
      <span className="border-bg from-green-400 shadow-brand-500/30 motion-safe:animate-wiggle flex flex-col items-start rounded-lg border-2 bg-linear-to-r to-teal-500 px-2.5 py-1 text-left shadow-lg sm:px-3 sm:py-1.5">
        <span className="font-mono text-[9px] tracking-wider whitespace-nowrap text-neutral-950/70 uppercase sm:text-[11px]">
          {date}
        </span>
        <span className="text-xs leading-tight font-bold whitespace-nowrap text-neutral-950 sm:text-base">
          {t('header.instagramFixed')}
        </span>
      </span>
    </span>
  )
}
