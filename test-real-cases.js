const calculator = require('./src/utils/calculator');

// 실제 사례 테스트
console.log('===== 실제 사례 계산 테스트 =====');

// 실제 사례 1: 연소득 5,000만원, 보유자산 1억원, DSR 40%
const case1 = {
  annualIncome: 50000000, // 5,000만원
  assets: 100000000, // 1억원
  dsrRatio: 40, // DSR 40%
  jeonseRatio: 60 // 전세가율 60%
};

// 실제 사례 2: 연소득 8,000만원, 보유자산 3억원, DSR 50%
const case2 = {
  annualIncome: 80000000, // 8,000만원
  assets: 300000000, // 3억원
  dsrRatio: 50, // DSR 50%
  jeonseRatio: 60 // 전세가율 60%
};

// 실제 사례 3: 연소득 1억원, 보유자산 5억원, DSR 40%
const case3 = {
  annualIncome: 100000000, // 1억원
  assets: 500000000, // 5억원
  dsrRatio: 40, // DSR 40%
  jeonseRatio: 60 // 전세가율 60%
};

// 실제 사례 4: 맞벌이, 배우자 소득 포함 1억5천만원, 보유자산 4억원, DSR 50%
const case4 = {
  annualIncome: 150000000, // 1억 5천만원
  assets: 400000000, // 4억원
  dsrRatio: 50, // DSR 50%
  jeonseRatio: 60 // 전세가율 60%
};

// 계산 및 결과 출력 함수
function calculateAndPrintResults(caseNum, caseData) {
  console.log(`\n[사례 ${caseNum}] 연소득: ${formatAmount(caseData.annualIncome)}, 보유자산: ${formatAmount(caseData.assets)}`);
  
  // 실거주 시나리오
  const livingResult = calculator.calculateMaxPurchaseForLiving(
    caseData.annualIncome,
    caseData.assets,
    caseData.dsrRatio
  );
  
  console.log(`\n실거주 시나리오 (DSR ${caseData.dsrRatio}%):
  - 최대 구매 가능 금액: ${formatAmount(livingResult.maxPropertyPrice)}
  - 주택담보대출 한도: ${formatAmount(livingResult.mortgageLimit)}
  - 한글 표기: ${calculator.formatKoreanCurrency(livingResult.maxPropertyPrice)}`);
  
  // 갭투자 시나리오
  const investmentResult = calculator.calculateMaxPurchaseForInvestment(
    caseData.annualIncome,
    caseData.assets,
    caseData.jeonseRatio
  );
  
  console.log(`\n갭투자 시나리오 (전세가율 ${caseData.jeonseRatio}%):
  - 최대 구매 가능 금액: ${formatAmount(investmentResult.maxPropertyPrice)}
  - 신용대출: ${formatAmount(investmentResult.creditLoan)}
  - 전세보증금: ${formatAmount(investmentResult.jeonseDeposit)}
  - 한글 표기: ${calculator.formatKoreanCurrency(investmentResult.maxPropertyPrice)}`);
}

// 숫자를 천 단위 구분자가 있는 형식으로 변환
function formatAmount(amount) {
  return (amount / 10000).toLocaleString() + '만원';
}

// 각 사례에 대한 계산 실행
calculateAndPrintResults(1, case1);
calculateAndPrintResults(2, case2);
calculateAndPrintResults(3, case3);
calculateAndPrintResults(4, case4); 