"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function PolicyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("청년");

  const tabs = ["청년", "신혼부부", "다자녀"];

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: "calc(56px + env(safe-area-inset-top))",
          paddingBottom: "calc(100px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="px-5">
          {/* 제목 */}
          <h1 className="text-[28px] font-bold leading-[36px] text-grey-100 mb-8 mt-6">
            2026년에 바뀌는
            <br />
            세금 혜택보기
          </h1>

          {/* 탭 메뉴 */}
          <div className="flex border-b border-grey-40 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-4 text-base font-semibold transition-all ${
                  activeTab === tab
                    ? "text-grey-100 border-b-2 border-grey-100"
                    : "text-grey-60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 청년 탭 내용 */}
          {activeTab === "청년" && (
            <div className="space-y-6 pb-6">
              {/* 비과세 적금 · 청년미래적금 */}
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  비과세 적금 · 청년미래적금
                </h2>

                <div className="space-y-6">
                  {/* 가입 대상 */}
                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                      가입 대상
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 만 19~34세 청년
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 근로소득 6,000만 원 이하 근로자 (or 기타소득자) 또는
                        연 매출 3억 원 이하 소상공인
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 가구 종위소득 200% 이하
                      </li>
                    </ul>
                  </div>

                  {/* 적금 안내 */}
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
                        • 정부 기여금
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px] pl-4">
                        • 일반형 6%
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
                        • 월 최대 10만 원 한도 내에서 매달 2~4%의 저축장려금
                        지급
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
          )}

          {/* 신혼부부 탭 내용 */}
          {activeTab === "신혼부부" && (
            <div className="space-y-6 pb-6">
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
            </div>
          )}

          {/* 다자녀 탭 내용 */}
          {activeTab === "다자녀" && (
            <div className="space-y-6 pb-6">
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
                </div>
              </div>

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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white px-5"
        style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={() => router.back()}
          className="w-full h-14 bg-primary text-white text-base font-semibold rounded-full mb-4"
        >
          확인했어요
        </button>
      </div>
    </div>
  );
}
