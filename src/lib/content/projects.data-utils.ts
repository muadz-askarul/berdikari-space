import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { type CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export const projects = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            description: z.string(),
            tags: z.array(z.string()),
            image: image(),
            link: z.string().url(),
            startDate: z.coerce.date().optional(),
            endDate: z.coerce.date().optional(),
        }),
})


export const getAllProjects = async (): Promise<CollectionEntry<'projects'>[]> => {
    const projects = await getCollection('projects')
    return projects.sort((a, b) => {
        const dateA = a.data.startDate?.getTime() || 0
        const dateB = b.data.startDate?.getTime() || 0
        return dateB - dateA
    })
}