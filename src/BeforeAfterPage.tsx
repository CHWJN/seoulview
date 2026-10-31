import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BA_CATEGORIES, BA_DATA, ALL_BA_ITEMS } from './data/baData.ts';
import BaCard, { BaConsentToggle, BA_LEGAL_NOTICE } from './BaCard.tsx';
import { MobileDrawer, MobileBottomBar } from './MobileNav.tsx';
import SiteHeader from './SiteHeader.tsx';
import { LOGO_SRC } from './clinicLinks.ts';

interface BeforeAfterPageProps {
  categoryId: string | null; // 주소 /before-after/<분류>의 분류 (없으면 전체)
  onNavigateHome: (sectionId?: string) => void;
  onNavigateEvent: () => void;
  onNavigatePrices: () => void;
  onNavigateColumn: () => void;
}

export default function BeforeAfterPage({ categoryId, onNavigateHome, onNavigateEvent, onNavigatePrices, onNavigateColumn }: BeforeAfterPageProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [unlocked, setUnlocked] = useState<boolean>(false);
  const category = BA_CATEGORIES.find((c) => c.id === categoryId) ?? null;
  const items = category ? BA_DATA[category.id].map((item) => ({ ...item, category: category.label })) : ALL_BA_ITEMS;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // 없는 분류 주소(/before-after/abc)는 /before-after로 정리
  useEffect(() => {
    if (categoryId && !category) navigate('/before-after', { replace: true });
  }, [categoryId]);

  // 탭을 바꾸면 주소도 /before-after/<분류>로 바뀐다
  const selectTab = (id: string | null) => navigate(id ? `/before-after/${id}` : '/before-after', { replace: true });

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
              <span className="text-[#C5A880]">시술 전후사진</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light break-keep">
              서울뷰의원 당진은 결과로 증명합니다. 보정 없는 동일 조명·동일 각도 임상 전후 기록입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 lg:pr-28 2xl:pr-8 py-10 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* 분류 탭: 모바일은 짧은 이름으로 3개씩 두 줄, PC는 한 줄 */}
          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
            {[{ id: null, label: '전체 보기', short: '전체 보기' }, ...BA_CATEGORIES].map((tab) => {
              const active = (category?.id ?? null) === tab.id;
              return (
                <button
                  key={tab.id ?? 'all'}
                  onClick={() => selectTab(tab.id)}
                  aria-current={active}
                  aria-label={tab.label}
                  className={`px-1 sm:px-4 py-2.5 rounded-lg text-xs whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'font-bold bg-[#0F2B22] text-white border border-[#0F2B22]'
                      : 'font-medium bg-white border border-[#E5E5E8] text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className="sm:hidden">{tab.short}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
          <BaConsentToggle unlocked={unlocked} onToggle={() => setUnlocked(!unlocked)} />
        </div>

        {/* 사례 카드: 모바일 1열, PC 2열 */}
        <div key={category?.id ?? 'all'} className="grid md:grid-cols-2 gap-5 md:gap-6 animate-in fade-in">
          {items.map((item) => (
            <BaCard
              key={item.title}
              item={item}
              category={category ? undefined : item.category}
              unlocked={unlocked}
              onUnlock={() => setUnlocked(true)}
            />
          ))}
        </div>

        <p className="text-[11px] text-zinc-500 mt-8 border-t border-[#E5E5E8] pt-4">{BA_LEGAL_NOTICE}</p>
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
