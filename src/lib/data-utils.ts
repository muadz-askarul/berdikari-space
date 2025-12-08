import { getCollection, render, type CollectionEntry } from 'astro:content'
import { readingTime, calculateWordCountFromHtml } from '@/lib/utils'

// =================================================================================
// TYPES
// =================================================================================
export type PostCollectionEntry =
  | CollectionEntry<'blog'>
  | CollectionEntry<'news'>
  | CollectionEntry<'event'>

export type PostCollectionType = 'blog' | 'news' | 'event'

export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
}

// =================================================================================
// GENERIC FUNCTIONS
// =================================================================================

export function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

export function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]
}

export function groupPostsByYear(
  posts: PostCollectionEntry[],
): Record<string, PostCollectionEntry[]> {
  return posts.reduce((acc: Record<string, PostCollectionEntry[]>, post) => {
    const year = post.data.date.getFullYear().toString()
    ;(acc[year] ??= []).push(post)
    return acc
  }, {})
}

export async function getAllPosts(
  collection: PostCollectionType,
  includeSubposts = false,
) {
  const posts = await getCollection(collection)
  return posts
    .filter(
      (post) => !post.data.draft && (includeSubposts || !isSubpost(post.id)),
    )
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAdjacentPosts(
  currentId: string,
  collection: PostCollectionType,
  includeSubposts = false,
): Promise<{
  newer: PostCollectionEntry | null
  older: PostCollectionEntry | null
  parent: PostCollectionEntry | null
}> {
  const allPosts = await getAllPosts(collection, includeSubposts)

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const parent = allPosts.find((post) => post.id === parentId) || null

    const posts = await getCollection(collection)
    const subposts = posts
      .filter(
        (post) =>
          isSubpost(post.id) &&
          getParentId(post.id) === parentId &&
          !post.data.draft,
      )
      .sort((a, b) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff

        const orderA = a.data.order ?? 0
        const orderB = b.data.order ?? 0
        return orderA - orderB
      })

    const currentIndex = subposts.findIndex((post) => post.id === currentId)
    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subposts.length - 1 ? subposts[currentIndex + 1] : null,
      older: currentIndex > 0 ? subposts[currentIndex - 1] : null,
      parent,
    }
  }

  const parentPosts = allPosts.filter((post) => !isSubpost(post.id))
  const currentIndex = parentPosts.findIndex((post) => post.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentPosts[currentIndex - 1] : null,
    older:
      currentIndex < parentPosts.length - 1
        ? parentPosts[currentIndex + 1]
        : null,
    parent: null,
  }
}

export async function getPostsByAuthor(
  authorId: string,
): Promise<PostCollectionEntry[]> {
  const blogs = await getAllPosts('blog', false)
  const news = await getAllPosts('news', false)
  const events = await getAllPosts('event', false)
  return [...blogs, ...news, ...events].filter((post) =>
    post.data.authors?.includes(authorId),
  )
}

export async function getPostsByTag(
  tag: string,
): Promise<PostCollectionEntry[]> {
  const blogs = await getAllPosts('blog', false)
  const news = await getAllPosts('news', false)
  const events = await getAllPosts('event', false)
  return [...blogs, ...news, ...events].filter((post) =>
    post.data.tags?.includes(tag),
  )
}

export async function getRecentPosts(
  count: number,
  collection: PostCollectionType,
): Promise<PostCollectionEntry[]> {
  const posts = await getAllPosts(collection, false)
  return posts.slice(0, count)
}

export async function getSubpostsForParent(
  parentId: string,
  collection: PostCollectionType,
): Promise<PostCollectionEntry[]> {
  const posts = await getCollection(collection)
  return posts
    .filter(
      (post) =>
        !post.data.draft &&
        isSubpost(post.id) &&
        getParentId(post.id) === parentId,
    )
    .sort((a, b) => {
      const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
      if (dateDiff !== 0) return dateDiff

      const orderA = a.data.order ?? 0
      const orderB = b.data.order ?? 0
      return orderA - orderB
    })
}

export async function getParentPost(
  subpostId: string,
  collection: PostCollectionType,
): Promise<PostCollectionEntry | null> {
  if (!isSubpost(subpostId)) {
    return null
  }

  const parentId = getParentId(subpostId)
  const allPosts = await getAllPosts(collection, false)
  return allPosts.find((post) => post.id === parentId) || null
}

export async function getPostById(
  postId: string,
  collection: PostCollectionType,
): Promise<PostCollectionEntry | null> {
  const allPosts = await getAllPosts(collection, true)
  return allPosts.find((post) => post.id === postId) || null
}

export async function getSubpostCount(
  parentId: string,
  collection: PostCollectionType,
): Promise<number> {
  const subposts = await getSubpostsForParent(parentId, collection)
  return subposts.length
}

export async function getCombinedReadingTime(
  postId: string,
  collection: PostCollectionType,
): Promise<string> {
  const post = await getPostById(postId, collection)
  if (!post) return readingTime(0)

  let totalWords = calculateWordCountFromHtml(post.body)

  if (!isSubpost(postId)) {
    const subposts = await getSubpostsForParent(postId, collection)
    for (const subpost of subposts) {
      totalWords += calculateWordCountFromHtml(subpost.body)
    }
  }

  return readingTime(totalWords)
}

