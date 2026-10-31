// 시술 전후사진 사례 (홈 '시술 전후사진' 섹션 + /before-after 페이지)
// ※ 사진·문구는 AI Studio 예시. 실제 사례 사진을 받으면 교체한다 (사용자 보류 중).

export interface BaItem {
  title: string;
  beforeMetric: string;
  afterMetric: string;
}

export const BA_CATEGORIES = [
  { id: 'melasma', label: '기미 / 난치성색소', short: '기미·색소' },
  { id: 'filler', label: '필러', short: '필러' },
  { id: 'acne', label: '여드름 / 모공, 흉터 / 홍조', short: '여드름·모공' },
  { id: 'hair', label: '레이저 제모', short: '제모' },
  { id: 'tattoo', label: '문신제거', short: '문신제거' }
] as const;

export type BaCategoryId = (typeof BA_CATEGORIES)[number]['id'];

export const BA_DATA: Record<BaCategoryId, BaItem[]> = {
  melasma: [
    { title: "색소 레이저 복합 토닝", beforeMetric: "시술 전: 진피성 기미 및 불균일한 톤", afterMetric: "시술 후: 전체 피부 톤 개선" },
    { title: "흑자(검버섯) 원데이 제거", beforeMetric: "시술 전: 짙은 갈색 흑자 병변", afterMetric: "시술 후: 흉터 없이 정상 피부톤 회복" }
  ],
  filler: [
    { title: "벨로테로 팔자주름 + 앞볼 커스텀 필러 2cc", beforeMetric: "시술 전: 깊은 팔자 고랑", afterMetric: "시술 후: 이물감 없는 자연스러운 윤곽" },
    { title: "입술 디자인 필러 + 입꼬리 보톡스", beforeMetric: "시술 전: 얇고 비대칭인 입술", afterMetric: "시술 후: 볼륨 및 입꼬리 대칭 개선" }
  ],
  acne: [
    { title: "모공·흉터 레이저 + 쥬베룩", beforeMetric: "시술 전: 확장된 모공 및 요철", afterMetric: "시술 후: 모공 면적 축소 및 피부결 매끈화" },
    { title: "홍조 레이저 + LDM", beforeMetric: "시술 전: 여드름 홍반 및 모세혈관 확장", afterMetric: "시술 후: 붉은기 진정 및 장벽 강화" }
  ],
  hair: [
    { title: "남성 수염 전체 레이저 제모", beforeMetric: "시술 전: 굵고 빽빽한 수염 및 모낭염", afterMetric: "시술 후: 푸른 자국 소실 및 매끈한 턱선" },
    { title: "여성 종아리/겨드랑이 레이저 제모", beforeMetric: "시술 전: 잦은 면도로 인한 색소침착", afterMetric: "시술 후: 체모 제거 및 피부결 개선" }
  ],
  tattoo: [
    { title: "눈썹 반영구 문신 잔흔 제거", beforeMetric: "시술 전: 비대칭 붉은/푸른 잔흔", afterMetric: "시술 후: 눈썹 털 손상 없이 색소 제거" },
    { title: "팔목 레터링 & 컬러 타투 제거", beforeMetric: "시술 전: 짙은 블랙 및 컬러 타투", afterMetric: "시술 후: 정상 피부 조직 복원" }
  ]
};

// 모든 사례를 분류 순서대로 한 줄로 (홈 화면용)
export const ALL_BA_ITEMS = BA_CATEGORIES.flatMap((c) => BA_DATA[c.id].map((item) => ({ ...item, category: c.label })));
