"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

const FIELD_LABELS: Record<string, string> = {
  apt_name: "아파트명",
  apartment_name: "아파트명",
  dong: "법정동",
  floor: "층",
  exclu_use_ar: "전용면적(㎡)",
  area_sqm: "전용면적(㎡)",
  build_year: "건축년도",
  deal_amount: "거래금액(만원)",
  deal_year: "거래연도",
  deal_month: "거래월",
  deal_day: "거래일",
  jibun: "지번",
  road_name: "도로명",
  road_name_bonbun: "도로명 본번",
  road_name_bubun: "도로명 부번",
  registration_date: "전산반영일",
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
  return value;
};

export default function RecommendDetailPage() {
  const router = useRouter();
  const [apartment, setApartment] = useState<RecommendedApartment | null>(null);
  const [latestTrade, setLatestTrade] = useState<RecommendedApartment | null>(null);
  const [previousTrade, setPreviousTrade] = useState<RecommendedApartment | null>(
    null,
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedRecommendationApartment");
    if (!stored) return;
    try {
      setApartment(JSON.parse(stored) as RecommendedApartment);
    } catch {
      setApartment(null);
    }
  }, []);

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
        setLatestTrade(history.latestTrade || null);
        setPreviousTrade(history.previousTrade || null);
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

  const latestRawEntries = useMemo(() => {
    if (!latestTrade?.rawFields) return [];
    return Object.entries(latestTrade.rawFields);
  }, [latestTrade]);
  const previousRawEntries = useMemo(() => {
    if (!previousTrade?.rawFields) return [];
    return Object.entries(previousTrade.rawFields);
  }, [previousTrade]);

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
            <div className="flex flex-col p-5 gap-3 rounded-xl bg-[#F8F9FA] mt-2">
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
                최근거래와 직전거래 2건을 기준으로 상세 내용을 정리했어요.
              </p>

              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-4">
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
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3">
                  <p className="text-[#495057] text-[15px] font-medium leading-[22px]">
                    거래 이력을 불러오는 중이에요...
                  </p>
                </div>
              )}
              {!isLoadingHistory && historyError && (
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3">
                  <p className="text-[#495057] text-[15px] font-medium leading-[22px]">
                    {historyError}
                  </p>
                </div>
              )}
              {!isLoadingHistory && !historyError && (
                <>
                  <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3">
                    <h3 className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
                      최근거래
                    </h3>
                    {latestTrade ? (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                            거래금액
                          </p>
                          <p className="text-[#212529] text-[15px] font-semibold leading-[22px]">
                            {formatToKoreanWon(latestTrade.priceWon)}
                          </p>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                            거래일
                          </p>
                          <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                            {formatDateOrDash(latestTrade.tradeDate)}
                          </p>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                            동·평형·층
                          </p>
                          <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                            {[
                              latestTrade.dong || "-",
                              formatPyeong(latestTrade.areaSqm),
                              latestTrade.floor !== undefined
                                ? `${latestTrade.floor}층`
                                : "-",
                            ].join(" · ")}
                          </p>
                        </div>
                        <h4 className="text-[#212529] text-[15px] font-bold leading-[22px] mt-2">
                          최근거래 원본 정보
                        </h4>
                        {latestRawEntries.map(([key, value]) => (
                          <div
                            key={`latest-${key}`}
                            className="flex justify-between items-start gap-3 py-1 border-b border-[#E9ECEF] last:border-b-0"
                          >
                            <p className="text-[#495057] text-[14px] font-medium leading-5 tracking-[-0.28px] break-keep">
                              {FIELD_LABELS[key] || key}
                            </p>
                            <p className="text-[#212529] text-[14px] font-normal leading-5 tracking-[-0.28px] text-right break-all">
                              {String(value)}
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-[#495057] text-[15px] font-normal leading-[22px]">
                        최근거래 정보를 찾지 못했습니다.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3">
                    <h3 className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
                      직전거래
                    </h3>
                    {previousTrade ? (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                            거래금액
                          </p>
                          <p className="text-[#212529] text-[15px] font-semibold leading-[22px]">
                            {formatToKoreanWon(previousTrade.priceWon)}
                          </p>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                            거래일
                          </p>
                          <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                            {formatDateOrDash(previousTrade.tradeDate)}
                          </p>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                            동·평형·층
                          </p>
                          <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                            {[
                              previousTrade.dong || "-",
                              formatPyeong(previousTrade.areaSqm),
                              previousTrade.floor !== undefined
                                ? `${previousTrade.floor}층`
                                : "-",
                            ].join(" · ")}
                          </p>
                        </div>
                        <h4 className="text-[#212529] text-[15px] font-bold leading-[22px] mt-2">
                          직전거래 원본 정보
                        </h4>
                        {previousRawEntries.map(([key, value]) => (
                          <div
                            key={`previous-${key}`}
                            className="flex justify-between items-start gap-3 py-1 border-b border-[#E9ECEF] last:border-b-0"
                          >
                            <p className="text-[#495057] text-[14px] font-medium leading-5 tracking-[-0.28px] break-keep">
                              {FIELD_LABELS[key] || key}
                            </p>
                            <p className="text-[#212529] text-[14px] font-normal leading-5 tracking-[-0.28px] text-right break-all">
                              {String(value)}
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-[#495057] text-[15px] font-normal leading-[22px]">
                        직전거래 정보를 찾지 못했습니다.
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
