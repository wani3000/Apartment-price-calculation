"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  backUrl?: string;
  title?: string | ReactNode;
  rightAction?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
}

export default function Header({ backUrl, title, rightAction }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      window.location.href = backUrl;
    } else {
      window.history.back();
    }
  };

  const handleRightAction = () => {
    if (rightAction && rightAction.onClick) {
      // 소득·자산 수정 버튼의 경우 직접 URL로 이동
      if (rightAction.label === "소득·자산 수정") {
        window.location.href = '/calculator';
      } else {
        rightAction.onClick();
      }
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 pt-0">
      {/* 뒤로가기 버튼 */}
      <button onClick={handleBack} className="text-grey-100">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 제목 */}
      {title && (
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px]">
          {title}
        </h1>
      )}

      {/* 오른쪽 액션 버튼 - 조건부 렌더링 */}
      {rightAction && (
        <button 
          onClick={handleRightAction}
          className={rightAction.className || "flex px-[10px] py-2 justify-center items-center gap-2.5 rounded-[4px] bg-[#F1F3F5]"}
        >
          <span className="text-[#495057] text-[13px] font-medium leading-[18px] tracking-[-0.26px]">
            {rightAction.label}
          </span>
        </button>
      )}

      {/* title과 rightAction이 없을 경우 빈 div로 레이아웃 유지 */}
      {!title && !rightAction && <div></div>}
    </div>
  );
} 