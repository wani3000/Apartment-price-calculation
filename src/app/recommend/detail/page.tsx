"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import {
  fetchApartmentTradeHistoryFromMcp,
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

const formatToKoreanWon = (won: number) => {
  const man = Math.round(won / 10000);
  if (man < 10000) return `${man.toLocaleString()}만 원`;
  const eok = Math.floor(man / 10000);
  const restMan = man % 10000;
  if (restMan === 0) return `${eok.toLocaleString()}억 원`;
  return `${eok.toLocaleString()}억 ${restMan.toLocaleString()}만 원`;
};

const formatPyeong = (areaSqm?: number) => {
  if (!areaSqm || areaSqm <= 0) return "-";
  return `${(areaSqm / 3.3058).toFixed(1)}평`;
};

const formatDateOrDash = (value?: string) => {
  if (!value || !value.trim()) return "-";
  const normalized = value.trim().replace(/\./g, "-");
  const match = normalized.match(/^(\d{2,4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return value;
  let year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return value;
  }
  if (year < 100) year += 2000;
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
};

const formatCompactDate = (value?: string) => {
  return formatDateOrDash(value);
};

const formatAreaCell = (item: RecommendedApartment) => {
  const rawExclu = item.rawFields?.exclu_use_ar;
  if (typeof rawExclu === "string" && rawExclu.trim()) {
    return `${rawExclu.trim()}㎡`;
  }
  if (typeof rawExclu === "number" && Number.isFinite(rawExclu)) {
    return `${rawExclu}㎡`;
  }
  if (item.areaSqm && item.areaSqm > 0) {
    return `${item.areaSqm}㎡`;
  }
  return "-";
};

export default function RecommendDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apartment, setApartment] = useState<RecommendedApartment | null>(null);
  const [tradeRows, setTradeRows] = useState<RecommendedApartment[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedRecommendationApartment");
    if (stored) {
      try {
        setApartment(JSON.parse(stored) as RecommendedApartment);
        return;
      } catch {
        // fallthrough to query fallback
      }
    }

    const aptName = (searchParams.get("aptName") || "").trim();
    if (!aptName) return;
    const fromQuery: RecommendedApartment = {
      aptName,
      siDo: searchParams.get("siDo") || "서울",
      siGunGu: searchParams.get("siGunGu") || "강남구",
      dong: searchParams.get("dong") || undefined,
      floor:
        searchParams.get("floor") && Number.isFinite(Number(searchParams.get("floor")))
          ? Number(searchParams.get("floor"))
          : undefined,
      areaSqm:
        searchParams.get("areaSqm") &&
        Number.isFinite(Number(searchParams.get("areaSqm")))
          ? Number(searchParams.get("areaSqm"))
          : undefined,
      priceWon:
        searchParams.get("priceWon") &&
        Number.isFinite(Number(searchParams.get("priceWon")))
          ? Number(searchParams.get("priceWon"))
          : 0,
      tradeDate: searchParams.get("tradeDate") || undefined,
      contractDate: searchParams.get("tradeDate") || undefined,
      gapWon: 0,
    };
    setApartment(fromQuery);
  }, [searchParams]);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      if (!apartment?.aptName) return;

      const policyRegionDetailsStr = localStorage.getItem("policyRegionDetails");
      const policyRegion = policyRegionDetailsStr
        ? JSON.parse(policyRegionDetailsStr)
        : {};
      const siDo = apartment.siDo || policyRegion?.siDo || "서울";
      const rawSiGunGu = apartment.siGunGu || policyRegion?.siGunGu || "";
      const siGunGu =
        typeof rawSiGunGu === "string" &&
        rawSiGunGu.trim() &&
        !rawSiGunGu.includes("전체")
          ? rawSiGunGu
          : FALLBACK_SIGUNGU_BY_SIDO[siDo] || "강남구";

      setIsLoadingHistory(true);
      setHistoryError(null);
      try {
        const history = await fetchApartmentTradeHistoryFromMcp({
          aptName: apartment.aptName,
          siDo,
          siGunGu,
          dong: apartment.dong,
          floor: apartment.floor,
          areaSqm: apartment.areaSqm,
        });
        const trades = Array.isArray(history.trades) ? history.trades : [];
        setTradeRows(trades.slice(0, 5));
      } catch (error) {
        setHistoryError(
          error instanceof Error ? error.message : "거래 이력 조회에 실패했습니다.",
        );
      } finally {
        setIsLoadingHistory(false);
      }
    };

    void fetchTradeHistory();
  }, [apartment]);

  return (
    <div className="h-[100dvh] bg-white flex flex-col items-center overflow-hidden">
      <Header backUrl="/recommend" showBorder={false} />
      <div
        className="w-full flex-1 overflow-y-auto px-5"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "var(--tab-page-content-bottom-safe)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="w-full max-w-md mx-auto">
          {!apartment && (
            <div className="flex flex-col p-5 gap-3 rounded-2xl bg-[#F8F9FA] mt-2">
              <h2 className="text-[#212529] text-[20px] font-bold leading-7 tracking-[-0.2px]">
                선택된 아파트 정보가 없어요
              </h2>
              <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                추천 아파트 목록에서 항목을 선택해 상세 정보를 확인해주세요.
              </p>
              <button
                type="button"
                onClick={() => router.push("/recommend")}
                className="mt-2 h-14 w-full justify-center items-center flex bg-[#000000] text-white rounded-[300px] font-semibold text-base"
              >
                추천 목록으로 이동
              </button>
            </div>
          )}

          {apartment && (
            <>
              <h2 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
                매매 추천 아파트 상세
              </h2>
              <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
                최근 실거래 내역을 최대 5건까지 보여줘요.
              </p>

              <div className="flex flex-col p-4 gap-2 rounded-2xl bg-[#F8F9FA] mb-4">
                <p className="text-[#212529] text-[20px] font-bold leading-7 tracking-[-0.2px]">
                  {apartment.aptName}
                </p>
                <p className="text-[#495057] text-[18px] font-medium leading-7 tracking-[-0.18px]">
                  {[
                    apartment.dong || "-",
                    formatPyeong(apartment.areaSqm),
                    apartment.floor !== undefined ? `${apartment.floor}층` : "-",
                  ].join(" · ")}
                </p>
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    거래금액
                  </p>
                  <p className="text-[#212529] text-[15px] font-semibold leading-[22px]">
                    {formatToKoreanWon(apartment.priceWon)}
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    거래일
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatDateOrDash(apartment.tradeDate)}
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    평형
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatPyeong(apartment.areaSqm)}
                  </p>
                </div>
              </div>

              {isLoadingHistory && (
                <div className="flex flex-col items-center justify-center text-center gap-3 mb-3 py-8">
                  <svg
                    className="animate-spin"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="loading"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#DEE2E6"
                      strokeWidth="3"
                    />
                    <path
                      d="M21 12A9 9 0 0 0 12 3"
                      stroke="#212529"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-[#495057] text-[13px] font-medium leading-[18px] tracking-[-0.13px]">
                    최근 실거래가를 불러올게요!
                  </p>
                </div>
              )}
              {!isLoadingHistory && historyError && (
                <div className="flex flex-col p-4 gap-2 rounded-2xl bg-[#F8F9FA] mb-3">
                  <p className="text-[#495057] text-[15px] font-medium leading-[22px]">
                    {historyError}
                  </p>
                </div>
              )}
              {!isLoadingHistory && !historyError && (
                <div className="overflow-hidden mb-3">
                  <div className="py-3 border-b border-[#E9ECEF]">
                    <h3 className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
                      최근 거래
                    </h3>
                  </div>
                  <div className="py-3 grid grid-cols-[minmax(0,160px)_minmax(0,1fr)_minmax(0,96px)] items-center gap-x-4 border-b border-[#E9ECEF]">
                    <p className="text-[#495057] text-[13px] font-medium whitespace-nowrap">계약일</p>
                    <p className="text-[#495057] text-[13px] font-medium whitespace-nowrap">면적(공급)</p>
                    <p className="text-[#495057] text-[13px] font-medium text-right justify-self-end w-full max-w-[96px]">가격</p>
                  </div>
                  {tradeRows.length > 0 ? (
                    tradeRows.map((trade, index) => (
                      <div
                        key={`${trade.tradeDate}-${trade.priceWon}-${trade.floor ?? "na"}-${index}`}
                        className="py-4 grid grid-cols-[minmax(0,160px)_minmax(0,1fr)_minmax(0,96px)] items-center gap-x-4 border-b border-[#E9ECEF] last:border-b-0"
                      >
                        <p className="text-[#343A40] text-[14px] font-medium leading-5 whitespace-nowrap">
                          {formatCompactDate(trade.contractDate || trade.tradeDate)}
                        </p>
                        <p className="text-[#343A40] text-[14px] font-medium leading-5 whitespace-nowrap">
                          {formatAreaCell(trade)}
                        </p>
                        <div className="text-right justify-self-end w-full max-w-[96px] overflow-hidden">
                          <p className="text-[#212529] text-[14px] font-bold leading-5 tracking-[-0.14px] whitespace-nowrap">
                            {formatToKoreanWon(trade.priceWon).replace("만 원", "")}
                          </p>
                          <p className="text-[#343A40] text-[14px] font-medium leading-5 whitespace-nowrap">
                            {trade.floor !== undefined ? `${trade.floor}층` : "-"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6">
                      <p className="text-[#495057] text-[15px] font-normal leading-[22px]">
                        최근 거래 내역이 없어요.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
