import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://your-domain.com',
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
  },
  security: {
    csp: {
      scriptDirective: {
        resources: ["'self'"]
      },
      styleDirective: {
        resources: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"]
      }
    }
  }
})
