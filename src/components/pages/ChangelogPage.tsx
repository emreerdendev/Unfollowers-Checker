import { CHANGELOG } from '../../content/changelog'
import type { Lang } from '../../lib/routes'
import { Breadcrumbs } from './Breadcrumbs'

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))

/** Release notes, newest first. The notes themselves are English only. */
export const ChangelogPage = ({ lang }: { lang: Lang }) => (
  <div className="flex flex-col gap-10 pt-6">
    <div className="space-y-3">
      <Breadcrumbs lang={lang} items={[{ label: 'Changelog' }]} />
      <h1 className="text-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        Changelog
      </h1>
      <p className="text-fg-muted leading-relaxed" lang="en">
        What’s new in Unfollowers Checker — new platforms, fixes and
        improvements, newest first.
      </p>
    </div>

    <ol className="border-border flex flex-col gap-8 border-l pl-6" lang="en">
      {CHANGELOG.map((entry) => (
        <li key={entry.date} className="relative space-y-2">
          <span
            aria-hidden="true"
            className="bg-brand-500 ring-bg absolute top-1.5 -left-[1.8rem] h-2.5 w-2.5 rounded-full ring-4"
          />
          <time
            dateTime={entry.date}
            className="text-fg-muted block font-mono text-xs tracking-wider uppercase"
          >
            {formatDate(entry.date)}
          </time>
          <h2 className="text-fg text-lg font-semibold tracking-tight">
            {entry.title}
          </h2>
          <ul className="text-fg-muted marker:text-brand-400 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
            {entry.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </div>
)
