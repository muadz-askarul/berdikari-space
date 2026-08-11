# Berdikari Space

Situs komunitas Berdikari — ruang bersama untuk cerita, kabar, acara, media, dan sekarang katalog produk.

## Language

**Katalog**:
Kumpulan produk yang dijual untuk mendukung komunitas (merchandise, bukan menu kopi).
_Avoid_: Toko, Shop, Store, Menu

**Produk**:
Satu barang dagangan dalam Katalog. Punya nama, deskripsi, harga, dan satu atau lebih gambar.
_Avoid_: Barang, Item, Menu

**Keranjang**:
Tempat menampung Produk yang dipilih sebelum checkout. Disimpan di `localStorage` — tidak butuh login.
_Avoid_: Cart, Troli, Basket

**Pesan via WhatsApp**:
Cara checkout. Membuka aplikasi WhatsApp dengan pesan terstruktur berisi daftar Produk di Keranjang, jumlah, harga satuan, subtotal, dan total. Tidak ada backend, tidak ada payment gateway.
_Avoid_: Checkout, Order, Beli
