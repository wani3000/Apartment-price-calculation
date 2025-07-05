import Link from 'next/link';
import Header from '@/components/Header';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-5 pt-6 pb-32">
        <Header backUrl="/" />
        
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          부동산 구매 완전 가이드
        </h1>
        
        <div className="space-y-8">
          {/* DSR 가이드 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">💡 DSR(총부채원리금상환비율) 완전 이해</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-grey-100 font-bold mb-2">DSR이란?</h3>
                <p className="text-grey-80 text-sm leading-relaxed">
                  DSR은 연소득 대비 모든 대출의 원리금 상환액 비율입니다. 
                  주택담보대출, 신용대출, 카드론 등 모든 대출이 포함됩니다.
                </p>
              </div>
              
              <div>
                <h3 className="text-grey-100 font-bold mb-2">DSR 한도</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <p className="text-blue-700"><strong>1금융권:</strong> 연소득의 40%</p>
                    <p className="text-blue-700"><strong>2금융권:</strong> 연소득의 50%</p>
                    <p className="text-blue-600 text-xs mt-2">
                      ※ 연소득 1억원 이상 고소득자는 일부 완화 적용
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-grey-100 font-bold mb-2">2025년 스트레스 DSR 3단계</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <p className="text-red-700"><strong>시행일:</strong> 2025년 7월 1일</p>
                    <p className="text-red-700"><strong>수도권:</strong> 기준금리 + 1.5%p로 계산</p>
                    <p className="text-red-700"><strong>지방:</strong> 기준금리 + 0.75%p로 계산</p>
                    <p className="text-red-600 text-xs mt-2">
                      ※ 실제 대출금리는 변경 없음, 한도 계산시만 적용
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* LTV 가이드 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">🏠 LTV(주택담보대출비율) 가이드</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-grey-100 font-bold mb-2">LTV란?</h3>
                <p className="text-grey-80 text-sm leading-relaxed">
                  LTV는 주택 담보가치 대비 대출 금액의 비율입니다. 
                  집 값의 몇 %까지 대출받을 수 있는지를 나타냅니다.
                </p>
              </div>
              
              <div>
                <h3 className="text-grey-100 font-bold mb-2">LTV 한도 (2025년 기준)</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 font-semibold text-sm">실거주용 주택</p>
                    <p className="text-green-600 text-xs">• 일반 지역: 70%</p>
                    <p className="text-green-600 text-xs">• 투기지역: 60%</p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-orange-700 font-semibold text-sm">투자용 주택</p>
                    <p className="text-orange-600 text-xs">• 일반 지역: 60%</p>
                    <p className="text-orange-600 text-xs">• 투기지역: 50%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 갭투자 가이드 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">💰 갭투자 완전 가이드</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-grey-100 font-bold mb-2">갭투자란?</h3>
                <p className="text-grey-80 text-sm leading-relaxed">
                  매매가와 전세가의 차이(갭)만큼 자기자본을 투입하여 
                  부동산을 구매하는 투자 방법입니다.
                </p>
              </div>
              
              <div>
                <h3 className="text-grey-100 font-bold mb-2">갭투자 계산 공식</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <p className="text-purple-700"><strong>필요 자본</strong> = 매매가 - 전세가</p>
                    <p className="text-purple-700"><strong>수익률</strong> = (월세 - 대출이자) ÷ 투입자본</p>
                    <p className="text-purple-600 text-xs mt-2">
                      ※ 전세가율이 높을수록 적은 자본으로 투자 가능
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-grey-100 font-bold mb-2">갭투자 주의사항</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="space-y-1 text-sm">
                    <p className="text-yellow-700">• 전세가 하락 위험</p>
                    <p className="text-yellow-700">• 공실 위험</p>
                    <p className="text-yellow-700">• 금리 상승 위험</p>
                    <p className="text-yellow-700">• 세금 부담 고려</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 대출 상품 비교 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">🏦 주요 대출 상품 비교</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-grey-100 font-bold mb-2">주택담보대출</h3>
                <div className="space-y-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-700 font-semibold text-sm">고정금리형</p>
                    <p className="text-blue-600 text-xs">• 장점: 금리 안정성</p>
                    <p className="text-blue-600 text-xs">• 단점: 초기 금리 높음</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 font-semibold text-sm">변동금리형</p>
                    <p className="text-green-600 text-xs">• 장점: 초기 금리 낮음</p>
                    <p className="text-green-600 text-xs">• 단점: 금리 변동 위험</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-grey-100 font-bold mb-2">신용대출</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-700 font-semibold text-sm">한도: 연소득의 120%</p>
                  <p className="text-orange-600 text-xs">• 갭투자 시 주로 활용</p>
                  <p className="text-orange-600 text-xs">• 주택담보대출 대비 높은 금리</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 실전 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">🎯 실전 구매 팁</h2>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <div>
                  <p className="text-grey-100 font-semibold text-sm">대출 한도 미리 확인</p>
                  <p className="text-grey-80 text-xs">매물 보기 전에 대출 한도를 정확히 파악하세요.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <div>
                  <p className="text-grey-100 font-semibold text-sm">여러 은행 비교</p>
                  <p className="text-grey-80 text-xs">은행별 대출 조건과 금리를 비교해보세요.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <div>
                  <p className="text-grey-100 font-semibold text-sm">총 비용 계산</p>
                  <p className="text-grey-80 text-xs">취득세, 중개수수료 등 부대비용도 고려하세요.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                <div>
                  <p className="text-grey-100 font-semibold text-sm">안전 마진 확보</p>
                  <p className="text-grey-80 text-xs">대출 한도의 80% 수준에서 구매를 검토하세요.</p>
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