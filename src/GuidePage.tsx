import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GUIDE_DATA } from './data/guideData.ts';
import { MobileDrawer, MobileBottomBar } from './MobileNav.tsx';
import SiteHeader from './SiteHeader.tsx';
import { openNaverBooking, LOGO_SRC } from './clinicLinks.ts';
import { ShieldCheck, Info } from 'lucide-react';

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
      <section className="bg-gradient-to-r from-[#0E2920] via-[#12362a] to-[#1a231f] text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#9E8A63_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#9E8A63]/50 bg-[#9E8A63]/15 px-3.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BFA980]" />
              <span className="font-mono text-xs tracking-widest text-[#BFA980] uppercase">
                PROCEDURE GUIDE & PRECAUTIONS
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              서울뷰의원 당진점<br />
              <span className="text-[#BFA980]">시술안내 및 주의사항</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
              안전하고 만족스러운 결과를 위해 시술 전·후 꼭 확인하셔야 할 안내사항입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-10 sm:py-16">
        {/* 시술별 탭 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GUIDE_DATA.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => selectTab(g.id)}
              aria-current={guide.id === g.id}
              className={`px-4 py-2.5 rounded-lg text-xs transition cursor-pointer ${
                guide.id === g.id
                  ? 'font-bold bg-[#0F2B22] text-white'
                  : 'font-medium bg-white border border-[#E5E5E8] text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {String(idx + 1).padStart(2, '0')}. {g.label}
            </button>
          ))}
        </div>

        {/* 선택한 시술 안내 */}
        <div key={guide.id} className="bg-[#FAF8F5] border border-[#C5A880]/40 rounded-2xl p-6 sm:p-10 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C5A880]/30 pb-6 mb-6 gap-4">
            <div>
              <span className="text-xs font-bold text-[#0F2B22]">{guide.subtitle}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mt-1">{guide.title}</h2>
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
