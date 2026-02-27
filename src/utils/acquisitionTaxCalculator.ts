export type AcquisitionTransactionType = "purchase" | "gift" | "inheritance" | "original";
export type AcquisitionAssetType = "house" | "officetel" | "farmland" | "other";
export type AcquisitionAreaType = "under40" | "under60" | "under85" | "over85";
export type AcquisitionHouseCount = 1 | 2 | 3 | 4;

export type AcquisitionTaxInput = {
  transactionType: AcquisitionTransactionType;
  assetType: AcquisitionAssetType;
  areaType: AcquisitionAreaType;
  houseCount: AcquisitionHouseCount;
  isCorporate: boolean;
  isRentalFirstSale: boolean;
  isRegulatedArea: boolean;
  isCapitalArea: boolean;
  isExcludeHeavyTax: boolean;
  isFirstHomeBuyer: boolean;
  acquisitionAmountMan: number;
  officialPriceAmountMan: number;
};

export type AcquisitionTaxResult = {
  input: AcquisitionTaxInput;
  taxBaseWon: number;
  acquisitionRate: number;
  localEducationRate: number;
  ruralSpecialRate: number;
  acquisitionTaxWon: number;
  localEducationTaxWon: number;
  ruralSpecialTaxWon: number;
  firstHomeBuyerDeductionWon: number;
  totalTaxWon: number;
  notes: string[];
};

const clampNonNegative = (value: number) =>
  Number.isFinite(value) && value > 0 ? value : 0;

const toWon = (man: number) => Math.round(clampNonNegative(man) * 10000);
const roundWon = (won: number) => Math.round(won);

const getHouseGeneralRate = (taxBaseWon: number) => {
  if (taxBaseWon <= 600_000_000) return 0.01;
  if (taxBaseWon <= 900_000_000) {
    const eok = taxBaseWon / 100_000_000;
    const percent = (eok * (2 / 3)) - 3;
    return Math.max(0.01, Math.min(0.03, percent / 100));
  }
  return 0.03;
};

const getHouseRates = (
  input: AcquisitionTaxInput,
  taxBaseWon: number,
): { acquisitionRate: number; localEducationRate: number; ruralSpecialRate: number; notes: string[] } => {
  const notes: string[] = [];
  const over85 = input.areaType === "over85";
  const regulatedHeavy = input.isRegulatedArea && !input.isExcludeHeavyTax;

  let acquisitionRate = getHouseGeneralRate(taxBaseWon);

  if (input.transactionType === "gift") acquisitionRate = 0.035;
  if (input.transactionType === "inheritance" || input.transactionType === "original") {
    acquisitionRate = 0.028;
  }

  if (input.transactionType === "purchase") {
    if (input.isCorporate) {
      acquisitionRate = 0.12;
      notes.push("법인 취득으로 주택 중과세율(12%)을 적용했어요.");
    } else if (input.houseCount >= 4) {
      acquisitionRate = 0.12;
    } else if (input.houseCount === 3) {
      acquisitionRate = regulatedHeavy ? 0.12 : 0.08;
    } else if (input.houseCount === 2) {
      acquisitionRate = regulatedHeavy ? 0.08 : getHouseGeneralRate(taxBaseWon);
    }
  }

  let localEducationRate = 0;
  if (input.houseCount === 1 || (input.houseCount === 2 && !regulatedHeavy)) {
    if (taxBaseWon <= 600_000_000) localEducationRate = 0.001;
    else if (taxBaseWon <= 900_000_000) localEducationRate = acquisitionRate / 10;
    else localEducationRate = 0.003;
  } else if (input.houseCount === 2 && regulatedHeavy) {
    localEducationRate = 0.004;
  } else {
    localEducationRate = 0.004;
  }

  let ruralSpecialRate = 0;
  if (over85) {
    if (input.houseCount === 1) ruralSpecialRate = 0.002;
    else if (input.houseCount === 2) ruralSpecialRate = regulatedHeavy ? 0.006 : 0.002;
    else if (input.houseCount === 3) ruralSpecialRate = regulatedHeavy ? 0.01 : 0.006;
    else ruralSpecialRate = regulatedHeavy ? 0.01 : 0.006;
  }

  if (input.isExcludeHeavyTax && input.isRegulatedArea) {
    notes.push("중과 배제 선택으로 조정대상지역 중과세는 제외했어요.");
  }

  return { acquisitionRate, localEducationRate, ruralSpecialRate, notes };
};

