# Roars 2.0 SEO Specification

Complete parameter set for the Next.js build. Every value here is either measured from the live site or a decision that needs to hold on launch day.

Read with `ROARS-V2-BUILD-SPEC.md`. That one covers stack and migration. This one is only SEO.

---

## 0. What the live site is doing today

Measured from `https://www.roarsinc.com/our-journal/why-typography-matters-in-ux/`.

| Signal | Live value | Carry over? |
|---|---|---|
| Canonical | `https://www.roarsinc.com/our-journal/why-typography-matters-in-ux/` | Yes. www, trailing slash, self-referencing. |
| `meta robots` | `index,follow` | Yes |
| `meta googlebot` | `index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1` | Yes, as `robots` directives |
| `meta bingbot` | same as googlebot | Yes |
| `og:type` | `article` | Yes |
| `og:site_name` | `Crafting digital experiences to help ambitious` | **No. This is broken.** Truncated tagline leaking into site name. Fix to `Roars Technologies`. |
| `twitter:domain` | `Crafting digital experiences to help ambitious` | **No. Same bug.** Should be `roarsinc.com`. |
| `twitter:card` | `summary_large_image` | Yes |
| `twitter:site` / `creator` | `@roarstech` | Yes |
| `article:author` | `Avinash` | Yes, but move to a proper author entity |
| `article:published_time` / `modified_time` | ISO8601 with offset | Yes |
| `article:publisher` | `https://www.facebook.com/roarstech/` | Optional, low value |
| `meta keywords` | `typography` | Drop. Ignored by every engine since 2009. |
| `generator` | `Elementor 4.2.4` | Drop |
| `cdp-version` | `1.5.6` | Drop |
| Facebook Pixel | `244992704662747` (fires PageView) | Yes, move into GTM |
| `msapplication-TileImage` | `/wp-content/uploads/2022/07/cropped-bg-logo-yellow-270x270.png` | Replace with new icon set |

**Action:** before touching anything, open view-source on the live homepage and copy out the GTM container ID (`GTM-XXXXXXX`), the GA4 measurement ID (`G-XXXXXXXXXX`), any LinkedIn Insight partner ID, and the Google Search Console and Bing verification meta tags. Those go straight into env vars. The pixel ID above is already captured.

---

## 1. Global site constants

```ts
// src/lib/site.ts
export const site = {
  name:        'Roars Technologies',
  shortName:   'Roars',
  legalName:   'Roars Technologies Pvt. Ltd.',
  url:         'https://www.roarsinc.com',   // canonical host, no trailing slash
  locale:      'en_US',
  language:    'en',
  titleSuffix: ' | Roars Technologies',
  defaultOgImage: '/og/roars-default-1200x630.jpg',
  twitter:     '@roarstech',
  founded:     '2005',
  email:       'sales@roarsinc.com',
  phones:      { US: '+1-302-505-1200', UK: '+44-7537-183399' },
  sameAs: [
    'https://www.linkedin.com/company/roars-technologies-pvt.-ltd.',
    'https://twitter.com/roarstech',
    'https://www.instagram.com/roarstech',
    'https://www.facebook.com/roarstech/',
  ],
}
```

```js
// next.config.js (non-negotiable)
trailingSlash: true,
```

---

## 2. The URL map (corrected against the live site)

The handoff route table does not match reality. These are the live paths. **Use these, not the handoff's.**

| Handoff proposed | Live URL that already ranks | Decision |
|---|---|---|
| `/agency` | `/about-us/` | Use `/about-us/`. Label it "Agency" in the nav. |
| `/contact` | `/contact-us/` | Use `/contact-us/` |
| `/approach` | `/approach/` | Match. No change. |
| `/projects` | `/work/` | Use `/work/` |
| `/projects/[slug]` | `/work/[slug]/` | Use `/work/[slug]/`. Ten live case studies. |
| `/services/ai-automation` | `/s/ai-automation-services/` | Use `/s/[slug]/`. Eleven live service pages. |
| `/industries/[slug]` | `/industries/[slug]/` | Match. Eight live pages. |
| `/insights` | `/our-journal/` | Use `/our-journal/`. Label it "Insights". |
| `/insights/[slug]` | `/our-journal/[slug]/` | Use `/our-journal/[slug]/` |
| `/resources` | `/resources/` | Match |
| `/resources/guides/[slug]` | verify in sitemap | Confirm before building |
| `/brand` | does not exist | New. Low priority, `noindex` until it has a job. |

