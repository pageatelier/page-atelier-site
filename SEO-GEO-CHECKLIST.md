# PAGE ATELIER SEO · GEO 배포 체크

코드에 반영된 항목
- 한국어 문서 언어: ko-KR
- 검색 의도를 반영한 title / description
- canonical
- index/follow robots meta
- Open Graph / Twitter 카드
- 1200×630 OG 이미지
- Organization / WebSite / WebPage / Service JSON-LD
- 사업자명, 이메일, 사업자등록번호, 인스타그램 sameAs 연결
- 대한민국 서비스 지역(areaServed)
- START / STANDARD 가격 정보 구조화
- robots.txt
- sitemap.xml
- 표준 HTML 본문 유지
- 모바일 반응형 유지

배포 후 반드시 직접 해야 하는 것
1. Google Search Console에서 https://pageatelier.com/ 소유권 확인
2. 발급받은 google-site-verification 값을 index.html 주석 위치에 추가
3. Search Console에 https://pageatelier.com/sitemap.xml 제출
4. URL 검사에서 메인 URL 색인 요청
5. 네이버 서치어드바이저에서 https://pageatelier.com/ 사이트 등록 및 소유확인
6. 발급받은 naver-site-verification 값을 index.html 주석 위치에 추가
7. 네이버에 sitemap.xml 제출 및 robots.txt 수집/검증
8. Google Rich Results Test에서 구조화 데이터 확인
9. 배포 후 https://pageatelier.com/og-image.png 와 카카오톡 공유 미리보기 확인

참고
- 별도의 'GEO 전용 메타태그'나 llms.txt를 검색 순위 보장용으로 넣지 않았습니다.
- AI 검색 노출도 기본적으로 크롤링·색인 가능한 명확한 HTML, 신뢰 가능한 콘텐츠, 구조화 데이터가 핵심입니다.
- robots.txt의 User-agent: * / Allow: / 규칙은 일반 검색로봇과 허용 규칙을 따르는 AI 검색 크롤러의 접근을 막지 않습니다.
