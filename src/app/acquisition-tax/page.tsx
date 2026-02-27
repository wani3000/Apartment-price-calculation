"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  calculateAcquisitionTax,
  type AcquisitionAreaType,
  type AcquisitionAssetType,
  type AcquisitionHouseCount,
  type AcquisitionTaxInput,
  type AcquisitionTransactionType,
} from "@/utils/acquisitionTaxCalculator";

const TRANSACTION_OPTIONS: Array<{ key: AcquisitionTransactionType; label: string }> = [
  { key: "purchase", label: "매매" },
  { key: "gift", label: "증여" },
  { key: "inheritance", label: "상속" },
  { key: "original", label: "원시" },
];

const ASSET_OPTIONS: Array<{ key: AcquisitionAssetType; label: string }> = [
  { key: "house", label: "주택" },
  { key: "officetel", label: "오피스텔" },
  { key: "farmland", label: "농지" },
  { key: "other", label: "그 외" },
];

const AREA_OPTIONS: Array<{ key: AcquisitionAreaType; label: string }> = [
  { key: "under40", label: "40㎡ (12.1평) 이하" },
  { key: "under60", label: "60㎡ (18.2평) 이하" },
  { key: "under85", label: "85㎡ (25.7평) 이하" },
  { key: "over85", label: "85㎡ (25.7평) 초과" },
];

const HOUSE_COUNT_OPTIONS: Array<{ key: AcquisitionHouseCount; label: string }> = [
  { key: 1, label: "1주택" },
  { key: 2, label: "2주택" },
  { key: 3, label: "3주택" },
  { key: 4, label: "그 이상" },
];

const onlyNumber = (value: string) => value.replace(/[^\d]/g, "");

const formatWonToKorean = (won: number) => {
  if (!Number.isFinite(won) || won <= 0) return "";
  const man = Math.round(won / 10000);
  if (man < 10000) return `${man.toLocaleString()}만 원`;
  const eok = Math.floor(man / 10000);
  const restMan = man % 10000;
  if (restMan === 0) return `${eok.toLocaleString()}억 원`;
  return `${eok.toLocaleString()}억 ${restMan.toLocaleString()}만 원`;
};

