"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("정책");

  const tabs = ["정책", "시장", "전망"];

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
        }}
      >
        <div className="px-5">
          {/* 제목 */}
          <h1 className="text-[28px] font-bold leading-[36px] text-grey-100 mb-8 mt-6">
            최신 부동산 소식을
            <br />
            빠르게 확인하기
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

          {/* 정책 탭 내용 */}
          {activeTab === "정책" && (
            <div className="space-y-6 pb-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[18px] font-bold text-grey-100 leading-[26px]">
                    스트레스 DSR 3단계 시행
                  </h2>
                  <span className="text-[12px] text-grey-60">2025.01.15</span>
                </div>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  2025년 7월 1일부터 시행되는 스트레스 DSR 3단계로 인해 대출
                  한도가 수도권 기준 약 10-15% 감소할 것으로 예상됩니다. 금리
                  상승 시나리오를 반영하여 더욱 보수적인 대출 심사가
                  이루어집니다.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[18px] font-bold text-grey-100 leading-[26px]">
                    주택담보대출 금리 동향
                  </h2>
                  <span className="text-[12px] text-grey-60">2025.01.10</span>
                </div>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  시중은행 주택담보대출 금리가 3.5~4.2% 수준에서 형성되고
                  있으며, 향후 한국은행 기준금리 동향에 따라 변동될 전망입니다.
                  고정금리와 변동금리 선택 시 신중한 판단이 필요합니다.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[18px] font-bold text-grey-100 leading-[26px]">
                    투기지역 LTV 규제 현황
                  </h2>
                  <span className="text-[12px] text-grey-60">2025.01.05</span>
                </div>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  서울 강남 3구 등 투기지역의 LTV 한도가 실거주 60%, 투자 50%로
                  제한되어 있어 신중한 자금 계획이 필요합니다. 지역별로 상이한
                  규제가 적용되므로 사전 확인이 필수입니다.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[18px] font-bold text-grey-100 leading-[26px]">
                    청년 주택 지원 정책 확대
                  </h2>
                  <span className="text-[12px] text-grey-60">2025.01.02</span>
                </div>
                <p className="text-[15px] text-grey-80 leading-[22px]">
                  청년미래적금, 청년 주택드림 청약통장 등 청년 지원 정책이
                  확대되었습니다. 만 34세 이하 무주택 청년이라면 다양한 세제
                  혜택과 금리 우대를 받을 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* 시장 탭 내용 */}
          {activeTab === "시장" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  수도권 평균 매매가
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">서울</span>
                    <span className="text-[16px] font-bold text-grey-100">
                      12.5억원
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">경기</span>
                    <span className="text-[16px] font-bold text-grey-100">
                      6.8억원
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">인천</span>
                    <span className="text-[16px] font-bold text-grey-100">
                      5.2억원
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  주요 도시 평균 매매가
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">부산</span>
                    <span className="text-[16px] font-bold text-grey-100">
                      4.1억원
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">대구</span>
                    <span className="text-[16px] font-bold text-grey-100">
                      3.2억원
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">대전</span>
                    <span className="text-[16px] font-bold text-grey-100">
                      2.8억원
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">광주</span>
                    <span className="text-[16px] font-bold text-grey-100">
                      2.4억원
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  전세가율 동향
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">
                      서울 강남구
                    </span>
                    <span className="text-[16px] font-bold text-grey-100">
                      75%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">
                      서울 강서구
                    </span>
                    <span className="text-[16px] font-bold text-grey-100">
                      68%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">
                      경기 성남시
                    </span>
                    <span className="text-[16px] font-bold text-grey-100">
                      65%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-grey-30">
                    <span className="text-[15px] text-grey-80">
                      경기 김포시
                    </span>
                    <span className="text-[16px] font-bold text-grey-100">
                      60%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 전망 탭 내용 */}
          {activeTab === "전망" && (
            <div className="space-y-6 pb-6">
              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  2025년 금리 전망
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    한국은행 기준금리는 3.5% 수준에서 안정세를 유지할 것으로
                    예상됩니다. 인플레이션 압력이 완화되면서 하반기 소폭 인하
                    가능성도 점쳐지고 있습니다.
                  </p>

                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="text-[14px] text-grey-100 font-semibold mb-2">
                      전문가 의견
                    </p>
                    <p className="text-[14px] text-grey-80 leading-[20px]">
                      &quot;급격한 금리 변동은 없을 것으로 보이나, 글로벌 경제
                      상황에 따라 유동적일 수 있습니다.&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  신규 공급 전망
                </h2>

                <div className="space-y-3">
                  <p className="text-[15px] text-grey-80 leading-[22px]">
                    수도권을 중심으로 신규 분양 물량이 증가할 예정입니다. 특히
                    GTX 노선 주변 지역의 공급이 확대되어 일부 지역에서 가격 조정
                    가능성이 있습니다.
                  </p>

                  <div>
                    <h3 className="text-[15px] font-bold text-grey-100 mb-2">
                      주요 공급 지역
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-[14px] text-grey-80 leading-[20px]">
                        • GTX-A 노선 주변 (삼성, 수서, 동탄)
                      </li>
                      <li className="text-[14px] text-grey-80 leading-[20px]">
                        • GTX-B 노선 주변 (송도, 인천)
                      </li>
                      <li className="text-[14px] text-grey-80 leading-[20px]">
                        • 3기 신도시 (하남, 남양주, 인천계양)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-4">
                  투자 전략 제언
                </h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-grey-100 mb-2">
                      단기 전략
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-[14px] text-grey-80 leading-[20px]">
                        • 안전 마진을 충분히 확보한 투자
                      </li>
                      <li className="text-[14px] text-grey-80 leading-[20px]">
                        • 규제 변화에 유연하게 대응
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-grey-100 mb-2">
                      장기 전략
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-[14px] text-grey-80 leading-[20px]">
                        • 교통 인프라 개선 지역 주목
                      </li>
                      <li className="text-[14px] text-grey-80 leading-[20px]">
                        • 장기적 관점의 자산 배분
                      </li>
                      <li className="text-[14px] text-grey-80 leading-[20px]">
                        • 입지와 학군 중심 선택
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
