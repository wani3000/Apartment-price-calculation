const {
  calculateMonthlyPayment,
  calculateMonthlyInterestOnly,
  calculateLoanLimit,
  calculateMaxPurchaseForLiving,
  calculateMaxPurchaseForLivingWithStressDSR,
  calculateMaxPurchaseForInvestment,
  formatKoreanCurrency,
  convertManToWon,
  convertWonToMan
} = require('./src/utils/calculator');

// 테스트 케이스 정의
const testCases = {
  // 1. 원리금 균등상환 계산
  monthlyPayment: {
    principal: 100000000, // 1억원
    rate: 3.5, // 3.5%
    years: 30, // 30년
    expected: 449.04 // 대략적인 예상 결과 (만원)
  },

  // 2. 만기일시상환 월 이자 계산
  monthlyInterest: {
    principal: 100000000, // 1억원
    rate: 3.5, // 3.5%
    expected: 291.67 // 대략적인 예상 결과 (만원)
  },

  // 3. 주택담보대출 한도 계산
  loanLimit: {
    monthlyDSR: 1000000, // 월 100만원
    rate: 3.5, // 3.5%
    years: 30, // 30년
    expected: 222.70 // 대략적인 예상 결과 (백만원)
  },

  // 4. 실거주 시나리오 최대 구매 가능 금액
  livingScenario: {
    annualIncome: 60000000, // 연 6천만원
    assets: 200000000, // 2억원 보유자산
    dsrRatio: 40, // DSR 40%
    expected: {
      maxPropertyPrice: 716.27, // 예상 결과 (백만원)
      mortgageLimit: 516.27 // 예상 결과 (백만원)
    }
  },

  // 5. 갭투자 시나리오 최대 구매 가능 금액
  investmentScenario: {
    annualIncome: 60000000, // 연 6천만원
    assets: 200000000, // 2억원 보유자산
    jeonseRatio: 60, // 전세가율 60%
    expected: {
      maxPropertyPrice: 680.00, // 예상 결과 (백만원)
      creditLoan: 72.00 // 예상 결과 (백만원)
    }
  },

  // 6. 스트레스 DSR 3단계 - 수도권
  stressDSRCapital: {
    annualIncome: 60000000, // 연 6천만원
    assets: 200000000, // 2억원 보유자산
    dsrRatio: 40, // DSR 40%
    isCapitalArea: true, // 수도권
    stressRate: 1.5, // 스트레스 금리 1.5%
    effectiveRate: 5.0 // 유효 금리 5.0% (3.5% + 1.5%)
  },

  // 7. 스트레스 DSR 3단계 - 지방
  stressDSRLocal: {
    annualIncome: 60000000, // 연 6천만원
    assets: 200000000, // 2억원 보유자산
    dsrRatio: 40, // DSR 40%
    isCapitalArea: false, // 지방
    stressRate: 0.75, // 스트레스 금리 0.75%
    effectiveRate: 4.25 // 유효 금리 4.25% (3.5% + 0.75%)
  }
};

// 테스트 실행
console.log('===== 계산 로직 테스트 =====');

// 1. 원리금 균등상환 계산 테스트
const monthlyPayment = calculateMonthlyPayment(
  testCases.monthlyPayment.principal,
  testCases.monthlyPayment.rate,
  testCases.monthlyPayment.years
);
console.log('1. 원리금 균등상환 월 납입액 (만원):', convertWonToMan(monthlyPayment).toFixed(2));
console.log('   예상 결과:', testCases.monthlyPayment.expected);
console.log('   테스트 결과:', Math.abs(convertWonToMan(monthlyPayment) - testCases.monthlyPayment.expected) < 1 ? '통과' : '실패');

// 2. 만기일시상환 월 이자 계산 테스트
const monthlyInterest = calculateMonthlyInterestOnly(
  testCases.monthlyInterest.principal,
  testCases.monthlyInterest.rate
);
console.log('\n2. 만기일시상환 월 이자 (만원):', convertWonToMan(monthlyInterest).toFixed(2));
console.log('   예상 결과:', testCases.monthlyInterest.expected);
console.log('   테스트 결과:', Math.abs(convertWonToMan(monthlyInterest) - testCases.monthlyInterest.expected) < 1 ? '통과' : '실패');

// 3. 주택담보대출 한도 계산 테스트
const loanLimit = calculateLoanLimit(
  testCases.loanLimit.monthlyDSR,
  testCases.loanLimit.rate,
  testCases.loanLimit.years
);
console.log('\n3. 주택담보대출 한도 (백만원):', (loanLimit / 1000000).toFixed(2));
console.log('   예상 결과:', testCases.loanLimit.expected);
console.log('   테스트 결과:', Math.abs(loanLimit / 1000000 - testCases.loanLimit.expected) < 1 ? '통과' : '실패');

// 4. 실거주 시나리오 최대 구매 가능 금액 테스트
const livingResult = calculateMaxPurchaseForLiving(
  testCases.livingScenario.annualIncome,
  testCases.livingScenario.assets,
  testCases.livingScenario.dsrRatio
);
console.log('\n4. 실거주 시나리오 최대 구매 가능 금액:');
console.log('   최대 구매 가능 금액 (백만원):', (livingResult.maxPropertyPrice / 1000000).toFixed(2));
console.log('   주택담보대출 한도 (백만원):', (livingResult.mortgageLimit / 1000000).toFixed(2));
console.log('   예상 최대 구매 가능 금액:', testCases.livingScenario.expected.maxPropertyPrice);
console.log('   예상 주택담보대출 한도:', testCases.livingScenario.expected.mortgageLimit);
console.log('   테스트 결과:', 
  Math.abs(livingResult.maxPropertyPrice / 1000000 - testCases.livingScenario.expected.maxPropertyPrice) < 1 &&
  Math.abs(livingResult.mortgageLimit / 1000000 - testCases.livingScenario.expected.mortgageLimit) < 1 ? '통과' : '실패');

