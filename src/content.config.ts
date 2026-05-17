import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.date(),
    category: z.enum([
      'imunitet',
      'hranene',
      'razvitie',
      'psihologia',
      'imunizacii',
      'speshni',
      'obshto'
    ]),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    author: z.string().default('д-р Мерилин Иванова'),
    draft: z.boolean().default(false),
    readingTime: z.number().optional()
  })
});

const seminars = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/seminars' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    endDate: z.date().optional(),
    location: z.string(),
    description: z.string(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    registrationPhone: z.string().optional(),
    registrationLink: z.string().url().optional(),
    speakers: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/team' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    photo: image().optional(),
    photoAlt: z.string().optional(),
    order: z.number().default(99),
    founder: z.boolean().default(false)
  })
});

export const collections = { articles, seminars, team };
