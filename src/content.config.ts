import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { event } from './lib/content/events.data-utils'

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
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

const news = defineCollection({
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

const authors = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
    schema: z.object({
        name: z.string(),
        pronouns: z.string().optional(),
        avatar: z.string().url().or(z.string().startsWith('/')),
        bio: z.string().optional(),
        mail: z.string().email().optional(),
        website: z.string().url().optional(),
        twitter: z.string().url().optional(),
        github: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        discord: z.string().url().optional(),
    }),
})

const projects = defineCollection({
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

const media = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/media' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            date: z.coerce.date(),
            order: z.number().optional(),
            images: z.array(z.object({
                src: z.string(),
                title: z.string(),
            })).optional(),
            tags: z.array(z.string()).optional(),
            authors: z.array(z.string()).optional(),
            draft: z.boolean().optional(),
        }),
})

export const collections = { blog, authors, projects, event, news, media }
