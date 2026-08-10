const CART_CHANGE_EVENT = 'berdikari-cart-change'

export function notifyCartChange(): void {
  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT))
}

export function onCartChange(callback: () => void): () => void {
  window.addEventListener(CART_CHANGE_EVENT, callback)
  return () => window.removeEventListener(CART_CHANGE_EVENT, callback)
}
