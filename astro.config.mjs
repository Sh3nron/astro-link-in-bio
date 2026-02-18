import { defineConfig } from 'astro/config'

// Use SITE_URL env variable or fallback to localhost
const site = process.env.SITE_URL || 'http://localhost:4321'

export default defineConfig({
  site,
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      assetsInlineLimit: 1024
    }
  }
})
