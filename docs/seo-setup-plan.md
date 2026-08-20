# SEO Gap-Fill Plan

Goal: close identified SEO gaps on berdikari-space (Astro 7, Vercel). Baseline exists — sitemap, canonical, OG/Twitter cards, Organization JSON-LD, RSS, favicons. This plan adds the missing pieces. No design/visual changes.

## Current state (verified 2026-08-11)

| Item | Status |
|---|---|
| `@astrojs/sitemap` + `site` | ✅ `astro.config.ts` |
| title/description/canonical/robots meta | ✅ `PageHead.astro`, `PostHead.astro` |
| OG + Twitter cards | ✅ both heads |
| Organization JSON-LD | ✅ `Head.astro:48-54` |
| RSS (`/rss.xml`) | ✅ `src/pages/rss.xml.ts` |
| favicons + webmanifest | ✅ `public/` |
| `robots.txt` | ❌ missing |
| Per-page JSON-LD (Article/Product/Breadcrumb) | ❌ only Organization |
| Subpost noindex | ✅ `PostHead.astro:26` (but subposts still in sitemap) |
| OG image per product | ❌ `PageHead` hardcodes `1200x630.png` |

## Changes

### 1. `public/robots.txt` (new file)

```
User-agent: *
Allow: /
Sitemap: https://berdikarispace.com/sitemap-index.xml
```

### 2. Sitemap filter — exclude noindex pages (`astro.config.ts`)

Subposts are `noindex` (`PostHead.astro:26`) but still appear in sitemap. Add `filter` to the sitemap integration:

```ts
sitemap({
  filter: (page) => {
    const path = new URL(page).pathname
    if (path === '/404/') return false
    const segments = path.split('/').filter(Boolean)
    // subposts are nested parent/child (e.g. /blog/parent/child) — noindex, exclude
    return segments.length <= 2
  },
}),
```

Rationale: all first-level pages (lists `/blog`, pagination `/blog/2`, detail `/katalog/slug`, `/tags/slug`, `/media/x`) are ≤2 segments. Only subposts exceed 2. `/404/` excluded explicitly.

### 3. Product JSON-LD — `src/pages/katalog/[...id].astro`

Inject before `</head>` (in the existing `<PageHead slot="head">` block area):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": produk.data.nama,
  "description": produk.data.deskripsi,
  "image": produk.data.gambar.map(g => new URL(g.src, Astro.site)),
  "offers": {
    "@type": "Offer",
    "price": produk.data.harga,
    "priceCurrency": "IDR",
    "availability": "https://schema.org/InStock",
    "url": new URL(Astro.url.pathname, Astro.site)
  }
}
```

Implementation: small inline `<script type="application/ld+json" set:html={...}>` in the page's head slot, same pattern as `Head.astro:48`.

### 4. Article JSON-LD — `src/pages/blog/[...id].astro`, `news/[...id].astro`, `event/[...id].astro`

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.data.title,
  "description": post.data.description,
  "image": post.data.image ? new URL(post.data.image.src, Astro.site) : null,
  "datePublished": post.data.date,
  "author": { "@type": "Organization", "name": SITE.title },
  "publisher": { "@type": "Organization", "name": SITE.title, "url": SITE.href }
}
```

Post data shape verified: `title, description, date, image` exist on all three collections. Subposts already noindex — Article schema also skipped for subposts (consistent with noindex).

### 5. BreadcrumbList JSON-LD — katalog detail + post detail pages

Match existing visual breadcrumbs. Katalog detail already renders `<Breadcrumbs>` (katalog → product). Add:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Katalog", "item": "https://berdikarispace.com/katalog" },
    { "@type": "ListItem", "position": 2, "name": produk.data.nama, "item": "<current url>" }
  ]
}
```

Posts: list page URL (`/blog`) → post URL. Keep to katalog + blog/news/event detail pages (skip subposts).

### 6. Per-product OG image — `PageHead.astro`

Add optional `image?: string` prop → overrides `og:image` / `twitter:image` (default stays `1200x630.png`). Katalog detail passes `produk.data.gambar[0].src`. Pattern matches `PostHead.astro:31-34`.

## Out of scope (noted, not doing)

- `rehypeExternalLinks` adds `nofollow` to all external content links (deliberate config; changing it is a policy decision)
- Per-author/archive pages (authors have no individual SEO treatment — covered by generic PageHead)
- `hreflang`/i18n (single locale `id-ID`)

## Verification

1. `npm run build` — astro check 0 errors
2. `npx vitest run src/lib/cart.test.ts` — unaffected, still 16 pass
3. Dev server: inspect `/robots.txt`, `/sitemap-index.xml` (no subposts, no /404), katalog detail page head (Product + BreadcrumbList JSON-LD, og:image = product image), blog post head (Article + BreadcrumbList)
