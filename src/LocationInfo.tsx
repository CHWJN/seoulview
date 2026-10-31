import { ExternalLink } from 'lucide-react';
import { NAVER_MAP_URL, GOOGLE_MAP_EMBED_URL } from './clinicLinks.ts';

// 오시는 길 · 진료시간 안내 (홈의 '오시는 길 및 진료안내' 섹션과 /location 페이지 공용)
export default function LocationInfo() {
  return (
    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
      {/* Interactive Map Graphic */}
      <div className="lg:col-span-7 bg-[#F7F7F8] border border-[#E5E5E8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">서울뷰의원 당진점 위치 및 주차 안내</h3>
              <p className="text-xs text-zinc-500">충청남도 당진시 시청2로 49-30, 7층</p>
            </div>
            <span className="bg-[#0F2B22] text-white text-xs px-3 py-1 rounded font-medium">
              진료시간 무료주차
            </span>
          </div>

          {/* 구글 지도 (네이버 지도 API 키를 받으면 네이버 지도로 교체 예정) */}
          <div className="w-full h-64 sm:h-72 rounded-xl border border-[#E5E5E8] overflow-hidden bg-[#E9ECEA]">
            <iframe
              title="서울뷰의원 당진점 위치 지도"
              src={GOOGLE_MAP_EMBED_URL}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={NAVER_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-[#03C75A] hover:bg-[#02b350] text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition"
          >
            네이버 지도에서 위치·길찾기 보기
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-6 text-xs">
          <div className="bg-white p-4 rounded-lg border border-[#E5E5E8]">
            <p className="font-bold text-[#111111] mb-1">자가용 및 주차 안내</p>
            <p className="text-zinc-600">건물 지하 1~2층 주차장 또는 건물 바로 옆 옥외 주차장을 이용하실 수 있으며, 진료시간 동안 무료로 주차하실 수 있습니다.</p>
          </div>
        </div>
      </div>
      {/* Timetable & Info */}
      <div className="lg:col-span-5 bg-[#0F2B22] text-white rounded-2xl p-8 flex flex-col justify-center">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#C5A880]">대표번호</span>
            <a href="tel:041-352-3994" className="block font-en-cond text-3xl sm:text-4xl font-bold text-white mt-1 hover:text-[#C5A880] transition">041-352-3994</a>
            <p className="text-xs text-zinc-300 mt-1">충청남도 당진시 시청2로 49-30, 7층</p>
          </div>

          <div className="border-t border-white/15 pt-5 space-y-2.5 text-xs sm:text-sm">
            <h3 className="font-bold text-[#C5A880] mb-3">진료시간 안내</h3>
            <div className="flex justify-between">
              <span className="text-zinc-300">평 일</span>
              <span className="font-semibold">AM 10:00 ~ PM 08:00</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>평일 점심시간</span>
              <span>PM 01:00 ~ PM 02:00</span>
            </div>
            <div className="flex justify-between text-[#C5A880] font-bold">
              <span>주 말</span>
              <span>AM 10:00 ~ PM 08:00</span>
            </div>
            <p className="text-[11px] text-zinc-400 pt-1 text-right">주말은 점심시간 없이 진료합니다.</p>
            <p className="text-xs text-[#C5A880] font-semibold pt-2">※ 추석·설날 연휴를 제외하고 연중무휴로 진료합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
