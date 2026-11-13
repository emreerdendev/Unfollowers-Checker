import type { ReactNode } from 'react'

interface ResultSummaryProps {
  count: number
  /** The sentence explaining the number. */
  children: ReactNode
  /** Buttons on the right (copy, start over…). */
  actions?: ReactNode
}

/** The headline of a result: the count, large, with its sentence and actions. */
export const ResultSummary = ({
  count,
  children,
  actions,
}: ResultSummaryProps) => (
  <div className="rounded-card border-border bg-surface flex flex-col gap-3 border p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-4">
      <span className="text-brand-400 text-4xl leading-none font-bold tabular-nums">
        {count.toLocaleString()}
      </span>
      <p className="text-fg-muted text-sm">{children}</p>
    </div>
    {actions && (
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {actions}
      </div>
    )}
  </div>
)
