import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/** Wrap each h2 and what follows it into <section class="card">, up to the next h2. */
function sectionize() {
  return (tree) => {
    const out = [];
    let current = null;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        current = { type: 'element', tagName: 'section', properties: { className: ['card'] }, children: [node] };
        out.push(current);
      } else if (current) {
        current.children.push(node);
      } else if (node.type === 'element' && node.tagName === 'h1') {
        out.push(node);
      } else if (node.type === 'element') {
        current = { type: 'element', tagName: 'section', properties: { className: ['card', 'lead'] }, children: [node] };
        out.push(current);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}

export default defineConfig({
  site: 'https://blend-web-ten.vercel.app',
  trailingSlash: 'ignore',
  markdown: { rehypePlugins: [sectionize] },
  vite: { plugins: [tailwindcss()] },
});
