import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 - 아파트 가격 계산기',
  description: '아파트 가격 계산기 이용약관',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">이용약관</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 아파트 가격 계산기 서비스의 이용조건 및 절차, 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">제2조 (정의)</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>"서비스"란 아파트 가격 계산 및 관련 정보 제공 서비스를 의미합니다.</li>
              <li>"이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">제3조 (서비스의 제공)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 서비스는 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
              <li>연봉 기반 아파트 가격 계산 서비스</li>
              <li>부동산 관련 정보 제공</li>
              <li>기타 부가 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">제4조 (서비스 이용)</h2>
            <p className="text-gray-700 leading-relaxed">
              서비스는 무료로 제공되며, 별도의 회원가입 없이 이용할 수 있습니다.
              다만, 일부 기능은 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">제5조 (광고 및 제휴)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 서비스는 Google AdSense를 통해 광고를 게재합니다. 
              광고 내용에 대한 책임은 해당 광고주에게 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">제6조 (면책사항)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 서비스에서 제공되는 정보는 참고용이며, 실제 부동산 거래 시에는 전문가의 조언을 받으시기 바랍니다.
              서비스 이용으로 인한 손해에 대해서는 책임지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">제7조 (약관의 변경)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 필요에 따라 변경될 수 있으며, 변경된 약관은 웹사이트에 공지됩니다.
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