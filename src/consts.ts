import type { IconMap, SocialLink, Site, NavLink } from '@/types/types'

export const SITE: Site = {
  title: 'Berdikari Space',
  description: 'Ruang inkubasi dan laboratorium kreatif di Bekasi — seni budaya, ekologis, sastra, literasi, hingga isu sosial.',
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

