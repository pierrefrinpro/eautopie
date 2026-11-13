// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://eautopie.fr',
  // Les pages sont servies avec une barre oblique finale (/blog/).
  // Les liens internes la portent aussi, sinon Cloudflare répond par
  // une redirection 307 à chaque clic.
  trailingSlash: 'always',
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
});
