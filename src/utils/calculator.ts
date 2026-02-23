/**
 * 계산기 유틸리티 함수
 */

/**
 * 원리금 균등상환 계산을 위한 월 상환액
 * @param principal 원금
 * @param rate 연이율 (%)
 * @param years 대출 기간 (년)
 * @returns 월 상환액
 */
export function calculateMonthlyPayment(principal: number, rate: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;

  // 월이자율 변환
  const monthlyRate = rate / 100 / 12;
  // 총 납입 횟수
  const payments = years * 12;

  // 무이자(0%) 예외 처리
  if (monthlyRate === 0) return principal / payments;

  // 월납입액 = 원금 × 월이자율 × (1 + 월이자율)^총개월수 ÷ (1 + 월이자율)^총개월수 − 1
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
}

/**
 * 만기일시상환 방식의 월 이자 계산 (원금은 만기에 일시상환)
 * @param principal 원금
 * @param rate 연이율 (%)
 * @returns 월 이자액
 */
export function calculateMonthlyInterestOnly(principal: number, rate: number): number {
  if (principal <= 0 || rate <= 0) return 0;

  // 월이자율 변환
  const monthlyRate = rate / 100 / 12;
  
  // 월 이자액 = 원금 × 월이자율
  return principal * monthlyRate;
}

/**
 * 주택담보대출 한도 계산 (월 상환액 기준으로 대출 한도 계산)
 * @param monthlyDSR 월 DSR 한도 (원)
 * @param rate 연이율 (%)
 * @param years 대출 기간 (년)
 * @returns 대출 한도 (원)
 */
export function calculateLoanLimit(monthlyDSR: number, rate: number, years: number): number {
  if (monthlyDSR <= 0 || years <= 0) return 0;

  // 월이자율 변환
  const monthlyRate = rate / 100 / 12;
  // 총 납입 횟수
  const payments = years * 12;

  // 무이자(0%) 예외 처리
  if (monthlyRate === 0) return monthlyDSR * payments;

  // 대출한도 = 월납입액 × (1 - (1 + 월이자율)^-총개월수) ÷ 월이자율
  return monthlyDSR * ((1 - Math.pow(1 + monthlyRate, -payments)) / monthlyRate);
}

/**
 * 보유자산/대출한도/LTV를 동시에 만족하는 최대 구매가능가 계산
 * @param assets 보유자산 (원)
 * @param maxLoan 대출 가능 최대 금액 (원)
 * @param ltvRatio LTV 비율 (0~1 또는 0~100)
 * @returns { maxPropertyPrice, usedLoan }
 */
export function calculateMaxAffordableByLtv(
  assets: number,
  maxLoan: number,
  ltvRatio: number = 70,
): { maxPropertyPrice: number; usedLoan: number } {
  const safeAssets = Math.max(0, assets);
  const safeLoan = Math.max(0, maxLoan);
  const normalizedLtv = ltvRatio > 1 ? ltvRatio / 100 : ltvRatio;

  // LTV가 0 이하이면 대출 없이 자산만으로 구매
  if (normalizedLtv <= 0) {
    return { maxPropertyPrice: safeAssets, usedLoan: 0 };
  }

  // LTV가 100% 이상인 비정상 입력은 대출 한도까지만 허용
  if (normalizedLtv >= 1) {
    return { maxPropertyPrice: safeAssets + safeLoan, usedLoan: safeLoan };
  }

  // 구매가 P는 아래 두 조건을 동시에 만족해야 함:
  // 1) P <= assets + maxLoan (대출 상한)
  // 2) P <= assets / (1 - LTV) (LTV 상한)
  const maxPriceByLoan = safeAssets + safeLoan;
  const maxPriceByLtv = safeAssets / (1 - normalizedLtv);
  const maxPropertyPrice = Math.min(maxPriceByLoan, maxPriceByLtv);
  const usedLoan = Math.max(0, maxPropertyPrice - safeAssets);

  return {
    maxPropertyPrice,
    usedLoan,
  };
}

