# App Store Connect 제출 정보 (로그인 작업 제외)

기준일: 2026-02-19

아래 값은 App Store Connect의 텍스트/URL 입력 항목에 바로 사용할 수 있도록 정리한 자료입니다.

## 1. 필수 URL
- Privacy Policy URL
  - https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/PRIVACY_POLICY.md
- Support URL
  - https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/SUPPORT.md
- Terms of Use(선택/필요 시)
  - https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/TERMS_OF_USE.md

## 2. Export Compliance
- Info.plist 설정
  - `ITSAppUsesNonExemptEncryption = false`
- 해석
  - 앱이 비면제 암호화를 직접 구현하지 않음을 선언.

## 3. 개인정보/데이터 처리 요약(설문 입력용)
- 계정 생성: 없음
- 로그인: 없음
- 개인정보 수집: 없음
- 입력 데이터 처리: 기기 로컬 저장소(localStorage) 중심, 서버 전송 없음
- 제3자 추적: 없음

## 4. 리뷰 참고 문구(필요 시)
- 본 앱은 로그인 기능이 없는 계산 도구입니다.
- 사용자 입력값은 계산과 화면 표시를 위해 기기 내에서만 처리되며 서버에 저장하지 않습니다.
