// 검색엔진(SEO) 정보: 페이지별 제목·설명, 사이트 주소 목록, 병원 구조화 데이터(JSON-LD)
// - 화면에서 페이지를 옮길 때(App.tsx)와, 빌드할 때 미리 만드는 HTML(scripts/prerender.mjs) 양쪽에서 같이 씀
// - 실제 도메인이 생기면 SITE_URL 한 줄만 바꾸면 된다
import { COLUMNS_DATA, ColumnArticle } from './data/columnsData.ts';
import { GUIDE_DATA } from './data/guideData.ts';
import { BA_CATEGORIES } from './data/baData.ts';
import { EVENTS, PRICE_CATEGORIES } from './data/pricingData.ts';
import { NAVER_MAP_URL, KAKAO_CHAT_URL, CLINIC_LAT, CLINIC_LNG, LOGO_SRC } from './clinicLinks.ts';

export const SITE_URL = 'https://seoulview.vercel.app';
export const SITE_NAME = '서울뷰의원 당진점';
const OFFICIAL_NAME = '서울뷰의원당진 진료과목 피부과';
const ADDRESS = '충청남도 당진시 시청2로 49-30, 7층';
const PHONE = '041-352-3994';

export interface PageMeta {
  title: string;
  description: string;
}

const cut = (s: string, n = 155) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

// 사이트에 있는 모든 주소 (sitemap.xml·미리 만드는 HTML 목록)
export function getAllRoutes(): string[] {
  return [
    '/',
    '/event',
    '/prices',
    '/before-after',
    ...BA_CATEGORIES.map((c) => `/before-after/${c.id}`),
    '/guide',
    ...GUIDE_DATA.map((g) => `/guide/${g.id}`),
    '/column',
    ...COLUMNS_DATA.map((c) => `/column/${c.slug}`),
    '/location',
    '/privacy'
  ];
}

// 칼럼 날짜 "2026. 10. 29" → "2026-10-29"
export const columnIsoDate = (a: ColumnArticle) => a.date.replace(/\.\s*/g, '-').replace(/-$/, '');

export function getPageMeta(pathname: string): PageMeta {
  const p = pathname.replace(/\/+$/, '') || '/';

  if (p === '/event') {
    return {
      title: `이벤트 | ${SITE_NAME}`,
      description: cut(`${SITE_NAME} 이벤트 안내: ${EVENTS.map((e) => e.name).join(', ')}.`)
    };
  }
  if (p === '/prices') {
    return {
      title: `비급여 수가표 | ${SITE_NAME}`,
      description: cut(`${SITE_NAME} 상세 비급여 진료비용 안내: ${PRICE_CATEGORIES.map((c) => c.name).join(', ')}.`)
    };
  }
  if (p === '/before-after' || p.startsWith('/before-after/')) {
    const cat = BA_CATEGORIES.find((c) => p === `/before-after/${c.id}`);
    return {
      title: `${cat ? cat.label + ' ' : ''}시술 전후사진 | ${SITE_NAME}`,
      description: cut(`${SITE_NAME} 시술 전후사진: ${cat ? cat.label : BA_CATEGORIES.map((c) => c.label).join(', ')}.`)
    };
  }
  if (p === '/guide' || p.startsWith('/guide/')) {
    const g = GUIDE_DATA.find((x) => p === `/guide/${x.id}`) ?? GUIDE_DATA[0];
    return {
      title: `${g.label} 시술안내 및 주의사항 | ${SITE_NAME}`,
      description: cut(`${g.label} 시술안내(${g.subtitle}): 시술 소요시간, 마취 방법, 권장 주기, 회복 기간과 시술 후 주의사항. ${SITE_NAME}.`)
    };
  }
  if (p.startsWith('/column/')) {
    const slug = decodeURIComponent(p.slice('/column/'.length));
    const a = COLUMNS_DATA.find((c) => c.slug === slug || c.id === slug);
    if (a) return { title: `${a.seoTitle} | ${SITE_NAME} 원장칼럼`, description: cut(a.preview) };
  }
  if (p.startsWith('/column')) {
    return {
      title: `원장칼럼 | ${SITE_NAME}`,
      description: '진료실에서 미처 다 전하지 못한 이야기, 시술에 대한 고민과 진심을 이곳에 담았습니다. 서울뷰의원 당진점 대표원장 칼럼.'
    };
  }
  if (p === '/location') {
    return {
      title: `오시는 길 및 진료안내 | ${SITE_NAME}`,
      description: `${ADDRESS} · 대표번호 ${PHONE} · 진료시간 평일 10:00~20:00(점심 13:00~14:00), 주말 10:00~20:00 · 추석·설날 연휴 제외 연중무휴 · 진료시간 무료주차.`
    };
  }
  if (p === '/privacy') {
    return { title: `개인정보 처리방침 | ${SITE_NAME}`, description: `${OFFICIAL_NAME} 개인정보 처리방침.` };
  }
  return {
    title: `${SITE_NAME} | ${OFFICIAL_NAME}`,
    description: `${OFFICIAL_NAME} 공식 홈페이지. ${ADDRESS} · 대표번호 ${PHONE}. 이벤트, 비급여 수가표, 시술안내 및 주의사항, 대표원장 칼럼, 오시는 길 안내.`
  };
}

