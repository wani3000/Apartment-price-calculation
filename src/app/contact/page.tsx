import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기 - 아파트 가격 계산기',
  description: '아파트 가격 계산기 서비스에 대한 문의, 피드백, 버그 신고를 할 수 있습니다.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">문의하기</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">📞 서비스 문의</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-blue-800 mb-4">
                  아파트 가격 계산기 서비스에 대한 문의사항이나 개선 제안이 있으시다면 언제든지 연락주세요.
                </p>
                <div className="space-y-3 text-blue-700">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">📧 이메일:</span>
                    <span>support@apartment-calculator.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">⏰ 응답 시간:</span>
                    <span>평일 9:00-18:00 (24시간 내 답변)</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">💬 자주 묻는 질문</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                  <h3 className="font-bold text-green-800 mb-2">Q. 계산 결과가 실제 은행과 다른 이유는?</h3>
                  <p className="text-green-700 text-sm">
                    본 서비스는 일반적인 대출 기준을 바탕으로 계산하며, 실제 은행의 심사 기준, 개인 신용도, 
                    담보물 평가 등에 따라 결과가 달라질 수 있습니다. 정확한 대출 상담은 해당 금융기관에 문의하세요.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                  <h3 className="font-bold text-blue-800 mb-2">Q. 개인정보는 어떻게 처리되나요?</h3>
                  <p className="text-blue-700 text-sm">
                    계산에 입력하신 정보는 서버에 저장되지 않으며, 브라우저에서만 처리됩니다. 
                    개인정보보호를 위해 최소한의 정보만 수집하고 있습니다.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-400 bg-purple-50 p-4 rounded-r-lg">
                  <h3 className="font-bold text-purple-800 mb-2">Q. 서비스 이용료가 있나요?</h3>
                  <p className="text-purple-700 text-sm">
                    아파트 가격 계산기는 완전 무료 서비스입니다. 
                    모든 계산 기능을 제한 없이 무료로 이용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">🐛 버그 신고</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-red-800 mb-4">
                  계산 오류나 사이트 이용 중 문제가 발생했다면 신고해주세요.
                </p>
                <div className="space-y-2 text-red-700 text-sm">
                  <p>• 발생한 문제의 구체적인 상황</p>
                  <p>• 사용하신 브라우저 종류 (Chrome, Safari, Firefox 등)</p>
                  <p>• 모바일/PC 여부</p>
                  <p>• 에러 메시지 스크린샷 (가능한 경우)</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">💡 개선 제안</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-yellow-800 mb-4">
                  더 나은 서비스를 위한 아이디어나 개선사항을 제안해주세요.
                </p>
                <div className="space-y-2 text-yellow-700 text-sm">
                  <p>• 추가했으면 하는 계산 기능</p>
                  <p>• 사용성 개선 아이디어</p>
                  <p>• 새로운 서비스 제안</p>
                  <p>• 디자인 개선사항</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 면책사항</h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700 text-sm">
                  <p>• 본 서비스의 계산 결과는 참고용이며, 실제 대출 승인과는 차이가 있을 수 있습니다.</p>
                  <p>• 정부 정책 변화, 금리 변동 등으로 인한 계산 기준 변경은 사전 고지 없이 이루어질 수 있습니다.</p>
                  <p>• 서비스 이용으로 인한 직간접적 손해에 대해서는 책임지지 않습니다.</p>
                  <p>• 정확한 대출 상담 및 승인은 해당 금융기관에 직접 문의하시기 바랍니다.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 