/**
 * 실거주 시나리오에서 최대 구매 가능 금액 계산 (2025 기준)
 * @param annualIncome 연소득 (원)
 * @param assets 보유자산 (원)
 * @param dsrRatio DSR 비율 (%) - 40% 또는 50%
 * @param loanRate 대출 이자율 (%) - 기본값 3.5%
 * @param loanYears 대출 기간 (년) - 기본값 40
 * @param ltv LTV 비율 (%) - 기본값 70%
 * @returns { maxPropertyPrice, mortgageLimit, creditLoan }
 */
export function calculateMaxPurchaseForLiving(
  annualIncome: number,
  assets: number,
  dsrRatio: number,
  loanRate: number = 3.5,
  loanYears: number = 40,
  _ltv: number = 70
): { maxPropertyPrice: number, mortgageLimit: number, creditLoan: number } {
  // 월 DSR 한도 = (연소득 × DSR비율) ÷ 12
  const monthlyDSR = (annualIncome * dsrRatio / 100) / 12;
  
  // 주택담보대출 한도 계산 (원리금 균등 상환 기준)
  const dsrBasedLoanLimit = calculateLoanLimit(monthlyDSR, loanRate, loanYears);
  const affordable = calculateMaxAffordableByLtv(assets, dsrBasedLoanLimit, _ltv);
  const mortgageLimit = affordable.usedLoan;
  
  // 신용대출은 고려하지 않음
  const creditLoan = 0;
  
  // 최대 구매 가능 금액 = 보유자산 + 주택담보대출 한도
  // DSR이 높을수록 대출 한도가 높아지고, 최대 구매 가능 금액도 커짐
  const maxPropertyPrice = affordable.maxPropertyPrice;
  
  return {
    maxPropertyPrice,
    mortgageLimit,
    creditLoan
  };
}

/**
 * 실거주 시나리오에서 최대 구매 가능 금액 계산 - 스트레스 DSR 3단계 적용 (2025년 7월 이후)
 * @param annualIncome 연소득 (원)
 * @param assets 보유자산 (원)
 * @param dsrRatio DSR 비율 (%) - 40% 또는 50%
 * @param isCapitalArea 수도권 여부 (서울·경기·인천)
 * @param loanRate 기본 대출 이자율 (%) - 기본값 3.5%
 * @param loanYears 대출 기간 (년) - 기본값 40
 * @param ltv LTV 비율 (%) - 기본값 70%
 * @returns { maxPropertyPrice, mortgageLimit, creditLoan, stressRate, effectiveRate }
 */
export function calculateMaxPurchaseForLivingWithStressDSR(
  annualIncome: number,
  assets: number,
  dsrRatio: number,
  isCapitalArea: boolean = true,
  loanRate: number = 3.5,
  loanYears: number = 40,
  _ltv: number = 70
): { 
  maxPropertyPrice: number, 
  mortgageLimit: number, 
  creditLoan: number,
  stressRate: number,
  effectiveRate: number
} {
  // 스트레스 금리 결정 (2025년 7월 1일 기준)
  const stressRate = isCapitalArea ? 1.5 : 0.75; // 수도권 1.5%, 지방 0.75%
  
  // 스트레스 DSR 계산용 유효 금리
  const effectiveRate = loanRate + stressRate;
  
  // 월 DSR 한도 = (연소득 × DSR비율) ÷ 12
  const monthlyDSR = (annualIncome * dsrRatio / 100) / 12;
  
  // 주택담보대출 한도 계산 (스트레스 금리 적용, 원리금 균등 상환 기준)
  const dsrBasedLoanLimit = calculateLoanLimit(monthlyDSR, effectiveRate, loanYears);
  const affordable = calculateMaxAffordableByLtv(assets, dsrBasedLoanLimit, _ltv);
  const mortgageLimit = affordable.usedLoan;
  
  // 신용대출은 고려하지 않음
  const creditLoan = 0;
  
  // 최대 구매 가능 금액 = 보유자산 + 주택담보대출 한도
  const maxPropertyPrice = affordable.maxPropertyPrice;
  
  return {
    maxPropertyPrice,
    mortgageLimit,
    creditLoan,
    stressRate,
    effectiveRate
  };
}

