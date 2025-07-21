import { Globe, Github, Twitter, Mail, Instagram, Rss } from 'lucide-react'

export const Icons = {
  Globe,
  Github,
  Twitter,
  Mail,
  Instagram,
  Rss,
}

export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  featuredPostCount: number
  postsPerPage: number
}

export type NavLink = {
  href: string
  label: string
}

export type SocialLink = {
  href: string
  label: keyof typeof Icons | string
}

export type IconMap = Partial<Record<keyof typeof Icons | string, string>>
