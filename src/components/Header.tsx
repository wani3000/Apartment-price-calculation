"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  backUrl?: string;
  title?: string | ReactNode;
  rightAction?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
  showMenu?: boolean;
}

export default function Header({
  backUrl,
  title,
  rightAction,
  showMenu = false,
}: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const handleRightAction = () => {
    if (rightAction && rightAction.onClick) {
      // 소득·자산 수정 버튼의 경우 직접 URL로 이동
      if (rightAction.label === "소득·자산 수정") {
        router.push("/calculator");
      } else {
        rightAction.onClick();
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-white flex justify-between items-center px-5 py-4 border-b border-gray-100"
        style={{
          paddingTop: "max(16px, env(safe-area-inset-top))",
        }}
      >
        {/* 뒤로가기 버튼 */}
        <button onClick={handleBack} className="text-grey-100">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L8 12L15 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 제목 */}
        {title && (
          <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px]">
            {title}
          </h1>
        )}

        {/* 메뉴 버튼 또는 오른쪽 액션 버튼 */}
        {showMenu ? (
          <button onClick={toggleMenu} className="text-grey-100">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : rightAction ? (
          <button
            onClick={handleRightAction}
            className={
              rightAction.className ||
              "flex px-[10px] py-2 justify-center items-center gap-2.5 rounded-[4px] bg-[#F1F3F5]"
            }
          >
            <span className="text-[#495057] text-[13px] font-medium leading-[18px] tracking-[-0.26px]">
              {rightAction.label}
            </span>
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {/* 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="py-2">
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
            >
              서비스 소개
            </Link>
            <Link
              href="/help"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
            >
              도움말
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
            >
              문의하기
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link
              href="/privacy"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
            >
              이용약관
            </Link>
          </div>
        </div>
      )}

      {/* 메뉴가 열려있을 때 배경 클릭으로 닫기 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
