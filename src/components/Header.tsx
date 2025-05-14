'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // 헤더를 표시하지 않을 페이지 목록
  const noHeaderPages = ['/', '/result/loading'];
  
  // 현재 경로가 noHeaderPages에 포함된 경우에만 헤더를 숨김
  if (noHeaderPages.includes(pathname)) {
    return null;
  }

  return (
    <header className="h-[48px] bg-white flex items-center px-5 justify-between">
      <button 
        onClick={() => router.back()}
        className="w-6 h-6 flex items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="#212529" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* 소득·자산 수정 버튼: /result/final에서만 노출 */}
      {pathname === '/result/final' && (
        <button
          onClick={() => router.push('/calculator')}
          className="flex px-[10px] py-2 justify-center items-center gap-[10px] rounded-[4px] bg-[#F1F3F5] text-[#495057] text-[13px] font-medium leading-[18px] tracking-[-0.26px]"
        >
          소득·자산 수정
        </button>
      )}
    </header>
  );
} 