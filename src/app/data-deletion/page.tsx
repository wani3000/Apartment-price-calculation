import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "데이터 삭제 안내 - 아파트 구구",
  description: "아파트 구구 앱의 로컬 데이터 삭제 방법 안내 페이지입니다.",
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-[100dvh] bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">데이터 삭제 안내</h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                1. 저장되는 데이터
              </h2>
              <p className="leading-relaxed">
                닉네임, 소득/자산 입력값, 계산 옵션 등은 기기 내 로컬 저장소에만 저장됩니다.
                별도의 계정 서버에 저장되지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                2. 데이터 삭제 방법 (iOS)
              </h2>
              <div className="bg-gray-100 rounded-lg p-5 text-sm space-y-2">
                <p>• iPhone 설정 → 일반 → iPhone 저장 공간 → aptgugu 선택</p>
                <p>• 앱 삭제 후 재설치하면 로컬 데이터가 제거됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                3. 데이터 삭제 방법 (Android)
              </h2>
              <div className="bg-gray-100 rounded-lg p-5 text-sm space-y-2">
                <p>• 설정 → 앱 → aptgugu → 저장공간</p>
                <p>• 데이터 삭제를 선택하면 로컬 저장 데이터가 제거됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                4. 문의
              </h2>
              <p className="leading-relaxed">
                데이터 처리 관련 문의는 고객지원 페이지 또는 GitHub Issues로 접수해 주세요.
              </p>
              <a href="/support" className="inline-block mt-3 text-blue-600 underline">
                고객지원 페이지 이동
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