export default function AcquisitionTaxPage() {
  const router = useRouter();
  const [transactionType, setTransactionType] =
    useState<AcquisitionTransactionType>("purchase");
  const [assetType, setAssetType] = useState<AcquisitionAssetType>("house");
  const [areaType, setAreaType] = useState<AcquisitionAreaType>("over85");
  const [houseCount, setHouseCount] = useState<AcquisitionHouseCount>(1);
  const [activeFilterModal, setActiveFilterModal] = useState<
    "asset" | "area" | "houseCount" | null
  >(null);
  const [showTypeInfoModal, setShowTypeInfoModal] = useState(false);
  const [typeInfoTab, setTypeInfoTab] = useState<"transaction" | "relief">("transaction");
  const [showAcquisitionInfoModal, setShowAcquisitionInfoModal] = useState(false);
  const [showOfficialInfoModal, setShowOfficialInfoModal] = useState(false);

  const [isCorporate, setIsCorporate] = useState(false);
  const [isRentalFirstSale, setIsRentalFirstSale] = useState(false);
  const [isRegulatedArea, setIsRegulatedArea] = useState(false);
  const [isCapitalArea, setIsCapitalArea] = useState(false);
  const [isExcludeHeavyTax, setIsExcludeHeavyTax] = useState(false);
  const [isFirstHomeBuyer, setIsFirstHomeBuyer] = useState(false);

  const [acquisitionAmountMan, setAcquisitionAmountMan] = useState("");
  const [officialPriceAmountMan, setOfficialPriceAmountMan] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const acquisitionWon = Math.round(Number(acquisitionAmountMan || 0) * 10000);
  const officialWon = Math.round(Number(officialPriceAmountMan || 0) * 10000);

  const inputValid = Number(acquisitionAmountMan) > 0;

  const filterModalTitleMap = {
    asset: "자산 유형",
    area: "면적",
    houseCount: "주택 수",
  } as const;

  const activeOptions =
    activeFilterModal === "asset"
      ? ASSET_OPTIONS.map((o) => o.label)
      : activeFilterModal === "area"
        ? AREA_OPTIONS.map((o) => o.label)
        : activeFilterModal === "houseCount"
          ? HOUSE_COUNT_OPTIONS.map((o) => o.label)
          : [];

  const handleFilterSelect = (value: string) => {
    if (activeFilterModal === "asset") {
      const target = ASSET_OPTIONS.find((o) => o.label === value);
      if (target) setAssetType(target.key);
    } else if (activeFilterModal === "area") {
      const target = AREA_OPTIONS.find((o) => o.label === value);
      if (target) setAreaType(target.key);
    } else if (activeFilterModal === "houseCount") {
      const target = HOUSE_COUNT_OPTIONS.find((o) => o.label === value);
      if (target) setHouseCount(target.key);
    }
    setActiveFilterModal(null);
  };

  const resetFilters = () => {
    setAssetType(ASSET_OPTIONS[0].key);
    setAreaType(AREA_OPTIONS[0].key);
    setHouseCount(HOUSE_COUNT_OPTIONS[0].key);
  };

  const previewInput: AcquisitionTaxInput = useMemo(
    () => ({
      transactionType,
      assetType,
      areaType,
      houseCount,
      isCorporate,
      isRentalFirstSale,
      isRegulatedArea,
      isCapitalArea,
      isExcludeHeavyTax,
      isFirstHomeBuyer,
      acquisitionAmountMan: Number(acquisitionAmountMan || 0),
      officialPriceAmountMan: Number(officialPriceAmountMan || 0),
    }),
    [
      acquisitionAmountMan,
      areaType,
      assetType,
      houseCount,
      isCapitalArea,
      isCorporate,
      isExcludeHeavyTax,
      isFirstHomeBuyer,
      isRegulatedArea,
      isRentalFirstSale,
      officialPriceAmountMan,
      transactionType,
    ],
  );

  const handleCalculate = () => {
    const result = calculateAcquisitionTax(previewInput);
    localStorage.setItem("acquisitionTaxInput", JSON.stringify(previewInput));
    localStorage.setItem("acquisitionTaxResult", JSON.stringify(result));
    router.push("/acquisition-tax/result");
  };

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      <Header backUrl="/" />
      <div
        className="flex-1 px-5 overflow-y-auto"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "var(--page-content-bottom-safe)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px]">
            취등록세 계산기
          </h1>
          <button
            type="button"
            onClick={() => setShowTypeInfoModal(true)}
            className="w-6 h-6 rounded-full border border-[#CED4DA] text-[#868E96] flex items-center justify-center"
            aria-label="거래유형 설명 보기"
          >
            ?
          </button>
        </div>
        <p className="text-[#868E96] text-base font-normal leading-6 mb-6">
          거래 조건과 금액을 입력하면 취득세, 지방교육세, 농어촌특별세를 계산해요.
        </p>

        <div className="flex border-b border-grey-40 mb-4 overflow-x-auto no-scrollbar">
          {TRANSACTION_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setTransactionType(option.key)}
              className={`flex-1 min-w-[92px] py-[10px] px-4 text-center text-[15px] whitespace-nowrap ${
                transactionType === option.key
                  ? "border-b-2 border-[#000000] text-[#000000] font-bold"
                  : "text-grey-80 font-medium"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setActiveFilterModal("asset")}
              className="shrink-0 h-11 px-4 rounded-[22px] border border-[#DEE2E6] bg-white text-[#212529] text-[15px] font-medium"
            >
              {ASSET_OPTIONS.find((o) => o.key === assetType)?.label || ASSET_OPTIONS[0].label}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilterModal("area")}
              className="shrink-0 h-11 px-4 rounded-[22px] border border-[#DEE2E6] bg-white text-[#212529] text-[15px] font-medium"
            >
              {AREA_OPTIONS.find((o) => o.key === areaType)?.label || AREA_OPTIONS[0].label}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilterModal("houseCount")}
              className="shrink-0 h-11 px-4 rounded-[22px] border border-[#DEE2E6] bg-white text-[#212529] text-[15px] font-medium"
            >
              {HOUSE_COUNT_OPTIONS.find((o) => o.key === houseCount)?.label || HOUSE_COUNT_OPTIONS[0].label}
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

        <div className="grid grid-cols-2 gap-3 mb-6">
          <label className="flex items-center gap-2 text-[#343A40] text-[15px] font-medium">
            <input
              type="checkbox"
              checked={isCorporate}
              onChange={(e) => setIsCorporate(e.target.checked)}
              className="w-5 h-5 rounded border-[#CED4DA]"
            />
            법인
          </label>
          <label className="flex items-center gap-2 text-[#343A40] text-[15px] font-medium">
            <input
              type="checkbox"
              checked={isRentalFirstSale}
              onChange={(e) => setIsRentalFirstSale(e.target.checked)}
              className="w-5 h-5 rounded border-[#CED4DA]"
            />
            임대사업자 최초분양
          </label>
          <label className="flex items-center gap-2 text-[#343A40] text-[15px] font-medium">
            <input
              type="checkbox"
              checked={isRegulatedArea}
              onChange={(e) => setIsRegulatedArea(e.target.checked)}
              className="w-5 h-5 rounded border-[#CED4DA]"
            />
            조정대상지역
          </label>
          <label className="flex items-center gap-2 text-[#343A40] text-[15px] font-medium">
            <input
              type="checkbox"
              checked={isCapitalArea}
              onChange={(e) => setIsCapitalArea(e.target.checked)}
              className="w-5 h-5 rounded border-[#CED4DA]"
            />
            수도권
          </label>
          <label className="flex items-center gap-2 text-[#343A40] text-[15px] font-medium">
            <input
              type="checkbox"
              checked={isExcludeHeavyTax}
              onChange={(e) => setIsExcludeHeavyTax(e.target.checked)}
              className="w-5 h-5 rounded border-[#CED4DA]"
            />
            중과 배제
          </label>
          <label className="flex items-center gap-2 text-[#343A40] text-[15px] font-medium">
            <input
              type="checkbox"
              checked={isFirstHomeBuyer}
              onChange={(e) => setIsFirstHomeBuyer(e.target.checked)}
              className="w-5 h-5 rounded border-[#CED4DA]"
            />
            생애최초 구입
          </label>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px]">
                취득가액
              </label>
              <button
                type="button"
                onClick={() => setShowAcquisitionInfoModal(true)}
                className="w-5 h-5 rounded-full border border-[#CED4DA] text-[#868E96] flex items-center justify-center text-[12px]"
                aria-label="취득가액 설명 보기"
              >
                ?
              </button>
            </div>
            <div
              className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                focusedField === "acquisition"
                  ? "border-2 border-primary"
                  : "border border-grey-40"
              }`}
            >
              <input
                type="text"
                inputMode="numeric"
                value={acquisitionAmountMan}
                onChange={(e) => setAcquisitionAmountMan(onlyNumber(e.target.value))}
                onFocus={() => setFocusedField("acquisition")}
                onBlur={() => setFocusedField(null)}
                placeholder="금액 입력"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium whitespace-nowrap">만 원</span>
            </div>
            {acquisitionWon > 0 && (
              <p className="mt-2 text-[#212529] text-[14px] font-semibold leading-5 tracking-[-0.14px]">
                {formatWonToKorean(acquisitionWon)}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px]">
                시가표준액
              </label>
              <button
                type="button"
                onClick={() => setShowOfficialInfoModal(true)}
                className="w-5 h-5 rounded-full border border-[#CED4DA] text-[#868E96] flex items-center justify-center text-[12px]"
                aria-label="시가표준액 설명 보기"
              >
                ?
              </button>
            </div>
            <div
              className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                focusedField === "official"
                  ? "border-2 border-primary"
                  : "border border-grey-40"
              }`}
            >
              <input
                type="text"
                inputMode="numeric"
                value={officialPriceAmountMan}
                onChange={(e) => setOfficialPriceAmountMan(onlyNumber(e.target.value))}
                onFocus={() => setFocusedField("official")}
                onBlur={() => setFocusedField(null)}
                placeholder="금액 입력"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium whitespace-nowrap">만 원</span>
            </div>
            {officialWon > 0 && (
              <p className="mt-2 text-[#212529] text-[14px] font-semibold leading-5 tracking-[-0.14px]">
                {formatWonToKorean(officialWon)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bottom-cta-container">
        <div className="bottom-cta-surface">
          <button
            type="button"
            disabled={!inputValid}
            onClick={handleCalculate}
            className={`flex h-14 w-full justify-center items-center rounded-[300px] font-semibold text-base transition ${
              inputValid
                ? "bg-[#000000] text-white hover:bg-[#111111]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            취등록세 계산
          </button>
        </div>
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

      {showTypeInfoModal && (
        <div
          className="fixed inset-0 z-[90] bg-black/45 flex items-end"
          onClick={() => {
            setShowTypeInfoModal(false);
            setTypeInfoTab("transaction");
          }}
        >
          <div
            className="w-full max-w-[430px] mx-auto bg-white rounded-t-[24px] p-5 pb-[calc(20px+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-10 bg-[#DEE2E6] rounded-full mx-auto mb-4" />
            <h3 className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px] mb-3">
              거래유형 설명
            </h3>
            <div className="flex border-b border-[#DEE2E6] mb-3">
              <button
                type="button"
                onClick={() => setTypeInfoTab("transaction")}
                className={`flex-1 py-2 text-center text-[15px] ${
                  typeInfoTab === "transaction"
                    ? "border-b-2 border-[#000000] text-[#212529] font-bold"
                    : "text-[#868E96] font-medium"
                }`}
              >
                거래유형
              </button>
              <button
                type="button"
                onClick={() => setTypeInfoTab("relief")}
                className={`flex-1 py-2 text-center text-[15px] ${
                  typeInfoTab === "relief"
                    ? "border-b-2 border-[#000000] text-[#212529] font-bold"
                    : "text-[#868E96] font-medium"
                }`}
              >
                면제 및 감면 안내
              </button>
            </div>

            {typeInfoTab === "transaction" ? (
              <div className="space-y-3">
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">매매</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    일반적인 유상 거래로 부동산을 취득하는 경우에요.
                  </p>
                </div>
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">증여</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    대가 없이 재산을 이전받는 무상 취득에 해당해요.
                  </p>
                </div>
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">상속</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    피상속인의 사망으로 재산을 승계받아 취득하는 경우에요.
                  </p>
                </div>
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">원시</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    신축 등 기존 권리 승계 없이 새로 발생한 권리로 취득하는 경우에요.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">법인</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    법인 명의 취득은 개인과 다른 중과세율이 적용될 수 있어요.
                  </p>
                </div>
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">임대사업자 최초분양</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    임대사업자 요건을 충족한 최초 분양 주택은 일부 감면 규정이 적용될 수 있어요.
                  </p>
                </div>
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">조정대상지역</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    조정대상지역은 다주택자 취득세 중과 판단에 직접 영향을 줘요.
                  </p>
                </div>
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">수도권</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    수도권 여부는 일부 세율과 감면 조건 적용 여부 판단에 사용돼요.
                  </p>
                </div>
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">중과 배제</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    법정 요건 충족 시 중과세 대신 일반세율로 계산될 수 있어요.
                  </p>
                </div>
                <div>
                  <p className="text-[#212529] text-[15px] font-bold leading-6">생애최초 구입</p>
                  <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
                    생애최초 주택 구입은 조건 충족 시 취득세 감면 또는 공제가 적용될 수 있어요.
                  </p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setShowTypeInfoModal(false);
                setTypeInfoTab("transaction");
              }}
              className="mt-5 flex h-14 w-full justify-center items-center rounded-[300px] bg-[#000000] text-white font-semibold text-base"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {showAcquisitionInfoModal && (
        <div
          className="fixed inset-0 z-[90] bg-black/45 flex items-end"
          onClick={() => setShowAcquisitionInfoModal(false)}
        >
          <div
            className="w-full max-w-[430px] mx-auto bg-white rounded-t-[24px] p-5 pb-[calc(20px+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-10 bg-[#DEE2E6] rounded-full mx-auto mb-4" />
            <h3 className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px] mb-2">
              취득가액 안내
            </h3>
            <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
              취득가액은 매매계약서·증여계약서 등에 기재된 실제 취득 금액이에요.
              일반적으로 취득세 계산의 기본 입력값으로 사용돼요.
            </p>
            <button
              type="button"
              onClick={() => setShowAcquisitionInfoModal(false)}
              className="mt-5 flex h-14 w-full justify-center items-center rounded-[300px] bg-[#000000] text-white font-semibold text-base"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {showOfficialInfoModal && (
        <div
          className="fixed inset-0 z-[90] bg-black/45 flex items-end"
          onClick={() => setShowOfficialInfoModal(false)}
        >
          <div
            className="w-full max-w-[430px] mx-auto bg-white rounded-t-[24px] p-5 pb-[calc(20px+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-10 bg-[#DEE2E6] rounded-full mx-auto mb-4" />
            <h3 className="text-[#212529] text-[18px] font-bold leading-7 tracking-[-0.18px] mb-2">
              시가표준액 안내
            </h3>
            <p className="text-[#868E96] text-[14px] font-normal leading-5 tracking-[-0.14px]">
              시가표준액은 지자체가 고시한 과세 기준 금액이에요. 취득가액과
              비교해 과세표준을 판단할 때 참고되며, 계산 시에는 더 큰 값을
              기준으로 적용할 수 있어요.
            </p>
            <button
              type="button"
              onClick={() => setShowOfficialInfoModal(false)}
              className="mt-5 flex h-14 w-full justify-center items-center rounded-[300px] bg-[#000000] text-white font-semibold text-base"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