export async function getPostReadingTime(
  postId: string,
  collection: PostCollectionType,
): Promise<string> {
  const post = await getPostById(postId, collection)
  if (!post) return readingTime(0)

  const wordCount = calculateWordCountFromHtml(post.body)
  return readingTime(wordCount)
}

export async function getTOCSections(
  postId: string,
  collection: PostCollectionType,
): Promise<TOCSection[]> {
  const post = await getPostById(postId, collection)
  if (!post) return []

  const parentId = isSubpost(postId) ? getParentId(postId) : postId
  const parentPost = isSubpost(postId)
    ? await getPostById(parentId, collection)
    : post

  if (!parentPost) return []

  const sections: TOCSection[] = []

  const { headings: parentHeadings } = await render(parentPost)
  if (parentHeadings.length > 0) {
    sections.push({
      type: 'parent',
      title: 'Overview',
      headings: parentHeadings.map((heading) => ({
        slug: heading.slug,
        text: heading.text,
        depth: heading.depth,
      })),
    })
  }

  const subposts = await getSubpostsForParent(parentId, collection)
  for (const subpost of subposts) {
    const { headings: subpostHeadings } = await render(subpost)
    if (subpostHeadings.length > 0) {
      sections.push({
        type: 'subpost',
        title: subpost.data.title,
        headings: subpostHeadings.map((heading, index) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
          isSubpostTitle: index === 0,
        })),
        subpostId: subpost.id,
      })
    }
  }

  return sections
}

// =================================================================================
// BLOG
// =================================================================================

export function getAllBlogs(includeSubposts = false) {
  return getAllPosts('blog', includeSubposts)
}

export function getAdjacentBlogs(currentId: string, includeSubposts = false) {
  return getAdjacentPosts(currentId, 'blog', includeSubposts)
}

export function getParentBlog(subpostId: string) {
  return getParentPost(subpostId, 'blog')
}

export function getBlogById(postId: string) {
  return getPostById(postId, 'blog')
}

export function getRecentBlogs(count: number) {
  return getRecentPosts(count, 'blog')
}

// =================================================================================
// NEWS
// =================================================================================

export function getAllNews(includeSubposts = false) {
  return getAllPosts('news', includeSubposts)
}

export function getAdjacentNews(currentId: string, includeSubposts = false) {
  return getAdjacentPosts(currentId, 'news', includeSubposts)
}

export function getParentNews(subpostId: string) {
  return getParentPost(subpostId, 'news')
}

export function getNewsById(postId: string) {
  return getPostById(postId, 'news')
}

export function getRecentNews(count: number) {
  return getRecentPosts(count, 'news')
}

// =================================================================================
// EVENTS
// =================================================================================

export function getAllEvents(includeSubposts = false) {
  return getAllPosts('event', includeSubposts)
}

export function getAdjacentEvents(currentId: string, includeSubposts = false) {
  return getAdjacentPosts(currentId, 'event', includeSubposts)
}

export function getParentEvent(subpostId: string) {
  return getParentPost(subpostId, 'event')
}

export function getEventById(postId: string) {
  return getPostById(postId, 'event')
}

export function getRecentEvents(count: number) {
  return getRecentPosts(count, 'event')
}

// =================================================================================
// AUTHORS
// =================================================================================

export async function getAllAuthors(): Promise<CollectionEntry<'authors'>[]> {
  return await getCollection('authors')
}

export async function parseAuthors(authorIds: string[] = []) {
  if (!authorIds.length) return []

  const allAuthors = await getAllAuthors()
  const authorMap = new Map(allAuthors.map((author) => [author.id, author]))

  return authorIds.map((id) => {
    const author = authorMap.get(id)
    return {
      id,
      name: author?.data?.name || id,
      avatar: author?.data?.avatar || '/static/logo.svg',
      isRegistered: !!author,
    }
  })
}

// =================================================================================
// PROJECTS
// =================================================================================

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects.sort((a, b) => {
    const dateA = a.data.startDate?.getTime() || 0
    const dateB = b.data.startDate?.getTime() || 0
    return dateB - dateA
  })
}

// =================================================================================
// MEDIA
// =================================================================================

export async function getAllMedia(): Promise<CollectionEntry<'media'>[]> {
  const media = await getCollection('media')
  return media
    .filter((medium) => !medium.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export function groupMediaByYear(
  posts: CollectionEntry<'media'>[],
): Record<string, CollectionEntry<'media'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'media'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

// =================================================================================
// TAGS
// =================================================================================

export async function getAllTags(): Promise<Map<string, number>> {
  const blogs = await getAllPosts('blog', true)
  const news = await getAllPosts('news', true)
  const events = await getAllPosts('event', true)
  return [...blogs, ...news, ...events].reduce((acc, post) => {
    post.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTags()
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

// =================================================================================
// MISC
// =================================================================================

export async function hasSubposts(
  postId: string,
  collection: PostCollectionType,
): Promise<boolean> {
  const subposts = await getSubpostsForParent(postId, collection)
  return subposts.length > 0
}
