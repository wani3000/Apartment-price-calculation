"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import type { LoanResult, LoanScheduleRow } from "@/utils/loanCalculator";

const formatToKoreanWon = (won: number) => {
  const man = Math.round(won / 10000);
  if (man < 10000) return `${man.toLocaleString()}만 원`;
  const eok = Math.floor(man / 10000);
  const restMan = man % 10000;
  if (restMan === 0) return `${eok.toLocaleString()}억 원`;
  return `${eok.toLocaleString()}억 ${restMan.toLocaleString()}만 원`;
};

const methodLabel = (type: string) => {
  switch (type) {
    case "equal-principal":
      return "원금균등";
    case "bullet":
      return "만기일시";
    case "step-up":
      return "체증식";
    case "equal-payment":
    default:
      return "원리금균등";
  }
};

export default function LoanCalculatorResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<LoanResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("loanCalculatorResult");
    if (!stored) return;
    try {
      setResult(JSON.parse(stored) as LoanResult);
    } catch {
      setResult(null);
    }
  }, []);

  const previewRows = useMemo<LoanScheduleRow[]>(() => {
    if (!result?.rows) return [];
    return result.rows.slice(0, 12);
  }, [result]);

  if (!result) {
    return (
      <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
        <Header backUrl="/loan-calculator" logoLink="/" />
        <div
          className="flex-1 px-5 flex items-center"
          style={{
            paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
            paddingBottom: "var(--page-content-bottom-safe)",
          }}
        >
          <div className="w-full rounded-2xl bg-[#F8F9FA] p-5">
            <p className="text-[#495057] text-[15px] leading-[22px]">
              계산 결과가 없어요. 대출 정보를 입력하고 다시 계산해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      <Header backUrl="/loan-calculator" logoLink="/" />

      <div
        className="flex-1 px-5 overflow-y-auto"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "var(--page-content-bottom-safe)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
          대출 계산 결과
        </h1>
        <p className="text-[#868E96] text-base font-normal leading-6 mb-5">
          {methodLabel(result.input.repaymentType)} 기준으로 계산했어요.
        </p>

        <div className="rounded-2xl bg-[#F8F9FA] p-4 mb-4">
          <div className="flex justify-between items-center py-1">
            <p className="text-[#495057] text-[15px]">월 납입금(첫 달)</p>
            <p className="text-[#212529] text-[15px] font-bold">
              {formatToKoreanWon(result.firstMonthPaymentWon)}
            </p>
          </div>
          <div className="flex justify-between items-center py-1">
            <p className="text-[#495057] text-[15px]">총 상환액</p>
            <p className="text-[#212529] text-[15px] font-bold">
              {formatToKoreanWon(result.totalPaymentWon)}
            </p>
          </div>
          <div className="flex justify-between items-center py-1">
            <p className="text-[#495057] text-[15px]">총 이자</p>
            <p className="text-[#212529] text-[15px] font-bold">
              {formatToKoreanWon(result.totalInterestWon)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8F9FA] overflow-hidden mb-6">
          <div className="grid grid-cols-[56px_1fr_1fr] px-4 py-3 border-b border-[#E9ECEF]">
            <p className="text-[#495057] text-[13px] font-medium">회차</p>
            <p className="text-[#495057] text-[13px] font-medium text-right">납입금</p>
            <p className="text-[#495057] text-[13px] font-medium text-right">잔액</p>
          </div>
          {previewRows.map((row) => (
            <div
              key={row.month}
              className="grid grid-cols-[56px_1fr_1fr] px-4 py-3 border-b border-[#E9ECEF] last:border-b-0"
            >
              <p className="text-[#495057] text-[14px]">{row.month}</p>
              <p className="text-[#212529] text-[14px] text-right">
                {formatToKoreanWon(row.paymentWon)}
              </p>
              <p className="text-[#212529] text-[14px] text-right">
                {formatToKoreanWon(row.balanceWon)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-cta-container">
        <div className="bottom-cta-surface">
          <button
            type="button"
            onClick={() => router.push("/loan-calculator")}
            className="flex h-14 w-full justify-center items-center rounded-[300px] bg-[#000000] text-white font-semibold text-base"
          >
            다시 계산하기
          </button>
        </div>
      </div>
    </div>
  );
}

