import type { Guide } from './types'

export const en: Guide[] = [
  {
    slug: 'see-who-unfollowed-you-on-instagram',
    title: 'How to See Who Doesn’t Follow You Back on Instagram',
    description:
      'Instagram doesn’t show who unfollowed you. Here’s a free way to list everyone who doesn’t follow you back, without giving your password to an app.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Instagram doesn’t notify you when someone unfollows you, and there’s no built-in list of people who don’t follow you back. The only way to find out is to compare two lists: the accounts you follow and the accounts that follow you.',
          'You can do that by hand for a small account, but past a few hundred it becomes impractical. This guide shows a free way to do it automatically, without installing an app or handing your password to anyone.',
        ],
      },
      {
        heading: 'What you need',
        bullets: [
          'A computer with a desktop browser such as Chrome, Edge, Firefox or Safari.',
          'To be signed in to instagram.com in that browser.',
          'About five minutes. Larger accounts take longer to scan.',
        ],
      },
      {
        heading: 'Step by step',
        steps: [
          'Open the Instagram page on Unfollowers Checker and press “Copy the code”.',
          'Go to instagram.com in the same browser and make sure you’re signed in.',
          'Open the developer console: F12 or Ctrl+Shift+J on Windows and Linux, Cmd+Option+J on a Mac. Click the Console tab.',
          'Paste the script and press Enter. A panel appears in the corner of the page.',
          'Press “Scan now”. The panel loads your followers, then checks everyone you follow against them, and lists everyone who doesn’t follow you back.',
          'Optionally, select accounts and unfollow them. The panel spaces the requests out and verifies each unfollow with Instagram.',
        ],
      },
      {
        heading: 'Why a console script instead of an app?',
        paragraphs: [
          'Instagram has no public API for follower lists. Apps that promise this usually ask for your username and password and sign in on their own servers, which puts your account at risk.',
          'A script you run on instagram.com uses the session you’re already signed in with. Your password never leaves your browser, and nothing is sent to a third-party server. The script is open source, so you can read exactly what it does before you run it.',
        ],
      },
      {
        heading: 'Tips',
        bullets: [
          'If the scan stops halfway, reopen the panel: progress is saved after every page, so you can continue instead of starting over.',
          'Keep the default timings. They’re deliberately slow to look like normal use.',
          'Don’t unfollow hundreds of accounts in one sitting. Spread large clean-ups over a few days.',
        ],
      },
    ],
  },
  {
    slug: 'are-instagram-unfollower-apps-safe',
    title: 'Are Instagram Unfollower Apps Safe? What to Check First',
    description:
      'Many “who unfollowed me” apps ask for your Instagram password. Here’s how to tell a risky tool from a safe one, and how to lower the risk of an action block.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          'Searching for “who unfollowed me on Instagram” turns up dozens of apps. Some are harmless; others put your account at real risk. The difference usually comes down to one thing: what the tool asks you to hand over.',
        ],
      },
      {
        heading: 'Red flags',
        bullets: [
          'It asks for your Instagram password. A third party signing in as you can be flagged as suspicious, and you have no control over what it does with the session.',
          'It shows only part of the list and wants a subscription to “unlock” the rest.',
          'It promises to show who viewed your profile or stories. Instagram doesn’t expose that data, so the claim is false.',
          'It isn’t clear who makes it, what it stores, or where your data goes.',
        ],
      },
      {
        heading: 'Safer approaches',
        bullets: [
          'Tools that run in your own browser session on instagram.com, so your password never leaves your device.',
          'Tools that work from Instagram’s official data export, which you download yourself.',
          'Open-source tools, where anyone can read the code and confirm what it does.',
        ],
      },
      {
        heading: 'Avoiding an action block',
        paragraphs: [
          'Even a tool that never sees your password can trigger Instagram’s limits if it acts too fast. Instagram may then temporarily block actions like following and unfollowing.',
        ],
        bullets: [
          'Unfollow in small batches, with pauses between each account.',
          'Stop if Instagram shows a warning, and wait a day or two before continuing.',
          'Don’t run several automation tools at the same time.',
        ],
      },
      {
        heading: 'How Unfollowers Checker handles it',
        paragraphs: [
          'Unfollowers Checker runs as a script in your own browser session, never asks for your password and sends nothing to its own servers. It adds randomized delays and cooldowns, pauses automatically when Instagram asks it to slow down, and verifies each unfollow. Any automated activity carries some risk, so use it with care.',
        ],
      },
    ],
  },
  {
    slug: 'bluesky-who-doesnt-follow-you-back',
    title: 'How to Find Who Doesn’t Follow You Back on Bluesky',
    description:
      'A quick, free way to list the Bluesky accounts you follow that don’t follow you back, and unfollow them in bulk with Bluesky’s official sign-in.',
    published: '2026-11-13',
    platform: 'bluesky',
    sections: [
      {
        paragraphs: [
          'Bluesky shows your follower and following counts, but not who is missing from one list or the other. Because follow lists on Bluesky are public, you can compare them without signing in.',
        ],
      },
      {
        heading: 'Step by step',
        steps: [
          'Open the Bluesky page on Unfollowers Checker.',
          'Enter your handle, for example name.bsky.social or your custom domain. You can also paste your bsky.app profile link.',
          'Press Check. You’ll see every account you follow that doesn’t follow you back.',
          'To unfollow, press “Sign in with Bluesky”. Sign-in uses Bluesky’s official OAuth, so you never type a password or app password.',
          'Select the accounts you want and press “Unfollow selected”.',
        ],
      },
      {
        heading: 'Good to know',
        bullets: [
          'You can check any public handle, not just your own. Unfollowing only ever affects your own account.',
          'Nothing is stored: the lists are fetched, compared and returned for that one request.',
          'Very large accounts are compared up to a limit, so their results may be partial.',
        ],
      },
    ],
  },
  {
    slug: 'download-your-x-twitter-archive',
    title: 'How to Download Your X (Twitter) Data Archive',
    description:
      'Step by step: request your X data archive, find following.js and follower.js inside it, and see who doesn’t follow you back — without an X API.',
    published: '2026-11-13',
    platform: 'twitter',
    sections: [
      {
        paragraphs: [
          'X no longer offers a free way for tools to read follower lists, but you can still get your own lists: X lets every account download an archive of its data. Two files in that archive, following.js and follower.js, are all you need to find who doesn’t follow you back.',
        ],
      },
      {
        heading: 'Request the archive',
        steps: [
          'On X, open More (or your profile menu) and go to Settings and privacy.',
          'Choose Your account, then Download an archive of your data.',
          'Confirm your password. X may also send a verification code to your email or phone.',
          'Press Request archive.',
        ],
      },
      {
        heading: 'Wait for it',
        paragraphs: [
          'X prepares the archive in the background. It usually takes about a day, sometimes longer for big accounts. You’ll get an email and an in-app notification when it’s ready, and the download stays available for a few days.',
        ],
      },
      {
        heading: 'Find the two files',
        steps: [
          'Download the archive (a .zip file) and unzip it.',
          'Open the data folder inside.',
          'Find following.js and follower.js. Large accounts may have extra parts, such as following-part1.js — keep those too.',
        ],
      },
      {
        heading: 'Compare them',
        paragraphs: [
          'Open the X page on Unfollowers Checker and drop the two files (and any part files) onto it. The comparison runs entirely in your browser — the files are never uploaded. Each result links to the profile on X, where you can unfollow.',
        ],
      },
      {
        heading: 'Good to know',
        bullets: [
          'The archive only contains account IDs, not usernames, so results show IDs. Clicking one opens the right profile.',
          'The archive is a snapshot. To check again later, request a new one.',
          'The rest of the archive (posts, messages, settings) isn’t read — only the two follow files are used.',
        ],
      },
    ],
  },
  {
    slug: 'github-who-doesnt-follow-you-back',
    title: 'How to See Who Doesn’t Follow You Back on GitHub',
    description:
      'GitHub doesn’t show who doesn’t follow you back. Here’s a free way to list them for any username — and unfollow them in bulk from your own account.',
    published: '2026-11-13',
    platform: 'github',
    sections: [
      {
        paragraphs: [
          'GitHub shows how many people follow you and how many you follow, but not who is missing from one list or the other. Because follow lists on GitHub are public, they can be compared without signing in.',
        ],
      },
      {
        heading: 'Step by step',
        steps: [
          'Open the GitHub page on Unfollowers Checker.',
          'Type a GitHub username — yours or anyone’s. A profile link works too.',
          'Press Check. You’ll see every account that user follows who doesn’t follow them back.',
          'To clean up your own list, press Sign in at the top. Sign-in uses GitHub’s official OAuth; the access token stays on the server.',
          'Select the accounts you want and press Unfollow selected.',
        ],
      },
      {
        heading: 'Good to know',
        bullets: [
          'Viewing any public account needs no sign-in. Unfollowing only ever affects your own account, and asks you to confirm first.',
          'Nothing is stored: the lists are fetched, compared and returned for that one request.',
          'Very large accounts are compared up to a limit, so their results may be partial — the page tells you when that happens.',
        ],
      },
    ],
  },
  {
    slug: 'instagram-action-blocked',
    title: 'Instagram “Action Blocked”: What It Means and What to Do',
    description:
      'Why Instagram blocks actions like following and unfollowing, how long it usually lasts, what helps — and how to avoid it when you clean up your following list.',
    published: '2026-11-13',
    platform: 'instagram',
    sections: [
      {
        paragraphs: [
          '“Action blocked” (or “Try again later”) is a temporary restriction Instagram places on an account that does something too much, too fast. It usually affects actions like following, unfollowing, liking or commenting, while the rest of the app keeps working.',
        ],
      },
      {
        heading: 'Why it happens',
        bullets: [
          'Many follows or unfollows in a short time, which looks automated.',
          'Repeating an action right after Instagram has refused it.',
          'Third-party apps that sign in as you or act on your behalf.',
          'A new or recently changed account, which Instagram watches more closely.',
        ],
      },
      {
        heading: 'How long it lasts',
        paragraphs: [
          'Instagram doesn’t publish exact limits or durations. Most blocks lift within hours to a few days. Retrying while blocked tends to make it last longer.',
        ],
      },
      {
        heading: 'What to do',
        steps: [
          'Stop the action that was blocked, and don’t keep retrying it.',
          'Wait — give it at least a day before trying again.',
          'Check Settings → Apps and websites, and remove any app you don’t recognise or no longer use.',
          'If you think someone else used your account, change your password and turn on two-factor authentication.',
          'If the message says it was a mistake, you can tell Instagram from the dialog.',
        ],
      },
      {
        heading: 'Unfollowing without getting blocked',
        bullets: [
          'Unfollow in small batches, with pauses between each account.',
          'Spread a big clean-up over several days.',
          'Avoid tools that ask for your password.',
        ],
      },
      {
        heading: 'How Unfollowers Checker handles it',
        paragraphs: [
          'Unfollowers Checker’s Instagram panel runs in your own browser session, adds randomized delays and cooldowns, and pauses automatically when Instagram asks it to slow down. Any automated activity carries some risk, so keep the default timings.',
        ],
      },
    ],
  },
]
