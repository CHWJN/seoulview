import React, { useState, useEffect } from 'react';
import EventBoard from './EventBoard.tsx';
import { NAVER_BOOKING_URL } from './clinicLinks.ts';
import { EVENTS } from './data/pricingData.ts';
import {
  Calendar,
  CalendarCheck,
  Search,
  X,
  ShieldCheck,
  Check,
  Menu,
  MessageCircle,
  Home,
  ChevronUp,
  ChevronDown,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface EventPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateToPrices?: () => void;
  onNavigateToColumn?: () => void;
}

export default function EventPage({ onNavigateHome, onNavigateToPrices, onNavigateToColumn }: EventPageProps) {
  const LOGO_SRC = "/assets/aistudio/____________c4c3a0ad.png";

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedProcedure, setSelectedProcedure] = useState<string>('비급여 수가표 / 이달의 이벤트 상담');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: '오후 (14:00 ~ 18:00)'
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleOpenBooking = (procName?: string) => {
    setSelectedProcedure(procName || '비급여 시술 및 이벤트 맞춤 상담');
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingModalOpen(false);
    showToast(`[예약 접수 완료] ${bookingForm.name}님, '${selectedProcedure}' 상담 신청이 접수되었습니다.`);
  };

  // 상세 비급여 수가표는 전용 페이지로 이동
  const scrollToPrice = () => {
    if (onNavigateToPrices) onNavigateToPrices();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#151515] font-sans selection:bg-[#9E8A63] selection:text-white">
      {/* ================= MAIN HEADER & NAVIGATION (메인화면과 100% 동일) ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            onClick={() => onNavigateHome()}
            className="flex items-center gap-3 group shrink-0 cursor-pointer"
          >
            <img
              src={LOGO_SRC}
              alt="꽃을보듯너를 서울뷰의원 당진"
              className="h-10 sm:h-12 w-auto object-contain transition group-hover:opacity-95"
            />
          </button>

          {/* Desktop Navigation (7 Core Menus) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {/* 1. 서울뷰의원 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => onNavigateHome('sec-about')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                서울뷰의원 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-48 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateHome('sec-about')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  서울뷰의원 당진
                </button>
                <button
                  onClick={() => onNavigateHome('sec-about')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  장비 소개
                </button>
                <button
                  onClick={() => onNavigateHome('sec-about')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  시설 소개
                </button>
              </div>
            </div>

            {/* 2. 이벤트 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                이벤트 <span className="w-1.5 h-1.5 rounded-full bg-red-500 mb-2"></span>
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0F2B22] hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between"
                >
                  <span>10월 이벤트</span>
                  <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
                <button
                  onClick={() => onNavigateToPrices ? onNavigateToPrices() : scrollToPrice()}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer flex items-center justify-between"
                >
                  <span>상세 비급여 수가표</span>
                  <span className="text-[10px] bg-[#C5A880]/30 text-[#85734F] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
              </div>
            </div>

            {/* 4. 시술 전후사진 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => onNavigateHome('sec-ba')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                시술 전후사진 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-60 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  기미 / 난치성색소
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  필러
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  여드름 / 모공, 흉터 / 홍조
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  레이저 제모
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  문신제거
                </button>
              </div>
            </div>

            {/* 5. 시술안내 및 주의사항 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => onNavigateHome('sec-guide')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                시술안내 및 주의사항 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-64 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  레이저토닝 / 잡티제거
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  피코슈어 피코프락셀
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  리프팅
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  제모
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  스킨부스터
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  보톡스 / 윤곽주사
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  필러 / 실리프팅 / 쥬베룩 볼륨
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  점 / 사마귀 / 쥐젖제거
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  다이어트
                </button>
              </div>
            </div>

            {/* 6. 원장 칼럼 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => onNavigateToColumn ? onNavigateToColumn() : onNavigateHome('sec-column')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                원장 칼럼 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateToColumn ? onNavigateToColumn() : onNavigateHome('sec-column')}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0F2B22] hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between"
                >
                  <span>원장칼럼 전문 페이지</span>
                  <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
                <button
                  onClick={() => onNavigateHome('sec-column')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  메인 요약 칼럼 바로가기
                </button>
              </div>
            </div>

            {/* 7. 오시는 길 */}
            <div className="py-6 px-3.5">
              <button
                onClick={() => onNavigateHome('sec-location')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition cursor-pointer"
              >
                오시는 길
              </button>
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenBooking('실시간 맞춤 예약')}
              className="hidden sm:inline-flex items-center gap-2 bg-[#0F2B22] hover:bg-[#173F32] text-white text-xs font-semibold px-4 py-2.5 rounded transition shadow-sm cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>실시간 예약</span>
            </button>
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 rounded border border-[#E5E5E8] text-[#111111] hover:bg-[#F7F7F8] cursor-pointer"
              aria-label="메뉴 열기"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative ml-auto w-80 max-w-[85vw] bg-white shadow-lg flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="p-5 bg-[#0E2920] text-white flex items-center justify-between">
                <div>
                  <img
                    src={LOGO_SRC}
                    alt="서울뷰의원 당진"
                    className="h-9 w-auto object-contain mb-1 filter drop-shadow-sm"
                  />
                  <p className="text-xs text-zinc-300">서울뷰의원 당진점 이벤트/수가표</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 space-y-2 text-sm divide-y divide-[#E8E3DD]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateHome();
                  }}
                  className="w-full text-left py-2.5 font-bold text-[#0E2920] flex items-center justify-between"
                >
                  <span>00. 메인 홈페이지로 이동</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href="#event-showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 font-bold text-[#9E8A63]"
                >
                  01. 진행 중인 이벤트
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToPrice();
                  }}
                  className="w-full text-left py-2.5 font-bold text-[#151515]"
                >
                  02. 상세 비급여 수가표
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateHome('sec-ba');
                  }}
                  className="w-full text-left py-2.5 text-zinc-700"
                >
                  03. 시술 전후사진 아카이브
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateHome('sec-guide');
                  }}
                  className="w-full text-left py-2.5 text-zinc-700"
                >
                  04. 시술안내 및 주의사항
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateHome('sec-location');
                  }}
                  className="w-full text-left py-2.5 text-zinc-700"
                >
                  05. 오시는 길 & 진료시간
                </button>
              </div>
            </div>
            <div className="p-4 bg-[#F8F8F9] border-t border-[#E8E3DD]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenBooking('모바일 빠른 진료 예약');
                }}
                className="w-full bg-[#0E2920] text-white py-3 rounded font-semibold text-xs tracking-wider cursor-pointer"
              >
                빠른 진료 예약 / 카톡 상담
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RIGHT FLOATING QUICK BAR ================= */}
      <aside className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col bg-white border border-[#E8E3DD] rounded-xl shadow-md overflow-hidden divide-y divide-[#E8E3DD] w-20 text-center">
        <button
          onClick={() => handleOpenBooking('우측 퀵바 예약')}
          className="py-3.5 px-2 bg-[#0E2920] text-white hover:bg-[#184033] transition flex flex-col items-center justify-center group cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-[#BFA980] mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-bold">진료예약</span>
        </button>
        <button
          onClick={() => {
            handleOpenBooking('카카오톡 상담 문의');
            showToast("카카오톡 상담 신청 창으로 연결되었습니다.");
          }}
          className="py-3.5 px-2 hover:bg-[#FEE500]/20 transition flex flex-col items-center justify-center text-[#151515] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#3C1E1E] fill-[#FEE500] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">카톡상담</span>
        </button>
        <button
          onClick={scrollToPrice}
          className="py-3.5 px-2 hover:bg-[#F8F8F9] transition flex flex-col items-center justify-center text-[#151515] cursor-pointer"
        >
          <Search className="w-5 h-5 text-[#9E8A63] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">수가검색</span>
        </button>
        <button
          onClick={() => onNavigateHome()}
          className="py-3.5 px-2 hover:bg-[#F8F8F9] transition flex flex-col items-center justify-center text-[#151515] cursor-pointer"
        >
          <Home className="w-5 h-5 text-zinc-600 mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">홈으로</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="py-2.5 bg-[#F8F8F9] text-zinc-500 hover:text-[#151515] text-[10px] font-mono tracking-widest flex flex-col items-center cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          TOP
        </button>
      </aside>

      {/* ================= SUBPAGE HERO BANNER ================= */}
      <section className="bg-gradient-to-r from-[#0E2920] via-[#12362a] to-[#1a231f] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#9E8A63_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#9E8A63]/50 bg-[#9E8A63]/15 px-3.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BFA980]" />
              <span className="font-mono text-xs tracking-widest text-[#BFA980] uppercase">
                100% TRANSPARENT PRICING
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              서울뷰의원 당진점<br />
              <span className="text-[#BFA980]">진행 중인 이벤트</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
              정직한 의료 원칙으로 모든 시술 항목의 1회 및 패키지 수가를 100% 공개합니다. 상담실장의 불필요한 과잉 권유 없이, 대표원장이 직접 피부 상태를 진단하고 가장 적합한 시술을 제안해 드립니다.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
              <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#BFA980]" /> 정품·정량 인증서 발급
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#BFA980]" /> 1인 프라이빗 제모·관리실
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#BFA980]" /> 의료법 규정 부가세(VAT) 별도 고지
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENT LIST (가격표 엑셀 "이벤트 가격표" 시트) ================= */}
      <section id="event-showcase" className="py-12 md:py-16 bg-[#F7F7F8] border-b border-[#E8E3DD]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="font-mono text-xs tracking-widest text-[#9E8A63] font-bold uppercase">
                SPECIAL EVENT
              </span>
              <h2 className="text-2xl font-bold text-[#151515] mt-0.5">서울뷰의원 당진점 이벤트 {EVENTS.length}종</h2>
            </div>
            <p className="text-xs text-zinc-500">※ 이벤트가는 부가세(VAT) 별도입니다.</p>
          </div>

          <EventBoard onBook={(name) => handleOpenBooking(name)} />
        </div>
      </section>

      {/* ================= MAIN PRICE SECTION (8대 카테고리 & 검색) ================= */}
      <main id="price-container" className="py-12 md:py-16 max-w-7xl mx-auto px-4 lg:px-8">
        {/* Dedicated Price Page Entrance Card */}
        <div className="mb-10 p-6 sm:p-8 bg-gradient-to-r from-[#0E2920] to-[#184235] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#9E8A63]/50">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#9E8A63]/30 text-[#C5A880] text-xs font-bold px-3 py-1 rounded-full">
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
        <div className="mt-8 bg-[#F4EFEB]/70 border border-[#9E8A63]/30 rounded-xl p-5 text-xs text-zinc-600 space-y-2">
          <p className="font-bold text-[#151515] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#9E8A63]" />
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
      <footer className="bg-[#0E2920] text-zinc-400 py-14 border-t border-white/10 text-xs pb-24 md:pb-14">
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
                className="hover:text-[#BFA980] cursor-pointer"
              >
                홈페이지 메인
              </button>
              <span>|</span>
              <button
                onClick={scrollToPrice}
                className="hover:text-[#BFA980] underline underline-offset-4 cursor-pointer"
              >
                상세 비급여 수가표
              </button>
              <span>|</span>
              <button
                onClick={() => onNavigateHome('sec-location')}
                className="hover:text-[#BFA980] cursor-pointer"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E3DD] grid grid-cols-4 text-[11px] font-semibold shadow-lg">
        <a
          href={NAVER_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 bg-[#0E2920] text-white flex flex-col items-center justify-center cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4 text-[#BFA980] mb-0.5" />
          <span>실시간예약</span>
        </a>
        <a
          href="tel:041-352-3994"
          className="py-3 text-[#151515] flex flex-col items-center justify-center cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-[#9E8A63] mb-0.5" />
          <span>전화걸기</span>
        </a>
        <button
          onClick={scrollToPrice}
          className="py-3 text-[#151515] flex flex-col items-center justify-center cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#0E2920] mb-0.5" />
          <span>수가검색</span>
        </button>
        <button
          onClick={() => onNavigateHome()}
          className="py-3 text-[#151515] flex flex-col items-center justify-center cursor-pointer"
        >
          <Home className="w-4 h-4 text-zinc-600 mb-0.5" />
          <span>홈으로</span>
        </button>
      </div>

      {/* ================= BOOKING MODAL ================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-lg border border-[#9E8A63]/40 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-[#151515] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs tracking-widest text-[#9E8A63] font-bold uppercase">
              RESERVATION / INQUIRY
            </span>
            <h3 className="text-2xl font-bold text-[#151515] mt-1">서울뷰의원 당진점 예약 신청</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-6">
              원하시는 시술 또는 상담 항목을 남겨주시면 빠르게 안내해 드립니다.
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">성함 *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  placeholder="고객님의 성함을 입력해주세요"
                  className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#9E8A63]"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">연락처 *</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#9E8A63]"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">선택 시술 / 관심 프로그램</label>
                <input
                  type="text"
                  value={selectedProcedure}
                  onChange={(e) => setSelectedProcedure(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg bg-[#F4EFEB] font-semibold text-[#0E2920] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">희망 예약일 *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#9E8A63]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">희망 시간대</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg bg-white focus:outline-none focus:border-[#9E8A63]"
                  >
                    <option>오전 (10:00 ~ 13:00)</option>
                    <option>오후 (14:00 ~ 18:00)</option>
                    <option>저녁 (18:00 ~ 20:00)</option>
                    <option>주말 (10:00 ~ 20:00)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0E2920] hover:bg-[#184033] text-white font-bold py-3.5 rounded-lg text-sm transition mt-2 cursor-pointer"
              >
                예약 및 상담 신청 완료
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#0E2920] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#9E8A63] flex items-center gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#BFA980] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
