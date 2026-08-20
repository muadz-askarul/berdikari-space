# Katalog — Merchandise Catalog with WhatsApp Checkout

## Problem Statement

Berdikari Space has no way to sell community merchandise. Members see news, events, and media — but when they want to buy community merch, they must ask around or find links manually. There is no single place to browse, no cart to gather multiple items, and no clear "how to buy" flow.

## Solution

A **Katalog** content collection managed from Keystatic, with a public-facing catalog page, product detail pages, a client-side shopping cart stored in `localStorage`, and checkout via WhatsApp. No backend, no payment gateway, no auth — just browse, add to cart, and send a structured order message through WhatsApp.

## User Stories

1. As a pengunjung komunitas, I want to browse a catalog of merchandise, so that I can see what's available for purchase.
2. As a pengunjung komunitas, I want to view detailed information about a product including its description and all images, so that I can decide whether to buy it.
3. As a pengunjung komunitas, I want to see the price of each product clearly displayed, so that I know how much it costs.
4. As a pengunjung komunitas, I want to add a product to my shopping cart from the catalog page, so that I can collect items without navigating away.
5. As a pengunjung komunitas, I want to add a product to my shopping cart from the product detail page with a quantity selector, so that I can buy more than one of the same item.
6. As a pengunjung komunitas, I want to "Pesan via WhatsApp" directly from a product detail page, so that I can order a single item immediately without using the cart.
7. As a pengunjung komunitas, I want to see a cart icon with item count in the header at all times, so that I know how many items are in my cart while browsing.
8. As a pengunjung komunitas, I want to open a slide-out drawer showing my cart summary, so that I can quickly review what I've added without leaving the page.
9. As a pengunjung komunitas, I want to navigate to a full `/keranjang` page, so that I can review, adjust quantities, and remove items before checking out.
10. As a pengunjung komunitas, I want my cart to persist when I close and reopen the browser, so that I don't lose my selected items across sessions.
11. As a pengunjung komunitas, I want to tap "Pesan via WhatsApp" from the cart, so that my order is pre-filled as a structured message listing all products, quantities, subtotals, and the total price.
12. As a pengunjung komunitas, I want the WhatsApp message sent to a single admin phone number, so that the admin receives all orders in one place.
13. As a pengunjung komunitas, I want to increase or decrease item quantities in the cart, so that I can adjust my order without removing and re-adding items.
14. As a pengunjung komunitas, I want to remove an item from the cart, so that I can change my mind about a product.
15. As a admin Berdikari, I want to add new products from Keystatic, so that the catalog is always up to date without touching code.
16. As a admin Berdikari, I want to upload multiple images per product from Keystatic, so that each product is shown in detail.
17. As a admin Berdikari, I want to set a product as draft, so that I can work on it before it goes live.
18. As a admin Berdikari, I want to reorder products manually, so that featured items appear first in the catalog.
19. As a admin Berdikari, I want to set the product price, so that I can update it as needed without code changes.
20. As a pengunjung komunitas, I want the catalog page to be paginated, so that it loads fast even with many products.
21. As a pengunjung komunitas, I want to see the catalog link in the main navigation, so that I can discover it while browsing other sections.
22. As a admin Berdikari, I want to describe size/color options in the product description, so that customers know available variants without a formal variant system.

## Implementation Decisions

### Content collection — `katalog`

A new Astro content collection `katalog` with its own schema, mirrored in Keystatic. This is the data source for all public-facing catalog pages. Content lives in `src/content/katalog/*` as MDX files, editable via Keystatic at `/keystatic`.

**Schema:**
- `nama` — slug field, product name
- `deskripsi` — multiline text, product description (variant info goes here)
- `harga` — number, price in Indonesian Rupiah
- `gambar` — array of images (object with `src: url, title: text`), at least one
- `draft` — boolean, defaults to false
- `order` — number, defaults to 0, for manual sorting
- `content` — MDX body, rich description for the detail page

Follows the existing `media` collection pattern for the images array, and the `postSchema` pattern for `draft` and `order`.

### Routes

- `/katalog/[...page].astro` — paginated list, matches existing `blog/[...page].astro` pattern. Uses `getCollection('katalog')` filtered by `draft !== true`, sorted by `order` then `date`, paginated via Astro's `paginate()`.
- `/katalog/[...id].astro` — single product view, matches existing `blog/[...id].astro` pattern. Renders product images, description (MDX), price, "Tambah ke Keranjang" button, and "Pesan via WhatsApp" button.
- `/keranjang.astro` — dedicated cart page. Reads cart from `localStorage`, renders full table with quantity adjustment, remove buttons, total, and "Pesan via WhatsApp" button.

