"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface HeaderProps {
  backUrl?: string;
  onBackClick?: () => void;
  title?: string | ReactNode;
  rightAction?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
  showMenu?: boolean;
  showBack?: boolean;
  showBorder?: boolean;
  logoLink?: string;
}

export default function Header({
  backUrl,
  onBackClick,
  title,
  rightAction,
  showMenu = true,
  showBack = true,
  showBorder = true,
  logoLink,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const handleOpenMenu = () => {
    const query = searchParams.toString();
    const currentPath = `${pathname}${query ? `?${query}` : ""}`;
    router.push(`/menu?from=${encodeURIComponent(currentPath)}`);
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

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white flex justify-between items-center px-5 py-4 ${
          showBorder ? "border-b border-gray-100" : ""
        }`}
        style={{
          paddingTop: "max(16px, env(safe-area-inset-top))",
        }}
      >
        {/* 뒤로가기 버튼 */}
        {logoLink ? (
          <button
            onClick={() => router.push(logoLink)}
            className="h-6 flex items-center"
            aria-label="홈으로 이동"
          >
            <Image
              src="/images/aptgugu_logo.svg"
              alt="aptgugu"
              width={118}
              height={24}
              className="h-6 w-auto"
              unoptimized
            />
          </button>
        ) : showBack ? (
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
        ) : (
          <div className="w-6 h-6" />
        )}

        {/* 제목 */}
        {title && (
          <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px]">
            {title}
          </h1>
        )}

        <div className="flex items-center gap-2">
          {rightAction && (
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
          )}
          {showMenu && (
            <button onClick={handleOpenMenu} className="text-grey-100">
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
          )}
          {!rightAction && !showMenu && <div className="w-6 h-6" />}
        </div>
      </div>
    </>
  );
}
