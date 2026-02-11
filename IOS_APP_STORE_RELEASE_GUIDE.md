# iOS App Store 출시 가이드

## 📱 아파트 대출 계산기 iOS 앱 출시 전략

---

## 1. 출시 방법 선택

현재 프로젝트는 **Next.js 기반 웹 애플리케이션**이므로, iOS 앱으로 출시하는 방법은 크게 3가지가 있습니다.

### 방법 1: 하이브리드 앱 (추천) ⭐

**React Native + WebView 또는 Capacitor 사용**

#### 장점
- 기존 웹 코드를 최대한 재사용
- 개발 기간 및 비용 절감
- 웹과 앱의 동시 업데이트 가능
- 네이티브 기능(푸시 알림, 카메라 등) 접근 가능

#### 단점
- 완전한 네이티브 앱보다 성능이 다소 떨어질 수 있음
- WebView 의존도가 높음

#### 주요 도구
- **Capacitor** (Ionic팀 개발, 추천)
- **React Native WebView**
- **Cordova**

---

### 방법 2: PWA (Progressive Web App)

**웹 앱을 홈 화면에 추가하는 방식**

#### 장점
- 별도의 네이티브 개발 불필요
- 즉시 배포 가능
- 앱스토어 심사 불필요

#### 단점
- ⚠️ **iOS에서 PWA 지원이 제한적** (푸시 알림, 백그라운드 동기화 등 불가)
- App Store에 정식 등록 불가 (노출 효과 없음)
- 네이티브 기능 접근 제한

---

### 방법 3: 완전 네이티브 재개발

**Swift/SwiftUI로 전체 재개발**

#### 장점
- 최고의 성능과 사용자 경험
- 모든 iOS 네이티브 기능 활용 가능
- App Store 심사 통과율 높음

#### 단점
- 개발 기간이 오래 걸림 (3~6개월 이상)
- 개발 비용이 높음
- iOS 전문 개발자 필요
- 웹/안드로이드와 별도 유지보수 필요

---

## 2. 추천 방법: Capacitor를 이용한 하이브리드 앱 개발

### 2.1 Capacitor 소개

Capacitor는 Ionic 팀이 개발한 크로스 플랫폼 네이티브 런타임입니다.
- 웹 기술(HTML, CSS, JS)로 개발한 앱을 iOS/Android 네이티브 앱으로 변환
- Next.js와의 호환성이 우수
- 네이티브 플러그인 생태계가 풍부

---

## 3. Capacitor를 이용한 iOS 앱 개발 단계

### 3.1 사전 준비사항

#### 필수 준비물
1. **Mac 컴퓨터** (iOS 앱 빌드는 macOS에서만 가능)
2. **Apple Developer Account** ($99/년)
   - https://developer.apple.com/programs/
3. **Xcode** (최신 버전)
   - App Store에서 무료 다운로드
4. **CocoaPods** (iOS 의존성 관리 도구)
   ```bash
   sudo gem install cocoapods
   ```

---

### 3.2 프로젝트 설정

#### Step 1: Capacitor 설치

```bash
# Capacitor 설치
npm install @capacitor/core @capacitor/cli

# Capacitor 초기화
npx cap init

# 프롬프트에 응답
# App name: 아파트 대출 계산기
# App package ID: com.aptgugu.calculator (역도메인 형식)
```

#### Step 2: iOS 플랫폼 추가

```bash
# iOS 플랫폼 추가
npm install @capacitor/ios
npx cap add ios
```

#### Step 3: Next.js 빌드 설정 수정

`next.config.js` 파일 수정:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 정적 사이트 생성 (Static Site Generation)
  trailingSlash: true, // URL 끝에 / 추가
  images: {
    unoptimized: true, // 이미지 최적화 비활성화 (정적 빌드용)
  },
}

module.exports = nextConfig
```

⚠️ **주의사항**: 
- Next.js의 서버 사이드 기능(API Routes, getServerSideProps 등)은 사용 불가
- 모든 데이터 fetching은 클라이언트 사이드에서 처리

#### Step 4: Capacitor 설정 파일 수정

`capacitor.config.ts` 파일 수정:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aptgugu.calculator',
  appName: '아파트 대출 계산기',
  webDir: 'out', // Next.js의 정적 빌드 출력 디렉토리
  bundledWebRuntime: false,
  ios: {
    contentInset: 'automatic', // Safe Area 자동 처리
  },
  server: {
    // 개발 중에만 사용 (프로덕션에서는 제거)
    // url: 'http://localhost:3000',
    // cleartext: true,
  }
};

export default config;
```

