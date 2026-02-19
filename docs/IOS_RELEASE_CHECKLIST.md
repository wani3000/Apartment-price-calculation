# iOS Release Checklist (TestFlight -> App Store)

기준일: 2026-02-19

## 1. 로컬 준비 (완료)
- [x] 웹 빌드 + iOS 동기화: `npm run build:ios`
- [x] iOS 아카이브 생성: `ios/build/aptgugu.xcarchive`
- [x] Bundle ID 확인: `com.aptgugu.calculator`
- [x] 앱 아이콘(1024) 존재 확인: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- [x] 버전/빌드 업데이트: `1.0.1 (2)`
- [x] Export Compliance 사전 설정: `ITSAppUsesNonExemptEncryption = false`

## 2. 앱 출시 문서/링크 (완료)
- [x] Privacy Policy 문서 작성
- [x] Terms of Use 문서 작성
- [x] Support 문서 작성
- [x] App Store Connect 입력용 URL 문서 작성

문서 링크:
- Privacy Policy: https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/PRIVACY_POLICY.md
- Terms of Use: https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/TERMS_OF_USE.md
- Support: https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/SUPPORT.md
- 제출 정보 요약: https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/APP_STORE_SUBMISSION_DATA.md

## 3. 계정/권한 (로그인 필요: 사용자 작업)
- [ ] Xcode > Settings > Accounts 에서 App Store Connect 계정 로그인(2FA 포함)
- [ ] App Store Connect > Users and Access 에서 업로드 계정 권한 부여
- [ ] 권한 수준: 최소 `App Manager` (또는 `Admin`)
- [ ] 해당 앱 접근 권한 허용: `com.aptgugu.calculator`

## 4. 업로드 및 테스트 (로그인 필요: 사용자 작업)
- [ ] Xcode Organizer에서 `Distribute App` -> `Upload`
- [ ] App Store Connect > TestFlight 업로드 확인
- [ ] Internal Testing 그룹/테스터 설정
- [ ] 실제 기기 설치 테스트

## 5. 스토어 메타데이터 입력 (로그인 필요: 사용자 작업)
- [ ] 앱 설명/키워드/카테고리 입력
- [ ] 스크린샷 업로드
- [ ] Privacy Policy URL / Support URL 입력
- [ ] 릴리즈 노트 작성

## 6. 제출 전 최종 체크
- [x] 정책/지원/약관 링크 준비 완료
- [x] 필수 페이지 링크 동작 경로 준비 완료
- [ ] 최종 제출 직전 빌드 상태 및 크래시 재확인
