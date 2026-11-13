// Share images (1200×630 PNG) for every prerendered page, called by
// prerender.mjs. Each one shows the page's own heading, so links shared to
// X / LinkedIn / Reddit preview what the page is about. Text is laid out by
// satori (to SVG paths) and rasterised by resvg — no browser needed.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const require = createRequire(import.meta.url)
const WIDTH = 1200
const HEIGHT = 630
const COLORS = {
  bg: '#111316',
  grid: '#1a1c20',
  fg: '#f5f6f7',
  muted: '#9aa0a8',
  brand: '#4ade80',
}

/** Minimal element factory for satori (no JSX in plain .mjs). */
const h = (type, style, ...children) => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
})

const font = (file) =>
  readFile(require.resolve(`@fontsource/inter/files/${file}`))

/** A faint grid of 3px cells, like the site's footer strip, as a data URI. */
const gridBackground = () => {
  const cells = []
  for (let x = 2; x < WIDTH; x += 12)
    for (let y = 2; y < HEIGHT; y += 12)
      cells.push(`<rect x="${x}" y="${y}" width="8" height="8" rx="1"/>`)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}"><g fill="${COLORS.grid}">${cells.join('')}</g></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/** "https://unfollowerschecker.com/tr/instagram" → "unfollowerschecker.com/tr/instagram" */
const displayUrl = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

const img = (src, style) => ({ type: 'img', props: { src, style } })

/**
 * The card: logo + name, the page's heading, and its URL. The grid is a
 * background image (absolutely positioned children would paint over text).
 */
const card = ({ heading, url }, logo, grid) =>
  h(
    'div',
    {
      width: WIDTH,
      height: HEIGHT,
      // satori sizes boxes as content-box by default; keep padding inside.
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 88px 72px 100px',
      backgroundColor: COLORS.bg,
      backgroundImage: `url(${grid})`,
      borderLeft: `12px solid ${COLORS.brand}`,
      fontFamily: 'Inter',
    },
    h(
      'div',
      { display: 'flex', alignItems: 'center', gap: 20 },
      img(logo, { width: 64, height: 64, borderRadius: 14 }),
      h(
        'div',
        { fontSize: 34, fontWeight: 700, color: COLORS.fg },
        'Unfollowers Checker',
      ),
    ),
    h(
      'div',
      {
        display: 'flex',
        fontSize: heading.length > 48 ? 60 : 72,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: -1.5,
        color: COLORS.fg,
        maxWidth: 1000,
      },
      heading,
    ),
    h(
      'div',
      {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 26,
        color: COLORS.muted,
      },
      h('div', { color: COLORS.brand }, displayUrl(url)),
      h('div', {}, 'Free · No password · Open source'),
    ),
  )

/**
 * Render one share image per page into `clientDir`. Each page's
 * `meta.image` is an absolute URL whose path (/og/<key>.png) is the file.
 */
export const generateOgImages = async (pages, clientDir, publicDir) => {
  const [regular, bold, regularExt, boldExt, logoSvg] = await Promise.all([
    font('inter-latin-400-normal.woff'),
    font('inter-latin-700-normal.woff'),
    font('inter-latin-ext-400-normal.woff'),
    font('inter-latin-ext-700-normal.woff'),
    readFile(join(publicDir, 'favicon.svg')),
  ])
  const fonts = [
    { name: 'Inter', data: regular, weight: 400, style: 'normal' },
    { name: 'Inter', data: bold, weight: 700, style: 'normal' },
    // Turkish, German, French and Spanish letters outside basic Latin.
    { name: 'Inter', data: regularExt, weight: 400, style: 'normal' },
    { name: 'Inter', data: boldExt, weight: 700, style: 'normal' },
  ]
  const logo = `data:image/svg+xml;base64,${logoSvg.toString('base64')}`
  const grid = gridBackground()

  let count = 0
  for (const { meta } of pages) {
    const path = new URL(meta.image).pathname
    if (!path.startsWith('/og/')) continue // e.g. the 404 page uses the default
    const svg = await satori(card(meta, logo, grid), {
      width: WIDTH,
      height: HEIGHT,
      fonts,
    })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } })
      .render()
      .asPng()
    const file = join(clientDir, path)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, png)
    count++
  }
  return count
}
