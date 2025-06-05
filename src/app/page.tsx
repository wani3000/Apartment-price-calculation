'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between px-5 py-12">
      {/* 상단 텍스트 */}
      <div className="w-full max-w-md text-center">
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
          내 소득으로 얼마까지<br />아파트를 살 수 있을까?
        </h1>
        <p className="text-grey-80 text-base font-medium leading-6 tracking-[-0.32px]">
          투자와 실거주를 고려하여<br />내가 살 수 있는 아파트 가격을 계산해요
        </p>
      </div>

      {/* 이미지 슬라이더 */}
      <div className="image-slider-container my-10 w-full max-w-md">
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

      {/* 버튼 섹션 */}
      <div className="w-full max-w-md mt-12 space-y-3">
        <button
          onClick={() => router.push('/nickname')}
          className="flex h-14 w-full justify-center items-center gap-2.5 bg-primary text-white rounded-[300px] font-semibold text-base hover:bg-indigo-600 transition"
        >
          시작하기
        </button>
        <button
          className="flex h-14 w-full justify-center items-center gap-2.5 border border-grey-60 text-grey-100 rounded-[300px] font-medium text-base hover:bg-gray-50 transition"
        >
          공유하기
        </button>
      </div>
    </div>
  );
} 