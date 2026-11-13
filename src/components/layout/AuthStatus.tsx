import { useRef, useState } from 'react'
import { ChevronDown, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { useActiveTab } from '../../hooks/activeTab'
import { useDismiss } from '../../hooks/useDismiss'
import { logout } from '../../api/client'
import { PLATFORMS } from '../../platforms'
import type { PlatformId } from '../../types/platform'

/**
 * Account menu for the active tab's platform, styled like the language menu:
 * a platform-icon button (plus "@handle" on wider screens) that opens a menu
 * with who you're signed in as and "Sign out". Only rendered (by
 * HeaderActions) when there's a session for that platform.
 */
export const AuthStatus = () => {
  const { t } = useTranslation()
  const { data: auth } = useAuth()
  const { tab } = useActiveTab()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, open, () => setOpen(false))

  const platform: PlatformId | null =
    tab === 'github' || tab === 'bluesky' || tab === 'gitlab' || tab === 'mastodon'
      ? tab
      : null
  const session = platform ? auth?.[platform] : null
  if (!platform || !session) return null

  const { icon: Icon, label } = PLATFORMS[platform]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('auth.account', { platform: label })}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`@${session.handle}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-sm font-medium text-fg-muted outline-none transition-colors hover:bg-surface-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="hidden max-w-32 truncate sm:inline">@{session.handle}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg shadow-black/30"
        >
          <div className="border-b border-border px-3 pt-1.5 pb-2">
            <p className="text-xs text-fg-muted">
              {t('auth.signedInTo', { platform: label })}
            </p>
            <p className="truncate text-sm font-medium text-fg">@{session.handle}</p>
          </div>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false)
              void logout(platform)
            }}
            className="mt-1 flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm text-fg-muted outline-none transition-colors hover:bg-surface-hover hover:text-fg focus-visible:bg-surface-hover"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {t('auth.signOut')}
          </button>
        </div>
      )}
    </div>
  )
}
