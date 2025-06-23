'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { shareContent, getHomeShareData } from '@/utils/share';
import AdSense from '@/components/AdSense';

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

      {/* 콘텐츠 섹션 - AdSense 정책 준수를 위한 추가 콘텐츠 */}
      <div className="w-full max-w-md px-5 my-6 mb-40">
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h2 className="text-grey-100 text-lg font-bold mb-3">왜 아파트 가격 계산이 중요할까요?</h2>
          <div className="space-y-4 text-grey-80 text-sm leading-relaxed">
            <div>
              <p className="font-bold text-grey-100 mb-1">실거주 vs 갭투자</p>
              <p>각각 다른 대출 조건과 계산 방식이 적용돼요.</p>
            </div>
            <div>
              <p className="font-bold text-grey-100 mb-1">DSR 규제</p>
              <p>총부채원리금상환비율에 따라 대출 한도가 결정돼요.</p>
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
        
        {/* AdSense 광고 - 풍부한 콘텐츠 이후 배치 */}
        <div className="bg-gray-50 rounded-xl p-6">
          <AdSense
            adSlot="1234567890" // 실제 광고 슬롯 ID로 교체
            adFormat="horizontal"
            style={{ minHeight: '100px' }}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </div>

      {/* 하단 고정 버튼 영역 - 결과 페이지와 동일한 디자인 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
        <div 
          className="flex w-full max-w-md px-5 pt-10 pb-12 gap-3 items-center"
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