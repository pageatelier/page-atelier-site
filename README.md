# PAGE ATELIER — 4 Page Website

정적 사이트입니다. 배포되는 파일(`index.html`, `works.html`, `services.html`,
`contact.html`, `common.css`, `*.css`, `common.js`, `*.js`)은 모두 빌드 결과물이며,
직접 수정하지 말고 아래 소스를 고친 뒤 빌드하세요.

## 소스 구조
- `src/pages/*.html` — 페이지별 고유 콘텐츠 (head, main)
- `src/partials/*.html` — 모든 페이지가 공유하는 조각
  - `skip-link.html`, `header.html`, `mobile-menu.html`, `footer.html`, `kakao-float.html`
  - `header.html`의 `{{CLASS:about|works|services|contact}}`, `{{HREF:cta}}`는
    `scripts/build-html.js`가 페이지별로 채워 넣습니다 (현재 페이지 활성 표시, Start a
    project 버튼 링크).
- `src/common.css`, `src/index.css`, `src/works.css`, `src/services.css`, `src/contact.css`
  — Tailwind 소스. `common.css`는 모든 페이지 공용, 나머지는 페이지 전용 커스텀 클래스.
- `common.js` / `services.js` / `contact.js` — 이미 빌드 결과물 겸 소스 (번들 과정 없음).
  공용 로직은 `common.js`, 아코디언은 `services.js`, 문의 폼은 `contact.js`.

## 빌드
```bash
npm install       # 최초 1회
npm run build      # HTML + CSS 모두 재생성
npm run build:html # HTML만
npm run build:css  # CSS만
```
`src/pages`나 `src/partials`를 고쳤으면 반드시 `npm run build`(또는 `build:html`)를
실행해야 루트의 `index.html` 등에 반영됩니다.

## 공통 요소(헤더/푸터/모바일 메뉴/카카오 버튼) 수정하기
`src/partials/` 안의 해당 파일 하나만 고치고 `npm run build`를 실행하면 4개 페이지
전부에 반영됩니다. 예: 카카오톡 링크는 `src/partials/kakao-float.html`의 `href` 값.

## 사용 전 변경할 항목
- `src/partials/kakao-float.html`의 `href="http://pf.kakao.com/_GxmxdxnX/chat"` — 실제 카카오톡 채널 링크로 교체
- `src/pages/contact.html`의 `hello@pageatelier.kr`, `@pageatelier`, `data-contact-email`

## 배포
`npm run build` 실행 후 루트의 정적 파일들(HTML/CSS/JS, `images/`)을 그대로
GitHub Pages 또는 Cloudflare Pages에 업로드하면 됩니다. `src/`, `scripts/`,
`node_modules/`는 빌드 산출물이 아니므로 배포에 포함할 필요가 없습니다.

## 디자인 시스템
- Main: `#182126`
- Background: `#F3F0E9`
- Accent: `#BFD4DD`, `#527887`
- Display font: Gloock
- Body font: Pretendard
- Tailwind 토큰: `tailwind.config.js` 참고 (color/radius/fontSize/boxShadow/spacing)
