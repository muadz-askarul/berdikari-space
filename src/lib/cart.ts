import { notifyCartChange } from './cart-events'

const STORAGE_KEY = 'berdikari-cart'

export type CartItem = {
  produkId: string
  nama: string
  harga: number
  gambar: string
  quantity: number
}

function readCart(raw?: string | null): CartItem[] {
  let value = raw
  if (value === undefined) {
    try {
      value = localStorage.getItem(STORAGE_KEY)
    } catch {
      value = null
    }
  }
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

let cache: { raw: string | null; items: CartItem[] } | null = null

export function getCart(): CartItem[] {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    raw = null // SSR / no localStorage
  }
  if (cache && cache.raw === raw) return cache.items
  const items = readCart(raw)
  cache = { raw, items }
  return items
}

export function addToCart(item: CartItem): void {
  const cart = readCart()
  const existing = cart.find((i) => i.produkId === item.produkId)
  if (existing) {
    existing.quantity += item.quantity
  } else {
    cart.push({ ...item })
  }
  writeCart(cart)
  notifyCartChange()
}

export function removeFromCart(produkId: string): void {
  const cart = readCart()
  writeCart(cart.filter((i) => i.produkId !== produkId))
  notifyCartChange()
}

export function updateQuantity(produkId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(produkId)
    return
  }
  const cart = readCart()
  const item = cart.find((i) => i.produkId === produkId)
  if (item) {
    item.quantity = quantity
    writeCart(cart)
    notifyCartChange()
  }
}

export function clearCart(): void {
  localStorage.removeItem(STORAGE_KEY)
  notifyCartChange()
}

export function getTotal(): number {
  return readCart().reduce((sum, item) => sum + item.harga * item.quantity, 0)
}
