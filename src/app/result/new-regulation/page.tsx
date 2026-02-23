"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import {
  convertManToWon,
  calculateMaxPurchaseWithNewRegulation627,
} from "@/utils/calculator";

export default function NewRegulationResultPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedLoanAmount, setSelectedLoanAmount] = useState("6억");
  const [selectedDSR, setSelectedDSR] = useState(40);
  const [calculatorData, setCalculatorData] = useState({
    income: 0,
    assets: 0,
    spouseIncome: 0,
  });
  const [calculationResult, setCalculationResult] = useState({
    maxPropertyPrice: 0,
    mortgageLimit: 0,
    monthlyRepayment: 0,
  });

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 계산 데이터 가져오기
    const calculatorDataStr = localStorage.getItem("calculatorData");
    if (calculatorDataStr) {
      const data = JSON.parse(calculatorDataStr);
      setCalculatorData(data);

      // 새로운 규제 로직으로 계산 수행 (기존 함수들 활용)
      const totalIncome = convertManToWon(
        data.income + (data.spouseIncome || 0),
      );
      const totalAssets = convertManToWon(data.assets);

      // 6.27 규제 적용 계산 (수도권 기준)
      const result = calculateMaxPurchaseWithNewRegulation627(
        totalIncome,
        totalAssets,
        true,
      );

      // 결과를 만원 단위로 변환
      const calculationResult = {
        maxPropertyPrice: Math.round(result.maxPropertyPrice / 10000),
        mortgageLimit: Math.round(result.mortgageLimit / 10000),
        monthlyRepayment: Math.round(result.monthlyRepayment / 10000),
        effectiveRate: result.effectiveRate,
        loanYears: 30,
        dsrRatio: 40,
      };

      // 새로운 규제 계산 결과 저장
      localStorage.setItem(
        "newRegulationResult",
        JSON.stringify(calculationResult),
      );

      setCalculationResult(calculationResult);
    }
  }, []);

  // 새로운 규제 옵션 저장
  useEffect(() => {
    localStorage.setItem(
      "newRegulationOptions",
      JSON.stringify({
        maxLoanAmount: selectedLoanAmount,
        dsr: selectedDSR,
        regulationType: "new627",
      }),
    );
  }, [selectedLoanAmount, selectedDSR]);

  const handleSubmit = () => {
    // 최종 결과 페이지로 이동 (6.27 규제안 파라미터 포함)
    router.push("/result/final?regulation=new627");
  };

  return (
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden">
      {/* 메인 컨텐츠 영역 */}
      <div
        className="flex-1 px-5"
        style={{
          paddingTop:
            "calc(var(--page-header-offset) + env(safe-area-inset-top))",
          paddingBottom:
            "calc(var(--page-bottom-cta-offset) + env(safe-area-inset-bottom))",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 헤더 컴포넌트 사용 */}
        <Header backUrl="/regulation" />

        {/* 타이틀 */}
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          실거주 시 받을 수 있는 대출을
          <br />
          확인해요
        </h1>

        {/* 선택 옵션들 */}
        <div className="space-y-8">
          {/* 최대 대출 금액 섹션 (기존 LTV) */}
          <div>
            <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
              최대 대출 금액
            </h2>
            <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
              개인별 대출 한도가 6억 원으로 제한되며, 30년 대출 기간이
              적용됩니다.
            </p>
            <div className="flex space-x-2">
              <button
                className="flex px-4 py-2.5 justify-center items-center rounded-[300px] bg-[#000000] text-white"
                onClick={() => setSelectedLoanAmount("6억")}
              >
                <span className="text-sm font-medium leading-5 tracking-[-0.14px]">
                  최대 6억 원
                </span>
              </button>
            </div>
          </div>

          {/* DSR 섹션 */}
          <div>
            <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
              DSR (총부채원리금상환비율)
            </h2>
            <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
              모든 금융업권에 DSR 40% 규제가 통일 적용되며, 실제 금리는 평균
              변동금리인 3.5%로 설정하였으며, 개인의 신용도에 따라 달라질 수
              있고 여기에 수도권 (3.5% + 1.5% 스트레스변동금리)를 더한 금리로
              계산됩니다.
            </p>
            <div className="flex space-x-2">
              <button
                className="flex w-16 px-4 py-2.5 justify-center items-center rounded-[300px] bg-[#000000] text-white"
                onClick={() => setSelectedDSR(40)}
              >
                <span className="text-sm font-medium leading-5 tracking-[-0.14px]">
                  40%
                </span>
              </button>
            </div>

            {/* 가계부채 관리 강화 방안 안내 */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-blue-800 text-sm font-bold leading-5 mb-1">
                    가계부채 관리 강화 방안
                  </h3>
                  <div className="text-blue-700 text-xs leading-4 space-y-1">
                    <p>
                      2025년 6월 28일부터 시행되는 포괄적 부채관리 강화
                      방안으로, 모든 금융업권에 DSR 40% 규제가 동일하게
                      적용됩니다.
                    </p>
                    <p>
                      개인별 대출 한도는 6억 원으로 제한되며, 대출 만기는
                      30년으로 단축됩니다.
                    </p>
                    <p>
                      실제 금리는 평균 변동금리인 3.5%로 설정하였으며, 개인의
                      신용도에 따라 달라질 수 있고 여기에 수도권 (3.5% + 1.5%
                      스트레스변동금리)를 더한 금리를 적용하여 더욱 보수적인
                      대출 한도가 산정됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 safe-area-inset-bottom">
        <button
          onClick={handleSubmit}
          className="flex h-14 w-full justify-center items-center rounded-[300px] bg-primary text-white font-semibold text-base"
        >
          다음
        </button>
      </div>
    </div>
  );
}
