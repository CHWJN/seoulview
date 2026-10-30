// 이벤트 / 상세 비급여 수가표 데이터
// 원본: 서울뷰의원 당진점 가격표 엑셀 (시트: "이벤트 가격표", "시술 가격표")
// 가격은 원 단위 숫자, 화면에는 formatWon()으로 표시

export interface EventItem {
  name: string;
  option: string;
  orig?: number; // 정상가 (표기된 경우만)
  price: number; // 이벤트가
  note?: string;
}

export interface EventGroup {
  name: string;
  note?: string; // 이벤트 공통 안내
  items: EventItem[];
}

export interface PriceRow {
  option: string;
  price: number;
  type: string; // 가격 구분 (비급여가 / 정가 / 특별가 / 국산 / 코어톡스 / 발급 비용)
}

export interface PriceGroup {
  name: string;
  notes: string[];
  rows: PriceRow[];
}

export interface PriceCategory {
  name: string;
  groups: PriceGroup[];
}

export const formatWon = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export const discountRate = (item: EventItem) =>
  item.orig ? Math.round((1 - item.price / item.orig) * 100) : null;

export const EVENTS: EventGroup[] = [
  {
    "name": "엑셀웨이브 런칭 이벤트",
    "items": [
      {
        "name": "페이스 엑셀웨이브 6만J",
        "option": "1회",
        "orig": 390000,
        "price": 290000
      },
      {
        "name": "페이스 엑셀웨이브 6만J",
        "option": "3회",
        "orig": 900000,
        "price": 630000
      },
      {
        "name": "[옵션] 페이스 윤곽주사 10cc 추가",
        "option": "1회",
        "orig": 70000,
        "price": 40000
      },
      {
        "name": "[옵션] 페이스 윤곽주사 10cc 추가",
        "option": "3회",
        "orig": 180000,
        "price": 100000
      },
      {
        "name": "바디 엑셀웨이브 12만J",
        "option": "1회",
        "orig": 490000,
        "price": 390000
      },
      {
        "name": "바디 엑셀웨이브 12만J",
        "option": "3회",
        "orig": 1100000,
        "price": 830000
      },
      {
        "name": "[옵션] 바디 윤곽주사 100cc 추가",
        "option": "1회",
        "orig": 140000,
        "price": 90000
      },
      {
        "name": "[옵션] 바디 윤곽주사 100cc 추가",
        "option": "3회",
        "orig": 360000,
        "price": 210000
      }
    ],
    "note": "이벤트 기간 ~12/31"
  },
  {
    "name": "뉴비쥬 런칭 이벤트",
    "items": [
      {
        "name": "뉴비쥬 이중턱 파괴주사 1vial",
        "option": "1회",
        "orig": 270000,
        "price": 190000
      },
      {
        "name": "뉴비쥬 이중턱 파괴주사 1vial",
        "option": "3회",
        "orig": 700000,
        "price": 490000
      },
      {
        "name": "[옵션] 심부볼 윤곽주사 10cc 추가",
        "option": "1회",
        "orig": 70000,
        "price": 30000
      },
      {
        "name": "[옵션] 심부볼 윤곽주사 10cc 추가",
        "option": "3회",
        "orig": 180000,
        "price": 70000
      }
    ]
  },
  {
    "name": "리투오 특별 이벤트",
    "items": [
      {
        "name": "리투오(1EA) + 물광주사 2.5cc",
        "option": "1회",
        "orig": 590000,
        "price": 390000
      },
      {
        "name": "[변경] 더마샤인 시술로 변경",
        "option": "추가금",
        "price": 30000,
        "note": "기본 구성가에 추가되는 금액"
      },
      {
        "name": "[변경] 캐뉼라 시술로 변경",
        "option": "추가금",
        "price": 100000,
        "note": "기본 구성가에 추가되는 금액"
      }
    ]
  },
  {
    "name": "올인원 원데이 패키지",
    "items": [
      {
        "name": "원데이 스킨부스터 패키지 (영양 수분 재생)",
        "option": "1회",
        "price": 200000,
        "note": "히알루론산 2.5cc + PDRN 1.5cc, 스킨보톡스, 트라넥삼산, 태반주사"
      },
      {
        "name": "원데이 이중턱 슬림 패키지",
        "option": "1회",
        "price": 210000,
        "note": "인모드 FX + 윤곽주사 10cc, 침샘 보톡스 50유닛 + 턱 보톡스 50유닛(필요시 턱 라인 스킨보톡스로 변경)"
      },
      {
        "name": "원데이 모공 축소 패키지",
        "option": "1회",
        "price": 280000,
        "note": "피코 프락셀, 히알루론산 2.5cc + PDRN 1.5cc + 스킨보톡스 or 트라넥삼산 1cc, 코모공주사"
      }
    ]
  },
  {
    "name": "서울뷰 3회 패키지 이벤트",
    "items": [
      {
        "name": "눈밑 주름 개선 패키지",
        "option": "3회",
        "price": 200000,
        "note": "아이슈링크 100샷 3회, 재생주사(PDRN 1cc) 3회"
      },
      {
        "name": "여드름 집중치료 패키지",
        "option": "3회",
        "price": 590000,
        "note": "골드 PTT 3회, 얼굴전체 제모 3회, 염증주사/재생주사·약/연고 처방(필요 시)"
      },
      {
        "name": "태반 주사 패키지",
        "option": "3회",
        "price": 90000,
        "note": "태반주사 3회, 최대 3세트 결제 가능(총 9회)"
      }
    ]
  },
  {
    "name": "볼링크 이벤트 (볼뉴머 + 슈링크)",
    "items": [
      {
        "name": "볼링크",
        "option": "볼뉴머 300샷 + 슈링크 300샷",
        "price": 550000
      },
      {
        "name": "볼링크",
        "option": "볼뉴머 400샷 + 슈링크 400샷",
        "price": 700000
      },
      {
        "name": "볼링크",
        "option": "볼뉴머 600샷 + 슈링크 600샷",
        "price": 950000,
        "note": "300샷+300샷 2회 시술 또는 2인 분할 가능"
      }
    ]
  },
  {
    "name": "1년 무제한 제모 이벤트",
    "items": [
      {
        "name": "남자 얼굴 전체 (미간, 코, 목 포함)",
        "option": "1년 무제한",
        "price": 690000
      },
      {
        "name": "여자 팔하완 + 종아리",
        "option": "1년 무제한",
        "price": 890000
      },
      {
        "name": "남/녀 브라질리언 (항문 포함)",
        "option": "1년 무제한",
        "price": 790000
      },
      {
        "name": "남자 턱 + 인중",
        "option": "1년 무제한",
        "price": 440000
      }
    ]
  },
  {
    "name": "여성 브라질리언 제모 이벤트",
    "items": [
      {
        "name": "여성 브라질리언 제모 (항문 포함)",
        "option": "5회",
        "price": 500000
      },
      {
        "name": "여성 브라질리언 제모 (항문 포함)",
        "option": "1년 무제한",
        "price": 790000
      }
    ],
    "note": "여자 원장님 시술 지정 가능"
  },
  {
    "name": "위고비/마운자로 처방 환자 특별 이벤트",
    "items": [
      {
        "name": "이중턱 인모드 FX",
        "option": "1회",
        "orig": 120000,
        "price": 80000
      },
      {
        "name": "풀페이스 인모드 FX",
        "option": "1회",
        "orig": 160000,
        "price": 120000
      },
      {
        "name": "이중턱 엑셀웨이브 4만J",
        "option": "1회",
        "orig": 270000,
        "price": 190000
      },
      {
        "name": "페이스 엑셀웨이브 6만J",
        "option": "1회",
        "orig": 390000,
        "price": 290000
      },
      {
        "name": "이중턱 윤곽주사 10cc",
        "option": "1회",
        "orig": 70000,
        "price": 40000
      },
      {
        "name": "복부 바디주사 100cc",
        "option": "1회",
        "orig": 140000,
        "price": 90000
      }
    ],
    "note": "위고비·마운자로 처방 환자 대상"
  }
];

