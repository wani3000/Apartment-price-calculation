"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function YouthPolicyPage() {
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
            청년 지원 정책
          </h1>

          <div className="space-y-6 pb-6">
            {/* 비과세 적금 · 청년미래적금 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                비과세 적금 · 청년미래적금
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    가입 대상
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 만 19~34세 청년
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 근로소득 6,000만 원 이하 근로자 (or 기타소득자) 또는 연
                      매출 3억 원 이하 소상공인
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 가구 종위소득 200% 이하
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    적금 안내
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 만기: 3년
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 월 납입 한도: 최대 50만 원(자유적립식)
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 정부 기여금: 일반형 6%
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 청년 주택드림 청약통장 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                청년 주택드림 청약통장
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    가입 대상
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 만 19~34세 무주택 청년
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 연소득 5,000만 원 이하
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    혜택 안내
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 월 최대 10만 원 한도 내에서 매달 2~4%의 저축장려금 지급
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 이자소득 비과세
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 청년전용 버팀목 전세자금대출 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                청년전용 버팀목 전세자금대출
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    가입 대상
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 만 19~34세 무주택 청년
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 연소득 5,000만 원 이하 (부부합산)
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 순자산가액 3.88억 원 이하
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                    대출 안내
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 한도: 최대 2억 원
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 금리: 연 1.8~3.0%
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
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
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
