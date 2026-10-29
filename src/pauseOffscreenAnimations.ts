// 무한 반복 애니메이션이 화면 밖에 있을 때는 멈춰서 스크롤 부담을 줄인다.
const ANIMATED_SELECTOR = [
  '.animate-ping',
  '.animate-pulse',
  '.animate-spin',
  '.animate-bounce',
  '.animate-kenburns',
  '.animate-float',
  '.animate-soft-pulse',
].join(',');

export function pauseOffscreenAnimations() {
  if (typeof IntersectionObserver === 'undefined') return;

  const observed = new WeakSet<Element>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle('anim-paused', !entry.isIntersecting);
    }
  });

  const scan = () => {
    document.querySelectorAll(ANIMATED_SELECTOR).forEach((el) => {
      if (observed.has(el)) return;
      observed.add(el);
      observer.observe(el);
    });
  };

  // 탭 전환·페이지 이동으로 새로 생기는 요소도 감시
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      scan();
    });
  }).observe(document.body, { childList: true, subtree: true });

  scan();
}
