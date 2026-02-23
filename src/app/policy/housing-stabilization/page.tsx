"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function HousingStabilizationPage() {
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
          <h1 className="text-[28px] font-bold leading-[36px] text-grey-100 mb-2 mt-6">
            10.15 주택시장
            <br />
            안정화 대책
          </h1>
          <p className="text-[14px] text-grey-70 mb-8">2025년 10월 15일 발표</p>

          <div className="space-y-6 pb-6">
            {/* 규제지역 확대 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                규제지역 확대
              </h2>
              <p className="text-[15px] text-grey-80 leading-[22px] mb-3">
                서울시 전 지역(25개 자치구)과 경기도 12개 지역을 조정대상지역 및
                투기과열지구로 지정
              </p>
              <div className="bg-[#F5F5F5] rounded-lg p-4">
                <p className="text-[14px] text-grey-100 font-semibold mb-2">
                  경기도 12개 지역
                </p>
                <p className="text-[14px] text-grey-80 leading-[20px]">
                  과천, 광명, 성남(분당·수정·중원), 수원(영통·장안·팔달),
                  안양(동안), 용인(수지), 의왕, 하남
                </p>
                <p className="text-[12px] text-grey-70 mt-2">
                  ※ 시행일: 2025년 10월 16일
                </p>
              </div>
            </div>

            {/* 가격구간별 주담대 한도 제한 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                가격구간별 주담대 한도 제한
              </h2>
              <p className="text-[15px] text-grey-80 leading-[22px] mb-3">
                수도권·규제지역 내 주택가격 기준으로 차등 적용
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 border-b border-grey-30">
                  <span className="text-[15px] text-grey-80">15억원 이하</span>
                  <span className="text-[16px] font-bold text-grey-100">
                    최대 6억원
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-grey-30">
                  <span className="text-[15px] text-grey-80">15~25억원</span>
                  <span className="text-[16px] font-bold text-grey-100">
                    최대 4억원
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-grey-30">
                  <span className="text-[15px] text-grey-80">25억원 초과</span>
                  <span className="text-[16px] font-bold text-grey-100">
                    최대 2억원
                  </span>
                </div>
              </div>
              <p className="text-[12px] text-grey-70 mt-3">
                ※ 시행일: 2025년 10월 16일
              </p>
            </div>

            {/* 스트레스 DSR 3.0% 상향 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                스트레스 DSR 3.0% 상향
              </h2>
              <p className="text-[15px] text-grey-80 leading-[22px] mb-3">
                수도권·규제지역 내 주담대의 스트레스 금리를 1.5%에서 3.0%로 상향
                조정
              </p>
              <div className="bg-[#FFF8F0] rounded-lg p-4 border border-[#FFE4CC]">
                <p className="text-[14px] text-grey-100 font-semibold mb-2">
                  영향
                </p>
                <p className="text-[14px] text-grey-80 leading-[20px]">
                  5년 주기형 대출 시 0.6%(1.5%×40%)에서 1.2%(3%×40%)로 상승하여
                  대출한도 실질 축소
                </p>
                <p className="text-[12px] text-grey-70 mt-2">
                  ※ 시행일: 2025년 10월 16일
                </p>
              </div>
            </div>

            {/* 1주택자 전세대출 이자 DSR 반영 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                1주택자 전세대출 이자 DSR 반영
              </h2>
              <p className="text-[15px] text-grey-80 leading-[22px] mb-3">
                1주택자가 수도권·규제지역에서 전세대출을 받는 경우, 전세대출
                이자상환분을 DSR에 반영
              </p>
              <div className="bg-[#F5F5F5] rounded-lg p-4">
                <p className="text-[14px] text-grey-80 leading-[20px]">
                  기존에는 전세대출이 DSR 적용 대상에서 제외되었으나, 이제
                  포함되어 추가 대출 여력이 축소됩니다.
                </p>
                <p className="text-[12px] text-grey-70 mt-2">
                  ※ 시행일: 2025년 10월 29일
                </p>
              </div>
            </div>

            {/* 기타 주요 정책 */}
            <div>
              <h2 className="text-[18px] font-bold text-grey-100 leading-[26px] mb-3">
                기타 주요 정책
              </h2>
              <ul className="space-y-2">
                <li className="text-[15px] text-grey-80 leading-[22px]">
                  • 주담대 위험가중치 하한 15%→20% 상향(26.1월 조기 시행)
                </li>
                <li className="text-[15px] text-grey-80 leading-[22px]">
                  • 부동산 거래 감독기구 신설(국무총리 소속)
                </li>
                <li className="text-[15px] text-grey-80 leading-[22px]">
                  • 부동산 세제 합리화 검토
                </li>
                <li className="text-[15px] text-grey-80 leading-[22px]">
                  • 향후 5년간 수도권 135만호 공급 계획
                </li>
              </ul>
            </div>

            {/* 정책 목표 */}
            <div className="bg-[#E8F0FE] rounded-lg p-5">
              <h3 className="text-[16px] font-bold text-grey-100 mb-2">
                정책 목표
              </h3>
              <p className="text-[14px] text-grey-80 leading-[20px]">
                서울 및 수도권의 주택가격 급등세를 조기에 차단하고, 생산적
                부문으로 자본이 투자될 수 있도록 유도
              </p>
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
