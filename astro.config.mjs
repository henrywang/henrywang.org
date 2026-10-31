import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://henrywang.org',
  integrations: [sitemap()],
  markdown: { shikiConfig: { theme: 'vitesse-dark' } },
});
