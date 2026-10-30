import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileDrawer, MobileBottomBar } from './MobileNav.tsx';
import SiteHeader from './SiteHeader.tsx';
import { NAVER_MAP_URL, GOOGLE_MAP_EMBED_URL, KAKAO_CHAT_URL, openNaverBooking, LOGO_SRC } from './clinicLinks.ts';
import { COLUMNS_DATA } from './data/columnsData.ts';
import { ALL_BA_ITEMS } from './data/baData.ts';
import BaCard, { BaConsentToggle, BA_LEGAL_NOTICE } from './BaCard.tsx';
import {
  Sparkles,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Calendar,
  CheckCircle2,
  MessageCircle,
  BookOpen,
  Images,
  MapPin,
  ExternalLink
} from 'lucide-react';

// 이벤트·수가표·칼럼·시술안내 페이지는 들어갈 때 따로 불러온다 (홈 첫 화면을 가볍게)
const EventPage = lazy(() => import('./EventPage.tsx'));
const PricePage = lazy(() => import('./PricePage.tsx'));
const ColumnPage = lazy(() => import('./ColumnPage.tsx'));
const GuidePage = lazy(() => import('./GuidePage.tsx'));
const BeforeAfterPage = lazy(() => import('./BeforeAfterPage.tsx'));
const PrivacyPage = lazy(() => import('./PrivacyPage.tsx'));

