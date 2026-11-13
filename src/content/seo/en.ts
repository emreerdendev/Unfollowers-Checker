import type { SeoContent } from './types'

export const en: SeoContent = {
  home: {
    title: 'Unfollowers Checker — See Who Doesn’t Follow You Back',
    description:
      'Free, open-source tool to find accounts that don’t follow you back on Instagram, X (Twitter), GitHub, Bluesky, GitLab and Mastodon. No password, nothing stored.',
    heading: 'Find who doesn’t follow you back, on every platform',
    intro: [
      'Unfollowers Checker compares the accounts you follow with the accounts that follow you, and lists everyone who doesn’t follow you back. It works on Instagram, X (Twitter), GitHub, Bluesky, GitLab and Mastodon.',
      'It’s free and open source, never asks for your password, and doesn’t store your data. On GitHub, Bluesky, GitLab, Mastodon and Instagram you can also unfollow the people you pick, in bulk.',
    ],
    faq: [
      {
        q: 'Which platforms are supported?',
        a: 'Instagram, X (Twitter), GitHub, Bluesky, GitLab and Mastodon. Pick a platform at the top of the page to start.',
      },
      {
        q: 'Can I unfollow people with it?',
        a: 'Yes, on GitHub, Bluesky, GitLab, Mastodon and Instagram. Select the accounts you want and unfollow them in one go. X has no free API for this, so on X each result links to the profile and you unfollow there.',
      },
    ],
  },

  platforms: {
    github: {
      title: 'GitHub Unfollowers — Who Doesn’t Follow You Back on GitHub',
      description:
        'Enter any GitHub username to see who it follows that doesn’t follow back. Free and open source. Sign in with GitHub to bulk-unfollow from your own account.',
      heading: 'See who doesn’t follow you back on GitHub',
      intro: [
        'Type a GitHub username and Unfollowers Checker lists every account it follows that doesn’t follow it back. Viewing uses GitHub’s public API, so you don’t need to sign in, and it works for any public user.',
        'To clean up your own list, sign in with GitHub (official OAuth), select the accounts and unfollow them in bulk.',
      ],
      faq: [
        {
          q: 'Do I need to sign in to check GitHub followers?',
          a: 'No. Follower and following lists are public on GitHub, so you can check any username without signing in. You only sign in to unfollow from your own account.',
        },
        {
          q: 'What permissions does GitHub sign-in ask for?',
          a: 'Only the permission GitHub requires to follow and unfollow users on your behalf. The access token stays on the server and is never sent to your browser.',
        },
        {
          q: 'Does it work for accounts with thousands of followers?',
          a: 'Yes. Very large accounts are compared up to a limit, so results for them may be partial, which the page tells you when it happens.',
        },
      ],
    },
    bluesky: {
      title: 'Bluesky Unfollowers — Who Doesn’t Follow You Back on Bluesky',
      description:
        'See which Bluesky accounts don’t follow you back. Enter any handle, no sign-in needed. Sign in with Bluesky to unfollow them in bulk. Free and open source.',
      heading: 'See who doesn’t follow you back on Bluesky',
      intro: [
        'Enter a Bluesky handle such as name.bsky.social and Unfollowers Checker lists every account it follows that doesn’t follow it back. It reads Bluesky’s public AT Protocol API, so viewing needs no sign-in.',
        'Sign in with Bluesky’s official OAuth to unfollow the accounts you select from your own profile, in bulk.',
      ],
      faq: [
        {
          q: 'Does it work with custom domain handles?',
          a: 'Yes. Any Bluesky handle works, including custom domains like yourname.com. You can also paste a bsky.app profile link.',
        },
        {
          q: 'Do I need an app password?',
          a: 'No. Sign-in uses Bluesky’s official OAuth flow, so you never type a password or app password into this site.',
        },
        {
          q: 'Can I check someone else’s Bluesky account?',
          a: 'Yes, follow lists on Bluesky are public. Unfollowing only ever affects your own account.',
        },
      ],
    },
    gitlab: {
      title: 'GitLab Followers — Who Doesn’t Follow You Back on GitLab',
      description:
        'Sign in with GitLab to see who you follow that doesn’t follow you back on gitlab.com, and unfollow them in bulk. Free, open source, nothing stored.',
      heading: 'See who doesn’t follow you back on GitLab',
      intro: [
        'GitLab keeps follower lists private, so Unfollowers Checker asks you to sign in with GitLab first. It then loads your own list and shows everyone you follow who doesn’t follow you back.',
        'Select the accounts you want and unfollow them in one go. It works with gitlab.com and needs no paid plan.',
      ],
      faq: [
        {
          q: 'Why do I have to sign in for GitLab?',
          a: 'GitLab’s API returns follower lists only to signed-in users, so there’s no way to look up an account without signing in. You can only check your own account.',
        },
        {
          q: 'Does it work with self-hosted GitLab?',
          a: 'Not yet. It currently supports gitlab.com.',
        },
      ],
    },
    mastodon: {
      title: 'Mastodon Unfollowers — Who Doesn’t Follow You Back',
      description:
        'Enter a user@instance handle to see who doesn’t follow back on Mastodon. Works with any instance; no sign-in needed to view. Free and open source.',
      heading: 'See who doesn’t follow you back on Mastodon',
      intro: [
        'Enter a Mastodon handle in the user@instance form and Unfollowers Checker lists every account it follows that doesn’t follow it back. Viewing works for accounts on any instance.',
        'Sign in to unfollow the accounts you select, in bulk. Sign-in and unfollowing currently work on mastodon.social.',
      ],
      faq: [
        {
          q: 'Which Mastodon instances are supported?',
          a: 'Viewing works for any instance that exposes follow lists publicly. Signing in and unfollowing currently work on mastodon.social.',
        },
        {
          q: 'What if an account hides its follow lists?',
          a: 'Some Mastodon users hide who they follow or who follows them. In that case the lists can’t be read and the check can’t run.',
        },
      ],
    },
    instagram: {
      title: 'Instagram Unfollowers Checker — Free, No Password',
      description:
        'See who doesn’t follow you back on Instagram and unfollow them in bulk. Runs in your own browser session: no password, no app, nothing sent to a server.',
      heading: 'See who doesn’t follow you back on Instagram',
      intro: [
        'Instagram doesn’t show who doesn’t follow you back. Unfollowers Checker gives you a small script you paste into your browser’s console while you’re on instagram.com. It loads your followers and the accounts you follow using your own session, and lists everyone who doesn’t follow you back.',
        'You never type your password and nothing is sent to our servers. From the panel you can search, filter, and unfollow the accounts you select in batches, with careful delays between each one.',
      ],
      faq: [
        {
          q: 'Does Instagram show who unfollowed me?',
          a: 'No. Instagram doesn’t notify you or show a list of people who unfollowed you or don’t follow you back. Tools like this one compare your followers and following lists to work it out.',
        },
        {
          q: 'Is it safe to use?',
          a: 'You never share your password, and the script only talks to Instagram from your own browser. It adds randomized delays and pauses automatically when Instagram asks it to slow down. Any automated activity carries some risk, so keep the default timings and don’t unfollow hundreds of accounts at once.',
        },
        {
          q: 'Why do I paste a script into the console?',
          a: 'Instagram has no public follower API. Running the script on instagram.com lets it use the session you’re already signed in with, so no password or third-party login is needed. The script is open source, so you can read it before you run it.',
        },
        {
          q: 'Does it work on my phone?',
          a: 'It needs a desktop browser with developer tools, such as Chrome, Edge, Firefox or Safari on a computer.',
        },
        {
          q: 'What happens if the scan stops halfway?',
          a: 'Progress is saved after every page. If Instagram interrupts the scan, open the panel again and continue where you left off instead of starting over.',
        },
      ],
    },
    twitter: {
      title: 'X (Twitter) Unfollowers — Who Doesn’t Follow You Back',
      description:
        'Find who doesn’t follow you back on X (Twitter) from your official data archive. The comparison runs in your browser and files never leave your device.',
      heading: 'See who doesn’t follow you back on X (Twitter)',
      intro: [
        'X has no free API for follower lists, so Unfollowers Checker uses your official X data archive instead. Upload the following.js and follower.js files from it, and the page lists every account you follow that doesn’t follow you back.',
        'Everything runs in your browser: the files are read and compared locally and never uploaded. Each result links to the profile so you can unfollow it on X.',
      ],
      faq: [
        {
          q: 'How do I get my X data archive?',
          a: 'On X, go to Settings → Your account → Download an archive of your data. X usually takes a day or so to prepare it. Unzip it and find following.js and follower.js in the data folder.',
        },
        {
          q: 'Why are there numeric IDs instead of usernames?',
          a: 'X’s archive only contains account IDs, not usernames. Each result opens the right profile on X when you click it.',
        },
        {
          q: 'Can I unfollow from here?',
          a: 'Not on X, because there’s no free API for it. Open each profile from the list and unfollow it on X.',
        },
      ],
    },
  },

  general: [
    {
      q: 'Is Unfollowers Checker free?',
      a: 'Yes, completely free, with no ads or limits. It’s open source on GitHub.',
    },
    {
      q: 'Do you ask for my password?',
      a: 'Never. Where signing in is needed, it uses each platform’s official OAuth. Instagram runs in your own browser session and X works from your downloaded archive.',
    },
    {
      q: 'Do you store my data?',
      a: 'No. There’s no database. Lists are fetched, compared and returned for that one request, and your preferences stay in your browser’s local storage.',
    },
  ],

  guides: {
    title: 'Guides — Unfollowers Checker',
    description:
      'Step-by-step guides on finding who doesn’t follow you back on Instagram, Bluesky and more, and on staying safe while you clean up your following list.',
    heading: 'Guides',
    intro:
      'Practical, step-by-step guides on finding who doesn’t follow you back and cleaning up your following list safely.',
  },

  faq: {
    title: 'Frequently Asked Questions — Unfollowers Checker',
    description:
      'Answers about Unfollowers Checker: how it works on Instagram, X, GitHub, Bluesky, GitLab and Mastodon, whether it’s safe, and what it stores.',
    heading: 'Frequently asked questions',
    intro:
      'How it works on each platform, what it stores and how to stay safe.',
    general: 'General',
  },

  notFound: {
    title: 'Page not found',
    body: 'This page doesn’t exist or has moved. Pick a platform from the home page instead.',
    backHome: 'Go to the home page',
  },
}
