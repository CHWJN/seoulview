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

            {/* 같은 시술(이름이 같은 연속 항목)은 한 칸으로 묶고, 그 안에 회차별 가격을 줄로 나열 */}
            <ul className="divide-y divide-[#E5E5E8] flex-1">
              {groupItems(ev.items).map((group, gIdx) => (
                <li key={gIdx} className="px-5 sm:px-6 py-4">
                  <p className="text-sm font-semibold text-[#111111] leading-snug">{group[0].name}</p>
                  {group.length === 1 && group[0].note && (
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{group[0].note}</p>
                  )}
                  <div className="mt-2 space-y-1.5">
                    {group.map((item, idx) => {
                      const rate = discountRate(item);
                      return (
                        <div key={idx}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[15px] font-semibold text-[#5A544C] min-w-0">{item.option}</span>
                          <div className="shrink-0 flex items-center gap-2">
                            {item.orig && (
                              <span className="text-[11px] text-zinc-400 line-through">{formatWon(item.orig)}</span>
                            )}
                            {rate !== null && <span className="text-[11px] font-bold text-[#C0392B]">{rate}%</span>}
                            <span className="font-en-cond text-lg font-bold text-[#0F2B22]">{formatWon(item.price)}</span>
                          </div>
                        </div>
                        {group.length > 1 && item.note && (
                          <p className="text-[11px] text-zinc-400 leading-relaxed">{item.note}</p>
                        )}
                        </div>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-5 sm:p-6 pt-4 space-y-2">
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
