import { useCallback } from 'react'
import { ShoppingCart, Minus, Plus, X, Trash2 } from 'lucide-react'
import {
  getCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  type CartItem,
} from '@/lib/cart'
import { onCartChange } from '@/lib/cart-events'
import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Separator } from '@/components/ui/separator'

function formatHarga(harga: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(harga)
}

function useCartStore() {
  const subscribe = useCallback((callback: () => void) => {
    return onCartChange(callback)
  }, [])

  const cart = useSyncExternalStore(
    subscribe,
    () => getCart(),
    () => [],
  )

  const total = cart.reduce((sum, item) => sum + item.harga * item.quantity, 0)

  return { cart, total }
}

export default function KeranjangPage() {
  const { cart, total } = useCartStore()

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <ShoppingCart className="size-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Keranjang kosong</h2>
        <p className="text-muted-foreground">
          Belum ada produk di keranjang. Yuk, lihat katalog kami!
        </p>
        <a
          href="/katalog"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Lihat Katalog
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Keranjang ({cart.reduce((s, i) => s + i.quantity, 0)} item)
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={clearCart}
        >
          <Trash2 className="size-3.5" />
          Kosongkan
        </Button>
      </div>

      {/* Table header — hidden on mobile, visible md+ */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_40px] md:gap-4 md:text-sm md:font-medium md:text-muted-foreground">
        <span>Produk</span>
        <span className="text-center">Harga</span>
        <span className="text-center">Jumlah</span>
        <span className="text-right">Subtotal</span>
        <span />
      </div>

      <Separator />

      {/* Cart items */}
      <div className="divide-y">
        {cart.map((item) => (
          <KeranjangItemRow key={item.produkId} item={item} />
        ))}
      </div>

      <Separator />

      {/* Footer */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-primary tabular-nums">
            {formatHarga(total)}
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <WhatsAppButton items={cart} variant="default" size="lg" />
        </div>
      </div>
    </div>
  )
}

function KeranjangItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex flex-col gap-3 py-4 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_40px] md:items-center md:gap-4">
      {/* Product info */}
      <div className="flex items-center gap-3">
        <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted md:size-12">
          <img
            src={item.gambar}
            alt={item.nama}
            className="size-full object-cover"
          />
        </div>
        <span className="text-sm font-medium">{item.nama}</span>
      </div>

      {/* Harga */}
      <div className="flex items-center justify-between md:justify-center">
        <span className="text-xs text-muted-foreground md:hidden">Harga</span>
        <span className="text-sm tabular-nums">{formatHarga(item.harga)}</span>
      </div>

      {/* Qty */}
      <div className="flex items-center justify-between md:justify-center">
        <span className="text-xs text-muted-foreground md:hidden">Jumlah</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateQuantity(item.produkId, item.quantity - 1)}
            className="inline-flex size-7 items-center justify-center rounded border text-xs hover:bg-accent"
            aria-label="Kurangi"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-8 text-center text-sm tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.produkId, item.quantity + 1)}
            className="inline-flex size-7 items-center justify-center rounded border text-xs hover:bg-accent"
            aria-label="Tambah"
          >
            <Plus className="size-3" />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between md:justify-end">
        <span className="text-xs text-muted-foreground md:hidden">
          Subtotal
        </span>
        <span className="text-sm font-medium tabular-nums">
          {formatHarga(item.harga * item.quantity)}
        </span>
      </div>

      {/* Remove */}
      <div className="flex justify-end">
        <button
          onClick={() => removeFromCart(item.produkId)}
          className="inline-flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Hapus"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
