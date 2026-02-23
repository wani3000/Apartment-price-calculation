import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객지원 - 아파트 구구",
  description: "아파트 구구 앱 사용 중 문의, 오류 제보, 개선 요청을 접수하는 고객지원 페이지입니다.",
};

export default function SupportPage() {
  return (
    <div className="min-h-[100dvh] bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">고객지원</h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                1. 문의 접수
              </h2>
              <p className="leading-relaxed mb-3">
                서비스 문의, 오류 제보, 기능 개선 요청은 아래 채널로 접수해 주세요.
              </p>
              <a
                href="https://github.com/wani3000/Apartment-price-calculation/issues"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                GitHub Issues로 문의하기
              </a>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                2. 빠른 처리에 필요한 정보
              </h2>
              <div className="bg-gray-100 rounded-lg p-5 text-sm space-y-2">
                <p>• 사용 기기(iPhone/Android 모델), OS 버전</p>
                <p>• 발생 화면과 재현 순서</p>
                <p>• 기대 결과와 실제 결과</p>
                <p>• 가능하면 스크린샷 첨부</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                3. 데이터 처리 안내
              </h2>
              <p className="leading-relaxed mb-2">
                앱은 주요 입력 데이터를 기기 로컬 저장소에만 저장하며 서버로 전송하지 않습니다.
              </p>
              <p className="leading-relaxed">
                데이터 삭제 방법은 아래 안내 페이지에서 확인할 수 있습니다.
              </p>
              <a href="/data-deletion" className="inline-block mt-3 text-blue-600 underline">
                데이터 삭제 안내 보기
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