#### Step 5: 빌드 및 동기화

```bash
# Next.js 프로젝트 빌드
npm run build

# iOS 프로젝트에 웹 파일 동기화
npx cap sync ios

# Xcode에서 프로젝트 열기
npx cap open ios
```

---

### 3.3 Xcode에서 앱 설정

#### Step 1: 프로젝트 기본 설정

1. **Xcode**에서 프로젝트가 열리면 좌측 프로젝트 네비게이터에서 프로젝트 파일 선택
2. **General** 탭에서:
   - **Display Name**: 아파트 대출 계산기
   - **Bundle Identifier**: com.aptgugu.calculator
   - **Version**: 1.0.0
   - **Build**: 1
   - **Deployment Target**: iOS 13.0 이상

#### Step 2: 팀 및 서명 설정

1. **Signing & Capabilities** 탭 선택
2. **Team** 드롭다운에서 Apple Developer 계정 선택
3. **Automatically manage signing** 체크
4. **Bundle Identifier**가 고유한지 확인

#### Step 3: 앱 아이콘 및 스플래시 스크린 설정

**앱 아이콘 준비**:
- 1024x1024px PNG 이미지 필요
- 배경은 투명하지 않아야 함
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/` 폴더에 배치

**스플래시 스크린 설정**:
```bash
# Capacitor Splash Screen 플러그인 설치
npm install @capacitor/splash-screen

# capacitor.config.ts에 추가
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: "#FFFFFF",
    showSpinner: false,
  }
}
```

#### Step 4: Info.plist 설정

권한 설정 (필요한 경우):
- `ios/App/App/Info.plist` 파일 수정
- 카메라, 위치, 알림 등의 권한 추가

```xml
<key>NSCameraUsageDescription</key>
<string>사진 첨부를 위해 카메라 접근이 필요합니다.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>사진 선택을 위해 갤러리 접근이 필요합니다.</string>
```

---

### 3.4 로컬 테스트

#### 시뮬레이터에서 테스트

```bash
# iOS 시뮬레이터에서 실행
npx cap run ios
```

또는 Xcode에서:
1. 상단 툴바에서 시뮬레이터 선택 (예: iPhone 15 Pro)
2. **Run** 버튼 클릭 (⌘ + R)

#### 실제 기기에서 테스트

1. iPhone을 Mac에 USB로 연결
2. Xcode 상단에서 연결된 기기 선택
3. **Run** 버튼 클릭
4. iPhone에서 신뢰 프롬프트 승인

---

## 4. App Store Connect 설정

### 4.1 App Store Connect에 앱 등록

1. **App Store Connect** 접속: https://appstoreconnect.apple.com/
2. **My Apps** → **+** 버튼 → **New App** 클릭
3. 앱 정보 입력:
   - **Platforms**: iOS
   - **Name**: 아파트 대출 계산기
   - **Primary Language**: Korean
   - **Bundle ID**: com.aptgugu.calculator (Xcode에서 설정한 것과 동일)
   - **SKU**: 고유 식별자 (예: APTGUGU-CALC-001)
   - **User Access**: Full Access

---

### 4.2 앱 메타데이터 작성

#### 필수 정보

**1. App Information**
- **Name**: 아파트 대출 계산기
- **Subtitle**: 내 소득으로 살 수 있는 아파트 금액 계산 (30자 제한)
- **Category**: 
  - Primary: Finance
  - Secondary: Lifestyle
- **Content Rights**: 해당 항목 체크

**2. 프로모션 텍스트** (170자)
```
2025년 6.27 규제안 반영! 
연봉과 자산만 입력하면 DSR, LTV를 고려하여 
내가 살 수 있는 아파트 금액을 즉시 계산해드립니다.
전세 활용 vs 실거주 모드 지원!
```

**3. 설명** (Description, 4000자)
```
🏠 아파트 대출 계산기 - 내 소득으로 얼마까지 살 수 있을까?

■ 주요 기능
✓ 연소득과 보유자산 기반 정확한 대출 한도 계산
✓ 전세 활용 (갭투자) vs 실거주 모드 선택 가능
✓ 2025년 6.27 가계부채 관리 강화 방안 반영
✓ 스트레스 DSR (수도��� 1.5%, 지방 0.75%) 자동 적용
✓ DSR 40% 규제, LTV 70% 한도 고려
✓ 배우자 소득 및 자산 합산 계산 지원

