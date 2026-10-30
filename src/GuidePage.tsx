import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GUIDE_DATA } from './data/guideData.ts';
import { MobileDrawer, MobileBottomBar } from './MobileNav.tsx';
import SiteHeader from './SiteHeader.tsx';
import { openNaverBooking, LOGO_SRC } from './clinicLinks.ts';
import { ShieldCheck, Info, Search, X } from 'lucide-react';

interface GuidePageProps {
  guideId: string | null; // 주소 /guide/<id>의 id (없으면 첫 번째 시술)
  onNavigateHome: (sectionId?: string) => void;
  onNavigateEvent: () => void;
  onNavigatePrices: () => void;
  onNavigateColumn: () => void;
}

export default function GuidePage({ guideId, onNavigateHome, onNavigateEvent, onNavigatePrices, onNavigateColumn }: GuidePageProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const guide = GUIDE_DATA.find((g) => g.id === guideId) ?? GUIDE_DATA[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // 없는 시술 주소(/guide/abc)는 /guide로 정리
  useEffect(() => {
    if (guideId && !GUIDE_DATA.some((g) => g.id === guideId)) navigate('/guide', { replace: true });
  }, [guideId]);

  useEffect(() => {
    document.title = `${guide.label} 시술안내 및 주의사항 | 서울뷰의원 당진점`;
  }, [guide.id]);

  // 탭을 바꾸면 주소도 /guide/<id>로 바뀐다 (특정 시술 안내를 링크로 보낼 수 있게)
  const selectTab = (id: string) => navigate(`/guide/${id}`, { replace: true });

  // 시술 검색: 탭 이름·검색용 시술명(keywords)·안내 문구에서 찾는다 (띄어쓰기·대소문자 무시)
  const [query, setQuery] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => {
    const norm = (t: string) => t.toLowerCase().replace(/\s+/g, '');
    const q = norm(query);
    if (!q) return [];
    return GUIDE_DATA.flatMap((g) => {
      const nameHit = [g.label, g.short, g.subtitle, ...g.keywords].some((t) => norm(t).includes(q));
      // 안내 문구 검색은 두 글자 이상일 때만 (한 글자는 너무 많이 걸림)
      const line = q.length >= 2 ? [g.downtime, ...g.precautions].find((t) => norm(t).includes(q)) : undefined;
      return nameHit || line ? [{ guide: g, line: nameHit ? undefined : line }] : [];
    });
  }, [query]);

  const openFromSearch = (id: string) => {
    selectTab(id);
    setQuery('');
    setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#111111] selection:bg-[#0F2B22] selection:text-white flex flex-col justify-between pb-14 lg:pb-0">
      {/* ================= MAIN HEADER & NAVIGATION (모든 페이지 공용) ================= */}
      <SiteHeader
        onLogo={() => onNavigateHome()}
        onSection={(id) => onNavigateHome(id)}
        onEvent={onNavigateEvent}
        onPrices={onNavigatePrices}
        onColumn={onNavigateColumn}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {/* ================= SUBPAGE HERO BANNER ================= */}
      <section className="bg-gradient-to-r from-[#0F2B22] via-[#12362a] to-[#1a231f] text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A6895E_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#A6895E]/50 bg-[#A6895E]/15 px-3.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="font-en-cond text-xs tracking-widest text-[#C5A880] uppercase">
                PROCEDURE GUIDE & PRECAUTIONS
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              서울뷰의원 당진점<br />
              <span className="text-[#C5A880]">시술안내 및 주의사항</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
              안전하고 만족스러운 결과를 위해 시술 전·후 꼭 확인하셔야 할 안내사항입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-10 sm:py-16">
        {/* 시술 검색 */}
        <div className="relative mb-3">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="시술명·고민 검색 (예: 리쥬란, 기미, 보톡스)"
            aria-label="시술 주의사항 검색"
            className="w-full pl-12 pr-11 py-3.5 rounded-xl border border-[#E5E5E8] bg-white text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#0F2B22] shadow-xs [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="검색어 지우기"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 검색 결과: 누르면 해당 시술 안내로 이동 */}
        {query.trim() && (
          <div className="mb-6 bg-white border border-[#E5E5E8] rounded-xl overflow-hidden divide-y divide-[#E5E5E8] shadow-xs">
            {results.length > 0 ? (
              results.map(({ guide: g, line }) => (
                <button
                  key={g.id}
                  onClick={() => openFromSearch(g.id)}
                  className="w-full text-left px-4 sm:px-5 py-3.5 hover:bg-[#FAF8F5] transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#111111]">{g.label}</span>
                    <span className="block text-xs text-zinc-500 mt-0.5 truncate">{line ?? g.subtitle}</span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-[#A6895E]">주의사항 보기 →</span>
                </button>
              ))
            ) : (
              <p className="px-4 sm:px-5 py-4 text-sm text-zinc-500">
                '{query.trim()}'에 대한 안내를 찾지 못했습니다. 궁금하신 점은 041-352-3994로 문의해 주세요.
              </p>
            )}
          </div>
        )}

        {/* 시술별 탭: 모바일은 짧은 이름으로 4개씩 두 줄, 태블릿·PC는 번호와 함께 한 줄로 */}
        <div className="grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:gap-2 mt-5 mb-8">
          {GUIDE_DATA.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => selectTab(g.id)}
              aria-current={guide.id === g.id}
              aria-label={g.label}
              className={`px-0.5 sm:px-4 py-2.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                guide.id === g.id
                  ? 'font-bold bg-[#0F2B22] text-white border border-[#0F2B22]'
                  : 'font-medium bg-white border border-[#E5E5E8] text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <span className="sm:hidden">{g.short}</span>
              <span className="hidden sm:inline">{String(idx + 1).padStart(2, '0')}. {g.label}</span>
            </button>
          ))}
        </div>

        {/* 선택한 시술 안내 */}
        <div ref={contentRef} key={guide.id} className="scroll-mt-24 bg-[#FAF8F5] border border-[#C5A880]/40 rounded-2xl p-6 sm:p-10 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C5A880]/30 pb-6 mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] break-keep">{guide.subtitle}</h2>
            </div>
            <button
              onClick={openNaverBooking}
              className="bg-[#0F2B22] text-white text-xs font-bold px-5 py-3 rounded-lg shrink-0 hover:bg-[#173F32] transition cursor-pointer"
            >
              해당 시술 상담 예약하기
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs">
            <div className="bg-white p-4 rounded-xl border border-[#E5E5E8]">
              <span className="text-zinc-400 block mb-1">시술 소요시간</span>
              <strong className="text-sm text-[#111111]">{guide.time}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E5E5E8]">
              <span className="text-zinc-400 block mb-1">마취 방법</span>
              <strong className="text-sm text-[#111111]">{guide.anesthesia}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E5E5E8]">
              <span className="text-zinc-400 block mb-1">권장 주기</span>
              <strong className="text-sm text-[#111111]">{guide.cycle}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E5E5E8]">
              <span className="text-zinc-400 block mb-1">회복 기간 (다운타임)</span>
              <strong className="text-sm text-[#0F2B22]">{guide.downtime}</strong>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E5E5E8]">
            <h3 className="text-sm font-bold text-[#111111] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]"></span> 시술 후 필수 주의사항 안내
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              {guide.precautions.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-en-cond font-bold text-[#A6895E]">0{idx + 1}.</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 공통 안내 */}
        <div className="mt-8 bg-white border border-[#E5E5E8] rounded-xl p-5 sm:p-6 space-y-3">
          <p className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-[#A6895E] shrink-0 mt-0.5" />
            <span>모든 시술은 개인에 따라 일시적인 붉은기, 멍, 부기, 미세 통증, 색소침착 등의 반응이 나타날 수 있으므로 시술 전 담당 의료진과의 충분한 진료 및 상담을 거친 후 진행됩니다.</span>
          </p>
          <div className="pt-3 flex flex-wrap gap-4 items-center justify-between text-xs text-zinc-500 border-t border-[#E5E5E8]">
            <span>문의 및 예약: 041-352-3994</span>
            <div className="flex gap-3">
              <button onClick={onNavigatePrices} className="text-[#0F2B22] font-semibold hover:underline cursor-pointer">
                비급여 수가표 보기 →
              </button>
              <button onClick={() => onNavigateHome()} className="text-[#0F2B22] font-semibold hover:underline cursor-pointer">
                메인 홈페이지로 돌아가기 →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#071510] text-zinc-400 text-xs py-10 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_SRC}
              alt="꽃을보듯너를 서울뷰의원 당진"
              className="h-8 w-auto object-contain brightness-0 invert opacity-80"
            />
            <span className="text-[11px] text-zinc-400">서울뷰의원당진 진료과목 피부과</span>
          </div>
          <p className="text-[11px] text-zinc-500 text-center sm:text-right">
            대표자 박상덕 · 사업자등록번호 109-26-65111<br />
            충청남도 당진시 시청2로 49-30, 7층 · 대표전화 041-352-3994<br />
            © 2026 SEOUL VIEW CLINIC DANGJIN. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* 모바일 메뉴 · 하단 메뉴바 */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigateHome={onNavigateHome}
        onNavigateEvent={onNavigateEvent}
        onNavigatePrices={onNavigatePrices}
        onNavigateColumn={onNavigateColumn}
      />
      <MobileBottomBar onNavigateHome={onNavigateHome} onNavigateEvent={onNavigateEvent} />
    </div>
  );
}
