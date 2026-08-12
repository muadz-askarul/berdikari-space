import { useState, useEffect, useSyncExternalStore, useCallback } from 'react'
import { ShoppingCart, X, Minus, Plus } from 'lucide-react'
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  getTotal,
  type CartItem,
} from '@/lib/cart'
import { onCartChange } from '@/lib/cart-events'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import WhatsAppButton from '@/components/WhatsAppButton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const EMPTY_CART: CartItem[] = []

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

  const cart = useSyncExternalStore(subscribe, () => getCart(), () => EMPTY_CART)

  const total = cart.reduce((sum, item) => sum + item.harga * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return { cart, total, itemCount }
}

function CartItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex gap-3 py-3">
      <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={item.gambar}
          alt={item.nama}
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <p className="truncate text-sm font-medium">{item.nama}</p>
          <p className="text-xs text-muted-foreground">
            {formatHarga(item.harga)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(item.produkId, item.quantity - 1)}
              className="inline-flex size-6 items-center justify-center rounded border text-xs hover:bg-accent"
              aria-label="Kurangi"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-xs tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.produkId, item.quantity + 1)}
              className="inline-flex size-6 items-center justify-center rounded border text-xs hover:bg-accent"
              aria-label="Tambah"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tabular-nums">
              {formatHarga(item.harga * item.quantity)}
            </span>
            <button
              onClick={() => removeFromCart(item.produkId)}
              className="inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Hapus"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartButton() {
  const { cart, total, itemCount } = useCartStore()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
          aria-label={`Keranjang (${itemCount} item)`}
        >
          <ShoppingCart className="size-5" />
          {itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground tabular-nums">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Keranjang</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <ShoppingCart className="size-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Keranjang masih kosong.
            </p>
            <SheetClose asChild>
              <a
                href="/katalog"
                className="text-sm font-medium text-primary hover:underline"
              >
                Lihat Katalog
              </a>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="divide-y">
                {cart.map((item) => (
                  <CartItemRow key={item.produkId} item={item} />
                ))}
              </div>
            </ScrollArea>

            <SheetFooter>
              <Separator />
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-bold text-primary tabular-nums">
                  {formatHarga(total)}
                </span>
              </div>
              <WhatsAppButton items={cart} className="w-full" />
              <SheetClose asChild>
                <a
                  href="/keranjang"
                  className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Lihat Keranjang
                </a>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
