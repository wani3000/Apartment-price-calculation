# UI Style Baseline (Snapshot)

기준일: 2026-02-13  
목적: UI 수정 시 기존 스타일 일관성 유지용 내부 기준

## Core Tone
- 배경: `bg-white`
- 보조 배경: `bg-[#F8F9FA]`, `bg-blue-50`, `bg-gray-50`
- 경계선: `border-grey-40`, `border-gray-100`, `border-blue-200`
- 주요 포인트 컬러: `#000000` (`bg-primary`, `text-primary`)

## Typography
- 제목: `text-2xl font-bold leading-8 tracking-[-0.24px]`
- 섹션 제목: `text-base font-bold leading-6 tracking-[-0.16px]`
- 본문: `text-sm font-normal leading-5 tracking-[-0.28px]`
- 보조/안내: `text-xs leading-4` ~ `text-[13px] leading-[18px]`

## Form/Input Pattern
- 입력 박스 높이: `h-14`(기본), `h-11`(보조)
- 모서리: `rounded-lg`, `rounded-xl`
- 포커스: `border-2 border-primary`
- 기본: `border border-grey-40 bg-white`

## Button Pattern
- 하단 CTA: `h-14 rounded-[300px] bg-primary text-white`
- 보조 버튼: `border border-[#ADB5BD]` + 흰 배경
- 선택 토글: 활성 `border-[#000000] bg-[#F8F9FA]`, 비활성 `border-grey-40 bg-white`

## Layout Pattern
- 페이지 기본: `h-screen bg-white flex flex-col overflow-hidden`
- 스크롤 본문: `flex-1 px-5 overflow-y-auto`
- Safe area 처리:
  - 상단: `paddingTop: calc(var(--page-header-offset) + env(safe-area-inset-top))`
  - 하단: `paddingBottom: calc(var(--page-bottom-cta-offset) + env(safe-area-inset-bottom))`

## Motion / Interaction
- 전환: `transition`, `transition-colors`
- 모바일 스크롤 최적화: `WebkitOverflowScrolling: touch`

## 적용 원칙
1. 신규 UI는 기존 클래스 토큰 우선 재사용
2. 신규 색상 도입 최소화(기존 팔레트 우선)
3. 버튼/입력 높이와 라운드 규칙 유지
4. 레이아웃 safe-area 계산식 유지
