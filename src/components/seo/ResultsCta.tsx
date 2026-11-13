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
 * A quiet "found it useful?" line after a result: share (only the count, never
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
    'focus-visible:ring-brand-400 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors outline-none focus-visible:ring-2'

  // One quiet line under the results, so it never competes with the list.
  return (
    <div className="text-fg-muted flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
      <span>{t('cta.title')}</span>
      <button
        onClick={share}
        className={`${buttonClass} text-brand-400 hover:text-brand-300`}
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
        className={`${buttonClass} hover:text-fg`}
      >
        <Star className="h-4 w-4" aria-hidden="true" />
        {t('cta.star')}
      </a>
      <button
        onClick={hide}
        aria-label={t('cta.dismiss')}
        className="hover:text-fg focus-visible:ring-brand-400 cursor-pointer rounded-md p-1 transition-colors outline-none focus-visible:ring-2"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
