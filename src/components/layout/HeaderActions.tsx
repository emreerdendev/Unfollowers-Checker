import { useAuth } from '../../hooks/useAuth'
import { useActiveTab } from '../../hooks/activeTab'
import { useRoute } from '../../hooks/route'
import { ThemeToggle } from '../ui/ThemeToggle'
import { LanguageToggle } from '../ui/LanguageToggle'
import { AuthStatus } from './AuthStatus'
import { HeaderSignIn } from './HeaderSignIn'
import { PLATFORMS } from '../../platforms'
import type { PlatformId } from '../../types/platform'

/** Theme + language, pinned to the right of the top bar on every page. */
export const HeaderToggles = () => (
  <div className="flex items-center gap-2">
    <ThemeToggle />
    <LanguageToggle />
  </div>
)

/**
 * Session slot at the right of the top bar, before theme/language: "@handle · Sign out" (AuthStatus)
 * when signed in to the active platform, otherwise its "Sign in" button. The
 * browser-only tabs (X / Instagram) have no server sign-in, so it's empty there.
 */
export const HeaderAuth = () => {
  const { data: auth, isLoading } = useAuth()
  const { tab } = useActiveTab()
  const { route } = useRoute()

  // GitHub / Bluesky / GitLab / Mastodon have a server session + sign-in,
  // shown only on that platform's page.
  const platform: PlatformId | null =
    route.page.kind !== 'platform'
      ? null
      : tab === 'github' ||
          tab === 'bluesky' ||
          tab === 'gitlab' ||
          tab === 'mastodon'
        ? tab
        : null
  if (isLoading || !platform) return null
  if (auth?.[platform]) return <AuthStatus />
  return PLATFORMS[platform].authKind === 'oauth' ? (
    <HeaderSignIn platform={platform} />
  ) : null
}
