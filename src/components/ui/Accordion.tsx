import { useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  title: ReactNode
  children: ReactNode
  /** Heading level wrapping the toggle, so the outline stays correct. */
  headingLevel?: 2 | 3
  /** Classes for the toggle's text (size/weight). */
  titleClassName?: string
}

/**
 * A disclosure row that animates open and closed. The whole row is the
 * button, and the panel stays in the HTML while closed (crawlable), animated
 * via grid rows 0fr ↔ 1fr. `inert` keeps the closed panel out of tab order.
 */
export const Accordion = ({
  title,
  children,
  headingLevel = 3,
  titleClassName = 'font-medium',
}: AccordionProps) => {
  const [open, setOpen] = useState(false)
  const id = useId()
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <div>
      <Heading>
        <button
          type="button"
          id={`${id}-toggle`}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className={`text-fg hover:bg-surface-hover/60 focus-visible:ring-brand-400 flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset ${titleClassName}`}
        >
          {title}
          <ChevronDown
            className={`text-fg-muted h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </Heading>
      <div
        id={id}
        role="region"
        aria-labelledby={`${id}-toggle`}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