■ 이런 분들께 추천합니다
• 생애 첫 아파트 구매를 고민하는 분
• 내 소득으로 어떤 가격대의 아파트를 살 수 있는지 궁금하신 분
• 전세를 활용한 갭투자와 실거주를 비교하고 싶으신 분
• 최신 대출 규제를 반영한 정확한 계산이 필요하신 분

■ 계산 기준
- DSR (총부채원리금상환비율): 40%
- LTV (주택담보대출비율): 70%
- 신용대출: 연소득의 120%
- 스트레스 DSR: 수도권 +1.5%, 지방 +0.75%
- 대출 만기: 30년
- 기준 금리: 3.5%

■ 특징
🔹 복잡한 금융 용어 없이 쉽고 빠른 계산
🔹 실시간 금액 한글 표기 (예: 5억 2,000만 원)
🔹 계산 결과 공유 기능
🔹 부동산 가이드 및 용어 사전 제공

■ 개인정보 보호
- 모든 데이터는 사용자 기기에만 저장
- 서버로 전송되지 않음
- 언제든 삭제 가능

---
📌 문의: contact@aptgugu.com
🌐 웹사이트: https://aptgugu.com
```

**4. 키워드** (100자, 쉼표로 구분)
```
아파트,대출,계산기,DSR,LTV,갭투자,실거주,주택담보대출,부동산,집,내집마련
```

**5. 지원 URL**
```
https://aptgugu.com/help
```

**6. 마케팅 URL** (선택)
```
https://aptgugu.com
```

**7. 개인정보 보호정책 URL**
```
https://aptgugu.com/privacy
```

---

### 4.3 스크린샷 준비

#### 필수 스크린샷 크기

**iPhone 6.7" Display (필수)**
- 해상도: 1290 x 2796 pixels
- 최소 3장, 최대 10장

**iPhone 6.5" Display (필수)**
- 해상도: 1242 x 2688 pixels
- 최소 3장, 최대 10장

**iPad Pro 12.9" Display (선택)**
- 해상도: 2048 x 2732 pixels

#### 스크린샷 촬영 방법

**방법 1: Xcode 시뮬레이터 사용**
```bash
# 시뮬레이터 실행
npx cap run ios

# 시뮬레이터에서: Device > Screenshot
# 또는 ⌘ + S
```

**방법 2: 실제 기기에서 촬영**
- 실제 iPhone에서 앱 실행 후 스크린샷 촬영
- Mac의 QuickTime Player로 iPhone 화면 녹화 가능

**방법 3: 디자인 도구 사용 (추천)**
- Figma, Sketch, Photoshop 등으로 전문적인 스크린샷 제작
- 앱 화면 + 설명 텍스트 + 그래픽 요소 조합

#### 추천 스크린샷 구성

1. **메인 화면** - "내 소득으로 얼마까지 살 수 있을까?"
2. **입력 화면** - 연소득과 자산 입력 화면
3. **계산 결과** - 전세 활용 모드 결과
4. **계산 결과** - 실거주 모드 결과
5. **상세 정보** - DSR, LTV 등 계산 내역

---

### 4.4 앱 심사 정보

**1. App Review Information**
- **First Name / Last Name**: 심사자가 문의할 담당자 이름
- **Phone Number**: +82 10-XXXX-XXXX
- **Email**: contact@aptgugu.com

**2. Demo Account** (로그인이 필요한 경우)
- 현재 앱은 로그인 불필요하므로 생략

**3. Notes** (심사자에게 전달할 메시지)
```
이 앱은 아파트 구매를 위한 대출 한도 계산기입니다.
사용자가 연소득과 보유자산을 입력하면, DSR 및 LTV 규제를 반영하여
구매 가능한 아파트 금액을 계산해줍니다.

