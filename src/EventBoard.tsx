import { openNaverBooking } from './clinicLinks.ts';
import { EVENTS, EventGroup, EventItem, formatWon, discountRate } from './data/pricingData.ts';

// 이름이 같은 연속 항목(예: 1회·3회)을 한 묶음으로
const groupItems = (items: EventItem[]) =>
  items.reduce<EventItem[][]>((acc, item) => {
    const last = acc[acc.length - 1];
    if (last && last[0].name === item.name) last.push(item);
    else acc.push([item]);
    return acc;
  }, []);

interface EventBoardProps {
  events?: EventGroup[];
}

// 이벤트 카드 목록 (이벤트 페이지)
export default function EventBoard({ events = EVENTS }: EventBoardProps) {
  return (
    // lg:pr-24 — 오른쪽 고정 퀵메뉴에 가격이 가려지지 않도록 (화면이 넓은 2xl부터는 여백 불필요)
    <div className="grid gap-6 lg:pr-24 2xl:pr-0 lg:grid-cols-2">
      {events.map((ev) => {
        // 일부 이벤트만 보여 줄 때도 번호는 전체 목록 기준으로 유지
        const evIdx = EVENTS.indexOf(ev);
        return (
          // 사용자가 고른 시안 B: 딥그린 헤더 + 회차별 크림색 줄 + 빨간 할인율 배지 + 금색 예약 버튼
          <div
            key={ev.name}
            className="bg-white rounded-2xl overflow-hidden border border-[#E7E2D8] shadow-[0_10px_30px_-12px_rgba(15,43,34,0.25)] flex flex-col"
          >
            <div className="relative bg-gradient-to-br from-[#0F2B22] to-[#173F32] px-5 sm:px-6 pt-6 pb-5">
              <span className="font-en-cond text-xs tracking-[0.25em] text-[#C5A880] font-semibold">
                EVENT {String(evIdx + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-bold text-white leading-snug mt-1.5 break-keep">{ev.name}</h3>
              {ev.note && (
                <span className="inline-block mt-2.5 text-xs font-semibold text-[#0F2B22] bg-[#D9C29A] rounded-full px-2.5 py-0.5">
                  {ev.note}
                </span>
              )}
              <span className="absolute left-5 right-5 sm:left-6 sm:right-6 bottom-0 h-0.5 bg-gradient-to-r from-[#C5A880] to-transparent" />
            </div>

            {/* 같은 시술(이름이 같은 연속 항목)은 한 칸으로 묶고, 그 안에 회차별 가격을 줄로 나열 */}
            <ul className="divide-y divide-[#EFEAE1] flex-1 px-5 sm:px-6 pt-1">
              {groupItems(ev.items).map((group, gIdx) => (
                <li key={gIdx} className="py-4">
                  <p className="text-base font-bold text-[#111111] leading-snug break-keep">{group[0].name}</p>
                  {group.length === 1 && group[0].note && (
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed break-keep">{group[0].note}</p>
                  )}
                  <div className="mt-2.5 space-y-2">
                    {group.map((item, idx) => {
                      const rate = discountRate(item);
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between gap-3 bg-[#FAF8F5] rounded-lg px-3.5 py-2.5">
                            <span className="text-[15px] font-bold text-[#0F2B22] min-w-0 break-keep">{item.option}</span>
                            <div className="shrink-0 flex items-center gap-2">
                              {item.orig && (
                                <span className="text-xs text-zinc-400 line-through">{formatWon(item.orig)}</span>
                              )}
                              {rate !== null && (
                                <span className="text-[11.5px] font-extrabold text-white bg-[#B5523F] rounded-md px-1.5 py-0.5">{rate}%</span>
                              )}
                              <span className="text-lg sm:text-[19px] font-extrabold text-[#0F2B22]">{formatWon(item.price)}</span>
                            </div>
                          </div>
                          {group.length > 1 && item.note && (
                            <p className="text-xs text-zinc-500 mt-1 px-1 leading-relaxed break-keep">{item.note}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-5 sm:px-6 pb-6 pt-2">
              <button
                onClick={openNaverBooking}
                className="w-full bg-[#C5A880] hover:bg-[#B89A70] text-[#0F2B22] font-extrabold py-3.5 rounded-lg text-sm transition cursor-pointer"
              >
                이 이벤트로 예약 · 상담 신청
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
