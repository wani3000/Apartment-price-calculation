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
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden">
      <div
        className="flex-1 px-5 overflow-y-auto"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom:
            "calc(var(--page-bottom-cta-offset) + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Header backUrl="/result/final" showMenu={false} />

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

        <div className="mb-2">
          <h2 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
            월별 상세 상환 내역
          </h2>
          <p className="text-[#868E96] text-[13px] leading-[18px] tracking-[-0.26px] mb-3">
            표는 좌우로만 스크롤되고, 세로 스크롤은 페이지 전체에서 한 번에
            이동해요.
          </p>
        </div>

        <div className="rounded-2xl border border-grey-40 bg-white overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-bold text-[#495057]">
                    회차
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-[#495057]">
                    월 납입액
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-[#495057]">
                    원금
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-[#495057]">
                    이자
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-[#495057]">
                    잔액
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr
                    key={row.month}
                    className="border-t border-grey-40 text-[12px] text-[#495057] even:bg-[#FCFCFD]"
                  >
                    <td className="px-3 py-2 text-center">{row.month}</td>
                    <td className="px-3 py-2 text-right">{formatWon(row.payment)}</td>
                    <td className="px-3 py-2 text-right">
                      {formatWon(row.principal)}
                    </td>
                    <td className="px-3 py-2 text-right">{formatWon(row.interest)}</td>
                    <td className="px-3 py-2 text-right">{formatWon(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
