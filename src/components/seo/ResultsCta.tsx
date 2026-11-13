import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Share2, Star, X } from 'lucide-react'
import { track } from '../../lib/analytics'
import { SITE_URL, pathFor, toLang } from '../../lib/routes'
import type { SelectorTab } from '../../platforms'

const REPO_URL = 'https://github.com/emreerdendev/Unfollowers-Checker'
const DISMISS_KEY = 'uc_results_cta_dismissed'

const isDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

interface ResultsCtaProps {
  tab: SelectorTab
  /** Proper-noun label shown in the share text, e.g. "Instagram". */
  platformLabel: string
  count: number
}

/**
 * A quiet "found it useful?" card after a result: share (only the count, never
 * names) or star the repo. Dismissing or starring hides it for good.
 */
export const ResultsCta = ({ tab, platformLabel, count }: ResultsCtaProps) => {
  const { t, i18n } = useTranslation()
  const [hidden, setHidden] = useState(isDismissed)
  if (hidden) return null

  const lang = toLang(i18n.resolvedLanguage)
  const url = `${SITE_URL}${pathFor(lang, { kind: 'platform', tab })}`
  const text = t('cta.shareText', { count, platform: platformLabel })

  const hide = () => {
    setHidden(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // storage unavailable — it just shows again next time
    }
  }

  const share = async () => {
    if (navigator.share) {
      track('share_clicked', { platform: tab, method: 'native' })
      try {
        await navigator.share({ text, url })
      } catch {
        // cancelled
      }
      return
    }
    track('share_clicked', { platform: tab, method: 'x' })
    const intent = new URL('https://x.com/intent/post')
    intent.searchParams.set('text', text)
    intent.searchParams.set('url', url)
    window.open(intent.toString(), '_blank', 'noopener,noreferrer')
  }

  const buttonClass =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-400'

  return (
    <div className="rounded-card border-brand-500/30 bg-brand-500/10 relative flex flex-col gap-3 border px-4 py-3 pr-10 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-0.5">
        <p className="text-fg text-sm font-medium">{t('cta.title')}</p>
        <p className="text-fg-muted text-xs">{t('cta.body')}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          onClick={share}
          className={`${buttonClass} border-brand-500/40 bg-brand-500 text-bg hover:bg-brand-600`}
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          {t('cta.share')}
        </button>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track('star_clicked', { source: 'results' })
            hide()
          }}
          className={`${buttonClass} border-border bg-surface text-fg hover:bg-surface-hover`}
        >
          <Star className="h-4 w-4" aria-hidden="true" />
          {t('cta.star')}
        </a>
      </div>
      <button
        onClick={hide}
        aria-label={t('cta.dismiss')}
        className="text-fg-muted hover:text-fg focus-visible:ring-brand-400 absolute top-2 right-2 cursor-pointer rounded-md p-1 transition-colors outline-none focus-visible:ring-2"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
