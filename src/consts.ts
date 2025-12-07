import type { IconMap, SocialLink, Site, NavLink } from '@/types/types'
import type { Carousel } from '@/types/carousel'

export const SITE: Site = {
  title: 'Berdikari Space',
  description: 'Berdikari Space adalah ',
  href: 'https://berdikari-space.vercel.app',
  author: 'muadz_askarul',
  locale: 'id-ID',
  featuredPostCount: 5,
  postsPerPage: 10,
}

export const NAV_LINKS: NavLink[] = [
  {
    href: '/news',
    label: 'Tajuk Berdikari',
  },
  {
    href: '/blog',
    label: 'Cerita Dari Komunitas',
  },
  {
    href: '/event',
    label: 'Events',
  },
  {
    href: '/media',
    label: 'Media',
  },
  {
    href: '/about',
    label: 'Tentang Kami',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://www.instagram.com/berdikarikopi/',
    label: 'Instagram',
  },
  // {
  //   href: '',
  //   label: 'xComIcon',
  // },
  // {
  //   href: '',
  //   label: 'Mail',
  // },
]

export const ICON_MAP: IconMap = {
  Globe: 'lucide:globe',
  Github: 'lucide:github',
  Twitter: 'lucide:twitter',
  Mail: 'lucide:mail',
  Instagram: 'lucide:instagram',
  Rss: 'lucide:rss',
  xComIcon: 'xComIcon',
}

export const CarouselData: Carousel[] = [
  {
    title: 'Bekasi Art Exhibition',
    description: 'Pameran seni di Bekasi',
    image:
      'https://images.unsplash.com/photo-1584966393708-db43bab83773?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    href: 'blog/callouts-component',
  },
  {
    title: 'Fufufafa? Ugh!',
    description: 'Oops, bercandaa~ bercandaa~',
    image:
      'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    href: 'blog/callouts-component',
  },
]
