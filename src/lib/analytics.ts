type Gtag = (
  command: 'event',
  name: string,
  params?: Record<string, string | number>,
) => void

/**
 * Send an anonymous GA4 event. Params are counts and platform names only —
 * never handles, follower lists or file contents. No-op when GA is blocked.
 */
export const track = (
  name: string,
  params: Record<string, string | number> = {},
) => {
  try {
    ;(window as unknown as { gtag?: Gtag }).gtag?.('event', name, params)
  } catch {
    // analytics must never break the app
  }
}