### Cart state

A React context or a plain JS module implementing a cart store. Operations:

- `getCart()` — returns `CartItem[]` from `localStorage`
- `addToCart(produkId, nama, harga, gambar, quantity)` — merges by `produkId`
- `removeFromCart(produkId)` — removes item
- `updateQuantity(produkId, quantity)` — updates quantity (remove if 0)
- `clearCart()` — empties cart
- `getTotal()` — computes sum of `harga * quantity`

`CartItem` shape:
```
{ produkId: string, nama: string, harga: number, gambar: string, quantity: number }
```

This module is consumed by React components (cart drawer, cart page) via a context provider so the header badge and cart drawer stay in sync.

### WhatsApp message builder

A pure function that takes `CartItem[]` and a phone number from `SITE.whatsappNumber` in `consts.ts`, and returns a `https://wa.me/...` URL with the order as the pre-filled text.

Message format: a greeting, an enumerated list of items with quantity × price = subtotal, and a total line.

### Cart UI

- **Header icon** — cart icon (Lucide `ShoppingCart`) with a count badge. Clicking opens a slide-out drawer (shadcn `Sheet` component). Positioned next to the ThemeToggle in Header.
- **Drawer** — lists cart items with thumbnail, name, quantity, subtotal, remove button. Footer shows total and "Pesan via WhatsApp" + "Lihat Keranjang" buttons.
- **`/keranjang` page** — full-width table/spreadsheet view with quantity stepper and remove buttons. Footer with total and "Pesan via WhatsApp" button.
- **"Tambah ke Keranjang" button** — on catalog card (adds 1) and product detail page (with quantity selector). Shows toast or brief visual feedback on add.
- **"Pesan via WhatsApp" button** — on product detail page (orders just that one product, qty from selector) and in cart drawer + `/keranjang` (orders all cart items).

### Navigation

`NAV_LINKS` in `consts.ts` gets a new entry: `{ href: '/katalog', label: 'Katalog' }`.

### WhatsApp phone number

New field in `consts.ts`: `whatsappNumber` — the admin's WhatsApp number in international format without `+` (e.g. `+6285648813712`). Used by the WhatsApp message builder.

### Images on detail page

Multiple images rendered in a carousel or gallery grid. Can reuse the existing `Carousel.tsx` component (uses Embla Carousel). First image is the primary/hero.

## Testing Decisions

### What makes a good test

Tests verify external user-visible behavior, not implementation internals. A test should assert: given this initial state, when this user action happens, then this observable outcome. Page-level tests use HTML output (text content, element presence, attributes). Unit tests use pure function input → output.

### Test seams

1. **Page routes (integration)** — `/katalog/`, `/katalog/[id]`, `/keranjang`. Verify: products render with correct name/price, draft products are hidden, cart add/remove/update/clear flow via localStorage seeding, WhatsApp button generates correct URL, pagination works.
2. **Cart store (unit)** — `addToCart`, `removeFromCart`, `updateQuantity`, `getTotal`. Verify each mutation against a known `localStorage` state.
3. **WhatsApp message builder (unit)** — verify the URL includes the correct phone number and encoded message text for a given cart.

### Reference tests

No existing test suite in the codebase. This spec introduces the project's first tests. Use Vitest (Vite-native, pairs well with Astro) for unit tests of the cart store and WA builder. For page-level integration tests, use Playwright to navigate pages and assert on rendered output.

## Out of Scope

- Payment gateway integration (Stripe, Midtrans, etc.)
- Order management backend
- Inventory / stock tracking
- User authentication or accounts
- Order history
- Shipping calculation or address collection
- Product variants as structured data (described in `deskripsi` prose only)
- `kategori` / tag filter on catalog
- Search
- Admin dashboard beyond Keystatic CMS

## Further Notes

- The WhatsApp checkout is governed by ADR-0001 (`docs/adr/0001-whatsapp-checkout.md`) — if volume grows, revisit.
- Domain glossary is in `CONTEXT.md` — use **Katalog**, **Produk**, **Keranjang**, **Pesan via WhatsApp** consistently in all code and UI.
- WhatsApp phone number in `consts.ts` is a single admin number. If multiple admins are needed later, switch to an array or a rotation strategy.
