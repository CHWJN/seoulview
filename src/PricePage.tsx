import React, { useState, useMemo, useEffect } from 'react';
import { PRICE_CATEGORIES, formatWon } from './data/pricingData.ts';
import {
  Calendar,
  CalendarCheck,
  Search,
  X,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronDown,
  Info,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  Menu,
  CheckCircle2,
  FileSpreadsheet,
  SlidersHorizontal,
  Home
} from 'lucide-react';

interface PricePageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateEvent: () => void;
  onNavigateColumn?: () => void;
  onOpenBooking?: (itemName: string) => void;
}

// 가격 구분 중 옵션 옆에 함께 보여줄 제품 구분
const PRODUCT_TYPES = ['국산', '코어톡스'];

export default function PricePage({ onNavigateHome, onNavigateEvent, onNavigateColumn, onOpenBooking }: PricePageProps) {
  const LOGO_SRC = "/assets/aistudio/____________c4c3a0ad.png";

  const [activeCategory, setActiveCategory] = useState<string>(PRICE_CATEGORIES[0].name);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedItemName, setSelectedItemName] = useState<string>('비급여 수가 진료 상담');
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
    }, 3500);
  };

  const handleBooking = (itemName: string) => {
    if (onOpenBooking) {
      onOpenBooking(itemName);
    } else {
      setSelectedItemName(itemName);
      setBookingModalOpen(true);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingModalOpen(false);
    showToast(`[예약 접수 완료] ${bookingForm.name || '고객'}님, '${selectedItemName}' 예약 신청이 접수되었습니다.`);
    setBookingForm({
      name: '',
      phone: '',
      date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      time: '오후 (14:00 ~ 18:00)'
    });
  };

  const totalRows = PRICE_CATEGORIES.reduce(
    (sum, c) => sum + c.groups.reduce((n, g) => n + g.rows.length, 0),
    0
  );

  // 검색어가 있으면 전체 분류에서, 없으면 선택한 분류에서 시술 묶음을 고른다
  const visibleGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const all = PRICE_CATEGORIES.flatMap((c) => c.groups.map((g) => ({ ...g, cat: c.name })));
    if (q) {
      return all.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.cat.toLowerCase().includes(q) ||
          g.notes.some((n) => n.toLowerCase().includes(q)) ||
          g.rows.some((r) => r.option.toLowerCase().includes(q))
      );
    }
    return all.filter((g) => g.cat === activeCategory);
  }, [activeCategory, searchQuery]);

  const visibleRowCount = visibleGroups.reduce((n, g) => n + g.rows.length, 0);

  const optionLabel = (option: string, type: string) => {
    if (!PRODUCT_TYPES.includes(type)) return option || '-';
    return option ? `${option} · ${type}` : type;
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#111111] selection:bg-[#0F2B22] selection:text-white flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2B22] text-white px-5 py-3.5 rounded-lg shadow-lg border border-[#C5A880]/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

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
                onClick={onNavigateEvent}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                이벤트 <span className="w-1.5 h-1.5 rounded-full bg-red-500 mb-2"></span>
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={onNavigateEvent}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0F2B22] hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between"
                >
                  <span>10월 이벤트</span>
                  <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                onClick={() => onNavigateColumn ? onNavigateColumn() : onNavigateHome('sec-column')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                원장 칼럼 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateColumn ? onNavigateColumn() : onNavigateHome('sec-column')}
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
              onClick={() => handleBooking('실시간 맞춤 예약')}
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
              <span className="text-[#BFA980]">상세 비급여 수가표</span>
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-10 sm:py-16">
        {/* Search & Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#111111] flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#A6895E]" />
              <span>전체 {PRICE_CATEGORIES.length}개 분류 · {totalRows}개 비급여 수가 안내</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              원하시는 시술명을 검색창에 입력하시면 전체 분류에서 바로 찾아 드립니다.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="시술명 검색 (예: 보톡스, 리쥬란, 제모)"
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-[#E5E5E8] rounded-lg bg-white focus:outline-none focus:border-[#0F2B22] shadow-xs"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {PRICE_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setActiveCategory(cat.name);
                setSearchQuery('');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs transition text-center cursor-pointer ${
                activeCategory === cat.name && !searchQuery
                  ? 'font-bold bg-[#0F2B22] text-white shadow-md'
                  : 'font-medium bg-white text-zinc-700 border border-[#E5E5E8] hover:border-[#0F2B22]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Current Category Banner */}
        <div className="bg-[#FAF8F5] border-l-4 border-[#C5A880] p-4 rounded-r-xl border border-[#E5E5E8] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <h3 className="font-bold text-[#0F2B22] text-sm sm:text-base">
              {searchQuery ? `검색 결과: "${searchQuery}"` : activeCategory}
            </h3>
            <p className="text-xs text-zinc-600 mt-0.5">
              {searchQuery
                ? '전체 비급여 항목 중 일치하는 결과를 표시합니다.'
                : '단위: 원 · 시술 금액에는 부가세(VAT 10%)가 별도로 부과됩니다.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs">
            <span className="text-zinc-500">항목수:</span>
            <strong className="bg-[#0F2B22] text-[#C5A880] px-2.5 py-0.5 rounded font-mono font-bold">
              {visibleRowCount}개
            </strong>
          </div>
        </div>

        {/* Price List (모바일: 카드형) */}
        <div className="md:hidden space-y-3 mb-10">
          {visibleGroups.length === 0 ? (
            <p className="bg-white border border-[#E5E5E8] rounded-xl py-12 px-4 text-center text-zinc-400 text-xs">
              검색하신 시술 정보가 등록되어 있지 않습니다. 다른 검색어로 검색하시거나 원내로 문의해 주세요.
            </p>
          ) : (
            visibleGroups.map((group) => (
              <div key={`${group.cat}-${group.name}`} className="bg-white border border-[#E5E5E8] rounded-xl p-4 shadow-xs">
                {searchQuery && (
                  <span className="block text-[10px] font-bold text-[#A6895E] mb-0.5">{group.cat}</span>
                )}
                <h4 className="font-semibold text-[#0F2B22] text-sm">{group.name}</h4>
                {group.notes.map((note) => (
                  <p key={note} className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{note}</p>
                ))}
                <ul className="mt-3 divide-y divide-[#F0F0F2] border-t border-[#F0F0F2]">
                  {group.rows.map((row, idx) => (
                    <li key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <span className="text-zinc-700">{optionLabel(row.option, row.type)}</span>
                      <span className="shrink-0 whitespace-nowrap">
                        {row.type === '특별가' && (
                          <span className="bg-[#C5A880]/20 text-[#85734F] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#C5A880]/40 mr-1.5">
                            특별가
                          </span>
                        )}
                        <span className="font-bold text-[#111111] text-sm">{formatWon(row.price)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBooking(group.name)}
                  className="mt-3 w-full border border-[#0F2B22] text-[#0F2B22] text-xs font-semibold py-2 rounded cursor-pointer"
                >
                  예약신청
                </button>
              </div>
            ))
          )}
        </div>

        {/* Price Table (md 이상) */}
        <div className="hidden md:block bg-white border border-[#E5E5E8] rounded-xl overflow-hidden shadow-xs mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-[#0F2B22] text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-5 font-semibold">시술명</th>
                  <th className="py-4 px-5 font-semibold whitespace-nowrap">옵션 (횟수 / 용량 / 부위)</th>
                  <th className="py-4 px-5 font-semibold text-right whitespace-nowrap">가격</th>
                  <th className="py-4 px-5 font-semibold text-center w-28 whitespace-nowrap">예약 신청</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {visibleGroups.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-14 text-center text-zinc-400 text-xs">
                      검색하신 시술 정보가 등록되어 있지 않습니다. 다른 검색어로 검색하시거나 원내로 문의해 주세요.
                    </td>
                  </tr>
                ) : (
                  visibleGroups.map((group) =>
                    group.rows.map((row, idx) => (
                      <tr
                        key={`${group.cat}-${group.name}-${idx}`}
                        className={`hover:bg-[#FAF8F5] transition ${idx === 0 ? 'border-t border-[#E5E5E8]' : ''}`}
                      >
                        {idx === 0 && (
                          <td rowSpan={group.rows.length} className="py-4 px-5 align-top bg-white">
                            {searchQuery && (
                              <span className="block text-[10px] font-bold text-[#A6895E] mb-0.5">{group.cat}</span>
                            )}
                            <span className="font-semibold text-[#0F2B22] block">{group.name}</span>
                            {group.notes.map((note) => (
                              <span key={note} className="block text-[11px] text-zinc-500 mt-1 leading-relaxed">
                                {note}
                              </span>
                            ))}
                          </td>
                        )}
                        <td className="py-3 px-5 text-zinc-700 border-t border-[#F0F0F2]">
                          {optionLabel(row.option, row.type)}
                        </td>
                        <td className="py-3 px-5 text-right whitespace-nowrap border-t border-[#F0F0F2]">
                          {row.type === '특별가' && (
                            <span className="bg-[#C5A880]/20 text-[#85734F] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#C5A880]/40 mr-1.5">
                              특별가
                            </span>
                          )}
                          <span className="font-bold text-[#111111]">{formatWon(row.price)}</span>
                        </td>
                        {idx === 0 && (
                          <td rowSpan={group.rows.length} className="py-4 px-5 text-center align-top whitespace-nowrap bg-white">
                            <button
                              onClick={() => handleBooking(group.name)}
                              className="border border-[#0F2B22] text-[#0F2B22] hover:bg-[#0F2B22] hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded transition cursor-pointer whitespace-nowrap"
                            >
                              예약신청
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Notices Box */}
        <div className="bg-white border border-[#E5E5E8] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-[#E5E5E8] pb-3">
            <Info className="w-5 h-5 text-[#A6895E]" />
            <h4 className="font-bold text-sm sm:text-base text-[#111111]">
              비급여 진료비용 고지 및 의료법 관련 안내사항
            </h4>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-600 leading-relaxed">
            <li>본 비급여 수가표는 의료법 제45조 및 동법 시행규칙 제42조의2에 근거하여 작성 및 고지되었습니다.</li>
            <li>기재된 피부 미용 시술 금액에는 <strong>부가가치세(VAT 10%)가 별도</strong>로 부과됩니다. (위고비·마운자로는 부가세 포함가)</li>
            <li>개인별 피부 상태, 색소의 침착 깊이, 흉터의 형태 및 범위, 근막 처짐 상태에 따라 권장 시술 샷수 및 복합 패키지 구성이 달라질 수 있습니다.</li>
            <li>모든 시술은 개인에 따라 일시적인 붉은기, 멍, 부기, 미세 통증, 색소침착 등의 반응이 나타날 수 있으므로 시술 전 담당 의료진과의 충분한 진료 및 상담을 거친 후 진행됩니다.</li>
          </ul>
          <div className="pt-2 flex flex-wrap gap-4 items-center justify-between text-xs text-zinc-500 border-t border-[#E5E5E8]">
            <span>문의 및 예약: 041-356-8275</span>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigateEvent()}
                className="text-[#0F2B22] font-semibold hover:underline cursor-pointer"
              >
                이달의 이벤트 보러가기 →
              </button>
              <button
                onClick={() => onNavigateHome()}
                className="text-[#0F2B22] font-semibold hover:underline cursor-pointer"
              >
                메인 홈페이지로 돌아가기 →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-lg border border-[#E5E5E8] relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="font-en-cond text-xs tracking-wider text-[#A6895E] font-bold uppercase">
                FAST RESERVATION
              </span>
              <h3 className="text-xl font-bold text-[#111111] mt-0.5">비급여 시술 상담 예약</h3>
              <p className="text-xs text-zinc-500 mt-1">
                신청하신 항목에 맞춰 전담 상담 실장이 확인 후 신속하게 연락드립니다.
              </p>
            </div>

            <div className="mb-4 p-3 bg-[#FAF8F5] border border-[#C5A880]/30 rounded-lg">
              <span className="text-[11px] text-zinc-500 block">선택하신 시술 항목</span>
              <strong className="text-xs sm:text-sm text-[#0F2B22] font-semibold block mt-0.5">
                {selectedItemName}
              </strong>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium mb-1">성함 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium mb-1">연락처 *</label>
                <input
                  type="tel"
                  required
                  placeholder="예: 010-1234-5678"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">희망 예약일</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">희망 시간대</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22] bg-white"
                  >
                    <option value="오전 (10:00 ~ 12:00)">오전 (10:00 ~ 12:00)</option>
                    <option value="오후 (14:00 ~ 18:00)">오후 (14:00 ~ 18:00)</option>
                    <option value="야간진료 (18:00 ~ 20:00)">야간진료 (18:00 ~ 20:00)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0F2B22] hover:bg-[#173F32] text-white py-3 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
                >
                  상담 예약 신청 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#071510] text-zinc-400 text-xs py-10 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_SRC}
              alt="꽃을보듯너를 서울뷰의원 당진"
              className="h-8 w-auto object-contain brightness-0 invert opacity-80"
            />
            <span className="text-[11px] text-zinc-400">당진 서울뷰의원 비급여 수가 공시 센터</span>
          </div>
          <p className="text-[11px] text-zinc-500 text-center sm:text-right">
            충청남도 당진시 시청1로 서울뷰타워 4층 · 대표전화 041-356-8275<br />
            © 2026 SEOUL VIEW CLINIC DANGJIN. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
