(() => {
  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');

  if (!contactForm) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonContent = submitButton?.innerHTML || '프로젝트 문의 보내기';

  const setStatus = (message) => {
    if (formStatus) {
      formStatus.textContent = message;
    }
  };

  const setSubmitting = (isSubmitting) => {
    if (!submitButton) return;

    submitButton.disabled = isSubmitting;

    if (isSubmitting) {
      submitButton.innerHTML = '문의 보내는 중...';
      submitButton.style.opacity = '0.65';
      submitButton.style.cursor = 'wait';
    } else {
      submitButton.innerHTML = originalButtonContent;
      submitButton.style.opacity = '';
      submitButton.style.cursor = '';
    }
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    setStatus('');

    // HTML의 required 항목 검사
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      setStatus('필수 항목을 모두 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    setStatus('문의 내용을 전송하고 있어요.');

    try {
      const formData = new FormData(contactForm);

      // 메일 제목에 프로젝트 유형 추가
      const project = formData.get('project') || '프로젝트';
      formData.set(
        'subject',
        `[PAGE ATELIER 문의] ${project}`
      );

      const response = await fetch(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || '문의 전송에 실패했습니다.'
        );
      }

      contactForm.reset();

      setStatus(
        '문의가 정상적으로 접수되었습니다. 영업일 기준 24시간 이내 회신드리겠습니다.'
      );
    } catch (error) {
      console.error('PAGE ATELIER contact form error:', error);

      setStatus(
        '문의 전송 중 문제가 발생했습니다. 잠시 후 다시 시도하거나 hello@pageatelier.com으로 연락해 주세요.'
      );
    } finally {
      setSubmitting(false);
    }
  });
})();