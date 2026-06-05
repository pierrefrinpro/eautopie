import { defineCollection, z } from 'astro:content';

// Catégories du blog EauTopie
export const CATEGORIES = [
  'entretien',
  'problemes',
  'debutants',
  'equipement',
] as const;

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(), // sert aussi de meta description
    // `slug` n'est PAS déclaré ici : Astro le réserve pour l'URL.
    // Pour forcer un slug, ajoute `slug:` dans le frontmatter de l'article.
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string().optional(), // chemin de l'image de couverture
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()).optional(),
    readTime: z.number(), // minutes estimées
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
