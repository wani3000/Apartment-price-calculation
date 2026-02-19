# iOS Release Checklist (TestFlight -> App Store)

기준일: 2026-02-19

## 1. 로컬 준비 (완료)
- [x] 웹 빌드 + iOS 동기화: `npm run build:ios`
- [x] iOS 아카이브 생성: `ios/build/aptgugu.xcarchive`
- [x] Bundle ID 확인: `com.aptgugu.calculator`
- [x] 앱 아이콘(1024) 존재 확인: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- [x] 버전/빌드 업데이트: `1.0.1 (2)`

## 2. 계정/권한 (사용자 작업 필요)
- [ ] Xcode > Settings > Accounts 에서 App Store Connect 계정 로그인(2FA 포함)
- [ ] App Store Connect > Users and Access 에서 업로드 계정 권한 부여
- [ ] 권한 수준: 최소 `App Manager` (또는 `Admin`)
- [ ] 해당 앱 접근 권한 허용: `com.aptgugu.calculator`

## 3. 업로드 (사용자 작업 필요)
- [ ] Xcode > Window > Organizer
- [ ] 아카이브 선택 후 `Distribute App`
- [ ] `App Store Connect` -> `Upload`
- [ ] 업로드 완료 확인 (App Store Connect > TestFlight)

## 4. TestFlight 내부 테스트 (사용자 작업 필요)
- [ ] Internal Testing 그룹 생성
- [ ] 테스트 빌드 할당
- [ ] 테스터 추가 (이메일)
- [ ] 실제 기기 설치/실행 확인

## 5. 외부 테스트/출시 준비 (사용자 작업 필요)
- [ ] 앱 설명/키워드/카테고리 입력
- [ ] 스크린샷 업로드 (iPhone 사이즈별)
- [ ] 개인정보처리방침 URL 확인
- [ ] Export Compliance 질문 응답
- [ ] 릴리즈 노트 작성

## 6. 제출 전 최종 체크
- [ ] 앱 버전과 빌드번호 재확인 (`1.0.1 (2)`)
- [ ] 크래시/치명 버그 없음
- [ ] 필수 페이지/링크 정상 동작
- [ ] 심사용 계정/설명 필요 시 메모 추가

