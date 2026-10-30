import { CalendarCheck, ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LOGO_SRC, openNaverBooking } from './clinicLinks.ts';
import { GUIDE_DATA } from './data/guideData.ts';
import { BA_CATEGORIES } from './data/baData.ts';

// 홈 화면 섹션 안의 탭 (서울뷰의원 소개)
export type HomeTab = { tab: 'about'; id: string };

interface SiteHeaderProps {
  onLogo: () => void;
  onSection: (sectionId: string, sub?: HomeTab) => void;
  onEvent: () => void;
  onPrices: () => void;
  onColumn: () => void;
  onOpenMenu: () => void;
}

const ABOUT_ITEMS = [
  ['서울뷰의원 당진', 'brand'],
  ['대표원장 소개', 'doctor'],
  ['장비 소개', 'devices'],
  ['시설 소개', 'facility']
] as const;



const TOP_CLASS = 'text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer';
const DROPDOWN_CLASS = 'nav-dropdown absolute left-0 top-full bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50';
const ITEM_CLASS = 'w-full text-left px-4 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer';
const PAGE_ITEM_CLASS = 'w-full text-left px-4 py-2.5 text-xs hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between';

// 모든 페이지 공용 상단 메뉴 (PC는 드롭다운 메뉴, 1280px 미만은 햄버거 버튼)
export default function SiteHeader({ onLogo, onSection, onEvent, onPrices, onColumn, onOpenMenu }: SiteHeaderProps) {
  const navigate = useNavigate();
  // 시술안내 및 주의사항은 별도 페이지 (/guide, /guide/<id>)
  // 시술 전후사진은 별도 페이지 (/before-after, /before-after/<분류>)
  const goBa = (id?: string) => {
    navigate(id ? `/before-after/${id}` : '/before-after');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goGuide = (id?: string) => {
    navigate(id ? `/guide/${id}` : '/guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const subMenu = (
    sectionId: string,
    tab: HomeTab['tab'],
    items: readonly (readonly [string, string])[],
    itemPadding: string
  ) =>
    items.map(([label, id]) => (
      <button key={id} onClick={() => onSection(sectionId, { tab, id })} className={`${ITEM_CLASS} ${itemPadding}`}>
        {label}
      </button>
    ));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button onClick={onLogo} className="flex items-center gap-3 group shrink-0 cursor-pointer">
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
            <button onClick={() => onSection('sec-about')} className={TOP_CLASS}>
              서울뷰의원 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <div className={`${DROPDOWN_CLASS} w-48`}>
              {subMenu('sec-about', 'about', ABOUT_ITEMS, 'py-2.5')}
            </div>
          </div>

          {/* 2. 이벤트 */}
          <div className="relative nav-item py-6 px-3.5 cursor-pointer">
            <button onClick={onEvent} className={TOP_CLASS}>
              이벤트 <span className="w-1.5 h-1.5 rounded-full bg-red-500 mb-2"></span>
            </button>
            <div className={`${DROPDOWN_CLASS} w-56`}>
              <button onClick={onEvent} className={`${PAGE_ITEM_CLASS} font-semibold text-[#0F2B22]`}>
                <span>10월 이벤트</span>
                <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
              </button>
              <button onClick={onPrices} className={`${PAGE_ITEM_CLASS} font-medium text-zinc-700 hover:text-[#0F2B22]`}>
                <span>상세 비급여 수가표</span>
                <span className="text-[10px] bg-[#C5A880]/30 text-[#85734F] px-1.5 py-0.5 rounded font-bold">PAGE</span>
              </button>
            </div>
          </div>

          {/* 4. 시술 전후사진 */}
          <div className="relative nav-item py-6 px-3.5 cursor-pointer">
            <button onClick={() => goBa()} className={TOP_CLASS}>
              시술 전후사진 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <div className={`${DROPDOWN_CLASS} w-60`}>
              {BA_CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => goBa(c.id)} className={`${ITEM_CLASS} py-2.5`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. 시술안내 및 주의사항 */}
          <div className="relative nav-item py-6 px-3.5 cursor-pointer">
            <button onClick={() => goGuide()} className={TOP_CLASS}>
              시술안내 및 주의사항 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <div className={`${DROPDOWN_CLASS} w-64`}>
              {GUIDE_DATA.map((g) => (
                <button key={g.id} onClick={() => goGuide(g.id)} className={`${ITEM_CLASS} py-2`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. 원장 칼럼 */}
          <div className="relative nav-item py-6 px-3.5 cursor-pointer">
            <button onClick={onColumn} className={TOP_CLASS}>
              원장 칼럼 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <div className={`${DROPDOWN_CLASS} w-56`}>
              <button onClick={onColumn} className={`${PAGE_ITEM_CLASS} font-semibold text-[#0F2B22]`}>
                <span>원장칼럼 전문 페이지</span>
                <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
              </button>
              <button onClick={() => onSection('sec-column')} className={`${ITEM_CLASS} py-2.5`}>
                메인 요약 칼럼 바로가기
              </button>
            </div>
          </div>

          {/* 7. 오시는 길 */}
          <div className="py-6 px-3.5">
            <button onClick={() => onSection('sec-location')} className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition cursor-pointer">
              오시는 길
            </button>
          </div>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={openNaverBooking}
            className="hidden sm:inline-flex items-center gap-2 bg-[#0F2B22] hover:bg-[#173F32] text-white text-xs font-semibold px-4 py-2.5 rounded transition shadow-sm cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>실시간 예약</span>
          </button>
          {/* Mobile Hamburger Button */}
          <button
            onClick={onOpenMenu}
            className="xl:hidden p-2 rounded border border-[#E5E5E8] text-[#111111] hover:bg-[#F7F7F8] cursor-pointer"
            aria-label="메뉴 열기"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
