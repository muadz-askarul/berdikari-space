import { describe, it, expect } from 'vitest'
import { buildWhatsAppMessage } from './whatsapp'
import type { CartItem } from './cart'

const kaos: CartItem = {
  produkId: 'kaos-berdikari',
  nama: 'Kaos Berdikari',
  harga: 150000,
  gambar: '',
  quantity: 2,
}

const stiker: CartItem = {
  produkId: 'stiker-berdikari',
  nama: 'Stiker Berdikari',
  harga: 15000,
  gambar: '',
  quantity: 1,
}

describe('buildWhatsAppMessage', () => {
  it('returns a wa.me URL with the correct phone number', () => {
    const url = buildWhatsAppMessage([kaos], '6281234567890')
    expect(url).toMatch(/^https:\/\/wa\.me\/6281234567890\?text=/)
  })

  it('encodes the message in the URL', () => {
    const url = buildWhatsAppMessage([kaos], '6281234567890')
    expect(url).toContain('Kaos%20Berdikari')
    expect(url).toContain('Rp')
  })

  it('includes item name, quantity, unit price, and subtotal', () => {
    const url = buildWhatsAppMessage([kaos], '6281234567890')
    const text = decodeURIComponent(url.split('?text=')[1])
    expect(text).toContain('Kaos Berdikari')
    expect(text).toContain('x2')
    expect(text).toContain('Rp')
  })

  it('includes total for multiple items', () => {
    const url = buildWhatsAppMessage([kaos, stiker], '6281234567890')
    const text = decodeURIComponent(url.split('?text=')[1])
    expect(text).toContain('Total')
    expect(text).toContain('315.000') // 300000 + 15000
  })

  it('handles empty cart gracefully', () => {
    const url = buildWhatsAppMessage([], '6281234567890')
    expect(url).toMatch(/^https:\/\/wa\.me\/6281234567890\?text=/)
  })

  it('formats greeting in Indonesian', () => {
    const url = buildWhatsAppMessage([kaos], '6281234567890')
    const text = decodeURIComponent(url.split('?text=')[1])
    expect(text).toContain('Halo')
  })
})
