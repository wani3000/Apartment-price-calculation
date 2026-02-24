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

export default function RecommendPage() {
  const router = useRouter();
  const [hasCalculatorData, setHasCalculatorData] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedApartment[]>(
    [],
  );
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null,
  );
  const [lastFetchedKey, setLastFetchedKey] = useState<string>("");

  const formatToKoreanWon = (won: number) => {
    const man = Math.round(won / 10000);
    if (man < 10000) return `${man.toLocaleString()}만 원`;
    const eok = Math.floor(man / 10000);
    const restMan = man % 10000;
    if (restMan === 0) return `${eok.toLocaleString()}억 원`;
    return `${eok.toLocaleString()}억 ${restMan.toLocaleString()}만 원`;
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
    const siGunGu = policyRegionDetails.siGunGu || "";
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
      setRecommendationError(
        "추천 아파트를 보려면 먼저 소득/자산 입력과 지역 선택을 완료해주세요.",
      );
      return;
    }

    const fetchKey = `${input.region.siDo}-${input.region.siGunGu}-${input.budgetWon}`;
    if (fetchKey === lastFetchedKey && recommendations.length > 0) return;

    setIsLoadingRecommendations(true);
    setRecommendationError(null);

    try {
      const list = await fetchRecommendedApartmentsFromMcp({
        budgetWon: input.budgetWon,
        siDo: input.region.siDo,
        siGunGu: input.region.siGunGu,
        limit: 10,
      });
      setRecommendations(list);
      setLastFetchedKey(fetchKey);
      if (list.length === 0) {
        setRecommendationError(
          "해당 조건의 최근 실거래 추천이 없습니다. 지역 또는 조건을 다시 확인해주세요.",
        );
      }
    } catch (error) {
      console.error(error);
      setRecommendations([]);
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
    const hasCalculatedData = Boolean(localStorage.getItem("calculatorData"));
    setHasCalculatorData(hasCalculatedData);
    if (hasCalculatedData) {
      void fetchRecommendations();
    }
  }, [fetchRecommendations]);

  return (
    <div className="h-[100dvh] bg-white flex flex-col items-center overflow-hidden">
      <Header showBack={false} showBorder={false} logoLink="/" />
      <div
        className="w-full flex-1 overflow-y-auto px-5"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "calc(88px + env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
            최근 매매 추천 아파트
          </h2>
          <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-6">
            입력한 소득·자산으로 계산한 최대 구매 금액과 가장 가까운 최근
            실거래 아파트를 보여줘요.
          </p>

          {!hasCalculatorData && (
            <div className="flex flex-col p-5 gap-3 rounded-xl bg-[#F8F9FA] mb-3">
              <h3 className="text-[#212529] text-[18px] font-bold leading-[26px] tracking-[-0.18px]">
                내가 살 수 있는 아파트 금액을 계산해보세요
              </h3>
              <p className="text-[#495057] text-sm font-normal leading-5 tracking-[-0.28px]">
                내 최대 구매 금액과 가장 가까운 최근 실거래 아파트를 확인할 수
                있어요
              </p>
              <button
                onClick={() => router.push("/nickname")}
                className="mt-2 h-14 w-full justify-center items-center flex bg-[#000000] text-white rounded-[300px] font-semibold text-base"
              >
                지금 계산해보기
              </button>
            </div>
          )}

          {hasCalculatorData && isLoadingRecommendations && (
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3">
              <p className="text-grey-80 text-sm font-medium leading-5 tracking-[-0.28px]">
                추천 목록을 불러오는 중이에요...
              </p>
            </div>
          )}
          {hasCalculatorData && !isLoadingRecommendations && recommendationError && (
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3">
              <p className="text-grey-80 text-sm font-medium leading-5 tracking-[-0.28px]">
                {recommendationError}
              </p>
            </div>
          )}
          {hasCalculatorData &&
            !isLoadingRecommendations &&
            !recommendationError &&
            recommendations.map((item, index) => (
              <div
                key={`${item.aptName}-${item.tradeDate}-${index}`}
                className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-3"
              >
                <p className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px]">
                  {index + 1}. {item.aptName}
                </p>
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                    거래금액
                  </p>
                  <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                    {formatToKoreanWon(item.priceWon)}
                  </p>
                </div>
                {item.tradeDate && (
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      거래일
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {item.tradeDate}
                    </p>
                  </div>
                )}
                {(item.dong || item.areaSqm || item.floor !== undefined) && (
                  <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                    {[
                      item.dong,
                      item.areaSqm ? `${item.areaSqm}㎡` : "",
                      item.floor !== undefined ? `${item.floor}층` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