/**
 * 갭투자 시나리오에서 최대 구매 가능 금액 계산 (2025 기준)
 * @param annualIncome 연소득 (원)
 * @param assets 보유자산 (원)
 * @param jeonseRatio 전세가율 (%) - 기본값 60%
 * @returns { maxPropertyPrice, creditLoan, jeonseDeposit }
 */
export function calculateMaxPurchaseForInvestment(
  annualIncome: number,
  assets: number,
  jeonseRatio: number = 53 // 기본값 53%로 변경
): { maxPropertyPrice: number, creditLoan: number, jeonseDeposit: number } {
  // 신용대출 = 연소득 × 1.2
  const creditLoan = annualIncome * 1.2;
  
  // 총 자본 = 보유자산 + 신용대출
  const totalCapital = assets + creditLoan;
  
  // 최대 구매가능 금액 = 총 자본 ÷ (1 - 전세가율)
  const maxPropertyPrice = totalCapital / (1 - jeonseRatio / 100);
  
  // 전세보증금 = 매매가 × 전세가율
  const jeonseDeposit = maxPropertyPrice * (jeonseRatio / 100);
  
  return {
    maxPropertyPrice,
    creditLoan,
    jeonseDeposit
  };
}

/**
 * 만 원 단위 입력값을 원 단위로 변환
 * @param value 만 원 단위 값
 * @returns 원 단위 값
 */
export function convertManToWon(value: number): number {
  return value * 10000;
}

/**
 * 6.27 규제 강화 방안 계산 함수
 * @param annualIncome 연소득 (원)
 * @param assets 보유자산 (원)
 * @param isCapitalArea 수도권 여부 (기본값: true)
 * @returns 최대 구매 가능 금액, 대출 한도, 월 상환액 등
 */
export function calculateMaxPurchaseWithNewRegulation627(
  annualIncome: number,
  assets: number,
  isCapitalArea: boolean = true
) {
  const maxLoanAmount = isCapitalArea ? 600000000 : null; // 수도권: 6억원 제한, 지방: 제한 없음
  const loanYears = 30; // 30년
  const baseRate = 3.5; // 기본 금리 3.5%
  const stressRate = isCapitalArea ? 1.5 : 0.75; // 수도권 1.5%, 지방 0.75%
  const effectiveRate = baseRate + stressRate; // 유효 금리 (수도권 5.0%, 지방 4.25%)
  const dsrRatio = 40; // 40% 고정
  
  // 월 DSR 한도 = (연소득 × DSR비율) ÷ 12
  const monthlyDSR = (annualIncome * dsrRatio / 100) / 12;
  
  // DSR 기준 주택담보대출 한도 계산 (30년, 유효 금리 기준)
  const dsrBasedLimit = calculateLoanLimit(monthlyDSR, effectiveRate, loanYears);
  
  // 대출 한도 결정
  let mortgageLimit;
  if (isCapitalArea) {
    // 수도권: 6억원 제한과 DSR 한도 중 작은 값
    mortgageLimit = Math.min(dsrBasedLimit, maxLoanAmount!);
  } else {
    // 지방: DSR 한도만 적용 (6억원 제한 없음)
    mortgageLimit = dsrBasedLimit;
  }
  
  // 보유자산/LTV(70%)를 반영한 실제 사용 대출 및 최대 구매가 계산
  const affordable = calculateMaxAffordableByLtv(assets, mortgageLimit, 70);
  const usedMortgageLimit = affordable.usedLoan;

  // 월 상환액 계산 (실제 사용 대출 금액 기준)
  const monthlyRepayment = calculateMonthlyPayment(usedMortgageLimit, effectiveRate, loanYears);
  
  // 신용대출은 고려하지 않음
  const creditLoan = 0;
  
  // 최대 구매 가능 금액 = 보유자산 + 주택담보대출 한도
  const maxPropertyPrice = affordable.maxPropertyPrice;
  
  return {
    maxPropertyPrice,
    mortgageLimit: usedMortgageLimit,
    creditLoan,
    stressRate,
    effectiveRate,
    monthlyRepayment
  };
}

