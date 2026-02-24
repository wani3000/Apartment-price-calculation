"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function MultiChildPolicyPage() {
  const router = useRouter();

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      <Header showMenu={false} />

      {/* 메인 컨텐츠 */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: "calc(56px + env(safe-area-inset-top))",
          paddingBottom: "var(--page-content-bottom-safe)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="px-5">
          {/* 제목 */}
          <h1 className="text-[28px] font-bold leading-[36px] text-grey-100 mb-8 mt-6">
            다자녀 지원 정책
          </h1>

          <div className="space-y-6 pb-6">
            {/* 다자녀 특별공급 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                다자녀 특별공급
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    신청 자격
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 미성년 자녀 3명 이상
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 무주택 세대구성원
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 소득 기준 충족
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    혜택
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 주택 청약 시 우선 공급
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 청약가점제 혜택
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 다자녀 취득세 감면 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                다자녀 취득세 감면
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    혜택 안내
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 자녀 3명 이상 가구 최대 500만 원 감면
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 주택가격 12억 원 이하
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    신청 조건
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 미성년 자녀 3명 이상 양육
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 생애 최초 주택 구입
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 다자녀 전세자금 대출 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                다자녀 전세자금 대출
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    대출 안내
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 한도: 최대 3억 원
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 금리: 연 1.2~2.7% (우대 금리 적용)
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 대출기간: 최장 10년
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="bottom-cta-container">
        <div
          className="bottom-cta-surface"
        >
          <button
            onClick={() => router.back()}
            className="flex h-14 w-full justify-center items-center rounded-[300px] bg-primary text-white font-semibold text-base"
          >
            확인했어요
          </button>
        </div>
      </div>
    </div>
  );
}
