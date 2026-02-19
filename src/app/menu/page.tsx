"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();

  const menuItems = [
    {
      icon: "📄",
      label: "10.15 주택시장 안정화 대책",
      badge: "신규",
      href: "/policy/housing-stabilization",
      description: "규제지역 확대, 주담대 한도 제한",
    },
    {
      icon: "🌱",
      label: "청년 지원 정책",
      href: "/policy/youth",
      description: "비과세 적금, 청년미래적금, 전세대출",
    },
    {
      icon: "💑",
      label: "신혼부부 지원 정책",
      href: "/policy/newlywed",
      description: "특별공급, 전세자금대출 혜택",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      label: "다자녀 지원 정책",
      href: "/policy/multi-child",
      description: "특별공급, 취득세 감면 혜택",
    },
    {
      icon: "❓",
      label: "자주 묻는 질문",
      href: "/faq",
      description: "궁금한 점을 빠르게 해결하세요",
    },
    {
      icon: "📖",
      label: "용어 사전",
      href: "/dictionary",
      description: "부동산 용어를 쉽게 이해하세요",
    },
    {
      icon: "💡",
      label: "구매 가이드",
      href: "/guide",
      description: "아파트 구매 팁을 알아보세요",
    },
    {
      icon: "📰",
      label: "부동산 뉴스",
      href: "/news",
      description: "최신 부동산 소식을 받아보세요",
    },
  ];

  return (
    <div className="bg-white flex flex-col h-screen overflow-hidden">
      {/* 상단 네비게이션 */}
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center px-5 py-4"
        style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
      >
        <button onClick={() => router.back()} className="text-grey-100 mr-4">
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
      </div>

      {/* 메인 컨텐츠 */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: "calc(56px + env(safe-area-inset-top))",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="px-5">
          <h1 className="text-[32px] font-bold text-grey-100 mb-8 mt-6">
            카카오뱅크 AI
          </h1>

          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center py-4 active:bg-gray-50 transition-colors"
              >
                <div className="text-[40px] mr-4">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-grey-100 text-[18px] font-semibold leading-[26px]">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-[#FFF0F0] text-[#FF4444] text-[11px] font-semibold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-grey-70 text-[14px] leading-[20px] mt-1">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
