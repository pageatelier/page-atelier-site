(() => {
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

  const yearNodes = document.querySelectorAll('[data-year]');
  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const kakaoFloat = document.querySelector('.kakao-float');
  if (kakaoFloat) {
    const SHOW_AFTER = 200;
    let ticking = false;

    const syncVisibility = () => {
      kakaoFloat.classList.toggle('is-visible', window.scrollY > SHOW_AFTER);
      ticking = false;
    };

    syncVisibility();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(syncVisibility);
        ticking = true;
      }
    }, { passive: true });
  }
})();
