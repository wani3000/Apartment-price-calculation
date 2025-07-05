import Link from 'next/link';
import Header from '@/components/Header';

export default function DictionaryPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-5 pt-6 pb-32">
        <Header backUrl="/" />
        
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          부동산 용어 사전
        </h1>
        
        <div className="space-y-6">
          {/* 대출 관련 용어 */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">💳 대출 관련 용어</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="text-blue-700 font-bold text-sm mb-2">DSR (Debt Service Ratio)</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  총부채원리금상환비율. 연소득 대비 모든 대출의 원리금 상환액 비율
                </p>
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-blue-600 text-xs">
                    <strong>계산법:</strong> (모든 대출 월상환액 × 12) ÷ 연소득 × 100
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="text-blue-700 font-bold text-sm mb-2">LTV (Loan To Value)</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  주택담보대출비율. 주택 담보가치 대비 대출 금액의 비율
                </p>
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-blue-600 text-xs">
                    <strong>계산법:</strong> 대출금액 ÷ 담보가치 × 100
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="text-blue-700 font-bold text-sm mb-2">DTI (Debt To Income)</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  총부채상환비율. 연소득 대비 주택담보대출 원리금 상환액 비율
                </p>
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-blue-600 text-xs">
                    <strong>계산법:</strong> (주택담보대출 월상환액 × 12) ÷ 연소득 × 100
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="text-blue-700 font-bold text-sm mb-2">스트레스 DSR</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  금리 상승 시나리오를 적용하여 계산하는 DSR. 2025년 7월부터 시행
                </p>
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-blue-600 text-xs">
                    <strong>적용 금리:</strong> 수도권 +1.5%p, 지방 +0.75%p
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 투자 관련 용어 */}
          <div className="bg-green-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">📈 투자 관련 용어</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-green-700 font-bold text-sm mb-2">갭투자</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  매매가와 전세가의 차액만으로 부동산을 구입하는 투자 방법
                </p>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-green-600 text-xs">
                    <strong>필요자금:</strong> 매매가 - 전세가 + 부대비용
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-green-700 font-bold text-sm mb-2">전세가율</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  매매가 대비 전세가의 비율. 갭투자 수익성 판단의 핵심 지표
                </p>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-green-600 text-xs">
                    <strong>계산법:</strong> 전세가 ÷ 매매가 × 100
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-green-700 font-bold text-sm mb-2">수익률</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  투자 원금 대비 연간 수익의 비율
                </p>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-green-600 text-xs">
                    <strong>계산법:</strong> (연간 순수익 ÷ 투자원금) × 100
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-green-700 font-bold text-sm mb-2">레버리지</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  빌린 돈을 활용하여 투자 규모를 키우는 것. 수익과 위험이 모두 확대
                </p>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-green-600 text-xs">
                    <strong>효과:</strong> 자기자본 수익률 증대, 단 위험도 증가
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 세금 관련 용어 */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">💰 세금 관련 용어</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="text-purple-700 font-bold text-sm mb-2">취득세</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  부동산 구입 시 납부하는 세금. 취득가액의 1~3%
                </p>
                <div className="bg-purple-50 rounded p-2">
                  <p className="text-purple-600 text-xs">
                    <strong>세율:</strong> 실거주 1~3%, 투자 1~3% (지역별 차등)
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="text-purple-700 font-bold text-sm mb-2">양도소득세</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  부동산 매도 시 발생한 이익에 대해 납부하는 세금
                </p>
                <div className="bg-purple-50 rounded p-2">
                  <p className="text-purple-600 text-xs">
                    <strong>세율:</strong> 보유기간, 거주기간에 따라 6~75%
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="text-purple-700 font-bold text-sm mb-2">종합부동산세</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  고가 부동산 보유자에게 부과되는 세금. 매년 납부
                </p>
                <div className="bg-purple-50 rounded p-2">
                  <p className="text-purple-600 text-xs">
                    <strong>기준:</strong> 주택 공시가격 9억원 초과 시 부과
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 지역 관련 용어 */}
          <div className="bg-orange-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">🏙️ 지역 관련 용어</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-orange-700 font-bold text-sm mb-2">투기지역</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  부동산 가격이 급등하여 정부가 지정한 규제 지역
                </p>
                <div className="bg-orange-50 rounded p-2">
                  <p className="text-orange-600 text-xs">
                    <strong>현재:</strong> 서울 강남3구, 용산구, 성동구 등
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-orange-700 font-bold text-sm mb-2">투기과열지구</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  투기지역보다 강한 규제가 적용되는 지역
                </p>
                <div className="bg-orange-50 rounded p-2">
                  <p className="text-orange-600 text-xs">
                    <strong>규제:</strong> 분양권 전매제한, 재건축 안전진단 강화
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-orange-700 font-bold text-sm mb-2">조정대상지역</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-2">
                  투기지역 해제 후 일정 기간 유지되는 완충 지역
                </p>
                <div className="bg-orange-50 rounded p-2">
                  <p className="text-orange-600 text-xs">
                    <strong>특징:</strong> 일부 규제 완화, 점진적 정상화
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5">
        <Link href="/calculator" className="flex h-14 w-full justify-center items-center rounded-[300px] bg-primary text-white font-semibold text-base">
          계산기 사용하기
        </Link>
      </div>
    </div>
  );
} 