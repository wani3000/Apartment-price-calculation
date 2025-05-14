'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// 원리금 균등상환 공식 함수 (블록 밖으로 이동)
function getLoanAmountByMonthlyPayment(
  monthlyPayment: number,
  interestRate: number,
  termYears: number
): number {
  const n = termYears * 12;
  const r = interestRate / 12;
  return monthlyPayment * (1 - Math.pow(1 + r, -n)) / r;
}

export default function PlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('gap'); // 'gap' 또는 'live'
  const [calculationResult, setCalculationResult] = useState({
    income: 0,
    assets: 0,
    spouseIncome: 0,
    maxLoanAmount: 0,
    maxPropertyPrice: 0,
    creditLoan: 0,
    jeonseDeposit: 0,
    mortgageLimit: 0
  });
  const [loanOptions, setLoanOptions] = useState({
    ltv: 70,
    dsr: 40
  });

  useEffect(() => {
    // URL 파라미터에서 모드(gap/live) 가져오기
    const modeParam = searchParams.get('mode');
    if (modeParam === 'gap' || modeParam === 'live') {
      setMode(modeParam);
    }

    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 계산 데이터 가져오기
    const calculatorDataStr = localStorage.getItem('calculatorData');
    const loanOptionsStr = localStorage.getItem('loanOptions');
    
    if (calculatorDataStr && loanOptionsStr) {
      const calculatorData = JSON.parse(calculatorDataStr);
      const loanOptions = JSON.parse(loanOptionsStr);
      setLoanOptions(loanOptions);
      
      // 만 원 → 원 단위 변환
      const income = (calculatorData.income + calculatorData.spouseIncome) * 10000;
      const assets = calculatorData.assets * 10000;
      
      // 옵션
      const dsrRate = (loanOptions.dsr || 40) / 100;
      const ltvRate = (loanOptions.ltv || 70) / 100;
      const interestRate = 0.035;
      const termYears = 40;
      
      let result;
      
      if (modeParam === 'gap') {
        // 갭투자 계산
        const creditLoan = income * 1.2; // 신용대출 = 연소득의 120%
        const jeonseRate = 0.55; // 전세가율 55%
        const totalGapCapital = assets + creditLoan;
        const buyablePrice = totalGapCapital / (1 - jeonseRate); // 역산된 매매가
        const jeonseDeposit = buyablePrice * jeonseRate;
        
        result = {
          income: calculatorData.income,
          assets: calculatorData.assets,
          spouseIncome: calculatorData.spouseIncome,
          creditLoan: Math.round(creditLoan / 10000), // 만 원 단위
          jeonseDeposit: Math.round(jeonseDeposit / 10000), // 만 원 단위
          maxLoanAmount: Math.round(totalGapCapital / 10000), // 만 원 단위
          maxPropertyPrice: Math.round(buyablePrice / 10000), // 만 원 단위
          mortgageLimit: 0 // 갭투자에서는 사용되지 않음
        };
      } else {
        // 실거주 계산
        const maxMonthlyDSR = (income * dsrRate) / 12;
        const mortgageLimit = getLoanAmountByMonthlyPayment(maxMonthlyDSR, interestRate, termYears);
        const totalBuyable = assets + mortgageLimit;
        
        result = {
          income: calculatorData.income,
          assets: calculatorData.assets,
          spouseIncome: calculatorData.spouseIncome,
          mortgageLimit: Math.round(mortgageLimit / 10000), // 만 원 단위
          maxLoanAmount: Math.round(mortgageLimit / 10000), // 만 원 단위
          maxPropertyPrice: Math.round(totalBuyable / 10000), // 만 원 단위
          creditLoan: 0, // 실거주 시에는 계산에 사용하지 않음
          jeonseDeposit: 0 // 실거주 시에는 계산에 사용하지 않음
        };
      }
      
      setCalculationResult(result);
    }
  }, [searchParams]);

  // 숫자를 한글 표기로 변환 (예: 12000 -> 1억 2,000만 원)
  const formatToKorean = (num: number) => {
    if (num < 10000) {
      return `${num.toLocaleString()}만 원`;
    } else {
      const eok = Math.floor(num / 10000);
      const man = num % 10000;
      
      if (man === 0) {
        return `${eok.toLocaleString()}억 원`;
      } else {
        return `${eok.toLocaleString()}억 ${man.toLocaleString()}만 원`;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 overflow-y-auto">
      {/* 타이틀 */}
      <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6 mt-6">
        {username}님의 자금계획
      </h1>

      {/* 최대 금액 정보 */}
      <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-6">
        <h2 className="text-black text-[18px] font-bold leading-[26px] tracking-[-0.18px]">
          {mode === 'gap' ? '갭투자 시' : '실거주 시'}
        </h2>
        <p className="text-black text-[22px] font-bold leading-7 tracking-[-0.22px]">
          최대 {formatToKorean(calculationResult.maxPropertyPrice)}
        </p>
        <p className="text-[#495057] text-sm font-normal leading-5 tracking-[-0.28px]">
          {mode === 'gap' 
            ? '세입자의 전세금을 활용해 투자해요' 
            : '주택 가격의 70%까지 대출받을 수 있어요'}
        </p>
      </div>

      {mode === 'gap' ? (
        <>
          {/* 신용대출 섹션 - 갭투자 시 */}
          <div className="mb-6">
            <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              신용대출
            </h3>
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
              <div className="flex justify-between items-center w-full">
                <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                  연소득의 120%
                </p>
                <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                  {formatToKorean(calculationResult.creditLoan)}
                </p>
              </div>
              <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                금리 3.5% 기준이에요
              </p>
            </div>
          </div>

          {/* 전세금 섹션 - 갭투자 시 */}
          <div className="mb-6">
            <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              전세금
            </h3>
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
              <div className="flex justify-between items-center w-full">
                <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                  전세가율 55%
                </p>
                <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                  {formatToKorean(calculationResult.jeonseDeposit || calculationResult.maxPropertyPrice * 0.55)}
                </p>
              </div>
              <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                서울 아파트 평균 전세가율인 55%를 적용했어요
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* DSR 섹션 - 실거주 시 */}
          <div className="mb-6">
            <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              DSR (총부채원리금상환비율)
            </h3>
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
              <div className="flex justify-between items-center w-full">
                <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                  1금융권 기준
                </p>
                <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                  연소득의 {loanOptions.dsr}%
                </p>
              </div>
              <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                주택담보대출+신용대출
              </p>
            </div>
          </div>

          {/* 주택담보대출 섹션 - 실거주 시 */}
          <div className="mb-6">
            <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              주택담보대출
            </h3>
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
              <div className="flex justify-between items-center w-full">
                <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                  40년 만기
                </p>
                <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                  {formatToKorean(calculationResult.maxLoanAmount)}
                </p>
              </div>
              <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                금리 3.5% 기준이에요
              </p>
            </div>
          </div>

          {/* 신용대출 섹션 - 실거주 시 */}
          <div className="mb-6">
            <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              신용대출
            </h3>
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
              <div className="flex justify-between items-center w-full">
                <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                  연소득의 120%
                </p>
                <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                  0 원
                </p>
              </div>
              <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                금리 3.5% 기준이에요
              </p>
            </div>
          </div>
        </>
      )}

      {/* 보유자산 섹션 - 공통 */}
      <div className="mb-6">
        <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
          보유자산
        </h3>
        <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
          <div className="flex justify-between items-center w-full">
            <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
              보유자산
            </p>
            <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
              {formatToKorean(calculationResult.assets)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 