import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { useActiveTab } from '../../hooks/activeTab'
import { logout } from '../../api/client'
import { PLATFORMS } from '../../platforms'
import type { PlatformId } from '../../types/platform'

/**
 * Session indicator for the active tab's platform: "@handle · Sign out".
 * Only rendered (by HeaderActions) when there's a session for that platform.
 */
export const AuthStatus = () => {
  const { t } = useTranslation()
  const { data: auth } = useAuth()
  const { tab } = useActiveTab()

  const platform: PlatformId | null =
    tab === 'github' || tab === 'bluesky' || tab === 'gitlab' || tab === 'mastodon'
      ? tab
      : null
  const session = platform ? auth?.[platform] : null
  if (!platform || !session) return null

  const Icon = PLATFORMS[platform].icon

  return (
    // Sits beside the platform tabs, so on phones it shrinks to the sign-out
    // icon (the active tab already says which platform).
    <div className="flex shrink-0 items-center gap-2 text-sm">
      <Icon className="hidden h-4 w-4 text-fg-muted sm:block" aria-hidden="true" />
      <span className="hidden max-w-40 truncate font-medium text-fg sm:inline">
        @{session.handle}
      </span>
      <span aria-hidden="true" className="hidden text-border sm:inline">
        ·
      </span>
      <button
        onClick={() => void logout(platform)}
        title={`@${session.handle}`}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-fg-muted outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">{t('auth.signOut')}</span>
      </button>
    </div>
  )
}
