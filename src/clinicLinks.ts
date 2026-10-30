// 병원 외부 링크 (네이버 플레이스: 예약·지도)
// 모바일·태블릿 하단바 "실시간예약" → 네이버 예약 화면 바로 열기
export const NAVER_BOOKING_URL = "https://m.booking.naver.com/booking/13/bizes/1205195";
export const NAVER_MAP_URL = "https://map.naver.com/p/entry/place/1185025590";

// 메인 오시는 길 지도 (병원 좌표: 네이버 플레이스 기준)
export const CLINIC_LAT = 36.8880041;
export const CLINIC_LNG = 126.6471655;
export const GOOGLE_MAP_EMBED_URL = `https://maps.google.com/maps?q=${CLINIC_LAT},${CLINIC_LNG}&z=17&hl=ko&output=embed`;
