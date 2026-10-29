import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CalendarCheck,
  Search,
  X,
  ShieldCheck,
  Check,
  Menu,
  MessageCircle,
  Home,
  ChevronUp,
  ChevronDown,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface EventPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateToPrices?: () => void;
  onNavigateToColumn?: () => void;
}

interface PriceItem {
  cat: string;
  device: string;
  title: string;
  once: string;
  multi: string;
  badge?: string;
}

export default function EventPage({ onNavigateHome, onNavigateToPrices, onNavigateToColumn }: EventPageProps) {
  const LOGO_SRC = "/assets/aistudio/____________c4c3a0ad.png";

  const [currentSelectedCategory, setCurrentSelectedCategory] = useState<string>('pigment');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedProcedure, setSelectedProcedure] = useState<string>('비급여 수가표 / 이달의 이벤트 상담');
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

  const CATEGORY_META: Record<string, { title: string; desc: string }> = {
    pigment: {
      title: "01. 기미 / 모공 / 문신제거 클리닉",
      desc: "미국 사이노슈어 피코슈어(755nm), 레블라이트SI, 포텐자 마이크로니들 복합 색소 치료"
    },
    lifting: {
      title: "02. 안티에이징 리프팅 클리닉",
      desc: "2.45GHz 극초단파 엑셀웨이브, 독일 멀츠 울쎄라, 인모드(FX+FORMA), 슈링크 유니버스 정품 팁 인증 시술"
    },
    "hair-w": {
      title: "03. 여성 레이저 제모 (젠틀맥스 프로 플러스)",
      desc: "미국 칸델라사 최신 젠틀맥스 프로+ 755nm/1064nm 듀얼 파장 · 1인 여성 전용 프라이빗 룸"
    },
    "hair-m": {
      title: "04. 남성 레이저 제모 (젠틀맥스 프로 플러스)",
      desc: "굵고 깊은 남성 턱수염 및 바디 모낭 타깃 26mm 대구경 스팟 · DCD 급속 쿨링 가스 통증 최소화"
    },
    booster: {
      title: "05. 프리미엄 스킨부스터 클리닉",
      desc: "리쥬란 힐러 HB+, 쥬베룩 스킨/볼륨, 줄기세포 엑소좀(ASCE+) 정품 앰플 전량 환자 앞 개봉"
    },
    filler: {
      title: "06. 프리미엄 볼륨 필러 클리닉",
      desc: "독일 벨로테로, 스웨덴 레스틸렌, 국산 아띠에르 1:1 맞춤 자연스러운 페이스 윤곽 디자인"
    },
    botox: {
      title: "07. 보톡스 / 윤곽주사 클리닉",
      desc: "독일 제오민(순수톡신), 국산 정품 보톡스, 식약처 승인 브이올렛 이중턱 지방파괴 주사"
    },
    skincare: {
      title: "08. 메디컬 스킨케어 클리닉",
      desc: "독일 LDM 물방울 초음파, 3단계 아쿠아필, 라라필, 비타민 이온자임, 크라이오 진정 재생"
    }
  };

  const FULL_PRICE_DATA: PriceItem[] = [
    // 1. 기미 / 모공 / 문신제거
    { cat: "pigment", device: "피코슈어 (755nm)", title: "피코슈어 피코토닝 + 비타민 진정관리", once: "90,000원", multi: "5회 390,000원 / 10회 690,000원", badge: "BEST" },
    { cat: "pigment", device: "피코슈어 (755nm)", title: "피코슈어 프락셀 (포커스 렌즈 모공/흉터) + 크라이오", once: "150,000원", multi: "3회 390,000원 / 5회 590,000원", badge: "추천" },
    { cat: "pigment", device: "레블라이트 SI", title: "레블라이트 SI PTP 듀얼토닝 + 미백관리", once: "80,000원", multi: "10회 590,000원" },
    { cat: "pigment", device: "피코슈어 줌", title: "피코슈어 흑자 / 검버섯 원데이 집중 제거 (개당)", once: "30,000원~", multi: "얼굴 전체 패키지 290,000원~", badge: "원데이" },
    { cat: "pigment", device: "포텐자 (RF)", title: "포텐자 마이크로니들 (모공/흉터/홍조) 1회 (팁 포함)", once: "180,000원", multi: "3회 450,000원" },
    { cat: "pigment", device: "포텐자 + 부스터", title: "포텐자 펌핑팁 + 쥬베룩 스킨 2cc 침투", once: "290,000원", multi: "3회 790,000원", badge: "인기" },
    { cat: "pigment", device: "문신제거", title: "피코슈어 눈썹 반영구 잔흔 제거 (붉은/푸른색)", once: "80,000원", multi: "3회 190,000원" },
    { cat: "pigment", device: "문신제거", title: "피코슈어 컬러 타투 / 레터링 문신제거 (크기별)", once: "100,000원~", multi: "5회 390,000원~" },

    // 2. 리프팅
    { cat: "lifting", device: "엑셀웨이브 (Excelwave)", title: "2.45GHz 극초단파 리프팅 풀페이스 컨투어링", once: "450,000원", multi: "3회 1,190,000원", badge: "NEW" },
    { cat: "lifting", device: "엑셀웨이브 (Excelwave)", title: "엑셀웨이브 이중턱 + 심부볼 집중 타깃", once: "290,000원", multi: "3회 750,000원", badge: "무마취" },
    { cat: "lifting", device: "울쎄라 (Ulthera)", title: "울쎄라 오리지널 리프팅 100샷 (정품팁 인증서)", once: "290,000원", multi: "300샷 750,000원", badge: "정품팁" },
    { cat: "lifting", device: "울쎄라 (Ulthera)", title: "울쎄라 오리지널 400샷 + LDM 진정 재생", once: "950,000원", multi: "600샷 1,350,000원", badge: "BEST" },
    { cat: "lifting", device: "인모드 (InMode)", title: "인모드 FX (지방세포 사멸) 1부위 (이중턱 or 심부볼)", once: "69,000원", multi: "3회 180,000원" },
    { cat: "lifting", device: "인모드 (InMode)", title: "인모드 FX + FORMA 풀페이스 2단계 타이트닝", once: "129,000원", multi: "3회 330,000원", badge: "특가" },
    { cat: "lifting", device: "슈링크 유니버스", title: "슈링크 유니버스 300샷 (울트라F + 펜타입 부스터)", once: "119,000원", multi: "600샷 210,000원" },
    { cat: "lifting", device: "올리지오 (Oligio)", title: "올리지오 RF 고주파 300샷 (콜라겐 밀도 개선)", once: "420,000원", multi: "600샷 750,000원" },
    { cat: "lifting", device: "젠틀맥스 리프팅", title: "젠틀맥스 프로 플러스 롱펄스 제네시스 탄력토닝", once: "99,000원", multi: "5회 390,000원", badge: "신규" },

    // 3. 여성 제모
    { cat: "hair-w", device: "젠틀맥스 프로+", title: "여성 겨드랑이 레이저 제모", once: "15,000원", multi: "5회 49,000원" },
    { cat: "hair-w", device: "젠틀맥스 프로+", title: "여성 인중 + 겨드랑이 세트", once: "25,000원", multi: "5회 59,000원", badge: "BEST" },
    { cat: "hair-w", device: "젠틀맥스 프로+", title: "여성 얼굴 전체 솜털 제모 (이마+볼+인중+턱)", once: "60,000원", multi: "5회 220,000원" },
    { cat: "hair-w", device: "젠틀맥스 프로+", title: "여성 팔 하완 (팔꿈치 아래 + 손등 + 손가락)", once: "50,000원", multi: "5회 169,000원" },
    { cat: "hair-w", device: "젠틀맥스 프로+", title: "여성 종아리 + 무릎 전체 제모", once: "60,000원", multi: "5회 199,000원", badge: "인기" },
    { cat: "hair-w", device: "젠틀맥스 프로+", title: "여성 브라질리언 올누드/디자인 (1인 전용실)", once: "90,000원", multi: "5회 350,000원", badge: "프라이빗" },

    // 4. 남성 제모
    { cat: "hair-m", device: "젠틀맥스 프로+", title: "남성 인중 + 턱수염 제모 (마취크림 포함)", once: "60,000원", multi: "5회 240,000원" },
    { cat: "hair-m", device: "젠틀맥스 프로+", title: "남성 수염 전체 (인중+턱+턱밑+볼+구렛나루+목)", once: "99,000원", multi: "5회 390,000원 / 10회 690,000원", badge: "남성 1위" },
    { cat: "hair-m", device: "젠틀맥스 프로+", title: "남성 눈썹 위 / 미간 / 광대 라인 정리", once: "30,000원", multi: "5회 110,000원" },
    { cat: "hair-m", device: "젠틀맥스 프로+", title: "남성 겨드랑이 제모", once: "25,000원", multi: "5회 89,000원" },
    { cat: "hair-m", device: "젠틀맥스 프로+", title: "남성 종아리 + 무릎 제모", once: "90,000원", multi: "5회 340,000원" },
    { cat: "hair-m", device: "젠틀맥스 프로+", title: "남성 다리 전체 (허벅지 + 무릎 + 종아리 + 발등)", once: "170,000원", multi: "5회 650,000원" },

    // 5. 스킨부스터
    { cat: "booster", device: "리쥬란 (Rejuran)", title: "리쥬란 힐러 2cc", once: "199,000원", multi: "3회 540,000원", badge: "BEST" },
    { cat: "booster", device: "리쥬란 (Rejuran)", title: "리쥬란 HB 플러스 (무통 리쥬란) 2cc", once: "259,000원", multi: "3회 720,000원", badge: "무통" },
    { cat: "booster", device: "리쥬란 (Rejuran)", title: "리쥬란 아이 (눈가 전용) 1cc", once: "130,000원", multi: "3회 350,000원" },
    { cat: "booster", device: "쥬베룩 (Juvelook)", title: "쥬베룩 스킨 (모공·결·잔주름) 4cc", once: "220,000원", multi: "3회 590,000원", badge: "인기" },
    { cat: "booster", device: "쥬베룩 (Juvelook)", title: "쥬베룩 볼륨 1병 (8cc 콜라겐 풀케어)", once: "450,000원", multi: "3회 1,250,000원", badge: "볼륨" },
    { cat: "booster", device: "엑소좀 (Exosome)", title: "ASCE+ 줄기세포 엑소좀 5cc 풀페이스", once: "230,000원", multi: "3회 590,000원" },

    // 6. 필러
    { cat: "filler", device: "국산 필러", title: "아띠에르 / 뉴라미스 필러 1cc (이마/볼/팔자/턱)", once: "99,000원", multi: "3cc 270,000원", badge: "가성비" },
    { cat: "filler", device: "독일 벨로테로", title: "벨로테로 프리미엄 필러 1cc (자연스러운 밀착)", once: "240,000원", multi: "2cc 440,000원", badge: "BEST" },
    { cat: "filler", device: "스웨덴 레스틸렌", title: "레스틸렌 정품 필러 1cc (형광현상 없음)", once: "250,000원", multi: "2cc 460,000원" },
    { cat: "filler", device: "특수 부위", title: "입술 볼륨 + 입꼬리 보톡스 맞춤 디자인", once: "150,000원", multi: "수입 벨로테로 270,000원", badge: "디자인" },
    { cat: "filler", device: "필러 용해", title: "히알루로니다제 필러 녹이는 주사 (부위당)", once: "80,000원", multi: "타원 시술 포함", badge: "" },

    // 7. 보톡스 / 윤곽주사
    { cat: "botox", device: "주름 보톡스", title: "이마 / 미간 / 눈가 / 콧등 / 자갈턱 (국산 1부위)", once: "19,000원", multi: "3부위 패키지 49,000원", badge: "특가" },
    { cat: "botox", device: "사각턱 보톡스", title: "국산 정품 사각턱 보톡스 50U", once: "25,000원", multi: "코어톡스 49,000원 / 제오민 69,000원", badge: "BEST" },
    { cat: "botox", device: "독일 제오민", title: "독일 제오민 순수 보톡스 (내성 방지) 50U", once: "69,000원", multi: "3회 190,000원", badge: "내성Zero" },
    { cat: "botox", device: "스킨보톡스", title: "더모톡신 얼굴 전체 (모공·잔주름 타이트닝)", once: "79,000원", multi: "제오민 더모톡신 149,000원" },
    { cat: "botox", device: "바디 보톡스", title: "승모근 / 종아리 / 겨드랑이 다한증 100U", once: "79,000원", multi: "200U 140,000원" },
    { cat: "botox", device: "윤곽주사", title: "브이올렛 (식약처 허가 이중턱 지방파괴술) 1병", once: "230,000원", multi: "2병 420,000원", badge: "반영구" },

    // 8. 메디컬 스킨케어
    { cat: "skincare", device: "독일 LDM", title: "LDM 물방울 리프팅 (홍조/보습/재생/트러블)", once: "60,000원", multi: "5회 250,000원", badge: "BEST" },
    { cat: "skincare", device: "아쿠아필", title: "아쿠아필 3단계 모공 딥클렌징 + 수분진정팩", once: "40,000원", multi: "5회 160,000원" },
    { cat: "skincare", device: "라라필", title: "라라필 (LHA 4세대 저자극 필링) + 진정관리", once: "80,000원", multi: "3회 210,000원" },
    { cat: "skincare", device: "크라이오/비타민", title: "크라이오 냉각진정 또는 비타민 이온자임 1회", once: "40,000원", multi: "10회 300,000원" }
  ];

  const filteredItems = searchQuery.trim()
    ? FULL_PRICE_DATA.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.device.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FULL_PRICE_DATA.filter(item => item.cat === currentSelectedCategory);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleOpenBooking = (procName?: string) => {
    setSelectedProcedure(procName || '비급여 시술 및 이벤트 맞춤 상담');
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingModalOpen(false);
    showToast(`[예약 접수 완료] ${bookingForm.name}님, '${selectedProcedure}' 상담 신청이 접수되었습니다.`);
  };

  const scrollToPrice = () => {
    const el = document.getElementById('price-container');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF8] text-[#151515] font-sans selection:bg-[#9E8A63] selection:text-white">
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
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                이벤트 <span className="w-1.5 h-1.5 rounded-full bg-red-500 mb-2"></span>
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0F2B22] hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between"
                >
                  <span>10월 이벤트</span>
                  <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
                <button
                  onClick={() => onNavigateToPrices ? onNavigateToPrices() : scrollToPrice()}
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
                onClick={() => onNavigateToColumn ? onNavigateToColumn() : onNavigateHome('sec-column')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                원장 칼럼 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => onNavigateToColumn ? onNavigateToColumn() : onNavigateHome('sec-column')}
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
              onClick={() => handleOpenBooking('실시간 맞춤 예약')}
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

      {/* ================= MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative ml-auto w-80 max-w-[85vw] bg-white shadow-lg flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="p-5 bg-[#0E2920] text-white flex items-center justify-between">
                <div>
                  <img
                    src={LOGO_SRC}
                    alt="서울뷰의원 당진"
                    className="h-9 w-auto object-contain mb-1 filter drop-shadow-sm"
                  />
                  <p className="text-xs text-zinc-300">서울뷰의원 당진점 이벤트/수가표</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 space-y-2 text-sm divide-y divide-[#E8E3DD]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateHome();
                  }}
                  className="w-full text-left py-2.5 font-bold text-[#0E2920] flex items-center justify-between"
                >
                  <span>00. 메인 홈페이지로 이동</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href="#event-showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 font-bold text-[#9E8A63]"
                >
                  01. 이달의 런칭 이벤트
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToPrice();
                  }}
                  className="w-full text-left py-2.5 font-bold text-[#151515]"
                >
                  02. 상세 비급여 수가표 (8대 카테고리)
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateHome('sec-ba');
                  }}
                  className="w-full text-left py-2.5 text-zinc-700"
                >
                  03. 시술 전후사진 아카이브
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateHome('sec-guide');
                  }}
                  className="w-full text-left py-2.5 text-zinc-700"
                >
                  04. 시술안내 및 주의사항
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateHome('sec-location');
                  }}
                  className="w-full text-left py-2.5 text-zinc-700"
                >
                  05. 오시는 길 & 진료시간
                </button>
              </div>
            </div>
            <div className="p-4 bg-[#F8F8F9] border-t border-[#E8E3DD]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenBooking('모바일 빠른 진료 예약');
                }}
                className="w-full bg-[#0E2920] text-white py-3 rounded font-semibold text-xs tracking-wider cursor-pointer"
              >
                빠른 진료 예약 / 카톡 상담
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RIGHT FLOATING QUICK BAR ================= */}
      <aside className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col bg-white border border-[#E8E3DD] rounded-xl shadow-md overflow-hidden divide-y divide-[#E8E3DD] w-20 text-center">
        <button
          onClick={() => handleOpenBooking('우측 퀵바 예약')}
          className="py-3.5 px-2 bg-[#0E2920] text-white hover:bg-[#184033] transition flex flex-col items-center justify-center group cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-[#BFA980] mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-bold">진료예약</span>
        </button>
        <a
          href="https://pf.kakao.com/_gIJQG"
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 px-2 hover:bg-[#FEE500]/20 transition flex flex-col items-center justify-center text-[#151515] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#3C1E1E] fill-[#FEE500] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">카톡상담</span>
        </a>
        <button
          onClick={scrollToPrice}
          className="py-3.5 px-2 hover:bg-[#F8F8F9] transition flex flex-col items-center justify-center text-[#151515] cursor-pointer"
        >
          <Search className="w-5 h-5 text-[#9E8A63] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">수가검색</span>
        </button>
        <button
          onClick={() => onNavigateHome()}
          className="py-3.5 px-2 hover:bg-[#F8F8F9] transition flex flex-col items-center justify-center text-[#151515] cursor-pointer"
        >
          <Home className="w-5 h-5 text-zinc-600 mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">홈으로</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="py-2.5 bg-[#F8F8F9] text-zinc-500 hover:text-[#151515] text-[10px] font-mono tracking-widest flex flex-col items-center cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          TOP
        </button>
      </aside>

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
              <span className="text-[#BFA980]">이벤트 & 상세 비급여 수가표</span>
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

      {/* ================= TOP HIGHLIGHT: 이달의 런칭 스페셜 프로모션 ================= */}
      <section id="event-showcase" className="py-12 bg-white border-b border-[#E8E3DD]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="font-mono text-xs tracking-widest text-[#9E8A63] font-bold uppercase">
                HOT PICK / LAUNCHING EVENT
              </span>
              <h2 className="text-2xl font-bold text-[#151515] mt-0.5">당진점 런칭 기념 베스트 프로모션</h2>
            </div>
            <p className="text-xs text-zinc-500">※ 한정 인원 도달 시 사전 예고 없이 조기 마감될 수 있습니다.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Event Card 1 */}
            <div className="bg-[#FDFBF8] border border-[#9E8A63]/40 rounded-xl p-5 hover:border-[#9E8A63] transition shadow-xs flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="bg-[#0E2920] text-[#BFA980] text-[10px] font-bold px-2 py-0.5 rounded">
                    NEW LAUNCH
                  </span>
                  <span className="text-[11px] text-zinc-400">VAT 별도</span>
                </div>
                <h3 className="font-bold text-[#151515] text-base group-hover:text-[#0E2920] transition">
                  엑셀웨이브 2.45GHz 리프팅
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  강력한 쿨링과 극초단파 마이크로웨이브 에너지로 통증 없는 풀페이스 컨투어링
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E3DD]/70 flex items-center justify-between">
                <span className="text-xs text-zinc-400 line-through">70만원</span>
                <span className="font-mono text-xl font-bold text-[#0E2920]">450,000원</span>
              </div>
              <button
                onClick={() => handleOpenBooking('엑셀웨이브 런칭 특가 (45만원)')}
                className="mt-3 w-full bg-[#9E8A63] hover:bg-[#85734F] text-white py-2 rounded text-xs font-semibold transition cursor-pointer"
              >
                이벤트 예약하기
              </button>
            </div>

            {/* Event Card 2 */}
            <div className="bg-[#FDFBF8] border border-[#9E8A63]/40 rounded-xl p-5 hover:border-[#9E8A63] transition shadow-xs flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="bg-[#0E2920] text-[#BFA980] text-[10px] font-bold px-2 py-0.5 rounded">
                    피부 재생 BEST
                  </span>
                  <span className="text-[11px] text-zinc-400">VAT 별도</span>
                </div>
                <h3 className="font-bold text-[#151515] text-base group-hover:text-[#0E2920] transition">
                  리쥬란 힐러 2cc
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  정품 박스 개봉 확인 · 연어 PN 성분으로 무너진 진피 두께와 유수분 밸런스 복원
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E3DD]/70 flex items-center justify-between">
                <span className="text-xs text-zinc-400 line-through">30만원</span>
                <span className="font-mono text-xl font-bold text-[#0E2920]">199,000원</span>
              </div>
              <button
                onClick={() => handleOpenBooking('리쥬란 힐러 2cc (19.9만원)')}
                className="mt-3 w-full bg-[#9E8A63] hover:bg-[#85734F] text-white py-2 rounded text-xs font-semibold transition cursor-pointer"
              >
                이벤트 예약하기
              </button>
            </div>

            {/* Event Card 3 */}
            <div className="bg-[#FDFBF8] border border-[#9E8A63]/40 rounded-xl p-5 hover:border-[#9E8A63] transition shadow-xs flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="bg-[#0E2920] text-[#BFA980] text-[10px] font-bold px-2 py-0.5 rounded">
                    첫방문 체험
                  </span>
                  <span className="text-[11px] text-zinc-400">VAT 별도</span>
                </div>
                <h3 className="font-bold text-[#151515] text-base group-hover:text-[#0E2920] transition">
                  피코슈어 토닝 + 진정 1회
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  오리지널 755nm 알렉산드라이트 피코레이저로 기미·잡티 색소만 정밀 타깃
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E3DD]/70 flex items-center justify-between">
                <span className="text-xs text-zinc-400 line-through">12만원</span>
                <span className="font-mono text-xl font-bold text-[#0E2920]">49,000원</span>
              </div>
              <button
                onClick={() => handleOpenBooking('피코슈어 토닝 1회 체험 (4.9만원)')}
                className="mt-3 w-full bg-[#9E8A63] hover:bg-[#85734F] text-white py-2 rounded text-xs font-semibold transition cursor-pointer"
              >
                이벤트 예약하기
              </button>
            </div>

            {/* Event Card 4 */}
            <div className="bg-[#FDFBF8] border border-[#9E8A63]/40 rounded-xl p-5 hover:border-[#9E8A63] transition shadow-xs flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="bg-[#0E2920] text-[#BFA980] text-[10px] font-bold px-2 py-0.5 rounded">
                    리프팅 특가
                  </span>
                  <span className="text-[11px] text-zinc-400">VAT 별도</span>
                </div>
                <h3 className="font-bold text-[#151515] text-base group-hover:text-[#0E2920] transition">
                  인모드 FX + FORMA 풀페이스
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  이중턱 지방세포 사멸(FX) + 진피 콜라겐 타이트닝(FORMA) 2단계 올인원
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E3DD]/70 flex items-center justify-between">
                <span className="text-xs text-zinc-400 line-through">25만원</span>
                <span className="font-mono text-xl font-bold text-[#0E2920]">129,000원</span>
              </div>
              <button
                onClick={() => handleOpenBooking('인모드 풀페이스 (12.9만원)')}
                className="mt-3 w-full bg-[#9E8A63] hover:bg-[#85734F] text-white py-2 rounded text-xs font-semibold transition cursor-pointer"
              >
                이벤트 예약하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN PRICE SECTION (8대 카테고리 & 검색) ================= */}
      <main id="price-container" className="py-16 md:py-24 max-w-7xl mx-auto px-4 lg:px-8">
        {/* Dedicated Price Page Entrance Card */}
        <div className="mb-10 p-6 sm:p-8 bg-gradient-to-r from-[#0E2920] to-[#184235] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#9E8A63]/50">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#9E8A63]/30 text-[#C5A880] text-xs font-bold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>의료법 제45조 준수 비급여 공식 수가표</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              서울뷰의원 당진점 상세 비급여 수가표
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
              전체 8대 클리닉의 1회 및 다회/패키지 상세 비급여 수가를 새로운 전용 페이지에서 더욱 쾌적하게 확인하고 바로 예약하실 수 있습니다.
            </p>
          </div>
          {onNavigateToPrices && (
            <button
              onClick={() => onNavigateToPrices()}
              className="shrink-0 bg-[#C5A880] hover:bg-[#A6895E] text-[#111111] font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>상세 비급여 수가표 새 페이지로 보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#E8E3DD] pb-6">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#9E8A63] font-bold uppercase">
              CATEGORY-WISE PRICING TABLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#151515] mt-1">
              부위 및 시술별 상세 비급여 수가
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              8대 전문 카테고리 구성 (단위: 원 / 부가세 10% 별도)
            </p>
          </div>

          {/* Live Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="시술명 검색 (예: 엑셀웨이브, 피코슈어, 울쎄라)"
              className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm border border-[#E8E3DD] rounded-lg bg-white focus:outline-none focus:border-[#9E8A63] transition shadow-xs"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#151515] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 8 Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {[
            { id: 'pigment', label: '기미/모공/문신' },
            { id: 'lifting', label: '리프팅' },
            { id: 'hair-w', label: '여성 제모' },
            { id: 'hair-m', label: '남성 제모' },
            { id: 'booster', label: '스킨부스터' },
            { id: 'filler', label: '필러' },
            { id: 'botox', label: '보톡스/윤곽' },
            { id: 'skincare', label: '메디컬 스킨케어' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCurrentSelectedCategory(cat.id);
                setSearchQuery('');
              }}
              className={`py-3 px-2 rounded-lg text-xs transition text-center cursor-pointer ${
                currentSelectedCategory === cat.id && !searchQuery
                  ? 'font-bold bg-[#9E8A63] text-white shadow-xs'
                  : 'font-medium bg-white text-zinc-700 border border-[#E8E3DD] hover:border-[#9E8A63]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Category Header Info Banner */}
        <div className="bg-white border-l-4 border-[#9E8A63] p-4 rounded-r-lg border border-[#E8E3DD] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <h3 className="font-bold text-[#151515] text-sm sm:text-base">
              {searchQuery ? `검색 결과: "${searchQuery}"` : CATEGORY_META[currentSelectedCategory]?.title}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {searchQuery ? "전체 카테고리에서 일치하는 시술 항목을 표시합니다." : CATEGORY_META[currentSelectedCategory]?.desc}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs">
            <span className="text-zinc-500">조회 항목수:</span>
            <strong className="bg-[#F4EFEB] text-[#9E8A63] px-2.5 py-0.5 rounded font-mono font-bold">
              {filteredItems.length}건
            </strong>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white border border-[#E8E3DD] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#0E2920] text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-5 font-semibold whitespace-nowrap">장비 / 분류</th>
                  <th className="py-4 px-5 font-semibold">시술 항목 및 상세 안내</th>
                  <th className="py-4 px-5 font-semibold text-right whitespace-nowrap">1회 기준 수가</th>
                  <th className="py-4 px-5 font-semibold text-right whitespace-nowrap">패키지 / 다회 수가</th>
                  <th className="py-4 px-5 font-semibold text-center w-28 whitespace-nowrap">온라인 신청</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DD] text-xs sm:text-sm">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-400 text-xs">
                      일치하는 시술 정보가 없습니다. 다른 단어로 검색해 보세요.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FDFBF8] transition">
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-semibold text-[#0E2920] block">{item.device}</span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-[#151515]">{item.title}</span>
                          {item.badge && (
                            <span className="bg-[#9E8A63]/15 text-[#85734F] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#9E8A63]/30 whitespace-nowrap">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right font-bold text-[#151515] whitespace-nowrap">{item.once}</td>
                      <td className="py-4 px-5 text-right font-semibold text-[#85734F] whitespace-nowrap">{item.multi}</td>
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleOpenBooking(`${item.title} (${item.once})`)}
                          className="border border-[#9E8A63] text-[#85734F] hover:bg-[#9E8A63] hover:text-white text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer whitespace-nowrap"
                        >
                          예약상담
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Notice Callout */}
        <div className="mt-8 bg-[#F4EFEB]/70 border border-[#9E8A63]/30 rounded-xl p-5 text-xs text-zinc-600 space-y-2">
          <p className="font-bold text-[#151515] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#9E8A63]" />
            비급여 진료비용 고지 및 의료법 안내사항
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-500 leading-relaxed">
            <li>의료법 제45조 및 동법 시행규칙 제42조의2 규정에 의하여 비급여 진료비용을 고지합니다.</li>
            <li>모든 비급여 시술 금액에는 <strong>부가가치세 10%가 별도</strong>로 부과됩니다.</li>
            <li>환자 개개인의 피부 두께, 색소 깊이, 흉터 양상 및 근막 처짐 상태에 따라 최적의 권장 샷수 및 복합 패키지가 달라질 수 있습니다.</li>
            <li>시술 후 일시적인 붉은기, 멍, 부기, 색소침착 등의 부작용이 발생할 수 있으므로 의사와의 사전 1:1 상담 후 진행됩니다.</li>
          </ul>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0E2920] text-zinc-400 py-14 border-t border-white/10 text-xs pb-24 md:pb-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={LOGO_SRC}
                  alt="꽃을보듯너를 서울뷰의원 당진"
                  className="h-11 w-auto object-contain filter drop-shadow-sm"
                />
              </div>
              <p className="mt-2 text-zinc-400 leading-relaxed">
                상호명: 서울뷰의원 당진점 | 대표자: 홍길동 | 사업자등록번호: 312-00-00000<br />
                주소: 충청남도 당진시 시청1로 서울뷰타워 4층 | 대표전화: 041-350-0000
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-start text-zinc-300">
              <button
                onClick={() => onNavigateHome()}
                className="hover:text-[#BFA980] cursor-pointer"
              >
                홈페이지 메인
              </button>
              <span>|</span>
              <button
                onClick={scrollToPrice}
                className="hover:text-[#BFA980] underline underline-offset-4 cursor-pointer"
              >
                상세 비급여 수가표
              </button>
              <span>|</span>
              <button
                onClick={() => onNavigateHome('sec-location')}
                className="hover:text-[#BFA980] cursor-pointer"
              >
                오시는 길 & 주차
              </button>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
            <p>© 2026 SEOUL VIEW CLINIC DANGJIN. ALL RIGHTS RESERVED.</p>
            <p>본 사이트의 모든 비급여 수가 정보는 의료법을 준수합니다.</p>
          </div>
        </div>
      </footer>

      {/* ================= MOBILE FIXED BOTTOM BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E3DD] grid grid-cols-4 text-[11px] font-semibold shadow-lg">
        <button
          onClick={() => handleOpenBooking('모바일 빠른 진료예약')}
          className="py-3 bg-[#0E2920] text-white flex flex-col items-center justify-center cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4 text-[#BFA980] mb-0.5" />
          <span>진료예약</span>
        </button>
        <a
          href="tel:041-350-0000"
          className="py-3 text-[#151515] flex flex-col items-center justify-center cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-[#9E8A63] mb-0.5" />
          <span>전화걸기</span>
        </a>
        <button
          onClick={scrollToPrice}
          className="py-3 text-[#151515] flex flex-col items-center justify-center cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#0E2920] mb-0.5" />
          <span>수가검색</span>
        </button>
        <button
          onClick={() => onNavigateHome()}
          className="py-3 text-[#151515] flex flex-col items-center justify-center cursor-pointer"
        >
          <Home className="w-4 h-4 text-zinc-600 mb-0.5" />
          <span>홈으로</span>
        </button>
      </div>

      {/* ================= BOOKING MODAL ================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-lg border border-[#9E8A63]/40 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-[#151515] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs tracking-widest text-[#9E8A63] font-bold uppercase">
              RESERVATION / INQUIRY
            </span>
            <h3 className="text-2xl font-bold text-[#151515] mt-1">서울뷰의원 당진점 예약 신청</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-6">
              원하시는 시술 또는 상담 항목을 남겨주시면 빠르게 안내해 드립니다.
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">성함 *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  placeholder="고객님의 성함을 입력해주세요"
                  className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#9E8A63]"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">연락처 *</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#9E8A63]"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">선택 시술 / 관심 프로그램</label>
                <input
                  type="text"
                  value={selectedProcedure}
                  onChange={(e) => setSelectedProcedure(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg bg-[#F4EFEB] font-semibold text-[#0E2920] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">희망 예약일 *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg focus:outline-none focus:border-[#9E8A63]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">희망 시간대</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E8E3DD] rounded-lg bg-white focus:outline-none focus:border-[#9E8A63]"
                  >
                    <option>오전 (10:00 ~ 12:30)</option>
                    <option>오후 (14:00 ~ 18:00)</option>
                    <option>야간진료 (화·금 18:00~20:30)</option>
                    <option>토요일 (09:30 ~ 16:00)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0E2920] hover:bg-[#184033] text-white font-bold py-3.5 rounded-lg text-sm transition mt-2 cursor-pointer"
              >
                예약 및 상담 신청 완료
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#0E2920] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#9E8A63] flex items-center gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#BFA980] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
