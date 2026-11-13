import { useMemo, type ReactNode } from 'react'

/**
 * Token classes for the tiny JavaScript highlighter below. Each colour has a
 * darker light-theme shade and a brighter dark-theme one.
 */
const TOKEN_CLASS = {
  comment: 'text-fg-muted/70 italic',
  string: 'text-emerald-700 dark:text-emerald-400',
  keyword: 'text-pink-600 dark:text-pink-400',
  number: 'text-amber-700 dark:text-amber-400',
} as const
type TokenKind = keyof typeof TOKEN_CLASS

/**
 * One pass over the source: comments, strings (incl. simple template
 * literals), keywords and numbers. Good enough for display — it isn't a
 * parser, and nested template literals may colour a little loosely.
 */
const TOKEN_PATTERN = new RegExp(
  [
    String.raw`(?<comment>\/\*[\s\S]*?\*\/|\/\/[^\n]*)`,
    String.raw`(?<string>"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|` +
      '`(?:\\\\[\\s\\S]|[^`\\\\])*`)',
    String.raw`(?<keyword>\b(?:const|let|var|function|return|if|else|for|while|do|of|in|new|async|await|try|catch|finally|throw|typeof|instanceof|break|continue|switch|case|default|class|extends|this|null|undefined|true|false)\b)`,
    String.raw`(?<number>\b\d+(?:\.\d+)?\b)`,
  ].join('|'),
  'g',
)

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Highlight `code` into one HTML string per line (tokens may span lines). */
const highlightLines = (code: string): string[] => {
  const lines: string[] = ['']
  const push = (text: string, kind?: TokenKind) => {
    text.split('\n').forEach((part, index) => {
      if (index > 0) lines.push('')
      if (!part) return
      const html = escapeHtml(part)
      lines[lines.length - 1] += kind
        ? `<span class="${TOKEN_CLASS[kind]}">${html}</span>`
        : html
    })
  }

  let last = 0
  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0
    if (index > last) push(code.slice(last, index))
    const groups = match.groups ?? {}
    const kind = (Object.keys(TOKEN_CLASS) as TokenKind[]).find(
      (key) => groups[key] !== undefined,
    )
    push(match[0], kind)
    last = index + match[0].length
  }
  if (last < code.length) push(code.slice(last))
  return lines
}

interface CodeViewerProps {
  fileName: string
  /** Shown next to the file name, e.g. "JavaScript". */
  language: string
  /** The source; null while it loads (`placeholder` is shown instead). */
  code: string | null
  placeholder?: string
  /** Buttons on the right of the title bar (e.g. Copy). */
  actions?: ReactNode
  /** Height cap for the scrollable body. */
  maxHeightClass?: string
}

/**
 * A read-only code panel: title bar with file name and actions, then the
 * source with line numbers and light syntax colouring, scrolling within a
 * fixed height. Long lines wrap under their own number.
 */
export const CodeViewer = ({
  fileName,
  language,
  code,
  placeholder,
  actions,
  maxHeightClass = 'max-h-48',
}: CodeViewerProps) => {
  const lines = useMemo(() => (code ? highlightLines(code) : null), [code])

  return (
    <figure className="border-border bg-bg overflow-hidden rounded-lg border">
      <figcaption className="border-border bg-surface flex items-center gap-3 border-b py-1.5 pr-1.5 pl-3">
        <span className="text-fg truncate font-mono text-xs font-semibold">
          {fileName}
        </span>
        <span className="text-fg-muted hidden text-xs sm:inline">
          {language}
        </span>
        {actions && <span className="ml-auto shrink-0">{actions}</span>}
      </figcaption>
      <pre
        className={`${maxHeightClass} overflow-auto py-2 font-mono text-xs leading-relaxed`}
        tabIndex={0}
      >
        {lines ? (
          <code className="block">
            {lines.map((html, index) => (
              <span key={index} className="flex">
                <span
                  aria-hidden="true"
                  className="text-fg-muted/50 w-12 shrink-0 pr-4 text-right select-none"
                >
                  {index + 1}
                </span>
                <span
                  className="text-fg min-w-0 flex-1 pr-3 break-all whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: html || ' ' }}
                />
              </span>
            ))}
          </code>
        ) : (
          <code className="text-fg-muted block px-3">{placeholder}</code>
        )}
      </pre>
    </figure>
  )
}
