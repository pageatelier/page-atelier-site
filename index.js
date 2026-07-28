(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const target = document.querySelector('.hero-scroll-fade');
  const section = target ? target.closest('section') : null;
  if (!target || !section || prefersReducedMotion) return;

  const update = () => {
    const heroHeight = section.getBoundingClientRect().height || 1;
    const progress = Math.max(0, Math.min(1, window.scrollY / (heroHeight * 0.85)));
    target.style.opacity = String(1 - progress);
    target.style.transform = `translate3d(0, ${(-progress * 32).toFixed(1)}px, 0)`;
  };

  update();
  if (typeof window.__onScroll === 'function') {
    window.__onScroll(update);
  } else {
    window.addEventListener('scroll', update, { passive: true });
  }
})();
