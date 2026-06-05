// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://eautopie.fr',

  integrations: [
    tailwind({
      // On gère nos directives Tailwind nous-mêmes dans src/styles/global.css
      applyBaseStyles: false,
    }),
    sitemap({
      // On exclut les pages non indexables du sitemap.
      filter: (page) =>
        !page.includes('/mentions-legales') &&
        !page.includes('/politique-confidentialite') &&
        !page.includes('/404'),
    }),
  ],

  output: "hybrid",
  adapter: cloudflare()
});