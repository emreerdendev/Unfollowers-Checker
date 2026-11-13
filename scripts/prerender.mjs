// Post-build step: render every public page (home, platforms, FAQ, guides,
// changelog × languages) to static HTML in dist/client, plus 404.html, a
// share image per page and sitemap.xml. Crawlers that don't run
// JavaScript (and most AI crawlers don't) then see real content and per-page
// <head> tags; in the browser React replaces the static markup on mount.
//
// Files are written as /instagram → instagram.html, /tr/instagram →
// tr/instagram.html, which Cloudflare's asset handling serves at the
// extensionless URL. Unknown paths get 404.html with a 404 status
// (assets.not_found_handling = "404-page" in wrangler.jsonc).
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { generateOgImages } from './og-images.mjs'

const root = resolve(import.meta.dirname, '..')
const clientDir = join(root, 'dist/client')
const ssrDir = join(root, 'node_modules/.cache/prerender')
const SITE_URL = 'https://unfollowerschecker.com'

// 1. Bundle the render entry for Node, without the Cloudflare/Tailwind plugins.
await build({
  configFile: false,
  root,
  logLevel: 'warn',
  plugins: [react()],
  build: {
    ssr: 'src/seo/render.tsx',
    outDir: ssrDir,
    emptyOutDir: true,
  },
})
const { renderAll } = await import(
  pathToFileURL(join(ssrDir, 'render.js')).href
)

// 2. Fill the built index.html template for each page.
const template = await readFile(join(clientDir, 'index.html'), 'utf8')

const escapeAttr = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const escapeText = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html))
    throw new Error(`prerender: tag not found: ${pattern}`)
  return html.replace(pattern, replacement)
}

const fill = ({ markup, meta }) => {
  const title = escapeText(meta.title)
  const description = escapeAttr(meta.description)
  let html = template
  html = setTag(html, /<html lang="[^"]*">/, `<html lang="${meta.lang}">`)
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`)
  html = setTag(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${description}" />`,
  )
  html = setTag(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${meta.url}" />`,
  )
  for (const [attr, name, value] of [
    ['property', 'og:url', meta.url],
    ['property', 'og:title', meta.title],
    ['property', 'og:description', meta.description],
    ['property', 'og:image', meta.image],
    ['property', 'og:image:alt', meta.heading],
    ['name', 'twitter:title', meta.title],
    ['name', 'twitter:description', meta.description],
    ['name', 'twitter:image', meta.image],
  ]) {
    html = setTag(
      html,
      new RegExp(`<meta ${attr}="${name}" content="[^"]*" />`),
      `<meta ${attr}="${name}" content="${escapeAttr(value)}" />`,
    )
  }

  const head = [
    ...(meta.robots ? [`<meta name="robots" content="${meta.robots}" />`] : []),
    ...meta.alternates.map(
      ({ hreflang, href }) =>
        `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
    ),
    ...meta.jsonLd.map(
      (data) =>
        `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
    .map((line) => `    ${line}`)
    .join('\n')
  html = setTag(html, /\s*<\/head>/, `\n${head}\n  </head>`)
  html = setTag(
    html,
    /<div id="root"><\/div>/,
    `<div id="root">${markup}</div>`,
  )
  return html
}

const fileFor = (path) =>
  path === '/' ? 'index.html' : `${path.slice(1)}.html`

const pages = await renderAll()
for (const page of pages) {
  const file = join(clientDir, fileFor(page.path))
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, fill(page))
}

// 3. Sitemap with hreflang alternates.
const today = new Date().toISOString().slice(0, 10)
const urls = pages
  .filter(({ indexable }) => indexable)
  .map(({ meta }) => {
    const alternates = meta.alternates
      .map(
        ({ hreflang, href }) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
      )
      .join('\n')
    return `  <url>\n    <loc>${meta.url}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n  </url>`
  })
  .join('\n')
await writeFile(
  join(clientDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
)

// 4. A share image per page.
const images = await generateOgImages(pages, clientDir, join(root, 'public'))

console.log(
  `prerender: ${pages.length} pages (incl. 404) + ${images} share images + sitemap.xml (${SITE_URL})`,
)
