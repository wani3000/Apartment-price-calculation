import type { Metadata } from 'next';
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: '도움말 - 아파트 가격 계산기',
  description: '아파트 가격 계산기 사용법과 부동산 관련 용어 설명',
};

export default function HelpPage() {
  return (
    <div
      className="min-h-[100dvh] bg-gray-50"
      style={{
        paddingTop: "calc(var(--page-header-offset) + env(safe-area-inset-top) + 16px)",
        paddingBottom: "32px",
      }}
    >
      <Header showMenu={false} />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">도움말</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">🔍 계산기 사용법</h2>
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">1단계: 개인정보 입력</h3>
                  <div className="space-y-2 text-blue-700 text-sm">
                    <p>• <strong>닉네임:</strong> 결과 화면에 표시될 이름</p>
                    <p>• <strong>연소득:</strong> 세전 연봉 (부부 합산 가능)</p>
                    <p>• <strong>보유자산:</strong> 예금, 적금, 주식 등 모든 자산</p>
                    <p>• <strong>기존 대출:</strong> 현재 갚고 있는 모든 대출의 월 상환액</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-3">2단계: 계산 방식 선택</h3>
                  <div className="space-y-2 text-green-700 text-sm">
                    <p>• <strong>실거주:</strong> 실제 거주 목적, 높은 LTV 적용</p>
                    <p>• <strong>갭투자:</strong> 투자 목적, 신용대출 활용 가능</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">3단계: 결과 확인</h3>
                  <div className="space-y-2 text-gray-800 text-sm">
                    <p>• 구매 가능한 최대 아파트 가격</p>
                    <p>• 필요한 자기자본 (계약금 + 중도금)</p>
                    <p>• 월 상환액 예상치</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">📚 부동산 용어 설명</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">DSR (총부채원리금상환비율)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    개인의 연소득 대비 모든 대출의 연간 원리금 상환액 비율
                  </p>
                  <div className="bg-yellow-50 p-3 rounded text-yellow-800 text-xs">
                    <strong>계산 공식:</strong> (모든 대출 월상환액 × 12) ÷ 연소득 × 100
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">LTV (주택담보대출비율)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    주택 가격 대비 담보대출 금액의 비율
                  </p>
                  <div className="bg-yellow-50 p-3 rounded text-yellow-800 text-xs">
                    <strong>계산 공식:</strong> 담보대출 금액 ÷ 주택 가격 × 100
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">갭투자</h3>
                  <p className="text-gray-700 text-sm">
                    전세가와 매매가의 차이(갭)만큼만 자기자본을 투입하여 
                    부동산을 구매하는 투자 방식
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">스트레스 DSR</h3>
                  <p className="text-gray-700 text-sm">
                    금리 상승 리스크를 반영하여 현재 금리에 일정 비율을 
                    가산한 금리로 DSR을 계산하는 방식
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">💡 계산 팁</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">✅ 정확한 계산을 위해</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>세전 연봉을 정확히 입력하세요</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>부부 합산 소득이 유리할 수 있습니다</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>모든 자산을 포함해서 입력하세요</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>기존 대출은 월 상환액 기준입니다</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">⚠️ 주의사항</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>실제 은행 심사는 더 까다로울 수 있습니다</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>신용등급에 따라 한도가 달라집니다</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>금리 변동으로 월 상환액이 변할 수 있습니다</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>추가 비용(취득세, 등록세)을 고려하세요</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">🏦 대출 관련 정보</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                  <h3 className="font-bold text-blue-800 mb-2">주택담보대출 한도</h3>
                  <div className="space-y-1 text-blue-700 text-sm">
                    <p>• 실거주 목적: 최대 70% (생애최초 80%)</p>
                    <p>• 투자 목적: 최대 60%</p>
                    <p>• 다주택자: 최대 40%</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="font-bold text-green-800 mb-2">신용대출 한도</h3>
                  <div className="space-y-1 text-green-700 text-sm">
                    <p>• 일반적으로 연소득의 120%까지</p>
                    <p>• 신용등급에 따라 차등 적용</p>
                    <p>• DSR 한도 내에서 승인</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <h3 className="font-bold text-yellow-800 mb-2">금리 정보</h3>
                  <div className="space-y-1 text-yellow-700 text-sm">
                    <p>• 주택담보대출: 연 3-5% (시장 상황에 따라 변동)</p>
                    <p>• 신용대출: 연 4-15% (신용등급별 차등)</p>
                    <p>• 변동금리와 고정금리 선택 가능</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">❓ 자주 묻는 질문</h2>
              <div className="space-y-4">
                <details className="group border border-gray-200 rounded-lg">
                  <summary className="flex justify-between items-center p-4 font-semibold text-gray-800 cursor-pointer">
                    계산 결과가 실제와 다를 수 있나요?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-700 text-sm">
                    네, 가능합니다. 본 계산기는 일반적인 기준을 적용하며, 실제 은행은 개별 심사를 통해 
                    신용도, 직업 안정성, 담보물 가치 등을 종합적으로 평가합니다.
                  </div>
                </details>
                
                <details className="group border border-gray-200 rounded-lg">
                  <summary className="flex justify-between items-center p-4 font-semibold text-gray-800 cursor-pointer">
                    부부 합산 소득으로 계산해도 되나요?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-700 text-sm">
                    네, 부부가 공동으로 대출을 받는 경우 합산 소득으로 계산하는 것이 정확합니다. 
                    다만 두 분 모두 소득이 있어야 합니다.
                  </div>
                </details>
                
                <details className="group border border-gray-200 rounded-lg">
                  <summary className="flex justify-between items-center p-4 font-semibold text-gray-800 cursor-pointer">
                    갭투자와 실거주 중 어떤 것이 유리한가요?
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-700 text-sm">
                    상황에 따라 다릅니다. 실거주는 높은 LTV를 적용받지만 거주 의무가 있고, 
                    갭투자는 신용대출을 활용할 수 있지만 투자 리스크가 있습니다.
                  </div>
                </details>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 
