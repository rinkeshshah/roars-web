import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import { redirects } from './src/lib/redirects.mjs'

/** `npm run dev` sets this. `astro build` never does. */
const DEV = process.env.ASTRO_DEV === '1'

/** Indexing is OFF unless explicitly switched on. See src/lib/site.ts. */
const ALLOW_INDEXING = process.env.PUBLIC_ALLOW_INDEXING === 'true'

export default defineConfig({
  site: 'https://www.roarsinc.com',

  // Static output. No server runtime, which is the entire security model.
  output: 'static',

  // NON-NEGOTIABLE. All 194 live URLs use trailing slashes.
  // nginx must not strip them either.
  trailingSlash: 'always',

  // Astro emits these as meta-refresh pages by default. We do NOT want that:
  // meta refresh is a weak signal and passes equity poorly. These are emitted
  // as real nginx 301 rules by scripts/generate-nginx-redirects.mjs instead.
  //
  // So the map is applied in DEV ONLY, purely so the dev server behaves like
  // production while developing. A static build gets an empty map and ships
  // no redirect pages at all. scripts/assert-urls.mjs fails the build if a
  // meta-refresh page ever reaches dist/, so this cannot regress silently.
  redirects: DEV ? redirects : {},

  build: {
    // /about-us/index.html rather than /about-us.html, so nginx serves the
    // trailing-slash URL directly with no rewrite.
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  integrations: [
    mdx(),
    // While PUBLIC_ALLOW_INDEXING is unset, every page carries noindex, so
    // shipping a sitemap alongside it would be contradictory. See
    // src/lib/site.ts and docs/NOINDEX.md.
    ...(ALLOW_INDEXING ? [sitemap({
      // lastmod comes from each entry's real updatedAt, never build time.
      // A sitemap where every URL shares one lastmod gets ignored.
      serialize: (item) => item,
      filter: (page) =>
        !page.includes('/thankyou') &&
        !page.includes('/404') &&
        !/\/page\/[2-9]/.test(page),
    })] : []),
  ],

  image: {
    // AVIF first, WebP fallback. Matches the SEO spec.
    formats: ['avif', 'webp'],
  },

  vite: {
    build: {
      // Keep the four islands small and separately cacheable.
      cssCodeSplit: true,
    },
  },
})
