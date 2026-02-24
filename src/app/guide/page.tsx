"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function GuidePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("DSR·LTV");

  const tabs = ["DSR·LTV", "갭투자", "대출상품"];

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
            아파트 구매 팁을
            <br />
            한눈에 보기
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

          {/* DSR·LTV 탭 내용 */}
          {activeTab === "DSR·LTV" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  DSR 완전 이해
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      DSR이란?
                    </h3>
                    <p className="text-[15px] text-grey-80 leading-[22px]">
                      DSR은 연소득 대비 모든 대출의 원리금 상환액 비율입니다.
                      주택담보대출, 신용대출, 카드론 등 모든 대출이 포함됩니다.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      DSR 한도
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 1금융권: 연소득의 40%
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 2금융권: 연소득의 50%
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      2025년 스트레스 DSR
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 시행일: 2025년 7월 1일
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 수도권: 기준금리 + 1.5%p로 계산
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 지방: 기준금리 + 0.75%p로 계산
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  LTV 가이드
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      LTV란?
                    </h3>
                    <p className="text-[15px] text-grey-80 leading-[22px]">
                      LTV는 주택 담보가치 대비 대출 금액의 비율입니다. 집 값의
                      몇 %까지 대출받을 수 있는지를 나타냅니다.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      LTV 한도 (2025년 기준)
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[15px] font-semibold text-grey-100 mb-1">
                          실거주용 주택
                        </p>
                        <ul className="space-y-1">
                          <li className="text-[14px] text-grey-80 leading-[20px]">
                            • 일반 지역: 70%
                          </li>
                          <li className="text-[14px] text-grey-80 leading-[20px]">
                            • 투기지역: 60%
                          </li>
                        </ul>
                      </div>

                      <div>
                        <p className="text-[15px] font-semibold text-grey-100 mb-1">
                          투자용 주택
                        </p>
                        <ul className="space-y-1">
                          <li className="text-[14px] text-grey-80 leading-[20px]">
                            • 일반 지역: 60%
                          </li>
                          <li className="text-[14px] text-grey-80 leading-[20px]">
                            • 투기지역: 50%
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 갭투자 탭 내용 */}
          {activeTab === "갭투자" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  갭투자 개념
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      갭투자란?
                    </h3>
                    <p className="text-[15px] text-grey-80 leading-[22px]">
                      매매가와 전세가의 차이(갭)만큼 자기자본을 투입하여
                      부동산을 구매하는 투자 방법입니다.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      계산 공식
                    </h3>
                    <div className="bg-[#F5F5F5] rounded-lg p-4 space-y-2">
                      <div>
                        <p className="text-[14px] text-grey-100 font-semibold">
                          필요 자본
                        </p>
                        <p className="text-[14px] text-grey-80">
                          매매가 - 전세가
                        </p>
                      </div>
                      <div>
                        <p className="text-[14px] text-grey-100 font-semibold">
                          수익률
                        </p>
                        <p className="text-[14px] text-grey-80">
                          (월세 - 대출이자) ÷ 투입자본
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  주의사항
                </h2>

                <div>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 전세가 하락 위험
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 공실 위험
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 금리 상승 위험
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 세금 부담 고려 필수
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  성공 전략
                </h2>

                <div>
                  <ul className="space-y-2">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 전세가율 70% 이하 지역 선택
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 교통 인프라 개선 지역 주목
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 안전 마진 충분히 확보
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      • 장기 보유 계획 수립
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 대출상품 탭 내용 */}
          {activeTab === "대출상품" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  주택담보대출
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      고정금리형
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 장점: 금리 안정성
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 단점: 초기 금리 높음
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 추천: 금리 상승 예상 시
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      변동금리형
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 장점: 초기 금리 낮음
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 단점: 금리 변동 위험
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 추천: 금리 하락 예상 시
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      혼합형
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 장점: 균형잡힌 리스크 관리
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 특징: 초기 3~5년 고정, 이후 변동
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 추천: 안정성과 유연성 둘 다 원할 때
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  신용대출
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      기본 정보
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 한도: 연소득의 120%
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 금리: 주담대 대비 2~4% 높음
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 용도: 갭투자 자금 활용
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                      유의사항
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • DSR에 모두 포함됨
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 높은 금리로 이자 부담 큼
                      </li>
                      <li className="text-[15px] text-grey-80 leading-[22px]">
                        • 신용등급 영향 받음
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  대출 선택 팁
                </h2>

                <div>
                  <ul className="space-y-3">
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      <span className="font-semibold text-grey-100">
                        1. 여러 은행 비교
                      </span>
                      <br />
                      은행별 대출 조건과 금리를 비교해보세요
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      <span className="font-semibold text-grey-100">
                        2. 총 비용 계산
                      </span>
                      <br />
                      취득세, 중개수수료 등 부대비용도 고려하세요
                    </li>
                    <li className="text-[15px] text-grey-80 leading-[22px]">
                      <span className="font-semibold text-grey-100">
                        3. 안전 마진 확보
                      </span>
                      <br />
                      대출 한도의 80% 수준에서 구매를 검토하세요
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-[var(--bottom-tab-offset)] left-0 right-0 flex justify-center z-50">
        <div
          className="flex w-full max-w-md px-5 pt-3 pb-3 items-center"
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
