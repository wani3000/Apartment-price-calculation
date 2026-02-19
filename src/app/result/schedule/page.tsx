"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

type ScheduleRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n;
  const pow = Math.pow(1 + monthlyRate, n);
  return (principal * monthlyRate * pow) / (pow - 1);
}

function buildSchedule(
  principal: number,
  annualRate: number,
  years: number,
): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  let balance = principal;

  for (let month = 1; month <= totalMonths; month += 1) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPaid = Math.min(balance, monthlyPayment - interest);
    balance = Math.max(0, balance - principalPaid);
    rows.push({
      month,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  return rows;
}

function formatWon(value: number): string {
  return `${Math.round(value).toLocaleString()}원`;
}

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const principal = Number(searchParams.get("principal") || 0);
  const rate = Number(searchParams.get("rate") || 0);
  const years = Number(searchParams.get("years") || 30);

  const schedule = useMemo(
    () => buildSchedule(principal, rate, years),
    [principal, rate, years],
  );
  const totalInterest = useMemo(
    () => schedule.reduce((sum, row) => sum + row.interest, 0),
    [schedule],
  );
  const totalPayment = useMemo(
    () => schedule.reduce((sum, row) => sum + row.payment, 0),
    [schedule],
  );

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div
        className="flex-1 px-5 overflow-y-auto"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom:
            "calc(var(--page-bottom-cta-offset) + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Header backUrl="/result/final" />

        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-4">
          {years}년 만기 상환 스케줄표
        </h1>

        <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-4">
          <p className="text-[#495057] text-sm font-medium leading-5">
            대출원금:{" "}
            <span className="text-[#212529]">{formatWon(principal)}</span>
          </p>
          <p className="text-[#495057] text-sm font-medium leading-5">
            적용금리: <span className="text-[#212529]">{rate.toFixed(2)}%</span>
          </p>
          <p className="text-[#495057] text-sm font-medium leading-5">
            총 납입액:{" "}
            <span className="text-[#212529]">{formatWon(totalPayment)}</span>
          </p>
          <p className="text-[#495057] text-sm font-medium leading-5">
            총 이자액:{" "}
            <span className="text-[#212529]">{formatWon(totalInterest)}</span>
          </p>
        </div>

        <div className="rounded-xl border border-grey-40 overflow-hidden mb-8">
          <div className="grid grid-cols-5 bg-[#F8F9FA] text-xs font-bold text-[#495057]">
            <div className="px-2 py-3 text-center">회차</div>
            <div className="px-2 py-3 text-right">월 납입액</div>
            <div className="px-2 py-3 text-right">원금</div>
            <div className="px-2 py-3 text-right">이자</div>
            <div className="px-2 py-3 text-right">잔액</div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {schedule.map((row) => (
              <div
                key={row.month}
                className="grid grid-cols-5 border-t border-grey-40 text-[12px] text-[#495057]"
              >
                <div className="px-2 py-2 text-center">{row.month}</div>
                <div className="px-2 py-2 text-right">
                  {formatWon(row.payment)}
                </div>
                <div className="px-2 py-2 text-right">
                  {formatWon(row.principal)}
                </div>
                <div className="px-2 py-2 text-right">
                  {formatWon(row.interest)}
                </div>
                <div className="px-2 py-2 text-right">
                  {formatWon(row.balance)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
