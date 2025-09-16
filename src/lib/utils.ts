import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { defineCollection, z, type ContentEntryMap, type DataEntryMap } from 'astro:content'
import { getCollection, render, type CollectionEntry } from 'astro:content'
import { isSubpost, getParentId } from './data-utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateWordCountFromHtml(
  html: string | null | undefined,
): number {
  if (!html) return 0
  const textOnly = html.replace(/<[^>]+>/g, '')
  return textOnly.split(/\s+/).filter(Boolean).length
}

export function readingTime(wordCount: number): string {
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200))
  return `${readingTimeMinutes} min read`
}

export function getHeadingMargin(depth: number): string {
  const margins: Record<number, string> = {
    3: 'ml-4',
    4: 'ml-8',
    5: 'ml-12',
    6: 'ml-16',
  }
  return margins[depth] || ''
}

// Yang berhubungan dengan collection secara generic, taruh di data-utils.ts
// Function yang specific terhadap suatu collection, taruh di [collection_name].data-utils.ts
// export async function getAllPosts(collection: keyof Pick<DataEntryMap, 'blog' | 'event' | 'news'>, withSubPost = false) {
//   const posts = await getCollection(collection)
//   return posts
//       .filter((post) => !post.data.draft && withSubPost && isSubpost(post.id))
//       .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
// }