모든 데이터는 로컬에만 저장되며, 서버로 전송되지 않습니다.
```

**4. 연령 등급 (Age Rating)**
- 만 4세 이상 (4+)
- 금융 정보 제공 앱이므로 특별한 제한 없음

---

## 5. 앱 빌드 및 제출

### 5.1 Archive 생성

#### Xcode에서 Archive 만들기

1. Xcode 상단 메뉴: **Product** → **Scheme** → **Edit Scheme**
2. **Run** 선택 → **Build Configuration**을 **Release**로 변경
3. 상단 디바이스 선택을 **Any iOS Device (arm64)**로 변경
4. **Product** → **Archive** 클릭
5. 빌드 완료까지 대기 (5~10분 소요)

---

### 5.2 App Store Connect에 업로드

1. Archive가 완료되면 **Organizer** 창이 자동으로 열림
2. 최신 Archive 선택 → **Distribute App** 클릭
3. **App Store Connect** 선택 → **Next**
4. **Upload** 선택 → **Next**
5. 자동 옵션 선택 (기본값 유지) → **Next**
6. 서명 옵션 확인 → **Upload** 클릭
7. 업로드 완료까지 대기 (10~30분)

---

### 5.3 TestFlight 베타 테스트 (선택)

업로드 완료 후, App Store Connect에서:

1. **TestFlight** 탭 이동
2. 업로드된 빌드가 "Processing" 상태로 표시됨 (10~30분 대기)
3. **Internal Testing** 섹션에서 테스터 추가
4. 테스터에게 초대 메일 발송
5. 베타 테스터들이 앱 테스트 진행

**베타 테스트 장점**:
- 실제 사용자 피드백 수집
- 크래시 및 버그 사전 발견
- App Store 심사 전 품질 검증

---

### 5.4 심사 제출

1. **App Store Connect** → **My Apps** → 해당 앱 선택
2. **App Store** 탭 선택
3. 왼쪽 사이드바에서 버전 선택 (예: 1.0.0)
4. 모든 필수 정보 입력 확인:
   - ✅ 스크린샷
   - ✅ 앱 설명
   - ✅ 키워드
   - ✅ 지원 URL
   - ✅ 개인정보 보호정책 URL
   - ✅ 빌드 선택
5. **Add for Review** 버튼 클릭
6. 심사 제출 확인 팝업에서 **Submit** 클릭

---

## 6. 심사 과정 및 대응

### 6.1 심사 소요 시간

- **평균 심사 시간**: 24~48시간
- **빠른 경우**: 12시간 이내
- **느린 경우**: 3~5일

### 6.2 심사 상태

1. **Waiting for Review**: 심사 대기 중
2. **In Review**: 심사 진행 중
3. **Pending Developer Release**: 승인 완료, 개발자가 출시 버튼 클릭 대기
4. **Ready for Sale**: App Store에 정식 출시됨
5. **Rejected**: 거부됨 (사유 확인 후 수정하여 재제출)

---

### 6.3 주요 거부 사유 및 대응

#### 1. **Guideline 2.3.10 - 중복 앱**
- **사유**: 비슷한 계산기 앱이 이미 많음
- **대응**: 
  - 차별화된 기능 강조 (6.27 규제안 반영, 전세 활용 vs 실거주 비교)
  - 앱 설명에 고유한 가치 명확히 기재

#### 2. **Guideline 4.0 - 디자인 품질**
- **사유**: UI가 너무 단순하거나 웹뷰만 사용
- **대응**:
  - 네이티브 UI 요소 추가 (탭바, 네비게이션 바)
  - 스플래시 스크린 및 아이콘 개선
  - 앱다운 UX 제공

#### 3. **Guideline 5.1.1 - 개인정보 수집**
- **사유**: 개인정보 처리방침 누락 또는 불명확
- **대응**:
  - 명확한 개인정보 보호정책 URL 제공
  - 데이터 수집 항목 명시 (현재 앱은 로컬 저장만 사용)

#### 4. **Guideline 2.1 - 앱 완성도**
- **사유**: 버그, 크래시, 링크 오류
- **대응**:
  - 철저한 테스트 (시뮬레이터 + 실제 기기)
  - 모든 링크 작동 확인
  - 크래시 로그 모니터링

---

### 6.4 거부 시 대응 절차

1. **Resolution Center**에서 거부 사유 확인
2. 문제 수정 (코드, 메타데이터, 스크린샷 등)
3. 수정 사항을 **Notes**에 작성
4. 재제출 (Resubmit)

---

## 7. 출시 후 관리

### 7.1 앱 업데이트

#### 코드 수정 시

```bash
# 1. Next.js 코드 수정
# 2. 빌드
npm run build

# 3. 동기화
npx cap sync ios

