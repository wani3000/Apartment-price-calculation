"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [hasCalculatorData, setHasCalculatorData] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
    setHasCalculatorData(Boolean(localStorage.getItem("calculatorData")));
  }, []);

  return (
    <div className="h-[100dvh] bg-white flex flex-col items-center overflow-hidden">
      <Header showBack={false} showBorder={false} logoLink="/" />

      <div
        className="w-full flex-1 overflow-y-auto"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "calc(88px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="w-full max-w-md px-5 mx-auto">
          <h1 className="text-grey-100 text-[36px] font-bold leading-[44px] tracking-[-0.36px] mb-1">
            홈
          </h1>
          <p className="text-grey-80 text-base font-medium leading-6 tracking-[-0.16px] mb-6">
            {hasCalculatorData
              ? `${username || "사용자"}님, 내 결과를 확인하거나 새로 계산할 수 있어요`
              : "소득과 자산을 입력해 내 최대 구매 가능 금액을 계산해요"}
          </p>
        </div>

        <div className="w-full max-w-md px-5 mx-auto space-y-3">
          <button
            onClick={() => router.push("/calculator")}
            className="w-full rounded-[32px] bg-[#DCE9FF] px-6 py-6 text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[#495057] text-[18px] font-medium leading-7">
                  빠른 계산
                </p>
                <p className="text-[#212529] text-[34px] font-bold leading-[42px] tracking-[-0.34px] mt-1">
                  시작하기
                </p>
                <p className="text-[#212529] text-[32px] font-bold leading-[40px] tracking-[-0.32px]">
                  →
                </p>
              </div>
              <div className="w-[88px] h-[88px] rounded-2xl bg-white/60 flex items-center justify-center shrink-0">
                <Image
                  src="/images/home-image-01.png"
                  alt="계산"
                  width={76}
                  height={76}
                  unoptimized
                  className="w-[76px] h-[76px] object-contain"
                />
              </div>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/calculator")}
              className="rounded-[28px] bg-[#EFF1F5] px-5 py-7 text-left"
            >
              <p className="text-[#212529] text-[34px] font-bold leading-[42px] tracking-[-0.34px]">
                새로
              </p>
              <p className="text-[#212529] text-[34px] font-bold leading-[42px] tracking-[-0.34px]">
                입력
              </p>
            </button>
            <button
              onClick={() =>
                router.push(hasCalculatorData ? "/result/final" : "/recommend")
              }
              className="rounded-[28px] bg-[#D9F0FF] px-5 py-7 text-left"
            >
              <p className="text-[#212529] text-[34px] font-bold leading-[42px] tracking-[-0.34px]">
                {hasCalculatorData ? "내 결과" : "추천"}
              </p>
              <p className="text-[#212529] text-[34px] font-bold leading-[42px] tracking-[-0.34px]">
                {hasCalculatorData ? "보기" : "아파트"}
              </p>
            </button>
          </div>

          <button
            onClick={() => router.push("/recommend")}
            className="w-full rounded-[32px] bg-[#E3EEFF] px-6 py-7 text-left"
          >
            <p className="text-[#495057] text-[17px] font-medium leading-7">
              최근 실거래 추천
            </p>
            <p className="text-[#212529] text-[32px] font-bold leading-[40px] tracking-[-0.32px] mt-1">
              추천 아파트
            </p>
          </button>
        </div>

        <div className="w-full max-w-md px-5 mx-auto mt-8 pb-6 space-y-5">
          <button
            onClick={() => router.push(hasCalculatorData ? "/result/final" : "/calculator")}
            className="w-full bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EDF3FF] flex items-center justify-center text-[#2A6CFF] text-xl font-bold">
                ₩
              </div>
              <div className="text-left">
                <p className="text-[#212529] text-[24px] font-bold leading-8 tracking-[-0.24px]">
                  {hasCalculatorData ? "내 결과 페이지" : "소득·자산 입력"}
                </p>
                <p className="text-[#868E96] text-base font-normal leading-6">
                  {hasCalculatorData
                    ? "계산된 최대 구매 금액을 확인해요"
                    : "내 정보를 입력하고 바로 계산해요"}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/recommend")}
            className="w-full bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EEF7FF] flex items-center justify-center text-[#3C82F6] text-xl font-bold">
                ⌂
              </div>
              <div className="text-left">
                <p className="text-[#212529] text-[24px] font-bold leading-8 tracking-[-0.24px]">
                  추천 아파트
                </p>
                <p className="text-[#868E96] text-base font-normal leading-6">
                  최근 실거래 기준으로 추천을 확인해요
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/menu")}
            className="w-full bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#F2F4F8] flex items-center justify-center text-[#495057] text-xl font-bold">
                ☰
              </div>
              <div className="text-left">
                <p className="text-[#212529] text-[24px] font-bold leading-8 tracking-[-0.24px]">
                  서비스 메뉴
                </p>
                <p className="text-[#868E96] text-base font-normal leading-6">
                  정책 안내와 자주 묻는 질문을 확인해요
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
