import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

export const blog = defineCollection({
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