/**
 * 2025.10.15 주택시장 안정화 대책 - 지역 정책 플래그 판정
 */
export interface PolicyFlags {
  isCapitalArea: boolean;
  isRegulatedArea: boolean;
  isTojiPermitArea: boolean;
  tojiPermitStart?: string;
  tojiPermitEnd?: string;
}

export type RegionSelection = "regulated" | "non-regulated";

/**
 * UI의 단순 지역 선택값을 정책 플래그로 변환
 * - regulated: 규제지역(보수적으로 수도권/규제/토지허가 플래그 적용)
 * - non-regulated: 비규제지역
 */
export function mapRegionSelectionToPolicyFlags(
  selectedRegion: RegionSelection,
): PolicyFlags {
  if (selectedRegion === "regulated") {
    return {
      isCapitalArea: true,
      isRegulatedArea: true,
      isTojiPermitArea: true,
      tojiPermitStart: "2025-10-20",
      tojiPermitEnd: "2026-12-31",
    };
  }

  return {
    isCapitalArea: false,
    isRegulatedArea: false,
    isTojiPermitArea: false,
  };
}

/**
 * 지역명을 기반으로 정책 플래그 결정 (2025.10.15 기준)
 * @param siDo 시도 (예: "서울", "경기")
 * @param siGunGu 시군구 (예: "강남구", "성남시", "수원시")
 * @param gu 구 (예: "분당구", "영통구") - 선택사항
 * @returns PolicyFlags 객체
 */
export function determinePolicyFlags(siDo: string, siGunGu: string, gu?: string): PolicyFlags {
  const flags: PolicyFlags = {
    isCapitalArea: false,
    isRegulatedArea: false,
    isTojiPermitArea: false,
  };

  // 수도권 판정 (서울, 경기, 인천)
  if (['서울', '경기', '인천'].includes(siDo)) {
    flags.isCapitalArea = true;
  }

  // 2025.10.15 규제지역 및 토지거래허가구역 판정
  if (siDo === '서울') {
    // 서울 전체 25개구
    flags.isRegulatedArea = true;
    flags.isTojiPermitArea = true;
  } else if (siDo === '경기') {
    // 경기 12개 지역
    const regulatedAreas = [
      '과천시', '광명시', '의왕시', '하남시'
    ];

    const regulatedCities = [
      { city: '성남시', districts: ['분당구', '수정구', '중원구'] },
      { city: '수원시', districts: ['영통구', '장안구', '팔달구'] },
      { city: '안양시', districts: ['동안구'] },
      { city: '용인시', districts: ['수지구'] }
    ];

    // 단일 시 체크
    if (regulatedAreas.includes(siGunGu)) {
      flags.isRegulatedArea = true;
      flags.isTojiPermitArea = true;
    }

    // 구가 있는 시 체크
    // gu 입력이 없으면 시 단위 선택만으로 규제지역으로 간주
    const cityMatch = regulatedCities.find(item => siGunGu.includes(item.city));
    if (cityMatch && (!gu || cityMatch.districts.includes(gu))) {
      flags.isRegulatedArea = true;
      flags.isTojiPermitArea = true;
    }
  }

  // 토지거래허가구역 기간 설정
  if (flags.isTojiPermitArea) {
    flags.tojiPermitStart = '2025-10-20';
    flags.tojiPermitEnd = '2026-12-31';
  }

  return flags;
}

/**
 * 주택가격 구간별 주담대 최대한도 캡 계산 (2025.10.15 기준)
 * @param priceAsking 호가 (원)
 * @returns 주담대 최대한도 (원)
 */
