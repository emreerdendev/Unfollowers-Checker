import type { MouseEvent, ReactNode } from 'react'
import { useOptionalRoute } from '../../hooks/route'
import { pathFor, type Lang, type NavigablePage } from '../../lib/routes'

interface PageLinkProps {
  lang: Lang
  page: NavigablePage
  /** Section on the target page to jump to (e.g. "instagram" on /faq). */
  hash?: string
  className?: string
  children: ReactNode
}

/**
 * A real <a href> (crawlable, opens in a new tab with a modifier key) that
 * navigates in-app on a plain click. In the prerender it's just the link.
 */
export const PageLink = ({
  lang,
  page,
  hash,
  className,
  children,
}: PageLinkProps) => {
  const routeCtx = useOptionalRoute()
  const href = pathFor(lang, page) + (hash ? `#${hash}` : '')

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !routeCtx ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    routeCtx.navigate(page)
    if (hash) {
      window.history.replaceState(null, '', href)
      // Wait a tick for the target page to render before jumping to it.
      setTimeout(() => {
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  )
}
