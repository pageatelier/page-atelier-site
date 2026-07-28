(() => {
  const items = document.querySelectorAll('.accordion-item, .term-item');
  items.forEach((item) => {
    const trigger = item.querySelector(':scope > button');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();
