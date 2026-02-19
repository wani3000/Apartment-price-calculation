import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 - 아파트 가격 계산기",
  description: "아파트 가격 계산기 이용약관",
};

const EFFECTIVE_DATE = "2026-02-19";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">이용약관</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              1. 서비스 성격
            </h2>
            <p className="text-gray-700 leading-relaxed">
              본 서비스는 아파트 구매 관련 계산 결과를 참고용으로 제공하는 무료
              도구입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              2. 회원가입 및 로그인
            </h2>
            <p className="text-gray-700 leading-relaxed">
              서비스는 회원가입/로그인 없이 이용할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              3. 결과 정보의 한계
            </h2>
            <p className="text-gray-700 leading-relaxed">
              계산 결과는 입력값과 일반적인 가정을 기준으로 산출된 참고치입니다.
              실제 대출 한도 및 조건은 금융기관 심사, 정책 변화, 개인 신용도 등에
              따라 달라질 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              4. 이용자 책임
            </h2>
            <p className="text-gray-700 leading-relaxed">
              이용자는 입력한 정보의 정확성에 책임이 있으며, 최종 투자/매수 판단은
              이용자 본인 책임으로 진행됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              5. 면책
            </h2>
            <p className="text-gray-700 leading-relaxed">
              서비스 제공자는 법령상 허용 범위 내에서 서비스 이용으로 인한 간접적
              손해에 대한 책임을 제한합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              6. 문의
            </h2>
            <p className="text-gray-700 leading-relaxed">
              약관 관련 문의는 GitHub Issues를 통해 접수할 수 있습니다.
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
              7. 원문 문서
            </h2>
            <a
              href="https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/TERMS_OF_USE.md"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              GitHub 이용약관 문서 바로가기
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
