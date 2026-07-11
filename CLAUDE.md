# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm run dev          # Dev server on http://localhost:1234
npm run build        # astro check + astro build (typecheck first)
npm run preview      # Preview the production build
npm run prettier     # Format all .ts/.tsx/.css/.astro files
```

No test suite is configured.

## Architecture

**Astro 7** static site with **Tailwind 4** + **shadcn/ui** (Radix UI React primitives) + **MDX** content. Deployed to Vercel via `@astrojs/vercel`.

### Content collections (`src/content.config.ts`)

Six collections, all MDX-based, loaded via `astro:content` glob loader:

| Collection | Path | Schema notes |
|---|---|---|
| `blog`, `news`, `event` | `src/content/<name>/*` | Identical schemas: title, description, date, tags, authors, image, draft, order |
| `media` | `src/content/media/*` | Like posts but with an `images` array |
| `authors` | `src/content/authors/*` | Name, avatar, social links |
| `projects` | `src/content/projects/*` | Name, description, tags, link, dates |

**Subposts**: a post whose id contains `/` (e.g., `parent-post/child`) is treated as a subpost of the parent. `src/lib/data-utils.ts` has the full subpost logic — `isSubpost()`, `getParentId()`, `getSubpostsForParent()`, TOC generation, combined reading time, adjacent-post navigation that walks subpost siblings.

### Routing

Each post collection (blog/news/event) has two page routes:
- `[...page].astro` — paginated list (uses `SITE.postsPerPage`)
- `[...id].astro` — single post view, resolves subposts and renders TOC sidebar

Other pages: `/`, `/about`, `/authors`, `/authors/[...id]`, `/tags`, `/tags/[...id]`, `/media/[...page]`, `/media/[...id]`, `/404`.

### Theme system (`src/components/ThemeToggle.astro`)

Dark/light mode controlled by `data-theme` attribute on `<html>`. Tailwind's `dark:` variant is configured via `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))` in `global.css`. CSS custom properties switch in `[data-theme='dark']`.

Two scripts in ThemeToggle:
- **Inline `is:inline` script** — runs synchronously on initial page load only, reads `localStorage` (falls back to `prefers-color-scheme`), sets `data-theme` to prevent FOUC. Does NOT use `data-astro-rerun`.
- **Bundled script** — handles the toggle click and registers an `astro:after-swap` listener that re-applies the theme after each client-side navigation.

### View transitions

`<ClientRouter />` from `astro:transitions` is in `Head.astro`. The `<header>` and `<ThemeToggle>` use `transition:persist` to survive navigations. `astro:after-swap` in ThemeToggle restores theme post-navigation.

### Keystatic CMS (`keystatic.config.ts`)

Content management UI at `/keystatic`. GitHub storage backend (repo: `muadz-askarul/berdikari-space`). Collections in Keystatic mirror the Astro content collections.

### Component split

- `src/components/ui/*.tsx` — shadcn/ui React primitives (button, badge, dropdown-menu, pagination, scroll-area, separator, breadcrumb, avatar)
- `src/components/*.astro` — Astro components for layout and content display
- `src/lib/data-utils.ts` — all data-fetching wrappers around `getCollection()` from `astro:content`
- `src/lib/utils.ts` — `cn()` (tailwind-merge + clsx), `formatDate()`, `readingTime()`, `calculateWordCountFromHtml()`
- `src/consts.ts` — site config, nav links, social links
- `src/styles/global.css` — Tailwind import, CSS custom properties for light/dark, `@font-face` for Geist

### Path aliases (`tsconfig.json`)

`@/*` → `./src/*`, `@assets/*` → `./src/assets/*`
