import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Position in the home list (ascending). */
      order: z.number().int(),
      /** Short label shown in the list row (e.g. "Branding"). */
      tag: z.string(),
      /** Full category shown on the detail page (e.g. "Branding & Web"). */
      category: z.string(),
      year: z.number().int().optional(),
      description: z.string(),
      url: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
