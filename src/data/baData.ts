// 시술 전후사진 사례 (홈 '시술 전후사진' 섹션 + /before-after 페이지)
// ※ 사진·문구는 AI Studio 예시. 실제 사례 사진을 받으면 교체한다 (사용자 보류 중).

export interface BaItem {
  title: string;
  period: string;
  desc: string;
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
    { title: "색소 레이저 복합 토닝 10회", period: "시술 후 12주 경과", desc: "양 볼에 넓게 퍼진 혼합형 난치성 기미와 잡티를 열 손상 없이 안전하게 분해하여 전체 피부 톤을 밝힌 사례입니다.", beforeMetric: "시술 전: 진피성 기미 및 불균일한 톤", afterMetric: "시술 후: 전체 피부 톤 개선" },
    { title: "흑자(검버섯) 원데이 제거", period: "시술 후 3주 경과", desc: "일반 레이저 토닝으로 지워지지 않던 광대 부위 흑자를 레이저 스팟 조사로 제거했습니다.", beforeMetric: "시술 전: 짙은 갈색 흑자 병변", afterMetric: "시술 후: 흉터 없이 정상 피부톤 회복" }
  ],
  filler: [
    { title: "벨로테로 팔자주름 + 앞볼 커스텀 필러 2cc", period: "시술 직후 및 2주 경과", desc: "과하게 부풀어 오르는 느낌 없이 코 옆 꺼진 삼각존(귀족 부위)을 자연스럽게 채워 인상을 부드럽게 개선했습니다.", beforeMetric: "시술 전: 깊은 팔자 고랑", afterMetric: "시술 후: 이물감 없는 자연스러운 윤곽" },
    { title: "입술 디자인 필러 + 입꼬리 보톡스", period: "시술 후 1주 경과", desc: "말려 들어가고 비대칭이던 윗입술 라인에 입체감을 부여하고 자연스럽게 올라간 입꼬리를 디자인했습니다.", beforeMetric: "시술 전: 얇고 비대칭인 입술", afterMetric: "시술 후: 볼륨 및 입꼬리 대칭 개선" }
  ],
  acne: [
    { title: "모공·흉터 레이저 + 쥬베룩 3회", period: "시술 후 10주 경과", desc: "나비존(볼·코 옆)의 늘어진 세로 모공과 패인 여드름 롤링성 흉터를 진피 재생 유도로 촘촘하게 메운 케이스입니다.", beforeMetric: "시술 전: 확장된 모공 및 요철", afterMetric: "시술 후: 모공 면적 축소 및 피부결 매끈화" },
    { title: "홍조 레이저 + LDM 5회", period: "시술 후 6주 경과", desc: "만성적인 양 볼 안면홍조와 여드름 붉은 자국을 개선하고 얇아진 피부 장벽을 튼튼하게 복원했습니다.", beforeMetric: "시술 전: 여드름 홍반 및 모세혈관 확장", afterMetric: "시술 후: 붉은기 진정 및 장벽 강화" }
  ],
  hair: [
    { title: "남성 수염 전체 레이저 제모 5회", period: "5회 시술 완료 후 4주 경과", desc: "매일 아침 면도 독(모낭염)과 푸른 수염 자국으로 스트레스받던 남성 환자분의 인중·턱·목 수염을 정리했습니다.", beforeMetric: "시술 전: 굵고 빽빽한 수염 및 모낭염", afterMetric: "시술 후: 푸른 자국 소실 및 매끈한 턱선" },
    { title: "여성 종아리/겨드랑이 레이저 제모 5회", period: "5회 시술 완료 후", desc: "모공 각화증과 체모를 동시에 깔끔하게 정리했습니다.", beforeMetric: "시술 전: 잦은 면도로 인한 색소침착", afterMetric: "시술 후: 체모 제거 및 피부결 개선" }
  ],
  tattoo: [
    { title: "눈썹 반영구 문신 잔흔 제거 3회", period: "3회 시술 후 6주 경과", desc: "오래되어 붉고 푸르게 변색된 눈썹 문신 색소를 눈썹 모근 손상 없이 깨끗하게 지워낸 케이스입니다.", beforeMetric: "시술 전: 비대칭 붉은/푸른 잔흔", afterMetric: "시술 후: 눈썹 털 손상 없이 색소 제거" },
    { title: "팔목 레터링 & 컬러 타투 제거 5회", period: "5회 시술 후", desc: "나노 레이저로 지워지지 않던 미세 잉크 입자를 피코초 단위로 잘게 쪼개어 흉터 없이 배출시켰습니다.", beforeMetric: "시술 전: 짙은 블랙 및 컬러 타투", afterMetric: "시술 후: 정상 피부 조직 복원" }
  ]
};

// 모든 사례를 분류 순서대로 한 줄로 (홈 화면용)
export const ALL_BA_ITEMS = BA_CATEGORIES.flatMap((c) => BA_DATA[c.id].map((item) => ({ ...item, category: c.label })));
