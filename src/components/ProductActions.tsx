import { useState } from 'react'
import { ShoppingCart, MessageCircle, Check, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/lib/cart'
import { buildWhatsAppMessage } from '@/lib/whatsapp'
import { SITE } from '@/consts'
import type { CartItem } from '@/lib/cart'

export default function ProductActions({
  produkId,
  nama,
  harga,
  gambar,
}: {
  produkId: string
  nama: string
  harga: number
  gambar: string
}) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const waItem: CartItem = { produkId, nama, harga, gambar, quantity }
  const waHref = buildWhatsAppMessage([waItem], SITE.whatsappNumber)

  const handleAddToCart = () => {
    addToCart({ produkId, nama, harga, gambar, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-md border">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="inline-flex size-9 items-center justify-center hover:bg-accent"
          aria-label="Kurangi"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-10 text-center text-sm tabular-nums">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="inline-flex size-9 items-center justify-center hover:bg-accent"
          aria-label="Tambah"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {added ? (
        <Button variant="outline" className="gap-2" disabled>
          <Check className="size-4" />
          Ditambahkan
        </Button>
      ) : (
        <Button onClick={handleAddToCart} className="gap-2">
          <ShoppingCart className="size-4" />
          Tambah ke Keranjang
        </Button>
      )}

      <Button variant="outline" className="gap-2" asChild>
        <a href={waHref} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4" />
          Pesan via WhatsApp
        </a>
      </Button>
    </div>
  )
}
