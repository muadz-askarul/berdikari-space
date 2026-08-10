import type { CartItem } from './cart'

function formatHarga(harga: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(harga)
}

export function buildWhatsAppMessage(
  items: CartItem[],
  phoneNumber: string,
): string {
  const lines: string[] = ['Halo Berdikari! Saya mau pesan:', '']

  let total = 0

  items.forEach((item, index) => {
    const subtotal = item.harga * item.quantity
    total += subtotal
    lines.push(
      `${index + 1}. ${item.nama} x${item.quantity} — ${formatHarga(item.harga)} per item`,
    )
    lines.push(`   Subtotal: ${formatHarga(subtotal)}`)
  })

  lines.push('')
  lines.push(`Total: ${formatHarga(total)}`)

  const message = lines.join('\n')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encoded}`
}
