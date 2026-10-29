import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  CalendarCheck,
  Search,
  X,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronDown,
  Info,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  Menu,
  CheckCircle2,
  FileSpreadsheet,
  SlidersHorizontal,
  Home
} from 'lucide-react';

interface PricePageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateEvent: () => void;
  onNavigateColumn?: () => void;
  onOpenBooking?: (itemName: string) => void;
}

interface PriceItem {
  cat: string;
  group: string;
  name: string;
  once: string;
  multi: string;
  badge?: string;
}

export default function PricePage({ onNavigateHome, onNavigateEvent, onNavigateColumn, onOpenBooking }: PricePageProps) {
  const LOGO_SRC = "/assets/aistudio/____________c4c3a0ad.png";

  const [activeCategory, setActiveCategory] = useState<string>('pigment');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedItemName, setSelectedItemName] = useState<string>('비급여 수가 진료 상담');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: '오후 (14:00 ~ 18:00)'
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleBooking = (itemName: string) => {
    if (onOpenBooking) {
      onOpenBooking(itemName);
    } else {
      setSelectedItemName(itemName);
      setBookingModalOpen(true);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingModalOpen(false);
    showToast(`[예약 접수 완료] ${bookingForm.name || '고객'}님, '${selectedItemName}' 예약 신청이 접수되었습니다.`);
    setBookingForm({
      name: '',
      phone: '',
      date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      time: '오후 (14:00 ~ 18:00)'
    });
  };

  const CATEGORY_TABS = [
    { id: 'pigment', label: '기미/모공/문신제거', desc: '피코슈어 755nm, 레블라이트SI, 포텐자 마이크로니들 복합 색소 치료' },
    { id: 'lifting', label: '안티에이징 리프팅', desc: '2.45GHz 극초단파 엑셀웨이브, 울쎄라, 인모드(FX+FORMA), 슈링크 유니버스' },
    { id: 'hair-w', label: '여성 제모', desc: '미국 칸델라 젠틀맥스 프로 플러스 755/1064nm 듀얼 파장 · 1인 여성 전용실' },
    { id: 'hair-m', label: '남성 제모', desc: '26mm 대구경 스팟과 DCD 냉각 시스템으로 굵은 수염 모근까지 통증 최소화' },
    { id: 'booster', label: '프리미엄 스킨부스터', desc: '리쥬란 힐러, 쥬베룩 스킨/볼륨, ASCE+ 줄기세포 엑소좀 정품 정량 시술' },
    { id: 'filler', label: '프리미엄 필러', desc: '독일 벨로테로, 스웨덴 레스틸렌, 국산 아띠에르 1:1 맞춤 커스텀 디자인' },
    { id: 'botox', label: '보톡스 / 윤곽주사', desc: '독일 제오민 순수톡신, 국산 정품 보톡스, 식약처 승인 브이올렛 이중턱 주사' },
    { id: 'skincare', label: '메디컬 스킨케어', desc: '독일 정품 LDM 물방울 리프팅, 아쿠아필 3단계, 라라필, 크라이오 진정 재생' }
  ];

  const PRICE_DATA: PriceItem[] = [
    // 1. 기미 / 모공 / 문신제거 (pigment)
    { cat: "pigment", group: "피코슈어 (755nm)", name: "피코슈어 토닝 + 진정관리 1회", once: "90,000원", multi: "5회 390,000원 / 10회 690,000원", badge: "BEST" },
    { cat: "pigment", group: "피코슈어 (755nm)", name: "피코슈어 프락셀 (포커스 모공/흉터) + 크라이오", once: "150,000원", multi: "3회 390,000원 / 5회 590,000원", badge: "추천" },
    { cat: "pigment", group: "레블라이트 SI", name: "레블라이트 SI PTP 듀얼토닝 + 비타민관리", once: "80,000원", multi: "10회 590,000원" },
    { cat: "pigment", group: "흑자 / 잡티 제거", name: "피코슈어 흑자 / 검버섯 원데이 집중 제거 (개당/크기별)", once: "30,000원~", multi: "얼굴 전체 패키지 290,000원~", badge: "원데이" },
    { cat: "pigment", group: "포텐자 (Potenza)", name: "포텐자 마이크로니들 (모공/흉터/홍조) 1회 (팁 포함)", once: "180,000원", multi: "3회 450,000원" },
    { cat: "pigment", group: "포텐자 (Potenza)", name: "포텐자 펌핑팁 + 쥬베룩 스킨 2cc 침투", once: "290,000원", multi: "3회 790,000원", badge: "인기" },
    { cat: "pigment", group: "문신제거", name: "피코슈어 눈썹 반영구 문신제거 1회", once: "80,000원", multi: "3회 190,000원" },
    { cat: "pigment", group: "문신제거", name: "피코슈어 레터링 / 컬러 타투 제거 (명함 1/2 크기 기준)", once: "100,000원", multi: "5회 390,000원" },

    // 2. 리프팅 (lifting)
    { cat: "lifting", group: "엑셀웨이브 (Excelwave)", name: "2.45GHz 극초단파 리프팅 엑셀웨이브 풀페이스 (8만줄)", once: "450,000원", multi: "3회 1,190,000원", badge: "NEW" },
    { cat: "lifting", group: "엑셀웨이브 (Excelwave)", name: "엑셀웨이브 이중턱 + 심부볼 집중 컨투어링 (4만줄)", once: "290,000원", multi: "3회 750,000원", badge: "무마취" },
    { cat: "lifting", group: "울쎄라 (Ultherapy)", name: "울쎄라 오리지널 리프팅 100샷 (정품인증서 발급)", once: "290,000원", multi: "300샷 750,000원", badge: "정품팁" },
    { cat: "lifting", group: "울쎄라 (Ultherapy)", name: "울쎄라 오리지널 리프팅 400샷 + LDM 진정 재생", once: "950,000원", multi: "600샷 1,350,000원", badge: "BEST" },
    { cat: "lifting", group: "인모드 (InMode)", name: "인모드 FX (지방감소) 1부위 (이중턱 또는 심부볼)", once: "69,000원", multi: "3회 180,000원" },
    { cat: "lifting", group: "인모드 (InMode)", name: "인모드 FX + FORMA 풀페이스 2단계 올인원", once: "129,000원", multi: "3회 330,000원", badge: "특가" },
    { cat: "lifting", group: "슈링크 유니버스", name: "슈링크 유니버스 300샷 (울트라F + 부스터 펜타입)", once: "119,000원", multi: "600샷 210,000원" },
    { cat: "lifting", group: "올리지오 (Oligio)", name: "올리지오 RF 고주파 타이트닝 300샷", once: "420,000원", multi: "600샷 750,000원" },
    { cat: "lifting", group: "제네시스 리프팅", name: "롱펄스 제네시스 탄력 리프팅 1회", once: "99,000원", multi: "5회 390,000원" },

    // 3. 여성 제모 (hair-w)
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 겨드랑이 레이저 제모", once: "15,000원", multi: "5회 49,000원" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 인중 + 겨드랑이 세트", once: "25,000원", multi: "5회 59,000원", badge: "BEST" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 얼굴 전체 (이마+볼+구렛나루+인중+턱) 솜털제모", once: "60,000원", multi: "5회 220,000원" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 팔 하완 (팔꿈치 아래 + 손등 + 손가락)", once: "50,000원", multi: "5회 169,000원" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 종아리 + 무릎 전체", once: "60,000원", multi: "5회 199,000원", badge: "인기" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 브라질리언 올누드/디자인 (1인 프라이빗룸)", once: "90,000원", multi: "5회 350,000원", badge: "프라이빗" },

    // 4. 남성 제모 (hair-m)
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 인중 + 턱수염 (마취크림 + 진정팩 포함)", once: "60,000원", multi: "5회 240,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 수염 전체 (인중+턱+턱밑+볼+구렛나루+목)", once: "99,000원", multi: "5회 390,000원 / 10회 690,000원", badge: "남성 1위" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 눈썹 위/미간/광대 라인 정리", once: "30,000원", multi: "5회 110,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 겨드랑이 제모", once: "25,000원", multi: "5회 89,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 종아리 + 무릎 제모", once: "90,000원", multi: "5회 340,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 다리 전체 (허벅지 + 무릎 + 종아리 + 발등)", once: "170,000원", multi: "5회 650,000원" },

    // 5. 스킨부스터 (booster)
    { cat: "booster", group: "리쥬란 (Rejuran)", name: "리쥬란 힐러 2cc (정품 박스 개봉 확인)", once: "199,000원", multi: "3회 540,000원", badge: "BEST" },
    { cat: "booster", group: "리쥬란 (Rejuran)", name: "리쥬란 HB 플러스 (무통 리쥬란) 2cc", once: "259,000원", multi: "3회 720,000원", badge: "무통" },
    { cat: "booster", group: "리쥬란 (Rejuran)", name: "리쥬란 아이 (눈가 잔주름/다크서클) 1cc", once: "130,000원", multi: "3회 350,000원" },
    { cat: "booster", group: "쥬베룩 (Juvelook)", name: "쥬베룩 스킨 (모공·결·잔주름) 4cc", once: "220,000원", multi: "3회 590,000원", badge: "인기" },
    { cat: "booster", group: "쥬베룩 (Juvelook)", name: "쥬베룩 볼륨 (자가 콜라겐 볼륨) 1병(8cc 풀케어)", once: "450,000원", multi: "3회 1,250,000원", badge: "볼륨" },
    { cat: "booster", group: "엑소좀 / 줄기세포", name: "ASCE+ 줄기세포 엑소좀 5cc 풀페이스", once: "230,000원", multi: "3회 590,000원" },

    // 6. 필러 (filler)
    { cat: "filler", group: "국산 프리미엄 필러", name: "아띠에르 / 뉴라미스 필러 1cc (이마/관자/볼/팔자/턱끝)", once: "99,000원", multi: "3cc 270,000원", badge: "가성비" },
    { cat: "filler", group: "수입 하이엔드 필러", name: "독일 벨로테로 프리미엄 필러 1cc", once: "240,000원", multi: "2cc 440,000원", badge: "BEST" },
    { cat: "filler", group: "수입 하이엔드 필러", name: "스웨덴 레스틸렌 정품 필러 1cc", once: "250,000원", multi: "2cc 460,000원" },
    { cat: "filler", group: "특수 부위 디자인", name: "입술 디자인 필러 (입꼬리 보톡스 포함)", once: "150,000원", multi: "수입 벨로테로 270,000원", badge: "디자인" },
    { cat: "filler", group: "필러 용해", name: "히알루로니다제 필러 녹이는 주사 (부위당)", once: "80,000원", multi: "타원 시술 포함 정밀 용해" },

    // 7. 보톡스 / 윤곽주사 (botox)
    { cat: "botox", group: "주름 보톡스", name: "이마 / 미간 / 눈가 / 콧등 / 자갈턱 (국산 1부위)", once: "19,000원", multi: "3부위 패키지 49,000원", badge: "특가" },
    { cat: "botox", group: "사각턱 보톡스", name: "국산 정품 사각턱 보톡스 50U", once: "25,000원", multi: "코어톡스 49,000원 / 제오민 69,000원", badge: "BEST" },
    { cat: "botox", group: "독일 제오민", name: "독일 제오민 순수 보톡스 (내성 방지 톡신) 50U", once: "69,000원", multi: "3회 190,000원", badge: "내성Zero" },
    { cat: "botox", group: "스킨보톡스", name: "풀페이스 더모톡신 (모공·잔주름 타이트닝)", once: "79,000원", multi: "제오민 더모톡신 149,000원" },
    { cat: "botox", group: "바디보톡스", name: "승모근 / 종아리 / 겨드랑이 다한증 100U", once: "79,000원", multi: "200U 140,000원" },
    { cat: "botox", group: "윤곽주사", name: "브이올렛 (식약처 허가 이중턱 지방파괴 주사) 1병(2cc)", once: "230,000원", multi: "2병(4cc) 420,000원", badge: "반영구" },

    // 8. 메디컬 스킨케어 (skincare)
    { cat: "skincare", group: "프리미엄 초음파", name: "LDM 물방울 리프팅 (홍조/보습/재생/트러블 모드)", once: "60,000원", multi: "5회 250,000원", badge: "BEST" },
    { cat: "skincare", group: "모공 / 여드름", name: "아쿠아필 3단계 모공 딥클렌징 + 수분진정팩", once: "40,000원", multi: "5회 160,000원" },
    { cat: "skincare", group: "필링 / 광채", name: "라라필 (LHA 4세대 저자극 필링) + 진정관리", once: "80,000원", multi: "3회 210,000원" },
    { cat: "skincare", group: "미백 / 진정", name: "크라이오 냉각이온침투 / 비타민 이온자임 관리", once: "40,000원", multi: "10회 300,000원" }
  ];

  const filteredPrices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return PRICE_DATA.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q)
      );
    }
    return PRICE_DATA.filter((item) => item.cat === activeCategory);
  }, [PRICE_DATA, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#111111] selection:bg-[#0F2B22] selection:text-white flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2B22] text-white px-5 py-3.5 rounded-lg shadow-lg border border-[#C5A880]/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ================= MAIN HEADER & NAVIGATION (메인화면과 100% 동일) ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            onClick={() => onNavigateHome()}
            className="flex items-center gap-3 group shrink-0 cursor-pointer"
          >
            <img
              src={LOGO_SRC}
              alt="꽃을보듯너를 서울뷰의원 당진"
              className="h-10 sm:h-12 w-auto object-contain transition group-hover:opacity-95"
            />
          </button>

          {/* Desktop Navigation (7 Core Menus) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {/* 1. 서울뷰의원 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => onNavigateHome('sec-about')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                서울뷰의원 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-48 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateHome('sec-about')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  서울뷰의원 당진
                </button>
                <button
                  onClick={() => onNavigateHome('sec-about')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  장비 소개
                </button>
                <button
                  onClick={() => onNavigateHome('sec-about')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  시설 소개
                </button>
              </div>
            </div>

            {/* 2. 이벤트 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={onNavigateEvent}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                이벤트 <span className="w-1.5 h-1.5 rounded-full bg-red-500 mb-2"></span>
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={onNavigateEvent}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0F2B22] hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between"
                >
                  <span>10월 이벤트</span>
                  <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer flex items-center justify-between"
                >
                  <span>상세 비급여 수가표</span>
                  <span className="text-[10px] bg-[#C5A880]/30 text-[#85734F] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
              </div>
            </div>

            {/* 4. 시술 전후사진 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => onNavigateHome('sec-ba')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                시술 전후사진 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-60 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  쥬베룩 / 리프팅
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  기미 / 난치성색소
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  필러
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  여드름 / 모공, 흉터 / 홍조
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  레이저 제모
                </button>
                <button
                  onClick={() => onNavigateHome('sec-ba')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  문신제거
                </button>
              </div>
            </div>

            {/* 5. 시술안내 및 주의사항 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => onNavigateHome('sec-guide')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                시술안내 및 주의사항 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-64 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  레이저토닝 / 잡티제거
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  피코슈어 피코프락셀
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  리프팅
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  제모
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  스킨부스터
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  보톡스 / 윤곽주사
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  필러 / 실리프팅 / 쥬베룩 볼륨
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  점 / 사마귀 / 쥐젖제거
                </button>
                <button
                  onClick={() => onNavigateHome('sec-guide')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  다이어트
                </button>
              </div>
            </div>

            {/* 6. 원장 칼럼 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => onNavigateColumn ? onNavigateColumn() : onNavigateHome('sec-column')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                원장 칼럼 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateColumn ? onNavigateColumn() : onNavigateHome('sec-column')}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0F2B22] hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between"
                >
                  <span>원장칼럼 전문 페이지</span>
                  <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
                <button
                  onClick={() => onNavigateHome('sec-column')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  메인 요약 칼럼 바로가기
                </button>
              </div>
            </div>

            {/* 7. 오시는 길 */}
            <div className="py-6 px-3.5">
              <button
                onClick={() => onNavigateHome('sec-location')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition cursor-pointer"
              >
                오시는 길
              </button>
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleBooking('실시간 맞춤 예약')}
              className="hidden sm:inline-flex items-center gap-2 bg-[#0F2B22] hover:bg-[#173F32] text-white text-xs font-semibold px-4 py-2.5 rounded transition shadow-sm cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>실시간 예약</span>
            </button>
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 rounded border border-[#E5E5E8] text-[#111111] hover:bg-[#F7F7F8] cursor-pointer"
              aria-label="메뉴 열기"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= SUBPAGE HERO BANNER ================= */}
      <section className="bg-gradient-to-r from-[#0E2920] via-[#12362a] to-[#1a231f] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#9E8A63_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#9E8A63]/50 bg-[#9E8A63]/15 px-3.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BFA980]" />
              <span className="font-mono text-xs tracking-widest text-[#BFA980] uppercase">
                100% TRANSPARENT PRICING
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              서울뷰의원 당진점<br />
              <span className="text-[#BFA980]">상세 비급여 수가표</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
              정직한 의료 원칙으로 모든 시술 항목의 1회 및 패키지 수가를 100% 공개합니다. 상담실장의 불필요한 과잉 권유 없이, 대표원장이 직접 피부 상태를 진단하고 가장 적합한 시술을 제안해 드립니다.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
              <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#BFA980]" /> 정품·정량 인증서 발급
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#BFA980]" /> 1인 프라이빗 제모·관리실
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#BFA980]" /> 의료법 규정 부가세(VAT) 별도 고지
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-10 sm:py-16">
        {/* Search & Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#111111] flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#A6895E]" />
              <span>전체 8대 클리닉 비급여 수가 안내</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              원하시는 시술명이나 레이저 장비명을 검색창에 입력하시면 즉시 확인하실 수 있습니다.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="시술명 / 장비명 검색 (예: 엑셀웨이브, 피코, 울쎄라)"
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-[#E5E5E8] rounded-lg bg-white focus:outline-none focus:border-[#0F2B22] shadow-xs"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 8 Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id);
                setSearchQuery('');
              }}
              className={`py-3 px-2 rounded-xl text-xs transition text-center cursor-pointer ${
                activeCategory === tab.id && !searchQuery
                  ? 'font-bold bg-[#0F2B22] text-white shadow-md'
                  : 'font-medium bg-white text-zinc-700 border border-[#E5E5E8] hover:border-[#0F2B22]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Current Active Category Description Banner */}
        <div className="bg-[#FAF8F5] border-l-4 border-[#C5A880] p-4 rounded-r-xl border border-[#E5E5E8] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <h3 className="font-bold text-[#0F2B22] text-sm sm:text-base">
              {searchQuery
                ? `검색 결과: "${searchQuery}"`
                : CATEGORY_TABS.find((t) => t.id === activeCategory)?.label}
            </h3>
            <p className="text-xs text-zinc-600 mt-0.5">
              {searchQuery
                ? `전체 비급여 항목 중 일치하는 결과를 표시합니다.`
                : CATEGORY_TABS.find((t) => t.id === activeCategory)?.desc}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs">
            <span className="text-zinc-500">항목수:</span>
            <strong className="bg-[#0F2B22] text-[#C5A880] px-2.5 py-0.5 rounded font-mono font-bold">
              {filteredPrices.length}개
            </strong>
          </div>
        </div>

        {/* Price Table with whitespace-nowrap and horizontal scroll safety */}
        <div className="bg-white border border-[#E5E5E8] rounded-xl overflow-hidden shadow-xs mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#0F2B22] text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-5 font-semibold whitespace-nowrap">분류 / 장비</th>
                  <th className="py-4 px-5 font-semibold">시술 항목 및 상세 안내</th>
                  <th className="py-4 px-5 font-semibold text-right whitespace-nowrap">1회 기준 수가</th>
                  <th className="py-4 px-5 font-semibold text-right whitespace-nowrap">다회 / 패키지 수가</th>
                  <th className="py-4 px-5 font-semibold text-center w-28 whitespace-nowrap">예약 신청</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E8] text-xs sm:text-sm">
                {filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-14 text-center text-zinc-400 text-xs">
                      검색하신 시술 정보가 등록되어 있지 않습니다. 다른 검색어로 검색하시거나 원내로 문의해 주세요.
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F5] transition">
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-semibold text-[#0F2B22] block">{row.group}</span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-[#111111]">{row.name}</span>
                          {row.badge && (
                            <span className="bg-[#C5A880]/20 text-[#85734F] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#C5A880]/40 whitespace-nowrap">
                              {row.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right font-bold text-[#111111] whitespace-nowrap">
                        {row.once}
                      </td>
                      <td className="py-4 px-5 text-right font-semibold text-[#A6895E] whitespace-nowrap">
                        {row.multi}
                      </td>
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleBooking(`${row.name} (${row.once})`)}
                          className="border border-[#0F2B22] text-[#0F2B22] hover:bg-[#0F2B22] hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded transition cursor-pointer whitespace-nowrap"
                        >
                          예약신청
                        </button>
                      </td>
                    </tr>
                  ))
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
            <li>기재된 모든 비급여 시술 금액에는 <strong>부가가치세(VAT 10%)가 별도</strong>로 부과됩니다.</li>
            <li>개인별 피부 상태, 색소의 침착 깊이, 흉터의 형태 및 범위, 근막 처짐 상태에 따라 권장 시술 샷수 및 복합 패키지 구성이 달라질 수 있습니다.</li>
            <li>모든 시술은 개인에 따라 일시적인 붉은기, 멍, 부기, 미세 통증, 색소침착 등의 반응이 나타날 수 있으므로 시술 전 담당 의료진과의 충분한 진료 및 상담을 거친 후 진행됩니다.</li>
          </ul>
          <div className="pt-2 flex flex-wrap gap-4 items-center justify-between text-xs text-zinc-500 border-t border-[#E5E5E8]">
            <span>문의 및 예약: 041-356-8275</span>
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

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-lg border border-[#E5E5E8] relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="font-en-cond text-xs tracking-wider text-[#A6895E] font-bold uppercase">
                FAST RESERVATION
              </span>
              <h3 className="text-xl font-bold text-[#111111] mt-0.5">비급여 시술 상담 예약</h3>
              <p className="text-xs text-zinc-500 mt-1">
                신청하신 항목에 맞춰 전담 상담 실장이 확인 후 신속하게 연락드립니다.
              </p>
            </div>

            <div className="mb-4 p-3 bg-[#FAF8F5] border border-[#C5A880]/30 rounded-lg">
              <span className="text-[11px] text-zinc-500 block">선택하신 시술 항목</span>
              <strong className="text-xs sm:text-sm text-[#0F2B22] font-semibold block mt-0.5">
                {selectedItemName}
              </strong>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium mb-1">성함 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-medium mb-1">연락처 *</label>
                <input
                  type="tel"
                  required
                  placeholder="예: 010-1234-5678"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">희망 예약일</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">희망 시간대</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22] bg-white"
                  >
                    <option value="오전 (10:00 ~ 12:00)">오전 (10:00 ~ 12:00)</option>
                    <option value="오후 (14:00 ~ 18:00)">오후 (14:00 ~ 18:00)</option>
                    <option value="야간진료 (18:00 ~ 20:00)">야간진료 (18:00 ~ 20:00)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0F2B22] hover:bg-[#173F32] text-white py-3 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
                >
                  상담 예약 신청 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            충청남도 당진시 시청1로 서울뷰타워 4층 · 대표전화 041-356-8275<br />
            © 2026 SEOUL VIEW CLINIC DANGJIN. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
