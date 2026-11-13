import { useEffect, useState } from 'react'

/** Ignore jitter smaller than this (px) when deciding the scroll direction. */
const THRESHOLD = 6
/** Always show within this distance (px) of the top of the page. */
const TOP_ZONE = 80

/**
 * True while the user is scrolling down (past the top of the page), false
 * once they scroll back up — for chrome that tucks away while reading and
 * returns when they head back.
 */
export const useHideOnScroll = (enabled = true) => {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      if (y < TOP_ZONE) setHidden(false)
      else if (y > lastY + THRESHOLD) setHidden(true)
      else if (y < lastY - THRESHOLD) setHidden(false)
      else return // small move: keep the reference point
      lastY = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  return enabled && hidden
}
