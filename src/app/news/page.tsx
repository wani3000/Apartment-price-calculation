import Link from 'next/link';
import Header from '@/components/Header';

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-5 pt-6 pb-32">
        <Header backUrl="/" />
        
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          부동산 뉴스 & 정보
        </h1>
        
        <div className="space-y-6">
          {/* 최신 정책 소식 */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">📢 최신 정책 소식</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-700 text-xs font-medium bg-blue-100 px-2 py-1 rounded">정책</span>
                  <span className="text-grey-70 text-xs">2025.01.15</span>
                </div>
                <h3 className="text-grey-100 font-bold text-sm mb-2">스트레스 DSR 3단계 시행 임박</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  2025년 7월 1일부터 시행되는 스트레스 DSR 3단계로 인해 
                  대출 한도가 수도권 기준 약 10-15% 감소할 것으로 예상됩니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-700 text-xs font-medium bg-blue-100 px-2 py-1 rounded">금리</span>
                  <span className="text-grey-70 text-xs">2025.01.10</span>
                </div>
                <h3 className="text-grey-100 font-bold text-sm mb-2">주택담보대출 금리 동향</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  시중은행 주택담보대출 금리가 3.5~4.2% 수준에서 형성되고 있으며,
                  향후 한국은행 기준금리 동향에 따라 변동될 전망입니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-700 text-xs font-medium bg-blue-100 px-2 py-1 rounded">규제</span>
                  <span className="text-grey-70 text-xs">2025.01.05</span>
                </div>
                <h3 className="text-grey-100 font-bold text-sm mb-2">투기지역 LTV 규제 현황</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  서울 강남 3구 등 투기지역의 LTV 한도가 실거주 60%, 투자 50%로 
                  제한되어 있어 신중한 자금 계획이 필요합니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* 시장 동향 */}
          <div className="bg-green-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">📊 시장 동향 분석</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-grey-100 font-bold text-sm mb-2">수도권 아파트 시장</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">서울 평균 매매가</span>
                    <span className="text-green-600 text-xs font-semibold">12.5억원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">경기 평균 매매가</span>
                    <span className="text-green-600 text-xs font-semibold">6.8억원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">인천 평균 매매가</span>
                    <span className="text-green-600 text-xs font-semibold">5.2억원</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-grey-100 font-bold text-sm mb-2">전국 주요 도시</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">부산 평균 매매가</span>
                    <span className="text-green-600 text-xs font-semibold">4.1억원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">대구 평균 매매가</span>
                    <span className="text-green-600 text-xs font-semibold">3.2억원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">대전 평균 매매가</span>
                    <span className="text-green-600 text-xs font-semibold">2.8억원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 전세 시장 */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">🏠 전세 시장 현황</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="text-grey-100 font-bold text-sm mb-2">전세가율 동향</h3>
                <p className="text-grey-80 text-xs leading-relaxed mb-3">
                  전세가율은 지역별로 상이하며, 갭투자 시 수익성 판단의 핵심 지표입니다.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">서울 강남구</span>
                    <span className="text-purple-600 text-xs font-semibold">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">서울 강서구</span>
                    <span className="text-purple-600 text-xs font-semibold">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">경기 성남시</span>
                    <span className="text-purple-600 text-xs font-semibold">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-grey-80 text-xs">경기 김포시</span>
                    <span className="text-purple-600 text-xs font-semibold">60%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="text-grey-100 font-bold text-sm mb-2">전세 vs 매매 선택 기준</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-grey-80 text-xs">전세가율 70% 이상: 전세 유리</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-grey-80 text-xs">전세가율 60% 이하: 매매 유리</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-grey-80 text-xs">중간 구간: 개인 상황 고려</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 투자 전망 */}
          <div className="bg-orange-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">🔮 2025년 투자 전망</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-grey-100 font-bold text-sm mb-2">예상 변화 요인</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-orange-700 font-semibold text-xs mb-1">금리 전망</h4>
                    <p className="text-grey-80 text-xs">
                      한국은행 기준금리는 3.5% 수준에서 안정세를 유지할 것으로 예상
                    </p>
                  </div>
                  <div>
                    <h4 className="text-orange-700 font-semibold text-xs mb-1">공급 물량</h4>
                    <p className="text-grey-80 text-xs">
                      수도권 신규 분양 물량 증가로 일부 지역 가격 조정 가능성
                    </p>
                  </div>
                  <div>
                    <h4 className="text-orange-700 font-semibold text-xs mb-1">정책 변화</h4>
                    <p className="text-grey-80 text-xs">
                      스트레스 DSR 도입으로 대출 한도 축소, 신중한 투자 필요
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-grey-100 font-bold text-sm mb-2">투자 전략 제언</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                    <p className="text-grey-80 text-xs">안전 마진을 충분히 확보한 투자</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                    <p className="text-grey-80 text-xs">교통 인프라 개선 지역 주목</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                    <p className="text-grey-80 text-xs">장기적 관점의 자산 배분</p>
                  </div>
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