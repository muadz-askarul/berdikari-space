import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getTotal,
  type CartItem,
} from './cart'

function mockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((k) => delete store[k])
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
}

const STORAGE_KEY = 'berdikari-cart'

beforeEach(() => {
  const mock = mockLocalStorage()
  vi.stubGlobal('localStorage', mock)
})

const kaosItem: CartItem = {
  produkId: 'kaos-berdikari',
  nama: 'Kaos Berdikari',
  harga: 150000,
  gambar: '@assets/images/katalog/kaos-berdikari.jpg',
  quantity: 1,
}

const stikerItem: CartItem = {
  produkId: 'stiker-berdikari',
  nama: 'Stiker Berdikari',
  harga: 15000,
  gambar: '@assets/images/katalog/stiker.jpg',
  quantity: 2,
}

describe('getCart', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(getCart()).toEqual([])
  })

  it('returns stored cart items from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([kaosItem]))
    expect(getCart()).toEqual([kaosItem])
  })
})

describe('addToCart', () => {
  it('adds a new item to empty cart', () => {
    addToCart(kaosItem)
    expect(getCart()).toEqual([{ ...kaosItem, quantity: 1 }])
  })

  it('increments quantity when adding existing produkId', () => {
    addToCart(kaosItem)
    addToCart(kaosItem)
    expect(getCart()).toEqual([{ ...kaosItem, quantity: 2 }])
  })

  it('adds a second different item', () => {
    addToCart(kaosItem)
    addToCart(stikerItem)
    expect(getCart()).toHaveLength(2)
    expect(getCart()).toContainEqual({ ...kaosItem, quantity: 1 })
    expect(getCart()).toContainEqual({ ...stikerItem, quantity: 2 })
  })

  it('accepts explicit quantity', () => {
    addToCart({ ...kaosItem, quantity: 3 })
    expect(getCart()).toEqual([{ ...kaosItem, quantity: 3 }])
  })
})

describe('removeFromCart', () => {
  it('removes an item by produkId', () => {
    addToCart(kaosItem)
    addToCart(stikerItem)
    removeFromCart('kaos-berdikari')
    expect(getCart()).toEqual([{ ...stikerItem, quantity: 2 }])
  })

  it('is no-op for non-existent produkId', () => {
    addToCart(kaosItem)
    removeFromCart('nonexistent')
    expect(getCart()).toEqual([{ ...kaosItem, quantity: 1 }])
  })
})

describe('updateQuantity', () => {
  it('updates quantity of existing item', () => {
    addToCart(kaosItem)
    updateQuantity('kaos-berdikari', 5)
    expect(getCart()).toEqual([{ ...kaosItem, quantity: 5 }])
  })

  it('removes item when quantity set to 0', () => {
    addToCart(kaosItem)
    updateQuantity('kaos-berdikari', 0)
    expect(getCart()).toEqual([])
  })

  it('removes item when quantity set to negative', () => {
    addToCart(kaosItem)
    updateQuantity('kaos-berdikari', -1)
    expect(getCart()).toEqual([])
  })

  it('is no-op for non-existent produkId', () => {
    addToCart(kaosItem)
    updateQuantity('nonexistent', 5)
    expect(getCart()).toEqual([{ ...kaosItem, quantity: 1 }])
  })
})

describe('clearCart', () => {
  it('removes all items', () => {
    addToCart(kaosItem)
    addToCart(stikerItem)
    clearCart()
    expect(getCart()).toEqual([])
  })

  it('is no-op on empty cart', () => {
    clearCart()
    expect(getCart()).toEqual([])
  })
})

describe('getTotal', () => {
  it('returns 0 for empty cart', () => {
    expect(getTotal()).toBe(0)
  })

  it('returns correct sum of harga * quantity', () => {
    addToCart(kaosItem) // 150000 * 1 = 150000
    addToCart({ ...stikerItem, quantity: 3 }) // 15000 * 3 = 45000
    expect(getTotal()).toBe(195000)
  })
})
