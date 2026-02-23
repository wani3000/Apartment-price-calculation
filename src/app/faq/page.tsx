"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function FAQPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("계산기");

  const tabs = ["계산기", "대출", "투자"];

  return (
    <div className="bg-white flex flex-col h-screen overflow-hidden">
      {/* 헤더 */}
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
          paddingBottom: "calc(120px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
        }}
      >
        <div className="px-5">
          {/* 제목 */}
          <h1 className="text-[28px] font-bold leading-[36px] text-grey-100 mb-8 mt-6">
            자주 묻는 질문으로
            <br />
            빠르게 해결하기
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

          {/* 계산기 탭 내용 */}
          {activeTab === "계산기" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  계산 결과가 정확한가요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  본 계산기는 현행 DSR, LTV 규정을 반영하여 계산하지만, 실제
                  대출 승인은 은행별 심사 기준과 개인 신용도에 따라 달라질 수
                  있습니다. 참고용으로 활용하시고, 정확한 대출 상담은 금융기관에
                  문의하시기 바랍니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  배우자 소득은 반드시 입력해야 하나요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  필수는 아니지만, 배우자와 함께 대출을 받으실 계획이라면
                  입력하시는 것이 좋습니다. 합산 소득으로 계산할 때 더 높은 대출
                  한도를 받을 수 있습니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  기존 대출이 있어도 계산할 수 있나요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  현재 버전에서는 기존 대출을 고려하지 않습니다. 기존 대출이
                  있으시다면 월 상환액을 차감하여 계산하시거나, 은행에서 정확한
                  DSR 계산을 받아보시기 바랍니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  개인정보가 저장되나요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  아니요, 입력하신 모든 정보는 브라우저에만 임시 저장되며,
                  서버로 전송되지 않습니다. 브라우저를 닫으면 모든 정보가
                  삭제됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 대출 탭 내용 */}
          {activeTab === "대출" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  DSR 40%와 50%의 차이는 무엇인가요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  DSR 40%는 1금융권(시중은행), 50%는 2금융권(저축은행, 캐피탈)에
                  적용됩니다. 1금융권은 금리가 낮지만 심사가 까다롭고, 2금융권은
                  금리가 높지만 심사가 상대적으로 수월합니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  스트레스 DSR이 무엇인가요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  2025년 7월부터 시행되는 제도로, 금리 상승 시나리오를 가정하여
                  DSR을 계산합니다. 수도권은 +1.5%p, 지방은 +0.75%p를 가산하여
                  계산하므로 대출 한도가 줄어듭니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  신용대출도 DSR에 포함되나요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  네, 신용대출, 카드론, 할부금 등 모든 대출의 원리금 상환액이
                  DSR에 포함됩니다. 따라서 기존 대출이 많을수록 주택담보대출
                  한도가 줄어듭니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  LTV는 무엇인가요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  주택담보대출비율(Loan To Value)로, 주택 담보가치 대비 대출
                  금액의 비율입니다. 일반적으로 70%까지 가능하며, 투기지역은
                  60%로 제한됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 투자 탭 내용 */}
          {activeTab === "투자" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  갭투자가 항상 유리한가요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  갭투자는 적은 자본으로 큰 수익을 얻을 수 있지만, 전세가 하락,
                  공실, 금리 상승 등의 위험이 있습니다. 특히 전세가율이 70%
                  이상인 지역에서는 위험도가 높아집니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  실거주와 투자 중 어떤 것이 좋나요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  개인의 재정 상황과 투자 성향에 따라 다릅니다. 실거주는
                  안정적이고 세제 혜택이 있지만, 투자는 수익성이 높은 대신
                  위험도 큽니다. 두 결과를 비교해보시고 선택하시기 바랍니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  전세가율이 낮은 지역이 투자에 유리한가요?
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  전세가율이 낮으면 갭투자에 필요한 자본이 많아지지만,
                  상대적으로 안전하고 월세 전환 시 수익성이 높을 수 있습니다.
                  지역별 시장 상황을 종합적으로 고려해야 합니다.
                </p>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  계산 공식이 궁금합니다
                </h2>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  실거주는 DSR 기준 주택담보대출 한도 + 보유자산으로 계산하며,
                  갭투자는 (보유자산 + 신용대출) ÷ (1 - 전세가율)로 계산합니다.
                  자세한 공식은 용어 사전을 참고하세요.
                </p>
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
