import { getCollection, render, type CollectionEntry } from 'astro:content'
import { readingTime, calculateWordCountFromHtml } from '@/lib/utils'
import { type ContentMap } from '@/content.collection';

type T = keyof Pick<ContentMap, 'blog' | 'event' | 'news'>;
type authors = keyof Pick<ContentMap, 'authors'>;
type projects = keyof Pick<ContentMap, 'projects'>;

export const getAll = async (collection: T)
    : Promise<CollectionEntry<T>[]> => {
    return getCollection(collection);
}

export const getAllPosts = async (collection: T)
    : Promise<CollectionEntry<T>[]> => {
    const posts = await getCollection(collection);
    return posts
        .filter((post) => !post.data.draft && !isSubpost(post.id))
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export const getParentPost = async (
    subpostId: string,
    collection: T
): Promise<CollectionEntry<T> | null> => {
    if (!isSubpost(subpostId)) {
        return null
    }

    const parentId = getParentId(subpostId)
    const allPosts = await getAllPosts(collection)
    return allPosts.find((post) => post.id === parentId) || null
}


export const getAdjacentPosts = async (
    currentId: string,
    collection: T
): Promise<{
    newer: CollectionEntry<T> | null
    older: CollectionEntry<T> | null
    parent: CollectionEntry<T> | null
}> => {
    const allPosts = await getAll(collection)
    allPosts.forEach(el => {
        isSubpost(currentId)
    });

    if (isSubpost(currentId)) {
        const parentId = getParentId(currentId)
        const allPosts = await getAllPosts(collection)
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

export const groupCollectionByYear = (
    posts: CollectionEntry<T>[]
): Record<string, CollectionEntry<T>[]> => {
    return posts.reduce(
        (acc: Record<string, CollectionEntry<T>[]>, post) => {
            const year = post.data.date.getFullYear().toString()
                ; (acc[year] ??= []).push(post)
            return acc
        },
        {},
    )
}

export const getAllPostsAndSubposts = async (
    collection: T
): Promise<CollectionEntry<T>[]> => {
    const posts = await getCollection(collection)
    return posts
        .filter((post) => !post.data.draft)
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}


export const getAllAuthors = async (): Promise<CollectionEntry<'authors'>[]> => {
    return await getCollection('authors')
}


export const getAllTags = async (collection: T): Promise<Map<string, number>> => {
    const posts = await getAllPosts(collection)
    return posts.reduce((acc, post) => {
        post.data.tags?.forEach((tag) => {
            acc.set(tag, (acc.get(tag) || 0) + 1)
        })
        return acc
    }, new Map<string, number>())
}

export const getSubpostsForParent = async (
    parentId: string,
    collection: T
): Promise<CollectionEntry<T>[]> => {
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


export const getPostsByAuthor = async (
    authorId: string,
    collection: T
): Promise<CollectionEntry<T>[]> => {
    const posts = await getAllPosts(collection)
    return posts.filter((post) => post.data.authors?.includes(authorId))
}

export const getPostsByTag = async (
    tag: string,
    collection: T
): Promise<CollectionEntry<T>[]> => {
    const posts = await getAllPosts(collection)
    return posts.filter((post) => post.data.tags?.includes(tag))
}


export const getRecentPosts = async (
    count: number,
    collection: T
): Promise<CollectionEntry<T>[]> => {
    const posts = await getAllPosts(collection)
    return posts.slice(0, count)
}

export const getSortedTags = async (
    collection: T
): Promise<{ tag: string; count: number }[]> => {
    const tagCounts = await getAllTags(collection)
    return [...tagCounts.entries()]
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => {
            const countDiff = b.count - a.count
            return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
        })
}

export const getParentId = (subpostId: string): string => {
    return subpostId.split('/')[0]
}


export const groupPostsByYear = (
    posts: CollectionEntry<T>[],
): Record<string, CollectionEntry<T>[]> => {
    return posts.reduce(
        (acc: Record<string, CollectionEntry<T>[]>, post) => {
            const year = post.data.date.getFullYear().toString()
                ; (acc[year] ??= []).push(post)
            return acc
        },
        {},
    )
}

export const hasSubposts = async (postId: string, collection: T): Promise<boolean> => {
    const subposts = await getSubpostsForParent(postId, collection)
    return subposts.length > 0
}

export const isSubpost = (postId: string): boolean => {
    return postId.includes('/')
}

export const parseAuthors = async (authorIds: string[] = []) => {
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

export const getPostById = async (
    postId: string,
    collection: T
): Promise<CollectionEntry<T> | null> => {
    const allPosts = await getAllPostsAndSubposts(collection)
    return allPosts.find((post) => post.id === postId) || null
}

export const getSubpostCount = async (parentId: string, collection: T): Promise<number> => {
    const subposts = await getSubpostsForParent(parentId, collection)
    return subposts.length
}

export const getCombinedReadingTime = async (postId: string, collection: T): Promise<string> => {
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

export const getPostReadingTime = async (postId: string, collection: T): Promise<string> => {
    const post = await getPostById(postId, collection)
    if (!post) return readingTime(0)

    const wordCount = calculateWordCountFromHtml(post.body)
    return readingTime(wordCount)
}

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

export const getTOCSections = async (postId: string, collection: T): Promise<TOCSection[]> =>  {
    const post = await getPostById(postId, collection)
    if (!post) return []

    const parentId = isSubpost(postId) ? getParentId(postId) : postId
    const parentPost = isSubpost(postId) ? await getPostById(parentId, collection) : post

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