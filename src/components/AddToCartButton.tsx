import { useState } from 'react'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { addToCart, type CartItem } from '@/lib/cart'
import { Button } from '@/components/ui/button'

export default function AddToCartButton({
  produkId,
  nama,
  harga,
  gambar,
  showQuantity = false,
  variant = 'default',
}: {
  produkId: string
  nama: string
  harga: number
  gambar: string
  showQuantity?: boolean
  variant?: 'default' | 'outline'
}) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    const item: CartItem = { produkId, nama, harga, gambar, quantity }
    addToCart(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (added) {
    return (
      <Button variant="outline" className="gap-2" disabled>
        <Check className="size-4" />
        Ditambahkan
      </Button>
    )
  }

  if (showQuantity) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="inline-flex size-9 items-center justify-center hover:bg-accent"
            aria-label="Kurangi"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-10 text-center text-sm tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="inline-flex size-9 items-center justify-center hover:bg-accent"
            aria-label="Tambah"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <ShoppingCart className="size-4" />
          Tambah ke Keranjang
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleAdd} variant={variant} size="sm" className="gap-1.5">
      <ShoppingCart className="size-3.5" />
      Tambah
    </Button>
  )
}
