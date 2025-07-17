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
  // 월이자율 변환
  const monthlyRate = rate / 100 / 12;
  // 총 납입 횟수
  const payments = years * 12;
  
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
  // 월이자율 변환
  const monthlyRate = rate / 100 / 12;
  // 총 납입 횟수
  const payments = years * 12;
  
  // 대출한도 = 월납입액 × (1 - (1 + 월이자율)^-총개월수) ÷ 월이자율
  return monthlyDSR * ((1 - Math.pow(1 + monthlyRate, -payments)) / monthlyRate);
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
  ltv: number = 70
): { maxPropertyPrice: number, mortgageLimit: number, creditLoan: number } {
  // 월 DSR 한도 = (연소득 × DSR비율) ÷ 12
  const monthlyDSR = (annualIncome * dsrRatio / 100) / 12;
  
  // 주택담보대출 한도 계산 (원리금 균등 상환 기준)
  const mortgageLimit = calculateLoanLimit(monthlyDSR, loanRate, loanYears);
  
  // 신용대출은 고려하지 않음
  const creditLoan = 0;
  
  // 최대 구매 가능 금액 = 보유자산 + 주택담보대출 한도
  // DSR이 높을수록 대출 한도가 높아지고, 최대 구매 가능 금액도 커짐
  const maxPropertyPrice = assets + mortgageLimit;
  
  console.log('계산 정보:', {
    annualIncome,
    dsrRatio,
    monthlyDSR,
    mortgageLimit,
    assets,
    maxPropertyPrice
  });
  
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
  ltv: number = 70
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
  const mortgageLimit = calculateLoanLimit(monthlyDSR, effectiveRate, loanYears);
  
  // 신용대출은 고려하지 않음
  const creditLoan = 0;
  
  // 최대 구매 가능 금액 = 보유자산 + 주택담보대출 한도
  const maxPropertyPrice = assets + mortgageLimit;
  
  console.log('스트레스 DSR 3단계 계산 정보:', {
    annualIncome,
    dsrRatio,
    isCapitalArea,
    stressRate: `${stressRate}%`,
    baseRate: `${loanRate}%`,
    effectiveRate: `${effectiveRate}%`,
    monthlyDSR,
    mortgageLimit,
    assets,
    maxPropertyPrice
  });
  
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
  jeonseRatio: number = 60
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
  const maxLoanAmount = 600000000; // 6억원
  const loanYears = 30; // 30년
  const baseRate = 3.5; // 기본 금리 3.5%
  const stressRate = isCapitalArea ? 1.5 : 0.75; // 수도권 1.5%, 지방 0.75%
  const effectiveRate = baseRate + stressRate; // 유효 금리 (수도권 5.0%, 지방 4.25%)
  const dsrRatio = 40; // 40% 고정
  
  // 월 DSR 한도 = (연소득 × DSR비율) ÷ 12
  const monthlyDSR = (annualIncome * dsrRatio / 100) / 12;
  
  // DSR 기준 주택담보대출 한도 계산 (30년, 유효 금리 기준)
  const dsrBasedLimit = calculateLoanLimit(monthlyDSR, effectiveRate, loanYears);
  
  // 규제 한도(6억원)와 DSR 한도 중 작은 값 선택
  const mortgageLimit = Math.min(dsrBasedLimit, maxLoanAmount);
  
  // 월 상환액 계산 (실제 선택된 대출 금액 기준)
  const monthlyRepayment = calculateMonthlyPayment(mortgageLimit, effectiveRate, loanYears);
  
  // 신용대출은 고려하지 않음
  const creditLoan = 0;
  
  // 최대 구매 가능 금액 = 보유자산 + 주택담보대출 한도
  const maxPropertyPrice = assets + mortgageLimit;
  
  console.log('6.27 규제안 계산 정보:', {
    annualIncome,
    dsrRatio,
    isCapitalArea,
    baseRate: `${baseRate}%`,
    stressRate: `${stressRate}%`,
    effectiveRate: `${effectiveRate}%`,
    monthlyDSR,
    dsrBasedLimit,
    maxLoanAmount,
    mortgageLimit,
    monthlyRepayment,
    assets,
    maxPropertyPrice
  });
  
  return {
    maxPropertyPrice,
    mortgageLimit,
    creditLoan,
    stressRate,
    effectiveRate,
    monthlyRepayment
  };
}