"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function NewRegulationResultPage() {
  const router = useRouter();
  const [selectedLoanAmount, setSelectedLoanAmount] = useState("6억");
  const [selectedDSR, setSelectedDSR] = useState(40);

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
    router.push("/result/final?regulation=new627");
  };

  return (
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden">
      <div
        className="flex-1 px-5"
        style={{
          paddingTop: "calc(var(--page-header-offset) + env(safe-area-inset-top))",
          paddingBottom:
            "calc(var(--page-bottom-cta-offset) + env(safe-area-inset-bottom))",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Header backUrl="/regulation" />

        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          6.27 규제안 기준으로
          <br />
          대출 조건을 확인해요
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
              최대 대출 금액
            </h2>
            <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
              개인별 주담대 한도는 최대 6억 원으로 제한돼요.
            </p>
            <div className="flex gap-2">
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

          <div>
            <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
              DSR (총부채원리금상환비율)
            </h2>
            <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
              모든 금융권에서 DSR 40%가 동일 적용돼요.
            </p>
            <div className="flex gap-2">
              <button
                className="flex w-16 px-4 py-2.5 justify-center items-center rounded-[300px] bg-[#000000] text-white"
                onClick={() => setSelectedDSR(40)}
              >
                <span className="text-sm font-medium leading-5 tracking-[-0.14px]">
                  40%
                </span>
              </button>
            </div>
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mt-4">
              <p className="text-[#495057] text-sm font-normal leading-5 tracking-[-0.28px]">
                30년 만기 기준이며, 수도권은 한도 산정 시 스트레스 금리 1.5%를 더해 계산해요.
              </p>
              <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                실제 월 상환액은 실제금리 3.5% 기준으로 산정합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
        <div
          className="flex w-full max-w-md px-5 pt-10 pb-[25px] items-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 31.25%)",
          }}
        >
          <button
            onClick={handleSubmit}
            className="flex h-14 w-full justify-center items-center rounded-[300px] bg-[#000000] text-white font-semibold text-base"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