const getNonHouseRates = (
  input: AcquisitionTaxInput,
): { acquisitionRate: number; localEducationRate: number; ruralSpecialRate: number; notes: string[] } => {
  const notes: string[] = [];

  if (input.assetType === "farmland") {
    if (input.transactionType === "inheritance") {
      return { acquisitionRate: 0.023, localEducationRate: 0.0006, ruralSpecialRate: 0.002, notes };
    }
    if (input.transactionType === "gift") {
      return { acquisitionRate: 0.035, localEducationRate: 0.003, ruralSpecialRate: 0.002, notes };
    }
    if (input.transactionType === "original") {
      return { acquisitionRate: 0.028, localEducationRate: 0.0016, ruralSpecialRate: 0.002, notes };
    }
    if (input.isExcludeHeavyTax) {
      notes.push("중과 배제 선택으로 농지 매매 세율을 완화 적용했어요.");
      return { acquisitionRate: 0.015, localEducationRate: 0.001, ruralSpecialRate: 0, notes };
    }
    return { acquisitionRate: 0.03, localEducationRate: 0.002, ruralSpecialRate: 0.002, notes };
  }

  if (input.transactionType === "gift") {
    return { acquisitionRate: 0.035, localEducationRate: 0.003, ruralSpecialRate: 0.002, notes };
  }
  if (input.transactionType === "inheritance" || input.transactionType === "original") {
    return { acquisitionRate: 0.028, localEducationRate: 0.0016, ruralSpecialRate: 0.002, notes };
  }
  return { acquisitionRate: 0.04, localEducationRate: 0.004, ruralSpecialRate: 0.002, notes };
};

export const calculateAcquisitionTax = (
  raw: AcquisitionTaxInput,
): AcquisitionTaxResult => {
  const input: AcquisitionTaxInput = {
    ...raw,
    acquisitionAmountMan: clampNonNegative(raw.acquisitionAmountMan),
    officialPriceAmountMan: clampNonNegative(raw.officialPriceAmountMan),
  };

  const acquisitionWon = toWon(input.acquisitionAmountMan);
  const officialWon = toWon(input.officialPriceAmountMan);
  const taxBaseWon = Math.max(acquisitionWon, officialWon);

  const notes: string[] = [];
  const rateSet =
    input.assetType === "house"
      ? getHouseRates(input, taxBaseWon)
      : getNonHouseRates(input);
  notes.push(...rateSet.notes);

  let acquisitionTaxWon = roundWon(taxBaseWon * rateSet.acquisitionRate);
  const localEducationTaxWon = roundWon(taxBaseWon * rateSet.localEducationRate);
  const ruralSpecialTaxWon = roundWon(taxBaseWon * rateSet.ruralSpecialRate);

  let firstHomeBuyerDeductionWon = 0;
  if (
    input.assetType === "house" &&
    input.transactionType === "purchase" &&
    input.houseCount === 1 &&
    input.isFirstHomeBuyer &&
    taxBaseWon <= 1_200_000_000
  ) {
    firstHomeBuyerDeductionWon = Math.min(2_000_000, acquisitionTaxWon);
    acquisitionTaxWon -= firstHomeBuyerDeductionWon;
    notes.push("생애최초 구입 선택으로 취득세 감면(최대 200만원)을 반영했어요.");
  }

  if (input.isRentalFirstSale) {
    notes.push("임대사업자 최초분양은 참고 항목으로만 수집하며 현재 계산에는 직접 반영하지 않았어요.");
  }
  if (input.isCapitalArea) {
    notes.push("수도권 여부는 참고 항목으로 표시되며, 조정대상지역 여부를 우선 반영해 계산했어요.");
  }

  const totalTaxWon =
    acquisitionTaxWon + localEducationTaxWon + ruralSpecialTaxWon;

  return {
    input,
    taxBaseWon,
    acquisitionRate: rateSet.acquisitionRate,
    localEducationRate: rateSet.localEducationRate,
    ruralSpecialRate: rateSet.ruralSpecialRate,
    acquisitionTaxWon,
    localEducationTaxWon,
    ruralSpecialTaxWon,
    firstHomeBuyerDeductionWon,
    totalTaxWon,
    notes,
  };
};
