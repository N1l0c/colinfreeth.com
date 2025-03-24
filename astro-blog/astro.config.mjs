// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	base: '/blog',
	site: 'https://colinfreeth.com',
	integrations: [mdx(), sitemap()],
});
