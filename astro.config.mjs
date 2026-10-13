import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://blend-web-ten.vercel.app',
  trailingSlash: 'ignore',
  vite: { plugins: [tailwindcss()] },
});
