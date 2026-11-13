import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import type { Lang, NavigablePage } from '../../lib/routes'
import { PageLink } from '../seo/PageLink'

interface Crumb {
  label: string
  /** Omitted for the current page. */
  page?: NavigablePage
}

/** Home › … › current page. Every step but the last is a link. */
export const Breadcrumbs = ({
  lang,
  items,
}: {
  lang: Lang
  items: Crumb[]
}) => {
  const { t } = useTranslation()
  const crumbs: Crumb[] = [
    { label: t('nav.home'), page: { kind: 'home' } },
    ...items,
  ]

  return (
    <nav aria-label={t('nav.breadcrumb')}>
      <ol className="text-fg-muted flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => (
          <li key={crumb.label} className="flex min-w-0 items-center gap-1">
            {index > 0 && (
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            )}
            {crumb.page ? (
              <PageLink
                lang={lang}
                page={crumb.page}
                className="hover:text-fg focus-visible:ring-brand-400 rounded-sm underline-offset-2 outline-none hover:underline focus-visible:ring-2"
              >
                {crumb.label}
              </PageLink>
            ) : (
              <span aria-current="page" className="text-fg line-clamp-1">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
