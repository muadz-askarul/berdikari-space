# WhatsApp-based checkout — no backend, no payment gateway

Katalog Berdikari tidak menggunakan backend ecommerce, payment gateway, atau sistem order management. Checkout dilakukan dengan membuka WhatsApp yang berisi pesan terstruktur — daftar Produk, jumlah, harga, dan total. Semua state Keranjang disimpan di `localStorage`.

**Why:** Berdikari adalah situs komunitas statis (Astro, Vercel SSR), bukan platform ecommerce. Volume transaksi rendah — hanya merchandise komunitas. Backend ecommerce akan menambah biaya infrastruktur dan kompleksitas yang tidak proporsional. WhatsApp sudah menjadi saluran komunikasi utama komunitas Indonesia; flow ini familiar bagi pengguna target.

**Trade-off:** Tidak ada inventory tracking otomatis, tidak ada payment automation, tidak ada order history. Jika volume tumbuh signifikan di masa depan, ini harus diganti dengan backend ecommerce sungguhan (Medusa, Shopify, atau custom).
