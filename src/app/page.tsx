'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { shareContent, getHomeShareData } from '@/utils/share';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  
  // 지정된 순서로 이미지 배열 설정 (1>3>5>2>4)
  const [orderedImages] = useState<string[]>([
    'home-image-01.png',
    'home-image-03.png',
    'home-image-05.png',
    'home-image-02.png',
    'home-image-04.png'
  ]);

  // 공유하기 핸들러
  const handleShare = async () => {
    try {
      const shareData = getHomeShareData();
      await shareContent(shareData);
    } catch (error) {
      console.error('공유 오류:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 pb-32">
      {/* 상단 텍스트 */}
      <div className="w-full max-w-md text-center px-5">
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
          내 소득으로 얼마까지<br />아파트를 살 수 있을까?
        </h1>
        <p className="text-grey-80 text-base font-medium leading-6 tracking-[-0.32px] mb-[60px]">
          투자와 실거주를 고려하여<br />내가 살 수 있는 아파트 가격을 계산해요
        </p>
      </div>

      {/* 이미지 슬라이더 - 좌우 패딩 없음 */}
      <div className="image-slider-container my-5 w-full">
        <div className="image-slider">
          {/* 첫 번째 세트 */}
          {orderedImages.map((imageName, index) => (
            <div key={`first-${index}`} className="image-card">
              <img 
                src={`/images/${imageName}`} 
                alt={`아파트 이미지 ${index + 1}`}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          ))}
          {/* 두 번째 세트 (무한 루프용) */}
          {orderedImages.map((imageName, index) => (
            <div key={`second-${index}`} className="image-card">
              <img 
                src={`/images/${imageName}`} 
                alt={`아파트 이미지 ${index + 1}`}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="w-full max-w-md px-5 my-6 mb-40">
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-grey-100 text-lg font-bold mb-3">왜 아파트 가격 계산이 중요할까요?</h2>
          <div className="space-y-4 text-grey-80 text-sm leading-relaxed">
            <div>
              <p className="font-bold text-grey-100 mb-1">실거주 vs 갭투자</p>
              <p>각각 다른 대출 조건과 계산 방식이 적용돼요.</p>
            </div>
            <div>
              <p className="font-bold text-grey-100 mb-1">DSR 규제</p>
              <p>총부채원리금상환비율에 따라 대출 한도가 결정돼요.</p>
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 text-xs font-medium leading-relaxed">
                  📢 <span className="font-bold">2025.7.1일부터 스트레스 DSR 3단계 시행</span><br />
                  수도권 1.5%, 지방 0.75% 금리 가산으로 대출한도 추가 감소
                </p>
              </div>
            </div>
            <div>
              <p className="font-bold text-grey-100 mb-1">LTV 한도</p>
              <p>주택담보대출비율은 일반적으로 70%까지 가능해요.</p>
            </div>
            <div>
              <p className="font-bold text-grey-100 mb-1">신용대출 활용</p>
              <p>투자 시 연소득의 120%까지 신용대출 이용 가능해요.</p>
            </div>
          </div>
        </div>
        
        {/* 추가 유용한 정보 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <h3 className="text-grey-100 text-base font-bold mb-3">💡 계산기 활용 팁</h3>
          <div className="space-y-2 text-grey-80 text-sm">
            <p>• 배우자 소득도 함께 입력하면 더 정확한 결과를 얻을 수 있어요</p>
            <p>• 보유자산에는 예금, 적금, 주식 등을 모두 포함해주세요</p>
            <p>• 갭투자와 실거주 결과를 비교해서 최적의 선택을 하세요</p>
          </div>
        </div>
        
        {/* 콘텐츠 페이지 링크 섹션 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <h3 className="text-grey-100 text-base font-bold mb-4">📚 더 많은 정보 보기</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/guide" className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200 hover:bg-blue-100 transition-colors">
              <div className="text-blue-600 text-lg mb-1">💡</div>
              <div className="text-blue-700 text-xs font-semibold">구매 가이드</div>
            </Link>
            <Link href="/news" className="bg-green-50 rounded-lg p-3 text-center border border-green-200 hover:bg-green-100 transition-colors">
              <div className="text-green-600 text-lg mb-1">📰</div>
              <div className="text-green-700 text-xs font-semibold">부동산 뉴스</div>
            </Link>
            <Link href="/dictionary" className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200 hover:bg-purple-100 transition-colors">
              <div className="text-purple-600 text-lg mb-1">📖</div>
              <div className="text-purple-700 text-xs font-semibold">용어 사전</div>
            </Link>
            <Link href="/faq" className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200 hover:bg-orange-100 transition-colors">
              <div className="text-orange-600 text-lg mb-1">❓</div>
              <div className="text-orange-700 text-xs font-semibold">자주 묻는 질문</div>
            </Link>
          </div>
        </div>
        
        {/* 부동산 시장 정보 섹션 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-grey-100 text-base font-bold mb-3">📊 2025년 부동산 시장 전망</h3>
          <div className="space-y-3 text-grey-80 text-sm">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-grey-100 font-semibold text-xs mb-1">스트레스 DSR 도입 영향</p>
              <p className="text-grey-80 text-xs">대출 한도 축소로 신중한 자금 계획 필요</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-grey-100 font-semibold text-xs mb-1">금리 안정세 전망</p>
              <p className="text-grey-80 text-xs">기준금리 3.5% 수준에서 유지될 것으로 예상</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-grey-100 font-semibold text-xs mb-1">신규 공급 물량 증가</p>
              <p className="text-grey-80 text-xs">수도권 중심으로 공급 확대 예정</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
        <div 
          className="flex w-full max-w-md px-5 pt-10 pb-[25px] gap-3 items-center"
          style={{ 
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 31.25%)'
          }}
        >
          <button
            onClick={handleShare}
            className="flex-1 h-14 justify-center items-center gap-2.5 flex border border-[#ADB5BD] rounded-[300px] text-grey-100 font-medium"
          >
            공유하기
          </button>
          <button
            onClick={() => router.push('/nickname')}
            className="flex-1 h-14 justify-center items-center gap-2.5 flex bg-[#7577FF] text-white rounded-[300px] font-semibold"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
} 