# 4. 버전 업데이트 (Xcode에서)
# Version: 1.0.0 → 1.0.1
# Build: 1 → 2

# 5. Archive 생성 및 업로드 (Section 5 참고)
```

#### 메타데이터만 수정 시
- App Store Connect에서 직접 수정 가능
- 새로운 빌드 업로드 불필요

---

### 7.2 사용자 리뷰 관리

- **App Store Connect** → **Ratings and Reviews**에서 확인
- 부정적 리뷰에 정중하게 답변
- 피드백을 반영하여 지속적인 개선

---

### 7.3 분석 및 모니터링

#### App Store Connect Analytics
- 다운로드 수
- 일간/주간/월간 활성 사용자 (DAU/WAU/MAU)
- 재방문율
- 크래시 로그

#### Firebase Analytics (선택)
```bash
npm install @capacitor-firebase/analytics
```

---

## 8. 비용 정리

| 항목 | 비용 | 주기 |
|------|------|------|
| Apple Developer Program | $99 | 연간 |
| Mac 컴퓨터 (없는 경우) | $1,000+ | 1회 |
| Xcode | 무료 | - |
| Capacitor | 무료 | - |
| 앱 아이콘/스크린샷 디자인 (외주 시) | $100~$500 | 1회 |
| **총 최소 비용** | **$99** (Mac 보유 시) | 연간 |

---

## 9. 타임라인 예상

| 단계 | 소요 시간 |
|------|----------|
| Capacitor 설정 및 iOS 프로젝트 생성 | 1~2일 |
| 앱 아이콘, 스플래시 스크린 제작 | 1~2일 |
| Xcode 설정 및 로컬 테스트 | 1~2일 |
| 스크린샷 및 메타데이터 작성 | 2~3일 |
| App Store Connect 설정 | 1일 |
| TestFlight 베타 테스트 (선택) | 1주 |
| 앱 심사 대기 및 승인 | 1~3일 |
| **총 예상 기간** | **2~3주** |

---

## 10. 체크리스트

### 출시 전 필수 체크리스트

- [ ] Mac 컴퓨터 준비
- [ ] Apple Developer 계정 등록 ($99)
- [ ] Xcode 최신 버전 설치
- [ ] Capacitor 설치 및 iOS 프로젝트 생성
- [ ] Next.js 정적 빌드 설정 (output: 'export')
- [ ] 앱 아이콘 제작 (1024x1024px)
- [ ] 스플래시 스크린 제작
- [ ] 시뮬레이터 및 실제 기기에서 테스트
- [ ] 스크린샷 5장 이상 준비
- [ ] 앱 설명, 키워드, 카테고리 작성
- [ ] 개인정보 보호정책 페이지 확인
- [ ] Archive 생성 및 App Store Connect 업로드
- [ ] App Store Connect에서 메타데이터 입력
- [ ] TestFlight 베타 테스트 (선택)
- [ ] 심사 제출
- [ ] 심사 통과 후 출시

---

## 11. 유용한 리소스

### 공식 문서
- [Apple Developer](https://developer.apple.com/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Capacitor 공식 문서](https://capacitorjs.com/docs)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### 커뮤니티
- [Capacitor Community](https://github.com/capacitor-community)
- [Stack Overflow - Capacitor](https://stackoverflow.com/questions/tagged/capacitor)

### 도구
- [App Icon Generator](https://www.appicon.co/)
- [Screenshot Builder](https://www.screely.com/)
- [LaunchScreen Storyboard](https://github.com/ionic-team/capacitor-assets)

---

## 12. 결론

현재 **Next.js 웹 앱**을 iOS 앱으로 출시하기 위해서는 **Capacitor를 이용한 하이브리드 앱 개발**이 가장 효율적입니다.

### 장점 요약
✅ 기존 웹 코드 재사용 (개발 기간 단축)  
✅ iOS와 Android 동시 개발 가능  
✅ 웹 업데이트 시 앱도 자동 업데이트 (동기화)  
✅ 네이티브 기능 접근 가능 (플러그인 사용)  

### 예상 비용
- **최소 비용**: $99 (Apple Developer 연회비)
- **Mac 없는 경우**: +$1,000 이상

### 예상 기간
- **개발 및 준비**: 1~2주
- **심사 및 출시**: 1~3일
- **총**: **2~3주**

이 가이드를 따라 진행하시면 성공적으로 iOS App Store에 출시하실 수 있습니다! 🚀
