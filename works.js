(() => {
  const AUTOPLAY_DELAY = 5000;
  const RESUME_DELAY = 4000;
  const SWIPE_THRESHOLD = 40;
  const WHEEL_COOLDOWN = 500;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const dots = Array.from(root.querySelectorAll('.carousel-dot'));
    const counter = root.querySelector('.carousel-counter-current');
    const total = slides.length;
    if (total <= 1) return;

    let index = Math.max(slides.findIndex((slide) => slide.classList.contains('is-active')), 0);
    let autoplayTimer = null;
    let resumeTimer = null;

    const pad = (n) => String(n).padStart(2, '0');

    const render = () => {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      if (counter) counter.textContent = pad(index + 1);
    };

    const goTo = (next) => {
      index = ((next % total) + total) % total;
      render();
    };

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
    };

    const pause = () => {
      stopAutoplay();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = null;
    };

    const pauseAndScheduleResume = () => {
      pause();
      resumeTimer = setTimeout(startAutoplay, RESUME_DELAY);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        pauseAndScheduleResume();
      });
    });

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let lockedAxis = null;

    root.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      lockedAxis = null;
      startX = event.clientX;
      startY = event.clientY;
      deltaX = 0;
      pause();
    });

    root.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!lockedAxis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        lockedAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (lockedAxis === 'x') {
        deltaX = dx;
        event.preventDefault();
      }
    }, { passive: false });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      if (lockedAxis === 'x' && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) next(); else prev();
      }
      deltaX = 0;
      lockedAxis = null;
      pauseAndScheduleResume();
    };

    root.addEventListener('pointerup', endDrag);
    root.addEventListener('pointercancel', endDrag);
    root.addEventListener('pointerleave', () => { if (dragging) endDrag(); });

    let wheelCooldown = false;
    root.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (wheelCooldown) return;
      wheelCooldown = true;
      pause();
      if (event.deltaX > 0) next(); else prev();
      pauseAndScheduleResume();
      setTimeout(() => { wheelCooldown = false; }, WHEEL_COOLDOWN);
    }, { passive: false });

    render();
    startAutoplay();
  });
})();
