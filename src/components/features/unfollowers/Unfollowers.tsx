import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUnfollowers } from '../../../hooks/useUnfollowers'
import { useAuth } from '../../../hooks/useAuth'
import { useActiveTab } from '../../../hooks/activeTab'
import { PENDING_AUTH_KEY } from '../../../api/client'
import { UnfollowersSearch } from './UnfollowersSearch'
import { UnfollowersResults } from './UnfollowersResults'
import { InstagramGuide } from '../instagram/InstagramGuide'
import { TwitterArchiveGuide } from '../twitter/TwitterArchiveGuide'
import { GitlabSignInGate } from './GitlabSignInGate'
import type { PlatformId } from '../../../types/platform'

export const Unfollowers = () => {
  const { t } = useTranslation()
  const { data: auth, isLoading: authLoading } = useAuth()
  const { tab } = useActiveTab()
  const [inputValue, setInputValue] = useState('')
  const [searchedHandle, setSearchedHandle] = useState('')
  const mutation = useUnfollowers()

  // Instagram (bookmarklet) and X (archive upload) are browser-only tabs with no
  // server provider, so they don't drive the search/results flow below.
  const isInstagram = tab === 'instagram'
  const isTwitter = tab === 'twitter'
  const isStandaloneTab = isInstagram || isTwitter
  const platform = (isStandaloneTab ? 'github' : tab) as PlatformId
  // GitLab's follow lists aren't public, so there's no "search any handle" mode:
  // it's sign-in-only and you can only check your own account.
  const isGitlab = tab === 'gitlab'

  // Each platform has its own session, so the user can be signed in to several
  // at once. "Authed" here means: signed in to the platform of the active tab.
  const activeSession = auth?.[platform] ?? null
  const isAuthed = activeSession !== null
  const ownHandle = activeSession?.handle ?? ''

  const handleSearch = (handle: string) => {
    setInputValue(handle)
    setSearchedHandle(handle)
    mutation.mutate({ platform, handle })
  }

  // Wait for auth once before the first load. The URL already picked the tab
  // (an OAuth return lands on its platform's page — see App), so all that's
  // left of the sign-in hand-off is clearing its marker.
  const tabInitialized = useRef(false)
  useEffect(() => {
    if (tabInitialized.current || authLoading) return
    tabInitialized.current = true
    try {
      localStorage.removeItem(PENDING_AUTH_KEY)
    } catch {
      // storage unavailable — nothing to clear
    }
  }, [authLoading])

  // Reset the search state and (re)load whenever the active tab changes — no
  // matter whether the change came from a click or a programmatic setTab (e.g.
  // returning from an OAuth redirect). This is what keeps the results in sync
  // with the tab: switching to GitLab clears the previous platform's list and
  // auto-loads the signed-in user's own GitLab list. Keyed on `tab` (+ auth, so
  // it fires once auth resolves after a redirect).
  const loadedFor = useRef<string | null>(null)
  useEffect(() => {
    // Wait for auth to resolve AND for the initial tab to be picked before
    // deciding. Otherwise, on a fresh load, we'd either run while isAuthed is
    // still false (marking the tab "handled" and skipping the later auto-load),
    // or load the default tab a moment before the OAuth-return tab is applied.
    if (authLoading || !tabInitialized.current) return

    if (isStandaloneTab) {
      // Browser-only tabs (Instagram / X) don't use the search flow.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue('')
      setSearchedHandle('')
      mutation.reset()
      loadedFor.current = null
      return
    }
    if (loadedFor.current === tab) return
    loadedFor.current = tab

    // Fresh tab → drop the previous platform's results.
    setInputValue('')
    setSearchedHandle('')
    mutation.reset()

    // Signed in to this platform → auto-load the user's own list.
    if (isAuthed && ownHandle) {
      handleSearch(ownHandle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isAuthed, ownHandle, isStandaloneTab, authLoading])

  const isOwnList =
    isAuthed &&
    searchedHandle.toLowerCase() === ownHandle.toLowerCase() &&
    searchedHandle !== ''

  return (
    <div className="flex flex-col gap-8">
      {isInstagram ? (
        <InstagramGuide />
      ) : isTwitter ? (
        <TwitterArchiveGuide />
      ) : isGitlab && !isAuthed ? (
        // GitLab is sign-in-only — show a sign-in gate instead of a search box.
        <GitlabSignInGate />
      ) : (
        <div className="flex flex-col gap-8">
          {/* GitLab can only check your own account, so it has no search box. */}
          {!isGitlab && (
            <div className="flex flex-col gap-2">
              <UnfollowersSearch
                platform={platform}
                value={inputValue}
                onChange={setInputValue}
                onSearch={handleSearch}
                isPending={mutation.isPending}
                isAuthed={isAuthed}
              />
              {/* Inline privacy reassurance for the platforms we query server-side. */}
              <p className="px-1 text-xs text-fg-muted">{t('results.privacyNote')}</p>
            </div>
          )}
          <UnfollowersResults
            platform={platform}
            handle={searchedHandle}
            isPending={mutation.isPending}
            isError={mutation.isError}
            errorMessage={mutation.error?.message}
            data={mutation.data}
            isAuthed={isAuthed}
            isOwnList={isOwnList}
            onBackToMyList={() => handleSearch(ownHandle)}
          />
        </div>
      )}
    </div>
  )
}