### Confirmed live URL inventory (partial, from nav and footer)

```
/
/about-us/
/approach/
/work/
/work/warehouse-compliance-checklist-app/     Snowman Logistics
/work/parqly-parking-solution/
/work/concierge-loyalty-program/
/work/advisee/
/work/companyguru/
/work/gymbait/
/work/ventura-law-firm/
/work/gisaid-health-tech/
/work/the-presidents-club/
/work/411drives-on-demand-car-loan-app/
/startup-consultant-services/                 services landing
/s/ai-automation-services/
/s/digital-business-transformation-services/
/s/ecommerce-development-company/
/s/growth-hacking-agency/
/s/hire-dedicated-developers/
/s/innovation-design-company/
/s/mobile-app-development/
/s/mvp-development/
/s/product-development-company/
/s/result-oriented-devops-services/
/s/user-experience-design-agency/
/industries/food-restaurant-app-development/
/industries/on-demand-fitness-app-development/
/industries/retail-ecommerce-development/
/industries/concierge-app-development/
/industries/travel-and-hospitality-app-development/
/industries/logistics-transportation-app-development/
/industries/saas-application-development-services/
/industries/healthcare-app-development-company/
/resources/
/our-journal/
/our-journal/[slug]/                          ~60+ posts
/category/our-journal/[category]/
/category/our-journal/[category]/page/[n]/
/contact-us/
/terms-of-service/
/privacy-policy/                              verify
```

Still needs pulling from the sitemap: the full post list, the full category list, the guides paths, any author or tag archives.

### Redirect rules

| From | To | Code |
|---|---|---|
| `http://*` | `https://*` | 301 |
| `roarsinc.com/*` (apex) | `www.roarsinc.com/*` | 301 |
| any URL without trailing slash | same URL with trailing slash | 308 (Next handles this) |
| uppercase path | lowercase path | 301 |
| `?replytocom=`, `?utm_*` on content URLs | strip, canonical to clean URL | canonical only, no redirect |
| any retired post | nearest live equivalent | 301, never to homepage |

Rules: maximum one hop. No 302 on anything permanent. No chains. Keep the map in `docs/REDIRECTS.ts`, imported into `next.config.js`.

---

## 3. Per-page meta parameters

Every page emits this set, server rendered, in the initial HTML response.

### 3.1 Required on every page

```html
<title>{seo.title || fallbackPattern}</title>
<meta name="description" content="{seo.description}">
<link rel="canonical" href="{site.url}{path}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8">
<meta name="theme-color" content="#FFD400">

<meta property="og:type"        content="{website|article}">
<meta property="og:site_name"   content="Roars Technologies">
<meta property="og:locale"      content="en_US">
<meta property="og:title"       content="{seo.title}">
<meta property="og:description" content="{seo.description}">
<meta property="og:url"         content="{canonical}">
<meta property="og:image"       content="{ogImage}">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type"   content="image/jpeg">
<meta property="og:image:alt"    content="{imageAlt}">

<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:site"        content="@roarstech">
<meta name="twitter:creator"     content="@roarstech">
<meta name="twitter:title"       content="{seo.title}">
<meta name="twitter:description" content="{seo.description}">
<meta name="twitter:image"       content="{ogImage}">
<meta name="twitter:image:alt"   content="{imageAlt}">
```

### 3.2 Additional on article pages only

```html
<meta property="article:published_time" content="{ISO8601}">
<meta property="article:modified_time"  content="{ISO8601}">
<meta property="article:section"        content="{primaryCategory}">
<meta property="article:tag"            content="{tag}">   <!-- repeatable -->
<meta property="article:author"         content="{authorUrl}">
```

### 3.3 Do not ship

