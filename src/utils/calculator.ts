// 아파트 구매 계산에 필요한 타입 정의
export interface CalculationInput {
  annualIncome: number;      // 연소득
  availableAssets: number;   // 보유 자산
  dsrRatio: number;         // DSR 비율 (0.4 또는 0.5)
  jeonseRatio: number;      // 전세가율 (기본값 0.6)
  mortgageRate: number;     // 주담대 금리 (기본값 0.035)
  mortgageTerm: number;     // 주담대 만기 (기본값 40년)
  ltvRatio: number;         // LTV 비율 (기본값 0.7)
}

export interface CalculationResult {
  monthlyDsrLimit: number;           // 월 DSR 한도
  maxMortgageAmount: number;         // 최대 주담대 금액
  maxPurchaseAmount: number;         // 최대 구매 가능 금액
  availableCreditLoan: number;       // 가능한 신용대출 금액
}

// 실거주 계산 함수
export function calculateResidentialPurchase(input: CalculationInput): CalculationResult {
  // 1. 월 DSR 한도 계산
  const monthlyDsrLimit = (input.annualIncome * input.dsrRatio) / 12;

  // 2. DSR 기준으로 주담대 최대 금액 역산
  // PMT 공식을 사용하여 역산
  const monthlyRate = input.mortgageRate / 12;
  const totalPayments = input.mortgageTerm * 12;
  const maxMortgageAmount = monthlyDsrLimit * ((1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate);

  // 3. LTV 제한 적용
  const maxPurchaseAmountByLtv = maxMortgageAmount / input.ltvRatio;

  // 4. 최종 실거주 구매 가능 금액 계산
  const maxPurchaseAmount = input.availableAssets + maxMortgageAmount;

  // 5. 신용대출 가능 금액 계산 (DSR 여유분 기준)
  const availableCreditLoan = Math.min(
    input.annualIncome * 1.2, // 신용대출 한도
    monthlyDsrLimit * 12 / input.mortgageRate // DSR 여유분 기준
  );

  return {
    monthlyDsrLimit,
    maxMortgageAmount,
    maxPurchaseAmount,
    availableCreditLoan
  };
}

// 갭투자 계산 함수
export function calculateGapInvestment(input: CalculationInput): CalculationResult {
  // 신용대출 한도 계산
  const creditLoanLimit = input.annualIncome * 1.2;

  // 갭투자 최대 구매 가능 금액 계산
  const maxPurchaseAmount = (input.availableAssets + creditLoanLimit) / (1 - input.jeonseRatio);

  // 전세보증금 계산
  const jeonseDeposit = maxPurchaseAmount * input.jeonseRatio;

  return {
    monthlyDsrLimit: 0, // 갭투자는 DSR 계산 불필요
    maxMortgageAmount: 0, // 갭투자는 주담대 사용하지 않음
    maxPurchaseAmount,
    availableCreditLoan: creditLoanLimit
  };
}

// 기본 입력값
export const defaultCalculationInput: CalculationInput = {
  annualIncome: 100000000,    // 1억원
  availableAssets: 200000000, // 2억원
  dsrRatio: 0.5,             // 50%
  jeonseRatio: 0.6,          // 60%
  mortgageRate: 0.035,       // 3.5%
  mortgageTerm: 40,          // 40년
  ltvRatio: 0.7             // 70%
}; 