export default function App() {
  // Brand Logo Path from user attachment

  // ===== 페이지 라우팅 (react-router: 정식 경로 방식) =====
  // /  /event  /prices  /column  /column/:slug
  type PageName = 'home' | 'event' | 'prices' | 'column' | 'guide' | 'ba' | 'privacy';
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';

  const currentPage: PageName = pathname.startsWith('/column')
    ? 'column'
    : pathname === '/guide' || pathname.startsWith('/guide/')
    ? 'guide'
    : pathname === '/before-after' || pathname.startsWith('/before-after/')
    ? 'ba'
    : pathname === '/privacy'
    ? 'privacy'
    : pathname === '/event'
    ? 'event'
    : pathname === '/prices'
    ? 'prices'
    : 'home';

  const selectedColumnArticleId: string | null = (() => {
    if (!pathname.startsWith('/column/')) return null;
    const raw = pathname.slice('/column/'.length);
    try {
      return decodeURIComponent(raw) || null;
    } catch {
      return raw || null;
    }
  })();

  const navigateTo = (page: PageName, targetId?: string) => {
    setMobileMenuOpen(false);
    if (page === 'column') {
      if (targetId) {
        // id 또는 slug 모두 받아서 항상 slug 주소로 이동 (검색 친화적 URL)
        const article = COLUMNS_DATA.find((c) => c.id === targetId || c.slug === targetId);
        navigate(`/column/${article ? article.slug : targetId}`);
      } else {
        navigate('/column');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'event') {
      navigate('/event');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'privacy') {
      navigate('/privacy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'ba') {
      navigate(targetId ? `/before-after/${targetId}` : '/before-after');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'guide') {
      navigate(targetId ? `/guide/${targetId}` : '/guide');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'prices') {
      navigate('/prices');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // 예전 해시 주소(#event-page 등)로 들어온 링크를 새 경로로 자동 이동
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    if (hash === '#event-page') {
      navigate('/event', { replace: true });
    } else if (hash === '#prices-page') {
      navigate('/prices', { replace: true });
    } else if (hash === '#column-page') {
      navigate('/column', { replace: true });
    } else if (hash.startsWith('#column/')) {
      const id = hash.replace('#column/', '');
      const article = COLUMNS_DATA.find((c) => c.id === id || c.slug === id);
      navigate(`/column/${article ? article.slug : id}`, { replace: true });
    }
  }, [location.hash]);

  // 알 수 없는 경로는 홈으로
  useEffect(() => {
    const known = pathname === '/' || pathname === '/event' || pathname === '/prices' || pathname.startsWith('/column') || pathname === '/guide' || pathname.startsWith('/guide/') || pathname === '/before-after' || pathname.startsWith('/before-after/') || pathname === '/privacy';
    if (!known) navigate('/', { replace: true });
  }, [pathname]);

  // 페이지별 브라우저 탭 제목 (칼럼 페이지는 ColumnPage가 직접 설정)
  useEffect(() => {
    if (currentPage === 'home') {
      document.title = '서울뷰의원 당진점 | SEOUL VIEW CLINIC DANGJIN';
    } else if (currentPage === 'event') {
      document.title = '이벤트 | 서울뷰의원 당진점';
    } else if (currentPage === 'prices') {
      document.title = '비급여 수가표 | 서울뷰의원 당진점';
    }
  }, [currentPage]);

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Section Tabs
  const [aboutTab, setAboutTab] = useState<'brand' | 'doctor' | 'devices' | 'facility'>('brand');
  const [isBaUnlocked, setIsBaUnlocked] = useState<boolean>(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hero Multi-Tab State
  const [heroTab, setHeroTab] = useState<'video' | 'excelwave'>('video');
  // 영상 화면으로 돌아온 횟수 (문구 등장 효과를 매번 다시 보여 주기 위해)
  const [heroRound, setHeroRound] = useState<number>(0);
  useEffect(() => {
    if (heroTab === 'video') setHeroRound((n) => n + 1);
  }, [heroTab]);

  // 메인 배너: 10초마다 영상 ↔ 엑셀웨이브 자동 전환 (화살표·막대를 누르면 그때부터 다시 10초)
  useEffect(() => {
    if (currentPage !== 'home') return;
    const timer = setTimeout(() => setHeroTab(prev => prev === 'video' ? 'excelwave' : 'video'), 10000);
    return () => clearTimeout(timer);
  }, [heroTab, currentPage]);

  // Media Assets attached by user
  const MAIN_VIDEO_SRC = "/assets/main_video.mp4";
  const MAIN_VIDEO_POSTER_SRC = "/assets/main_video_poster.webp"; // 영상 첫 장면 (로딩 중 표시)
  const EXCELWAVE_BANNER_SRC = "/assets/excelwave_banner.webp";
  const EXCELWAVE_BANNER_MOBILE_SRC = "/assets/excelwave_banner_mobile.webp";

  // 메인 영상: 화면 밖으로 나가면 일시정지, 다시 보이면 재생
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [currentPage]);

  // Price Data State (allows adding items)
  // 보유 장비 소개
  const DEVICES: { badge: string; area: string; name: string; sub: string; desc: string; link: 'event' | 'prices' }[] = [
    {
      badge: "NEW · MICROWAVE",
      area: "리프팅 · 윤곽 · 바디",
      name: "엑셀웨이브 (Excelwave)",
      sub: "2.45GHz 극초단파 리프팅",
      desc: "강력한 쿨링으로 피부 표면은 보호하고, 2.45GHz 마이크로웨이브로 깊은 층을 따뜻하게 자극하는 비수술 리프팅입니다. 얼굴과 바디 모두 시술합니다.",
      link: 'event'
    },
    {
      badge: "RF LIFTING",
      area: "탄력 · 리프팅",
      name: "볼뉴머 (Volnewmer)",
      sub: "고주파(RF) 리프팅",
      desc: "고주파 에너지로 피부 탄력과 리프팅을 돕는 장비입니다. 슈링크와 함께 받는 볼링크 이벤트로도 진행합니다.",
      link: 'event'
    },
    {
      badge: "PICO LASER",
      area: "기미 · 잡티 · 색소",
      name: "피코케어 마제스티",
      sub: "피코초 레이저",
      desc: "피코초(1조분의 1초) 단위의 짧은 펄스로 색소를 잘게 분해하는 피코 레이저입니다. 기미·잡티 등 색소 치료와 피부톤 개선에 사용합니다.",
      link: 'prices'
    },
    {
      badge: "LASER",
      area: "표재성 · 진피성 색소",
      name: "루카스 (LUCAS)",
      sub: "Q-Switched Nd:YAG 레이저 (1064/532nm)",
      desc: "루카스(LUCAS) 레이저는 엔디야그(Q-Switched Nd:YAG) 레이저로 1064/532nm 두 가지 파장을 활용하여 피부의 표재성·진피성 색소 질환을 효과적으로 치료하는 고출력 색소 레이저 장비입니다.",
      link: 'prices'
    },
    {
      badge: "LASER",
      area: "점 · 사마귀 · 혈관종",
      name: "브이레이저 (V-Laser)",
      sub: "점·사마귀·쥐젖 제거",
      desc: "점, 사마귀, 쥐젖, 검버섯, 혈관종 제거에 사용하는 레이저입니다. 크기별 수가는 상세 비급여 수가표에서 확인하실 수 있습니다.",
      link: 'prices'
    },
    {
      badge: "RF MICRONEEDLE",
      area: "모공 · 흉터 · 피부결",
      name: "시크릿 (Secret RF)",
      sub: "고주파 마이크로니들",
      desc: "미세한 바늘(마이크로니들)로 진피층에 고주파 열에너지를 전달하는 장비로, 모공·흉터·피부결 개선에 사용합니다.",
      link: 'prices'
    },
    {
      badge: "INMODE & SHRINK",
      area: "타이트닝 · 윤곽",
      name: "인모드 & 슈링크 유니버스",
      sub: "지방 감소 + 콜라겐 리모델링",
      desc: "HVP 에너지로 이중턱과 심부볼 지방세포를 사멸시키는 인모드(FX+FORMA)와, 2가지 초음파 모드(MP/Normal)로 빈틈없이 탄력을 채우는 슈링크 유니버스를 보유하고 있습니다.",
      link: 'prices'
    },
    {
      badge: "DIAGNOSIS & CARE",
      area: "정밀진단 · 메디컬케어",
      name: "마크뷰 & LDM 물방울 리프팅",
      sub: "4가지 광원 피부진단기 & 고밀도 초음파",
      desc: "시술 전 정확한 피부 분석을 위한 마크뷰(Mark-Vu) 시스템과, 레이저 및 스킨부스터 시술 후 즉각적인 진정·보습·장벽 재생을 돕는 LDM, 크라이오, 아쿠아필 장비를 완비했습니다.",
      link: 'prices'
    }
  ];

  // 대표원장 사진·약력 (약력은 원장님이 주신 원문 그대로)
  const DOCTOR_PHOTO_SRC = "/assets/doctor_park.webp";
  const ABOUT_PHOTO_SRC = "/assets/about_doctor_cutout.webp";
  const DOCTOR_CAREER = [
    '공주 한일고 졸업',
    '충남대학교 의과대학 졸업',
    '전) 유스앤영 서울뷰의원 총괄원장',
    '대한피부레이저모발학회 정회원',
    '대한비만학회 정회원',
    '대한 항노화학회 정회원'
  ];

  // 홈에 보여 줄 최신 칼럼 3편 (날짜 "2026. 10. 29" 형식이라 글자 순 정렬 = 날짜 순)
  const latestColumns = [...COLUMNS_DATA].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  // 모바일 칼럼 카드 자동 넘기기: 칼럼 칸이 화면에 들어오고 1초 뒤 다음 카드로 2초 동안 천천히 이동하고,
  // 이후 3.5초마다 한 장씩 넘김. 마지막 '더 많은 칼럼' 카드에서 멈춤.
  // 손으로 옆으로 밀 때만 자동 이동을 멈춘다 (페이지를 위아래로 스크롤하다 카드를 스친 것은 무시).
  const columnScrollRef = useRef<HTMLDivElement>(null);
  const baScrollRef = useRef<HTMLDivElement>(null);
  // PC 화살표: 자동 흐름 중에도 한 번에 크게 이동 (아래 효과에서 실제 동작을 채움)
  const baNudge = useRef<(dx: number) => void>(() => {});

  // 홈 전후사진 자동 흐름: 화면에 보이는 동안 초당 약 35px씩 천천히 왼쪽으로 흘러가고,
  // 첫 번째 묶음 끝에 닿으면 같은 모양의 두 번째 묶음 시작점에서 처음 위치로 되돌려 끊김 없이 순환.
  // 손으로 옆으로 밀거나 화살표를 누르면 2초 쉬었다가 그 위치에서 다시 흐른다 (위아래 스크롤 중에는 계속 흐름).
  useEffect(() => {
    const el = baScrollRef.current;
    if (!el || currentPage !== 'home') return;
    const SPEED = 35; // px/초
    let pos = el.scrollLeft;
    let last = 0;
    let raf = 0;
    let visible = false;
    let pausedUntil = 0;
    let touching = false;
    const loopWidth = () => {
      const second = el.querySelector<HTMLElement>('[data-ba-copy="1"]');
      const first = el.querySelector<HTMLElement>('[data-ba-copy="0"]');
      return second && first ? second.offsetLeft - first.offsetLeft : 0;
    };
    const wrap = (x: number) => {
      const w = loopWidth();
      if (!w) return x;
      if (x >= w) return x - w;
      if (x < 0) return x + w;
      return x;
    };
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft; // 손으로 민 위치를 따라감
      if (visible && !touching && now > pausedUntil) {
        pos = wrap(pos + SPEED * dt);
        el.scrollLeft = pos;
      } else if (!touching && now > pausedUntil) {
        const w = wrap(el.scrollLeft);
        if (w !== el.scrollLeft) { el.scrollLeft = w; pos = w; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.2 });
    io.observe(el);
    // 옆으로 미는 손가락만 '직접 넘기기'로 보고 멈춤. 페이지를 위아래로 스크롤하다 카드를 스친 것은 무시하고 계속 흐른다.
    let sx = 0, sy = 0;
    const onDown = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - sx), dy = Math.abs(e.touches[0].clientY - sy);
      if (!touching && dx > 8 && dx > dy) touching = true;
    };
    const onUp = () => {
      if (!touching) return;
      touching = false; pausedUntil = performance.now() + 2000; pos = el.scrollLeft;
    };
    el.addEventListener('touchstart', onDown, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onUp, { passive: true });
    el.addEventListener('touchcancel', onUp, { passive: true });
    baNudge.current = (dx: number) => {
      pausedUntil = performance.now() + 2600;
      // 경계를 넘을 때는 같은 모양의 다른 묶음 위치로 먼저 옮긴 뒤 부드럽게 이동
      const w = loopWidth();
      if (dx < 0 && el.scrollLeft + dx < 0) el.scrollLeft += w;
      if (dx > 0 && el.scrollLeft + dx >= w) el.scrollLeft -= w;
      pos = el.scrollLeft;
      el.scrollBy({ left: dx, behavior: 'smooth' });
    };
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener('touchstart', onDown); el.removeEventListener('touchmove', onMove); el.removeEventListener('touchend', onUp); el.removeEventListener('touchcancel', onUp);
    };
  }, [currentPage]);
  useEffect(() => {
    const el = columnScrollRef.current;
    if (!el || currentPage !== 'home') return;
    if (window.matchMedia('(min-width: 768px)').matches) return;
    let timer: number | undefined;
    let raf = 0;
    let stopped = false;
    let visible = false;

    const slideTo = (target: number) => {
      const start = el.scrollLeft;
      const t0 = performance.now();
      el.style.scrollSnapType = 'none'; // 스냅이 애니메이션을 끊지 않도록 잠시 끔
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 2000);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        el.scrollLeft = start + (target - start) * ease;
        if (p < 1 && !stopped) raf = requestAnimationFrame(step);
        else el.style.scrollSnapType = '';
      };
      raf = requestAnimationFrame(step);
    };

    const next = () => {
      if (stopped || !visible) return;
      const cards = Array.from(el.children) as HTMLElement[];
      const pad = parseFloat(getComputedStyle(el).paddingLeft);
      const nextCard = cards.find((c) => c.offsetLeft - pad > el.scrollLeft + 4);
      const max = el.scrollWidth - el.clientWidth;
      if (!nextCard || el.scrollLeft >= max - 2) return; // 끝까지 왔으면 멈춤
      slideTo(Math.min(nextCard.offsetLeft - pad, max));
      timer = window.setTimeout(next, 3500);
    };

    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) { window.clearTimeout(timer); timer = window.setTimeout(next, 1000); }
      if (!visible) window.clearTimeout(timer);
    }, { threshold: 0.3 });
    io.observe(el);

    const stop = () => { stopped = true; window.clearTimeout(timer); cancelAnimationFrame(raf); el.style.scrollSnapType = ''; };
    let sx = 0, sy = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - sx), dy = Math.abs(e.touches[0].clientY - sy);
      if (dx > 12 && dx > dy) stop(); // 옆으로 미는 동작일 때만 멈춤
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    return () => { io.disconnect(); stop(); el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove); };
  }, [currentPage]);



  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  if (currentPage !== 'home') {
    return (
      <Suspense fallback={null}>
        {currentPage === 'event' && (
          <EventPage
            onNavigateHome={(sec) => navigateTo('home', sec)}
            onNavigateToPrices={() => navigateTo('prices')}
            onNavigateToColumn={() => navigateTo('column')}
          />
        )}
        {currentPage === 'prices' && (
          <PricePage
            onNavigateHome={(sec) => navigateTo('home', sec)}
            onNavigateEvent={() => navigateTo('event')}
            onNavigateColumn={() => navigateTo('column')}
          />
        )}
        {currentPage === 'privacy' && (
          <PrivacyPage
            onNavigateHome={(sec) => navigateTo('home', sec)}
            onNavigateEvent={() => navigateTo('event')}
            onNavigatePrices={() => navigateTo('prices')}
            onNavigateColumn={() => navigateTo('column')}
          />
        )}
        {currentPage === 'ba' && (
          <BeforeAfterPage
            categoryId={pathname.startsWith('/before-after/') ? pathname.slice('/before-after/'.length) : null}
            onNavigateHome={(sec) => navigateTo('home', sec)}
            onNavigateEvent={() => navigateTo('event')}
            onNavigatePrices={() => navigateTo('prices')}
            onNavigateColumn={() => navigateTo('column')}
          />
        )}
        {currentPage === 'guide' && (
          <GuidePage
            guideId={pathname.startsWith('/guide/') ? pathname.slice('/guide/'.length) : null}
            onNavigateHome={(sec) => navigateTo('home', sec)}
            onNavigateEvent={() => navigateTo('event')}
            onNavigatePrices={() => navigateTo('prices')}
            onNavigateColumn={() => navigateTo('column')}
          />
        )}
        {currentPage === 'column' && (
          <ColumnPage
            initialArticleId={selectedColumnArticleId}
            onNavigateHome={(sec) => navigateTo('home', sec)}
            onNavigateToPrices={() => navigateTo('prices')}
            onNavigateToEvent={() => navigateTo('event')}
          />
        )}
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] selection:bg-[#0F2B22] selection:text-white">
      {/* ================= MAIN HEADER & NAVIGATION (모든 페이지 공용) ================= */}
      <SiteHeader
        onLogo={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onSection={(id, sub) => {
          scrollToSection(id);
          if (sub?.tab === 'about') setAboutTab(sub.id as typeof aboutTab);
        }}
        onEvent={() => navigateTo('event')}
        onPrices={() => navigateTo('prices')}
        onColumn={() => navigateTo('column')}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {/* ================= MOBILE DRAWER (이벤트·수가표·칼럼 페이지와 같은 메뉴) ================= */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigateHome={(sec) => navigateTo('home', sec)}
        onNavigateEvent={() => navigateTo('event')}
        onNavigatePrices={() => navigateTo('prices')}
        onNavigateColumn={() => navigateTo('column')}
      />

      {/* ================= RIGHT FLOATING QUICK BAR ================= */}
      <aside className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col bg-white border border-[#E5E5E8] rounded-xl shadow-md overflow-hidden divide-y divide-[#E5E5E8] w-20 text-center">
        <button
          onClick={openNaverBooking}
          className="py-3.5 px-2 bg-[#0F2B22] text-white hover:bg-[#173F32] transition flex flex-col items-center justify-center group cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-[#C5A880] mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-bold">예약</span>
        </button>
        <button
          onClick={() => navigateTo('event')}
          className="py-3.5 px-2 hover:bg-[#C5A880]/15 transition flex flex-col items-center justify-center text-[#111111] cursor-pointer group"
        >
          <Sparkles className="w-5 h-5 text-[#A6895E] mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-bold text-[#0F2B22]">이벤트</span>
        </button>
        <button
          onClick={() => navigateTo('column')}
          className="py-3.5 px-2 hover:bg-[#F7F7F8] transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-[#A6895E] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">원장칼럼</span>
        </button>
        <button
          onClick={() => window.open(KAKAO_CHAT_URL, '_blank', 'noopener,noreferrer')}
          className="py-3.5 px-2 hover:bg-[#FEE500]/20 transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#3C1E1E] fill-[#FEE500] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">카톡상담</span>
        </button>
        <button
          onClick={() => scrollToSection('sec-ba')}
          className="py-3.5 px-2 hover:bg-[#F7F7F8] transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <Images className="w-5 h-5 text-[#A6895E] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">전후사진</span>
        </button>
        <button
          onClick={() => scrollToSection('sec-location')}
          className="py-3.5 px-2 hover:bg-[#F7F7F8] transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <MapPin className="w-5 h-5 text-[#0F2B22] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">오시는길</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="py-2.5 bg-[#F7F7F8] text-zinc-500 hover:text-[#111111] text-[10px] font-en-cond tracking-widest flex flex-col items-center cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          TOP
        </button>
      </aside>

      {/* ================= MAIN HERO (멀티탭: 1번 영상 단독 뷰, 2번 엑셀웨이브 런칭 소개) ================= */}
      <section
        className="relative bg-[#071510] text-white overflow-hidden min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center"
      >
        {/* Background Video Element — 영상이 준비되기 전에도 첫 장면(poster)이 바로 보이게 해서 검은 화면이 뜨지 않도록 함 */}
        <div
          className="absolute inset-0 overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${MAIN_VIDEO_POSTER_SRC})` }}
        >
          <video
            ref={heroVideoRef}
            src={MAIN_VIDEO_SRC}
            poster={MAIN_VIDEO_POSTER_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>
        </div>

        {/* TAB 1: 영상 위 메인 문구 (사용자가 정한 문구 그대로). 엑셀웨이브 배너(z-10)가 나타나면 그 아래로 가려진다 */}
        <div inert={heroTab !== 'video'} className="absolute inset-0 z-[5] bg-black/30 sm:bg-transparent bg-gradient-to-r from-black/50 via-black/15 to-transparent sm:from-black/65 sm:via-black/30">
          {/* 배너로 넘어갈 때는 문구 전체가 서서히 사라지고, 영상으로 돌아오면 key가 바뀌어 다시 떠오르며 나타남 */}
          <div
            key={`hero-text-${heroRound}`}
            className={`h-full max-w-7xl mx-auto px-6 md:px-24 lg:px-28 flex flex-col justify-center transition-opacity duration-[1500ms] ease-in-out ${
              heroTab === 'video' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* 바탕체 제목(PC는 한 줄) + 금색 영어 병원 이름 */}
            <h1 className={`font-serif-kr text-[30px] leading-[1.45] sm:text-[44px] lg:text-[54px] lg:leading-tight lg:whitespace-nowrap text-white tracking-[-0.01em] break-keep ${heroTab === 'video' ? 'hero-fade-1' : ''}`}>
              당신의 자연스러운<br className="lg:hidden" /> 아름다움을 봅니다.
            </h1>
            <p className={`mt-5 sm:mt-7 font-en-serif uppercase text-base sm:text-xl tracking-[0.35em] text-[#D9C29A] ${heroTab === 'video' ? 'hero-fade-2' : ''}`}>
              Seoulview Clinic
            </p>
          </div>
        </div>

        {/* TAB 2: 엑셀웨이브 신규 도입 배너 이미지 + 상담/이벤트 버튼 (영상 위에서 1.5초 동안 서서히 나타나고 사라짐) */}
        <div
          inert={heroTab !== 'excelwave'}
          aria-hidden={heroTab !== 'excelwave'}
          className={`absolute inset-0 z-10 bg-[#F3DFD0] transition-opacity duration-[1500ms] ease-in-out will-change-[opacity] motion-reduce:transition-none ${
            heroTab === 'excelwave' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* PC·태블릿: 가로 배너 */}
          <div className="hidden md:flex h-full items-center justify-center">
            <div className="@container relative w-full aspect-[2000/730]">
              <img
                src={EXCELWAVE_BANNER_SRC}
                alt="2.45GHz 극초단파 리프팅 엑셀웨이브(Excelwave) 신규 도입"
                className="w-full h-full object-contain [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
              />
              {/* 배너 이미지의 설명 글씨가 깨져 있어 이미지에서 지우고, 원래 문구를 글자로 얹음 (배너 너비에 맞춰 크기 조절) */}
              <p
                className="absolute left-[17.2%] top-[54%] w-[37%] text-[#4A3F38] break-keep leading-[1.55]"
                style={{ fontSize: '1.07cqw' }}
              >
                강력한 쿨링으로 피부 표면은 안전하게 보호하고, 2.45GHz 마이크로웨이브로 깊은 층을 따뜻하게 자극합니다. 처진 탄력과 무너진 윤곽, 거친 피부결을 한 번에 매끄럽게 정돈해 주는 비수술 리프팅 솔루션입니다.
              </p>
              {/* 데스크톱: 배너 문구 아래에 버튼 배치 */}
              <div className="hidden md:flex absolute left-[17.5%] top-[71%] flex-wrap gap-3">
                <button
                  onClick={openNaverBooking}
                  className="bg-[#4A2E24] hover:bg-[#2E1C16] text-white font-bold px-6 py-3 rounded-lg text-sm transition-all shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4 text-[#E8C9B5]" />
                  <span>엑셀웨이브 런칭 특가 상담</span>
                </button>
                <button
                  onClick={() => navigateTo('event')}
                  className="bg-white/70 hover:bg-white text-[#4A2E24] border border-[#4A2E24]/25 px-5 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#9C6B52]" />
                  <span>이달의 이벤트 전용 페이지로 이동</span>
                </button>
              </div>
            </div>
          </div>

          {/* 모바일: 세로 배너, 버튼은 장비 왼쪽 빈 공간에 */}
          <div className="md:hidden relative h-full">
            <img
              src={EXCELWAVE_BANNER_MOBILE_SRC}
              alt="2.45GHz 극초단파 리프팅 엑셀웨이브(Excelwave) 신규도입"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute left-4 bottom-[13%] w-[52%] flex flex-col gap-2">
              <button
                onClick={openNaverBooking}
                className="bg-[#4A2E24] text-white font-bold px-3 py-2.5 rounded-lg text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#E8C9B5] shrink-0" />
                <span>런칭 특가 상담</span>
              </button>
              <button
                onClick={() => navigateTo('event')}
                className="bg-white/80 text-[#4A2E24] border border-[#4A2E24]/25 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9C6B52] shrink-0" />
                <span>이달의 이벤트 보기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prev / Next Slide Arrow Buttons */}
        <button
          onClick={() => setHeroTab(prev => prev === 'video' ? 'excelwave' : 'video')}
          className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#0F2B22] border border-white/20 hover:border-[#C5A880] text-white items-center justify-center transition shadow-lg cursor-pointer"
          aria-label="이전 탭"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setHeroTab(prev => prev === 'video' ? 'excelwave' : 'video')}
          className="hidden md:flex absolute right-5 lg:right-28 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#0F2B22] border border-white/20 hover:border-[#C5A880] text-white items-center justify-center transition shadow-lg cursor-pointer"
          aria-label="다음 탭"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Bottom Slide Indicator (얇은 막대 2개, 눌러서 전환) */}
        <div className="absolute bottom-5 left-0 right-0 z-30 flex items-center justify-center gap-2">
          {([
            { id: 'video', label: '서울뷰 시그니처 영상' },
            { id: 'excelwave', label: '2.45GHz 엑셀웨이브 신규 도입' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setHeroTab(tab.id)}
              aria-label={tab.label}
              aria-current={heroTab === tab.id}
              className="py-3 px-1 cursor-pointer group"
            >
              <span
                className={`block h-1 w-10 sm:w-12 rounded-full transition-colors shadow-[0_0_0_1px_rgba(0,0,0,0.12)] ${
                  heroTab === tab.id ? 'bg-[#C5A880]' : 'bg-white/70 group-hover:bg-white'
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* ================= SECTION: BEFORE & AFTER (영상 바로 아래) ================= */}
      <section id="sec-ba" className="py-20 md:py-28 bg-[#F7F7F8] border-b border-[#E5E5E8]">
        {/* lg:pr-28 — 오른쪽 고정 퀵메뉴에 열람 동의 버튼·사진이 가려지지 않도록 (넓은 2xl 화면은 불필요) */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 lg:pr-28 2xl:pr-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-base sm:text-xl text-[#A6895E] font-bold">
                서울뷰의원 당진은 결과로 증명합니다.
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] mt-1.5">시술 전후사진</h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">보정 없는 동일 조명·동일 각도 임상 전후 기록입니다.</p>
            </div>
            <BaConsentToggle
              unlocked={isBaUnlocked}
              onToggle={() => {
                setIsBaUnlocked(!isBaUnlocked);
                showToast(!isBaUnlocked ? "의료법 준수 전후사진 열람 동의가 확인되었습니다." : "블러 보호 모드가 다시 활성화되었습니다.");
              }}
            />
          </div>

          {/* 모든 분류의 사례를 한 줄로 나열, 화면에 보이면 천천히 계속 옆으로 흘러가고 끝나면 처음으로 이어짐 (손으로 밀거나 PC 화살표로도 이동) */}
          <div className="relative">
            {/* 같은 목록을 두 번 이어 붙여, 끝에 닿으면 처음으로 자연스럽게 이어지게 함 (두 번째 묶음은 화면 읽기 프로그램에서 숨김) */}
            <div ref={baScrollRef} className="flex overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 pb-2">
              {[0, 1].map((copy) => (
                <div key={copy} data-ba-copy={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-4 md:gap-6 pr-4 md:pr-6">
                  {ALL_BA_ITEMS.map((item) => (
                    <BaCard
                      key={item.title}
                      item={item}
                      category={item.category}
                      unlocked={isBaUnlocked}
                      onUnlock={() => {
                        setIsBaUnlocked(true);
                        showToast("의료법 준수 전후사진 열람 동의가 확인되었습니다.");
                      }}
                      className="w-[80vw] max-w-[420px] sm:w-[420px] shrink-0"
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* PC 좌우 화살표 */}
            <button
              onClick={() => baNudge.current(-450)}
              aria-label="이전 전후사진"
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#E5E5E8] shadow-md items-center justify-center text-[#0F2B22] hover:bg-[#0F2B22] hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => baNudge.current(450)}
              aria-label="다음 전후사진"
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#E5E5E8] shadow-md items-center justify-center text-[#0F2B22] hover:bg-[#0F2B22] hover:text-white transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 mt-6 border-t border-[#E5E5E8] pt-4">{BA_LEGAL_NOTICE}</p>
        </div>
      </section>

      {/* ================= SECTION 1: ABOUT ================= */}
      {/* lg:pr-28 — 오른쪽 탭(원내 시설 소개)이 고정 퀵메뉴에 가려지지 않도록 (넓은 2xl 화면은 불필요) */}
      <section id="sec-about" className="py-20 md:py-28 max-w-7xl mx-auto px-4 lg:px-8 lg:pr-28 2xl:pr-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E5E5E8] pb-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#111111]">서울뷰의원 당진점 소개</h2>
          </div>
          {/* 하위 탭 4개: 모바일은 짧은 이름으로 한 줄에 4개, PC는 제목 오른쪽에 한 줄 */}
          <div className="grid grid-cols-4 gap-1.5 mt-5 md:mt-0 md:flex md:gap-2">
            {([
              { id: 'brand', label: '서울뷰의원 당진', short: '병원 소개' },
              { id: 'doctor', label: '대표원장 소개', short: '대표원장' },
              { id: 'devices', label: '보유 장비 소개', short: '보유 장비' },
              { id: 'facility', label: '원내 시설 소개', short: '원내 시설' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAboutTab(tab.id)}
                aria-label={tab.label}
                className={`px-1 py-2.5 md:px-5 rounded text-xs md:text-sm whitespace-nowrap transition cursor-pointer ${
                  aboutTab === tab.id
                    ? 'font-bold bg-[#111111] text-white'
                    : 'font-medium bg-[#F7F7F8] text-zinc-600 hover:text-[#111111]'
                }`}
              >
                <span className="md:hidden">{tab.short}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1-1. Brand Philosophy */}
        {aboutTab === 'brand' && (
          <div className="space-y-12 animate-in fade-in">
            {/* Top Philosophy Intro Banner (사용자가 고른 시안 A): 크림 배경 + 딥그린 굵은 인용문, "당진 서울뷰의원"만 금색,
                금색 짧은 선, 원장 누끼 사진은 오른쪽 아래, 칼럼 보기 둥근 테두리 버튼.
                모바일·태블릿: 카드 안에 인용문(위) · 사진(오른쪽 아래) · 버튼(왼쪽 아래), 설명 문단은 카드 아래
                PC(1024px~): 왼쪽에 인용문 · 선 · 설명 · 버튼, 오른쪽에 사진 */}
            <div>
              <div className="relative overflow-hidden rounded-2xl border border-[#E7DCCB] bg-gradient-to-b from-[#FAF8F5] to-[#F1ECE4] h-[560px] sm:h-[640px] lg:h-auto lg:min-h-[520px] lg:grid lg:grid-cols-12">
                <div className="absolute right-[-10%] bottom-[-18%] w-[90%] lg:w-[46%] max-w-[480px] aspect-square rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.30)_0%,rgba(197,168,128,0.10)_55%,transparent_72%)]" />
                <img
                  src={ABOUT_PHOTO_SRC}
                  alt="박상덕 대표원장"
                  className="absolute bottom-0 right-[-30px] sm:right-0 h-[56%] sm:h-[58%] lg:h-[92%] w-auto max-w-none object-contain object-bottom"
                  loading="lazy"
                />
                <div className="relative z-10 lg:col-span-7 px-5 min-[380px]:px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:py-14 flex flex-col lg:justify-center">
                  {/* 뜻이 끊기지 않는 곳에서 줄바꿈 (break-keep: 단어 중간에서 안 끊김) */}
                  <h3 className="text-[18px] min-[380px]:text-[23px] sm:text-[30px] lg:text-[34px] font-extrabold text-[#0F2B22] leading-[1.42] tracking-[-0.03em] break-keep">
                    “수준 높은 시술을 위해<br /> 굳이 멀리 떠나실 필요 없도록,<br />
                    <span className="text-[#A6895E]">당진 서울뷰의원</span>에서<br /> 타협 없는 실력과 정성으로<br /> 증명해 보이겠습니다.”
                  </h3>
                  <div className="w-9 h-0.5 bg-[#C5A880] mt-5 lg:mt-7" />
                  <p className="hidden lg:block text-[15px] lg:text-base text-zinc-700 leading-relaxed mt-6 max-w-[460px] break-keep">
                    당진 서울뷰의원은 나와 내 가족에게도 자신 있게 권할 수 있는 꼭 필요한 시술만을 정직하게 추천합니다. 또한, 친절함을 넘어 최상의 결과를 만들어내는 탄탄한 실력과 끊임없는 연구로 여러분의 건강한 아름다움을 책임지겠습니다.
                  </p>
                  <button
                    onClick={() => navigateTo('column')}
                    className="hidden lg:inline-flex mt-8 self-start items-center gap-1.5 rounded-full border-[1.5px] border-[#0F2B22] bg-white/85 hover:bg-[#0F2B22] hover:text-white text-[#0F2B22] font-bold text-[15px] px-5 py-3 transition cursor-pointer"
                  >
                    대표원장 칼럼 보기 <span aria-hidden="true">→</span>
                  </button>
                </div>
                {/* 모바일·태블릿 버튼: 카드 왼쪽 아래 */}
                <button
                  onClick={() => navigateTo('column')}
                  className="lg:hidden absolute z-10 left-6 sm:left-10 bottom-6 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#0F2B22] bg-white/85 text-[#0F2B22] font-bold text-[15px] px-5 py-3 cursor-pointer"
                >
                  대표원장 칼럼 보기 <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className="lg:hidden text-sm sm:text-base text-zinc-700 leading-relaxed mt-5 px-1 break-keep">
                당진 서울뷰의원은 나와 내 가족에게도 자신 있게 권할 수 있는 꼭 필요한 시술만을 정직하게 추천합니다. 또한, 친절함을 넘어 최상의 결과를 만들어내는 탄탄한 실력과 끊임없는 연구로 여러분의 건강한 아름다움을 책임지겠습니다.
              </p>
            </div>

            {/* 4 Core Promises Section (서울뷰의원의 약속 - 브랜드 시그니처 딥그린 & 골드 톤) */}
            <div className="bg-[#FAF8F5] border border-[#C5A880]/40 rounded-2xl py-8 px-6 sm:p-12 shadow-xs">
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <h3 className="text-2xl sm:text-4xl font-bold text-[#0F2B22] tracking-tight">
                  서울뷰의원의 약속
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 font-medium mt-3 leading-relaxed">
                  피부 문제의 근본을 바로잡는 네 가지 원칙,<br className="sm:hidden" />
                  {" "}원칙을 지키면, 결과가 다릅니다.
                </p>
              </div>

              {/* 4가지 원칙: 모바일은 옆으로 넘겨 보기, 태블릿 2열·PC 4열 (세로 구분선) */}
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-0 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar -mx-6 px-6 scroll-px-6 sm:mx-0 sm:px-0 sm:divide-x divide-[#C5A880]/25">
                {/* 1. 정확한 진단 */}
                <div className="w-[70%] shrink-0 snap-start sm:w-auto bg-white sm:bg-transparent border border-[#C5A880]/30 sm:border-0 rounded-xl sm:rounded-none text-center px-4 py-6 sm:py-2 flex flex-col items-center group">
                  <div className="h-16 sm:h-24 flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-20 sm:h-20 text-[#A6895E] stroke-current" fill="none" strokeWidth="1.6">
                      <circle cx="50" cy="50" r="30" />
                      <circle cx="38" cy="42" r="22" />
                      <circle cx="62" cy="42" r="22" />
                      <circle cx="42" cy="60" r="22" />
                      <circle cx="58" cy="60" r="22" />
                      <circle cx="50" cy="34" r="22" />
                      <circle cx="50" cy="66" r="22" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0F2B22] mb-2 sm:mb-3">정확한 진단</h4>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-[220px] break-keep">
                    전문 피부 진단기로 색소의 깊이, 탄력까지 세밀하게 분석하여 진짜 원인부터 찾습니다.
                  </p>
                </div>

                {/* 2. 근본적인 치료 */}
                <div className="w-[70%] shrink-0 snap-start sm:w-auto bg-white sm:bg-transparent border border-[#C5A880]/30 sm:border-0 rounded-xl sm:rounded-none text-center px-4 py-6 sm:py-2 flex flex-col items-center group">
                  <div className="h-16 sm:h-24 flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-20 sm:h-20 text-[#A6895E] stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M 22 46 A 30 30 0 0 1 78 46" />
                      <path d="M 28 55 A 24 24 0 0 1 72 55" />
                      <path d="M 35 64 A 17 17 0 0 1 65 64" />
                      <path d="M 42 72 A 10 10 0 0 1 58 72" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0F2B22] mb-2 sm:mb-3">근본적인 치료</h4>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-[220px] break-keep">
                    일시적 개선이 아닌 건강한 피부를 위한 맞춤 솔루션을 제공해드립니다.
                  </p>
                </div>

                {/* 3. 정직한 프리미엄 */}
                <div className="w-[70%] shrink-0 snap-start sm:w-auto bg-white sm:bg-transparent border border-[#C5A880]/30 sm:border-0 rounded-xl sm:rounded-none text-center px-4 py-6 sm:py-2 flex flex-col items-center group">
                  <div className="h-16 sm:h-24 flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 120 100" className="w-16 h-14 sm:w-24 sm:h-20 text-[#A6895E] stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round">
                      {/* Left floret */}
                      <g transform="translate(26, 50)">
                        <line x1="0" y1="-13" x2="0" y2="13" />
                        <line x1="-13" y1="0" x2="13" y2="0" />
                        <line x1="-9" y1="-9" x2="9" y2="9" />
                        <line x1="-9" y1="9" x2="9" y2="-9" />
                        <circle cx="0" cy="0" r="3" fill="currentColor" />
                      </g>
                      {/* Center floret */}
                      <g transform="translate(60, 50)">
                        <line x1="0" y1="-15" x2="0" y2="15" />
                        <line x1="-15" y1="0" x2="15" y2="0" />
                        <line x1="-11" y1="-11" x2="11" y2="11" />
                        <line x1="-11" y1="11" x2="11" y2="-11" />
                        <circle cx="0" cy="0" r="3.5" fill="currentColor" />
                      </g>
                      {/* Right floret */}
                      <g transform="translate(94, 50)">
                        <line x1="0" y1="-13" x2="0" y2="13" />
                        <line x1="-13" y1="0" x2="13" y2="0" />
                        <line x1="-9" y1="-9" x2="9" y2="9" />
                        <line x1="-9" y1="9" x2="9" y2="-9" />
                        <circle cx="0" cy="0" r="3" fill="currentColor" />
                      </g>
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0F2B22] mb-2 sm:mb-3">정직한 프리미엄</h4>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-[220px] break-keep">
                    정품 · 정량의 오리지널 장비를 사용한 프리미엄 진료를 경험해보세요.
                  </p>
                </div>

                {/* 4. 본연의 아름다움 */}
                <div className="w-[70%] shrink-0 snap-start sm:w-auto bg-white sm:bg-transparent border border-[#C5A880]/30 sm:border-0 rounded-xl sm:rounded-none text-center px-4 py-6 sm:py-2 flex flex-col items-center group">
                  <div className="h-16 sm:h-24 flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-20 sm:h-20 text-[#A6895E] stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 52 84 Q 48 50 62 18" />
                      <path d="M 50 70 C 36 68 32 58 46 54 C 48 60 49 66 50 70 Z" />
                      <path d="M 52 58 C 66 56 70 46 56 42 C 54 48 53 54 52 58 Z" />
                      <path d="M 55 45 C 42 42 40 34 52 30 C 54 36 55 41 55 45 Z" />
                      <path d="M 59 32 C 72 28 74 18 62 16 C 60 22 59 28 59 32 Z" />
                      <path d="M 62 18 C 64 12 59 10 57 12 C 56 15 59 17 62 18 Z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0F2B22] mb-2 sm:mb-3">본연의 아름다움</h4>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-[220px] break-keep">
                    피부 문제의 근본적인 치료를 통해, 내가 가진 본연의 아름다움을 찾아갑니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1-2. Doctor (대표원장 사진 + 약력, 약력은 원장님이 주신 원문 그대로) */}
        {aboutTab === 'doctor' && (
          <div className="grid md:grid-cols-12 gap-6 lg:gap-10 items-stretch animate-in fade-in">
            <div className="md:col-span-5 rounded-2xl overflow-hidden bg-[#F7F7F8] border border-[#E5E5E8]">
              <img
                src={DOCTOR_PHOTO_SRC}
                alt="박상덕 대표원장"
                className="w-full h-full aspect-[4/5] object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-7 bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl p-6 sm:p-10 flex flex-col justify-center">
              <p className="text-xs sm:text-sm text-[#A6895E] font-bold">서울뷰의원당진 진료과목 피부과</p>
              <h3 className="text-3xl sm:text-4xl font-bold text-[#0F2B22] mt-2 tracking-tight">
                박상덕 <span className="text-lg sm:text-xl font-semibold text-[#A6895E]">대표원장</span>
              </h3>
              <div className="w-10 h-px bg-[#C5A880] my-6 sm:my-8" />
              <h4 className="text-sm font-bold text-[#A6895E] mb-1">약력</h4>
              <ul className="divide-y divide-[#C5A880]/20">
                {DOCTOR_CAREER.map((line) => (
                  <li key={line} className="py-3 flex items-start gap-3 text-sm sm:text-base text-zinc-800">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 1-3. Devices */}
        {aboutTab === 'devices' && (
          // 모바일은 옆으로 넘겨 보기, 태블릿 2열·PC 3열
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 animate-in fade-in">
            {DEVICES.map((device) => (
              <div
                key={device.name}
                className="w-[82%] shrink-0 snap-start sm:w-auto border border-[#E5E5E8] rounded-xl p-5 sm:p-6 bg-white hover:border-[#C5A880] transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-en-cond tracking-wider bg-[#0F2B22] text-[#C5A880] px-2.5 py-0.5 rounded font-bold">
                      {device.badge}
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">{device.area}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111111]">{device.name}</h3>
                  <p className="text-xs text-[#A6895E] font-medium mb-3">{device.sub}</p>
                  <p className="text-xs text-zinc-600 leading-relaxed">{device.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#E5E5E8] flex justify-end items-center text-xs">
                  <button
                    onClick={() => navigateTo(device.link)}
                    className="font-bold text-[#0F2B22] hover:underline cursor-pointer"
                  >
                    {device.link === 'event' ? '이벤트 보기 →' : '수가표 보기 →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 1-4. Facility (사용자가 사실로 확인한 항목만) */}
        {aboutTab === 'facility' && (
          <div className="animate-in fade-in">
            <div className="sm:max-w-md bg-[#F7F7F8] rounded-xl p-5 sm:p-6 border border-[#E5E5E8]">
              <span className="font-en-cond text-2xl font-bold text-[#A6895E]">SPACE 01</span>
              <h4 className="text-base font-bold text-[#111111] mt-2 mb-2">1인 프라이빗 메디컬 관리실</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">마취 크림 도포부터 레이저 후 진정 관리까지 다른 환자분과 마주치지 않는 쾌적한 1인 관리 베드를 운영합니다.</p>
            </div>
          </div>
        )}
      </section>



      {/* ================= SECTION 2: DR. COLUMN ================= */}
      <section id="sec-column" className="py-20 md:py-28 bg-[#F7F7F8] border-t border-[#E5E5E8]">
        {/* lg:pr-28 — 오른쪽 고정 퀵메뉴에 전체보기 버튼·카드가 가려지지 않도록 (넓은 2xl 화면은 불필요) */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 lg:pr-28 2xl:pr-8">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-[#111111]">대표원장 진료 칼럼</h2>
          </div>

          {/* 최신 칼럼 3편: 모바일은 옆으로 넘겨 보기(자동으로 천천히 넘어감) + 마지막에 '더 많은 칼럼' 카드, PC는 3열(마우스를 올리면 살짝 떠오름) */}
          <div ref={columnScrollRef} className="flex md:grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 scroll-px-4 md:mx-0 md:px-0 py-2 md:py-0">
            {latestColumns.map((col) => (
              <article
                key={col.id}
                onClick={() => navigateTo('column', col.id)}
                className="w-[82%] shrink-0 snap-start md:w-auto bg-white rounded-xl border border-[#E5E5E8] p-5 md:p-7 hover:border-[#C5A880] md:hover:-translate-y-2 md:hover:shadow-lg transition duration-300 ease-out cursor-pointer flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 text-[11px] text-zinc-400">
                    <span>{col.date}</span>
                    <span>{col.readTime}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[#111111] mt-3 group-hover:text-[#0F2B22] transition leading-snug break-keep">
                    {col.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-3 leading-relaxed line-clamp-3">
                    {col.preview}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E5E5E8] flex items-center justify-between gap-2 text-xs font-semibold text-[#A6895E] whitespace-nowrap">
                  <span className="lg:hidden xl:inline">대표원장 직접 집필</span>
                  <span className="group-hover:translate-x-1 transition flex items-center gap-1 ml-auto">
                    칼럼 전문 읽기 →
                  </span>
                </div>
              </article>
            ))}
            {/* 마지막 '더 많은 칼럼 보러가기' 화살표 (모바일은 넘김 끝, PC는 카드 3개 오른쪽) */}
            <button
              onClick={() => navigateTo('column')}
              className="w-[42%] md:w-28 shrink-0 snap-start flex flex-col items-center justify-center gap-3 rounded-xl text-[#0F2B22] cursor-pointer group/more"
            >
              <span className="w-14 h-14 rounded-full bg-[#0F2B22] text-white flex items-center justify-center shadow-md transition md:group-hover/more:translate-x-1 md:group-hover/more:bg-[#173F32]">
                <ChevronRight className="w-6 h-6" />
              </span>
              <span className="text-sm font-bold text-center leading-snug break-keep">더 많은 칼럼<br />보러가기</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: LOCATION & HOURS ================= */}
      {/* lg:pr-28 — 오른쪽에 온 진료시간 안내가 고정 퀵메뉴에 가려지지 않도록 (넓은 2xl 화면은 불필요) */}
      <section id="sec-location" className="py-20 md:py-28 max-w-7xl mx-auto px-4 lg:px-8 lg:pr-28 2xl:pr-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#111111]">오시는 길 및 진료안내</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Map Graphic */}
          <div className="lg:col-span-7 bg-[#F7F7F8] border border-[#E5E5E8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">서울뷰의원 당진점 위치 및 주차 안내</h3>
                  <p className="text-xs text-zinc-500">충청남도 당진시 시청2로 49-30, 7층</p>
                </div>
                <span className="bg-[#0F2B22] text-white text-xs px-3 py-1 rounded font-medium">
                  진료시간 무료주차
                </span>
              </div>

              {/* 구글 지도 (네이버 지도 API 키를 받으면 네이버 지도로 교체 예정) */}
              <div className="w-full h-64 sm:h-72 rounded-xl border border-[#E5E5E8] overflow-hidden bg-[#E9ECEA]">
                <iframe
                  title="서울뷰의원 당진점 위치 지도"
                  src={GOOGLE_MAP_EMBED_URL}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href={NAVER_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-[#03C75A] hover:bg-[#02b350] text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition"
              >
                네이버 지도에서 위치·길찾기 보기
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-6 text-xs">
              <div className="bg-white p-4 rounded-lg border border-[#E5E5E8]">
                <p className="font-bold text-[#111111] mb-1">자가용 및 주차 안내</p>
                <p className="text-zinc-600">건물 지하 1~2층 주차장 또는 건물 바로 옆 옥외 주차장을 이용하실 수 있으며, 진료시간 동안 무료로 주차하실 수 있습니다.</p>
              </div>
            </div>
          </div>
          {/* Timetable & Info */}
          <div className="lg:col-span-5 bg-[#0F2B22] text-white rounded-2xl p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#C5A880]">대표번호</span>
                <a href="tel:041-352-3994" className="block font-en-cond text-3xl sm:text-4xl font-bold text-white mt-1 hover:text-[#C5A880] transition">041-352-3994</a>
                <p className="text-xs text-zinc-300 mt-1">충청남도 당진시 시청2로 49-30, 7층</p>
              </div>

              <div className="border-t border-white/15 pt-5 space-y-2.5 text-xs sm:text-sm">
                <h3 className="font-bold text-[#C5A880] mb-3">진료시간 안내</h3>
                <div className="flex justify-between">
                  <span className="text-zinc-300">평 일</span>
                  <span className="font-semibold">AM 10:00 ~ PM 08:00</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>평일 점심시간</span>
                  <span>PM 01:00 ~ PM 02:00</span>
                </div>
                <div className="flex justify-between text-[#C5A880] font-bold">
                  <span>주 말</span>
                  <span>AM 10:00 ~ PM 08:00</span>
                </div>
                <p className="text-[11px] text-zinc-400 pt-1 text-right">주말은 점심시간 없이 진료합니다.</p>
                <p className="text-xs text-[#C5A880] font-semibold pt-2">※ 추석·설날 연휴를 제외하고 연중무휴로 진료합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#071510] text-zinc-400 py-14 border-t border-[#C5A880]/20 text-xs pb-24 lg:pb-14">
        {/* lg:pr-28 — 오른쪽 고정 퀵메뉴에 푸터 링크가 가려지지 않도록 (넓은 2xl 화면은 불필요) */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 lg:pr-28 2xl:pr-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={LOGO_SRC}
                  alt="꽃을보듯너를 서울뷰의원 당진"
                  className="h-11 w-auto object-contain filter drop-shadow-sm"
                />
              </div>
              <p className="text-zinc-400 leading-relaxed">
                상호명: 서울뷰의원 당진점 | 대표자: 박상덕 | 사업자등록번호: 109-26-65111<br />
                주소: 충청남도 당진시 시청2로 49-30, 7층 | 대표전화: 041-352-3994
              </p>
            </div>
            {/* 모바일에서도 링크 3개가 한 줄에 들어가도록 간격·글자 크기 조정 */}
            <div className="flex flex-nowrap gap-[min(1.6vw,16px)] sm:gap-4 items-start text-zinc-300 text-[min(3.2vw,12px)] whitespace-nowrap">
              <button
                onClick={() => navigateTo('prices')}
                className="hover:text-[#C5A880] cursor-pointer"
              >
                비급여 진료비용 안내
              </button>
              <span>|</span>
              <button
                onClick={() => navigateTo('privacy')}
                className="hover:text-[#C5A880] cursor-pointer"
              >
                개인정보 처리방침
              </button>
              <span>|</span>
              <button
                onClick={() => navigateTo('guide')}
                className="hover:text-[#C5A880] cursor-pointer"
              >
                시술 후 주의사항
              </button>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
            <p>© 2026 SEOUL VIEW CLINIC DANGJIN. ALL RIGHTS RESERVED.</p>
            <p>본 사이트의 모든 콘텐츠는 의료법을 준수하여 제작되었습니다.</p>
          </div>
        </div>
      </footer>

      {/* ================= MOBILE BOTTOM FIXED BAR ================= */}
      <MobileBottomBar onNavigateHome={(sec) => sec && scrollToSection(sec)} onNavigateEvent={() => navigateTo('event')} />

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-8 right-6 z-50 bg-[#0F2B22] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#C5A880] flex items-center gap-3 text-xs sm:text-sm animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
