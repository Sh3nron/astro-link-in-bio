import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'

// Use SITE_URL env variable or fallback to localhost
const site = process.env.SITE_URL || 'http://localhost:4321'
const astroPrerenderEntrypoint = fileURLToPath(
  new URL('./node_modules/astro/dist/entrypoints/prerender.js', import.meta.url)
)

export default defineConfig({
  site,
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    resolve: {
      // Work around Astro's internal bare-specifier resolution under pnpm on Windows.
      alias: {
        'astro/entrypoints/prerender': astroPrerenderEntrypoint
      }
    },
    build: {
      cssMinify: true,
      minify: 'esbuild',
      assetsInlineLimit: 1024
    }
  }
})
