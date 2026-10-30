import { ChevronRight } from 'lucide-react';
import { openNaverBooking } from './clinicLinks.ts';
import { EVENTS, EventGroup, formatWon, discountRate } from './data/pricingData.ts';

interface EventBoardProps {
  // 홈 화면용 요약 모드: 이벤트마다 일부 항목만 보여주고 나머지는 이벤트 페이지로 안내
  previewCount?: number;
  onMore?: () => void;
  events?: EventGroup[];
}

export default function EventBoard({ previewCount, onMore, events = EVENTS }: EventBoardProps) {
  return (
    // lg:pr-24 — 오른쪽 고정 퀵메뉴에 가격이 가려지지 않도록 (화면이 넓은 2xl부터는 여백 불필요)
    <div className={`grid gap-6 lg:pr-24 2xl:pr-0 ${previewCount ? 'sm:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
      {events.map((ev, evIdx) => {
        const items = previewCount ? ev.items.slice(0, previewCount) : ev.items;
        const hidden = ev.items.length - items.length;
        return (
          <div
            key={ev.name}
            className="bg-white rounded-xl border border-[#E5E5E8] hover:border-[#C5A880] transition shadow-xs flex flex-col"
          >
            <div className="p-5 sm:p-6 border-b border-[#E5E5E8]">
              <span className="font-en-cond text-[11px] tracking-[0.2em] text-[#A6895E] font-bold">
                EVENT {String(evIdx + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-bold text-[#111111] leading-snug mt-1">{ev.name}</h3>
              {ev.note && <p className="text-xs text-[#A6895E] font-semibold mt-1">{ev.note}</p>}
            </div>

            <ul className="divide-y divide-[#E5E5E8] flex-1">
              {items.map((item, idx) => {
                const rate = discountRate(item);
                return (
                  <li key={idx} className="px-5 sm:px-6 py-3.5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111111] leading-snug">{item.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.option}</p>
                      {item.note && !previewCount && (
                        <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{item.note}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {item.orig && (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[11px] text-zinc-400 line-through">{formatWon(item.orig)}</span>
                          {rate !== null && (
                            <span className="text-[11px] font-bold text-[#C0392B]">{rate}%</span>
                          )}
                        </div>
                      )}
                      <span className="font-en-cond text-lg font-bold text-[#0F2B22]">{formatWon(item.price)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="p-5 sm:p-6 pt-4 space-y-2">
              {hidden > 0 && onMore && (
                <button
                  onClick={onMore}
                  className="w-full text-xs font-semibold text-[#A6895E] hover:text-[#0F2B22] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>항목 {hidden}개 더보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={openNaverBooking}
                className="w-full bg-[#111111] hover:bg-[#0F2B22] text-white font-semibold py-2.5 rounded text-xs transition cursor-pointer"
              >
                이 이벤트로 예약/상담 신청
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
