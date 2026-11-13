/** A release note entry. English only; newest first. */
export interface ChangelogEntry {
  /** ISO date. */
  date: string
  title: string
  items: string[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-11-13',
    title: 'New interface, platform pages and guides',
    items: [
      'A home page with every platform, plus a page per platform in English, Turkish, German, French and Spanish.',
      'The platform tabs and sign-in sit in a sticky top bar, so they never scroll out of reach.',
      'One FAQ page with a section per platform, and six step-by-step guides.',
      'Results lead with the count; share it or star the project from the results screen.',
    ],
  },
  {
    date: '2026-11-04',
    title: 'Footer and tabs',
    items: [
      'On small screens the active platform tab scrolls into view.',
      'Links to the PSIBS Discord community and support options in the footer.',
    ],
  },
  {
    date: '2026-10-20',
    title: 'Instagram unfollowing fixed',
    items: [
      'Unfollows use the same request Instagram’s own web app sends and are verified, so an ignored request is reported as failed — with the reason — instead of counted as done.',
      'Interrupted scans resume where they stopped, and the last result reopens without rescanning.',
      'Automatic pause on rate limits and action blocks.',
      'A wider panel that opens in English and asks before closing with results on screen.',
    ],
  },
  {
    date: '2026-06-23',
    title: 'Shorter-lived sessions',
    items: ['Sign-in sessions now expire automatically.'],
  },
  {
    date: '2026-06-14',
    title: 'Mastodon',
    items: [
      'See who doesn’t follow you back on any Mastodon instance; sign in to bulk-unfollow on mastodon.social.',
    ],
  },
  {
    date: '2026-06-13',
    title: 'GitLab, and a faster backend',
    items: [
      'GitLab support: sign in to see your own list and bulk-unfollow.',
      'Moved to Cloudflare Workers.',
      'Pasted handles are cleaned up (links, @, invisible characters).',
      'After signing in you return to the platform you signed in to.',
    ],
  },
  {
    date: '2026-06-08',
    title: 'New home: unfollowerschecker.com',
    items: ['The tool moved to its own domain.'],
  },
  {
    date: '2026-06-07',
    title: 'X and Instagram improvements',
    items: [
      'X archive results are paginated and link to each profile.',
      'The Instagram panel shows a summary of what was unfollowed, in five languages.',
    ],
  },
]
