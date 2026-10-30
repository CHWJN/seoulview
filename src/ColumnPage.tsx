import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { COLUMNS_DATA, ColumnBlock } from './data/columnsData.ts';
import { MobileDrawer, MobileBottomBar } from './MobileNav.tsx';
import SiteHeader from './SiteHeader.tsx';
import { LOGO_SRC, openNaverBooking } from './clinicLinks.ts';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
  Check,
  ChevronRight,
  Search,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface ColumnPageProps {
  initialArticleId?: string | null;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateToPrices: () => void;
  onNavigateToEvent: () => void;
}

export default function ColumnPage({
  initialArticleId,
  onNavigateHome,
  onNavigateToPrices,
  onNavigateToEvent
}: ColumnPageProps) {

  // Selected article state (null = show all list, string = show article detail)
  const navigate = useNavigate();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialArticleId || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // 주소(/column/:slug)가 바뀌면 화면도 같이 바뀜 (뒤로가기 포함)
  useEffect(() => {
    setSelectedArticleId(initialArticleId || null);
    if (initialArticleId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialArticleId]);

  // Find active article
  const currentArticle = useMemo(() => {
    if (!selectedArticleId) return null;
    return COLUMNS_DATA.find((item) => item.id === selectedArticleId || item.slug === selectedArticleId) || null;
  }, [selectedArticleId]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Copy Link Helper
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast("칼럼 링크가 클립보드에 복사되었습니다.");
    } else {
      showToast("공유 링크 복사를 지원하지 않는 환경입니다.");
    }
  };

  // SEO & AI Search Engine Schema Injection
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (currentArticle) {
      document.title = `${currentArticle.seoTitle} | 서울뷰의원 당진점 원장칼럼`;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', currentArticle.preview);

      // Inject Schema.org JSON-LD
      const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://seoulview-dangjin.com/column/${currentArticle.slug}`,
            "url": `https://seoulview-dangjin.com/column/${currentArticle.slug}`,
            "name": currentArticle.title,
            "description": currentArticle.preview,
            "about": [
              {
                "@type": "MedicalSpecialty",
                "name": "Dermatology and Aesthetic Medicine"
              },
              ...currentArticle.keywords.map(kw => ({ "@type": "Thing", "name": kw }))
            ],
            "author": {
              "@type": "Physician",
              "name": currentArticle.author.name,
              "jobTitle": currentArticle.author.title,
              "worksFor": {
                "@type": "MedicalOrganization",
                "name": currentArticle.author.clinic,
                "address": "충청남도 당진시 시청2로 49-30, 7층"
              }
            },
            "publisher": {
              "@type": "MedicalOrganization",
              "name": currentArticle.author.clinic,
              "logo": {
                "@type": "ImageObject",
                "url": "https://seoulview-dangjin.com/assets/aistudio/____________c4c3a0ad.png"
              }
            },
            "datePublished": currentArticle.date.replace(/\. /g, '-').replace(/\./g, ''),
            "inLanguage": "ko-KR"
          },
          {
            "@type": "BlogPosting",
            "headline": currentArticle.title,
            "datePublished": currentArticle.date.replace(/\. /g, '-').replace(/\./g, ''),
            "author": {
              "@type": "Person",
              "name": currentArticle.author.name
            },
            "keywords": currentArticle.keywords.join(", ")
          }
        ]
      };

      const existingScript = document.getElementById('column-schema-jsonld');
      if (existingScript) {
        existingScript.textContent = JSON.stringify(schemaData);
      } else {
        const script = document.createElement('script');
        script.id = 'column-schema-jsonld';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemaData);
        document.head.appendChild(script);
      }
    } else {
      document.title = "원장칼럼 | 서울뷰의원 당진점 - 대표원장이 직접 전하는 정직한 피부 의학 인사이트";
      const existingScript = document.getElementById('column-schema-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    }

    return () => {
      const existingScript = document.getElementById('column-schema-jsonld');
      if (existingScript) existingScript.remove();
    };
  }, [currentArticle]);

  // Filtered Articles for List View
  const filteredArticles = useMemo(() => {
    return COLUMNS_DATA.filter(article => {
      const q = searchQuery.trim().toLowerCase();
      return !q ||
        article.title.toLowerCase().includes(q) ||
        article.preview.toLowerCase().includes(q) ||
        article.keywords.some(k => k.toLowerCase().includes(q));
    });
  }, [searchQuery]);

  const selectArticle = (id: string) => {
    const article = COLUMNS_DATA.find((item) => item.id === id || item.slug === id);
    setSelectedArticleId(id);
    navigate(`/column/${article ? article.slug : id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToList = () => {
    setSelectedArticleId(null);
    navigate('/column');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 칼럼 본문 블록 렌더링 (원문 문단 그대로)
  const renderBlock = (block: ColumnBlock, key: number) => {
    switch (block.type) {
      case 'quote':
        return (
          <blockquote key={key} className="border-l-4 border-[#C5A880] bg-[#FAF7F2] px-5 py-4 rounded-r-lg text-[#0F2B22] font-semibold text-sm sm:text-[15px] leading-relaxed">
            “{block.text}”
          </blockquote>
        );
      case 'item':
        return (
          <div key={key} className="bg-[#FAF9F6] border border-[#EBE7E0] rounded-xl p-4 sm:p-5">
            <p className="font-bold text-[#0F2B22] text-sm sm:text-[15px] mb-1">{block.label}</p>
            <p className="text-zinc-700 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line">{block.text}</p>
          </div>
        );
      case 'list':
        return (
          <ul key={key} className="space-y-2 bg-[#FAF9F6] border border-[#EBE7E0] rounded-xl p-4 sm:p-5">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-700 text-sm sm:text-[15px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6895E] shrink-0 mt-2"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      case 'match':
        return (
          <ul key={key} className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 bg-[#FAF9F6] border border-[#EBE7E0] rounded-xl p-4 text-sm sm:text-[15px]">
                <span className="text-zinc-700 flex-1">{item.when}</span>
                <span className="flex items-center gap-1.5 font-bold text-[#0F2B22] shrink-0">
                  <ChevronRight className="w-4 h-4 text-[#A6895E]" />
                  {item.then}
                </span>
              </li>
            ))}
          </ul>
        );
      default:
        return (
          <p key={key} className="leading-relaxed text-zinc-700 text-sm sm:text-[15px] whitespace-pre-line">
            {block.text}
          </p>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111111] selection:bg-[#0F2B22] selection:text-white font-sans pb-14 lg:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0F2B22] text-[#C5A880] px-6 py-3 rounded-xl shadow-lg border border-[#C5A880]/30 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= MAIN HEADER & NAVIGATION (모든 페이지 공용) ================= */}
      <SiteHeader
        onLogo={() => onNavigateHome()}
        onSection={(id) => onNavigateHome(id)}
        onEvent={onNavigateToEvent}
        onPrices={onNavigateToPrices}
        onColumn={backToList}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {/* =========================================================================
          VIEW MODE 1: SINGLE ARTICLE READER VIEW (AI Search & Deep Dive Optimized)
          ========================================================================= */}
      {currentArticle ? (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 animate-in fade-in duration-300">
          {/* Breadcrumb & Navigation Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E5E5E8] mb-8 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <button
                onClick={backToList}
                className="inline-flex items-center gap-1.5 font-bold text-[#0F2B22] hover:text-[#A6895E] transition cursor-pointer bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                칼럼 전체 목록
              </button>
              <span className="text-zinc-300">/</span>
              <span>대표원장 의학 칼럼</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1 bg-white border border-[#E5E5E8] text-zinc-700 hover:border-[#A6895E] px-3 py-1.5 rounded-md transition cursor-pointer font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                공유하기
              </button>
            </div>
          </div>

          <article className="space-y-8">
            {/* Article Header */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={currentArticle.date.replace(/\. /g, '-').replace(/\./g, '')}>{currentArticle.date}</time>
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  {currentArticle.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3.5xl lg:text-4xl font-extrabold text-[#111111] leading-tight tracking-tight">
                {currentArticle.title}
              </h1>

            </header>

            {/* Author Credential Card (E-E-A-T Signal for AI Search) */}
            <section aria-label="칼럼 집필 대표원장 프로필" className="bg-[#FAF9F5] border border-[#E5E0D8] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0F2B22] text-[#C5A880] flex items-center justify-center font-bold text-lg shrink-0 border-2 border-[#C5A880]/40 shadow-inner">
                  의학
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#111111]">{currentArticle.author.name} {currentArticle.author.title}</span>
                    <span className="text-xs font-bold text-[#A6895E] bg-[#A6895E]/10 px-2 py-0.5 rounded">대표원장 직접 집필</span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">{currentArticle.author.clinic} {currentArticle.author.title}</p>
                </div>
              </div>

              <button
                onClick={openNaverBooking}
                className="bg-[#0F2B22] text-white hover:bg-[#173F32] text-xs font-bold px-4 py-2.5 rounded-lg transition shrink-0 cursor-pointer w-full sm:w-auto text-center"
              >
                원장 1:1 상담 요청
              </button>
            </section>

            {/* Article Body Sections */}
            <div className="space-y-10 pt-4 text-zinc-800">
              {currentArticle.sections.map((sec, sIdx) => (
                <section key={sIdx} className="space-y-4">
                  {sec.heading && (
                    <h2 className="text-xl sm:text-2xl font-bold text-[#111111] border-b border-zinc-200 pb-2">
                      {sec.heading}
                    </h2>
                  )}
                  {sec.blocks.map((block, bIdx) => renderBlock(block, bIdx))}
                </section>
              ))}
            </div>

            {/* Bottom Consultation CTA Banner */}
            <div className="bg-gradient-to-r from-[#0F2B22] to-[#173F32] text-white rounded-2xl p-6 sm:p-8 shadow-md mt-10">
              <div className="max-w-2xl">
                <span className="text-xs font-en-cond tracking-widest text-[#C5A880] uppercase font-bold">
                  SEOUL VIEW MEDICAL CONSULTING
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  칼럼 내용과 관련하여 내 피부에 맞춘 정밀 상담이 필요하신가요?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-200 mt-2 leading-relaxed">
                  서울뷰의원 당진점은 일률적인 공장형 시술을 지양합니다. 마크뷰 정밀 진단 후 대표원장이 1:1 맞춤 치료 계획을 수립해 드립니다.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <button
                    onClick={openNaverBooking}
                    className="bg-[#C5A880] hover:bg-[#d6b78d] text-[#111111] font-bold text-xs sm:text-sm px-6 py-3 rounded-lg transition shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    대표원장 1:1 상담 예약하기
                  </button>
                  <button
                    onClick={onNavigateToPrices}
                    className="border border-white/30 hover:border-[#C5A880] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-lg transition cursor-pointer"
                  >
                    상세 비급여 수가표 확인
                  </button>
                </div>
              </div>
            </div>

            {/* Other Recommended Columns */}
            <section className="pt-10 border-t border-[#E5E5E8]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">함께 읽으면 좋은 원장 칼럼</h3>
                  <p className="text-xs text-zinc-500">서울뷰의원 대표원장이 전하는 다른 치료 가이드</p>
                </div>
                <button
                  onClick={backToList}
                  className="text-xs font-bold text-[#0F2B22] hover:underline cursor-pointer"
                >
                  칼럼 전체보기 →
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {COLUMNS_DATA.filter(item => item.id !== currentArticle.id).slice(0, 2).map((other) => (
                  <div
                    key={other.id}
                    onClick={() => selectArticle(other.id)}
                    className="p-5 rounded-xl border border-[#E5E5E8] bg-white hover:border-[#C5A880] transition cursor-pointer flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#111111] group-hover:text-[#0F2B22] transition line-clamp-2">
                        {other.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                        {other.preview}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-[#A6895E]">
                      <span>{other.readTime}</span>
                      <span className="group-hover:translate-x-1 transition">읽어보기 →</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </main>
      ) : (
        /* =========================================================================
            VIEW MODE 2: FULL ARCHIVE / CATALOG LIST VIEW
            ========================================================================= */
        <>
          {/* ================= SUBPAGE HERO BANNER ================= */}
          <section className="bg-gradient-to-r from-[#0F2B22] via-[#12362a] to-[#1a231f] text-white py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A6895E_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
              <div className="max-w-3xl space-y-4">
                <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
                  서울뷰의원 당진점<br />
                  <span className="text-[#C5A880]">대표원장 의학 칼럼</span>
                </h1>
                {/* 상단 배너 설명 문장 (이벤트·수가표 페이지와 같은 양식) */}
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light break-keep">
                  진료실에서 미처 다 전하지 못한 이야기, 시술에 대한 고민과 진심을 이곳에 담았습니다.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                  <span className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#C5A880]" /> 대표원장 100% 직접 집필
                  </span>
                </div>
              </div>
            </div>
          </section>

          <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-16">

          {/* Search & Category Filter */}
          <div className="mb-10 space-y-4">
            <div className="max-w-xl mx-auto relative">
              <input
                type="text"
                placeholder="관심 있는 시술이나 고민을 검색해보세요 (예: 리쥬란, 제모, 이중턱)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5E8] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0F2B22] shadow-xs"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((col) => (
              <article
                key={col.id}
                onClick={() => selectArticle(col.id)}
                className="bg-white rounded-2xl border border-[#E5E5E8] p-7 hover:border-[#C5A880] hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {col.date}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {col.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-[#111111] group-hover:text-[#0F2B22] transition leading-snug line-clamp-2">
                    {col.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-500 mt-3 leading-relaxed line-clamp-3">
                    {col.preview}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {col.keywords.slice(0, 3).map((kw, kIdx) => (
                      <span key={kIdx} className="text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E5E8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F2B22]" />
                    <span className="font-medium">대표원장 직접 집필</span>
                  </div>
                  <span className="font-bold text-[#A6895E] group-hover:translate-x-1 transition flex items-center gap-1">
                    칼럼 전문 읽기 →
                  </span>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16 bg-white border border-[#E5E5E8] rounded-2xl max-w-lg mx-auto">
              <BookOpen className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-600 font-semibold text-sm">검색 결과와 일치하는 원장 칼럼이 없습니다.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-[#0F2B22] font-bold hover:underline cursor-pointer"
              >
                전체 칼럼 보기
              </button>
            </div>
          )}

          {/* Bottom Banner */}
          <div className="mt-16 bg-[#0F2B22] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-en-cond tracking-widest text-[#C5A880] font-bold">GENUINE MEDICAL CARE</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">꽃을 보듯 너를, 정직한 진료를 약속합니다</h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
                충남 당진 서울뷰의원은 과잉 진료 없이 환자 개개인의 피부 본연의 건강과 아름다움을 최우선으로 합니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={openNaverBooking}
                className="bg-[#C5A880] text-[#111111] font-bold text-xs sm:text-sm px-5 py-3 rounded-lg hover:bg-[#d6b78d] transition cursor-pointer"
              >
                온라인 진료 예약
              </button>
              <button
                onClick={onNavigateToPrices}
                className="border border-white/30 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-lg hover:border-[#C5A880] transition cursor-pointer"
              >
                비급여 수가표 보기
              </button>
            </div>
          </div>
        </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-[#071510] text-zinc-400 py-12 border-t border-[#C5A880]/20 text-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={LOGO_SRC}
                  alt="꽃을보듯너를 서울뷰의원 당진"
                  className="h-10 w-auto object-contain filter drop-shadow-sm"
                />
              </div>
              <p className="text-zinc-400 leading-relaxed">
                상호명: 서울뷰의원 당진점 | 대표자: 박상덕 | 사업자등록번호: 109-26-65111<br />
                주소: 충청남도 당진시 시청2로 49-30, 7층 | 대표전화: 041-352-3994<br />
                본 칼럼의 모든 의학 정보 및 저작권은 서울뷰의원 당진점에 있으며 무단 전재 및 재배포를 금합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold self-start md:self-auto">
              <button onClick={() => onNavigateHome()} className="hover:text-white transition cursor-pointer">홈페이지</button>
              <button onClick={onNavigateToEvent} className="hover:text-white transition cursor-pointer">이벤트</button>
              <button onClick={onNavigateToPrices} className="hover:text-white transition cursor-pointer">비급여 수가표</button>
              <button onClick={() => onNavigateHome('sec-location')} className="hover:text-white transition cursor-pointer">오시는 길</button>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-zinc-500 gap-2">
            <p>© {new Date().getFullYear()} 꽃을보듯너를 서울뷰의원 당진점. All Rights Reserved.</p>
            <p className="text-[11px]">Designed & Verified for Medical AI Search Optimization (Schema.org / GEO)</p>
          </div>
        </div>
      </footer>

      {/* 모바일 메뉴 · 하단 메뉴바 */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigateHome={onNavigateHome}
        onNavigateEvent={onNavigateToEvent}
        onNavigatePrices={onNavigateToPrices}
        onNavigateColumn={backToList}
      />
      <MobileBottomBar onNavigateHome={onNavigateHome} onNavigateEvent={onNavigateToEvent} />
    </div>
  );
}
