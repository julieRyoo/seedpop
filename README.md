# 🌱 씨드팝 (SeedPop) — 영단어 놀이터

April 어학원 Seed 1 학생들을 위한 인터랙티브 영단어 플래시카드 & 퀴즈 웹 애플리케이션입니다.

---

## 📌 주요 기능
- **플래시카드 학습 (Leitner 5-Box Spaced Repetition)**: 망각 곡선 주기에 따른 과학적 반복 학습
- **단어 퀴즈 (Word Quiz)**: 사지선다 객관식 및 철자 맞추기 퀴즈
- **대시보드 & 통계**: 학습 연속 일수(Streak), 박스별 숙련도 분포, 오늘의 복습 대상 단어 표시
- **단어장 관리 (Word Management)**: 레슨별 단어 조회 및 커스텀 단어 관리
- **발음 듣기 (Web Speech API)**: 원어민 발음 TTS 자동 재생

---

## 📸 단어 사진 추가 워크플로우
교재 사진(촬영본/스크린샷)을 통해 단어를 추가할 때의 표준 절차:
1. **사진 업로드**: 채팅창에 교재 단어 페이지 사진을 업로드하거나 파일 경로 지정
2. **자동 판독**: 표제어(`word`), 복수형(`plural`), 품사(`pos`), 한글 뜻(`definition`), 교재 레슨/페이지(`lesson`) 파싱
3. **발음기호 보강**: IPA 발음기호(`phonics`) 자동 생성
4. **DB 등록**: `default-words.js`에 규격에 맞춰 추가 및 정렬
5. **버전 자동 갱신**: `YYYY.MM.DD.Seq` 규칙으로 `window.APP_VERSION` 판올림 (브라우저 캐시 자동 갱신)
6. **Git 푸시**: `https://github.com/julieRyoo/seedpop.git` 원격 저장소로 반영

---

## 🏷️ 버전 관리 규칙
- **포맷**: `YYYY.MM.DD.순서` (예: `2026.09.28.1`)
- **캐시 버스팅**: `index.html`에서 모든 CSS 및 JS 파일에 `?v=APP_VERSION` 쿼리 파라미터를 부여하여 배포 즉시 사용자 브라우저에 최신 코드가 반영되도록 합니다.
- **LocalStorage 동기화**: `core-state.js`에서 버전 변경 감지 시 저장된 기본 단어장을 새 버전으로 자동 동기화합니다.

---

## 🚀 로컬 실행
```bash
cd seedpop
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```
