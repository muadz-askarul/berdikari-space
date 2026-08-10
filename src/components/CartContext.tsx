import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import {
  getCart,
  addToCart as addToCartStore,
  removeFromCart as removeFromCartStore,
  updateQuantity as updateQuantityStore,
  clearCart as clearCartStore,
  getTotal as getTotalStore,
  type CartItem,
} from '@/lib/cart'

type CartContextValue = {
  cart: CartItem[]
  itemCount: number
  total: number
  addToCart: (item: CartItem) => void
  removeFromCart: (produkId: string) => void
  updateQuantity: (produkId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  const addToCart = useCallback((item: CartItem) => {
    addToCartStore(item)
    setCart(getCart())
  }, [])

  const removeFromCart = useCallback((produkId: string) => {
    removeFromCartStore(produkId)
    setCart(getCart())
  }, [])

  const updateQuantity = useCallback(
    (produkId: string, quantity: number) => {
      updateQuantityStore(produkId, quantity)
      setCart(getCart())
    },
    [],
  )

  const clearCart = useCallback(() => {
    clearCartStore()
    setCart([])
  }, [])

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = getTotalStore()

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
