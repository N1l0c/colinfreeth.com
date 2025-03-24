// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://colinfreeth.com/blog', // ✅ You can change this to 'https://colinfreeth.com' for canonical URLs
	integrations: [mdx(), sitemap()],
	trailingSlash: 'always'      // ✅ Add this for reliable routing on Vercel
});
