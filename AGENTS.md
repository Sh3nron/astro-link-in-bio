# AGENTS.md - Astro Link-in-Bio

## Overview

Stunning link-in-bio page built with **Astro 6 Beta**, **Tailwind CSS v4**, and pure CSS glassmorphism effects. Zero JavaScript runtime overhead - only an inline script for theme detection. Optimized for Cloudflare Workers Static Assets deployment.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Astro | 6.0.0-beta.11 | Static site generator |
| Tailwind CSS | 4.1.9 | Utility-first CSS with `@theme inline` |
| TypeScript | 5.x | Type safety |
| PostCSS | 8.5 | CSS processing |
| Sharp | 0.34.5 | Image optimization |
| pnpm | - | Package manager |

## Commands

```bash
pnpm dev      # Start dev server at localhost:4321
pnpm build    # Build for production to ./dist/
pnpm preview  # Preview production build locally
```

## Project Structure

```
src/
├── pages/
│   └── index.astro           # Entry page
├── layouts/
│   └── Layout.astro          # Root layout (meta, fonts, theme script, SEO)
├── components/
│   ├── LinkBioPage.astro     # Main page composition
│   ├── LinkCard.astro        # Glassmorphism link cards
│   ├── ProfileSection.astro  # Avatar + name (Astro Picture component)
│   ├── ThemeToggle.astro     # iOS-style dark/light toggle
│   └── SocialFooter.astro    # Social media icons footer
├── assets/
│   └── profile.svg           # Profile image (auto-optimized to AVIF/WebP)
└── styles/
    └── globals.css           # Theme CSS variables, glassmorphism, animations

public/                       # Static assets (icons, favicons)
astro.config.mjs              # Astro configuration
postcss.config.mjs            # PostCSS + Tailwind v4
wrangler.jsonc                # Cloudflare Workers deployment config
```

## Architecture Patterns

### Component Hierarchy

```
index.astro
└── Layout.astro (SEO, meta, theme script)
    └── LinkBioPage.astro
        ├── ThemeToggle.astro
        ├── ProfileSection.astro
        ├── LinkCard.astro (multiple)
        └── SocialFooter.astro
```

### CSS Architecture

- **Color System**: oklch color space for perceptually uniform colors
- **Dark Mode**: `.dark` class on `<html>` element
- **Glassmorphism Classes**:
  - `.glass-card` - Link cards with frosted glass effect
  - `.glass-pill` - Rounded pill containers
  - `.glass-profile` - Profile image container
  - `.glass-icon` - Icon backgrounds
- **Animation Classes**:
  - `.animate-fade-in-up` - Entrance animation
  - `.animation-delay-*` - Staggered delays (100, 200, 250, 300, 350, 400ms)
  - `.animate-float-*` - Background orb animations (1-4)
  - `.bg-orb-*` - Gradient orb backgrounds (1-4)

### Theme System

Dark/light mode implemented via:
1. System preference detection via `prefers-color-scheme`
2. localStorage persistence
3. Manual toggle via iOS-style switch
4. No flash on load (inline script runs before render)

## Code Conventions

### TypeScript

- Strict mode enabled (`extends: "astro/tsconfigs/strict"`)
- Path alias: `@/*` maps to `./src/*`
- Interface Props patterns for all Astro components

### Styling

- Tailwind v4 with `@theme inline` pattern in globals.css
- Custom CSS properties for theming (see `:root` and `.dark`)
- All icons are inline SVGs (Lucide-style)
- Responsive: mobile-first design, max-width 400px container

### Astro Patterns

- `is:inline` for theme script (must run immediately)
- `<slot name="icon" />` for icon injection in LinkCard
- Astro's `<Picture />` component for image optimization (AVIF/WebP)
- `loading="eager"` for above-the-fold images

## Customization Guide

### 1. Profile Information

Edit `src/components/LinkBioPage.astro`:

```astro
<ProfileSection
  name="Your Name"
  bio="Your Title or Tagline"
  image={profileImage}
/>
```

Replace `src/assets/profile.svg` with your image.

### 2. Links

Edit `LinkCard` components in `src/components/LinkBioPage.astro`:

```astro
<LinkCard title="Title" description="Description" href="https://url.com">
  <svg slot="icon"><!-- SVG icon --></svg>
</LinkCard>
```

### 3. Social Icons

Edit `src/components/SocialFooter.astro` - replace `#` with your URLs.

### 4. Colors & Theme

Edit CSS variables in `src/styles/globals.css`:

```css
:root {
  --background: oklch(0.98 0.005 90);
  --card: oklch(1 0 0 / 0.7);
  /* ... */
}

.dark {
  --background: oklch(0.15 0 0);
  --card: oklch(0.2 0 0 / 0.7);
  /* ... */
}
```

### 5. Site Metadata

- `astro.config.mjs`: Set `site: 'https://your-domain.com'`
- `src/layouts/Layout.astro`: Update `siteName` and default `description`

## Deployment

### Cloudflare Workers (Primary)

```bash
pnpm build
wrangler deploy
```

Config in `wrangler.jsonc`:
```jsonc
{
  "name": "astro-link-in-bio",
  "compatibility_date": "2025-04-01",
  "assets": { "directory": "./dist/" }
}
```

### Other Platforms

| Platform | Command |
|----------|---------|
| Vercel | `npx vercel` |
| Netlify | `netlify deploy --prod` |
| GitHub Pages | Use `@astrojs/github` adapter |

## Security

- Content Security Policy (CSP) configured in `astro.config.mjs`
- Scripts: `'self'` only
- Styles: `'self'`, Google Fonts allowed
- All external links use `rel="noopener noreferrer"`

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 100 |
| Lighthouse Accessibility | 100 |
| Total Bundle | ~15KB |
| Profile Image (AVIF) | ~3KB |
| CSS (minified) | ~8KB |
| JavaScript | ~0.5KB (inline only) |

## Important Notes

- **No client-side framework** - pure static HTML with CSS animations
- **Image optimization** - Astro auto-generates AVIF/WebP variants
- **Build optimizations** - `compressHTML`, `inlineStylesheets: 'auto'`, `cssMinify`, esbuild minification
- **Prefers-reduced-motion**: Not currently implemented - add `@media (prefers-reduced-motion: reduce)` if needed
