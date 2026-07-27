(() => {
  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const required = ['name', 'email', 'project', 'message'];
    const missing = required.some((key) => !String(data.get(key) || '').trim());

    if (missing) {
      if (formStatus) formStatus.textContent = '필수 항목을 모두 입력해 주세요.';
      return;
    }

    const email = contactForm.dataset.contactEmail || 'hello@pageatelier.kr';
    const subject = encodeURIComponent(`[PAGE ATELIER 문의] ${data.get('project')}`);
    const bodyText = [
      `이름: ${data.get('name')}`,
      `이메일: ${data.get('email')}`,
      `브랜드/회사: ${data.get('brand') || '-'}`,
      `프로젝트: ${data.get('project')}`,
      `예산: ${data.get('budget') || '-'}`,
      `희망 일정: ${data.get('schedule') || '-'}`,
      '',
      String(data.get('message')),
    ].join('\n');

    if (formStatus) formStatus.textContent = '메일 앱을 열고 있어요.';
    window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  });
})();
