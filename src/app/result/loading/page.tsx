'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdSense from '@/components/AdSense';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    // 3초 후에 결과 페이지로 이동
    const timer = setTimeout(() => {
      router.push('/result/final');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-12">
      {/* 로딩 애니메이션 */}
      <div className="mb-8">
        <div className="dots-loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>

      {/* AdSense 광고 - 로딩 애니메이션과 텍스트 사이 */}
      <div className="w-full max-w-md mb-8">
        <AdSense
          adSlot="3456789012" // 실제 광고 슬롯 ID로 교체
          adFormat="rectangle"
          style={{ minHeight: '200px' }}
          className="rounded-lg overflow-hidden bg-gray-50"
        />
      </div>

      {/* 타이틀 */}
      <h1 className="text-grey-100 text-[18px] font-bold leading-[26px] tracking-[-0.18px] text-center mb-4">
        최대 금액을 계산할게요
      </h1>

      {/* 서브타이틀 */}
      <p className="text-grey-80 text-base font-normal leading-6 tracking-[-0.32px] text-center">
        투자와 실거주 모두 고려해<br />
        구매가능한 아파트 가격을 계산해요
      </p>
    </div>
  );
} 