export function calculateMortgageCapByPrice(priceAsking: number): number {
  if (priceAsking <= 1_500_000_000) return 600_000_000; // 15억 이하 → 6억
  if (priceAsking <= 2_500_000_000) return 400_000_000; // 15억~25억 → 4억
  return 200_000_000; // 25억 초과 → 2억
}

/**
 * 전세대출 월 이자 계산
 * @param principal 전세대출 원금 (원)
 * @param rate 연이율 (%)
 * @returns 월 이자액 (원)
 */
export function calculateJeonseLoanInterestMonthly(principal: number, rate: number): number {
  return (principal * rate / 100) / 12;
}

/**
 * 2025.10.15 주택시장 안정화 대책이 반영된 실거주 최대 구매가능 금액 계산
 * @param annualIncome 연소득 (원)
 * @param assets 보유자산 (원)
 * @param priceAsking 호가 (원)
 * @param policyFlags 정책 플래그
 * @param dsrRatio DSR 비율 (%) - 40% 또는 50%
 * @param userFlags 사용자 플래그 (주택 보유수, 전세대출 정보 등)
 * @param loanRate 기본 대출 이자율 (%) - 기본값 3.5%
 * @param loanYears 대출 기간 (년) - 기본값 40
 * @returns 계산 결과 및 적용된 정책 정보
 */
export function calculateMaxPurchaseWithPolicy20251015(
  annualIncome: number,
  assets: number,
  priceAsking: number,
  policyFlags: PolicyFlags,
  dsrRatio: number,
  userFlags?: {
    homeOwnerCount?: number;
    isTenant?: boolean;
    hasJeonseLoan?: boolean;
    jeonseLoanPrincipal?: number;
    jeonseLoanRate?: number;
  },
  loanRate: number = 3.5,
  loanYears: number = 40
): {
  maxPropertyPrice: number;
  mortgageLimit: number;
  mortgageByLtv: number;
  mortgageByDsr: number;
  monthlyRepayment: number;
  effectiveRateForDSR: number;
  policyNotes: string[];
  policyApplied: {
    mortgageCapApplied: boolean;
    stressRateApplied: boolean;
    jeonseInterestInDsr: boolean;
    mortgageCapAmount?: number;
  };
} {
  const policyNotes: string[] = [];
  const policyApplied = {
    mortgageCapApplied: false,
    stressRateApplied: false,
    jeonseInterestInDsr: false,
    mortgageCapAmount: undefined as number | undefined,
  };

  // 1. 스트레스 DSR 적용
  let effectiveRateForDSR = loanRate;
  if (policyFlags.isCapitalArea || policyFlags.isRegulatedArea) {
    effectiveRateForDSR = loanRate + 3.0; // 기존 1.5% → 3.0%로 상향
    policyApplied.stressRateApplied = true;
    policyNotes.push("스트레스 DSR 3.0% 적용 (규제지역)");
  }

  // 2. 1주택자 전세대출 DSR 반영
  let adjustedMonthlyDSR = (annualIncome * dsrRatio / 100) / 12;

  const shouldApplyJeonse =
    userFlags?.homeOwnerCount === 1 &&
    userFlags?.isTenant === true &&
    userFlags?.hasJeonseLoan === true &&
    (policyFlags.isCapitalArea || policyFlags.isRegulatedArea) &&
    userFlags?.jeonseLoanPrincipal &&
    userFlags?.jeonseLoanRate;

  if (shouldApplyJeonse) {
    const jeonseInterestMonthly = calculateJeonseLoanInterestMonthly(
      userFlags!.jeonseLoanPrincipal!,
      userFlags!.jeonseLoanRate!
    );
    adjustedMonthlyDSR = Math.max(0, adjustedMonthlyDSR - jeonseInterestMonthly);
    policyApplied.jeonseInterestInDsr = true;
    policyNotes.push("1주택자 전세대출 이자 DSR 차감 적용");
  }

  // 3. 기본 계산 (LTV/DSR)
  const ltv = 0.7;
  const mortgageByLtv = priceAsking * ltv;
  const mortgageByDsr = calculateLoanLimit(adjustedMonthlyDSR, effectiveRateForDSR, loanYears);

  // 4. 주담대 구간별 최대한도 캡 적용
  let mortgageLimit = Math.min(mortgageByLtv, mortgageByDsr);

  if (policyFlags.isCapitalArea || policyFlags.isRegulatedArea) {
    const mortgageCap = calculateMortgageCapByPrice(priceAsking);
    if (mortgageLimit > mortgageCap) {
      mortgageLimit = mortgageCap;
      policyApplied.mortgageCapApplied = true;
      policyApplied.mortgageCapAmount = mortgageCap;
      policyNotes.push(`주담대 한도 캡 적용: ${(mortgageCap / 100000000).toFixed(1)}억원`);
    }
  }

  // 5. 최종 계산
  const maxPropertyPrice = assets + mortgageLimit;
  const monthlyRepayment = calculateMonthlyPayment(mortgageLimit, loanRate, loanYears);

  // 6. 토지거래허가구역 안내
  if (policyFlags.isTojiPermitArea) {
    policyNotes.push("토지거래허가구역: 2년 실거주 의무");
    policyNotes.push(`지정기간: ${policyFlags.tojiPermitStart} ~ ${policyFlags.tojiPermitEnd}`);
  }

  // 호가를 시가 대용 사용 안내
  if (policyFlags.isCapitalArea || policyFlags.isRegulatedArea) {
    policyNotes.push("호가를 시가 대용으로 사용하여 계산됨");
  }

  return {
    maxPropertyPrice,
    mortgageLimit,
    mortgageByLtv,
    mortgageByDsr,
    monthlyRepayment,
    effectiveRateForDSR,
    policyNotes,
    policyApplied
  };
}

