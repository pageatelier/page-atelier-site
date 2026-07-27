(() => {
  const serviceRows = document.querySelectorAll('.service-row');
  serviceRows.forEach((row) => {
    const toggle = () => {
      const isOpen = row.classList.toggle('is-open');
      row.setAttribute('aria-expanded', String(isOpen));
    };

    row.addEventListener('click', toggle);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });
})();
