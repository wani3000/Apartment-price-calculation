import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '서비스 소개 - 아파트 가격 계산기',
  description: '내 소득으로 구매 가능한 아파트 가격을 정확하게 계산해주는 무료 서비스입니다. DSR, LTV 규제를 반영하여 실거주와 갭투자 두 가지 방식으로 계산할 수 있습니다.',
  keywords: '아파트 가격 계산기, DSR 계산, LTV 계산, 주택 구매력, 부동산 투자, 갭투자 계산',
  openGraph: {
    title: '서비스 소개 - 아파트 가격 계산기',
    description: '내 소득으로 구매 가능한 아파트 가격을 정확하게 계산해주는 무료 서비스입니다.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">아파트 가격 계산기 소개</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">🏠 서비스 개요</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                아파트 가격 계산기는 개인의 소득과 자산 현황을 바탕으로 구매 가능한 아파트 가격을 정확하게 계산해주는 무료 온라인 서비스입니다.
                현재 시행 중인 DSR(총부채원리금상환비율) 규제와 LTV(주택담보대출비율) 한도를 실시간으로 반영하여 
                가장 현실적이고 정확한 계산 결과를 제공합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">⚡ 주요 기능</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">실거주 계산</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    실제 거주 목적으로 아파트를 구매할 때의 대출 조건과 한도를 계산합니다. 
                    생애최초 특별공급, 신혼부부 특례 등 실거주자 혜택을 반영합니다.
                  </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">갭투자 계산</h3>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    투자 목적으로 아파트를 구매할 때의 조건을 계산합니다. 
                    연소득 대비 신용대출 한도(120%)와 투자용 주택 대출 규제를 반영합니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">📊 계산 기준</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">DSR(총부채원리금상환비율) 기준</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
                      <li>일반 구매자: 연소득 대비 40% 이하</li>
                      <li>고소득자(1억원 이상): 연소득 대비 60% 이하</li>
                      <li>2025년 7월부터 스트레스 DSR 3단계 시행 (수도권 1.5%, 지방 0.75% 금리 가산)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">LTV(주택담보대출비율) 기준</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
                      <li>실거주: 최대 70% (생애최초 80%)</li>
                      <li>투자용: 최대 60%</li>
                      <li>다주택자: 최대 40%</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">신용대출 기준</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
                      <li>연소득 대비 최대 120% (갭투자 시)</li>
                      <li>개인 신용등급에 따른 한도 차등 적용</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">🎯 서비스 특징</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">실시간 정책 반영</h4>
                    <p className="text-gray-600 text-sm">정부의 부동산 정책 변화와 대출 규제를 실시간으로 반영합니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">맞춤형 계산</h4>
                    <p className="text-gray-600 text-sm">개인의 소득, 자산, 기존 대출 현황을 종합적으로 고려합니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">비교 분석</h4>
                    <p className="text-gray-600 text-sm">실거주와 갭투자 결과를 비교하여 최적의 선택을 도와드립니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">완전 무료</h4>
                    <p className="text-gray-600 text-sm">모든 계산 기능을 무료로 제공하며, 개인정보 수집을 최소화합니다.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">⚠️ 중요 안내사항</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <div className="space-y-3 text-sm text-yellow-800">
                  <p className="font-semibold">본 계산 결과는 참고용이며, 실제 대출 승인과는 차이가 있을 수 있습니다.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>은행별 심사 기준과 개인 신용도에 따라 실제 대출 한도는 달라질 수 있습니다.</li>
                    <li>정부 정책 변화, 금리 변동 등에 따라 계산 기준이 수시로 업데이트됩니다.</li>
                    <li>정확한 대출 상담은 해당 금융기관에 직접 문의하시기 바랍니다.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">📞 문의 및 피드백</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  서비스 개선을 위한 소중한 의견을 언제든지 보내주세요.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 계산 결과의 정확성에 대한 피드백</p>
                  <p>• 추가 기능 요청사항</p>
                  <p>• 사이트 이용 중 발생한 문제점</p>
                </div>
              </div>
            </section>

            <div className="mt-12 text-center">
              <Link 
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                계산기 사용하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 