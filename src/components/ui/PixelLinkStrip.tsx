import { useEffect, useRef, type ReactNode } from 'react'
import { PixelGrid, type PixelGridProps } from './PixelGrid'
import { fitPadding } from './pixelGridMetrics'

export interface StripLink {
  /** Stable key. */
  id: string
  href: string
  children: ReactNode
  /** Tooltip / longer description. */
  title?: string
  /** Opens in a new tab with rel="noopener noreferrer". Defaults to true for http(s) links. */
  external?: boolean
  /** Extra rel values, e.g. "me" for your own site. */
  rel?: string
  className?: string
}

export interface PixelLinkStripProps {
  /** Links in groups: a row per group when narrow, all in one row when wide. */
  groups: StripLink[][]
  /** Accessible name for the strip's <nav>, e.g. "About the author". */
  label: string
  /** Classes for the strip itself (borders, text colour…). */
  className?: string
  /** Classes for the dash between side-by-side links (its colour). */
  separatorClassName?: string
  /** Passed through to the pixel background. */
  gridProps?: Omit<PixelGridProps, 'calmRef' | 'className'>
}

/** Vertical padding of the link list (py-2.5), in CSS pixels. */
const BASE_PADDING = 10

const isHttp = (href: string) => /^https?:\/\//.test(href)

const relFor = ({ href, external, rel }: StripLink) =>
  [
    ...((external ?? isHttp(href)) ? ['noopener', 'noreferrer'] : []),
    ...(rel ? rel.split(/\s+/) : []),
  ].join(' ') || undefined

/**
 * A full-width strip of grouped links over a twinkling pixel grid.
 *
 * Layout: one row with separators when there's room (md+); a row per group
 * when narrower; one link per row on small phones (<400px). Separators show
 * only between links that actually sit side by side. Keep links the same
 * visual height (or give plain-text links tight leading) so stacked rows
 * look evenly spaced.
 */
export const PixelLinkStrip = ({
  groups,
  label,
  className = '',
  separatorClassName = 'opacity-40',
  gridProps,
}: PixelLinkStripProps) => {
  const listRef = useRef<HTMLUListElement>(null)

  // Grow the strip by 0–3px so the pixel grid fits it exactly: one gap above
  // the first row and below the last, same as between cells. The list sets
  // the strip's height, so its padding takes the extra, split top/bottom.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    let extra = 0
    const fit = () => {
      const natural = list.offsetHeight - extra
      const next = fitPadding(natural)
      if (next === extra) return
      extra = next
      list.style.paddingTop = `${BASE_PADDING + Math.floor(extra / 2)}px`
      list.style.paddingBottom = `${BASE_PADDING + Math.ceil(extra / 2)}px`
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  const separator = (visibility: string) => (
    <span
      aria-hidden="true"
      className={`px-1 leading-none ${separatorClassName} ${visibility}`}
    >
      –
    </span>
  )

  return (
    <nav aria-label={label} className={`relative overflow-hidden ${className}`}>
      <PixelGrid
        {...gridProps}
        calmRef={listRef}
        className="absolute inset-0 h-full w-full"
      />
      <ul
        ref={listRef}
        className="relative mx-auto flex w-fit max-w-full flex-col items-center gap-2 px-4 py-2.5 md:flex-row md:gap-1"
      >
        {groups.map((group, groupIndex) => (
          <li
            key={group.map((link) => link.id).join('+')}
            className="flex items-center gap-1"
          >
            {groupIndex > 0 && separator('hidden md:inline')}
            <ul className="flex flex-col items-center gap-2 min-[400px]:flex-row min-[400px]:gap-1">
              {group.map((link, index) => {
                const external = link.external ?? isHttp(link.href)
                return (
                  <li key={link.id} className="flex items-center gap-1">
                    {index > 0 && separator('hidden min-[400px]:inline')}
                    <a
                      href={link.href}
                      title={link.title}
                      target={external ? '_blank' : undefined}
                      rel={relFor(link)}
                      className={link.className}
                    >
                      {link.children}
                    </a>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
