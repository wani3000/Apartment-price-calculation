import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기 - 아파트 가격 계산기",
  description: "아파트 가격 계산기 지원 및 문의 안내",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">문의하기</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                1. 지원 채널
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                서비스 문의, 버그 신고, 기능 제안은 GitHub Issues에서 접수합니다.
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
                2. 이슈 등록 시 포함하면 좋은 정보
              </h2>
              <div className="bg-gray-100 p-6 rounded-lg text-gray-700 text-sm space-y-2">
                <p>• 사용 기기(iPhone 모델), iOS 버전, 앱 버전</p>
                <p>• 문제 재현 단계(어떤 입력 후 어떤 화면에서 발생했는지)</p>
                <p>• 기대 결과와 실제 결과</p>
                <p>• 가능하면 스크린샷 첨부</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                3. 정책 문서
              </h2>
              <div className="space-y-3">
                <a
                  href="https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/PRIVACY_POLICY.md"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-600 underline"
                >
                  개인정보처리방침
                </a>
                <a
                  href="https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/TERMS_OF_USE.md"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-600 underline"
                >
                  이용약관
                </a>
                <a
                  href="https://github.com/wani3000/Apartment-price-calculation/blob/main/docs/SUPPORT.md"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-600 underline"
                >
                  고객지원 안내
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
