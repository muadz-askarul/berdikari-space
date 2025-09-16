import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { event } from './lib/content/events.data-utils'
import { news } from './lib/content/news.data-utils'
import { projects } from './lib/content/projects.data-utils'
import { blog } from './lib/content/blog.data-utils'

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


export const collections = { blog, authors, projects, event, news }