`keywords`, `generator`, `revisit-after`, `rating`, `distribution`, `author` as a bare name, `og:publish_date`, `cdp-version`, `msapplication-*` beyond the icon set.

### 3.4 Title and description rules

| Rule | Value |
|---|---|
| Title length | 50 to 60 characters including the suffix. Hard warn above 60. |
| Title pattern | `{unique}{titleSuffix}` unless a manual override is set |
| Duplicate titles | Blocked at publish. Uniqueness checked across the whole content set. |
| Description length | 140 to 160 characters. Warn below 120, block above 165. |
| Description content | Must contain the primary intent phrase. Must not begin with the brand name. |
| H1 | Exactly one per page. Must carry the primary intent. May differ from the title. |
| Heading order | H1 then H2 then H3. No skipped levels. No heading used for styling. |

### 3.5 Title patterns by page type

| Route | Title pattern | og:type | Schema | Index |
|---|---|---|---|---|
| `/` | `{proposition} \| Roars Technologies` | website | Organization + WebSite + ProfessionalService | yes |
| `/about-us/` | `About Roars \| {n} Products Since 2005` | website | AboutPage + Organization | yes |
| `/approach/` | manual | website | WebPage | yes |
| `/work/` | `Our Work \| Roars Technologies` | website | CollectionPage + ItemList | yes |
| `/work/[slug]/` | `{client} Case Study \| Roars Technologies` | article | CreativeWork + BreadcrumbList | yes |
| `/s/[slug]/` | manual, keyword led | website | Service + BreadcrumbList + FAQPage if FAQs | yes |
| `/industries/[slug]/` | manual, keyword led | website | Service + BreadcrumbList + FAQPage if FAQs | yes |
| `/our-journal/` | `Our Journal \| Roars Technologies` | website | Blog + ItemList | yes |
| `/our-journal/[slug]/` | `{postTitle} \| Roars Technologies` | article | BlogPosting + BreadcrumbList | yes |
| `/category/our-journal/[cat]/` | `{category} Archives \| Roars Technologies` | website | CollectionPage | yes (page 1 only) |
| `/category/.../page/[n]/` | `{category} Archives, Page {n} \| ...` | website | CollectionPage | **noindex, follow** |
| `/resources/` | manual | website | CollectionPage | yes |
| `/resources/guides/[slug]/` | `{guide} Template \| Free Download` | website | HowTo or WebPage + BreadcrumbList | yes |
| `/contact-us/` | `Contact Roars \| Offices in 5 Countries` | website | ContactPage + Organization | yes |
| `/terms-of-service/`, `/privacy-policy/` | manual | website | WebPage | yes |
| `/thank-you/`, form success | any | website | none | **noindex, nofollow** |
| `/search/`, filtered views | any | website | none | **noindex, follow** |
| `/404` | any | website | none | **noindex**, must return HTTP 404 |

---

## 4. robots.txt

Generated by `app/robots.ts`.

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*?s=
Disallow: /search/
Disallow: /thank-you/

# AI crawlers: allowed on purpose. Citations are distribution.
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Scrapers with no upside
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: https://www.roarsinc.com/sitemap.xml
```

Note: `Google-Extended` controls Gemini training only. It has zero effect on Google Search or AI Overviews, which use `Googlebot`. Blocking it would not protect rankings and would cut you out of Gemini answers.

`dev.roarsinc.com` stays on HTTP 403 plus `X-Robots-Tag: noindex, nofollow` at the Traefik layer. A robots.txt disallow alone does not prevent indexing of a URL that is linked elsewhere.

---

## 5. llms.txt

Serve at `/llms.txt`. Plain markdown, no more than 100 lines.

```markdown
# Roars Technologies

Product development and design agency. 250+ products shipped since 2005.
Offices in India, USA, UK, Belgium and Germany.

