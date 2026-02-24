"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  calculateMaxPurchaseForLivingWithStressDSR,
  calculateMaxPurchaseWithNewRegulation627,
  calculateMaxPurchaseWithPolicy20251015ByCapacity,
  convertManToWon,
  determinePolicyFlags,
  mapRegionSelectionToPolicyFlags,
} from "@/utils/calculator";
import {
  fetchRecommendedApartmentsFromMcp,
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

export default function RecommendPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [hasCalculatorData, setHasCalculatorData] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedApartment[]>(
    [],
  );
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null,
  );
  const [hasNoAffordableResult, setHasNoAffordableResult] = useState(false);
  const [lastFetchedKey, setLastFetchedKey] = useState<string>("");

  const openRecommendationDetail = (item: RecommendedApartment) => {
    const policyRegionDetailsStr = localStorage.getItem("policyRegionDetails");
    const policyRegion = policyRegionDetailsStr
      ? JSON.parse(policyRegionDetailsStr)
      : {};
    const enriched: RecommendedApartment = {
      ...item,
      siDo: item.siDo || policyRegion?.siDo || "서울",
      siGunGu: item.siGunGu || policyRegion?.siGunGu || "강남구",
    };
    localStorage.setItem("selectedRecommendationApartment", JSON.stringify(enriched));
    router.push("/recommend/detail");
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
    const pyeong = areaSqm / 3.3058;
    return `${pyeong.toFixed(1)}평`;
  };

  const formatDateOrDash = (value?: string) => {
    if (!value || !value.trim()) return "-";
    return value;
  };

  const getRecommendationInput = () => {
    const calculatorDataStr = localStorage.getItem("calculatorData");
    if (!calculatorDataStr) return null;

    const calculatorData = JSON.parse(calculatorDataStr);
    const selectedRegionRaw = localStorage.getItem("selectedRegion");
    const policyRegionDetailsStr = localStorage.getItem("policyRegionDetails");
    const policyRegionDetails = policyRegionDetailsStr
      ? JSON.parse(policyRegionDetailsStr)
      : {};

    const regulationOption = localStorage.getItem("regulationOption") || "latest";
    const income = convertManToWon(Number(calculatorData.income || 0));
    const assets = convertManToWon(Number(calculatorData.assets || 0));
    const spouseIncome = convertManToWon(Number(calculatorData.spouseIncome || 0));
    const totalIncome = income + spouseIncome;
    const siDo = policyRegionDetails.siDo || "서울";
    const rawSiGunGu = policyRegionDetails.siGunGu || "";
    const siGunGu =
      typeof rawSiGunGu === "string" &&
      rawSiGunGu.trim() &&
      !rawSiGunGu.includes("전체")
        ? rawSiGunGu
        : FALLBACK_SIGUNGU_BY_SIDO[siDo] || "강남구";
    const gu = policyRegionDetails.gu || "";
    const selectedRegion =
      selectedRegionRaw === "non-regulated" ? "non-regulated" : "regulated";

    let budgetWon = 0;
    if (regulationOption === "new") {
      const liveResult = calculateMaxPurchaseWithNewRegulation627(
        totalIncome,
        assets,
        selectedRegion !== "non-regulated",
      );
      budgetWon = Math.round(liveResult.maxPropertyPrice);
    } else if (regulationOption === "latest") {
      const policyFlags =
        siDo && siGunGu
          ? determinePolicyFlags(siDo, siGunGu, gu || undefined)
          : mapRegionSelectionToPolicyFlags(selectedRegion);

      const liveResult = calculateMaxPurchaseWithPolicy20251015ByCapacity(
        totalIncome,
        assets,
        policyFlags,
        40,
        {
          homeOwnerCount: Number(calculatorData.homeOwnerCount || 0),
          isTenant: Boolean(calculatorData.isTenant),
          hasJeonseLoan: Boolean(calculatorData.hasJeonseLoan),
          jeonseLoanPrincipal: Number(calculatorData.jeonseLoanPrincipal || 0),
          jeonseLoanRate: Number(calculatorData.jeonseLoanRate || 0),
        },
        3.5,
        30,
      );
      budgetWon = Math.round(liveResult.maxPropertyPrice);
    } else {
      const loanOptionsStr = localStorage.getItem("loanOptions");
      const loanOptions = loanOptionsStr
        ? JSON.parse(loanOptionsStr)
        : { dsr: 40 };
      const liveResult = calculateMaxPurchaseForLivingWithStressDSR(
        totalIncome,
        assets,
        Number(loanOptions.dsr || 40),
        true,
        3.5,
        30,
        70,
      );
      budgetWon = Math.round(liveResult.maxPropertyPrice);
    }

    if (!siDo || !siGunGu || budgetWon <= 0) return null;

    return {
      budgetWon,
      region: {
        siDo,
        siGunGu,
      },
    };
  };

  const fetchRecommendations = useCallback(async () => {
    const input = getRecommendationInput();
    if (!input) {
      setRecommendations([]);
      setHasNoAffordableResult(false);
      setRecommendationError(
        "추천 아파트를 보려면 먼저 소득/자산 입력과 지역 선택을 완료해주세요.",
      );
      return;
    }

    const fetchKey = `${input.region.siDo}-${input.region.siGunGu}-${input.budgetWon}`;
    if (fetchKey === lastFetchedKey && recommendations.length > 0) return;

    setIsLoadingRecommendations(true);
    setRecommendationError(null);
    setHasNoAffordableResult(false);

    try {
      const list = await fetchRecommendedApartmentsFromMcp({
        budgetWon: input.budgetWon,
        siDo: input.region.siDo,
        siGunGu: input.region.siGunGu,
        limit: 10,
      });
      setRecommendations(list);
      if (list.length > 0) {
        localStorage.setItem("recommendedApartmentsCache", JSON.stringify(list));
      }
      setLastFetchedKey(fetchKey);
      if (list.length === 0) {
        setHasNoAffordableResult(true);
      }
    } catch (error) {
      console.error(error);
      setRecommendations([]);
      setHasNoAffordableResult(false);
      setRecommendationError(
        error instanceof Error
          ? error.message
          : "추천 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [lastFetchedKey, recommendations.length]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
    const hasCalculatedData = Boolean(localStorage.getItem("calculatorData"));
    setHasCalculatorData(hasCalculatedData);
    if (hasCalculatedData) {
      void fetchRecommendations();
    }
  }, [fetchRecommendations]);

  const shouldShowInitialPrompt = !hasCalculatorData || !username.trim();

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col items-center overflow-x-hidden">
      <Header showBack={false} showBorder={false} logoLink="/" />
      <div
        className="w-full flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-5"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "var(--tab-page-content-bottom-safe)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {shouldShowInitialPrompt ? (
          <div
            className="w-full max-w-md mx-auto flex items-center justify-center"
            style={{
              minHeight:
                "calc(100dvh - (max(16px, env(safe-area-inset-top)) + 60px) - var(--tab-page-content-bottom-safe))",
            }}
          >
            <div className="w-full flex flex-col items-center text-center gap-3">
              <h3 className="text-[#212529] text-[16px] font-bold leading-6 tracking-[-0.16px]">
                내가 살 수 있는 아파트 금액을
                <br />
                계산해보세요
              </h3>
              <p className="text-[#495057] text-[14px] font-normal leading-5 tracking-[-0.28px]">
                내 최대 구매 금액과 가장 가까운 최근 실거래 아파트를 확인할 수
                있어요
              </p>
              <button
                onClick={() => router.push("/nickname")}
                className="mt-1 h-11 px-5 justify-center items-center inline-flex bg-[#000000] text-white rounded-[300px] font-semibold text-[14px] leading-5"
              >
                지금 계산해보기
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
              최근 매매 추천 아파트
            </h2>
            <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-6">
              입력한 소득·자산으로 계산한 최대 구매 금액과 가장 가까운 최근
              실거래 아파트를 보여줘요.
            </p>

            {isLoadingRecommendations && (
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3">
                <p className="text-grey-80 text-sm font-medium leading-5 tracking-[-0.28px]">
                  추천 목록을 불러오는 중이에요...
                </p>
              </div>
            )}
            {!isLoadingRecommendations && recommendationError && (
              <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3">
                <p className="text-grey-80 text-sm font-medium leading-5 tracking-[-0.28px]">
                  정보를 불러오고 있어요. 잠시만 기다려주세요!
                </p>
              </div>
            )}
            {!isLoadingRecommendations && !recommendationError && hasNoAffordableResult && (
              <div
                className="w-full flex items-center justify-center text-center"
                style={{
                  minHeight:
                    "calc(100dvh - (max(16px, env(safe-area-inset-top)) + 60px) - var(--tab-page-content-bottom-safe) - 80px)",
                }}
              >
                <p className="text-[#868E96] text-[12px] font-medium leading-4 tracking-[-0.12px]">
                  현재 살 수 있는 아파트가 없어요.
                </p>
              </div>
            )}
            {!isLoadingRecommendations &&
              !recommendationError &&
              !hasNoAffordableResult &&
              recommendations.map((item, index) => (
                <button
                  key={`${item.aptName}-${item.tradeDate}-${index}`}
                  type="button"
                  onClick={() => openRecommendationDetail(item)}
                  className="w-full text-left flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3"
                >
                  <div className="w-full flex justify-between items-start gap-2">
                    <p className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px]">
                      {item.aptName}
                    </p>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-1 shrink-0"
                    >
                      <path
                        d="M6 3L10.5 8L6 13"
                        stroke="#868E96"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-[#495057] text-[18px] font-medium leading-7 tracking-[-0.18px]">
                    {[
                      item.dong || "-",
                      formatPyeong(item.areaSqm),
                      item.floor !== undefined ? `${item.floor}층` : "-",
                    ].join(" · ")}
                  </p>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      거래금액
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatToKoreanWon(item.priceWon)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      거래일
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatDateOrDash(item.tradeDate)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      평형
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatPyeong(item.areaSqm)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      계약일
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatDateOrDash(item.contractDate || item.tradeDate)}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
