import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EventPage from './EventPage.tsx';
import PricePage from './PricePage.tsx';
import ColumnPage from './ColumnPage.tsx';
import { COLUMNS_DATA } from './data/columnsData.ts';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Calendar,
  Menu,
  X,
  CheckCircle2,
  Search,
  MessageCircle,
  Instagram,
  MapPin,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  Phone,
  Clock,
  Copy,
  ExternalLink,
  BookOpen
} from 'lucide-react';

// Data Types
interface EventItem {
  badge: string;
  title: string;
  desc: string;
  orig: string;
  price: string;
}

interface PriceItem {
  cat: string;
  group: string;
  name: string;
  once: string;
  multi: string;
}

interface BaItem {
  title: string;
  period: string;
  desc: string;
  beforeMetric: string;
  afterMetric: string;
}

interface GuideItem {
  title: string;
  subtitle: string;
  time: string;
  anesthesia: string;
  cycle: string;
  downtime: string;
  precautions: string[];
}

interface ColumnItem {
  tag: string;
  title: string;
  preview: string;
  paragraphs: string[];
}

export default function App() {
  // Brand Logo Path from user attachment
  const LOGO_SRC = "/assets/aistudio/____________c4c3a0ad.png";

  // ===== 페이지 라우팅 (react-router: 정식 경로 방식) =====
  // /  /event  /prices  /column  /column/:slug
  type PageName = 'home' | 'event' | 'prices' | 'column';
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';

  const currentPage: PageName = pathname.startsWith('/column')
    ? 'column'
    : pathname === '/event'
    ? 'event'
    : pathname === '/prices'
    ? 'prices'
    : 'home';

  const selectedColumnArticleId: string | null = (() => {
    if (!pathname.startsWith('/column/')) return null;
    const raw = pathname.slice('/column/'.length);
    try {
      return decodeURIComponent(raw) || null;
    } catch {
      return raw || null;
    }
  })();

  const navigateTo = (page: PageName, targetId?: string) => {
    setMobileMenuOpen(false);
    if (page === 'column') {
      if (targetId) {
        // id 또는 slug 모두 받아서 항상 slug 주소로 이동 (검색 친화적 URL)
        const article = COLUMNS_DATA.find((c) => c.id === targetId || c.slug === targetId);
        navigate(`/column/${article ? article.slug : targetId}`);
      } else {
        navigate('/column');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'event') {
      navigate('/event');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'prices') {
      navigate('/prices');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // 예전 해시 주소(#event-page 등)로 들어온 링크를 새 경로로 자동 이동
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    if (hash === '#event-page') {
      navigate('/event', { replace: true });
    } else if (hash === '#prices-page') {
      navigate('/prices', { replace: true });
    } else if (hash === '#column-page') {
      navigate('/column', { replace: true });
    } else if (hash.startsWith('#column/')) {
      const id = hash.replace('#column/', '');
      const article = COLUMNS_DATA.find((c) => c.id === id || c.slug === id);
      navigate(`/column/${article ? article.slug : id}`, { replace: true });
    }
  }, [location.hash]);

  // 알 수 없는 경로는 홈으로
  useEffect(() => {
    const known = pathname === '/' || pathname === '/event' || pathname === '/prices' || pathname.startsWith('/column');
    if (!known) navigate('/', { replace: true });
  }, [pathname]);

  // 페이지별 브라우저 탭 제목 (칼럼 페이지는 ColumnPage가 직접 설정)
  useEffect(() => {
    if (currentPage === 'home') {
      document.title = '서울뷰의원 당진점 | SEOUL VIEW CLINIC DANGJIN';
    } else if (currentPage === 'event') {
      document.title = '이벤트 | 서울뷰의원 당진점';
    } else if (currentPage === 'prices') {
      document.title = '비급여 수가표 | 서울뷰의원 당진점';
    }
  }, [currentPage]);

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Section Tabs
  const [aboutTab, setAboutTab] = useState<'brand' | 'devices' | 'facility'>('brand');
  const [eventCat, setEventCat] = useState<'booster' | 'laser' | 'lifting' | 'petit'>('booster');
  const [priceCat, setPriceCat] = useState<string>('pigment');
  const [priceSearch, setPriceSearch] = useState<string>('');
  const [baCat, setBaCat] = useState<'lifting' | 'melasma' | 'filler' | 'acne' | 'hair' | 'tattoo'>('lifting');
  const [isBaUnlocked, setIsBaUnlocked] = useState<boolean>(false);
  const [guideCat, setGuideCat] = useState<string>('toning');

  // Modals & Notifications
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState<string>('1:1 맞춤 진료 상담');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '오후 (14:00 ~ 18:00)'
  });

  const [columnModalOpen, setColumnModalOpen] = useState<boolean>(false);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number>(0);

  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [quickOnce, setQuickOnce] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hero Multi-Tab State
  const [heroTab, setHeroTab] = useState<'video' | 'excelwave'>('video');

  // Media Assets attached by user
  const MAIN_IMAGE_SRC = "/assets/aistudio/main_image_2f557015.jpg";
  const MAIN_VIDEO_SRC = "/assets/aistudio/Main_video_67fdbcc8.mp4";
  const EXCELWAVE_DEVICE_SRC = "/assets/aistudio/_________42345710.png";

  // 메인 영상: 화면 밖으로 나가면 일시정지, 다시 보이면 재생
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [currentPage]);

  // Price Data State (allows adding items)
  const [priceList, setPriceList] = useState<PriceItem[]>([
    // 1. 기미 / 모공 / 문신제거 (pigment)
    { cat: "pigment", group: "피코슈어 (755nm)", name: "피코슈어 토닝 + 진정관리", once: "90,000원", multi: "5회 390,000원 / 10회 690,000원" },
    { cat: "pigment", group: "피코슈어 (755nm)", name: "피코슈어 프락셀 (포커스 모공/흉터) + 크라이오", once: "150,000원", multi: "3회 390,000원 / 5회 590,000원" },
    { cat: "pigment", group: "레블라이트 SI", name: "레블라이트 SI PTP 듀얼토닝 + 비타민관리", once: "80,000원", multi: "10회 590,000원" },
    { cat: "pigment", group: "흑자 / 잡티 제거", name: "피코슈어 흑자 / 검버섯 원데이 집중 제거 (개당/크기별)", once: "30,000원~", multi: "얼굴 전체 패키지 290,000원~" },
    { cat: "pigment", group: "포텐자 (Potenza)", name: "포텐자 마이크로니들 (모공/흉터/홍조) 1회 (팁 포함)", once: "180,000원", multi: "3회 450,000원" },
    { cat: "pigment", group: "포텐자 (Potenza)", name: "포텐자 펌핑팁 + 쥬베룩 스킨 2cc", once: "290,000원", multi: "3회 790,000원" },
    { cat: "pigment", group: "문신제거", name: "피코슈어 눈썹 반영구 문신제거", once: "80,000원", multi: "3회 190,000원" },
    { cat: "pigment", group: "문신제거", name: "피코슈어 레터링 / 컬러 타투 제거 (명함 1/2 크기 기준)", once: "100,000원", multi: "5회 390,000원" },

    // 2. 리프팅 (lifting) - Includes Excelwave
    { cat: "lifting", group: "엑셀웨이브 (Excelwave)", name: "엑셀웨이브 2.45GHz 극초단파 리프팅 풀페이스", once: "450,000원", multi: "3회 1,190,000원" },
    { cat: "lifting", group: "엑셀웨이브 (Excelwave)", name: "엑셀웨이브 이중턱 + 심부볼 집중 컨투어링", once: "290,000원", multi: "3회 750,000원" },
    { cat: "lifting", group: "울쎄라 (Ultherapy)", name: "울쎄라 오리지널 리프팅 100샷 (정품인증)", once: "290,000원", multi: "300샷 750,000원" },
    { cat: "lifting", group: "울쎄라 (Ultherapy)", name: "울쎄라 오리지널 리프팅 400샷 + LDM 재생", once: "950,000원", multi: "600샷 1,350,000원" },
    { cat: "lifting", group: "인모드 (InMode)", name: "인모드 FX (지방감소) 1부위 (이중턱 또는 심부볼)", once: "69,000원", multi: "3회 180,000원" },
    { cat: "lifting", group: "인모드 (InMode)", name: "인모드 FX + FORMA 풀페이스 2단계 올인원", once: "129,000원", multi: "3회 330,000원" },
    { cat: "lifting", group: "슈링크 유니버스", name: "슈링크 유니버스 300샷 (울트라F + 부스터 펜타입)", once: "119,000원", multi: "600샷 210,000원" },
    { cat: "lifting", group: "올리지오 (Oligio)", name: "올리지오 RF 고주파 타이트닝 300샷", once: "420,000원", multi: "600샷 750,000원" },
    { cat: "lifting", group: "젠틀맥스 리프팅", name: "젠틀맥스 프로 플러스 롱펄스 제네시스 탄력 리프팅", once: "99,000원", multi: "5회 390,000원" },

    // 3. 여성 제모 (hair-w)
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 겨드랑이 레이저 제모", once: "15,000원", multi: "5회 49,000원" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 인중 + 겨드랑이 세트", once: "25,000원", multi: "5회 59,000원" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 얼굴 전체 (이마+볼+구렛나루+인중+턱) 솜털제모", once: "60,000원", multi: "5회 220,000원" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 팔 하완 (팔꿈치 아래 + 손등 + 손가락)", once: "50,000원", multi: "5회 169,000원" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 종아리 + 무릎 전체", once: "60,000원", multi: "5회 199,000원" },
    { cat: "hair-w", group: "젠틀맥스 프로 플러스", name: "여성 브라질리언 올누드/디자인 (1인 프라이빗룸)", once: "90,000원", multi: "5회 350,000원" },

    // 4. 남성 제모 (hair-m)
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 인중 + 턱수염 (마취크림 + 진정팩 포함)", once: "60,000원", multi: "5회 240,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 수염 전체 (인중+턱+턱밑+볼+구렛나루+목)", once: "99,000원", multi: "5회 390,000원 / 10회 690,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 눈썹 위/미간/광대 라인 정리", once: "30,000원", multi: "5회 110,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 겨드랑이 제모", once: "25,000원", multi: "5회 89,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 종아리 + 무릎 제모", once: "90,000원", multi: "5회 340,000원" },
    { cat: "hair-m", group: "젠틀맥스 프로 플러스", name: "남성 다리 전체 (허벅지 + 무릎 + 종아리 + 발등)", once: "170,000원", multi: "5회 650,000원" },

    // 5. 스킨부스터 (booster)
    { cat: "booster", group: "리쥬란 (Rejuran)", name: "리쥬란 힐러 2cc (정품 박스 개봉 확인)", once: "199,000원", multi: "3회 540,000원" },
    { cat: "booster", group: "리쥬란 (Rejuran)", name: "리쥬란 HB 플러스 (무통 리쥬란) 1cc / 2cc", once: "140,000원", multi: "2cc 259,000원" },
    { cat: "booster", group: "리쥬란 (Rejuran)", name: "리쥬란 아이 (눈가 잔주름/다크서클 전용) 1cc", once: "130,000원", multi: "3회 350,000원" },
    { cat: "booster", group: "쥬베룩 (Juvelook)", name: "쥬베룩 스킨 (모공·결·잔주름) 2cc / 4cc", once: "130,000원", multi: "4cc 220,000원" },
    { cat: "booster", group: "쥬베룩 (Juvelook)", name: "쥬베룩 볼륨 (콜라겐 볼륨 부스터) 4cc / 1병(8cc)", once: "250,000원", multi: "1병(8cc) 450,000원" },
    { cat: "booster", group: "엑소좀 / 물광", name: "ASCE+ 줄기세포 엑소좀 5cc 풀페이스", once: "230,000원", multi: "3회 590,000원" },

    // 6. 필러 (filler)
    { cat: "filler", group: "국산 프리미엄 필러", name: "아띠에르 / 뉴라미스 필러 1cc (이마/관자/볼/팔자/턱끝)", once: "99,000원", multi: "3cc 270,000원" },
    { cat: "filler", group: "수입 하이엔드 필러", name: "독일 벨로테로 / 스웨덴 레스틸렌 1cc", once: "240,000원", multi: "2cc 440,000원" },
    { cat: "filler", group: "특수 부위 디자인", name: "입술 디자인 필러 (입꼬리 보톡스 포함) 국산/수입", once: "150,000원", multi: "수입 270,000원" },
    { cat: "filler", group: "필러 제거", name: "히알루로니다제 필러 녹이는 주사 (부위당)", once: "80,000원", multi: "타원 시술 포함 정밀 용해" },

    // 7. 보톡스 / 윤곽주사 (botox)
    { cat: "botox", group: "주름 보톡스", name: "이마 / 미간 / 눈가 / 콧등 / 자갈턱 보톡스 (국산 1부위)", once: "19,000원", multi: "3부위 패키지 49,000원" },
    { cat: "botox", group: "사각턱 보톡스", name: "사각턱 보톡스 50U (국산 정품 / 코어톡스 / 제오민)", once: "25,000원", multi: "코어톡스 49,000원 / 제오민 69,000원" },
    { cat: "botox", group: "스킨보톡스", name: "풀페이스 더모톡신 (모공·잔주름 리프팅)", once: "79,000원", multi: "제오민 스킨보톡스 149,000원" },
    { cat: "botox", group: "바디보톡스", name: "승모근 / 종아리 / 겨드랑이 다한증 100U", once: "79,000원", multi: "200U 140,000원" },
    { cat: "botox", group: "윤곽주사", name: "브이올렛 (식약처 허가 이중턱 지방파괴 주사) 1병(2cc)", once: "230,000원", multi: "2병(4cc) 420,000원" },

    // 8. 메디컬 스킨케어 (skincare)
    { cat: "skincare", group: "프리미엄 초음파", name: "LDM 물방울 리프팅 (홍조/보습/재생/트러블 모드)", once: "60,000원", multi: "5회 250,000원" },
    { cat: "skincare", group: "모공 / 여드름", name: "아쿠아필 3단계 모공 딥클렌징 + 수분진정팩", once: "40,000원", multi: "5회 160,000원" },
    { cat: "skincare", group: "필링 / 광채", name: "라라필 (LHA 4세대 저자극 필링) + 진정관리", once: "80,000원", multi: "3회 210,000원" },
    { cat: "skincare", group: "미백 / 진정", name: "크라이오 냉각이온침투 / 비타민 이온자임 관리", once: "40,000원", multi: "10회 300,000원" }
  ]);

  // Event Data
  const EVENT_DATA: Record<string, EventItem[]> = {
    booster: [
      { badge: "정품 시리얼 확인", title: "리쥬란 힐러 2cc", desc: "연어 PN 성분으로 얇아진 진피 두께 복원 및 유수분 밸런스 개선", orig: "300,000원", price: "199,000원" },
      { badge: "진피 유래 스킨부스터", title: "리투오 1시린지 + 물광 2cc", desc: "피부의 뼈대이자 집이 되어주는 실제 진피 구조(ECM) 자체를 직접 채워 넣습니다.", orig: "590,000원", price: "390,000원" },
      { badge: "모공·결 개선", title: "쥬베룩 스킨 (PDLLA) 4cc", desc: "자가 콜라겐 생성을 유도해 잔주름, 넓은 모공, 여드름 흉터 개선", orig: "350,000원", price: "220,000원" },
      { badge: "자연스러운 볼륨", title: "쥬베룩 볼륨 1병 (8cc 풀케어)", desc: "꺼진 앞볼, 팔자주름, 옆볼에 이물감 없이 차오르는 자가 콜라겐 볼륨", orig: "650,000원", price: "450,000원" },
      { badge: "풀페이스 올인원", title: "리쥬란 힐러 4cc + 물광주사 2cc", desc: "얼굴 전체 속건조 해결 및 맑은 광채 부스팅 패키지", orig: "580,000원", price: "390,000원" },
      { badge: "줄기세포 배양액", title: "하이엔드 엑소좀 (ASCE+) 스킨부스터", desc: "손상된 피부 장벽 회복, 홍조 및 트러블성 피부 항염 재생", orig: "350,000원", price: "230,000원" }
    ],
    laser: [
      { badge: "첫방문 체험가", title: "피코슈어 토닝 + 비타민 진정관리 1회", desc: "오리지널 755nm 피코슈어로 정상조직 손상 없이 멜라닌 색소만 타깃", orig: "120,000원", price: "49,000원" },
      { badge: "흑자/검버섯 특화", title: "피코케어 흑자 원데이 제거 (크기별)", desc: "재발하기 쉬운 얼굴 흑자·검버섯을 532nm 줌 패스로 깔끔하게 제거", orig: "150,000원", price: "100,000원~" },
      { badge: "기미 집중 10회", title: "듀얼 색소 올인원 10회 패키지", desc: "피코슈어 + 레블라이트SI + 제네시스 + 진정케어 10회 맞춤 구성", orig: "1,300,000원", price: "790,000원" },
      { badge: "모공·흉터 타깃", title: "피코슈어 프락셀 + 포텐자 모공 3회", desc: "포커스 렌즈 LIOB 효과와 고주파 마이크로니들로 모공·요철 집중 축소", orig: "750,000원", price: "490,000원" },
      { badge: "시크릿 RF", title: "시크릿 RF + 압출 얼굴전체 1회", desc: "면포와 염증을 먼저 깨끗하게 비워낸 뒤, Micro-needle을 통해 진피층으로 고주파(RF) 열에너지를 직접 전달하는 여드름·모공·흉터 집중 복합 케어", orig: "300,000원", price: "220,000원" },
      { badge: "문신제거", title: "피코슈어 눈썹/바디 문신제거 1회", desc: "컬러 문신과 오래된 잔흔까지 755nm 피코 펄스로 안전하게 파쇄", orig: "150,000원", price: "79,000원~" }
    ],
    lifting: [
      { badge: "정품팁 인증서", title: "울쎄라 리프팅 300샷", desc: "실시간 초음파 영상으로 근막층(SMAS)을 직접 보며 시술하는 프리미엄 리프팅", orig: "1,100,000원", price: "750,000원" },
      { badge: "베스트 조합", title: "울쎄라 400샷 + 인모드 FX", desc: "불필요한 심부볼·이중턱 지방은 줄이고 처진 윤곽선은 강력하게 고정", orig: "1,500,000원", price: "990,000원" },
      { badge: "가성비 리프팅", title: "인모드 FX + FORMA 풀페이스", desc: "지방세포 사멸(FX)과 진피 콜라겐 타이트닝(FORMA) 2단계 동시 시술", orig: "250,000원", price: "129,000원" },
      { badge: "빈틈없는 탄력", title: "슈링크 유니버스 300샷 (울트라+부스터)", desc: "펜 타입 부스터 팁과 닷/리니어 모드로 굴곡진 눈가·팔자까지 밀착 리프팅", orig: "220,000원", price: "119,000원" },
      { badge: "고주파 타이트닝", title: " 볼뉴머 400샷", desc: "한국인 피부에 맞춘 RF 고주파로 잔주름 개선 및 쫀쫀한 피부 밀도 완성", orig: "800,000원", price: "590,000원" },
      { badge: "효과가 바로 나타나는 리프팅", title: "엑셀웨이브 풀페이스 8만줄", desc: "2.45GHz 극초단파 리프팅", orig: "450,000원", price: "290,000원" }
    ],
    petit: [
      { badge: "내성 걱정 ZERO", title: "독일 제오민 주름/사각턱 보톡스", desc: "복합단백질을 제거하여 반복 시술에도 내성 우려가 적은 프리미엄 톡신", orig: "120,000원", price: "69,000원" },
      { badge: "정량 보톡스", title: "국산 정품 사각턱 보톡스 50U", desc: "정품 개봉 및 정량 희석 원칙 준수 · 갸름한 V라인 턱선 정리", orig: "50,000원", price: "25,000원" },
      { badge: "이중턱 지방파괴", title: "브이올렛 (V-Olet) 이중턱 주사 1병", desc: "식약처 허가 데옥시콜산 성분으로 지방세포막을 직접 파괴하는 반영구 윤곽술", orig: "350,000원", price: "230,000원" },
      { badge: "커스텀 볼륨", title: "수입 벨로테로 / 레스틸렌 필러 1cc", desc: "이물감과 형광 현상 없이 피부 조직에 자연스럽게 밀착되는 하이엔드 필러", orig: "350,000원", price: "240,000원" },
      { badge: "바디 보톡스", title: "승모근 / 종아리 바디 보톡스 100U", desc: "결리고 뭉친 승모근 통증 완화와 매끈한 목·어깨·다리 라인 완성", orig: "150,000원", price: "79,000원" },
      { badge: "얼굴 소멸", title: "스테로이드 없는 조각 윤곽주사 3회", desc: "부정출혈이나 볼패임 걱정 없는 안전한 성분 배합으로 심부볼·이중턱 정리", orig: "180,000원", price: "99,000원" }
    ]
  };

  // Before & After Data
  const BA_DATA: Record<string, BaItem[]> = {
    lifting: [
      { title: "울쎄라 400샷 + 쥬베룩 볼륨 1병", period: "시술 후 8주 경과", desc: "처진 심부볼과 무너진 턱선 라인을 정돈하고 꺼진 앞볼에 자연스러운 자가 콜라겐 볼륨을 회복한 케이스입니다.", beforeMetric: "시술 전: 하안면 처짐 및 팔자 꺼짐", afterMetric: "시술 후: SMAS층 견인 및 앞볼 볼륨 개선" },
      { title: "인모드 FX + FORMA 3회", period: "3회차 시술 후 4주 경과", desc: "이중턱 부위의 불필요한 지방층을 감소시키고 피부 표면 탄력을 타이트닝하여 날렵한 옆선을 완성했습니다.", beforeMetric: "시술 전: 이중턱 지방 축적", afterMetric: "시술 후: 턱밑 윤곽선 명확화" }
    ],
    melasma: [
      { title: "피코슈어 755nm + 레블라이트SI 복합 토닝 10회", period: "시술 후 12주 경과", desc: "양 볼에 넓게 퍼진 혼합형 난치성 기미와 잡티를 열 손상 없이 안전하게 분해하여 전체 피부 톤을 밝힌 사례입니다.", beforeMetric: "시술 전: 진피성 기미 및 불균일한 톤", afterMetric: "시술 후: 멜라닌 지수 62% 감소" },
      { title: "피코슈어 흑자(검버섯) 원데이 제거", period: "시술 후 3주 경과", desc: "일반 레이저 토닝으로 지워지지 않던 광대 부위 흑자를 피코슈어 755nm 스팟 조사로 1회 시술 만에 깨끗하게 제거했습니다.", beforeMetric: "시술 전: 짙은 갈색 흑자 병변", afterMetric: "시술 후: 흉터 없이 정상 피부톤 회복" }
    ],
    filler: [
      { title: "벨로테로 팔자주름 + 앞볼 커스텀 필러 2cc", period: "시술 직후 및 2주 경과", desc: "과하게 부풀어 오르는 느낌 없이 코 옆 꺼진 삼각존(귀족 부위)을 자연스럽게 채워 인상을 부드럽게 개선했습니다.", beforeMetric: "시술 전: 깊은 팔자 고랑", afterMetric: "시술 후: 이물감 없는 자연스러운 윤곽" },
      { title: "입술 디자인 필러 + 입꼬리 보톡스", period: "시술 후 1주 경과", desc: "말려 들어가고 비대칭이던 윗입술 라인에 입체감을 부여하고 자연스럽게 올라간 입꼬리를 디자인했습니다.", beforeMetric: "시술 전: 얇고 비대칭인 입술", afterMetric: "시술 후: 볼륨 및 입꼬리 대칭 개선" }
    ],
    acne: [
      { title: "피코슈어 프락셀 + 포텐자 쥬베룩 3회", period: "시술 후 10주 경과", desc: "나비존(볼·코 옆)의 늘어진 세로 모공과 패인 여드름 롤링성 흉터를 진피 재생 유도로 촘촘하게 메운 케이스입니다.", beforeMetric: "시술 전: 확장된 모공 및 요철", afterMetric: "시술 후: 모공 면적 축소 및 피부결 매끈화" },
      { title: "젠틀맥스 프로+ 혈관/홍조 모드 + LDM 5회", period: "시술 후 6주 경과", desc: "만성적인 양 볼 안면홍조와 여드름 붉은 자국을 개선하고 얇아진 피부 장벽을 튼튼하게 복원했습니다.", beforeMetric: "시술 전: 여드름 홍반 및 모세혈관 확장", afterMetric: "시술 후: 붉은기 진정 및 장벽 강화" }
    ],
    hair: [
      { title: "젠틀맥스 프로 플러스 남성 수염 전체 5회", period: "5회 시술 완료 후 4주 경과", desc: "매일 아침 면도 독(모낭염)과 푸른 수염 자국으로 스트레스받던 남성 환자분의 인중·턱·목 수염을 90% 이상 반영구 제거했습니다.", beforeMetric: "시술 전: 굵고 빽빽한 수염 및 모낭염", afterMetric: "시술 후: 푸른 자국 소실 및 매끈한 턱선" },
      { title: "젠틀맥스 프로 플러스 여성 종아리/겨드랑이 5회", period: "5회 시술 완료 후", desc: "26mm 대구경 스팟과 DCD 냉각 시스템으로 통증 없이 모공 각화증과 체모를 동시에 깔끔하게 정리했습니다.", beforeMetric: "시술 전: 잦은 면도로 인한 색소침착", afterMetric: "시술 후: 체모 제거 및 피부결 개선" }
    ],
    tattoo: [
      { title: "피코슈어 눈썹 반영구 문신 잔흔 제거 3회", period: "3회 시술 후 6주 경과", desc: "오래되어 붉고 푸르게 변색된 눈썹 문신 색소를 눈썹 모근 손상 없이 깨끗하게 지워낸 케이스입니다.", beforeMetric: "시술 전: 비대칭 붉은/푸른 잔흔", afterMetric: "시술 후: 눈썹 털 손상 없이 색소 제거" },
      { title: "피코슈어 팔목 레터링 & 컬러 타투 제거 5회", period: "5회 시술 후", desc: "나노 레이저로 지워지지 않던 미세 잉크 입자를 피코초 단위로 잘게 쪼개어 흉터 없이 배출시켰습니다.", beforeMetric: "시술 전: 짙은 블랙 및 컬러 타투", afterMetric: "시술 후: 정상 피부 조직 복원" }
    ]
  };

  // Guide Data
  const GUIDE_DATA: Record<string, GuideItem> = {
    toning: {
      title: "01. 레이저토닝 / 잡티제거 시술안내 및 주의사항",
      subtitle: "레블라이트 SI · 피코토닝 · 흑자/잡티 레이저",
      time: "약 15~20분",
      anesthesia: "무마취 또는 연고마취",
      cycle: "1~2주 간격 5~10회 권장",
      downtime: "일상생활 즉시 가능 (잡티제거 시 7~10일 딱지/듀오덤)",
      precautions: [
        "시술 당일 세안과 가벼운 화장은 가능하나, 스크럽제나 필링 제품 사용은 1주일간 피해 주세요.",
        "기미·색소 치료 중에는 외출 시 자외선 차단제(SPF 50+)를 3~4시간 간격으로 꼼꼼히 덧발라 주셔야 색소 침착을 예방할 수 있습니다.",
        "흑자나 잡티 제거 후 생긴 얇은 딱지는 억지로 떼어내지 마시고 자연 탈락될 때까지 보습제나 재생테이프(듀오덤)를 유지해 주세요.",
        "시술 후 약 1주일간 사우나, 찜질방, 격한 운동, 음주 등 피부에 열감을 주는 활동은 삼가 주세요."
      ]
    },
    picosure: {
      title: "02. 피코슈어 피코프락셀 시술안내 및 주의사항",
      subtitle: "755nm 포커스 렌즈 모공 · 흉터 · 피부결 리모델링",
      time: "약 20~30분",
      anesthesia: "마취크림 도포 (30분)",
      cycle: "3~4주 간격 3~5회 권장",
      downtime: "붉은기 및 열감 1~3일 지속 (각질 탈락 없음)",
      precautions: [
        "피코슈어 프락셀은 표피를 깎지 않고 진피층에만 미세 공기방울(LIOB)을 만들어 콜라겐을 재생하므로 진물이나 딱지가 거의 생기지 않습니다.",
        "시술 직후 얼굴이 붉어지고 화끈거릴 수 있으며 보통 2~3일 내에 자연스럽게 가라앉습니다.",
        "시술 후 피부가 일시적으로 건조해질 수 있으므로 수분·재생 크림을 평소보다 2배 이상 충분히 발라주세요.",
        "레티놀, 비타민C 고함량 앰플, AHA/BHA 성분 화장품은 붉은기가 완전히 가라앉은 뒤 사용해 주세요."
      ]
    },
    lifting: {
      title: "03. 리프팅 (울쎄라 / 인모드 / 슈링크 / 올리지오) 주의사항",
      subtitle: "초음파(HIFU) 및 고주파(RF) 안티에이징 리프팅",
      time: "약 30~50분",
      anesthesia: "마취크림 도포",
      cycle: "울쎄라·올리지오 6~12개월 / 인모드·슈링크 1~3개월",
      downtime: "즉시 일상 복귀 (인모드 FX는 3~7일 부항 자국 발생 가능)",
      precautions: [
        "리프팅 시술 후 진피 내 콜라겐 재생을 위해 차가운 얼음찜질은 피해주시고, 미온수로 세안해 주세요.",
        "울쎄라·슈링크 시술 후 턱선이나 광대 부위에 뻐근함, 욱신거림, 미세한 부기가 1~2주간 느껴질 수 있으며 이는 정상적인 근막 수축 과정입니다.",
        "인모드 FX 모드는 음압으로 지방층을 당겨 고주파를 조사하므로 붉은 멍(부항 자국)이 3~7일 정도 남을 수 있습니다.",
        "시술 후 2주간은 경락 마사지나 얼굴을 강하게 문지르는 행동을 피해 주세요."
      ]
    },
    hair: {
      title: "04. 레이저 제모 (젠틀맥스 프로 플러스) 주의사항",
      subtitle: "755nm / 1064nm 비접촉식 냉각 프리미엄 레이저 제모",
      time: "약 5~20분",
      anesthesia: "부위별 마취크림 (남성수염 등)",
      cycle: "4~5주 간격 5회 이상 권장",
      downtime: "모낭 주위 일시적 붉은기 (1~2일 내 소실)",
      precautions: [
        "시술 1~2일 전 제모할 부위의 털을 면도기로 깔끔하게 면도하고 내원해 주세요. (족집게로 뽑거나 왁싱을 하시면 레이저 타깃인 모근이 사라져 시술이 불가합니다.)",
        "선탠을 하셨거나 피부가 검게 탄 경우 화상 위험이 있으므로 시술 전후 자외선 노출을 피해주세요.",
        "시술 직후 모낭 주변이 모기 물린 것처럼 살짝 붉게 올라올 수 있으며(모낭염 예방 연고 처방 가능), 1~2일 내 자연 소실됩니다.",
        "시술 후 1~2주 동안 죽은 털이 서서히 밀려 나오며 빠지게 됩니다."
      ]
    },
    booster: {
      title: "05. 스킨부스터 (리쥬란 힐러 / 쥬베룩 / 물광) 주의사항",
      subtitle: "진피층 직접 주사 및 포텐자 펌핑 스킨부스터",
      time: "약 30~40분",
      anesthesia: "마취크림 + 통증완화 시스템",
      cycle: "3~4주 간격 3회 이상 권장",
      downtime: "엠보싱(올록볼록한 자국) 1~3일, 미세 바늘멍 가능",
      precautions: [
        "주사 시술 특성상 피부 표면에 올록볼록한 엠보싱 자국이 생기며, 24~72시간 내에 진피로 흡수되면서 사라집니다.",
        "시술 당일 세안과 메이크업은 감염 예방을 위해 피해주시고, 다음 날 아침부터 가벼운 세안과 화장이 가능합니다.",
        "엠보싱 부위를 손으로 누르거나 문지르지 마시고, 시술 후 1주일간 금주·금연 및 사우나를 피해 주세요."
      ]
    },
    botox: {
      title: "06. 보톡스 / 윤곽주사 (브이올렛) 주의사항",
      subtitle: "주름·사각턱·바디 보톡스 및 이중턱 지방파괴술",
      time: "약 5~15분",
      anesthesia: "아이스 쿨링 또는 연고마취",
      cycle: "보톡스 3~6개월 / 브이올렛 4주 간격 2~3회",
      downtime: "일상생활 즉시 가능 (브이올렛은 붓기 3~7일)",
      precautions: [
        "보톡스 시술 후 약물이 주변 근육으로 퍼지지 않도록 시술 후 4시간 동안은 눕지 마시고, 주사 부위를 문지르지 마세요.",
        "사각턱 보톡스 후 딱딱하거나 질긴 음식(오징어, 껌 등)을 자주 씹으시면 근육이 다시 발달할 수 있으니 줄여주세요.",
        "브이올렛(이중턱 지방파괴 주사)은 지방세포가 분해되는 과정에서 붓기와 뻐근함, 멍울 느낌이 1~2주간 지속된 후 턱선이 서서히 갸름해집니다."
      ]
    },
    filler: {
      title: "07. 필러 / 실리프팅 / 쥬베룩 볼륨 주의사항",
      subtitle: "자연스러운 볼륨 채움 및 윤곽 고정 시술",
      time: "약 20~40분",
      anesthesia: "국소마취 및 연고마취",
      cycle: "유지기간 1년~2년 내외",
      downtime: "부기 및 멍 3~7일 가능",
      precautions: [
        "필러 및 실리프팅 후 모양이 안정적으로 자리 잡을 때까지 2주간은 시술 부위를 강하게 압박하거나 엎드려 주무시는 것을 피해 주세요.",
        "쥬베룩 볼륨은 시술 직후 수분이 흡수되며 일시적으로 볼륨이 빠져 보이다가, 4~6주 후부터 자가 콜라겐이 차오르며 자연스러운 볼륨이 완성됩니다.",
        "시술 후 처방해 드리는 항생제·소염제가 있을 경우 안내된 복용법에 맞춰 규칙적으로 복용해 주세요.",
        "만약 시술 부위가 심하게 창백해지거나 통증이 점점 심해지고 열감이 느껴질 경우 즉시 병원으로 연락해 주시기 바랍니다."
      ]
    },
    mole: {
      title: "08. 점 / 사마귀 / 쥐젖 / 비립종 / 편평사마귀 제거 주의사항",
      subtitle: "CO2 레이저 및 어븀야그 정밀 제거술",
      time: "약 10~20분",
      anesthesia: "마취크림 도포",
      cycle: "깊은 점은 4~6주 후 2차 리터치 권장",
      downtime: "재생테이프(듀오덤) 7~10일간 부착",
      precautions: [
        "흉터를 남기지 않기 위해 뿌리가 깊은 점은 한 번에 무리하게 파내지 않고 1~2달 간격으로 나누어 제거하는 것이 안전합니다.",
        "시술 부위에 붙여드린 재생테이프(듀오덤)는 진물이 하얗게 부풀어 올라 테이프 밖으로 새어 나올 때만 교체해 주시고, 최소 7~10일간 유지해 주세요.",
        "새살이 붉게 차오른 후에는 자외선 차단제를 꼭 발라주셔야 색소 침착을 막을 수 있습니다."
      ]
    },
    diet: {
      title: "09. 다이어트 / 체형관리 주사 및 처방 주의사항",
      subtitle: "삭센다 · 위고비 · 바디 인모드 · 지방분해주사",
      time: "약 15~30분",
      anesthesia: "아이스 쿨링",
      cycle: "주 1~2회 또는 개인별 맞춤 프로그램",
      downtime: "일상생활 즉시 가능",
      precautions: [
        "지방분해주사 및 바디 리프팅 시술 후에는 분해된 지방산이 림프관을 통해 원활히 배출되도록 하루 1.5~2L 이상의 충분한 수분을 섭취해 주세요.",
        "가벼운 유산소 운동과 식단 조절을 병행하시면 시술 시너지가 극대화됩니다.",
        "비만 치료제 처방 및 자가 주사제의 경우 대표원장님과 상의한 용량 스케줄을 정확히 지켜 투여해 주세요."
      ]
    }
  };

  // Dr. Column Data
  const COLUMN_DATA: ColumnItem[] = [
    {
      tag: "레이저 제모 칼럼",
      title: "젠틀맥스 프로 플러스, 일반 레이저 제모와 무엇이 결정적으로 다를까?",
      preview: "5회 이상 제모를 받았는데도 수염이나 잔털이 그대로 남는 이유, 레이저 파장의 도달 깊이와 스팟 사이즈의 차이를 명쾌하게 설명해 드립니다.",
      paragraphs: [
        "안녕하세요, 서울뷰의원 당진점 대표원장입니다. 진료실에서 레이저 제모 상담을 하다 보면 “타 병원에서 5회, 10회 패키지를 다 받았는데도 수염이 그대로 나요”라고 토로하시는 환자분들을 정말 자주 뵙습니다.",
        "레이저 제모의 성패를 가르는 핵심은 ① 파장의 멜라닌 흡수율, ② 모낭 깊이까지 도달하는 스팟 사이즈, ③ 표피를 보호하는 냉각 시스템 이 세 가지입니다.",
        "저희 서울뷰의원 당진점에 도입한 미국 칸델라사의 최신 플래그십 장비 ‘젠틀맥스 프로 플러스(GentleMax Pro Plus)’는 기존 젠틀맥스 프로 대비 최대 출력이 38% 향상되었고, 스팟 사이즈가 무려 26mm까지 확대되었습니다. 스팟 크기가 클수록 레이저 빔이 피부 진피층에서 산란되지 않고 깊숙한 남성 수염 모근까지 수직으로 도달합니다.",
        "또한 2ms(밀리초)의 짧은 펄스 폭을 지원해 기존 레이저가 놓치기 쉬웠던 얇은 여성 인중 솜털이나 잔털까지 정교하게 타깃합니다. 남·여 분리된 1인 전용 프라이빗 제모실에서 위생적인 비접촉식 DCD 냉각 가스로 통증 걱정 없이 편안한 제모를 경험해 보시기 바랍니다."
      ]
    },
    {
      tag: "기미·흑자·색소 칼럼",
      title: "기미와 흑자(검버섯)를 구분하지 않고 레이저를 쏘면 생기는 일",
      preview: "겉보기엔 비슷한 갈색 반점이지만 기미와 흑자는 치료 파라미터가 정반대입니다. 755nm 피코슈어와 1064nm 레블라이트 병행 치료의 핵심 원리.",
      paragraphs: [
        "30~50대 여성 환자분들이 가장 많이 고민하시는 질환이 바로 양 볼과 광대에 올라오는 갈색 색소입니다. 많은 분들이 이를 모두 ‘기미’라고 생각하시지만, 실제로는 기미, 일광흑자(검버섯), 주근깨, 오타양모반이 복합적으로 섞여 있는 경우가 대부분입니다.",
        "문제는 기미와 흑자의 치료 에너지가 완전히 다르다는 점입니다. 흑자는 멜라닌 세포가 뭉쳐 있는 표피 병변이므로 755nm 피코슈어 레이저로 타깃하여 한두 번에 또렷하게 파괴해야 잘 지워집니다. 반면, 기미는 자극에 매우 예민한 색소 질환이라 강한 에너지를 조사하면 오히려 더 시커멓게 올라오는 부작용이 발생합니다.",
        "따라서 서울뷰의원 당진점은 시술 전 마크뷰 피부진단기를 통해 색소의 종류와 깊이를 먼저 분류하고, 흑자에는 피코슈어(755nm)를, 깊은 진피 기미에는 레블라이트 SI(1064nm PTP)를 조합하는 맞춤형 파장 치료를 원칙으로 합니다."
      ]
    },
    {
      tag: "스킨부스터·리프팅 칼럼",
      title: "리쥬란 힐러 vs 쥬베룩 스킨/볼륨, 내 피부에 꼭 맞는 선택 기준은?",
      preview: "속건조와 얇아진 피부 장벽이 고민일 때와 모공·패인 볼살이 고민일 때 선택해야 할 스킨부스터는 다릅니다. 실패 없는 스킨부스터 가이드.",
      paragraphs: [
        "스킨부스터의 대명사인 ‘리쥬란 힐러’와 ‘쥬베룩’ 중 어떤 시술을 받아야 할지 고민하시는 분들을 위해 명확한 선택 기준을 정리해 드립니다.",
        "1. 리쥬란 힐러 (PN 성분): 세안 후 얼굴이 쉽게 당기고, 피부가 얇고 예민해 홍조나 잔주름이 잘 생기는 분께 가장 추천합니다. 손상된 진피 환경을 재생시키고 유수분 밸런스를 즉각적으로 회복시켜 줍니다.",
        "2. 쥬베룩 스킨 & 볼륨 (PDLLA + HA): 모공이 세로로 늘어져 있거나 여드름 흉터 요철이 고민이시라면 ‘쥬베룩 스킨’이 적합하며, 나이가 들면서 앞볼이나 팔자주름, 옆볼이 푹 꺼져 보이는데 필러는 부담스러우신 분께는 자가 콜라겐을 채워주는 ‘쥬베룩 볼륨’이 최상의 선택이 됩니다.",
        "서울뷰의원 당진점에서는 환자분의 피부 두께와 고민에 맞춰 두 약제를 부위별로 하이브리드 디자인하여 시술하고 있습니다."
      ]
    }
  ];



  // Filtered Price Table
  const filteredPrices = useMemo(() => {
    const q = priceSearch.trim().toLowerCase();
    if (q) {
      return priceList.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q)
      );
    }
    return priceList.filter((item) => item.cat === priceCat);
  }, [priceList, priceCat, priceSearch]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenBooking = (itemName: string) => {
    setSelectedBookingItem(itemName || '1:1 맞춤 진료 상담');
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingModalOpen(false);
    showToast(`[예약 접수 완료] ${bookingForm.name || '고객'}님, '${selectedBookingItem}' 예약 신청이 접수되었습니다.`);
    setBookingForm({ name: '', phone: '', date: '', time: '오후 (14:00 ~ 18:00)' });
  };

  const copyAddress = () => {
    const addr = "충청남도 당진시 시청1로 서울뷰타워 4층 서울뷰의원 당진점";
    navigator.clipboard?.writeText(addr);
    showToast("병원 주소가 클립보드에 복사되었습니다.");
  };

  const addQuickPrice = () => {
    if (!quickTitle || !quickOnce) {
      showToast("시술명과 1회 가격을 입력해 주세요.");
      return;
    }
    setPriceList((prev) => [
      {
        cat: priceCat,
        group: "신규 등록",
        name: quickTitle,
        once: quickOnce,
        multi: "원내 문의"
      },
      ...prev
    ]);
    setAdminModalOpen(false);
    setQuickTitle('');
    setQuickOnce('');
    showToast(`'${quickTitle}' 항목이 비급여 수가표에 즉시 추가되었습니다.`);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  if (currentPage === 'event') {
    return (
      <EventPage
        onNavigateHome={(sec) => navigateTo('home', sec)}
        onNavigateToPrices={() => navigateTo('prices')}
        onNavigateToColumn={() => navigateTo('column')}
      />
    );
  }

  if (currentPage === 'prices') {
    return (
      <PricePage
        onNavigateHome={(sec) => navigateTo('home', sec)}
        onNavigateEvent={() => navigateTo('event')}
        onNavigateColumn={() => navigateTo('column')}
        onOpenBooking={handleOpenBooking}
      />
    );
  }

  if (currentPage === 'column') {
    return (
      <ColumnPage
        initialArticleId={selectedColumnArticleId}
        onNavigateHome={(sec) => navigateTo('home', sec)}
        onNavigateToPrices={() => navigateTo('prices')}
        onNavigateToEvent={() => navigateTo('event')}
        onOpenBooking={handleOpenBooking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] selection:bg-[#0F2B22] selection:text-white">


      {/* ================= MAIN HEADER & NAVIGATION ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo - Updated with user's attached image */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group shrink-0"
          >
            <img
              src={LOGO_SRC}
              alt="꽃을보듯너를 서울뷰의원 당진"
              className="h-10 sm:h-12 w-auto object-contain transition group-hover:opacity-95"
            />
          </a>

          {/* Desktop Navigation (7 Core Menus) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {/* 1. 서울뷰의원 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <a
                href="#sec-about"
                onClick={(e) => { e.preventDefault(); scrollToSection('sec-about'); }}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1"
              >
                서울뷰의원 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </a>
              <div className="nav-dropdown absolute left-0 top-full w-48 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => { scrollToSection('sec-about'); setAboutTab('brand'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  서울뷰의원 당진
                </button>
                <button
                  onClick={() => { scrollToSection('sec-about'); setAboutTab('devices'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  장비 소개
                </button>
                <button
                  onClick={() => { scrollToSection('sec-about'); setAboutTab('facility'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  시설 소개
                </button>
              </div>
            </div>

            {/* 2. 이벤트 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => navigateTo('event')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                이벤트 <span className="w-1.5 h-1.5 rounded-full bg-red-500 mb-2"></span>
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => navigateTo('event')}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0F2B22] hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between"
                >
                  <span>10월 이벤트</span>
                  <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
                <button
                  onClick={() => navigateTo('prices')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer flex items-center justify-between"
                >
                  <span>상세 비급여 수가표</span>
                  <span className="text-[10px] bg-[#C5A880]/30 text-[#85734F] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
              </div>
            </div>

            {/* 4. 시술 전후사진 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <a
                href="#sec-ba"
                onClick={(e) => { e.preventDefault(); scrollToSection('sec-ba'); }}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1"
              >
                시술 전후사진 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </a>
              <div className="nav-dropdown absolute left-0 top-full w-60 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => { scrollToSection('sec-ba'); setBaCat('lifting'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  쥬베룩 / 리프팅
                </button>
                <button
                  onClick={() => { scrollToSection('sec-ba'); setBaCat('melasma'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  기미 / 난치성색소
                </button>
                <button
                  onClick={() => { scrollToSection('sec-ba'); setBaCat('filler'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  필러
                </button>
                <button
                  onClick={() => { scrollToSection('sec-ba'); setBaCat('acne'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  여드름 / 모공, 흉터 / 홍조
                </button>
                <button
                  onClick={() => { scrollToSection('sec-ba'); setBaCat('hair'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  레이저 제모
                </button>
                <button
                  onClick={() => { scrollToSection('sec-ba'); setBaCat('tattoo'); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  문신제거
                </button>
              </div>
            </div>

            {/* 5. 시술안내 및 주의사항 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <a
                href="#sec-guide"
                onClick={(e) => { e.preventDefault(); scrollToSection('sec-guide'); }}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1"
              >
                시술안내 및 주의사항 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </a>
              <div className="nav-dropdown absolute left-0 top-full w-64 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('toning'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  레이저토닝 / 잡티제거
                </button>
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('picosure'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  피코슈어 피코프락셀
                </button>
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('lifting'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  리프팅
                </button>
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('hair'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  제모
                </button>
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('booster'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  스킨부스터
                </button>
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('botox'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  보톡스 / 윤곽주사
                </button>
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('filler'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  필러 / 실리프팅 / 쥬베룩 볼륨
                </button>
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('mole'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  점 / 사마귀 / 쥐젖제거
                </button>
                <button
                  onClick={() => { scrollToSection('sec-guide'); setGuideCat('diet'); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  다이어트
                </button>
              </div>
            </div>

            {/* 6. 원장 칼럼 */}
            <div className="relative nav-item py-6 px-3.5 cursor-pointer">
              <button
                onClick={() => navigateTo('column')}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition flex items-center gap-1 cursor-pointer"
              >
                원장 칼럼 <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              <div className="nav-dropdown absolute left-0 top-full w-56 bg-white border border-[#E5E5E8] shadow-md rounded-b-md py-2 z-50">
                <button
                  onClick={() => navigateTo('column')}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0F2B22] hover:bg-[#F7F7F8] transition cursor-pointer flex items-center justify-between"
                >
                  <span>원장칼럼 전문 페이지</span>
                  <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                </button>
                <button
                  onClick={() => scrollToSection('sec-column')}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#0F2B22] transition cursor-pointer"
                >
                  메인 요약 칼럼 바로가기
                </button>
              </div>
            </div>

            {/* 7. 오시는 길 */}
            <div className="py-6 px-3.5">
              <a
                href="#sec-location"
                onClick={(e) => { e.preventDefault(); scrollToSection('sec-location'); }}
                className="text-[15px] font-semibold text-[#111111] hover:text-[#A6895E] transition"
              >
                오시는 길
              </a>
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
              <div className="p-5 bg-[#0F2B22] text-white flex items-center justify-between">
                <div>
                  <img
                    src={LOGO_SRC}
                    alt="꽃을보듯너를 서울뷰의원 당진"
                    className="h-9 w-auto object-contain mb-1 filter drop-shadow-sm"
                  />
                  <p className="text-xs text-zinc-300">서울뷰의원 당진점 모바일 메뉴</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="divide-y divide-[#E5E5E8] text-sm">
                <div className="p-4">
                  <p className="font-bold text-[#0F2B22] mb-2">01. 서울뷰의원</p>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-zinc-600">
                    <button
                      onClick={() => { scrollToSection('sec-about'); setAboutTab('brand'); }}
                      className="text-left py-1.5 px-2 rounded bg-[#F7F7F8]"
                    >
                      서울뷰의원 당진
                    </button>
                    <button
                      onClick={() => { scrollToSection('sec-about'); setAboutTab('devices'); }}
                      className="text-left py-1.5 px-2 rounded bg-[#F7F7F8]"
                    >
                      장비 소개
                    </button>
                    <button
                      onClick={() => { scrollToSection('sec-about'); setAboutTab('facility'); }}
                      className="text-left py-1.5 px-2 rounded bg-[#F7F7F8]"
                    >
                      시설 소개
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <p className="font-bold text-[#0F2B22] mb-2 flex items-center justify-between">
                    <span>02. 이벤트 & 비급여 수가 안내</span>
                    <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-2 py-0.5 rounded font-bold">PAGE</span>
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-xs text-zinc-600">
                    <button
                      onClick={() => { navigateTo('event'); setMobileMenuOpen(false); }}
                      className="text-left py-2.5 px-3 rounded-lg bg-[#0F2B22] font-semibold text-[#C5A880] flex items-center justify-between shadow-xs"
                    >
                      <span>★ 이벤트 전용 페이지 바로가기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { navigateTo('prices'); setMobileMenuOpen(false); }}
                      className="text-left py-2.5 px-3 rounded-lg bg-[#FAF8F5] border border-[#C5A880]/50 font-semibold text-[#0F2B22] flex items-center justify-between hover:bg-[#F2ECE4]"
                    >
                      <span>★ 상세 비급여 수가표 전용 페이지</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <button
                    onClick={() => scrollToSection('sec-ba')}
                    className="w-full text-left font-bold text-[#111111] py-1 flex justify-between items-center"
                  >
                    <span>04. 시술 전후사진</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>
                  <button
                    onClick={() => scrollToSection('sec-guide')}
                    className="w-full text-left font-bold text-[#111111] py-1 flex justify-between items-center"
                  >
                    <span>05. 시술안내 및 주의사항</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>
                  <div className="py-1">
                    <button
                      onClick={() => { navigateTo('column'); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2 px-3 rounded-lg bg-[#FAF8F5] border border-[#C5A880]/40 font-bold text-[#0F2B22] flex items-center justify-between hover:bg-[#F2ECE4]"
                    >
                      <span>06. 원장칼럼 전용 페이지</span>
                      <span className="text-[10px] bg-[#0F2B22] text-[#C5A880] px-1.5 py-0.5 rounded font-bold">PAGE</span>
                    </button>
                  </div>
                  <button
                    onClick={() => scrollToSection('sec-location')}
                    className="w-full text-left font-bold text-[#111111] py-1 flex justify-between items-center"
                  >
                    <span>07. 오시는 길 & 진료시간</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F7F7F8] border-t border-[#E5E5E8]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenBooking('모바일 빠른 예약 신청');
                }}
                className="w-full bg-[#0F2B22] text-white py-3 rounded font-semibold text-xs tracking-wider"
              >
                네이버 / 원내 빠른 예약 신청
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ================= RIGHT FLOATING QUICK BAR ================= */}
      <aside className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col bg-white border border-[#E5E5E8] rounded-xl shadow-md overflow-hidden divide-y divide-[#E5E5E8] w-20 text-center">
        <button
          onClick={() => handleOpenBooking('우측 퀵바 빠른 예약')}
          className="py-3.5 px-2 bg-[#0F2B22] text-white hover:bg-[#173F32] transition flex flex-col items-center justify-center group cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-[#C5A880] mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-bold">예약</span>
        </button>
        <button
          onClick={() => navigateTo('event')}
          className="py-3.5 px-2 hover:bg-[#C5A880]/15 transition flex flex-col items-center justify-center text-[#111111] cursor-pointer group"
        >
          <Sparkles className="w-5 h-5 text-[#A6895E] mb-1 group-hover:scale-110 transition" />
          <span className="text-[11px] font-bold text-[#0F2B22]">이벤트</span>
        </button>
        <button
          onClick={() => scrollToSection('sec-column')}
          className="py-3.5 px-2 hover:bg-[#F7F7F8] transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <span className="font-en-cond font-bold text-xs text-[#03C75A] mb-0.5">BLOG</span>
          <span className="text-[11px] font-medium text-zinc-700">원장칼럼</span>
        </button>
        <button
          onClick={() => {
            handleOpenBooking('카카오톡 채널 상담 문의');
            showToast("카카오톡 실시간 상담 신청 창으로 연결되었습니다.");
          }}
          className="py-3.5 px-2 hover:bg-[#FEE500]/20 transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#3C1E1E] fill-[#FEE500] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">카톡상담</span>
        </button>
        <button
          onClick={() => scrollToSection('sec-ba')}
          className="py-3.5 px-2 hover:bg-[#F7F7F8] transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <Instagram className="w-5 h-5 text-pink-600 mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">전후사진</span>
        </button>
        <button
          onClick={() => scrollToSection('sec-location')}
          className="py-3.5 px-2 hover:bg-[#F7F7F8] transition flex flex-col items-center justify-center text-[#111111] cursor-pointer"
        >
          <MapPin className="w-5 h-5 text-[#0F2B22] mb-1" />
          <span className="text-[11px] font-medium text-zinc-700">오시는길</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="py-2.5 bg-[#F7F7F8] text-zinc-500 hover:text-[#111111] text-[10px] font-en-cond tracking-widest flex flex-col items-center cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          TOP
        </button>
      </aside>

      {/* ================= MAIN HERO (멀티탭: 1번 영상 단독 뷰, 2번 엑셀웨이브 런칭 소개) ================= */}
      <section className="relative bg-[#071510] text-white overflow-hidden min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center">
        {/* Background Video Element */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={heroVideoRef}
            src={MAIN_VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center scale-100"
          />
          {/* If video tab, minimal overlay so video is completely clean; if excelwave tab, luxury dark overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              heroTab === 'video'
                ? 'bg-gradient-to-t from-black/60 via-transparent to-black/20'
                : 'bg-gradient-to-r from-[#071510]/95 via-[#0E241C]/85 to-[#071510]/80 backdrop-blur-[1px]'
            }`}
          />
          <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>
        </div>

        {/* TAB 1: Only Background Video is visible, no text content! */}
        {heroTab === 'video' && (
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 pointer-events-none">
            {/* Intentionally blank per user request: "첫 화면에는 배경에 깔린 영상만 보이게 하는거야 위에 아무 내용없이." */}
          </div>
        )}

        {/* TAB 2: Original Content + Excelwave Machine Image on the Right */}
        {heroTab === 'excelwave' && (
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 sm:py-24 animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Text Content */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 border border-[#C5A880]/50 bg-[#0F2B22]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-ping"></span>
                  <span className="font-en-cond text-xs tracking-[0.2em] text-[#C5A880] font-bold">
                    NEW LAUNCH · 2.45GHz EXCELWAVE
                  </span>
                </div>
                <div>
                  <p className="font-en-serif italic text-[#C5A880] text-lg sm:text-xl mb-1.5 tracking-wide">
                    “꽃을 보듯, 당신의 가장 자연스러운 아름다움을 피워냅니다”
                  </p>
                  <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-bold leading-[1.18] tracking-tight">
                    2.45GHz 극초단파 리프팅<br />
                    <span className="text-[#C5A880]">엑셀웨이브(Excelwave)</span> 신규 도입
                  </h1>
                </div>
                <p className="text-zinc-200 text-sm sm:text-base max-w-xl leading-relaxed font-light">
                  강력한 쿨링으로 피부 표면은 안전하게 보호하고, 2.45GHz 마이크로웨이브로 깊은 층을 따뜻하게 자극합니다. 처진 탄력과 무너진 윤곽, 거친 피부결을 한 번에 매끄럽게 정돈해 주는 비수술 리프팅 솔루션입니다.
                </p>
                <div className="pt-3 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleOpenBooking('엑셀웨이브 런칭 특가 상담')}
                    className="bg-[#C5A880] hover:bg-[#A6895E] text-[#111111] font-bold px-7 py-3.5 rounded-lg text-sm transition-all shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <CalendarCheck className="w-4 h-4 text-[#111111]" />
                    <span>엑셀웨이브 런칭 특가 상담</span>
                  </button>
                  <button
                    onClick={() => navigateTo('event')}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3.5 rounded-lg text-sm transition-all backdrop-blur-xs cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                    <span>이달의 이벤트 전용 페이지로 이동</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Excelwave Device Image */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                <div className="relative group max-w-xs sm:max-w-sm">
                  {/* Subtle radial aura behind the machine */}
                  <div className="absolute inset-0 bg-radial from-[#C5A880]/30 via-[#0F2B22]/20 to-transparent blur-xl rounded-full scale-110 pointer-events-none"></div>
                  
                  <img
                    src={EXCELWAVE_DEVICE_SRC}
                    alt="2.45GHz 엑셀웨이브(Excelwave) 장비"
                    className="relative z-10 max-h-[380px] sm:max-h-[460px] w-auto object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* High-end badge overlaid */}
                  <div className="absolute -bottom-2 right-2 z-20 bg-[#0F2B22]/95 border border-[#C5A880]/60 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880]"></span>
                    <div>
                      <p className="text-[10px] font-en-cond text-[#C5A880] font-bold tracking-wider">OFFICIAL LAUNCH</p>
                      <p className="text-xs font-bold text-white">Excelwave 2.45GHz</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prev / Next Slide Arrow Buttons */}
        <button
          onClick={() => setHeroTab(prev => prev === 'video' ? 'excelwave' : 'video')}
          className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#0F2B22] border border-white/20 hover:border-[#C5A880] text-white items-center justify-center transition shadow-lg cursor-pointer"
          aria-label="이전 탭"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setHeroTab(prev => prev === 'video' ? 'excelwave' : 'video')}
          className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#0F2B22] border border-white/20 hover:border-[#C5A880] text-white items-center justify-center transition shadow-lg cursor-pointer"
          aria-label="다음 탭"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Bottom Multi-Tab Switcher Navigation */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center px-4">
          <div className="bg-[#071510]/85 backdrop-blur-md border border-[#C5A880]/40 rounded-full p-1.5 flex items-center gap-1.5 shadow-lg">
            <button
              onClick={() => setHeroTab('video')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                heroTab === 'video'
                  ? 'bg-[#C5A880] text-[#111111] font-bold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${heroTab === 'video' ? 'bg-[#111111]' : 'bg-zinc-400'}`}></span>
              <span>01 서울뷰 시그니처 영상</span>
            </button>
            <button
              onClick={() => setHeroTab('excelwave')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                heroTab === 'excelwave'
                  ? 'bg-[#C5A880] text-[#111111] font-bold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${heroTab === 'excelwave' ? 'bg-[#111111]' : 'bg-zinc-400'}`}></span>
              <span>02 2.45GHz 엑셀웨이브 신규 도입</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION: SPECIAL EVENTS (영상 바로 아래 & 당진점 소개 이전) ================= */}
      <section id="sec-events" className="py-20 md:py-28 bg-[#F7F7F8] border-b border-[#E5E5E8]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-en-cond text-xs tracking-[0.25em] text-[#A6895E] font-bold uppercase">
              SPECIAL PROMOTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] mt-1">서울뷰의원 당진점 이벤트</h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">합리적인 가격과 정품·정량 시술로 보답하는 카테고리별 프로모션입니다. (VAT 10% 별도)</p>
          </div>

          {/* 4 Event Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { id: 'booster', label: '스킨부스터' },
              { id: 'laser', label: '기미/흑자/모공 레이저' },
              { id: 'lifting', label: '리프팅' },
              { id: 'petit', label: '보톡스 / 필러 / 윤곽' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEventCat(tab.id as any)}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm transition cursor-pointer ${
                  eventCat === tab.id
                    ? 'font-bold bg-[#0F2B22] text-white shadow-sm'
                    : 'font-medium bg-white text-zinc-700 border border-[#E5E5E8] hover:border-[#0F2B22]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Event Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(EVENT_DATA[eventCat] || []).map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E5E5E8] p-6 hover:border-[#C5A880] transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#0F2B22]/10 text-[#0F2B22] text-[11px] font-bold px-2.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                    <span className="text-[11px] text-zinc-400">VAT 별도</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111111] leading-snug">{item.title}</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E5E5E8]">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-zinc-400 line-through">정상가 {item.orig}</span>
                    <div className="text-right">
                      <span className="text-[11px] text-[#A6895E] font-bold mr-1">이벤트가</span>
                      <span className="font-en-cond text-2xl font-bold text-[#0F2B22]">{item.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenBooking(`${item.title} (${item.price})`)}
                    className="w-full bg-[#111111] hover:bg-[#0F2B22] text-white font-semibold py-2.5 rounded text-xs transition cursor-pointer"
                  >
                    이 이벤트로 예약/상담 신청
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Link to Full Event Page Banner */}
          <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-[#0F2B22] to-[#173F32] rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#C5A880]/30">
            <div>
              <span className="text-[11px] font-bold text-[#C5A880] tracking-wider uppercase bg-[#C5A880]/20 px-2.5 py-1 rounded">
                EXCLUSIVE EVENT PAGE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-2">
                더 많은 시술별 상세 비급여 수가와 이벤트가 궁금하신가요?
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm mt-1">
                기미·모공, 안티에이징 리프팅, 젠틀맥스프로+ 제모, 필러, 보톡스 등 전체 수가표를 실시간 검색으로 편리하게 확인하세요.
              </p>
            </div>
            <button
              onClick={() => navigateTo('event')}
              className="shrink-0 bg-[#C5A880] hover:bg-[#A6895E] text-[#111111] font-bold px-7 py-3.5 rounded-xl text-sm transition shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <span>이벤트 전용 페이지 바로가기</span>
              <ChevronRight className="w-4 h-4 text-[#111111]" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: ABOUT ================= */}
      <section id="sec-about" className="py-20 md:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E5E5E8] pb-6">
          <div>
            <span className="font-en-cond text-xs tracking-[0.25em] text-[#A6895E] font-bold uppercase">
              01 / ABOUT SEOUL VIEW DANGJIN
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] mt-1">서울뷰의원 당진점 소개</h2>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setAboutTab('brand')}
              className={`px-5 py-2.5 rounded text-xs sm:text-sm transition shrink-0 cursor-pointer ${
                aboutTab === 'brand'
                  ? 'font-bold bg-[#111111] text-white'
                  : 'font-medium bg-[#F7F7F8] text-zinc-600 hover:text-[#111111]'
              }`}
            >
              서울뷰의원 당진
            </button>
            <button
              onClick={() => setAboutTab('devices')}
              className={`px-5 py-2.5 rounded text-xs sm:text-sm transition shrink-0 cursor-pointer ${
                aboutTab === 'devices'
                  ? 'font-bold bg-[#111111] text-white'
                  : 'font-medium bg-[#F7F7F8] text-zinc-600 hover:text-[#111111]'
              }`}
            >
              보유 장비 소개
            </button>
            <button
              onClick={() => setAboutTab('facility')}
              className={`px-5 py-2.5 rounded text-xs sm:text-sm transition shrink-0 cursor-pointer ${
                aboutTab === 'facility'
                  ? 'font-bold bg-[#111111] text-white'
                  : 'font-medium bg-[#F7F7F8] text-zinc-600 hover:text-[#111111]'
              }`}
            >
              원내 시설 소개
            </button>
          </div>
        </div>

        {/* 1-1. Brand Philosophy */}
        {aboutTab === 'brand' && (
          <div className="space-y-12 animate-in fade-in">
            {/* Top Philosophy Intro Banner */}
            <div className="bg-[#FAF8F5] border border-[#C5A880]/30 rounded-2xl p-8 sm:p-12 shadow-xs">
              <span className="inline-block bg-[#0F2B22] text-[#C5A880] text-xs font-bold px-3 py-1 rounded mb-4">
                SEOUL VIEW DANGJIN
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0F2B22] leading-snug tracking-tight">
                “수준 높은 시술을 위해 굳이 멀리 떠나실 필요 없도록,<br className="hidden sm:inline" />
                {" "}당진 서울뷰의원에서 타협 없는 실력과 정성으로 증명해 보이겠습니다.”
              </h3>
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mt-4 max-w-4xl font-normal">
                당진 서울뷰의원은 나와 내 가족에게도 자신 있게 권할 수 있는 꼭 필요한 시술만을 정직하게 추천합니다. 또한, 친절함을 넘어 최상의 결과를 만들어내는 탄탄한 실력과 끊임없는 연구로 여러분의 건강한 아름다움을 책임지겠습니다.
              </p>
            </div>

            {/* 4 Core Promises Section (서울뷰의원의 약속 - 브랜드 시그니처 딥그린 & 골드 톤) */}
            <div className="bg-[#FAF8F5] border border-[#C5A880]/40 rounded-2xl p-8 sm:p-12 shadow-xs">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-en-cond text-xs tracking-[0.25em] text-[#A6895E] font-bold uppercase block mb-1">
                  SEOUL VIEW PRINCIPLES
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#0F2B22] tracking-tight">
                  서울뷰의원의 약속
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 font-medium mt-3 leading-relaxed">
                  피부 문제의 근본을 바로잡는 네 가지 원칙,<br className="sm:hidden" />
                  {" "}원칙을 지키면, 결과가 다릅니다.
                </p>
              </div>

              {/* 4 Columns Grid with Vertical Dividers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#C5A880]/25">
                {/* 1. 정확한 진단 */}
                <div className="text-center px-4 py-6 sm:py-2 flex flex-col items-center group">
                  <div className="h-24 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#A6895E] stroke-current" fill="none" strokeWidth="1.6">
                      <circle cx="50" cy="50" r="30" />
                      <circle cx="38" cy="42" r="22" />
                      <circle cx="62" cy="42" r="22" />
                      <circle cx="42" cy="60" r="22" />
                      <circle cx="58" cy="60" r="22" />
                      <circle cx="50" cy="34" r="22" />
                      <circle cx="50" cy="66" r="22" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-[#0F2B22] mb-3">정확한 진단</h4>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-[220px]">
                    전문 피부 진단기로 색소의 깊이, 탄력까지 세밀하게 분석하여 진짜 원인부터 찾습니다.
                  </p>
                </div>

                {/* 2. 근본적인 치료 */}
                <div className="text-center px-4 py-6 sm:py-2 flex flex-col items-center group">
                  <div className="h-24 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#A6895E] stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M 22 46 A 30 30 0 0 1 78 46" />
                      <path d="M 28 55 A 24 24 0 0 1 72 55" />
                      <path d="M 35 64 A 17 17 0 0 1 65 64" />
                      <path d="M 42 72 A 10 10 0 0 1 58 72" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-[#0F2B22] mb-3">근본적인 치료</h4>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-[220px]">
                    일시적 개선이 아닌 건강한 피부를 위한 맞춤 솔루션을 제공해드립니다.
                  </p>
                </div>

                {/* 3. 정직한 프리미엄 */}
                <div className="text-center px-4 py-6 sm:py-2 flex flex-col items-center group">
                  <div className="h-24 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 120 100" className="w-24 h-20 text-[#A6895E] stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round">
                      {/* Left floret */}
                      <g transform="translate(26, 50)">
                        <line x1="0" y1="-13" x2="0" y2="13" />
                        <line x1="-13" y1="0" x2="13" y2="0" />
                        <line x1="-9" y1="-9" x2="9" y2="9" />
                        <line x1="-9" y1="9" x2="9" y2="-9" />
                        <circle cx="0" cy="0" r="3" fill="currentColor" />
                      </g>
                      {/* Center floret */}
                      <g transform="translate(60, 50)">
                        <line x1="0" y1="-15" x2="0" y2="15" />
                        <line x1="-15" y1="0" x2="15" y2="0" />
                        <line x1="-11" y1="-11" x2="11" y2="11" />
                        <line x1="-11" y1="11" x2="11" y2="-11" />
                        <circle cx="0" cy="0" r="3.5" fill="currentColor" />
                      </g>
                      {/* Right floret */}
                      <g transform="translate(94, 50)">
                        <line x1="0" y1="-13" x2="0" y2="13" />
                        <line x1="-13" y1="0" x2="13" y2="0" />
                        <line x1="-9" y1="-9" x2="9" y2="9" />
                        <line x1="-9" y1="9" x2="9" y2="-9" />
                        <circle cx="0" cy="0" r="3" fill="currentColor" />
                      </g>
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-[#0F2B22] mb-3">정직한 프리미엄</h4>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-[220px]">
                    정품 · 정량의 오리지널 장비를 사용한 프리미엄 진료를 경험해보세요.
                  </p>
                </div>

                {/* 4. 본연의 아름다움 */}
                <div className="text-center px-4 py-6 sm:py-2 flex flex-col items-center group">
                  <div className="h-24 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#A6895E] stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 52 84 Q 48 50 62 18" />
                      <path d="M 50 70 C 36 68 32 58 46 54 C 48 60 49 66 50 70 Z" />
                      <path d="M 52 58 C 66 56 70 46 56 42 C 54 48 53 54 52 58 Z" />
                      <path d="M 55 45 C 42 42 40 34 52 30 C 54 36 55 41 55 45 Z" />
                      <path d="M 59 32 C 72 28 74 18 62 16 C 60 22 59 28 59 32 Z" />
                      <path d="M 62 18 C 64 12 59 10 57 12 C 56 15 59 17 62 18 Z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-[#0F2B22] mb-3">본연의 아름다움</h4>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed max-w-[220px]">
                    피부 문제의 근본적인 치료를 통해, 내가 가진 본연의 아름다움을 찾아갑니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Seoul View Dangjin Interior Showcase with hover motion */}
            <div className="relative rounded-2xl overflow-hidden border border-[#E5E5E8] shadow-md group">
              <div className="image-zoom-container aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-[#071510]">
                <img
                  src={MAIN_IMAGE_SRC}
                  alt="서울뷰의원 당진점 원내 공간"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#071510]/85 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8 pointer-events-none">
                <p className="text-[#C5A880] text-xs font-en-cond tracking-widest uppercase font-bold">PREMIUM CLINIC ENVIRONMENT</p>
                <h4 className="text-white text-lg sm:text-2xl font-bold mt-1">꽃을 보듯 너를, 편안하고 프라이빗한 프리미엄 진료 공간</h4>
                <p className="text-zinc-200 text-xs sm:text-sm mt-1 max-w-2xl font-light">
                  당진 시민분들의 소중한 시간을 존중하며, 1:1 맞춤 상담부터 개별 프라이빗 룸 케어까지 안락한 힐링을 선사합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1-2. Devices */}
        {aboutTab === 'devices' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="border border-[#E5E5E8] rounded-xl p-6 bg-white hover:border-[#C5A880] transition shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-en-cond tracking-wider bg-[#0F2B22] text-[#C5A880] px-2.5 py-0.5 rounded font-bold">CANDELA USA</span>
                  <span className="text-xs font-semibold text-zinc-400">제모 · 탄력 · 색소</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111]">젠틀맥스 프로 플러스</h3>
                <p className="text-xs text-[#A6895E] font-medium mb-3">GentleMax Pro Plus (755nm & 1064nm)</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  미국 칸델라사의 최신 플래그십 모델. 기존 대비 38% 강력해진 에너지와 26mm 대구경 스팟, 2ms 초단파 펄스로 굵은 남성 수염부터 얇은 솜털까지 빠르고 통증 적게 반영구 제모합니다.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E8] flex justify-between items-center text-xs">
                <span className="text-zinc-500">FDA / KFDA 정식 승인</span>
                <button
                  onClick={() => navigateTo('prices')}
                  className="font-bold text-[#0F2B22] hover:underline cursor-pointer"
                >
                  제모 수가표 보기 →
                </button>
              </div>
            </div>

            <div className="border border-[#E5E5E8] rounded-xl p-6 bg-white hover:border-[#C5A880] transition shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-en-cond tracking-wider bg-[#0F2B22] text-[#C5A880] px-2.5 py-0.5 rounded font-bold">CYNOSURE USA</span>
                  <span className="text-xs font-semibold text-zinc-400">기미 · 흑자 · 모공 · 문신</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111]">피코슈어 (PicoSure)</h3>
                <p className="text-xs text-[#A6895E] font-medium mb-3">세계 최초 755nm 알렉산드라이트 피코레이저</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  일반 1064nm 레이저보다 멜라닌 흡수율이 3배 높은 755nm 파장과 포커스 렌즈(피코프락셀)를 통해 표피 손상 없이 난치성 기미, 흑자, 오타모반, 넓은 모공을 정교하게 치료합니다.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E8] flex justify-between items-center text-xs">
                <span className="text-zinc-500">멜라닌 선택적 파괴</span>
                <button
                  onClick={() => { scrollToSection('sec-events'); setEventCat('laser'); }}
                  className="font-bold text-[#0F2B22] hover:underline cursor-pointer"
                >
                  이벤트 보기 →
                </button>
              </div>
            </div>

            <div className="border border-[#E5E5E8] rounded-xl p-6 bg-white hover:border-[#C5A880] transition shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-en-cond tracking-wider bg-[#0F2B22] text-[#C5A880] px-2.5 py-0.5 rounded font-bold">MERZ GERMANY</span>
                  <span className="text-xs font-semibold text-zinc-400">프리미엄 초음파 리프팅</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111]">울쎄라 (Ultherapy)</h3>
                <p className="text-xs text-[#A6895E] font-medium mb-3">실시간 DeepSee 초음파 영상 리프팅</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  실시간 초음파 화면으로 환자 개개인의 피부 두께와 근막층(SMAS) 위치를 눈으로 직접 보며 정밀하게 에너지를 전달하여 처진 심부볼과 이중턱 라인을 강력하게 끌어올립니다.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E8] flex justify-between items-center text-xs">
                <span className="text-zinc-500">정품 팁 인증서 발급</span>
                <button
                  onClick={() => { scrollToSection('sec-events'); setEventCat('lifting'); }}
                  className="font-bold text-[#0F2B22] hover:underline cursor-pointer"
                >
                  이벤트 보기 →
                </button>
              </div>
            </div>

            <div className="border border-[#E5E5E8] rounded-xl p-6 bg-white hover:border-[#C5A880] transition shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-en-cond tracking-wider bg-zinc-800 text-white px-2.5 py-0.5 rounded font-bold">CYNOSURE USA</span>
                  <span className="text-xs font-semibold text-zinc-400">색소 · 화이트닝</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111]">레블라이트 SI & 포텐자</h3>
                <p className="text-xs text-[#A6895E] font-medium mb-3">PTP 방식 명품 토닝 & 고주파 마이크로니들</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  균일한 빔 프로파일로 자극 없이 맑은 피부톤을 만드는 레블라이트 SI와, 14종 팁으로 모공·여드름 흉터·홍조·쥬베룩 펌핑을 완성하는 포텐자 레이저를 함께 운용합니다.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E8] flex justify-between items-center text-xs">
                <span className="text-zinc-500">맞춤형 복합 레이저</span>
                <button
                  onClick={() => navigateTo('prices')}
                  className="font-bold text-[#0F2B22] hover:underline cursor-pointer"
                >
                  수가표 보기 →
                </button>
              </div>
            </div>

            <div className="border border-[#E5E5E8] rounded-xl p-6 bg-white hover:border-[#C5A880] transition shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-en-cond tracking-wider bg-zinc-800 text-white px-2.5 py-0.5 rounded font-bold">INMODE & SHRINK</span>
                  <span className="text-xs font-semibold text-zinc-400">타이트닝 · 윤곽</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111]">인모드 & 슈링크 유니버스</h3>
                <p className="text-xs text-[#A6895E] font-medium mb-3">지방 감소 + 콜라겐 리모델링</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  HVP 에너지로 이중턱과 심부볼 지방세포를 사멸시키는 인모드(FX+FORMA)와, 2가지 초음파 모드(MP/Normal)로 빈틈없이 탄력을 채우는 슈링크 유니버스를 보유하고 있습니다.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E8] flex justify-between items-center text-xs">
                <span className="text-zinc-500">통증 최소화 리프팅</span>
                <button
                  onClick={() => navigateTo('prices')}
                  className="font-bold text-[#0F2B22] hover:underline cursor-pointer"
                >
                  수가표 보기 →
                </button>
              </div>
            </div>

            <div className="border border-[#E5E5E8] rounded-xl p-6 bg-white hover:border-[#C5A880] transition shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-en-cond tracking-wider bg-zinc-800 text-white px-2.5 py-0.5 rounded font-bold">DIAGNOSIS & CARE</span>
                  <span className="text-xs font-semibold text-zinc-400">정밀진단 · 메디컬케어</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111]">마크뷰 & LDM 물방울 리프팅</h3>
                <p className="text-xs text-[#A6895E] font-medium mb-3">4가지 광원 피부진단기 & 고밀도 초음파</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  시술 전 정확한 피부 분석을 위한 마크뷰(Mark-Vu) 시스템과, 레이저 및 스킨부스터 시술 후 즉각적인 진정·보습·장벽 재생을 돕는 LDM, 크라이오, 아쿠아필 장비를 완비했습니다.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E8] flex justify-between items-center text-xs">
                <span className="text-zinc-500">시술 전후 체계적 관리</span>
                <button
                  onClick={() => navigateTo('prices')}
                  className="font-bold text-[#0F2B22] hover:underline cursor-pointer"
                >
                  수가표 보기 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1-3. Facility */}
        {aboutTab === 'facility' && (
          <div className="grid md:grid-cols-4 gap-6 animate-in fade-in">
            <div className="bg-[#F7F7F8] rounded-xl p-6 border border-[#E5E5E8]">
              <span className="font-en-cond text-2xl font-bold text-[#A6895E]">SPACE 01</span>
              <h4 className="text-base font-bold text-[#111111] mt-2 mb-2">호텔 라운지형 대기 공간</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">방문하시는 순간부터 편안함을 느끼실 수 있도록 딥그린 & 웜 우드 톤의 여유로운 대기 라운지와 파우더룸을 마련했습니다.</p>
            </div>
            <div className="bg-[#F7F7F8] rounded-xl p-6 border border-[#E5E5E8]">
              <span className="font-en-cond text-2xl font-bold text-[#A6895E]">SPACE 02</span>
              <h4 className="text-base font-bold text-[#111111] mt-2 mb-2">남·여 분리 1인 전용 제모실</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">젠틀맥스 프로 플러스 레이저 제모 시 환자분의 프라이버시를 완벽히 보호하기 위해 독립된 1인 제모 전용 룸에서 시술합니다.</p>
            </div>
            <div className="bg-[#F7F7F8] rounded-xl p-6 border border-[#E5E5E8]">
              <span className="font-en-cond text-2xl font-bold text-[#A6895E]">SPACE 03</span>
              <h4 className="text-base font-bold text-[#111111] mt-2 mb-2">1인 프라이빗 메디컬 관리실</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">마취 크림 도포부터 레이저 후 진정 관리까지 다른 환자분과 마주치지 않는 쾌적한 1인 관리 베드를 운영합니다.</p>
            </div>
            <div className="bg-[#F7F7F8] rounded-xl p-6 border border-[#E5E5E8]">
              <span className="font-en-cond text-2xl font-bold text-[#A6895E]">SPACE 04</span>
              <h4 className="text-base font-bold text-[#111111] mt-2 mb-2">대학병원급 멸균 소독 시스템</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">1회용 소모품 사용 후 즉시 폐기 원칙과 고압증기멸균기·UV 소독 시스템을 통해 감염 걱정 없는 안전한 진료 환경을 유지합니다.</p>
            </div>
          </div>
        )}
      </section>



      {/* ================= SECTION 4: BEFORE & AFTER ================= */}
      <section id="sec-ba" className="py-20 md:py-28 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-en-cond text-xs tracking-[0.25em] text-[#C5A880] font-bold uppercase">
                04 / BEFORE & AFTER ARCHIVE
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold mt-1">시술 전후사진</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">보정 없는 동일 조명·동일 각도 임상 전후 기록입니다.</p>
            </div>

            {/* Medical Law Consent Toggle */}
            <div className="flex items-center gap-3 bg-white/10 border border-[#C5A880]/40 px-4 py-2.5 rounded-lg">
              <div className="text-xs">
                <span className="text-[#C5A880] font-bold">
                  {isBaUnlocked ? "열람 동의 완료 (전후사진 잠금 해제됨)" : "의료법 준수 블러 적용 중"}
                </span>
                <p className="text-[11px] text-zinc-300">
                  {isBaUnlocked ? "동일 조건 무보정 임상 케이스입니다." : "동의를 누르시면 모든 전후사진이 선명하게 표시됩니다."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsBaUnlocked(!isBaUnlocked);
                  showToast(
                    !isBaUnlocked
                      ? "의료법 준수 전후사진 열람 동의가 확인되었습니다."
                      : "블러 보호 모드가 다시 활성화되었습니다."
                  );
                }}
                className={`font-bold text-xs px-3.5 py-2 rounded shrink-0 transition cursor-pointer ${
                  isBaUnlocked ? 'bg-zinc-700 text-white' : 'bg-[#C5A880] text-[#111111]'
                }`}
              >
                {isBaUnlocked ? "블러 다시 켜기" : "열람 동의 (잠금해제)"}
              </button>
            </div>
          </div>

          {/* 6 BA Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {[
              { id: 'lifting', label: '쥬베룩 / 리프팅' },
              { id: 'melasma', label: '기미 / 난치성색소' },
              { id: 'filler', label: '필러' },
              { id: 'acne', label: '여드름 / 모공, 흉터 / 홍조' },
              { id: 'hair', label: '레이저 제모' },
              { id: 'tattoo', label: '문신제거' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBaCat(tab.id as any)}
                className={`px-4 py-2.5 rounded text-xs sm:text-sm transition cursor-pointer ${
                  baCat === tab.id
                    ? 'font-bold bg-[#C5A880] text-[#111111]'
                    : 'font-medium bg-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* BA Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {(BA_DATA[baCat] || []).map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/15 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                    <span className="text-[11px] bg-[#C5A880]/20 text-[#C5A880] px-2.5 py-0.5 rounded">
                      {item.period}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 relative">
                    {/* BEFORE */}
                    <div className="bg-zinc-900 border border-white/10 rounded-lg p-5 text-center">
                      <span className="inline-block text-[10px] font-en-cond tracking-widest bg-zinc-700 text-zinc-200 px-2 py-0.5 rounded mb-3">
                        BEFORE
                      </span>
                      <div className="h-28 flex flex-col items-center justify-center rounded bg-gradient-to-b from-zinc-800 to-zinc-900 p-3">
                        <p className="text-xs font-semibold text-zinc-300">{item.beforeMetric}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">마크뷰 정밀 촬영 원본</p>
                      </div>
                    </div>

                    {/* AFTER */}
                    <div className="bg-zinc-900 border border-[#C5A880]/40 rounded-lg p-5 text-center relative overflow-hidden">
                      <span className="inline-block text-[10px] font-en-cond tracking-widest bg-[#C5A880] text-[#111111] font-bold px-2 py-0.5 rounded mb-3">
                        AFTER
                      </span>
                      <div
                        className={`h-28 flex flex-col items-center justify-center rounded bg-gradient-to-b from-[#0F2B22] to-zinc-900 p-3 ${
                          isBaUnlocked ? 'ba-unlocked' : 'ba-locked'
                        }`}
                      >
                        <p className="text-xs font-bold text-[#C5A880]">{item.afterMetric}</p>
                        <p className="text-[10px] text-zinc-300 mt-1">무보정 동일 조건 촬영</p>
                      </div>
                      {!isBaUnlocked && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-3">
                          <button
                            onClick={() => {
                              setIsBaUnlocked(true);
                              showToast("의료법 준수 전후사진 열람 동의가 확인되었습니다.");
                            }}
                            className="bg-[#C5A880] text-[#111111] font-bold text-[11px] px-3 py-1.5 rounded shadow cursor-pointer"
                          >
                            클릭하여 After 확인
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-400 mt-6 border-t border-white/10 pt-4">
            ※ 의료법 고지사항: 모든 시술은 개인의 피부 상태에 따라 붉은기, 부기, 멍, 색소침착, 염증 등의 부작용이 발생할 수 있으므로 시술 전 의료진과의 충분한 상담이 필요합니다.
          </p>
        </div>
      </section>

      {/* ================= SECTION 5: PROCEDURE GUIDE & PRECAUTIONS ================= */}
      <section id="sec-guide" className="py-20 md:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <span className="font-en-cond text-xs tracking-[0.25em] text-[#A6895E] font-bold uppercase">
            05 / PROCEDURE GUIDE & PRECAUTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] mt-1">시술안내 및 주의사항</h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">안전하고 만족스러운 결과를 위해 시술 전·후 꼭 확인하셔야 할 안내사항입니다.</p>
        </div>

        {/* 9 Procedure Guide Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'toning', label: '01. 레이저토닝 / 잡티제거' },
            { id: 'picosure', label: '02. 피코슈어 피코프락셀' },
            { id: 'lifting', label: '03. 리프팅' },
            { id: 'hair', label: '04. 제모' },
            { id: 'booster', label: '05. 스킨부스터' },
            { id: 'botox', label: '06. 보톡스 / 윤곽주사' },
            { id: 'filler', label: '07. 필러 / 실리프팅 / 쥬베룩 볼륨' },
            { id: 'mole', label: '08. 점 / 사마귀 / 쥐젖제거' },
            { id: 'diet', label: '09. 다이어트' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setGuideCat(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs transition cursor-pointer ${
                guideCat === tab.id
                  ? 'font-bold bg-[#0F2B22] text-white'
                  : 'font-medium bg-[#F7F7F8] text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Guide Content Panel */}
        {GUIDE_DATA[guideCat] && (
          <div className="bg-[#FAF8F5] border border-[#C5A880]/40 rounded-2xl p-6 sm:p-10 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C5A880]/30 pb-6 mb-6 gap-4">
              <div>
                <span className="text-xs font-bold text-[#0F2B22]">{GUIDE_DATA[guideCat].subtitle}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] mt-1">{GUIDE_DATA[guideCat].title}</h3>
              </div>
              <button
                onClick={() => handleOpenBooking(`${GUIDE_DATA[guideCat].title} 상담`)}
                className="bg-[#0F2B22] text-white text-xs font-bold px-5 py-3 rounded-lg shrink-0 hover:bg-[#173F32] transition cursor-pointer"
              >
                해당 시술 상담 예약하기
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs">
              <div className="bg-white p-4 rounded-xl border border-[#E5E5E8]">
                <span className="text-zinc-400 block mb-1">시술 소요시간</span>
                <strong className="text-sm text-[#111111]">{GUIDE_DATA[guideCat].time}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E5E8]">
                <span className="text-zinc-400 block mb-1">마취 방법</span>
                <strong className="text-sm text-[#111111]">{GUIDE_DATA[guideCat].anesthesia}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E5E8]">
                <span className="text-zinc-400 block mb-1">권장 주기</span>
                <strong className="text-sm text-[#111111]">{GUIDE_DATA[guideCat].cycle}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E5E8]">
                <span className="text-zinc-400 block mb-1">회복 기간 (다운타임)</span>
                <strong className="text-sm text-[#0F2B22]">{GUIDE_DATA[guideCat].downtime}</strong>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#E5E5E8]">
              <h4 className="text-sm font-bold text-[#111111] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A880]"></span> 시술 후 필수 주의사항 안내
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {GUIDE_DATA[guideCat].precautions.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-en-cond font-bold text-[#A6895E]">0{idx + 1}.</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* ================= SECTION 6: DR. COLUMN ================= */}
      <section id="sec-column" className="py-20 md:py-28 bg-[#F7F7F8] border-t border-[#E5E5E8]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-en-cond text-xs tracking-[0.25em] text-[#A6895E] font-bold uppercase">
                06 / DOCTOR'S COLUMN
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] mt-1">대표원장 진료 칼럼</h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">시술을 결정하시기 전 꼭 한 번 읽어보시면 도움 되는 대표원장의 솔직한 의학 칼럼입니다.</p>
            </div>
            <button
              onClick={() => navigateTo('column')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2B22] hover:text-[#A6895E] transition border border-[#0F2B22]/20 hover:border-[#A6895E] bg-white px-4 py-2.5 rounded-lg shadow-2xs self-start md:self-auto cursor-pointer"
            >
              <span>원장칼럼 전문 페이지 전체보기</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#A6895E]" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {COLUMNS_DATA.map((col) => (
              <article
                key={col.id}
                onClick={() => navigateTo('column', col.id)}
                className="bg-white rounded-xl border border-[#E5E5E8] p-7 hover:border-[#C5A880] transition cursor-pointer flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#0F2B22] bg-[#0F2B22]/10 px-2.5 py-1 rounded">
                      {col.tag}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {col.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111111] mt-3 group-hover:text-[#0F2B22] transition leading-snug">
                    {col.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-3 leading-relaxed line-clamp-3">
                    {col.preview}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E5E5E8] flex items-center justify-between text-xs font-semibold text-[#A6895E]">
                  <span>대표원장 직접 집필</span>
                  <span className="group-hover:translate-x-1 transition flex items-center gap-1">
                    칼럼 전문 읽기 →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: LOCATION & HOURS ================= */}
      <section id="sec-location" className="py-20 md:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <span className="font-en-cond text-xs tracking-[0.25em] text-[#A6895E] font-bold uppercase">
            07 / LOCATION & HOURS
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#111111] mt-1">오시는 길 및 진료안내</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Timetable & Info */}
          <div className="lg:col-span-5 bg-[#0F2B22] text-white rounded-2xl p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-en-cond tracking-widest text-[#C5A880]">CUSTOMER CENTER</span>
                <p className="font-en-cond text-3xl sm:text-4xl font-bold text-white mt-1">041-350-0000</p>
                <p className="text-xs text-zinc-300 mt-1">충청남도 당진시 시청1로 (수청동/읍내동 중심상권) 서울뷰타워 4층</p>
              </div>

              <div className="border-t border-white/15 pt-5 space-y-2.5 text-xs sm:text-sm">
                <h3 className="font-bold text-[#C5A880] mb-3">진료시간 안내</h3>
                <div className="flex justify-between">
                  <span className="text-zinc-300">월 · 수 · 목</span>
                  <span className="font-semibold">AM 10:00 ~ PM 07:30</span>
                </div>
                <div className="flex justify-between text-[#C5A880] font-bold">
                  <span>화 · 금 (야간진료)</span>
                  <span>AM 10:00 ~ PM 08:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">토 요 일</span>
                  <span className="font-semibold">AM 09:30 ~ PM 04:00 (점심시간 없음)</span>
                </div>
                <div className="flex justify-between text-zinc-400 pt-1">
                  <span>평일 점심시간</span>
                  <span>PM 01:00 ~ PM 02:00</span>
                </div>
                <p className="text-[11px] text-zinc-400 pt-2">※ 일요일 및 법정 공휴일은 휴진입니다.</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/15 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOpenBooking('오시는길 섹션 빠른 예약')}
                className="bg-[#C5A880] text-[#111111] font-bold py-3 rounded text-xs hover:opacity-95 transition cursor-pointer"
              >
                온라인 예약 신청
              </button>
              <button
                onClick={copyAddress}
                className="border border-white/30 text-white hover:border-[#C5A880] py-3 rounded text-xs transition cursor-pointer"
              >
                병원 주소 복사하기
              </button>
            </div>
          </div>

          {/* Interactive Map Graphic */}
          <div className="lg:col-span-7 bg-[#F7F7F8] border border-[#E5E5E8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">서울뷰의원 당진점 약도 및 주차 안내</h3>
                  <p className="text-xs text-zinc-500">건물 내 대형 지하주차장 및 전용 주차타워 무료 이용 가능</p>
                </div>
                <span className="bg-[#0F2B22] text-white text-xs px-3 py-1 rounded font-medium">
                  무료 발렛/주차 지원
                </span>
              </div>

              <div className="w-full h-64 sm:h-72 bg-[#E9ECEA] rounded-xl border border-[#E5E5E8] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]"></div>
                <div className="absolute w-full h-6 bg-white/90 top-1/2 -translate-y-1/2 border-y border-zinc-300"></div>
                <div className="absolute h-full w-6 bg-white/90 left-1/2 -translate-x-1/2 border-x border-zinc-300"></div>
                <div className="relative z-10 bg-[#0F2B22] text-white px-5 py-3 rounded-xl shadow-lg border-2 border-[#C5A880] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880] text-[#111111] flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#C5A880] font-en-cond tracking-wider">SEOUL VIEW DANGJIN</p>
                    <p className="text-sm font-bold">서울뷰의원 당진점 (4F)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 text-xs">
              <div className="bg-white p-4 rounded-lg border border-[#E5E5E8]">
                <p className="font-bold text-[#111111] mb-1">자가용 및 주차 안내</p>
                <p className="text-zinc-600">네비게이션에 '서울뷰의원 당진점' 검색 후 건물 지하 1~3층 주차장 이용 (진료 시간 동안 무료 주차 등록)</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[#E5E5E8]">
                <p className="font-bold text-[#111111] mb-1">대중교통 이용 시</p>
                <p className="text-zinc-600">당진시청 / 버스터미널 방면 주요 시내버스 정류장 하차 후 도보 2분 거리</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#071510] text-zinc-400 py-14 border-t border-[#C5A880]/20 text-xs pb-24 md:pb-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={LOGO_SRC}
                  alt="꽃을보듯너를 서울뷰의원 당진"
                  className="h-11 w-auto object-contain filter drop-shadow-sm"
                />
              </div>
              <p className="text-zinc-400 leading-relaxed">
                상호명: 서울뷰의원 당진점 | 대표자: 홍길동 | 사업자등록번호: 312-00-00000<br />
                주소: 충청남도 당진시 시청1로 서울뷰타워 4층 | 대표전화: 041-350-0000
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-start text-zinc-300">
              <button
                onClick={() => navigateTo('prices')}
                className="hover:text-[#C5A880] underline underline-offset-4 cursor-pointer"
              >
                비급여 진료비용 안내
              </button>
              <span>|</span>
              <button
                onClick={() => navigateTo('column')}
                className="hover:text-[#C5A880] cursor-pointer font-medium"
              >
                대표원장 칼럼
              </button>
              <span>|</span>
              <button
                onClick={() => scrollToSection('sec-guide')}
                className="hover:text-[#C5A880] cursor-pointer"
              >
                시술 후 주의사항
              </button>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
            <p>© 2026 SEOUL VIEW CLINIC DANGJIN. ALL RIGHTS RESERVED.</p>
            <p>본 사이트의 모든 콘텐츠는 의료법을 준수하여 제작되었습니다.</p>
          </div>
        </div>
      </footer>

      {/* ================= MOBILE BOTTOM FIXED BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E8] grid grid-cols-4 text-[11px] font-semibold shadow-lg">
        <button
          onClick={() => handleOpenBooking('모바일 하단바 빠른예약')}
          className="py-3 bg-[#0F2B22] text-white flex flex-col items-center justify-center cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4 text-[#C5A880] mb-0.5" />
          <span>실시간예약</span>
        </button>
        <button
          onClick={() => {
            handleOpenBooking('모바일 카카오톡 상담');
            showToast("카카오톡 상담 신청 창으로 연결되었습니다.");
          }}
          className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-amber-500 mb-0.5" />
          <span>카톡상담</span>
        </button>
        <button
          onClick={() => scrollToSection('sec-prices')}
          className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#0F2B22] mb-0.5" />
          <span>비급여수가</span>
        </button>
        <button
          onClick={() => scrollToSection('sec-location')}
          className="py-3 text-[#111111] flex flex-col items-center justify-center cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-[#0F2B22] mb-0.5" />
          <span>오시는길</span>
        </button>
      </div>

      {/* ================= MODAL 1: RESERVATION ================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-lg border border-[#C5A880]/40 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-[#111111] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-en-cond text-xs tracking-widest text-[#A6895E] font-bold uppercase">
              ONLINE RESERVATION
            </span>
            <h3 className="text-2xl font-bold text-[#111111] mt-1">서울뷰의원 당진점 빠른 예약</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-6">원하시는 시술 또는 고민 부위를 남겨주시면 확인 후 신속히 안내해 드립니다.</p>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">환자분 성함 *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  placeholder="성함을 입력해주세요"
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
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
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">관심 시술 / 이벤트 항목</label>
                <input
                  type="text"
                  value={selectedBookingItem}
                  onChange={(e) => setSelectedBookingItem(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg bg-[#F7F7F8] font-medium text-[#0F2B22] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">희망 날짜 *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg focus:outline-none focus:border-[#0F2B22]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">희망 시간대</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg bg-white focus:outline-none focus:border-[#0F2B22]"
                  >
                    <option>오전 (10:00 ~ 12:30)</option>
                    <option>오후 (14:00 ~ 18:00)</option>
                    <option>야간진료 (화·금 18:00~20:30)</option>
                    <option>토요일 진료 (09:30~16:00)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0F2B22] hover:bg-[#173F32] text-white font-bold py-3.5 rounded-lg text-sm transition mt-2 cursor-pointer"
              >
                예약 신청 완료하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: COLUMN READER ================= */}
      {columnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-10 relative shadow-lg max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setColumnModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-[#111111] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div>
              <span className="text-xs font-bold text-[#0F2B22] bg-[#0F2B22]/10 px-3 py-1 rounded">
                {COLUMN_DATA[selectedColumnIndex]?.tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] mt-3 mb-2">
                {COLUMN_DATA[selectedColumnIndex]?.title}
              </h3>
              <p className="text-xs text-zinc-400 border-b border-[#E5E5E8] pb-4 mb-6">
                집필: 서울뷰의원 당진점 대표원장
              </p>
              <div className="text-sm text-zinc-700 leading-relaxed space-y-4">
                {COLUMN_DATA[selectedColumnIndex]?.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
              <div className="mt-8 pt-4 border-t border-[#E5E5E8] flex justify-end">
                <button
                  onClick={() => {
                    setColumnModalOpen(false);
                    handleOpenBooking(`${COLUMN_DATA[selectedColumnIndex]?.tag} 관련 상담`);
                  }}
                  className="bg-[#0F2B22] text-white text-xs font-bold px-5 py-2.5 rounded cursor-pointer"
                >
                  칼럼 내용으로 상담 예약하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ADMIN SHEET / QUICK PRICE ================= */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-lg animate-in fade-in zoom-in-95">
            <button
              onClick={() => setAdminModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-[#111111] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-[#0F2B22] bg-[#0F2B22]/10 px-2.5 py-1 rounded">
              원내 관리자 전용 기능
            </span>
            <h3 className="text-xl font-bold text-[#111111] mt-2">구글 스프레드시트 수가표 실시간 관리</h3>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              구글 시트(CSV) 웹에 게시 링크 연동 및 원내에서 새로운 시술 수가 항목을 즉시 등록할 수 있습니다.
            </p>
            <div className="mt-4 space-y-3 text-xs">
              <label className="block font-semibold text-zinc-700">구글 시트 CSV 웹 게시 URL</label>
              <input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                className="w-full px-3.5 py-2.5 border border-[#E5E5E8] rounded-lg"
              />
              <div className="bg-[#F7F7F8] p-3.5 rounded-lg border border-[#E5E5E8] text-zinc-600 space-y-2">
                <p className="font-bold text-[#111111]">💡 즉시 새 수가 항목 추가하기</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="시술명 (예: 울쎄라 600샷)"
                    className="px-2.5 py-1.5 border rounded bg-white text-xs"
                  />
                  <input
                    type="text"
                    value={quickOnce}
                    onChange={(e) => setQuickOnce(e.target.value)}
                    placeholder="1회가 (예: 1,350,000원)"
                    className="px-2.5 py-1.5 border rounded bg-white text-xs"
                  />
                  <button
                    onClick={addQuickPrice}
                    className="bg-[#0F2B22] text-white font-bold rounded px-3 py-1.5 text-xs hover:bg-[#173F32] transition cursor-pointer"
                  >
                    수가표에 추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#0F2B22] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#C5A880] flex items-center gap-3 text-xs sm:text-sm animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
