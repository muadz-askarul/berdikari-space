import { getCollection, type CollectionEntry } from "astro:content"
import { getAll } from "../data-utils"
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { type ContentMap } from "@/content.collection"

export const news = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
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

export const getRecentNews = async (
    count: number,
): Promise<CollectionEntry<'news'>[]> => {
    const news = await getCollection('news')
    return news.slice(0, count)
}
