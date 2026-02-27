"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const SI_DO_OPTIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;

const REGION_OPTIONS: Record<string, string[]> = {
  서울: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  경기: ["과천시", "광명시", "의왕시", "하남시", "성남시", "수원시", "안양시", "용인시"],
  인천: [],
  부산: [],
  대구: [],
  광주: [],
  대전: [],
  울산: [],
  세종: [],
  강원: [],
  충북: [],
  충남: [],
  전북: [],
  전남: [],
  경북: [],
  경남: [],
  제주: [],
};

const getSiGunGuOptions = (siDo: string) => {
  const allOption = `${siDo} 전체`;
  const options = REGION_OPTIONS[siDo] || [];
  return [allOption, ...options];
};

const RECOMMEND_HISTORY_STORAGE_KEY = "recommendApartmentsHistoryV1";
const MAX_RECOMMEND_HISTORY = 30;
const RECOMMEND_FETCH_LIMIT = 200;
const RECOMMEND_DISPLAY_LIMIT = 5;

const PYEONG_FILTERS = [
  "전체",
  "10평대",
  "20평대",
  "30평대",
  "40평대",
  "50평대",
  "60평대",
  "70평~",
  "80평~",
] as const;

type RecommendationHistoryItem = {
  key: string;
  region: {
    siDo: string;
    siGunGu: string;
  };
  budgetWon: number;
  items: RecommendedApartment[];
  updatedAt: string;
};

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

