# Apartment Price Calculation (AptGugu)

Next.js 기반 아파트 구매 가능 금액 계산기입니다.  
실거주/투자 시나리오와 정책 옵션(기존, 6.27, 10.15)을 반영해 결과를 제공합니다.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Capacitor iOS

## Run

```bash
npm install
npm run dev
```

기본 주소: `http://localhost:3000`

## Main Flow

1. `/` 홈
2. `/nickname` 닉네임 입력
3. `/calculator` 소득/자산 입력
4. `/region` 규제지역 선택
5. `/regulation` 정책 선택
6. `/result` 또는 `/result/new-regulation` 또는 `/result/final?regulation=latest`
7. `/result/final` 최종 결과

## Build

```bash
npm run build
```

iOS 동기화 빌드:

```bash
npm run build:ios
```
