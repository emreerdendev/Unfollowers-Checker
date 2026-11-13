import { useEffect, type RefObject } from 'react'

/** While `open`, call `close` on a click outside `ref` or on Escape. */
export const useDismiss = (
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void,
) => {
  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, close])
}
