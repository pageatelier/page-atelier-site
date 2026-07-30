(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll (desktop wheel/trackpad only — Lenis leaves touch scrolling
  // native by default, which is what keeps mobile performance untouched).
  let lenis = null;
  if (!prefersReducedMotion && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
  window.__lenis = lenis;

  // Shared rAF-throttled scroll hook so per-page scripts (hero fade, works
  // parallax) can react to the smoothed scroll position without each
  // wiring up their own listener.
  window.__onScroll = (callback) => {
    if (lenis) {
      lenis.on('scroll', callback);
      return;
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
    }, { passive: true });
  };

  const body = document.body;
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    mobileMenu?.setAttribute('aria-hidden', String(!open));
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(!body.classList.contains('menu-open'));
  });

  mobileLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Kakao float button: stay hidden until the user scrolls a little, so it
  // never sits on top of hero content right on page load.
  const scrollRevealItems = document.querySelectorAll('[data-scroll-reveal]');
  if (scrollRevealItems.length) {
    const SCROLL_REVEAL_THRESHOLD = 100;
    const updateScrollReveal = () => {
      const shown = window.scrollY > SCROLL_REVEAL_THRESHOLD;
      scrollRevealItems.forEach((item) => item.classList.toggle('is-shown', shown));
    };
    updateScrollReveal();
    window.__onScroll(updateScrollReveal);

    // Belt-and-suspenders: also listen natively, since Lenis's own
    // 'scroll' event doesn't always fire for programmatic/instant jumps.
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        updateScrollReveal();
        scrollTicking = false;
      });
    }, { passive: true });
  }

  const yearNodes = document.querySelectorAll('[data-year]');
  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
