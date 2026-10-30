import { useState, useEffect } from 'react';
import EventBoard from './EventBoard.tsx';
import { MobileDrawer } from './MobileNav.tsx';
import SiteHeader from './SiteHeader.tsx';
import { NAVER_BOOKING_URL, KAKAO_CHAT_URL, openNaverBooking, LOGO_SRC } from './clinicLinks.ts';
import { EVENTS } from './data/pricingData.ts';
import {
  Calendar,
  CalendarCheck,
  Search,
  ShieldCheck,
  Check,
  MessageCircle,
  Home,
  ChevronUp,
  PhoneCall,
  ChevronRight,
  Info
} from 'lucide-react';

interface EventPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateToPrices?: () => void;
  onNavigateToColumn?: () => void;
}

export default function EventPage({ onNavigateHome, onNavigateToPrices, onNavigateToColumn }: EventPageProps) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  // 이벤트별 버튼: 'all'이면 전체, 아니면 해당 이벤트 이름
  const [eventFilter, setEventFilter] = useState<string>('all');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // 상세 비급여 수가표는 전용 페이지로 이동
  const scrollToPrice = () => {
    if (onNavigateToPrices) onNavigateToPrices();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#111111] font-sans selection:bg-[#A6895E] selection:text-white">
      {/* ================= MAIN HEADER & NAVIGATION (모든 페이지 공용) ================= */}
      <SiteHeader
        onLogo={() => onNavigateHome()}
        onSection={(id) => onNavigateHome(id)}
        onEvent={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onPrices={scrollToPrice}
        onColumn={() => (onNavigateToColumn ? onNavigateToColumn() : onNavigateHome('sec-column'))}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {/* ================= MOBILE DRAWER (모든 페이지 공용 메뉴) ================= */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigateHome={onNavigateHome}
        onNavigateEvent={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigatePrices={scrollToPrice}
        onNavigateColumn={() => (onNavigateToColumn ? onNavigateToColumn() : onNavigateHome('sec-column'))}
      />

      {/* ================= RIGHT FLOATING QUICK BAR ================= */}
      <aside className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col bg-white border border-[#E5E5E8] rounded-xl shadow-md overflow-hidden divide-y divide-[#E5E5E8] w-20 text-center">
        <button
          onClick={openNaverBooking}
          className="py-3.5 px-2 bg-[#0F2B22] text-white hover:bg-[#173F32] transition flex flex-col items-center justify-center group cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-[#C5A880] mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-bold">진료예약</span>
        </button>
        <button
          onClick={() => window.open(KAKAO_CHAT_URL, '_blank', 'noopener,noreferrer')}
          className="py-3.5 px-2 hover:bg-[#FEE500]/20 transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#3C1E1E] fill-[#FEE500] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">카톡상담</span>
        </button>
        <button
          onClick={scrollToPrice}
          className="py-3.5 px-2 hover:bg-[#F7F7F8] transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <Search className="w-5 h-5 text-[#A6895E] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">수가검색</span>
        </button>
        <button
          onClick={() => onNavigateHome()}
          className="py-3.5 px-2 hover:bg-[#F7F7F8] transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <Home className="w-5 h-5 text-zinc-600 mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">홈으로</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="py-2.5 bg-[#F7F7F8] text-zinc-500 hover:text-[#111111] text-[10px] font-en-cond tracking-widest flex flex-col items-center cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          TOP
        </button>
      </aside>

      {/* ================= SUBPAGE HERO BANNER ================= */}
      <section className="bg-gradient-to-r from-[#0F2B22] via-[#12362a] to-[#1a231f] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A6895E_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              서울뷰의원 당진점<br />
              <span className="text-[#C5A880]">진행 중인 이벤트</span>
            </h1>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
              <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#C5A880]" /> 1인 프라이빗 관리실
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#C5A880]" /> 의료법 규정 부가세(VAT) 별도 고지
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENT LIST (가격표 엑셀 "이벤트 가격표" 시트) ================= */}
      <section id="event-showcase" className="py-12 md:py-16 bg-[#F7F7F8] border-b border-[#E5E5E8]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 lg:pr-24 2xl:pr-0">
            <div>
              <h2 className="text-2xl font-bold text-[#111111]">서울뷰의원 당진점 이벤트 {EVENTS.length}종</h2>
            </div>
            <p className="text-xs text-zinc-500">※ 이벤트가는 부가세(VAT) 별도입니다.</p>
          </div>

          {/* 이벤트별 버튼 (시술안내 페이지처럼 위에 모아 두고, 누르면 해당 이벤트만 표시) */}
          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:gap-2 mb-8 lg:pr-24 2xl:pr-0">
            {[{ key: 'all', label: '전체 보기' }, ...EVENTS.map((ev) => ({ key: ev.name, label: ev.short ?? ev.name }))].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setEventFilter(tab.key)}
                aria-current={eventFilter === tab.key}
                className={`px-1 sm:px-4 py-2.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                  eventFilter === tab.key
                    ? 'font-bold bg-[#0F2B22] text-white border border-[#0F2B22]'
                    : 'font-medium bg-white border border-[#E5E5E8] text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <EventBoard key={eventFilter} events={eventFilter === 'all' ? EVENTS : EVENTS.filter((ev) => ev.name === eventFilter)} />
        </div>
      </section>

      {/* ================= MAIN PRICE SECTION (8대 카테고리 & 검색) ================= */}
      <main id="price-container" className="py-12 md:py-16 max-w-7xl mx-auto px-4 lg:px-8">
        {/* Dedicated Price Page Entrance Card */}
        <div className="mb-10 p-6 sm:p-8 bg-gradient-to-r from-[#0F2B22] to-[#173F32] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#A6895E]/50">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#A6895E]/30 text-[#C5A880] text-xs font-bold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>의료법 제45조 준수 비급여 공식 수가표</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              서울뷰의원 당진점 상세 비급여 수가표
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
              전체 시술의 1회 및 다회/패키지 상세 비급여 수가를 전용 페이지에서 분류별로 확인하고 바로 예약하실 수 있습니다.
            </p>
          </div>
          {onNavigateToPrices && (
            <button
              onClick={() => onNavigateToPrices()}
              className="shrink-0 bg-[#C5A880] hover:bg-[#A6895E] text-[#111111] font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>상세 비급여 수가표 새 페이지로 보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Notice Callout */}
        <div className="mt-8 bg-[#F4EFEB]/70 border border-[#A6895E]/30 rounded-xl p-5 text-xs text-zinc-600 space-y-2">
          <p className="font-bold text-[#111111] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#A6895E]" />
            비급여 진료비용 고지 및 의료법 안내사항
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-500 leading-relaxed">
            <li>의료법 제45조 및 동법 시행규칙 제42조의2 규정에 의하여 비급여 진료비용을 고지합니다.</li>
            <li>모든 비급여 시술 금액에는 <strong>부가가치세 10%가 별도</strong>로 부과됩니다.</li>
            <li>환자 개개인의 피부 두께, 색소 깊이, 흉터 양상 및 근막 처짐 상태에 따라 최적의 권장 샷수 및 복합 패키지가 달라질 수 있습니다.</li>
            <li>시술 후 일시적인 붉은기, 멍, 부기, 색소침착 등의 부작용이 발생할 수 있으므로 의사와의 사전 1:1 상담 후 진행됩니다.</li>
          </ul>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0F2B22] text-zinc-400 py-14 border-t border-white/10 text-xs pb-24 lg:pb-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={LOGO_SRC}
                  alt="꽃을보듯너를 서울뷰의원 당진"
                  className="h-11 w-auto object-contain filter drop-shadow-sm"
                />
              </div>
              <p className="mt-2 text-zinc-400 leading-relaxed">
                상호명: 서울뷰의원 당진점 | 대표자: 박상덕 | 사업자등록번호: 109-26-65111<br />
                주소: 충청남도 당진시 시청2로 49-30, 7층 | 대표전화: 041-352-3994
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-start text-zinc-300">
              <button
                onClick={() => onNavigateHome()}
                className="hover:text-[#C5A880] cursor-pointer"
              >
                홈페이지 메인
              </button>
              <span>|</span>
              <button
                onClick={scrollToPrice}
                className="hover:text-[#C5A880] underline underline-offset-4 cursor-pointer"
              >
                상세 비급여 수가표
              </button>
              <span>|</span>
              <button
                onClick={() => onNavigateHome('sec-location')}
                className="hover:text-[#C5A880] cursor-pointer"
              >
                오시는 길 & 주차
              </button>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
            <p>© 2026 SEOUL VIEW CLINIC DANGJIN. ALL RIGHTS RESERVED.</p>
            <p>본 사이트의 모든 비급여 수가 정보는 의료법을 준수합니다.</p>
          </div>
        </div>
      </footer>

      {/* ================= MOBILE FIXED BOTTOM BAR ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E8] grid grid-cols-4 text-[11px] font-semibold shadow-lg">
        <a
          href={NAVER_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 bg-[#0F2B22] text-white flex flex-col items-center justify-center cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4 text-[#C5A880] mb-0.5" />
          <span>실시간예약</span>
        </a>
        <a
          href="tel:041-352-3994"
          className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-[#A6895E] mb-0.5" />
          <span>전화걸기</span>
        </a>
        <button
          onClick={scrollToPrice}
          className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#0F2B22] mb-0.5" />
          <span>수가검색</span>
        </button>
        <button
          onClick={() => onNavigateHome()}
          className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
        >
          <Home className="w-4 h-4 text-zinc-600 mb-0.5" />
          <span>홈으로</span>
        </button>
      </div>

    </div>
  );
}
