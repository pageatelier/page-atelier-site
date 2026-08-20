# PAGE ATELIER — GEO/AEO 확장본

현재 업로드한 `index.html`, `styles.css`, `script.js`, `sitemap.xml`, `robots.txt`를 기준으로 검색/AI 검색을 고려한 콘텐츠 구조를 추가한 배포용 폴더입니다.

## 추가된 구조

- `/guide/` — 홈페이지 제작 질문형 가이드 허브
  - `landing-page-cost`
  - `instagram-vs-website`
  - `website-monthly-cost`
  - `small-business-website`
  - `website-seo`
- `/industries/` — 업종별 홈페이지 제작 허브
  - `/industries/academy/` — 학원 홈페이지 제작
  - `pilates`
  - `tax-accountant`
  - `restaurant`
- `/works/` — 제작 사례 허브
  - `/works/gravity/` — Gravity 음악학원 제작 사례
  - `humming-pilates`
  - `sydney-seoul`
  - `keesun-tax`
- `content.css` — 위 콘텐츠 페이지 및 메인에 추가된 가이드 섹션 스타일
- `sitemap.xml` — 모든 신규 URL 포함
- `robots.txt` — 전체 크롤링 허용 + OAI-SearchBot 명시 허용
- `_headers` — Cloudflare Pages용 기본 보안 헤더

## 기존 메인에 추가한 것

1. PAGE ATELIER가 어떤 업체인지 명확히 설명하는 소개 문단
2. 가이드 3개를 연결하는 내부 링크 섹션
3. 푸터의 `가이드 / 업종별 홈페이지 / 제작 사례` 링크
4. 메타 설명에 SEO + AI 검색 고려 문구 반영

## 배포 방법

현재 사용 중인 프로젝트 루트에 이 폴더의 파일과 폴더를 그대로 합치면 됩니다. Cloudflare Pages에서 루트 폴더를 배포하면 `/guide/...`, `/industries/...`, `/works/...` 경로가 각각 `index.html`을 사용합니다.

## 꼭 확인할 것

- 업로드된 파일에는 현재 사이트에서 사용하는 이미지 파일(`assets/*.webp`, `assets/*.png`)과 `favicon.ico`, `og-image.png`가 포함되어 있지 않았습니다. **기존 프로젝트의 assets 폴더와 favicon/OG 이미지는 그대로 유지하세요.** 이 패키지의 `assets` 폴더에는 안내 파일만 있습니다.
- `works/keesun-tax/`는 업로드된 메인에서 확인 가능한 실제 고객 후기만 사용했습니다. 상세 프로젝트 범위, 라이브 URL, 구체적인 작업 내용은 실제 정보 확인 후 추가하세요.
- 검색/AI 답변 노출은 보장할 수 없습니다. 이 구조는 크롤링, 색인, 명확한 질문-답변 콘텐츠, 내부 링크와 구조화 데이터를 준비하는 기본 세팅입니다.
- 배포 후 Google Search Console과 네이버 서치어드바이저에서 `https://pageatelier.com/sitemap.xml`을 다시 제출/확인하세요.


## 2026-08-20 UI 통일 업데이트
- GUIDE / 업종별 제작 / 제작사례의 헤더를 메인 index.html과 동일한 PAGE ATELIER 헤더로 통일
- 모든 서브페이지 하단 CTA를 메인의 보라색 FINAL CTA 디자인으로 통일
- 모든 서브페이지 푸터를 메인의 사업자정보 + Instagram + TOP 구조로 통일
- 서브페이지 헤더 메뉴는 메인 섹션(/#why, /#work, /#process, /#price, /#preview)으로 연결
- 포트폴리오 더 보기 버튼은 /works/로 연결