// 병원 정보 (검색엔진·AI가 읽는 구조화 데이터)
export function clinicJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${SITE_URL}/#clinic`,
    name: OFFICIAL_NAME,
    alternateName: [SITE_NAME, '서울뷰의원 당진'],
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}${LOGO_SRC}`,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '시청2로 49-30, 7층',
      addressLocality: '당진시',
      addressRegion: '충청남도',
      addressCountry: 'KR'
    },
    geo: { '@type': 'GeoCoordinates', latitude: CLINIC_LAT, longitude: CLINIC_LNG },
    hasMap: NAVER_MAP_URL,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '20:00'
      }
    ],
    sameAs: [NAVER_MAP_URL, KAKAO_CHAT_URL.replace(/\/chat$/, '')]
  };
}

// 칼럼 글 구조화 데이터
export function columnJsonLd(a: ColumnArticle) {
  const url = `${SITE_URL}/column/${a.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    mainEntityOfPage: url,
    url,
    headline: a.title,
    description: a.preview,
    datePublished: columnIsoDate(a),
    inLanguage: 'ko-KR',
    keywords: a.keywords.join(', '),
    author: { '@type': 'Physician', name: a.author.name, jobTitle: a.author.title, worksFor: { '@id': `${SITE_URL}/#clinic` } },
    publisher: { '@type': 'MedicalClinic', '@id': `${SITE_URL}/#clinic`, name: OFFICIAL_NAME, logo: `${SITE_URL}${LOGO_SRC}` }
  };
}

// 주소별로 넣을 구조화 데이터 (홈·오시는 길은 병원 정보, 칼럼 글은 글 정보)
export function getJsonLd(pathname: string): object[] {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/' || p === '/location') return [clinicJsonLd()];
  if (p.startsWith('/column/')) {
    const slug = decodeURIComponent(p.slice('/column/'.length));
    const a = COLUMNS_DATA.find((c) => c.slug === slug || c.id === slug);
    if (a) return [columnJsonLd(a)];
  }
  return [];
}

// 화면에서 페이지를 옮길 때 <head>의 제목·설명·대표 주소·구조화 데이터를 바꿔 줌
export function applyPageMeta(pathname: string) {
  const p = pathname.replace(/\/+$/, '') || '/';
  const { title, description } = getPageMeta(p);
  const url = `${SITE_URL}${p === '/' ? '/' : p}`;
  document.title = title;
  const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', url);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
  for (const data of getJsonLd(p)) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-seo-jsonld', '');
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
}
