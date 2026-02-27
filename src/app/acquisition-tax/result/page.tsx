"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import type { AcquisitionTaxResult } from "@/utils/acquisitionTaxCalculator";

const formatToKoreanWon = (won: number) => {
  const man = Math.round(won / 10000);
  if (man < 10000) return `${man.toLocaleString()}만 원`;
  const eok = Math.floor(man / 10000);
  const restMan = man % 10000;
  if (restMan === 0) return `${eok.toLocaleString()}억 원`;
  return `${eok.toLocaleString()}억 ${restMan.toLocaleString()}만 원`;
};

const formatPercent = (value: number) => `${(value * 100).toFixed(2).replace(/\.00$/, "")}%`;

export default function AcquisitionTaxResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AcquisitionTaxResult | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("acquisitionTaxResult");
    if (!raw) return;
    try {
      setResult(JSON.parse(raw) as AcquisitionTaxResult);
    } catch {
      setResult(null);
    }
  }, []);

  if (!result) {
    return (
      <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
        <Header backUrl="/acquisition-tax" logoLink="/" />
        <div
          className="flex-1 px-5 flex items-center"
          style={{
            paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
            paddingBottom: "var(--page-content-bottom-safe)",
          }}
        >
          <div className="w-full rounded-2xl bg-[#F8F9FA] p-5">
            <p className="text-[#495057] text-[15px] leading-[22px]">
              계산 결과가 없어요. 취등록세 정보를 입력하고 다시 계산해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      <Header backUrl="/acquisition-tax" logoLink="/" />

      <div
        className="flex-1 px-5 overflow-y-auto"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "var(--page-content-bottom-safe)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
          취등록세 계산 결과
        </h1>
        <p className="text-[#868E96] text-base font-normal leading-6 mb-5">
          취득세, 지방교육세, 농어촌특별세를 합산해 계산했어요.
        </p>

        <div className="rounded-2xl bg-[#DCE9FF] p-4 mb-4">
          <div className="flex justify-between items-center py-1">
            <p className="text-[#495057] text-[15px]">총 세금</p>
            <p className="text-[#212529] text-[18px] font-bold">
              {formatToKoreanWon(result.totalTaxWon)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8F9FA] p-4 mb-4">
          <div className="flex justify-between items-center py-1">
            <p className="text-[#495057] text-[15px]">과세표준</p>
            <p className="text-[#212529] text-[15px] font-bold">
              {formatToKoreanWon(result.taxBaseWon)}
            </p>
          </div>
          <div className="flex justify-between items-center py-1">
            <p className="text-[#495057] text-[15px]">취득세 ({formatPercent(result.acquisitionRate)})</p>
            <p className="text-[#212529] text-[15px] font-bold">
              {formatToKoreanWon(result.acquisitionTaxWon)}
            </p>
          </div>
          <div className="flex justify-between items-center py-1">
            <p className="text-[#495057] text-[15px]">지방교육세 ({formatPercent(result.localEducationRate)})</p>
            <p className="text-[#212529] text-[15px] font-bold">
              {formatToKoreanWon(result.localEducationTaxWon)}
            </p>
          </div>
          <div className="flex justify-between items-center py-1">
            <p className="text-[#495057] text-[15px]">농어촌특별세 ({formatPercent(result.ruralSpecialRate)})</p>
            <p className="text-[#212529] text-[15px] font-bold">
              {formatToKoreanWon(result.ruralSpecialTaxWon)}
            </p>
          </div>
          {result.firstHomeBuyerDeductionWon > 0 && (
            <div className="flex justify-between items-center py-1">
              <p className="text-[#495057] text-[15px]">생애최초 감면</p>
              <p className="text-[#1D4ED8] text-[15px] font-bold">
                -{formatToKoreanWon(result.firstHomeBuyerDeductionWon)}
              </p>
            </div>
          )}
        </div>

        {result.notes.length > 0 && (
          <div className="rounded-2xl bg-[#F8F9FA] p-4 mb-6">
            <h3 className="text-[#212529] text-[16px] font-bold leading-6 mb-2">참고</h3>
            <ul className="space-y-1">
              {result.notes.map((note, index) => (
                <li key={index} className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bottom-cta-container">
        <div className="bottom-cta-surface">
          <button
            type="button"
            onClick={() => router.push("/acquisition-tax")}
            className="flex h-14 w-full justify-center items-center rounded-[300px] bg-[#000000] text-white font-semibold text-base"
          >
            다시 계산하기
          </button>
        </div>
      </div>
    </div>
  );
}