// 5. 갭투자 시나리오 최대 구매 가능 금액 테스트
const investmentResult = calculateMaxPurchaseForInvestment(
  testCases.investmentScenario.annualIncome,
  testCases.investmentScenario.assets,
  testCases.investmentScenario.jeonseRatio
);
console.log('\n5. 갭투자 시나리오 최대 구매 가능 금액:');
console.log('   최대 구매 가능 금액 (백만원):', (investmentResult.maxPropertyPrice / 1000000).toFixed(2));
console.log('   신용대출 (백만원):', (investmentResult.creditLoan / 1000000).toFixed(2));
console.log('   전세보증금 (백만원):', (investmentResult.jeonseDeposit / 1000000).toFixed(2));
console.log('   예상 최대 구매 가능 금액:', testCases.investmentScenario.expected.maxPropertyPrice);
console.log('   예상 신용대출:', testCases.investmentScenario.expected.creditLoan);
console.log('   테스트 결과:',
  Math.abs(investmentResult.maxPropertyPrice / 1000000 - testCases.investmentScenario.expected.maxPropertyPrice) < 1 &&
  Math.abs(investmentResult.creditLoan / 1000000 - testCases.investmentScenario.expected.creditLoan) < 1 ? '통과' : '실패');

// 6. 스트레스 DSR 3단계 - 수도권 테스트
console.log('\n===== 스트레스 DSR 3단계 테스트 =====');
const stressCapitalResult = calculateMaxPurchaseForLivingWithStressDSR(
  testCases.stressDSRCapital.annualIncome,
  testCases.stressDSRCapital.assets,
  testCases.stressDSRCapital.dsrRatio,
  testCases.stressDSRCapital.isCapitalArea
);
console.log('\n6. 스트레스 DSR 3단계 - 수도권:');
console.log('   스트레스 금리:', stressCapitalResult.stressRate + '%');
console.log('   유효 금리:', stressCapitalResult.effectiveRate + '%');
console.log('   최대 구매 가능 금액 (백만원):', (stressCapitalResult.maxPropertyPrice / 1000000).toFixed(2));
console.log('   주택담보대출 한도 (백만원):', (stressCapitalResult.mortgageLimit / 1000000).toFixed(2));
console.log('   기존 대비 감소율:', (((livingResult.maxPropertyPrice - stressCapitalResult.maxPropertyPrice) / livingResult.maxPropertyPrice) * 100).toFixed(1) + '%');

// 7. 스트레스 DSR 3단계 - 지방 테스트
const stressLocalResult = calculateMaxPurchaseForLivingWithStressDSR(
  testCases.stressDSRLocal.annualIncome,
  testCases.stressDSRLocal.assets,
  testCases.stressDSRLocal.dsrRatio,
  testCases.stressDSRLocal.isCapitalArea
);
console.log('\n7. 스트레스 DSR 3단계 - 지방:');
console.log('   스트레스 금리:', stressLocalResult.stressRate + '%');
console.log('   유효 금리:', stressLocalResult.effectiveRate + '%');
console.log('   최대 구매 가능 금액 (백만원):', (stressLocalResult.maxPropertyPrice / 1000000).toFixed(2));
console.log('   주택담보대출 한도 (백만원):', (stressLocalResult.mortgageLimit / 1000000).toFixed(2));
console.log('   기존 대비 감소율:', (((livingResult.maxPropertyPrice - stressLocalResult.maxPropertyPrice) / livingResult.maxPropertyPrice) * 100).toFixed(1) + '%');

// 8. 한글 금액 변환 테스트
console.log('\n8. 한글 금액 변환:');
console.log('   1억원:', formatKoreanCurrency(100000000));
console.log('   1억 2천만원:', formatKoreanCurrency(120000000));
console.log('   1억 2345만원:', formatKoreanCurrency(123450000));
console.log('   10억 3456만원:', formatKoreanCurrency(1034560000));

// 9. 스트레스 DSR 영향 분석
console.log('\n===== 스트레스 DSR 3단계 영향 분석 =====');
console.log('기준 조건: 연소득 6천만원, 보유자산 2억원, DSR 40%');
console.log('');
console.log('구분                    | 기존 DSR | 스트레스(수도권) | 스트레스(지방)');
console.log('------------------------|----------|------------------|----------------');
console.log(`적용 금리               | 3.50%    | 5.00%            | 4.25%`);
console.log(`대출 한도 (억원)        | ${(livingResult.mortgageLimit / 100000000).toFixed(1)}      | ${(stressCapitalResult.mortgageLimit / 100000000).toFixed(1)}             | ${(stressLocalResult.mortgageLimit / 100000000).toFixed(1)}`);
console.log(`최대 구매가능 (억원)    | ${(livingResult.maxPropertyPrice / 100000000).toFixed(1)}      | ${(stressCapitalResult.maxPropertyPrice / 100000000).toFixed(1)}             | ${(stressLocalResult.maxPropertyPrice / 100000000).toFixed(1)}`);
console.log(`감소율                  | -        | ${(((livingResult.maxPropertyPrice - stressCapitalResult.maxPropertyPrice) / livingResult.maxPropertyPrice) * 100).toFixed(1)}%            | ${(((livingResult.maxPropertyPrice - stressLocalResult.maxPropertyPrice) / livingResult.maxPropertyPrice) * 100).toFixed(1)}%`); 