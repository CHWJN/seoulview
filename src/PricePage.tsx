import { useState, useMemo, useEffect } from 'react';
import { PRICE_CATEGORIES, formatWon } from './data/pricingData.ts';
import { MobileDrawer, MobileBottomBar } from './MobileNav.tsx';
import SiteHeader from './SiteHeader.tsx';
import { openNaverBooking, LOGO_SRC } from './clinicLinks.ts';
import {
  Search,
  X,
  Info
} from 'lucide-react';

interface PricePageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateEvent: () => void;
  onNavigateColumn?: () => void;
}

// 가격 구분 중 옵션 옆에 함께 보여줄 제품 구분
const PRODUCT_TYPES = ['국산', '코어톡스'];

export default function PricePage({ onNavigateHome, onNavigateEvent, onNavigateColumn }: PricePageProps) {

  const [activeCategory, setActiveCategory] = useState<string>(PRICE_CATEGORIES[0].name);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

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


  const optionLabel = (option: string, type: string) => {
    if (!PRODUCT_TYPES.includes(type)) return option || '-';
    return option ? `${option} · ${type}` : type;
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#111111] selection:bg-[#0F2B22] selection:text-white flex flex-col justify-between pb-14 lg:pb-0">
      {/* ================= MAIN HEADER & NAVIGATION (모든 페이지 공용) ================= */}
      <SiteHeader
        onLogo={() => onNavigateHome()}
        onSection={(id) => onNavigateHome(id)}
        onEvent={onNavigateEvent}
        onPrices={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onColumn={() => (onNavigateColumn ? onNavigateColumn() : onNavigateHome('sec-column'))}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {/* ================= SUBPAGE HERO BANNER ================= */}
      <section className="bg-gradient-to-r from-[#0F2B22] via-[#12362a] to-[#1a231f] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A6895E_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              서울뷰의원 당진점<br />
              <span className="text-[#C5A880]">상세 비급여 수가표</span>
            </h1>
            {/* 상단 배너 설명 문장 (이벤트·시술안내 페이지 배너 설명과 같은 양식) */}
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light break-keep">
              서울뷰의원은 정직한 진료를 위해 모든 비급여 항목의 비용을 투명하게 공개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-10 sm:py-16">
        {/* 시술 검색 (예전 '전체 ○개 분류 · ○개 비급여 수가 안내' 문구 자리) */}
        <div className="relative w-full md:max-w-xl mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="시술명 검색 (예: 보톡스, 리쥬란, 제모)"
            aria-label="비급여 시술명 검색"
            className="w-full pl-12 pr-11 py-3.5 text-sm border border-[#E5E5E8] rounded-xl bg-white focus:outline-none focus:border-[#0F2B22] shadow-xs"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="검색어 지우기"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
                  onClick={openNaverBooking}
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
                              onClick={openNaverBooking}
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
            <span>문의 및 예약: 041-352-3994</span>
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
        onNavigatePrices={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateColumn={() => (onNavigateColumn ? onNavigateColumn() : onNavigateHome('sec-column'))}
      />
      <MobileBottomBar onNavigateHome={onNavigateHome} onNavigateEvent={onNavigateEvent} />
    </div>
  );
}