const parseDateForSort = (value?: string) => {
  if (!value) return 0;
  const normalized = value.trim().replace(/\./g, "-");
  const match = normalized.match(/^(\d{2,4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return 0;
  let year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return 0;
  if (year < 100) year += 2000;
  return Number(`${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`);
};

export default function RecommendPage() {
  const router = useRouter();
  const initializedRef = useRef(false);
  const [username, setUsername] = useState("");
  const [hasCalculatorData, setHasCalculatorData] = useState(false);
  const [filterSiDo, setFilterSiDo] = useState("서울");
  const [filterSiGunGu, setFilterSiGunGu] = useState("서울 전체");
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
  const [baseBudgetWon, setBaseBudgetWon] = useState(0);
  const [pyeongFilter, setPyeongFilter] = useState<(typeof PYEONG_FILTERS)[number]>("전체");
  const [activeFilterModal, setActiveFilterModal] = useState<
    "siDo" | "siGunGu" | "pyeong" | null
  >(null);

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
    try {
      localStorage.setItem(
        "selectedRecommendationApartment",
        JSON.stringify(enriched),
      );
    } catch (error) {
      console.warn("failed to persist selected apartment", error);
    }

    const params = new URLSearchParams({
      aptName: enriched.aptName,
      siDo: enriched.siDo || "서울",
      siGunGu: enriched.siGunGu || "강남구",
      dong: enriched.dong || "",
      floor:
        typeof enriched.floor === "number" ? String(enriched.floor) : "",
      areaSqm:
        typeof enriched.areaSqm === "number" ? String(enriched.areaSqm) : "",
      priceWon: String(enriched.priceWon || 0),
      tradeDate: enriched.tradeDate || "",
    });
    router.push(`/recommend/detail?${params.toString()}`);
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

  const getPyeongValue = (areaSqm?: number) => {
    if (!areaSqm || areaSqm <= 0) return null;
    return areaSqm / 3.3058;
  };

  const readRecommendationHistory = useCallback((): RecommendationHistoryItem[] => {
    try {
      const raw = localStorage.getItem(RECOMMEND_HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as RecommendationHistoryItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const writeRecommendationHistory = useCallback((entry: RecommendationHistoryItem) => {
    const list = readRecommendationHistory();
    const deduped = [entry, ...list.filter((item) => item.key !== entry.key)];
    const next = deduped.slice(0, MAX_RECOMMEND_HISTORY);
    localStorage.setItem(RECOMMEND_HISTORY_STORAGE_KEY, JSON.stringify(next));
  }, [readRecommendationHistory]);

  const getRecommendationInput = useCallback(() => {
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
    const defaultSiDo = policyRegionDetails.siDo || "서울";
    const rawSiGunGu = policyRegionDetails.siGunGu || "";
    const defaultSiGunGu =
      typeof rawSiGunGu === "string" && rawSiGunGu.trim()
        ? rawSiGunGu
        : `${defaultSiDo} 전체`;
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
        defaultSiDo && defaultSiGunGu
          ? determinePolicyFlags(defaultSiDo, defaultSiGunGu, gu || undefined)
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

    const normalizedFilterSiGunGu = filterSiGunGu?.trim() || `${filterSiDo} 전체`;

    if (!filterSiDo || !normalizedFilterSiGunGu || budgetWon <= 0) return null;

    return {
      budgetWon,
      region: {
        siDo: filterSiDo,
        siGunGu: normalizedFilterSiGunGu,
      },
      defaultRegion: {
        siDo: defaultSiDo,
        siGunGu: defaultSiGunGu,
      },
    };
  }, [filterSiDo, filterSiGunGu]);

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
      const isWholeRegion = input.region.siGunGu.includes("전체");
      let list: RecommendedApartment[] = [];

      if (isWholeRegion) {
        const guTargets = (REGION_OPTIONS[input.region.siDo] || []).filter(Boolean);
        const queryTargets =
          guTargets.length > 0
            ? guTargets
            : [FALLBACK_SIGUNGU_BY_SIDO[input.region.siDo] || "강남구"];
        const perGuLimit = Math.max(
          8,
          Math.ceil(RECOMMEND_FETCH_LIMIT / queryTargets.length),
        );

        const responses = await Promise.allSettled(
          queryTargets.map((siGunGu) =>
            fetchRecommendedApartmentsFromMcp({
              budgetWon: input.budgetWon,
              siDo: input.region.siDo,
              siGunGu,
              limit: perGuLimit,
            }),
          ),
        );

        const merged = responses.flatMap((response) =>
          response.status === "fulfilled" ? response.value : [],
        );

        if (merged.length === 0) {
          const firstRejected = responses.find(
            (response): response is PromiseRejectedResult => response.status === "rejected",
          );
          if (firstRejected) throw firstRejected.reason;
        }

        const deduped = new Map<string, RecommendedApartment>();
        for (const item of merged) {
          const key = [
            item.aptName,
            item.siDo,
            item.siGunGu,
            item.dong,
            item.floor ?? "",
            item.areaSqm ?? "",
            item.tradeDate ?? "",
            item.priceWon,
          ].join("|");
          if (!deduped.has(key)) deduped.set(key, item);
        }

        list = Array.from(deduped.values())
          .sort((a, b) => {
            const diffA = Math.abs(input.budgetWon - (a.priceWon || 0));
            const diffB = Math.abs(input.budgetWon - (b.priceWon || 0));
            if (diffA !== diffB) return diffA - diffB;
            const dateA = parseDateForSort(a.tradeDate);
            const dateB = parseDateForSort(b.tradeDate);
            if (dateA !== dateB) return dateB - dateA;
            return (b.priceWon || 0) - (a.priceWon || 0);
          })
          .slice(0, RECOMMEND_FETCH_LIMIT);
      } else {
        list = await fetchRecommendedApartmentsFromMcp({
          budgetWon: input.budgetWon,
          siDo: input.region.siDo,
          siGunGu: input.region.siGunGu,
          limit: RECOMMEND_FETCH_LIMIT,
        });
      }
      setRecommendations(list);
      if (list.length > 0) {
        localStorage.setItem(
          "recommendedApartmentsCache",
          JSON.stringify({
            key: fetchKey,
            items: list,
          }),
        );
        writeRecommendationHistory({
          key: fetchKey,
          region: {
            siDo: input.region.siDo,
            siGunGu: input.region.siGunGu,
          },
          budgetWon: input.budgetWon,
          items: list,
          updatedAt: new Date().toISOString(),
        });
      }
      setLastFetchedKey(fetchKey);
      if (list.length === 0) {
        setHasNoAffordableResult(true);
      }
    } catch (error) {
      console.error(error);
      const cachedRecommendations = localStorage.getItem(
        "recommendedApartmentsCache",
      );
      if (cachedRecommendations) {
        try {
          const parsed = JSON.parse(cachedRecommendations) as
            | RecommendedApartment[]
            | { key?: string; items?: RecommendedApartment[] };
          const cachedItems = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed?.items)
              ? parsed.items
              : [];
          const cachedKey = Array.isArray(parsed) ? "" : String(parsed?.key || "");

          if (cachedItems.length > 0 && cachedKey === fetchKey) {
            setRecommendations(cachedItems);
            setHasNoAffordableResult(false);
            setRecommendationError(null);
            return;
          }
        } catch {
          // ignore cache parse error
        }
      }
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
  }, [
    getRecommendationInput,
    lastFetchedKey,
    recommendations.length,
    writeRecommendationHistory,
  ]);

  useEffect(() => {
    const options = getSiGunGuOptions(filterSiDo);
    if (!options.includes(filterSiGunGu)) {
      setFilterSiGunGu(options[0]);
    }
  }, [filterSiDo, filterSiGunGu]);

  useEffect(() => {
    if (!hasCalculatorData || !username.trim()) return;
    void fetchRecommendations();
  }, [filterSiDo, filterSiGunGu, hasCalculatorData, username, fetchRecommendations]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
    const hasCalculatedData = Boolean(localStorage.getItem("calculatorData"));
    setHasCalculatorData(hasCalculatedData);

    const input = getRecommendationInput();
    if (input) {
      setFilterSiDo(input.defaultRegion.siDo);
      setFilterSiGunGu(input.defaultRegion.siGunGu || `${input.defaultRegion.siDo} 전체`);
      setBaseBudgetWon(input.budgetWon);

      const fetchKey = `${input.defaultRegion.siDo}-${input.defaultRegion.siGunGu}-${input.budgetWon}`;
      const history = readRecommendationHistory();
      const matched = history.find((item) => item.key === fetchKey);
      if (matched && matched.items.length > 0) {
        setRecommendations(matched.items);
        setLastFetchedKey(fetchKey);
      }
    }

    if (hasCalculatedData) {
      void fetchRecommendations();
    }
  }, [fetchRecommendations, getRecommendationInput, readRecommendationHistory]);

  const shouldShowInitialPrompt = !hasCalculatorData || !username.trim();
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((item) => {
      const pyeong = getPyeongValue(item.areaSqm);

      const pyeongPass = (() => {
        if (pyeongFilter === "전체") return true;
        if (!pyeong) return false;
        if (pyeongFilter === "70평~") return pyeong >= 70 && pyeong < 80;
        if (pyeongFilter === "80평~") return pyeong >= 80;
        const decade = Number(pyeongFilter.replace(/[^\d]/g, ""));
        return pyeong >= decade && pyeong < decade + 10;
      })();

      return pyeongPass;
    });
  }, [pyeongFilter, recommendations]);

  const visibleRecommendations = filteredRecommendations.slice(0, RECOMMEND_DISPLAY_LIMIT);
  const filterModalTitleMap = {
    siDo: "시/도",
    siGunGu: "시/군/구",
    pyeong: "평형",
  } as const;

  const activeOptions =
    activeFilterModal === "siDo"
      ? [...SI_DO_OPTIONS]
      : activeFilterModal === "siGunGu"
        ? getSiGunGuOptions(filterSiDo)
      : activeFilterModal === "pyeong"
        ? [...PYEONG_FILTERS]
        : [];

  const handleFilterSelect = (value: string) => {
    if (activeFilterModal === "siDo") {
      setFilterSiDo(value);
      setFilterSiGunGu(`${value} 전체`);
    } else if (activeFilterModal === "siGunGu") {
      setFilterSiGunGu(value);
    } else if (activeFilterModal === "pyeong") {
      setPyeongFilter(value as (typeof PYEONG_FILTERS)[number]);
    }
    setActiveFilterModal(null);
  };

  const resetFilters = () => {
    setFilterSiDo("서울");
    setFilterSiGunGu("서울 전체");
    setPyeongFilter("전체");
  };

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
            className="w-full max-w-md mx-auto flex items-start justify-center pt-[80px]"
            style={{
              minHeight: "calc(100dvh - (max(16px, env(safe-area-inset-top)) + 60px))",
            }}
          >
            <div className="w-full flex flex-col items-center text-center gap-3">
              <h3 className="text-[#212529] text-[18px] font-bold leading-6 tracking-[-0.18px]">
                내가 살 수 있는 아파트 금액을
                <br />
                계산해보세요
              </h3>
              <p className="text-[#495057] text-[14px] font-normal leading-5 tracking-[-0.28px]">
                내 최대 구매 금액과 가장 가까운
                <br />
                최근 실거래 아파트를 확인할 수 있어요
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
              내 구매금액으로 살 수 있는 아파트
            </h2>
            <p className="text-[#868E96] text-base font-normal leading-6 mb-6">
              입력한 소득·자산으로 계산한 최대 구매 금액과 가장 가까운 최근
              실거래 아파트를 보여줘요.
            </p>

            <div className="mb-4 rounded-2xl bg-[#D9F0FF] px-5 py-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[#212529] text-[15px] font-normal leading-6 tracking-[-0.15px]">
                  내 구매 금액
                </p>
                <div className="shrink-0 flex items-center gap-2">
                  <p className="text-[#212529] text-[15px] font-bold leading-6 tracking-[-0.15px]">
                    {baseBudgetWon > 0 ? formatToKoreanWon(baseBudgetWon).replace("만 원", "만원") : "-"}
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/calculator")}
                    className="text-[#1D4ED8] text-[14px] font-bold leading-5"
                  >
                    수정
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <button
                  type="button"
                  onClick={() => setActiveFilterModal("siDo")}
                  className="shrink-0 h-11 px-4 rounded-[22px] border border-[#DEE2E6] bg-white text-[#212529] text-[15px] font-medium"
                >
                  {filterSiDo}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterModal("siGunGu")}
                  className="shrink-0 h-11 px-4 rounded-[22px] border border-[#DEE2E6] bg-white text-[#212529] text-[15px] font-medium"
                >
                  {filterSiGunGu}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterModal("pyeong")}
                  className="shrink-0 h-11 px-4 rounded-[22px] border border-[#DEE2E6] bg-white text-[#212529] text-[15px] font-medium"
                >
                  {pyeongFilter === "전체" ? "평형 전체" : pyeongFilter}
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="shrink-0 text-[#868E96] text-[12px] font-medium leading-4"
                >
                  초기화
                </button>
              </div>
            </div>

            {isLoadingRecommendations && (
              <div
                className="w-full flex flex-col items-center justify-start text-center gap-3 pt-[120px]"
                style={{
                  minHeight:
                    "calc(100dvh - (max(16px, env(safe-area-inset-top)) + 60px) - var(--tab-page-content-bottom-safe) - 80px)",
                }}
              >
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
            {!isLoadingRecommendations && recommendationError && (
              <div className="flex flex-col p-4 gap-2 rounded-2xl bg-[#F8F9FA] mb-3">
                <p className="text-grey-80 text-sm font-medium leading-5 tracking-[-0.28px]">
                  {recommendationError}
                </p>
                <button
                  type="button"
                  onClick={() => void fetchRecommendations()}
                  className="self-start mt-1 px-3 py-1.5 rounded-full bg-black text-white text-[12px] font-semibold"
                >
                  다시 시도
                </button>
              </div>
            )}
            {!isLoadingRecommendations &&
              !recommendationError &&
              (hasNoAffordableResult || (!hasNoAffordableResult && filteredRecommendations.length === 0)) && (
              <div
                className="w-full flex items-center justify-center text-center"
                style={{
                  minHeight:
                    "calc(100dvh - (max(16px, env(safe-area-inset-top)) + 60px) - var(--tab-page-content-bottom-safe) - 80px)",
                }}
              >
                <p className="text-[#868E96] text-[12px] font-medium leading-4 tracking-[-0.12px]">
                  {hasNoAffordableResult
                    ? "현재 살 수 있는 아파트가 없어요."
                    : "필터 조건에 맞는 아파트가 없어요."}
                </p>
              </div>
            )}
            {!isLoadingRecommendations &&
              !recommendationError &&
              !hasNoAffordableResult &&
              visibleRecommendations.length > 0 &&
              visibleRecommendations.map((item, index) => {
                return (
                  <button
                    key={`${item.aptName}-${item.tradeDate}-${index}`}
                    type="button"
                    onClick={() => openRecommendationDetail(item)}
                    className="w-full text-left flex flex-col p-4 gap-2 rounded-2xl bg-[#F8F9FA] mb-3"
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
                );
              })}
          </div>
        )}
      </div>

      {activeFilterModal && (
        <div
          className="fixed inset-0 z-[90] bg-black/45 flex items-end"
          onClick={() => setActiveFilterModal(null)}
        >
          <div
            className="w-full max-w-[430px] mx-auto bg-white rounded-t-[24px] max-h-[70dvh] overflow-hidden"
            style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-10 bg-[#DEE2E6] rounded-full mx-auto mt-3 mb-4" />
            <div className="px-5 pb-2 flex items-center justify-between">
              <h3 className="text-[#212529] text-[20px] font-bold leading-7">
                {filterModalTitleMap[activeFilterModal]}
              </h3>
              <button
                type="button"
                onClick={() => setActiveFilterModal(null)}
                className="text-[#868E96] text-[15px] font-medium"
              >
                닫기
              </button>
            </div>
            <div
              className="modal-scroll-area px-5 pb-4 overflow-y-auto space-y-2"
              style={{
                maxHeight: "calc(70dvh - 96px)",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              {activeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleFilterSelect(option)}
                  className="w-full h-12 px-4 rounded-2xl border border-[#DEE2E6] text-left text-[#212529] text-[16px] font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
