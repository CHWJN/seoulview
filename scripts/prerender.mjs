// 빌드 후 실행: 사이트의 모든 주소를 미리 HTML로 만들어 dist에 저장 (검색엔진·AI가 글 내용을 바로 읽을 수 있게)
// + sitemap.xml, robots.txt 생성. 화면은 브라우저에서 이 HTML을 그대로 이어받아(hydrate) 동작한다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const { render, getAllRoutes, getPageMeta, getJsonLd, SITE_URL } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
// 미리 만들지 않은 주소(잘못된 주소 등)에 쓰는 빈 화면용 원본
fs.writeFileSync(path.join(dist, 'app.html'), template);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const setTag = (html, re, tag) => {
  if (!re.test(html)) throw new Error('index.html에서 태그를 찾지 못함: ' + re);
  return html.replace(re, tag);
};

const routes = getAllRoutes();
for (const route of routes) {
  const { title, description } = getPageMeta(route);
  const url = SITE_URL + route;
  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`);
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`);
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(url)}" />`);
  const jsonLd = getJsonLd(route)
    .map((d) => `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');
  html = html.replace('</head>', `    <link rel="canonical" href="${esc(url)}" />\n    ${jsonLd}\n  </head>`);
  const body = await render(route);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`);
  // '/' → index.html, '/event' → event.html, '/column/abc' → column/abc.html (vercel.json cleanUrls)
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1) + '.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map((r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${routes.length}개 페이지, sitemap.xml, robots.txt 생성`);
