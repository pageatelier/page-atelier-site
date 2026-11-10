const serviceData = [
  { image: 'assets/services/wellness-brand-social.webp', alt: '웰니스 브랜드의 인스타그램과 비주얼 아이덴티티 시안', copy: '컬러와 분위기, 다른 스튜디오와 구별되는 강점을 정리합니다.' },
  { image: 'assets/services/wellness-brand-identity.webp', alt: '웰니스 브랜드 아이덴티티와 모바일 웹사이트 목업', copy: '보여줄 정보와 페이지 흐름을 정리합니다.' },
  { image: 'assets/services/mobile-adaptive.webp', alt: '휴대폰 화면으로 구성한 요가와 스트레칭 웹사이트', copy: '카카오톡·전화·예약 링크를 방문자가 찾기 쉽게 연결합니다.' },
  { image: 'assets/services/studio-diseno-websites.webp', alt: '웰니스 스튜디오 웹사이트의 모바일 화면 구성', copy: '검색 도구 등록과 홈페이지 기본 SEO 설정을 지원합니다.' }
];
const buttons = [...document.querySelectorAll('[data-service]')];
const image = document.querySelector('#service-image');
const copy = document.querySelector('#service-copy');
const count = document.querySelector('#service-count');
function selectService(index) {
  const item = serviceData[index];
  buttons.forEach((button, i) => {
    const active = i === index;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  image.src = item.image;
  image.alt = item.alt;
  copy.textContent = item.copy;
  count.textContent = `0${index + 1} / 04　페이지 아뜰리에`;
}
buttons.forEach((button, index) => {
  button.setAttribute('aria-pressed', String(index === 0));
  button.addEventListener('mouseenter', () => selectService(index));
  button.addEventListener('focus', () => selectService(index));
  button.addEventListener('click', () => selectService(index));
});


const story = document.querySelector('.scroll-story');
if (story) {
  const stage = story.querySelector('.scroll-story-stage');
  const lines = [...story.querySelectorAll('.scroll-story-line')];
  const counter = story.querySelector('.scroll-story-count');
  let storyFrame = 0;
  const updateStory = () => {
    cancelAnimationFrame(storyFrame);
    storyFrame = requestAnimationFrame(() => {
      const travel = story.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(.999, Math.max(0, -story.getBoundingClientRect().top / travel));
      const active = Math.floor(progress * lines.length);
      lines.forEach((line, index) => line.classList.toggle('is-active', index === active));
      stage.classList.remove('tone-light', 'tone-dark', 'tone-sage');
      stage.classList.add(['tone-light', 'tone-dark', 'tone-sage'][active]);
      counter.textContent = `0${active + 1} / 03`;
    });
  };
  window.addEventListener('scroll', updateStory, { passive: true });
  window.addEventListener('resize', updateStory);
  updateStory();
}
