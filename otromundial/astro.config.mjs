// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';
import seoGraph from '@jdevalk/astro-seo-graph/integration';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.elotromundial.mx',
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap(),
    seoGraph({
      validateH1: true,
      validateUniqueMetadata: true,
      validateImageAlt: true,
      validateMetadataLength: true
    })
  ],
});