import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { getCollection, render, type CollectionEntry } from 'astro:content'
import { isSubpost, getParentId } from '../data-utils'

export const event = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/event' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            date: z.coerce.date(),
            order: z.number().optional(),
            image: image().optional(),
            tags: z.array(z.string()).optional(),
            authors: z.array(z.string()).optional(),
            draft: z.boolean().optional(),
        }),
})



export async function getAllEvents(): Promise<CollectionEntry<'event'>[]> {
    return getCollection('event');
}

export function groupEventsByYear(
    posts: CollectionEntry<'event'>[],
): Record<string, CollectionEntry<'event'>[]> {
    return posts.reduce(
        (acc: Record<string, CollectionEntry<'event'>[]>, post) => {
            const year = post.data.date.getFullYear().toString()
                ; (acc[year] ??= []).push(post)
            return acc
        },
        {},
    )
}

/* //===============================// */

export async function getAllEventPosts(): Promise<CollectionEntry<'event'>[]> {
    const posts = await getCollection('event')
    return posts
        .filter((post) => !post.data.draft && !isSubpost(post.id))
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export const getAdjacentEventPosts = async (
    currentId: string
): Promise<{
    newer: CollectionEntry<'event'> | null
    older: CollectionEntry<'event'> | null
    parent: CollectionEntry<'event'> | null
}> => {
    const allPosts = await getAllEventPosts()

    allPosts.forEach(el => {
        isSubpost(currentId)
    });

    if (isSubpost(currentId)) {
        const parentId = getParentId(currentId)
        const allPosts = await getAllEventPosts()
        const parent = allPosts.find((post) => post.id === parentId) || null


        const posts = await getCollection('event')
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