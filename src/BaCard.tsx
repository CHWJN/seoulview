import type { BaItem } from './data/baData.ts';

interface BaCardProps {
  item: BaItem;
  category?: string; // 카드 위에 보여 줄 분류 이름 (홈 화면처럼 여러 분류가 섞일 때)
  unlocked: boolean;
  onUnlock: () => void;
  className?: string;
}

// 시술 전후사진 카드 1장 (홈 화면과 전후사진 페이지 공용)
export default function BaCard({ item, category, unlocked, onUnlock, className = '' }: BaCardProps) {
  return (
    <div className={`bg-white border border-[#E5E5E8] shadow-xs rounded-2xl p-4 sm:p-6 flex flex-col justify-between ${className}`}>
      <div>
        {category && <p className="text-[11px] sm:text-xs font-bold text-[#A6895E] mb-1.5">{category}</p>}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-base sm:text-xl font-bold text-[#111111] break-keep">{item.title}</h3>
          <span className="shrink-0 whitespace-nowrap mt-0.5 text-[11px] bg-[#C5A880]/15 text-[#85734F] px-2.5 py-0.5 rounded">
            {item.period}
          </span>
        </div>

        {/* 사진 칸: 세로가 조금 긴 4:5 비율로 크게 (실제 사진이 오면 이 칸을 사진으로 채운다) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 relative">
          {/* BEFORE */}
          <div className="relative aspect-[4/5] bg-gradient-to-b from-zinc-100 to-zinc-200 border border-[#E5E5E8] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center">
            <span className="absolute top-3 left-3 text-[10px] sm:text-[11px] font-en-cond tracking-widest bg-white/90 text-zinc-700 px-2 py-0.5 rounded">
              BEFORE
            </span>
            <p className="text-xs sm:text-sm font-semibold text-zinc-700 break-keep">{item.beforeMetric}</p>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">마크뷰 정밀 촬영 원본</p>
          </div>

          {/* AFTER */}
          <div className="relative aspect-[4/5] bg-[#FAF8F5] border border-[#C5A880]/50 rounded-xl overflow-hidden text-center">
            <span className="absolute z-10 top-3 left-3 text-[10px] sm:text-[11px] font-en-cond tracking-widest bg-[#C5A880] text-[#111111] font-bold px-2 py-0.5 rounded">
              AFTER
            </span>
            <div
              className={`h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0F2B22]/10 to-[#FAF8F5] p-4 ${
                unlocked ? 'ba-unlocked' : 'ba-locked'
              }`}
            >
              <p className="text-xs sm:text-sm font-bold text-[#0F2B22] break-keep">{item.afterMetric}</p>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">무보정 동일 조건 촬영</p>
            </div>
            {!unlocked && (
              <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center p-3">
                <button
                  onClick={onUnlock}
                  className="whitespace-nowrap bg-[#C5A880] text-[#111111] font-bold text-[11px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded shadow cursor-pointer"
                >
                  클릭하여 After 확인
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}

// 의료법 열람 동의 토글 (홈 화면과 전후사진 페이지 공용)
export function BaConsentToggle({ unlocked, onToggle }: { unlocked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#C5A880]/40 px-4 py-2.5 rounded-lg shadow-xs">
      <div className="text-xs">
        <span className="text-[#A6895E] font-bold">
          {unlocked ? '열람 동의 완료 (전후사진 잠금 해제됨)' : '의료법 준수 블러 적용 중'}
        </span>
        <p className="text-[11px] text-zinc-600">
          {unlocked ? '동일 조건 무보정 임상 케이스입니다.' : '동의를 누르시면 모든 전후사진이 선명하게 표시됩니다.'}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`font-bold text-xs px-3.5 py-2 rounded shrink-0 transition cursor-pointer ${
          unlocked ? 'bg-zinc-200 text-zinc-800' : 'bg-[#C5A880] text-[#111111]'
        }`}
      >
        {unlocked ? '블러 다시 켜기' : '열람 동의 (잠금해제)'}
      </button>
    </div>
  );
}

export const BA_LEGAL_NOTICE =
  '※ 의료법 고지사항: 모든 시술은 개인의 피부 상태에 따라 붉은기, 부기, 멍, 색소침착, 염증 등의 부작용이 발생할 수 있으므로 시술 전 의료진과의 충분한 상담이 필요합니다.';
