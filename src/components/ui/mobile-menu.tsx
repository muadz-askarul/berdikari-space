import { useState, useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { NAV_LINKS, SOCIAL_LINKS } from '@/consts'
import { Menu, XIcon } from 'lucide-react'
import { navigate } from 'astro:transitions/client'
import { cn } from '@/lib/utils'
import LucideIcon from './lucide-icon'

const MobileMenu = (props: { children?: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleViewTransitionStart = () => {
      setIsOpen(false)
    }

    document.addEventListener('astro:before-swap', handleViewTransitionStart)

    return () => {
      document.removeEventListener(
        'astro:before-swap',
        handleViewTransitionStart,
      )
    }
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 sm:hidden"
        title="Menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon className="size-5" /> : <Menu className="size-5" />}
        <span className="sr-only">Open menu</span>
      </Button>
      {isOpen && (
        <div className="bg-background absolute top-[60px] left-0 z-50 flex h-screen w-screen duration-300 ease-in-out">
          <div className="relative h-full w-full flex-col items-center justify-center pt-6">
            {NAV_LINKS.map((item) => (
              <div className="flex flex-col">
                <Button
                  variant="link"
                  className="justify-start rounded-none px-8 text-red-400/90 capitalize transition-colors"
                  onClick={() => navigate(item.href)}
                >
                  {item.label}
                </Button>
                <div className="border-b-[1.5px] border-red-400/90"></div>
              </div>
            ))}
            <div className="hover:text-foreground/80 mt-4 text-red-400/90">
              <ul
                className="flex flex-wrap justify-center gap-2"
                role="list"
                key={'mobile menu'}
              >
                {SOCIAL_LINKS.map(({ href, label }) => (
                  <li key={'mobile-' + label}>
                    <a
                      href={href}
                      aria-label={label}
                      title={label}
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'icon' }),
                        'rounded-full border-none',
                      )}
                    >
                      {isOpen && <LucideIcon name={label} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileMenu
