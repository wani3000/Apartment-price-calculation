'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

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

      {/* 카드 슬라이더 */}
      <div className="card-slider-container my-10 w-full max-w-md">
        <div className="card-slider">
          {/* 카드 1 */}
          <div className="custom-card rounded-xl bg-indigo-50 p-4">
            <p className="text-xs text-grey-80 mb-1">치즈 님이<br />살 수 있는 아파트</p>
            <div className="h-24 mb-2 flex items-center justify-center">
              <svg className="w-16 h-16 text-indigo-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
              </svg>
            </div>
            <p className="text-xs text-grey-60">갭투자 시</p>
            <p className="text-base font-semibold text-grey-100">14억 2,000만 원</p>
          </div>

          {/* 카드 2 */}
          <div className="custom-card rounded-xl bg-orange-50 p-4">
            <p className="text-xs text-grey-80 mb-1">케빈 님이<br />살 수 있는 아파트</p>
            <div className="h-24 mb-2 flex items-center justify-center">
              <svg className="w-16 h-16 text-orange-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
              </svg>
            </div>
            <p className="text-xs text-grey-60">갭투자 시</p>
            <p className="text-base font-semibold text-grey-100">16억 5,000만 원</p>
          </div>

          {/* 카드 3 (반복을 위한 추가 카드) */}
          <div className="custom-card rounded-xl bg-blue-50 p-4">
            <p className="text-xs text-grey-80 mb-1">민수 님이<br />살 수 있는 아파트</p>
            <div className="h-24 mb-2 flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
              </svg>
            </div>
            <p className="text-xs text-grey-60">갭투자 시</p>
            <p className="text-base font-semibold text-grey-100">18억 3,000만 원</p>
          </div>
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