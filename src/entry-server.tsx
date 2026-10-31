// 검색엔진용 미리 만든 HTML(프리렌더) — 빌드할 때만 쓰임 (scripts/prerender.mjs)
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import App from './App.tsx';

export async function render(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}

export { getAllRoutes, getPageMeta, getJsonLd, SITE_URL } from './seo.ts';
