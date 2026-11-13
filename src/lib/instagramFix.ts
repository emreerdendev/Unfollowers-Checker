/** When the Instagram script was last fixed; shown on the "working again" badge. */
export const INSTAGRAM_FIX_DATE = Date.UTC(2026, 9, 20)
/** The badge is news, not a fixture: it hides itself after this many days. */
const INSTAGRAM_FIX_BADGE_DAYS = 45

export const showInstagramFixBadge = () =>
  Date.now() - INSTAGRAM_FIX_DATE <
  INSTAGRAM_FIX_BADGE_DAYS * 24 * 60 * 60 * 1000
