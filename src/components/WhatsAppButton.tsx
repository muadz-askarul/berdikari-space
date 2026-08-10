import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildWhatsAppMessage } from '@/lib/whatsapp'
import { SITE } from '@/consts'
import type { CartItem } from '@/lib/cart'

export default function WhatsAppButton({
  items,
  variant = 'outline',
  size = 'default',
  className,
}: {
  items: CartItem[]
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}) {
  const href = buildWhatsAppMessage(items, SITE.whatsappNumber)

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="gap-2"
      >
        <MessageCircle className="size-4" />
        Pesan via WhatsApp
      </a>
    </Button>
  )
}
