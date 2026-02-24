"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function NewlywedPolicyPage() {
  const router = useRouter();

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      <Header showMenu={false} />

      {/* 메인 컨텐츠 */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: "calc(56px + env(safe-area-inset-top))",
          paddingBottom: "calc(120px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="px-5">
          {/* 제목 */}
          <h1 className="text-[28px] font-bold leading-[36px] text-grey-100 mb-8 mt-6">
            신혼부부 지원 정책
          </h1>

          <div className="space-y-6 pb-6">
            {/* 신혼부부 특별공급 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                신혼부부 특별공급
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    신청 자격
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 혼인기간 7년 이내
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 무주택 세대구성원
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 소득 기준 충족 (도시근로자 평균소득 140% 이하)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 신혼부부 전세자금대출 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                신혼부부 전세자금대출
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
                      • 금리: 연 1.2~3.0%
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 대출기간: 최장 10년
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 신혼부부 구입자금 대출 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                신혼부부 구입자금 대출
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    신청 자격
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 혼인기간 7년 이내
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 무주택 세대구성원
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 부부합산 연소득 8,500만 원 이하
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    대출 안내
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 한도: 최대 4억 원
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 금리: 연 2.15~3.65%
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 대출기간: 최장 30년
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-[72px] left-0 right-0 flex justify-center z-50">
        <div
          className="flex w-full max-w-md px-5 pt-10 pb-[calc(25px+env(safe-area-inset-bottom))] items-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 31.25%)",
          }}
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
