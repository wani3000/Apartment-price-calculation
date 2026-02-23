"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";

export default function MenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const menuItems = [
    {
      label: "10.15 주택시장 안정화 대책",
      badge: "신규",
      href: "/policy/housing-stabilization",
      description: "규제지역 확대, 주담대 한도 제한",
    },
    {
      label: "청년 지원 정책",
      href: "/policy/youth",
      description: "비과세 적금, 청년미래적금, 전세대출",
    },
    {
      label: "신혼부부 지원 정책",
      href: "/policy/newlywed",
      description: "특별공급, 전세자금대출 혜택",
    },
    {
      label: "다자녀 지원 정책",
      href: "/policy/multi-child",
      description: "특별공급, 취득세 감면 혜택",
    },
    {
      label: "자주 묻는 질문",
      href: "/faq",
      description: "궁금한 점을 빠르게 해결하세요",
    },
    {
      label: "용어 사전",
      href: "/dictionary",
      description: "부동산 용어를 쉽게 이해하세요",
    },
    {
      label: "구매 가이드",
      href: "/guide",
      description: "아파트 구매 팁을 알아보세요",
    },
    {
      label: "부동산 뉴스",
      href: "/news",
      description: "최신 부동산 소식을 받아보세요",
    },
    {
      label: "고객지원",
      href: "/support",
      description: "문의 및 오류 제보를 접수하세요",
    },
    {
      label: "데이터 삭제 안내",
      href: "/data-deletion",
      description: "앱 데이터 삭제 방법을 확인하세요",
    },
  ];

  const handleBack = () => {
    const from = searchParams.get("from");
    if (from) {
      router.push(decodeURIComponent(from));
      return;
    }
    router.back();
  };

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      <Header onBackClick={handleBack} showMenu={false} />

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
          <div className="mt-6 divide-y divide-grey-30">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block py-4 active:bg-gray-50 transition-colors"
              >
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
