import { useState, useEffect } from 'react';
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from './data/privacyData.ts';
import { MobileDrawer, MobileBottomBar } from './MobileNav.tsx';
import SiteHeader from './SiteHeader.tsx';
import { LOGO_SRC } from './clinicLinks.ts';

interface PrivacyPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateEvent: () => void;
  onNavigatePrices: () => void;
  onNavigateColumn: () => void;
}

export default function PrivacyPage({ onNavigateHome, onNavigateEvent, onNavigatePrices, onNavigateColumn }: PrivacyPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // 한 줄을 모양에 맞게 표시: 빈 줄=간격, ▶=소제목, –=들여쓴 항목, 1)·①=번호 항목, 그 외=문단
  const renderLine = (line: string, idx: number) => {
    const t = line.trim();
    if (!t) return <div key={idx} className="h-3" />;
    if (t.startsWith('▶')) return <p key={idx} className="font-bold text-[#0F2B22] mt-2">{t}</p>;
    if (t.startsWith('–')) return <p key={idx} className="pl-4 sm:pl-6 text-zinc-600">{t}</p>;
    if (/^\d+\)/.test(t)) return <p key={idx} className="pl-3 sm:pl-4">{t}</p>;
    if (/^\d+\. /.test(t)) return <p key={idx} className="font-semibold text-[#111111] mt-1">{t}</p>;
    return <p key={idx}>{t}</p>;
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
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              서울뷰의원 당진점<br />
              <span className="text-[#C5A880]">개인정보 처리방침</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 lg:px-8 py-10 sm:py-16">
        <p className="text-sm sm:text-base text-zinc-700 leading-relaxed break-keep bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl p-5 sm:p-8">
          {PRIVACY_INTRO}
        </p>

        {/* 조항 바로가기 */}
        <nav aria-label="조항 바로가기" className="mt-6 flex flex-wrap gap-2">
          {PRIVACY_SECTIONS.map((sec, i) => (
            <a
              key={sec.title}
              href={`#privacy-${i + 1}`}
              className="text-xs px-3 py-2 rounded-lg bg-white border border-[#E5E5E8] text-zinc-700 hover:border-[#0F2B22] hover:text-[#0F2B22] transition"
            >
              {sec.title.replace(/\s*\(/, ' (').replace(/^(제\d+조)\s*/, '$1 ')}
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-5">
          {PRIVACY_SECTIONS.map((sec, i) => (
            <section
              key={sec.title}
              id={`privacy-${i + 1}`}
              className="scroll-mt-24 bg-white border border-[#E5E5E8] rounded-2xl p-5 sm:p-8 shadow-xs"
            >
              <h2 className="text-base sm:text-lg font-bold text-[#0F2B22] pb-3 mb-4 border-b border-[#C5A880]/30 break-keep">
                {sec.title}
              </h2>
              <div className="text-[13px] sm:text-sm text-zinc-700 leading-relaxed space-y-1.5 break-keep">
                {sec.lines.map(renderLine)}
              </div>
            </section>
          ))}
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
