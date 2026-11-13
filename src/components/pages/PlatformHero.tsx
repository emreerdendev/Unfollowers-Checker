import { seoFor } from '../../content/seo'
import { TAB_META, type SelectorTab } from '../../platforms'
import type { Lang } from '../../lib/routes'
import { InstagramFixBadge } from '../layout/InstagramFixBadge'
import { showInstagramFixBadge } from '../../lib/instagramFix'

/** Split a heading around the platform's name so the name can be coloured. */
const splitOnLabel = (heading: string, label: string) => {
  const at = heading.indexOf(label)
  if (at === -1) return null
  return [heading.slice(0, at), label, heading.slice(at + label.length)]
}

/**
 * The heading of a platform page, kept short so the tool sits right below.
 * Instagram, X and GitLab open with their own explainer (script, archive,
 * sign-in gate), so they skip the lead line.
 */
export const PlatformHero = ({
  lang,
  tab,
}: {
  lang: Lang
  tab: SelectorTab
}) => {
  const copy = seoFor(lang).platforms[tab]
  const parts = splitOnLabel(copy.heading, TAB_META[tab].label)
  const hasOwnIntro =
    tab === 'instagram' || tab === 'twitter' || tab === 'gitlab'

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="relative">
        {/* Out of the flow, tilted over the title's top-left corner. */}
        {tab === 'instagram' && showInstagramFixBadge() && (
          <InstagramFixBadge className="absolute -top-11 -left-2 -rotate-6 sm:-top-6 sm:-left-28 sm:-rotate-8" />
        )}
        <h1 className="text-fg max-w-xl text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {parts ? (
            <>
              {parts[0]}
              <span className="text-brand-400">{parts[1]}</span>
              {parts[2]}
            </>
          ) : (
            copy.heading
          )}
        </h1>
      </div>
      {!hasOwnIntro && (
        <p className="text-fg-muted max-w-xl text-sm leading-relaxed sm:text-base">
          {copy.description}
        </p>
      )}
    </div>
  )
}
