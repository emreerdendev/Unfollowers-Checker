import { ArrowLeft } from 'lucide-react'
import { seoFor } from '../../content/seo'
import type { Lang } from '../../lib/routes'
import { PageLink } from '../seo/PageLink'

/** Shown for any URL that matches no page (served with a 404 status). */
export const NotFoundPage = ({ lang }: { lang: Lang }) => {
  const copy = seoFor(lang).notFound
  return (
    <div className="flex flex-col items-center gap-4 pt-20 pb-8 text-center">
      <p className="text-brand-400 font-mono text-sm font-semibold tracking-widest">
        404
      </p>
      <h1 className="text-fg text-2xl font-bold tracking-tight sm:text-3xl">
        {copy.title}
      </h1>
      <p className="text-fg-muted max-w-md leading-relaxed">{copy.body}</p>
      <PageLink
        lang={lang}
        page={{ kind: 'home' }}
        className="bg-brand-500 text-bg hover:bg-brand-600 focus-visible:ring-brand-400 focus-visible:ring-offset-bg mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {copy.backHome}
      </PageLink>
    </div>
  )
}
