"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  calculateMaxPurchaseForLiving,
  calculateMaxPurchaseForInvestment,
  convertManToWon,
  calculateMonthlyPayment,
  calculateMonthlyInterestOnly,
} from "@/utils/calculator";
import Header from "@/components/Header";
import Head from "next/head";

export default function PlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("gap"); // 'gap' 또는 'live'
  const [calculationResult, setCalculationResult] = useState({
    income: 0,
    assets: 0,
    spouseIncome: 0,
    living: {
      maxPropertyPrice: 0,
      mortgageLimit: 0,
      creditLoan: 0,
      monthlyRepayment: 0,
    },
    investment: {
      maxPropertyPrice: 0,
      creditLoan: 0,
      jeonseDeposit: 0,
      monthlyRepayment: 0,
    },
  });
  const [loanOptions, setLoanOptions] = useState({
    ltv: 70,
    dsr: 40,
  });

  useEffect(() => {
    // URL 파라미터에서 모드(gap/live) 가져오기
    const modeParam = searchParams.get("mode");
    if (modeParam === "gap" || modeParam === "live") {
      setMode(modeParam);
    }

    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // LTV, DSR 옵션 가져오기
    const loanOptionsStr = localStorage.getItem("loanOptions");
    if (loanOptionsStr) {
      setLoanOptions(JSON.parse(loanOptionsStr));
    }

    // 계산 데이터 가져오기
    const calculatorDataStr = localStorage.getItem("calculatorData");
    if (calculatorDataStr) {
      const calculatorData = JSON.parse(calculatorDataStr);

      // 만 원 단위로 저장된 값을 원 단위로 변환
      const income = convertManToWon(calculatorData.income);
      const assets = convertManToWon(calculatorData.assets);
      const spouseIncome = convertManToWon(calculatorData.spouseIncome || 0);
      const totalIncome = income + spouseIncome;

      // 실거주 시나리오 계산
      const livingResult = calculateMaxPurchaseForLiving(
        totalIncome,
        assets,
        loanOptions.dsr,
        3.5, // 금리 3.5%
        40, // 대출 기간 40년
        loanOptions.ltv,
      );

      // 갭투자 시나리오 계산
      const investmentResult = calculateMaxPurchaseForInvestment(
        totalIncome,
        assets,
        53, // 전세가율 53%
      );

      // 월 상환액 계산
      // 실거주 시: 원리금균등상환 (40년)
      const livingMonthlyRepayment = calculateMonthlyPayment(
        livingResult.mortgageLimit,
        3.5,
        40,
      );

      // 갭투자 시: 만기일시상환 (이자만 상환)
      const investmentMonthlyRepayment = calculateMonthlyInterestOnly(
        investmentResult.creditLoan,
        3.5,
      );

      setCalculationResult({
        income: calculatorData.income,
        assets: calculatorData.assets,
        spouseIncome: calculatorData.spouseIncome || 0,
        living: {
          maxPropertyPrice: Math.round(livingResult.maxPropertyPrice / 10000), // 만원 단위로 변환
          mortgageLimit: Math.round(livingResult.mortgageLimit / 10000),
          creditLoan: Math.round(livingResult.creditLoan / 10000),
          monthlyRepayment: Math.round(livingMonthlyRepayment / 10000), // 만원 단위로 변환
        },
        investment: {
          maxPropertyPrice: Math.round(
            investmentResult.maxPropertyPrice / 10000,
          ),
          creditLoan: Math.round(investmentResult.creditLoan / 10000),
          jeonseDeposit: Math.round(investmentResult.jeonseDeposit / 10000),
          monthlyRepayment: Math.round(investmentMonthlyRepayment / 10000), // 만원 단위로 변환
        },
      });
    }
  }, [searchParams, loanOptions]);

  // 숫자를 한글 표기로 변환 (예: 12000 -> 1억 2,000만 원)
  const formatToKorean = (num: number) => {
    if (num < 10000) {
      return `${num.toLocaleString()}만 원`;
    } else {
      const eok = Math.floor(num / 10000);
      const man = num % 10000;

      if (man === 0) {
        return `${eok.toLocaleString()}억 원`;
      } else {
        return `${eok.toLocaleString()}억 ${man.toLocaleString()}만 원`;
      }
    }
  };

  return (
    <>
      <Head>
        <title>구매 자금 계획표 - 실거주 or 갭투자 전략</title>
        <meta
          name="description"
          content="내 자금 구성에 따라 어떤 방식으로 아파트를 매수할 수 있는지 계획표로 정리해드립니다."
        />
        <meta
          name="keywords"
          content="아파트 대출 계산기, 아파트 구매 계산기, 서울 아파트 대출, 갭투자 계산기, 실거주 계산, 부동산 계산기, 아파트담보대출 계산, 내 집 마련 계산기"
        />
        <meta
          property="og:title"
          content="구매 자금 계획표 - 실거주 or 갭투자 전략"
        />
        <meta
          property="og:description"
          content="내 자금 구성에 따라 어떤 방식으로 아파트를 매수할 수 있는지 계획표로 정리해드립니다."
        />
        <meta property="og:image" content="https://aptgugu.com/og.png" />
        <meta property="og:url" content="https://aptgugu.com/result/plan" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="구매 자금 계획표 - 실거주 or 갭투자 전략"
        />
        <meta
          name="twitter:description"
          content="내 자금 구성에 따라 어떤 방식으로 아파트를 매수할 수 있는지 계획표로 정리해드립니다."
        />
        <meta name="twitter:image" content="https://aptgugu.com/og.png" />
      </Head>
      <div
        className="h-screen bg-white flex flex-col overflow-hidden px-5"
        style={{
          paddingTop:
            "calc(var(--page-header-offset) + env(safe-area-inset-top))",
          paddingBottom: "12px",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 헤더 사용 */}
        <Header backUrl="/result/final" />

        {/* 타이틀 */}
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          {username}님의 자금계획
        </h1>

        {/* 최대 금액 정보 */}
        <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-6">
          <h2 className="text-black text-[18px] font-bold leading-[26px] tracking-[-0.18px]">
            {mode === "gap" ? "갭투자 시" : "실거주 시"}
          </h2>
          <p className="text-black text-[22px] font-bold leading-7 tracking-[-0.22px]">
            최대{" "}
            {formatToKorean(
              mode === "gap"
                ? calculationResult.investment.maxPropertyPrice
                : calculationResult.living.maxPropertyPrice,
            )}
          </p>
          <p className="text-[#495057] text-sm font-normal leading-5 tracking-[-0.28px]">
            {mode === "gap"
              ? "세입자의 전세금을 활용해 투자해요"
              : "주택 가격의 70%까지 대출받을 수 있어요"}
          </p>
        </div>

        {mode === "gap" ? (
          <>
            {/* 신용대출 섹션 - 갭투자 시 */}
            <div className="mb-6">
              <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                신용대출
              </h3>
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    연소득의 120%
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatToKorean(calculationResult.income * 1.2)}
                  </p>
                </div>
                <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                  금리 3.5% 기준이에요
                </p>
              </div>
            </div>

            {/* 월 상환액 섹션 - 갭투자 시 */}
            <div className="mb-6">
              <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                월 상환액 (이자)
              </h3>
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    1년 만기
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatToKorean(
                      calculationResult.investment.monthlyRepayment,
                    )}
                  </p>
                </div>
                <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                  이자만 내며 매년 연장하는 만기일시상환 기준이에요
                </p>
              </div>
            </div>

            {/* 전세금 섹션 - 갭투자 시 */}
            <div className="mb-6">
              <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                전세금
              </h3>
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    전세가율 53%
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatToKorean(calculationResult.investment.jeonseDeposit)}
                  </p>
                </div>
                <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                  KB국민은행 25년 6월 주택가격동향 통계에 따라 53%로 산정했어요.
                  고가 아파트는 전세가율이 53%보다 더 낮을 수 있어요
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* DSR 섹션 - 실거주 시 */}
            <div className="mb-6">
              <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                DSR (총부채원리금상환비율)
              </h3>
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    {loanOptions.dsr}% 기준
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    최대{" "}
                    {formatToKorean(calculationResult.living.mortgageLimit)}
                  </p>
                </div>
                <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                  주택담보대출+신용대출
                </p>
              </div>
            </div>

            {/* 주택담보대출 섹션 - 실거주 시 */}
            <div className="mb-6">
              <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                주택담보대출
              </h3>
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    40년 만기
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatToKorean(calculationResult.living.mortgageLimit)}
                  </p>
                </div>
                <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                  금리 3.5% 기준이에요
                </p>
              </div>
            </div>

            {/* 신용대출 섹션 - 실거주 시 */}
            <div className="mb-6">
              <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                신용대출
              </h3>
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    연소득의 120%
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatToKorean(calculationResult.living.creditLoan)}
                  </p>
                </div>
                <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                  금리 3.5% 기준이에요
                </p>
              </div>
            </div>

            {/* 월 상환액 섹션 - 실거주 시 */}
            <div className="mb-6">
              <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                월 상환액 (원금+이자)
              </h3>
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    40년 만기
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatToKorean(calculationResult.living.monthlyRepayment)}
                  </p>
                </div>
                <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                  원금과 이자를 함께 갚는 원리금균등상환 기준이에요
                </p>
              </div>
            </div>
          </>
        )}

        {/* 보유자산 섹션 - 공통 */}
        <div className="mb-6">
          <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
            보유자산
          </h3>
          <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
            <div className="flex justify-between items-center w-full">
              <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                보유자산
              </p>
              <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                {formatToKorean(calculationResult.assets)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
