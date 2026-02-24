"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function ResultPage() {
  const router = useRouter();
  const [selectedLTV, setSelectedLTV] = useState(70);
  const [selectedDSR, setSelectedDSR] = useState(40);

  useEffect(() => {
    const loanOptionsStr = localStorage.getItem("loanOptions");
    if (loanOptionsStr) {
      const loanOptions = JSON.parse(loanOptionsStr);
      if (loanOptions.ltv) setSelectedLTV(loanOptions.ltv);
      if (loanOptions.dsr) setSelectedDSR(loanOptions.dsr);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "loanOptions",
      JSON.stringify({
        ltv: selectedLTV,
        dsr: selectedDSR,
      }),
    );
  }, [selectedLTV, selectedDSR]);

  const handleSubmit = () => {
    router.push("/result/final");
  };

  return (
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden">
      <div
        className="flex-1 px-5"
        style={{
          paddingTop: "calc(var(--page-header-offset) + env(safe-area-inset-top))",
          paddingBottom:
            "var(--page-content-bottom-safe)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Header backUrl="/regulation" />

        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          기존 정책 기준으로
          <br />
          대출 조건을 확인해요
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
              LTV (주택담보대출비율)
            </h2>
            <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
              기존 정책은 LTV 70% 기준으로 계산해요.
            </p>
            <div className="flex gap-2">
              <button
                className={`flex w-16 px-4 py-2.5 justify-center items-center rounded-[300px] ${
                  selectedLTV === 70
                    ? "bg-[#000000] text-white"
                    : "border border-grey-40 bg-white text-grey-100"
                }`}
                onClick={() => setSelectedLTV(70)}
              >
                <span className="text-sm font-medium leading-5 tracking-[-0.14px]">
                  70%
                </span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
              DSR (총부채원리금상환비율)
            </h2>
            <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
              1금융권 40%, 2금융권 50% 중 선택해 계산할 수 있어요.
            </p>
            <div className="flex gap-2">
              <button
                className={`flex w-16 px-4 py-2.5 justify-center items-center rounded-[300px] ${
                  selectedDSR === 40
                    ? "bg-[#000000] text-white"
                    : "border border-grey-40 bg-white text-grey-100"
                }`}
                onClick={() => setSelectedDSR(40)}
              >
                <span className="text-sm font-medium leading-5 tracking-[-0.14px]">
                  40%
                </span>
              </button>
              <button
                className={`flex w-16 px-4 py-2.5 justify-center items-center rounded-[300px] ${
                  selectedDSR === 50
                    ? "bg-[#000000] text-white"
                    : "border border-grey-40 bg-white text-grey-100"
                }`}
                onClick={() => setSelectedDSR(50)}
              >
                <span className="text-sm font-medium leading-5 tracking-[-0.14px]">
                  50%
                </span>
              </button>
            </div>
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mt-4">
              <p className="text-[#495057] text-sm font-normal leading-5 tracking-[-0.28px]">
                스트레스 DSR 3단계(수도권 1.5%, 지방 0.75%)가 한도 계산에 반영됩니다.
              </p>
              <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                실제 월 상환액은 실제금리 3.5% 기준으로 별도 계산해요.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[var(--bottom-tab-offset)] left-0 right-0 flex justify-center z-50">
        <div
          className="flex w-full max-w-md px-5 pt-3 pb-3 items-center"
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
