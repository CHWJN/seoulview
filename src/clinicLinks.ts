// 병원 외부 링크 (네이버 플레이스: 예약·지도)
// 네이버 예약 화면 (모바일 하단바 "실시간예약", PC 예약 버튼 모두 여기로 연결)
export const NAVER_BOOKING_URL = "https://m.booking.naver.com/booking/13/bizes/1205195";
export const NAVER_MAP_URL = "https://map.naver.com/p/entry/place/1185025590";

// 메인 오시는 길 지도 (병원 좌표: 네이버 플레이스 기준)
export const CLINIC_LAT = 36.8880041;
export const CLINIC_LNG = 126.6471655;
export const GOOGLE_MAP_EMBED_URL = `https://maps.google.com/maps?q=${CLINIC_LAT},${CLINIC_LNG}&z=17&hl=ko&output=embed`;

// 카카오톡 채널 1:1 채팅
export const KAKAO_CHAT_URL = "https://pf.kakao.com/_gIJQG/chat";

// 홈페이지의 모든 "예약" 버튼 → 네이버 예약을 새 창으로 열기
export const openNaverBooking = () => {
  window.open(NAVER_BOOKING_URL, '_blank', 'noopener,noreferrer');
};

// 상단·모바일 메뉴 로고
export const LOGO_SRC = "/assets/aistudio/____________c4c3a0ad.png";
