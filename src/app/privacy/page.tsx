import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 - 아파트 가격 계산기",
  description: "아파트 가격 계산기 개인정보처리방침",
};

const EFFECTIVE_DATE = "2026-02-19";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          개인정보처리방침
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              1. 수집하는 정보
            </h2>
            <p className="text-gray-700 leading-relaxed">
              서비스는 회원가입/로그인 기능이 없으며 이름, 이메일, 전화번호 등
              이용자를 식별하는 개인정보를 수집하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              2. 입력 데이터 처리
            </h2>
            <p className="text-gray-700 leading-relaxed">
              계산 입력값(예: 연소득, 자산, 기존대출 월 상환액)은 계산 및 화면
              표시를 위해 기기 내 로컬 저장소(localStorage)에 저장될 수 있으며,
              서버로 전송하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              3. 제3자 제공 및 추적
            </h2>
            <p className="text-gray-700 leading-relaxed">
              개인정보 제3자 제공/위탁을 하지 않으며, 광고 식별자 기반 추적을
              수행하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              4. 보관 및 삭제
            </h2>
            <p className="text-gray-700 leading-relaxed">
              로컬 저장 데이터는 이용자가 앱을 삭제하거나 기기 설정에서 앱
              데이터를 삭제하면 제거됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              5. 문의
            </h2>
            <p className="text-gray-700 leading-relaxed">
              정책 관련 문의는 GitHub Issues를 통해 접수할 수 있습니다.
            </p>
            <a
              href="https://github.com/wani3000/Apartment-price-calculation/issues"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              https://github.com/wani3000/Apartment-price-calculation/issues
            </a>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              6. 원문 문서
            </h2>
            <a
              href="https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/PRIVACY_POLICY.md"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              GitHub 개인정보처리방침 문서 바로가기
            </a>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            시행일: {EFFECTIVE_DATE}
          </div>
        </div>
      </div>
    </div>
  );
}
