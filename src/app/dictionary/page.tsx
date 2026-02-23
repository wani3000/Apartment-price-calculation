"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function DictionaryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("대출");

  const tabs = ["대출", "투자", "세금"];

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
            부동산 용어를
            <br />
            쉽게 이해하기
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

          {/* 대출 탭 내용 */}
          {activeTab === "대출" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  DSR (Debt Service Ratio)
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    총부채원리금상환비율. 연소득 대비 모든 대출의 원리금 상환액
                    비율
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      계산법
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      (모든 대출 월상환액 × 12) ÷ 연소득 × 100
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  LTV (Loan To Value)
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    주택담보대출비율. 주택 담보가치 대비 대출 금액의 비율
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      계산법
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      대출금액 ÷ 담보가치 × 100
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  DTI (Debt To Income)
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    총부채상환비율. 연소득 대비 주택담보대출 원리금 상환액 비율
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      계산법
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      (주택담보대출 월상환액 × 12) ÷ 연소득 × 100
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  스트레스 DSR
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    금리 상승 시나리오를 적용하여 계산하는 DSR. 2025년 7월부터
                    시행
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      적용 금리
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      수도권 +1.5%p, 지방 +0.75%p
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 투자 탭 내용 */}
          {activeTab === "투자" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  갭투자
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    매매가와 전세가의 차액만으로 부동산을 구입하는 투자 방법
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      필요자금
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      매매가 - 전세가 + 부대비용
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  전세가율
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    매매가 대비 전세가의 비율. 갭투자 수익성 판단의 핵심 지표
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      계산법
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      전세가 ÷ 매매가 × 100
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  수익률
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    투자 원금 대비 연간 수익의 비율
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      계산법
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      (연간 순수익 ÷ 투자원금) × 100
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  레버리지
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    빌린 돈을 활용하여 투자 규모를 키우는 것. 수익과 위험이 모두
                    확대
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      효과
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      자기자본 수익률 증대, 단 위험도 증가
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 세금 탭 내용 */}
          {activeTab === "세금" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  취득세
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    부동산 구입 시 납부하는 세금. 취득가액의 1~3%
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      세율
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      실거주 1~3%, 투자 1~3% (지역별 차등)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  양도소득세
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    부동산 매도 시 발생한 이익에 대해 납부하는 세금
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      세율
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      보유기간, 거주기간에 따라 6~75%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  종합부동산세
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    고가 부동산 보유자에게 부과되는 세금. 매년 납부
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      기준
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      주택 공시가격 9억원 초과 시 부과
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                  재산세
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    부동산 소유자가 매년 납부하는 지방세
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-1">
                      납부 시기
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      매년 7월, 9월 2회 분할 납부
                    </p>
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