/**
 * 2025.10.15 정책의 제약(DSR/LTV/가격구간별 캡)을 동시에 만족하는
 * 최대 구매가능가를 수치 반복으로 계산
 */
export function calculateMaxPurchaseWithPolicy20251015ByCapacity(
  annualIncome: number,
  assets: number,
  policyFlags: PolicyFlags,
  dsrRatio: number,
  userFlags?: {
    homeOwnerCount?: number;
    isTenant?: boolean;
    hasJeonseLoan?: boolean;
    jeonseLoanPrincipal?: number;
    jeonseLoanRate?: number;
  },
  loanRate: number = 3.5,
  loanYears: number = 40
): {
  maxPropertyPrice: number;
  mortgageLimit: number;
  mortgageByLtv: number;
  mortgageByDsr: number;
  monthlyRepayment: number;
  effectiveRateForDSR: number;
  policyNotes: string[];
  policyApplied: {
    mortgageCapApplied: boolean;
    stressRateApplied: boolean;
    jeonseInterestInDsr: boolean;
    mortgageCapAmount?: number;
  };
  derivedPriceAsking: number;
} {
  const policyNotes: string[] = [];
  const policyApplied = {
    mortgageCapApplied: false,
    stressRateApplied: false,
    jeonseInterestInDsr: false,
    mortgageCapAmount: undefined as number | undefined,
  };
  const isRegulatedByPolicy =
    policyFlags.isCapitalArea || policyFlags.isRegulatedArea;

  let effectiveRateForDSR = loanRate;
  if (isRegulatedByPolicy) {
    effectiveRateForDSR = loanRate + 3.0;
    policyApplied.stressRateApplied = true;
    policyNotes.push("스트레스 DSR 3.0% 적용 (규제지역)");
  }

  let adjustedMonthlyDSR = (annualIncome * dsrRatio / 100) / 12;
  const shouldApplyJeonse =
    userFlags?.homeOwnerCount === 1 &&
    userFlags?.isTenant === true &&
    userFlags?.hasJeonseLoan === true &&
    isRegulatedByPolicy &&
    userFlags?.jeonseLoanPrincipal &&
    userFlags?.jeonseLoanRate;

  if (shouldApplyJeonse) {
    const jeonseInterestMonthly = calculateJeonseLoanInterestMonthly(
      userFlags!.jeonseLoanPrincipal!,
      userFlags!.jeonseLoanRate!,
    );
    adjustedMonthlyDSR = Math.max(0, adjustedMonthlyDSR - jeonseInterestMonthly);
    policyApplied.jeonseInterestInDsr = true;
    policyNotes.push("1주택자 전세대출 이자 DSR 차감 적용");
  }

  const mortgageByDsr = calculateLoanLimit(
    adjustedMonthlyDSR,
    effectiveRateForDSR,
    loanYears,
  );

  // 최대 구매가 P는 아래 제약을 동시에 만족:
  // 1) P - assets <= DSR한도
  // 2) P - assets <= 0.7P  (LTV 70%)
  // 3) 규제지역이면 가격구간별 캡(P) 적용
  const maxByLtv = assets > 0 ? assets / (1 - 0.7) : 0;
  let price = 0;

  if (isRegulatedByPolicy) {
    const segments = [
      { min: 0, max: 1_500_000_000, cap: 600_000_000, strictMin: false },
      {
        min: 1_500_000_000,
        max: 2_500_000_000,
        cap: 400_000_000,
        strictMin: true,
      },
      {
        min: 2_500_000_000,
        max: Number.POSITIVE_INFINITY,
        cap: 200_000_000,
        strictMin: true,
      },
    ];

    for (const segment of segments) {
      const loanCapInSegment = Math.min(mortgageByDsr, segment.cap);
      const candidate = Math.min(maxByLtv, assets + loanCapInSegment, segment.max);
      const isInRange = segment.strictMin
        ? candidate > segment.min
        : candidate >= segment.min;
      if (isInRange) {
        price = Math.max(price, candidate);
      }
    }
  } else {
    price = Math.min(maxByLtv, assets + mortgageByDsr);
  }

  // 결과 일관성 보장: 최종 매수가와 사용 대출이 동일 제약식에서 파생되도록 계산
  const derivedPriceAsking = Math.max(0, Math.round(price));
  const mortgageByLtv = derivedPriceAsking * 0.7;
  const mortgageCap = isRegulatedByPolicy
    ? calculateMortgageCapByPrice(derivedPriceAsking)
    : Number.POSITIVE_INFINITY;
  const maxAllowedMortgage = Math.min(mortgageByLtv, mortgageByDsr, mortgageCap);
  const mortgageLimit = Math.max(
    0,
    Math.min(Math.round(derivedPriceAsking - assets), Math.round(maxAllowedMortgage)),
  );
  const maxPropertyPrice = Math.max(0, Math.round(assets + mortgageLimit));
  const monthlyRepayment = calculateMonthlyPayment(mortgageLimit, loanRate, loanYears);

  if (isRegulatedByPolicy && maxAllowedMortgage === mortgageCap) {
    policyApplied.mortgageCapApplied = true;
    policyApplied.mortgageCapAmount = mortgageCap;
    policyNotes.push(`주담대 한도 캡 적용: ${(mortgageCap / 100000000).toFixed(1)}억원`);
  }

  if (policyFlags.isTojiPermitArea) {
    policyNotes.push("토지거래허가구역: 2년 실거주 의무");
    policyNotes.push(`지정기간: ${policyFlags.tojiPermitStart} ~ ${policyFlags.tojiPermitEnd}`);
  }

  if (isRegulatedByPolicy) {
    policyNotes.push("호가를 시가 대용으로 사용하여 계산됨");
  }

  return {
    maxPropertyPrice,
    mortgageLimit,
    mortgageByLtv,
    mortgageByDsr,
    monthlyRepayment,
    effectiveRateForDSR,
    policyNotes,
    policyApplied,
    derivedPriceAsking,
  };
}
