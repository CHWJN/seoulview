import {
  X,
  ChevronRight,
  CalendarCheck,
  MessageCircle,
  Sparkles,
  MapPin
} from 'lucide-react';
import { NAVER_BOOKING_URL, KAKAO_CHAT_URL, LOGO_SRC, openNaverBooking } from './clinicLinks.ts';


interface MobileNavProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateEvent: () => void;
  onNavigatePrices: () => void;
  onNavigateColumn: () => void;
}

// 모바일 햄버거 메뉴 (수가표·칼럼 페이지 공용)
export function MobileDrawer({
  open,
  onClose,
  onNavigateHome,
  onNavigateEvent,
  onNavigatePrices,
  onNavigateColumn
}: MobileNavProps & { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const go = (fn: () => void) => () => {
    onClose();
    fn();
  };

  const items: { label: string; onClick: () => void }[] = [
    { label: '01. 서울뷰의원 소개', onClick: go(() => onNavigateHome('sec-about')) },
    { label: '02. 이벤트', onClick: go(onNavigateEvent) },
    { label: '03. 상세 비급여 수가표', onClick: go(onNavigatePrices) },
    { label: '04. 시술 전후사진', onClick: go(() => onNavigateHome('sec-ba')) },
    { label: '05. 시술안내 및 주의사항', onClick: go(() => onNavigateHome('sec-guide')) },
    { label: '06. 원장 칼럼', onClick: go(onNavigateColumn) },
    { label: '07. 오시는 길 & 진료시간', onClick: go(() => onNavigateHome('sec-location')) }
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />
      <div className="relative ml-auto w-80 max-w-[85vw] bg-white shadow-lg flex flex-col justify-between overflow-y-auto z-10">
        <div>
          <div className="p-5 bg-[#0F2B22] text-white flex items-center justify-between">
            <div>
              <img src={LOGO_SRC} alt="서울뷰의원 당진" className="h-9 w-auto object-contain mb-1 filter drop-shadow-sm" />
              <p className="text-xs text-zinc-300">서울뷰의원 당진점 모바일 메뉴</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1 cursor-pointer" aria-label="메뉴 닫기">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 text-sm divide-y divide-[#E5E5E8]">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full text-left py-3 flex items-center justify-between cursor-pointer font-medium text-zinc-700"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-[#F7F7F8] border-t border-[#E5E5E8]">
          <button
            onClick={go(openNaverBooking)}
            className="w-full bg-[#0F2B22] text-white py-3 rounded font-semibold text-xs tracking-wider cursor-pointer"
          >
            빠른 진료 예약 신청
          </button>
        </div>
      </div>
    </div>
  );
}

// 모바일 하단 고정 메뉴바 (홈 화면과 같은 구성)
export function MobileBottomBar({ onNavigateHome, onNavigateEvent }: Pick<MobileNavProps, 'onNavigateHome' | 'onNavigateEvent'>) {
  return (
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
        href={KAKAO_CHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 text-amber-500 mb-0.5" />
        <span>카톡상담</span>
      </a>
      <button
        onClick={onNavigateEvent}
        className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-[#C5A880] mb-0.5" />
        <span>이벤트</span>
      </button>
      <button
        onClick={() => onNavigateHome('sec-location')}
        className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
      >
        <MapPin className="w-4 h-4 text-[#0F2B22] mb-0.5" />
        <span>오시는길</span>
      </button>
    </div>
  );
}
