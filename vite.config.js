import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function loadSiteJson() {
  const p = path.join(__dirname, 'src', 'data', 'site.json')
  return JSON.parse(readFileSync(p, 'utf-8'))
}

function escAttr(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function escTitle(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

function injectSeo(html) {
  const site = loadSiteJson()
  const seo = site.seo || {}
  const title = seo.documentTitle || 'Paul — Portfolio Data Science'
  const desc =
    seo.metaDescription ||
    site.subtitle ||
    'Portfolio Data Science — projets, certifications et bibliothèque de connaissances.'
  const siteUrl = String(seo.siteUrl || '').replace(/\/$/, '')
  const ogPath = seo.ogImage || '/og-image.svg'
  const ogImageAbs = siteUrl ? `${siteUrl}${ogPath}` : ogPath
  const twitterSite = String(seo.twitterSite || '').trim()

  const extras = []
  if (siteUrl) {
    extras.push(`<link rel="canonical" href="${escAttr(`${siteUrl}/`)}" />`)
    extras.push(`<meta property="og:url" content="${escAttr(`${siteUrl}/`)}" />`)
  }

  const twitterSiteTag = twitterSite
    ? `<meta name="twitter:site" content="${escAttr(twitterSite)}" />`
    : ''

  return html
    .replaceAll('__OPENPAUL_TITLE__', escTitle(title))
    .replaceAll('__OPENPAUL_DESC__', escAttr(desc))
    .replaceAll('__OPENPAUL_OG_TITLE__', escAttr(title))
    .replaceAll('__OPENPAUL_OG_DESC__', escAttr(desc))
    .replaceAll('__OPENPAUL_TW_TITLE__', escAttr(title))
    .replaceAll('__OPENPAUL_TW_DESC__', escAttr(desc))
    .replaceAll('__OPENPAUL_OG_IMAGE__', escAttr(ogImageAbs))
    .replaceAll('__OPENPAUL_TW_IMAGE__', escAttr(ogImageAbs))
    .replace('__OPENPAUL_EXTRA_HEAD__', extras.join('\n    '))
    .replace('__OPENPAUL_TWITTER_SITE__', twitterSiteTag)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'openpaul-seo-inject',
      transformIndexHtml(html) {
        return injectSeo(html)
      },
    },
  ],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/d3')) return 'd3'
          if (id.includes('node_modules/d3-cloud')) return 'd3-cloud'
          if (id.includes('node_modules/react-router')) return 'router'
        },
      },
    },
  },
})
