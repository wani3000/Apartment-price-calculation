"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  calculateLoan,
  type LoanInput,
  type RepaymentType,
} from "@/utils/loanCalculator";

const REPAYMENT_OPTIONS: Array<{ key: RepaymentType; label: string }> = [
  { key: "equal-payment", label: "원리금균등" },
  { key: "equal-principal", label: "원금균등" },
  { key: "bullet", label: "만기일시" },
  { key: "step-up", label: "체증식" },
];

const onlyNumber = (value: string) => value.replace(/[^\d.]/g, "");

const formatWonToKorean = (won: number) => {
  if (!Number.isFinite(won) || won <= 0) return "";
  const man = Math.round(won / 10000);
  if (man < 10000) return `${man.toLocaleString()}만 원`;
  const eok = Math.floor(man / 10000);
  const restMan = man % 10000;
  if (restMan === 0) return `${eok.toLocaleString()}억 원`;
  return `${eok.toLocaleString()}억 ${restMan.toLocaleString()}만 원`;
};

export default function LoanCalculatorPage() {
  const router = useRouter();
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("equal-payment");
  const [loanAmountMan, setLoanAmountMan] = useState("");
  const [loanMonths, setLoanMonths] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const inputValid =
    Number(loanAmountMan) > 0 && Number(loanMonths) > 0 && Number(annualRate) >= 0;
  const loanAmountWon = Math.round(Number(loanAmountMan || 0) * 10000);

  const handleCalculate = () => {
    const input: LoanInput = {
      repaymentType,
      principalWon: Math.round(Number(loanAmountMan || 0) * 10000),
      months: Number(loanMonths || 0),
      annualRatePercent: Number(annualRate || 0),
    };
    const result = calculateLoan(input);
    localStorage.setItem("loanCalculatorInput", JSON.stringify(input));
    localStorage.setItem("loanCalculatorResult", JSON.stringify(result));
    router.push("/loan-calculator/result");
  };

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      <Header backUrl="/" />
      <div
        className="flex-1 px-5 overflow-y-auto"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "var(--page-content-bottom-safe)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-4">
          대출계산기
        </h1>
        <p className="text-[#868E96] text-base font-normal leading-6 mb-6">
          상환 방식과 대출 정보를 입력하면 예상 상환 금액을 계산해요.
        </p>

        <div className="grid grid-cols-4 border-b border-grey-40 mb-6">
          {REPAYMENT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setRepaymentType(option.key)}
              className={`w-full py-[10px] px-1 text-center text-[14px] whitespace-nowrap ${
                repaymentType === option.key
                  ? "border-b-2 border-[#000000] text-[#000000] font-bold"
                  : "text-grey-80 font-medium"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              대출 금액
            </label>
            <div
              className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                focusedField === "loanAmount"
                  ? "border-2 border-primary"
                  : "border border-grey-40"
              }`}
            >
              <input
                type="text"
                inputMode="numeric"
                value={loanAmountMan}
                onChange={(e) => setLoanAmountMan(onlyNumber(e.target.value))}
                onFocus={() => setFocusedField("loanAmount")}
                onBlur={() => setFocusedField(null)}
                placeholder="금액 입력"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium whitespace-nowrap">만 원</span>
            </div>
            {loanAmountWon > 0 && (
              <p className="mt-2 text-[#212529] text-[14px] font-semibold leading-5 tracking-[-0.14px]">
                {formatWonToKorean(loanAmountWon)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              대출 기간
            </label>
            <div
              className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                focusedField === "loanMonths"
                  ? "border-2 border-primary"
                  : "border border-grey-40"
              }`}
            >
              <input
                type="text"
                inputMode="numeric"
                value={loanMonths}
                onChange={(e) => setLoanMonths(onlyNumber(e.target.value))}
                onFocus={() => setFocusedField("loanMonths")}
                onBlur={() => setFocusedField(null)}
                placeholder="총 개월수 입력"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium whitespace-nowrap">개월</span>
            </div>
          </div>

          <div>
            <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              연 이자율
            </label>
            <div
              className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                focusedField === "annualRate"
                  ? "border-2 border-primary"
                  : "border border-grey-40"
              }`}
            >
              <input
                type="text"
                inputMode="decimal"
                value={annualRate}
                onChange={(e) => setAnnualRate(onlyNumber(e.target.value))}
                onFocus={() => setFocusedField("annualRate")}
                onBlur={() => setFocusedField(null)}
                placeholder="% 입력"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium whitespace-nowrap">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-cta-container">
        <div className="bottom-cta-surface">
          <button
            type="button"
            disabled={!inputValid}
            onClick={handleCalculate}
            className={`flex h-14 w-full justify-center items-center rounded-[300px] font-semibold text-base transition ${
              inputValid
                ? "bg-[#000000] text-white hover:bg-[#111111]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            계산하기
          </button>
        </div>
      </div>
    </div>
  );
}
