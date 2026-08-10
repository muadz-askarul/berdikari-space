const STORAGE_KEY = 'berdikari-cart'

export type CartItem = {
  produkId: string
  nama: string
  harga: number
  gambar: string
  quantity: number
}

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getCart(): CartItem[] {
  return readCart()
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
}

export function removeFromCart(produkId: string): void {
  const cart = readCart()
  writeCart(cart.filter((i) => i.produkId !== produkId))
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
  }
}

export function clearCart(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getTotal(): number {
  return readCart().reduce((sum, item) => sum + item.harga * item.quantity, 0)
}
