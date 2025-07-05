import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 - 아파트 가격 계산기',
  description: '아파트 가격 계산기 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">개인정보처리방침</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">1. 개인정보의 처리목적</h2>
            <p className="text-gray-700 leading-relaxed">
              아파트 가격 계산기는 다음의 목적을 위하여 개인정보를 처리합니다:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
              <li>아파트 가격 계산 서비스 제공</li>
              <li>서비스 이용통계 분석</li>
              <li>서비스 개선 및 최적화</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">2. 처리하는 개인정보의 항목</h2>
            <p className="text-gray-700 leading-relaxed">
              본 서비스는 다음과 같은 정보를 수집합니다:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
              <li>연봉 정보 (계산 목적)</li>
              <li>접속 로그 (서비스 이용통계)</li>
              <li>IP 주소, 브라우저 정보 (서비스 제공 목적)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">3. 개인정보의 보유 및 이용기간</h2>
            <p className="text-gray-700 leading-relaxed">
              개인정보는 서비스 이용 중에만 보유되며, 브라우저 종료 시 삭제됩니다.
              접속 로그는 서비스 개선 목적으로만 사용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">4. 제3자 제공</h2>
            <p className="text-gray-700 leading-relaxed">
              본 서비스는 개인정보를 제3자에게 제공하지 않습니다. 
              다만, 법적 요구가 있는 경우에는 예외적으로 제공할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">5. 정보주체의 권리·의무</h2>
            <p className="text-gray-700 leading-relaxed">
              이용자는 개인정보 처리에 대한 동의를 거부할 권리가 있습니다.
              다만, 동의 거부 시 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">6. 연락처</h2>
            <p className="text-gray-700 leading-relaxed">
              개인정보처리방침에 관한 문의사항이 있으시면 언제든지 연락 주시기 바랍니다.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            최종 수정일: {new Date().toLocaleDateString('ko-KR')}
          </div>
        </div>
      </div>
    </div>
  );
} 