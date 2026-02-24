"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import {
  fetchLatestRegionApartmentsFromMcp,
  type RecommendedApartment,
} from "@/utils/mcpRecommendations";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [hasCalculatorData, setHasCalculatorData] = useState(false);
  const [latestTrades, setLatestTrades] = useState<RecommendedApartment[]>([]);
  const [latestTradeIndex, setLatestTradeIndex] = useState(0);
  const [tickerKey, setTickerKey] = useState(0);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
    setHasCalculatorData(Boolean(localStorage.getItem("calculatorData")));
  }, []);

  const formatToKoreanWon = (won: number) => {
    const man = Math.round(won / 10000);
    if (man < 10000) return `${man.toLocaleString()}만 원`;
    const eok = Math.floor(man / 10000);
    const restMan = man % 10000;
    if (restMan === 0) return `${eok.toLocaleString()}억 원`;
    return `${eok.toLocaleString()}억 ${restMan.toLocaleString()}만 원`;
  };

  const fetchLatestTrades = useCallback(async () => {
    try {
      const policyRegionDetailsStr = localStorage.getItem("policyRegionDetails");
      const region = policyRegionDetailsStr ? JSON.parse(policyRegionDetailsStr) : {};
      const primaryRegion = {
        siDo: typeof region?.siDo === "string" && region.siDo.trim() ? region.siDo : "서울",
        siGunGu:
          typeof region?.siGunGu === "string" && region.siGunGu.trim()
            ? region.siGunGu
            : "강남구",
      };

      let list = await fetchLatestRegionApartmentsFromMcp({
        siDo: primaryRegion.siDo,
        siGunGu: primaryRegion.siGunGu,
        limit: 10,
      });

      // 지역 정보가 불완전하거나 해당 지역 최신 데이터가 비어 있을 때 기본 지역으로 재조회
      if (list.length === 0 && (primaryRegion.siDo !== "서울" || primaryRegion.siGunGu !== "강남구")) {
        list = await fetchLatestRegionApartmentsFromMcp({
          siDo: "서울",
          siGunGu: "강남구",
          limit: 10,
        });
      }

      setLatestTrades(list);
      if (list.length > 0) {
        localStorage.setItem("latestRegionTradesCache", JSON.stringify(list));
      }
      setLatestTradeIndex(0);
      setTickerKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      const cachedLatest = localStorage.getItem("latestRegionTradesCache");
      const cachedRecommended = localStorage.getItem("recommendedApartmentsCache");
      const fallback = cachedLatest || cachedRecommended;
      if (fallback) {
        try {
          const parsed = JSON.parse(fallback) as RecommendedApartment[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLatestTrades(parsed.slice(0, 10));
            setLatestTradeIndex(0);
            setTickerKey((prev) => prev + 1);
            return;
          }
        } catch {
          // ignore invalid cache
        }
      }
      setLatestTrades([]);
    }
  }, []);

  useEffect(() => {
    void fetchLatestTrades();
  }, [fetchLatestTrades]);

  useEffect(() => {
    if (latestTrades.length <= 1) return;
    const timer = setInterval(() => {
      setLatestTradeIndex((prev) => {
        const next = (prev + 1) % latestTrades.length;
        setTickerKey((key) => key + 1);
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [latestTrades]);

  const currentTickerTrade =
    latestTrades.length > 0 ? latestTrades[latestTradeIndex] : null;

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col items-center overflow-x-hidden">
      <Header showBack={false} showBorder={false} logoLink="/" />

      <div
        className="w-full flex-1 min-h-0 overflow-y-auto overscroll-y-contain"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "calc(88px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="w-full max-w-md px-5 mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-grey-100 text-[36px] font-bold leading-[44px] tracking-[-0.36px]">
                  {username || "사용자"}
                </h1>
                <button
                  onClick={() => router.push("/nickname")}
                  className="text-[#ADB5BD]"
                  aria-label="닉네임 수정"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.4 18.5 6.6L17.4 5.5C16.6 4.7 15.3 4.7 14.5 5.5L4 16V20Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M13 7L17 11" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
                <p className="text-[#212529] text-[22px] font-bold leading-8 tracking-[-0.22px] mt-1">
                  시작하기
                </p>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-1"
                >
                  <path
                    d="M5 12H19"
                    stroke="#212529"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 6L19 12L13 18"
                    stroke="#212529"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
              className="rounded-[28px] bg-[#EFF1F5] px-5 py-6 text-left"
            >
              <div className="flex items-center justify-between">
                <p className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
                  새로 입력
                </p>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 3.5H14.8L19 7.7V20.5H5V3.5Z"
                    fill="#8CC8FF"
                  />
                  <path
                    d="M15 3.5V7.5H19"
                    fill="#62B3FF"
                  />
                  <path
                    d="M9.2 15.6L14.7 10.1L16.2 11.6L10.7 17.1H9.2V15.6Z"
                    fill="#2F8EF5"
                  />
                </svg>
              </div>
            </button>
            <button
              onClick={() =>
                router.push(hasCalculatorData ? "/result/final" : "/recommend")
              }
              className="rounded-[28px] bg-[#D9F0FF] px-5 py-6 text-left"
            >
              <div className="flex items-center justify-between">
                <p className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
                  {hasCalculatorData ? "내 결과 보기" : "추천 아파트"}
                </p>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 3.5H15.5L19 7V20.5H6V3.5Z" fill="#77C3FF" />
                  <path d="M15.5 3.5V7H19" fill="#53B4FF" />
                  <rect x="8.2" y="10.1" width="8.6" height="1.8" rx="0.9" fill="#2F8EF5" />
                  <rect x="8.2" y="13.3" width="6.2" height="1.8" rx="0.9" fill="#2F8EF5" />
                </svg>
              </div>
            </button>
          </div>

          <button
            onClick={() => router.push("/recommend")}
            className="w-full rounded-[32px] bg-[#E3EEFF] px-6 py-7 text-left"
          >
            <p className="text-[#495057] text-[17px] font-medium leading-7">
              최근 실거래 추천
            </p>
            <div className="mt-2 h-[56px] overflow-hidden rounded-2xl bg-white/65 px-4 py-2">
              {currentTickerTrade ? (
                <div key={`${tickerKey}-${currentTickerTrade.aptName}`} className="trade-ticker-item">
                  <p className="text-[#212529] text-[18px] font-bold leading-6 tracking-[-0.18px]">
                    {currentTickerTrade.aptName}
                  </p>
                  <p className="text-[#495057] text-[14px] font-medium leading-5">
                    {formatToKoreanWon(currentTickerTrade.priceWon)} ·{" "}
                    {currentTickerTrade.tradeDate || "최근 거래"}
                  </p>
                </div>
              ) : (
                <div className="trade-ticker-item">
                  <p className="text-[#212529] text-[18px] font-bold leading-6 tracking-[-0.18px]">
                    추천 아파트
                  </p>
                  <p className="text-[#495057] text-[14px] font-medium leading-5">
                    지역을 입력하면 최신 실거래 아파트가 표시돼요
                  </p>
                </div>
              )}
            </div>
          </button>
        </div>

        <div className="w-full max-w-md px-5 mx-auto mt-8 pb-6 space-y-5">
          <button
            onClick={() => router.push(hasCalculatorData ? "/result/final" : "/calculator")}
            className="w-full bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EDF3FF] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 3.5H15.5L19 7V20.5H6V3.5Z" fill="#8CC8FF" />
                  <path d="M15.5 3.5V7H19" fill="#66B9FF" />
                  <rect x="8.2" y="10.2" width="8.8" height="2" rx="1" fill="#2F8EF5" />
                  <rect x="8.2" y="13.8" width="6.4" height="2" rx="1" fill="#2F8EF5" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[#212529] text-[20px] font-bold leading-7 tracking-[-0.2px]">
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
              <div className="w-11 h-11 rounded-full bg-[#EEF7FF] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="3" fill="#7EC5FF" />
                  <rect x="7" y="7" width="4" height="4" rx="1" fill="#2F8EF5" />
                  <rect x="13" y="7" width="4" height="4" rx="1" fill="#2F8EF5" />
                  <rect x="7" y="13" width="4" height="4" rx="1" fill="#2F8EF5" />
                  <rect x="13" y="13" width="4" height="4" rx="1" fill="#2F8EF5" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[#212529] text-[20px] font-bold leading-7 tracking-[-0.2px]">
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
              <div className="w-11 h-11 rounded-full bg-[#F2F4F8] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="4.5" y="4.5" width="15" height="15" rx="3.5" fill="#9AD0FF" />
                  <rect x="7.5" y="8" width="9" height="1.8" rx="0.9" fill="#2F8EF5" />
                  <rect x="7.5" y="11.8" width="9" height="1.8" rx="0.9" fill="#2F8EF5" />
                  <rect x="7.5" y="15.6" width="6.2" height="1.8" rx="0.9" fill="#2F8EF5" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[#212529] text-[20px] font-bold leading-7 tracking-[-0.2px]">
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