export const PRICE_CATEGORIES: PriceCategory[] = [
  {
    "name": "레이저 치료",
    "groups": [
      {
        "name": "서울뷰 맞춤형 피부 레이저 치료 패키지",
        "notes": [
          "마크뷰 피부진단기 촬영(1·4회차), 맞춤형 레이저 5회, 고휘도 재생 LED+진정관리+모델링팩 5회, 창상피복제 1세트",
          "마크뷰 촬영(1·4·7·10회차), 맞춤형 레이저 10회, LED+진정관리+모델링팩 10회, 창상피복제 1세트"
        ],
        "rows": [
          {
            "option": "5회",
            "price": 750000,
            "type": "비급여가"
          },
          {
            "option": "10회",
            "price": 1390000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "서울뷰 맞춤형 중증 피부 레이저 치료 패키지",
        "notes": [
          "10회 패키지 구성 + 히알루론산 2.5cc + PDRN 1.5cc + 스킨보톡스 or 트라넥삼산 4회"
        ],
        "rows": [
          {
            "option": "10회",
            "price": 1790000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "태반주사 추가 (패키지 시술 환자 전용)",
        "notes": [
          "기미 환자 추천"
        ],
        "rows": [
          {
            "option": "5회",
            "price": 150000,
            "type": "비급여가"
          }
        ]
      }
    ]
  },
  {
    "name": "점/사마귀/쥐젖 제거",
    "groups": [
      {
        "name": "점/사마귀/쥐젖/검버섯/혈관종 제거",
        "notes": [
          "브이 레이저 또는 CO2 레이저"
        ],
        "rows": [
          {
            "option": "0.2cm 크기 이하 1회",
            "price": 9000,
            "type": "비급여가"
          },
          {
            "option": "0.2~0.5cm 크기 1회",
            "price": 19000,
            "type": "비급여가"
          },
          {
            "option": "0.5cm 크기 이상 1회",
            "price": 39000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "쥐젖·편평사마귀·비립종 제거",
        "notes": [],
        "rows": [
          {
            "option": "얼굴 전체(무제한)",
            "price": 500000,
            "type": "특별가"
          },
          {
            "option": "목 전체(무제한)",
            "price": 500000,
            "type": "특별가"
          },
          {
            "option": "얼굴+목 전체(무제한)",
            "price": 900000,
            "type": "특별가"
          }
        ]
      }
    ]
  },
  {
    "name": "여드름/모공/흉터",
    "groups": [
      {
        "name": "서울뷰 여드름 집중치료 패키지",
        "notes": [
          "골드PTT+1064 레이저 3회, 얼굴 전체 제모 3회, 염증주사/재생주사·전문의약품 처방(진료 후 필요 시)"
        ],
        "rows": [
          {
            "option": "패키지",
            "price": 590000,
            "type": "특별가"
          }
        ]
      },
      {
        "name": "서울뷰 맞춤형 모공/흉터 패키지",
        "notes": [
          "쥬베룩 4cc 1회, 맞춤형 레이저(피코 or CO2 프락셀) 4회, 물광주사 2.5cc+PDRN 1.5cc(스킨보톡스 40유닛 or 트라넥삼산 100mg 추가) 4회"
        ],
        "rows": [
          {
            "option": "패키지",
            "price": 1400000,
            "type": "특별가"
          }
        ]
      },
      {
        "name": "골드 PTT + 1064 레이저",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 175000,
            "type": "비급여가"
          },
          {
            "option": "3회",
            "price": 470000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "염증주사",
        "notes": [],
        "rows": [
          {
            "option": "1부위",
            "price": 9000,
            "type": "비급여가"
          },
          {
            "option": "5부위 이상",
            "price": 45000,
            "type": "비급여가"
          }
        ]
      }
    ]
  },
  {
    "name": "보톡스",
    "groups": [
      {
        "name": "턱보톡스",
        "notes": [],
        "rows": [
          {
            "option": "50유닛",
            "price": 40000,
            "type": "국산"
          },
          {
            "option": "50유닛",
            "price": 70000,
            "type": "코어톡스"
          },
          {
            "option": "100유닛",
            "price": 70000,
            "type": "국산"
          }
        ]
      },
      {
        "name": "침샘/광대/측두근 보톡스",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 40000,
            "type": "국산"
          },
          {
            "option": "",
            "price": 70000,
            "type": "코어톡스"
          }
        ]
      },
      {
        "name": "주름 보톡스",
        "notes": [
          "주름: 이마·미간·콧등·눈가·눈밑·자갈턱·윗입술·입꼬리·콧볼 중 택"
        ],
        "rows": [
          {
            "option": "1부위",
            "price": 30000,
            "type": "국산"
          },
          {
            "option": "1부위",
            "price": 45000,
            "type": "코어톡스"
          },
          {
            "option": "3부위",
            "price": 80000,
            "type": "국산"
          },
          {
            "option": "3부위",
            "price": 125000,
            "type": "코어톡스"
          },
          {
            "option": "1부위 추가(3부위 이상)",
            "price": 10000,
            "type": "국산"
          }
        ]
      },
      {
        "name": "바디 보톡스",
        "notes": [],
        "rows": [
          {
            "option": "100유닛",
            "price": 120000,
            "type": "국산"
          },
          {
            "option": "100유닛",
            "price": 170000,
            "type": "코어톡스"
          }
        ]
      },
      {
        "name": "다한증 보톡스",
        "notes": [],
        "rows": [
          {
            "option": "100유닛",
            "price": 140000,
            "type": "국산"
          },
          {
            "option": "100유닛",
            "price": 200000,
            "type": "코어톡스"
          }
        ]
      },
      {
        "name": "풀페이스 스킨보톡스",
        "notes": [],
        "rows": [
          {
            "option": "3cc(35유닛)",
            "price": 130000,
            "type": "국산"
          },
          {
            "option": "3cc(35유닛)",
            "price": 180000,
            "type": "코어톡스"
          }
        ]
      },
      {
        "name": "코 모공주사(스킨보톡스+PDRN)",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 50000,
            "type": "국산"
          }
        ]
      },
      {
        "name": "두피 보톡스",
        "notes": [],
        "rows": [
          {
            "option": "50유닛",
            "price": 120000,
            "type": "정가"
          },
          {
            "option": "100유닛",
            "price": 220000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "두피 PDRN 재생주사",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 120000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "제오민 보톡스",
        "notes": [
          "턱/주름/바디/침샘/측두근/스킨보톡스 등 부위 자유 선택, 1인 1병 당일 사용"
        ],
        "rows": [
          {
            "option": "1병(vial) 100유닛",
            "price": 350000,
            "type": "특별가"
          }
        ]
      }
    ]
  },
  {
    "name": "윤곽주사",
    "groups": [
      {
        "name": "V뷰 윤곽주사",
        "notes": [],
        "rows": [
          {
            "option": "10cc 1회",
            "price": 70000,
            "type": "정가"
          },
          {
            "option": "10cc 3회",
            "price": 180000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "바디 윤곽주사",
        "notes": [],
        "rows": [
          {
            "option": "100cc 1회",
            "price": 140000,
            "type": "정가"
          },
          {
            "option": "100cc 3회",
            "price": 360000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "뉴비주",
        "notes": [],
        "rows": [
          {
            "option": "2cc 1회",
            "price": 270000,
            "type": "정가"
          },
          {
            "option": "2cc 3회",
            "price": 700000,
            "type": "정가"
          }
        ]
      }
    ]
  },
  {
    "name": "필러",
    "groups": [
      {
        "name": "국산 아띠에르 필러 (턱/팔자/마리오네트/앞볼/옆볼/눈밑/관자)",
        "notes": [],
        "rows": [
          {
            "option": "1cc",
            "price": 160000,
            "type": "정가"
          },
          {
            "option": "3cc",
            "price": 420000,
            "type": "정가"
          },
          {
            "option": "5cc",
            "price": 600000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "국산 아띠에르 이마필러",
        "notes": [
          "이마, 미간 보톡스 포함"
        ],
        "rows": [
          {
            "option": "3cc",
            "price": 420000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "국산 아띠에르 입술/입꼬리 필러, 눈밑 필러",
        "notes": [],
        "rows": [
          {
            "option": "1cc",
            "price": 200000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "국산 아띠에르 코 필러",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 250000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "국산 아띠에르 특수부위 필러(눈두덩이, 애교)",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 350000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "주름·흉터 필러 (목주름/잔주름/흉터)",
        "notes": [],
        "rows": [
          {
            "option": "1cc당",
            "price": 300000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "필러 녹이기(히알리제)",
        "notes": [
          "용량 많은 경우 여러 차례 가능"
        ],
        "rows": [
          {
            "option": "본원 시술 1회",
            "price": 100000,
            "type": "비급여가"
          },
          {
            "option": "타원 시술 1회",
            "price": 150000,
            "type": "비급여가"
          }
        ]
      }
    ]
  },
  {
    "name": "쥬베룩",
    "groups": [
      {
        "name": "쥬베룩 4cc 반병(vial)",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 300000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 800000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "쥬베룩 볼륨",
        "notes": [
          "부위: 볼, 팔자, 마리오네트 주름"
        ],
        "rows": [
          {
            "option": "반병(vial) 1회",
            "price": 400000,
            "type": "정가"
          },
          {
            "option": "반병(vial) 3회",
            "price": 1100000,
            "type": "정가"
          },
          {
            "option": "1병(vial) 이마 제외 풀페이스 1회",
            "price": 700000,
            "type": "정가"
          },
          {
            "option": "1병(vial) 이마 제외 풀페이스 3회",
            "price": 2000000,
            "type": "정가"
          }
        ]
      }
    ]
  },
  {
    "name": "레이저 제모",
    "groups": [
      {
        "name": "[남녀공통] 미간 제모",
        "notes": [
          "아포지 플러스"
        ],
        "rows": [
          {
            "option": "5회",
            "price": 80000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남녀공통] 헤어라인/이마/미간 제모",
        "notes": [
          "아포지 플러스"
        ],
        "rows": [
          {
            "option": "5회",
            "price": 150000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남녀공통] 뒷목 제모",
        "notes": [
          "아포지 플러스"
        ],
        "rows": [
          {
            "option": "5회",
            "price": 150000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남녀공통] 손가락+손등 제모",
        "notes": [
          "아포지 플러스"
        ],
        "rows": [
          {
            "option": "5회",
            "price": 150000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남녀공통] 발가락+발등 제모",
        "notes": [
          "아포지 플러스"
        ],
        "rows": [
          {
            "option": "5회",
            "price": 150000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 얼굴 전체(미간·코·목 포함)",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 70000,
            "type": "비급여가"
          },
          {
            "option": "5회",
            "price": 300000,
            "type": "비급여가"
          },
          {
            "option": "10회",
            "price": 550000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 턱+인중",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 200000,
            "type": "비급여가"
          },
          {
            "option": "10회",
            "price": 360000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 크라이오 진정관리 추가",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 15000,
            "type": "비급여가"
          },
          {
            "option": "5회",
            "price": 60000,
            "type": "비급여가"
          },
          {
            "option": "10회",
            "price": 100000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 겨드랑이",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 160000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 가슴",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 450000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 배 전체",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 450000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 등",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 550000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 팔 전체",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 500000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 다리 전체",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 800000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[남성] 브라질리언(항문 포함)",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 500000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 겨드랑이+인중(턱 포함)",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 180000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 겨드랑이",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 120000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 인중(턱 포함)",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 120000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 얼굴 전체(미간·코·목앞 포함)",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 250000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 팔 전체",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 350000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 팔 하완",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 250000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 다리 전체",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 600000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 종아리+무릎",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 400000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 베렛나루",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 150000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 비키니라인",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 300000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "[여성] 브라질리언(항문 포함)",
        "notes": [],
        "rows": [
          {
            "option": "5회",
            "price": 500000,
            "type": "비급여가"
          },
          {
            "option": "10회",
            "price": 900000,
            "type": "비급여가"
          }
        ]
      }
    ]
  },
  {
    "name": "리프팅",
    "groups": [
      {
        "name": "슈링크유니버스",
        "notes": [],
        "rows": [
          {
            "option": "300샷",
            "price": 190000,
            "type": "정가"
          },
          {
            "option": "400샷",
            "price": 230000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "아이슈링크",
        "notes": [],
        "rows": [
          {
            "option": "100샷 1회",
            "price": 80000,
            "type": "정가"
          },
          {
            "option": "100샷 3회",
            "price": 200000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "볼뉴머 + LDM",
        "notes": [],
        "rows": [
          {
            "option": "300샷",
            "price": 500000,
            "type": "정가"
          },
          {
            "option": "400샷",
            "price": 650000,
            "type": "정가"
          },
          {
            "option": "600샷",
            "price": 900000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "아이볼뉴머",
        "notes": [],
        "rows": [
          {
            "option": "100샷 1회",
            "price": 150000,
            "type": "정가"
          },
          {
            "option": "100샷 3회",
            "price": 410000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "풀페이스 인모드 FORMA",
        "notes": [],
        "rows": [
          {
            "option": "10kJ 1회",
            "price": 150000,
            "type": "정가"
          },
          {
            "option": "10kJ 3회",
            "price": 410000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "이중턱 인모드 FX",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 120000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 300000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "이중턱 인모드 FX + 윤곽주사 10cc",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 140000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 350000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "풀페이스 인모드 FX",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 160000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 420000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "풀페이스 인모드 FX + 윤곽주사 10cc",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 180000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 460000,
            "type": "정가"
          }
        ]
      }
    ]
  },
  {
    "name": "스킨부스터",
    "groups": [
      {
        "name": "서울뷰 올인원 스킨부스터 패키지",
        "notes": [
          "비급여가 126만원 → 특별가. 히알루론산 2.5cc + PDRN연어주사 1.5cc + 스킨보톡스 or 트라넥삼산"
        ],
        "rows": [
          {
            "option": "7회",
            "price": 1050000,
            "type": "특별가"
          }
        ]
      },
      {
        "name": "서울뷰 올인원 스킨부스터",
        "notes": [
          "히알루론산 2.5cc + PDRN연어주사 1.5cc + 스킨보톡스 or 트라넥삼산"
        ],
        "rows": [
          {
            "option": "1회",
            "price": 180000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 490000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "히알루론산 5cc",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 150000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 410000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "리쥬란 힐러 2cc",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 250000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 600000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "리제반 힐러 2cc",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 200000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 500000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "리쥬란HB plus 1cc",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 130000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 350000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "리쥬란HB plus 2cc",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 250000,
            "type": "정가"
          },
          {
            "option": "3회",
            "price": 300000,
            "type": "정가"
          }
        ]
      }
    ]
  },
  {
    "name": "문신제거",
    "groups": [
      {
        "name": "남녀 문신제거 (250ps 피코레이저)",
        "notes": [
          "그 외 크기는 상담 후 결정"
        ],
        "rows": [
          {
            "option": "500원 동전 크기 · 5회 기준",
            "price": 220000,
            "type": "비급여가"
          },
          {
            "option": "레터링 10cm 이하 · 5회 기준",
            "price": 450000,
            "type": "비급여가"
          },
          {
            "option": "레터링 10~20cm 또는 명함 1장 · 5회 기준",
            "price": 600000,
            "type": "비급여가"
          },
          {
            "option": "명함 2장 · 5회 기준",
            "price": 800000,
            "type": "비급여가"
          },
          {
            "option": "명함 3장 · 5회 기준",
            "price": 1000000,
            "type": "비급여가"
          }
        ]
      }
    ]
  },
  {
    "name": "약처방/위고비/마운자로",
    "groups": [
      {
        "name": "비만약 처방",
        "notes": [],
        "rows": [
          {
            "option": "2주",
            "price": 10000,
            "type": "정가"
          },
          {
            "option": "4주",
            "price": 19000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "탈모약",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 10000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "여드름약/연고 처방",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 10000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "위고비",
        "notes": [
          "부가세 포함"
        ],
        "rows": [
          {
            "option": "0.25mg",
            "price": 269000,
            "type": "특별가"
          },
          {
            "option": "0.5mg",
            "price": 289000,
            "type": "특별가"
          },
          {
            "option": "1.0mg",
            "price": 319000,
            "type": "특별가"
          },
          {
            "option": "1.7mg",
            "price": 399000,
            "type": "특별가"
          },
          {
            "option": "2.4mg",
            "price": 439000,
            "type": "특별가"
          }
        ]
      },
      {
        "name": "마운자로",
        "notes": [
          "부가세 포함"
        ],
        "rows": [
          {
            "option": "2.5mg",
            "price": 329000,
            "type": "특별가"
          },
          {
            "option": "5.0mg",
            "price": 429000,
            "type": "특별가"
          },
          {
            "option": "7.5mg",
            "price": 579000,
            "type": "특별가"
          },
          {
            "option": "10mg",
            "price": 579000,
            "type": "특별가"
          }
        ]
      }
    ]
  },
  {
    "name": "영양주사",
    "groups": [
      {
        "name": "백옥주사(글루타치온)",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 30000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "멀티 비타민 + 신데렐라 항산화 수액",
        "notes": [],
        "rows": [
          {
            "option": "",
            "price": 50000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "비타민D주사 (20만 I.U)",
        "notes": [
          "3개월에 한 번"
        ],
        "rows": [
          {
            "option": "",
            "price": 30000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "태반주사",
        "notes": [
          "복부 지방 1회 주사"
        ],
        "rows": [
          {
            "option": "2앰플·총 4cc",
            "price": 55000,
            "type": "정가"
          }
        ]
      }
    ]
  },
  {
    "name": "피부관리",
    "groups": [
      {
        "name": "아쿠아필(얼굴 전체)",
        "notes": [
          "아쿠아필 1/2제 + 진정관리 + 모델링팩, 다른 시술과 병행 불가"
        ],
        "rows": [
          {
            "option": "1회",
            "price": 60000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "아쿠아필 압출 추가",
        "notes": [],
        "rows": [
          {
            "option": "추가",
            "price": 50000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "압출 + 피부진정관리",
        "notes": [
          "염증주사 필요 시 별도"
        ],
        "rows": [
          {
            "option": "소",
            "price": 60000,
            "type": "비급여가"
          },
          {
            "option": "중",
            "price": 75000,
            "type": "비급여가"
          },
          {
            "option": "대",
            "price": 90000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "LDM 초음파 피부관리",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 50000,
            "type": "비급여가"
          },
          {
            "option": "5회",
            "price": 200000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "LDM 초음파 + 이온토 복합 피부관리",
        "notes": [],
        "rows": [
          {
            "option": "1회",
            "price": 80000,
            "type": "비급여가"
          },
          {
            "option": "5회",
            "price": 360000,
            "type": "비급여가"
          },
          {
            "option": "10회",
            "price": 640000,
            "type": "비급여가"
          }
        ]
      },
      {
        "name": "고주파 얼굴 피부관리",
        "notes": [
          "10분 + 마무리 포함"
        ],
        "rows": [
          {
            "option": "1회",
            "price": 70000,
            "type": "정가"
          },
          {
            "option": "5회",
            "price": 280000,
            "type": "정가"
          }
        ]
      },
      {
        "name": "고주파 바디 피부관리",
        "notes": [
          "20분"
        ],
        "rows": [
          {
            "option": "1회",
            "price": 140000,
            "type": "정가"
          },
          {
            "option": "5회",
            "price": 560000,
            "type": "정가"
          }
        ]
      }
    ]
  },
  {
    "name": "제증명수수료",
    "groups": [
      {
        "name": "진단서",
        "notes": [],
        "rows": [
          {
            "option": "1건(매)",
            "price": 20000,
            "type": "발급 비용"
          }
        ]
      },
      {
        "name": "진료기록부사본(1~5매)",
        "notes": [],
        "rows": [
          {
            "option": "1건(매)",
            "price": 1000,
            "type": "발급 비용"
          }
        ]
      },
      {
        "name": "진료기록부사본(6매 이상)",
        "notes": [],
        "rows": [
          {
            "option": "1건(매)",
            "price": 100,
            "type": "발급 비용"
          }
        ]
      },
      {
        "name": "진료확인서",
        "notes": [],
        "rows": [
          {
            "option": "1건(매)",
            "price": 3000,
            "type": "발급 비용"
          }
        ]
      },
      {
        "name": "향후진료비추정서",
        "notes": [],
        "rows": [
          {
            "option": "1건(매)",
            "price": 50000,
            "type": "발급 비용"
          }
        ]
      }
    ]
  }
];
