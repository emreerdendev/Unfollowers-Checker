import { useEffect, useRef, type RefObject } from 'react'
import { PIXEL_BLOCK, PIXEL_CELL, PIXEL_GAP } from './pixelGridMetrics'

export interface PixelGridColors {
  /** The still grid's cells — just off the page background. */
  grid: string
  /** The brightest a twinkling cell gets. */
  peak: string
}

export interface PixelGridProps {
  /** Colours per theme, as #rrggbb. Defaults to barely-there greys. */
  palette?: { light: PixelGridColors; dark: PixelGridColors }
  /** Whether the dark palette applies. Defaults to a `dark` class on <html>. */
  isDark?: () => boolean
  /** Share of cells that twinkle (0–1). */
  twinkleShare?: number
  /** Fewer cells twinkle behind this element, so text over it stays calm. */
  calmRef?: RefObject<HTMLElement | null>
  /** Of the twinkling cells, the share that still twinkles behind `calmRef`. */
  calmShare?: number
  /** Each twinkling cell pulses once per this many seconds, [min, max]. */
  periodRange?: [number, number]
  className?: string
}

/** 3px blocks with 1px gaps (CSS pixels), drawn at the device's pixel ratio. */
const BLOCK = PIXEL_BLOCK
const GAP = PIXEL_GAP
const CELL = PIXEL_CELL

/**
 * Fit as many cells as possible along one axis while keeping at least one
 * gap at both ends, then centre them. When the size fits the grid exactly
 * (see `fitPadding`), both ends get exactly one gap. Otherwise the offset
 * snaps to device pixels, so the two ends stay as even as the screen allows
 * and the cells stay crisp.
 */
const fit = (size: number, dpr: number) => {
  const count = Math.max(0, Math.floor((size - GAP) / CELL))
  const span = count * CELL - GAP
  return { count, start: Math.round(((size - span) / 2) * dpr) / dpr }
}
/** Number of shades between the grid colour and the peak. */
const STEPS = 8

const DEFAULT_PALETTE = {
  dark: { grid: '#1a1b1f', peak: '#3b3d45' },
  light: { grid: '#eeeff2', peak: '#c9cdd4' },
}

const hasDarkClass = () => document.documentElement.classList.contains('dark')

const toRgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

/** STEPS colours from `grid` to `peak` (index 0 is the grid itself). */
const shadesFor = ({ grid, peak }: PixelGridColors) => {
  const from = toRgb(grid)
  const to = toRgb(peak)
  return Array.from({ length: STEPS }, (_, step) => {
    const t = step / (STEPS - 1)
    const [r, g, b] = from.map((v, i) => Math.round(v + (to[i] - v) * t))
    return `rgb(${r} ${g} ${b})`
  })
}

/** Integer hash → [0, 1): the same cells twinkle, the same way, on every load. */
const hash = (x: number, y: number, salt: number) => {
  let h =
    Math.imul(x, 374761393) ^
    Math.imul(y, 668265263) ^
    Math.imul(salt, 1274126177)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

interface Twinkle {
  x: number
  y: number
  period: number
  phase: number
  /** Still twinkles behind the calm area. */
  calm: boolean
}

type Options = Required<
  Pick<
    PixelGridProps,
    'palette' | 'isDark' | 'twinkleShare' | 'calmShare' | 'periodRange'
  >
>

/**
 * A faint pixel grid where a few cells slowly brighten and fade, each on its
 * own rhythm — a quiet twinkle rather than motion. Decorative: hidden from
 * assistive tech and click-through. Animates only while on screen; reduced
 * motion gets the still grid. Size it with `className` (e.g. absolute inset-0).
 */
export const PixelGrid = ({
  palette = DEFAULT_PALETTE,
  isDark = hasDarkClass,
  twinkleShare = 0.06,
  calmRef,
  calmShare = 0.35,
  periodRange = [3, 7],
  className = '',
}: PixelGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // The drawing loop reads the latest options through a ref, so it needn't
  // restart when callers pass fresh object/array literals each render.
  const options = useRef<Options>({
    palette,
    isDark,
    twinkleShare,
    calmShare,
    periodRange,
  })
  useEffect(() => {
    options.current = { palette, isDark, twinkleShare, calmShare, periodRange }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    let frame = 0
    let visible = false

    // The still grid only changes with size, theme or options: drawn once
    // into an offscreen canvas, then copied each frame.
    const grid = document.createElement('canvas')
    let gridKey = ''
    let twinkles: Twinkle[] = []
    let shades: string[] = []

    const rebuild = (
      width: number,
      height: number,
      dpr: number,
      colors: PixelGridColors,
    ) => {
      const { twinkleShare, calmShare, periodRange } = options.current
      const [minPeriod, maxPeriod] = periodRange
      const { count: rows, start: top } = fit(height, dpr)
      const { count: cols, start: left } = fit(width, dpr)

      grid.width = canvas.width
      grid.height = canvas.height
      const g = grid.getContext('2d')
      if (g) {
        g.setTransform(dpr, 0, 0, dpr, 0, 0)
        g.fillStyle = colors.grid
        for (let i = 0; i < cols; i++)
          for (let j = 0; j < rows; j++)
            g.fillRect(left + i * CELL, top + j * CELL, BLOCK, BLOCK)
      }

      shades = shadesFor(colors)
      twinkles = []
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          if (hash(i, j, 1) >= twinkleShare) continue
          twinkles.push({
            x: left + i * CELL,
            y: top + j * CELL,
            period: minPeriod + hash(i, j, 2) * (maxPeriod - minPeriod),
            phase: hash(i, j, 3),
            calm: hash(i, j, 4) < calmShare,
          })
        }
    }

    const draw = (now: number) => {
      // Sizes in CSS pixels; the backing store is scaled by the pixel ratio.
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const dpr = canvas.width / Math.max(1, width)
      const { palette, isDark, twinkleShare, calmShare, periodRange } =
        options.current
      const colors = palette[isDark() ? 'dark' : 'light']
      const key = [
        width,
        height,
        dpr,
        colors.grid,
        colors.peak,
        twinkleShare,
        calmShare,
        ...periodRange,
      ].join(':')
      if (key !== gridKey) {
        gridKey = key
        rebuild(width, height, dpr, colors)
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(grid, 0, 0)
      if (reduceMotion) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Behind the calm element (plus a little margin) only some twinkle.
      const box = canvas.getBoundingClientRect()
      const calmBox = calmRef?.current?.getBoundingClientRect()
      const calmLeft = calmBox ? calmBox.left - box.left - 8 : Infinity
      const calmRight = calmBox ? calmBox.right - box.left + 8 : -Infinity

      const time = now / 1000
      for (const { x, y, period, phase, calm } of twinkles) {
        if (!calm && x + BLOCK > calmLeft && x < calmRight) continue
        // A short, soft pulse once per period; dark the rest of the time.
        const wave = Math.sin(2 * Math.PI * (time / period + phase))
        const level = Math.round(Math.max(0, wave) ** 3 * (STEPS - 1))
        if (level === 0) continue
        ctx.fillStyle = shades[level]
        ctx.fillRect(x, y, BLOCK, BLOCK)
      }
    }

    const loop = (now: number) => {
      draw(now)
      if (visible && !reduceMotion) frame = requestAnimationFrame(loop)
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      draw(performance.now())
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    // Repaint on theme switches (class/attribute changes on <html>), which
    // matters when nothing is animating (reduced motion, off-screen).
    const themeObserver = new MutationObserver(() => draw(performance.now()))
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    })

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(loop)
    })
    intersection.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      intersection.disconnect()
    }
  }, [calmRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    />
  )
}
