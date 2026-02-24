"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import {
  fetchLatestRegionApartmentsFromMcp,
  type RecommendedApartment,
} from "@/utils/mcpRecommendations";

const FALLBACK_SIGUNGU_BY_SIDO: Record<string, string> = {
  서울: "강남구",
  경기: "성남시",
  인천: "연수구",
  부산: "해운대구",
  대구: "수성구",
  광주: "서구",
  대전: "유성구",
  울산: "남구",
  세종: "세종시",
  강원: "춘천시",
  충북: "청주시",
  충남: "천안시",
  전북: "전주시",
  전남: "순천시",
  경북: "포항시",
  경남: "창원시",
  제주: "제주시",
};

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
      const rawSiDo =
        typeof region?.siDo === "string" && region.siDo.trim() ? region.siDo : "서울";
      const rawSiGunGu =
        typeof region?.siGunGu === "string" && region.siGunGu.trim()
          ? region.siGunGu
          : "";
      const normalizedSiGunGu =
        rawSiGunGu.includes("전체") || !rawSiGunGu
          ? FALLBACK_SIGUNGU_BY_SIDO[rawSiDo] || "강남구"
          : rawSiGunGu;
      const primaryRegion = {
        siDo: rawSiDo,
        siGunGu: normalizedSiGunGu,
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
          paddingBottom: "var(--tab-page-content-bottom-safe)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="w-full max-w-md px-5 mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-[30px] leading-[38px] tracking-[-0.3px] ${
                    username
                      ? "text-grey-100 font-bold"
                      : "text-[#ADB5BD] font-semibold"
                  }`}
                >
                  {username || "닉네임을 입력해주세요"}
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
            onClick={() => router.push(username.trim() ? "/calculator" : "/nickname")}
            className="w-full rounded-[32px] bg-[#DCE9FF] px-6 py-6 text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
                  내 소득으로 살 수 있는
                  <br />
                  아파트 계산하기
                </p>
              </div>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
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
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/calculator")}
              className="rounded-[28px] bg-[#EFF1F5] px-5 py-6 text-left"
            >
              <div className="flex items-center">
                <p className="text-[#212529] text-[15px] font-bold leading-6 tracking-[-0.15px]">
                  처음부터 계산하기
                </p>
              </div>
            </button>
            <button
              onClick={() =>
                router.push(hasCalculatorData ? "/result/final" : "/recommend")
              }
              className="rounded-[28px] bg-[#D9F0FF] px-5 py-6 text-left"
            >
              <div className="flex items-center">
                <p className="text-[#212529] text-[15px] font-bold leading-6 tracking-[-0.15px]">
                  {hasCalculatorData ? "내 결과 보기" : "추천 아파트"}
                </p>
              </div>
            </button>
          </div>

          {hasCalculatorData && (
            <button
              onClick={() => router.push("/recommend")}
              className="w-full rounded-[32px] bg-[#E3EEFF] px-6 py-7 text-left"
            >
              <p className="text-[#495057] text-[13px] font-bold leading-6 tracking-[-0.13px]">
                최근 실거래 추천
              </p>
              {currentTickerTrade ? (
                <div className="mt-2 h-[56px] overflow-hidden rounded-2xl bg-white/65 px-4 py-2">
                  <div
                    key={`${tickerKey}-${currentTickerTrade.aptName}`}
                    className="trade-ticker-item"
                  >
                    <p className="text-[#212529] text-[18px] font-bold leading-6 tracking-[-0.18px]">
                      {currentTickerTrade.aptName}
                    </p>
                    <p className="text-[#495057] text-[14px] font-medium leading-5">
                      {formatToKoreanWon(currentTickerTrade.priceWon)} ·{" "}
                      {currentTickerTrade.tradeDate || "최근 거래"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-[#495057] text-[14px] font-medium leading-5">
                  데이터를 불러오고 있어요.
                </p>
              )}
            </button>
          )}
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
                <p className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
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
                <p className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
                  추천 아파트
                </p>
                <p className="text-[#868E96] text-base font-normal leading-6">
                  최근 실거래 기준으로 추천을 확인해요
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
