import Link from 'next/link';
import Header from '@/components/Header';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-5 pt-6 pb-32">
        <Header backUrl="/" />
        
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          자주 묻는 질문
        </h1>
        
        <div className="space-y-6">
          {/* 계산기 관련 질문 */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">🧮 계산기 사용법</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="text-blue-700 font-bold text-sm mb-2">Q. 계산 결과가 정확한가요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 본 계산기는 현행 DSR, LTV 규정을 반영하여 계산하지만, 실제 대출 승인은 은행별 심사 기준과 개인 신용도에 따라 달라질 수 있습니다. 
                  참고용으로 활용하시고, 정확한 대출 상담은 금융기관에 문의하시기 바랍니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="text-blue-700 font-bold text-sm mb-2">Q. 배우자 소득은 반드시 입력해야 하나요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 필수는 아니지만, 배우자와 함께 대출을 받으실 계획이라면 입력하시는 것이 좋습니다. 
                  합산 소득으로 계산할 때 더 높은 대출 한도를 받을 수 있습니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="text-blue-700 font-bold text-sm mb-2">Q. 기존 대출이 있어도 계산할 수 있나요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 현재 버전에서는 기존 대출을 고려하지 않습니다. 
                  기존 대출이 있으시다면 월 상환액을 차감하여 계산하시거나, 
                  은행에서 정확한 DSR 계산을 받아보시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* 대출 관련 질문 */}
          <div className="bg-green-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">💳 대출 관련 질문</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-green-700 font-bold text-sm mb-2">Q. DSR 40%와 50%의 차이는 무엇인가요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. DSR 40%는 1금융권(시중은행), 50%는 2금융권(저축은행, 캐피탈)에 적용됩니다. 
                  1금융권은 금리가 낮지만 심사가 까다롭고, 2금융권은 금리가 높지만 심사가 상대적으로 수월합니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-green-700 font-bold text-sm mb-2">Q. 스트레스 DSR이 무엇인가요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 2025년 7월부터 시행되는 제도로, 금리 상승 시나리오를 가정하여 DSR을 계산합니다. 
                  수도권은 +1.5%p, 지방은 +0.75%p를 가산하여 계산하므로 대출 한도가 줄어듭니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="text-green-700 font-bold text-sm mb-2">Q. 신용대출도 DSR에 포함되나요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 네, 신용대출, 카드론, 할부금 등 모든 대출의 원리금 상환액이 DSR에 포함됩니다. 
                  따라서 기존 대출이 많을수록 주택담보대출 한도가 줄어듭니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* 투자 관련 질문 */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">📈 투자 관련 질문</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="text-purple-700 font-bold text-sm mb-2">Q. 갭투자가 항상 유리한가요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 갭투자는 적은 자본으로 큰 수익을 얻을 수 있지만, 전세가 하락, 공실, 금리 상승 등의 위험이 있습니다. 
                  특히 전세가율이 70% 이상인 지역에서는 위험도가 높아집니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="text-purple-700 font-bold text-sm mb-2">Q. 실거주와 투자 중 어떤 것이 좋나요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 개인의 재정 상황과 투자 성향에 따라 다릅니다. 
                  실거주는 안정적이고 세제 혜택이 있지만, 투자는 수익성이 높은 대신 위험도 큽니다. 
                  두 결과를 비교해보시고 선택하시기 바랍니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="text-purple-700 font-bold text-sm mb-2">Q. 전세가율이 낮은 지역이 투자에 유리한가요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 전세가율이 낮으면 갭투자에 필요한 자본이 많아지지만, 
                  상대적으로 안전하고 월세 전환 시 수익성이 높을 수 있습니다. 
                  지역별 시장 상황을 종합적으로 고려해야 합니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* 기타 질문 */}
          <div className="bg-orange-50 rounded-xl p-6">
            <h2 className="text-grey-100 text-lg font-bold mb-4">❓ 기타 질문</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-orange-700 font-bold text-sm mb-2">Q. 개인정보가 저장되나요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 아니요, 입력하신 모든 정보는 브라우저에만 임시 저장되며, 
                  서버로 전송되지 않습니다. 브라우저를 닫으면 모든 정보가 삭제됩니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-orange-700 font-bold text-sm mb-2">Q. 모바일에서도 사용할 수 있나요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 네, 모든 기기에서 사용 가능합니다. 
                  스마트폰, 태블릿, PC 등 어떤 기기에서든 동일하게 이용하실 수 있습니다.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-orange-700 font-bold text-sm mb-2">Q. 계산 결과를 저장하거나 공유할 수 있나요?</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 네, 최종 결과 페이지에서 이미지로 저장하거나 링크로 공유할 수 있습니다. 
                  가족이나 지인과 결과를 쉽게 공유해보세요.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="text-orange-700 font-bold text-sm mb-2">Q. 계산 공식이 궁금합니다.</h3>
                <p className="text-grey-80 text-xs leading-relaxed">
                  A. 실거주는 DSR 기준 주택담보대출 한도 + 보유자산으로 계산하며, 
                  갭투자는 (보유자산 + 신용대출) ÷ (1 - 전세가율)로 계산합니다. 
                  자세한 공식은 용어 사전을 참고하세요.
                </p>
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