## Services
- [AI Automation](https://www.roarsinc.com/s/ai-automation-services/): agents, workflow automation, RAG assistants
- [Product Development](https://www.roarsinc.com/s/product-development-company/)
- [User Experience Design](https://www.roarsinc.com/s/user-experience-design-agency/)
- [Mobile App Development](https://www.roarsinc.com/s/mobile-app-development/)
- [MVP Development](https://www.roarsinc.com/s/mvp-development/)

## Work
- [Case studies](https://www.roarsinc.com/work/)

## Writing
- [Our Journal](https://www.roarsinc.com/our-journal/)

## Contact
sales@roarsinc.com | +1 (302) 505-1200 | +44 (7537) 183399
```

---

## 6. Sitemaps

`app/sitemap.ts` emits a sitemap index. Each child sitemap is generated from a Payload query.

| File | Contents |
|---|---|
| `/sitemap.xml` | index, references all below |
| `/sitemap-pages.xml` | static and Page collection |
| `/sitemap-services.xml` | `/s/*` |
| `/sitemap-industries.xml` | `/industries/*` |
| `/sitemap-work.xml` | `/work/*` |
| `/sitemap-posts.xml` | `/our-journal/*` |
| `/sitemap-categories.xml` | category page 1 only |
| `/sitemap-guides.xml` | `/resources/guides/*` |
| `/sitemap-images.xml` | optional, for the case study imagery |

Rules:
- `<lastmod>` is the document's real `updatedAt`, in W3C datetime with timezone. Never build time. A sitemap where every URL shares one lastmod gets ignored.
- Omit `<priority>` and `<changefreq>`. Google has ignored both for years.
- Exclude anything with `noindex: true`, `_status: draft`, or paginated beyond page 1.
- Split at 50,000 URLs or 50MB.
- Regenerate on publish via the same Payload `afterChange` hook that calls `revalidatePath()`.

---

## 7. Structured data

All JSON-LD, all server rendered. Google does process JS-injected schema but with delay, and December 2025 guidance is explicit that time-sensitive markup belongs in the initial HTML.

### 7.1 Organization plus WebSite, on the homepage only

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://www.roarsinc.com/#organization",
      "name": "Roars Technologies",
      "legalName": "Roars Technologies Pvt. Ltd.",
      "alternateName": "Roars",
      "url": "https://www.roarsinc.com/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.roarsinc.com/#logo",
        "url": "https://www.roarsinc.com/brand/roars-logo-512.png",
        "width": 512, "height": 512
      },
      "image": { "@id": "https://www.roarsinc.com/#logo" },
      "foundingDate": "2005",
      "founder": {
        "@type": "Person",
        "name": "Rinkesh Shah",
        "jobTitle": "Founder and CEO"
      },
      "sameAs": [
        "https://www.linkedin.com/company/roars-technologies-pvt.-ltd.",
        "https://twitter.com/roarstech",
        "https://www.instagram.com/roarstech",
        "https://www.facebook.com/roarstech/"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+1-302-505-1200",
          "contactType": "sales",
          "areaServed": ["US", "CA"],
          "availableLanguage": ["en"]
        },
        {
          "@type": "ContactPoint",
          "telephone": "+44-7537-183399",
          "contactType": "sales",
          "areaServed": ["GB", "EU"],
          "availableLanguage": ["en"]
        }
      ],
      "email": "sales@roarsinc.com",
      "address": [
        { "@type": "PostalAddress", "addressLocality": "Bengaluru", "addressRegion": "Karnataka", "addressCountry": "IN" },
        { "@type": "PostalAddress", "addressLocality": "Frisco", "addressRegion": "TX", "addressCountry": "US" },
        { "@type": "PostalAddress", "addressLocality": "London", "addressCountry": "GB" },
        { "@type": "PostalAddress", "addressLocality": "Heist op den Berg", "addressCountry": "BE" },
        { "@type": "PostalAddress", "addressLocality": "München", "addressCountry": "DE" }
      ],
      "knowsAbout": [
        "Product Development", "User Experience Design", "Mobile App Development",
        "MVP Development", "AI Automation", "Digital Transformation"
      ],
      "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 11, "maxValue": 50 }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.roarsinc.com/#website",
      "url": "https://www.roarsinc.com/",
      "name": "Roars Technologies",
      "publisher": { "@id": "https://www.roarsinc.com/#organization" },
      "inLanguage": "en-US"
    }
  ]
}
```

Only add `potentialAction: SearchAction` if the site actually has a working `/search/?q=` endpoint. Do not fake it.

### 7.2 BlogPosting, on journal posts

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "{canonical}#article",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "{canonical}" },
  "headline": "{title, max 110 chars}",
  "description": "{seo.description}",
  "image": ["{featured1200x630}", "{featured1200x900}", "{featured1200x1200}"],
  "datePublished": "{ISO8601 with offset}",
  "dateModified": "{ISO8601 with offset}",
  "author": {
    "@type": "Person",
    "name": "{author.name}",
    "url": "https://www.roarsinc.com/about-us/#{author.slug}"
  },
  "publisher": { "@id": "https://www.roarsinc.com/#organization" },
  "articleSection": "{primaryCategory}",
  "keywords": "{tags joined}",
  "wordCount": {n},
  "inLanguage": "en-US"
}
```

`dateModified` must move when you actually edit the post. Faking it on every deploy is a known spam signal.

### 7.3 Service, on `/s/*` and `/industries/*`

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "{canonical}#service",
  "name": "{service name}",
  "description": "{seo.description}",
  "serviceType": "{e.g. AI Automation Services}",
  "provider": { "@id": "https://www.roarsinc.com/#organization" },
  "areaServed": [
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "India" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "{service name}",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "{sub-service}" } }
    ]
  }
}
```

No `aggregateRating` unless you have real, on-page, verifiable reviews. Self-serving review markup on a service page is a manual action waiting to happen.

### 7.4 BreadcrumbList, every nested route

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.roarsinc.com/" },
    { "@type": "ListItem", "position": 2, "name": "Our Journal", "item": "https://www.roarsinc.com/our-journal/" },
    { "@type": "ListItem", "position": 3, "name": "{post title}" }
  ]
}
```

Last item carries no `item` property. Breadcrumbs must be visible on the page, not schema-only.

### 7.5 FAQPage

Only where real Q&A is rendered in the DOM. The Main page and the AI Automation page both have accordions that qualify. Answers in the schema must match the visible text word for word.

### 7.6 CreativeWork, on `/work/[slug]/`

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{project name}",
  "about": "{client}",
  "creator": { "@id": "https://www.roarsinc.com/#organization" },
  "datePublished": "{ISO8601}",
  "image": "{hero}",
  "description": "{summary}"
}
```

### 7.7 CollectionPage plus ItemList, on index routes

Standard `ItemList` with `position` and `url` per entry. Cap at the number actually rendered on page 1.

**Validation gate:** every schema block passes Google's Rich Results Test and schema.org validator before merge. Wire it into CI if you can.

---

## 8. Open Graph images

| Property | Value |
|---|---|
| Dimensions | 1200 x 630 |
| Format | JPEG, under 300KB |
| Fallback | `/og/roars-default-1200x630.jpg` |
| Per-post | Featured image, auto-cropped to 1.91:1 |
| Generated | Use `next/og` (`ImageResponse`) to auto-compose title plus the mark on yellow for posts with no featured image |
| Absolute URLs | Always. Relative OG image paths fail in most crawlers. |

The generated variant is worth building. It means no post ever ships with a blank share card, which is most of what OG is actually for.

---

## 9. Icons and manifest

```
/favicon.ico                    32x32 multi-res
/icon.svg                       monochrome-safe mark
/apple-touch-icon.png           180x180
/icon-192.png  /icon-512.png    PWA
/site.webmanifest
```

```json
{
  "name": "Roars Technologies",
  "short_name": "Roars",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#FFD400",
  "background_color": "#FFFFFF",
  "display": "standalone"
}
```

---

## 10. hreflang

**Decision: do not implement.** There is one language and one URL set. Adding hreflang for five office countries with identical English content creates duplicate signals and no benefit. Use `Organization.address` and `Service.areaServed` in the schema to express geography instead.

Revisit only if you ever publish genuinely localised content, for example a German-language `/de/` tree.

---

## 11. Image SEO

| Parameter | Rule |
|---|---|
| Component | `next/image` everywhere. No raw `<img>`. |
| Formats | AVIF first, WebP fallback, via `images.formats` |
| Dimensions | Always explicit `width` and `height`, or `fill` with a sized parent. This is your CLS defence. |
| LCP image | `priority` plus `fetchPriority="high"` plus a `<link rel="preload">` |
| Below fold | `loading="lazy"`, the default |
| Alt text | Descriptive, under 125 characters, required by validation on content images. `alt=""` on decorative only. |
| Filenames | Lowercase hyphenated, keyword-relevant. Preserve the existing `wp-content` filenames on migration so indexed image URLs keep resolving. |
| Legacy paths | Rewrite `/wp-content/uploads/*` to the new media route |
| Max source | 2400px wide, then let Next resize |
| Captions | Real `<figcaption>` where editorial |

---

## 12. Core Web Vitals budgets

| Metric | Target p75 | Hard fail |
|---|---|---|
| LCP | under 2.0s | 2.5s |
| INP | under 150ms | 200ms |
| CLS | under 0.05 | 0.1 |
| TTFB | under 600ms | 800ms |
| Total JS | under 180KB gzipped | 250KB |
| Total page (home) | under 1.2MB | 1.8MB |

Design-specific risks, each with its fix:

1. **212px hero wordmark over a full-bleed photo.** That photo is the LCP element. Preload it, serve AVIF, set explicit `sizes`, add a blur placeholder.
2. **`mix-blend-mode: difference`** on the wordmark. Extra compositing plus a legibility gamble. Ship a solid-colour fallback and test against the real hero.
3. **Projects cross-fade reads `scrollY` directly.** Main thread work on every scroll event. Rebuild on `IntersectionObserver` plus a rAF-throttled handler. Skip under `prefers-reduced-motion`.
4. **Inter at six weights from Google Fonts.** Self-host one variable file, latin subset, `font-display: swap`, `size-adjust` metric-matched fallback. Preload it.
5. **The footer is 1105px tall on every page** with a background image. Lazy-load that image and reserve its height.

Monitoring: Vercel Speed Insights or a self-hosted `web-vitals` beacon into GA4, plus the CrUX report in Search Console. Field data, not Lighthouse scores.

---

## 13. HTTP headers

Applied once as a Traefik middleware, reused by every stack.

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: SAMEORIGIN
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Content-Security-Policy: (report-only first, then enforce)
```

CSP needs to allow `googletagmanager.com`, `google-analytics.com`, `connect.facebook.net`, `challenges.cloudflare.com` and your own media host. Start in report-only for two weeks and read the reports before enforcing, or you will silently break GTM.

Caching:

```
Static assets (/_next/static/*)  Cache-Control: public, max-age=31536000, immutable
Images                           public, max-age=31536000, immutable
HTML pages                       public, max-age=0, s-maxage=3600, stale-while-revalidate=86400
Sitemaps and robots              public, max-age=3600
```

---

## 14. Analytics and tag setup

Everything below already exists on the live site. Copy the IDs, do not re-create the containers, or you lose historical continuity.

### 14.1 What to copy

| Tag | Where to find it | Env var |
|---|---|---|
| GTM container | view-source, `GTM-XXXXXXX` | `NEXT_PUBLIC_GTM_ID` |
| GA4 measurement ID | inside GTM, or `G-XXXXXXXXXX` in source | `NEXT_PUBLIC_GA4_ID` |
| Facebook Pixel | `244992704662747` (confirmed) | `NEXT_PUBLIC_FB_PIXEL_ID` |
| LinkedIn Insight | view-source, `_linkedin_partner_id` | `NEXT_PUBLIC_LI_PARTNER_ID` |
| GSC verification | existing `google-site-verification` meta | `GSC_VERIFICATION` |
| Bing verification | existing `msvalidate.01` meta | `BING_VERIFICATION` |

Load GTM once, from the root layout, via `next/script` with `strategy="afterInteractive"`. Everything else (GA4, pixel, LinkedIn) fires **through** GTM, not as separate script tags. One container, one source of truth.

```tsx
// app/layout.tsx
<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
```

Keep the `<noscript>` iframe in `<body>`.

### 14.2 SPA page views

Next.js App Router does client-side navigation, so GTM's default History Change trigger needs care. Push an explicit page view on route change:

```tsx
'use client'
useEffect(() => {
  window.dataLayer?.push({
    event: 'page_view_spa',
    page_path: pathname,
    page_title: document.title,
    page_location: window.location.href,
  })
}, [pathname, searchParams])
```

Then in GTM, fire GA4 on `page_view_spa` and disable the built-in enhanced measurement page view for history changes. Otherwise you will double-count every navigation, which is the single most common Next.js analytics bug.

### 14.3 dataLayer event spec

Define these once and use them everywhere. Names are GA4 recommended-event names where one exists.

| Event | Fires when | Parameters |
|---|---|---|
| `page_view_spa` | client route change | `page_path`, `page_title`, `page_location` |
| `form_start` | first field focus | `form_name`, `page_path` |
| `form_submit` | submit clicked | `form_name`, `page_path` |
| `generate_lead` | server confirms write | `form_name`, `lead_type`, `value`, `currency` |
| `form_error` | validation or server error | `form_name`, `error_type` |
| `file_download` | guide or company profile PDF | `file_name`, `file_extension`, `link_url` |
| `cta_click` | any primary or ghost button | `cta_label`, `cta_location`, `link_url` |
| `outbound_click` | external link | `link_url`, `link_domain` |
| `nav_open` | full-screen menu overlay opens | `source` |
| `scroll_depth` | 25 / 50 / 75 / 90 percent | `percent_scrolled`, `page_path` |
| `video_start` / `video_complete` | if video lands in the hero | `video_title` |
| `newsletter_subscribe` | footer subscribe success | `location` |
| `booking_click` | `meet.roarsinc.com/sales` click | `cta_location` |

Mark `generate_lead`, `booking_click`, `file_download` and `newsletter_subscribe` as GA4 key events.

**Important:** fire `generate_lead` from the server response, not from the submit handler. Firing on click counts bots and failed submissions as leads.

### 14.4 Consent Mode v2

You take EU, UK and US traffic. Consent Mode v2 is required for Google Ads and Analytics data to keep flowing from EEA and UK visitors.

```js
// must run BEFORE the GTM snippet
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500,
})
```

Then `gtag('consent','update', {...})` on acceptance. Use a CMP (Cookiebot, Iubenda, or a simple self-built banner geo-gated to EEA and UK). Region-scope it so India and US visitors are not asked unnecessarily.

### 14.5 Server-side capture

The form already writes to Mongo. Also push a server-side conversion so you have a source of truth independent of ad blockers:

- Meta Conversions API from the form handler, deduplicated against the pixel via `event_id`
- Optional: GA4 Measurement Protocol for `generate_lead`

### 14.6 Do not lose

Before switching DNS: export GA4 custom definitions, audiences, key event configuration and any Looker Studio dashboards that point at the property. Keep the same GA4 property. A new property resets every comparison you have.

---

## 15. Payload SEO field schema

This is what makes the whole thing enforceable rather than aspirational.

```ts
// fields/seo.ts
export const seoFields: Field[] = [
  {
    type: 'group', name: 'seo', label: 'SEO',
    fields: [
      { name: 'title', type: 'text', required: true, maxLength: 65,
        admin: { description: 'Aim for 50 to 60 characters including the suffix.' },
        validate: (v) => v && v.length >= 30 || 'Too short to be useful.' },

      { name: 'description', type: 'textarea', required: true, maxLength: 165,
        validate: (v) => v && v.length >= 120 || 'Aim for 140 to 160 characters.' },

      { name: 'primaryIntent', type: 'text', required: true,
        admin: { description: 'The phrase this page is meant to answer. Used in validation.' } },

      { name: 'ogImage', type: 'upload', relationTo: 'media' },
      { name: 'canonicalOverride', type: 'text' },
      { name: 'noindex', type: 'checkbox', defaultValue: false },
      { name: 'schemaType', type: 'select',
        options: ['WebPage','Article','BlogPosting','Service','CreativeWork','FAQPage','CollectionPage'] },
      { name: 'humanReviewed', type: 'checkbox', defaultValue: false },
    ],
  },
]
```

### Publish-time validation hook

`beforeChange`, only when `_status` moves to `published`. Blocks the save.

| Check | Threshold | Result |
|---|---|---|
| Title length | 30 to 65 | block |
| Title uniqueness | no other published doc has it | block |
| Description length | 120 to 165 | block |
| Description uniqueness | no exact duplicate | block |
| `primaryIntent` appears in H1 | true | warn |
| Body word count | 300 minimum | block |
| Content uniqueness vs siblings | 40% warn, 30% block | see below |
| Internal links in body | 3 to 5 | warn |
| Images without alt | 0 | block |
| `humanReviewed` | true | block if false |
| H1 count | exactly 1 | block |
| Heading levels | no skips | warn |
| Broken internal links | 0 | block |

Uniqueness is measured as words unique to this document divided by total body words, compared against every other published doc in the same collection. Shared header, nav and footer are excluded. Template boilerplate is included, which is the point.

### Programmatic rollout gate

For `services` and `industries`, which are the collections most likely to scale:

- Publishing more than 20 documents in a rolling 7-day window requires an explicit override flag
- Never publish more than 100 at once
- After each batch of 50 to 100, wait 2 to 4 weeks and check indexing and rankings before the next
- The standalone test, on every page: would this be worth publishing if no sibling page existed? A restaurant page and a fitness page that differ only by noun should be one page.

---

## 16. Pre-launch QA checklist

**Crawl and index**
- [ ] Every URL in `URL-INVENTORY.csv` returns 200 or exactly one 301
- [ ] Zero redirect chains, zero 302s on permanent moves
- [ ] `trailingSlash: true` confirmed on every route
- [ ] Apex and http both 301 to `https://www.`
- [ ] Self-referencing canonical on every page, correct in **view-source**
- [ ] No accidental `noindex` in production build
- [ ] `robots.txt` live, references the sitemap index
- [ ] Sitemap index live, all children valid, `lastmod` values are real
- [ ] `dev.roarsinc.com` still 403 plus `X-Robots-Tag: noindex`
- [ ] 404 page returns HTTP 404, not 200
- [ ] Category `page/2+` are `noindex, follow`

**Meta and schema**
- [ ] No duplicate titles or descriptions anywhere
- [ ] `og:site_name` is `Roars Technologies`, not the truncated tagline
- [ ] `twitter:domain` is `roarsinc.com`
- [ ] All OG images absolute, 1200x630, under 300KB
- [ ] One H1 per page, no skipped heading levels
- [ ] Every schema block passes Rich Results Test
- [ ] FAQ schema answers match visible text exactly
- [ ] `dateModified` reflects real edits

**Performance**
- [ ] LCP, INP, CLS green on home, a journal post, a service page and a case study
- [ ] Fonts self-hosted and preloaded
- [ ] Hero image preloaded, AVIF served
- [ ] Total JS under 180KB gzipped
- [ ] Tested on 4G throttle, not just desktop

**Security**
- [ ] securityheaders.com grade A
- [ ] CSP enforced, GTM and pixel still firing
- [ ] Valid SSL, no mixed content

**Analytics**
- [ ] Same GTM container, same GA4 property
- [ ] Page views fire once per navigation, not twice
- [ ] All 13 dataLayer events fire and land in GA4 DebugView
- [ ] Key events marked in GA4
- [ ] Consent Mode v2 default-denied before GTM loads
- [ ] Meta CAPI deduplicating against the pixel
- [ ] Forms write to Mongo, send both emails, and fire `generate_lead` server side

**Day one after launch**
- [ ] Submit the sitemap index in Search Console
- [ ] Request indexing on the top 20 URLs by clicks
- [ ] Ping IndexNow
- [ ] Watch Coverage and Crawl Stats daily for two weeks
- [ ] Compare clicks and impressions week over week against the pre-launch baseline you captured in Step 0
