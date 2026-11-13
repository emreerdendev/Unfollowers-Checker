import { createContext, useContext } from 'react'
import type { NavigablePage, Route } from '../lib/routes'

export interface NavigateOptions {
  /** Replace the history entry instead of pushing (programmatic moves). */
  replace?: boolean
}

interface RouteValue {
  route: Route
  navigate: (page: NavigablePage, options?: NavigateOptions) => void
}

/** The current URL route. Absent during the build-time prerender. */
export const RouteContext = createContext<RouteValue | null>(null)

/** Null outside the app shell (e.g. the prerender), where links stay plain. */
export const useOptionalRoute = () => useContext(RouteContext)

export const useRoute = (): RouteValue => {
  const ctx = useContext(RouteContext)
  if (!ctx) throw new Error('useRoute must be used within RouteContext')
  return ctx
}
