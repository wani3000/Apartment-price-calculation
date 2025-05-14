'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FinalResultPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('gap'); // 'gap' 또는 'live'
  const [loanOptions, setLoanOptions] = useState({
    ltv: 70,
    dsr: 40
  });
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

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // LTV, DSR 옵션 가져오기
    const loanOptionsStr = localStorage.getItem('loanOptions');
    if (loanOptionsStr) {
      setLoanOptions(JSON.parse(loanOptionsStr));
    }

    // 계산 데이터 가져오기
    const calculatorDataStr = localStorage.getItem('calculatorData');
    if (calculatorDataStr) {
      const calculatorData = JSON.parse(calculatorDataStr);
      // 만 원 → 원 단위 변환
      const income = (calculatorData.income + calculatorData.spouseIncome) * 10000;
      const assets = calculatorData.assets * 10000;
      // 옵션
      const dsrRate = (loanOptions.dsr || 40) / 100;
      const ltvRate = (loanOptions.ltv || 70) / 100;
      const interestRate = 0.035;
      const termYears = 40;
      // 실거주 계산 공식
      const calcLiveBuyable = () => {
        const maxMonthlyDSR = (income * dsrRate) / 12;
        const mortgageLimit = getLoanAmountByMonthlyPayment(maxMonthlyDSR, interestRate, termYears);
        const maxPriceByLTV = mortgageLimit / ltvRate;
        const totalBuyable = assets + mortgageLimit;
        return {
          mortgageLimit,
          maxPriceByLTV,
          totalBuyable
        };
      };
      // 갭투자 계산 공식
      const calcGapBuyable = () => {
        const creditLoan = income * 1.2;
        const jeonseRate = 0.55;
        const totalGapCapital = assets + creditLoan;
        const buyablePrice = totalGapCapital / (1 - jeonseRate);
        const jeonseDeposit = buyablePrice * jeonseRate;
        return {
          buyablePrice,
          jeonseDeposit,
          totalGapCapital
        };
      };
      // 결과 적용
      let result;
      if (activeTab === 'gap') {
        const gap = calcGapBuyable();
        result = {
          income: calculatorData.income,
          assets: calculatorData.assets,
          spouseIncome: calculatorData.spouseIncome,
          creditLoan: Math.round(income * 1.2 / 10000), // 신용대출 (만 원 단위)
          jeonseDeposit: Math.round(gap.jeonseDeposit / 10000), // 전세금 (만 원 단위)
          maxLoanAmount: Math.round(gap.totalGapCapital / 10000), // 만 원 단위
          maxPropertyPrice: Math.round(gap.buyablePrice / 10000), // 만 원 단위
          mortgageLimit: 0 // 갭투자에서는 사용하지 않음
        };
      } else {
        const live = calcLiveBuyable();
        result = {
          income: calculatorData.income,
          assets: calculatorData.assets,
          spouseIncome: calculatorData.spouseIncome,
          mortgageLimit: Math.round(live.mortgageLimit / 10000), // 만 원 단위
          maxLoanAmount: Math.round(live.mortgageLimit / 10000), // 만 원 단위
          maxPropertyPrice: Math.round(live.totalBuyable / 10000), // 만 원 단위
          creditLoan: 0, // 실거주 시에는 계산에 사용하지 않음
          jeonseDeposit: 0 // 실거주 시에는 계산에 사용하지 않음
        };
      }
      setCalculationResult(result);
    }
  }, [activeTab]); // activeTab이 변경될 때마다 재계산

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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col px-5">
        {/* 타이틀 */}
        <h1 className="text-[24px] font-bold leading-8 tracking-[-0.24px] mb-8 mt-6">
          <span className="text-[#7577FF]">{username}</span> 님의 소득과 자산,<br />
          투자와 실거주를 모두 고려했어요
        </h1>

        {/* 탭 */}
        <div className="flex border-b border-grey-40 mb-6">
          <button
            className={`flex-1 py-[10px] px-4 text-center ${
              activeTab === 'gap' 
                ? 'border-b-2 border-[#7577FF] text-[#7577FF] font-bold' 
                : 'text-grey-80'
            }`}
            onClick={() => setActiveTab('gap')}
          >
            갭투자
          </button>
          <button
            className={`flex-1 py-[10px] px-4 text-center ${
              activeTab === 'live' 
                ? 'border-b-2 border-[#7577FF] text-[#7577FF] font-bold' 
                : 'text-grey-80'
            }`}
            onClick={() => setActiveTab('live')}
          >
            실거주
          </button>
        </div>

        {/* 결과 카드 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-[302px] p-[40px_0px] flex flex-col justify-center items-center rounded-xl bg-gradient-to-b from-[#EEF] via-white to-[#EEF]">
            <p className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] text-center mb-4">
              {username} 님이<br />살 수 있는 아파트는
            </p>
            
            {/* 여기에 이미지가 들어갈 예정 */}
            <div className="w-[274px] h-[190px] bg-[#F8F9FA] mb-4 flex items-center justify-center">
              <span className="text-grey-60 text-sm">이미지 준비 중</span>
            </div>
            
            <p className="text-grey-80 text-base font-medium leading-6 tracking-[-0.32px] text-center">
              {activeTab === 'gap' ? '갭투자 시' : '실거주 시'}
            </p>
            
            <p className="text-grey-100 text-[24px] font-bold leading-8 tracking-[-0.24px] text-center mb-6">
              {formatToKorean(calculationResult.maxPropertyPrice)}
            </p>
          </div>
        </div>
        
        {/* 자금계획 버튼 */}
        <button 
          onClick={() => router.push(`/result/plan?mode=${activeTab}`)}
          className="w-full max-w-[302px] mx-auto mt-6 px-5 py-4 justify-between items-center border border-[#E9ECEF] rounded-lg flex"
        >
          <span className="text-grey-80 text-base font-medium leading-6 tracking-[-0.32px]">
            자금계획
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.33325L10.6667 7.99992L6 12.6666" stroke="#ADB5BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 하단 버튼 */}
        <div className="w-full max-w-[302px] mx-auto mt-auto grid grid-cols-2 gap-3 pb-10">
          <button className="flex h-14 justify-center items-center gap-2.5 border border-[#ADB5BD] rounded-[300px] text-grey-100 font-medium">
            카드 저장
          </button>
          <button className="flex h-14 justify-center items-center gap-2.5 bg-[#7577FF] text-white rounded-[300px] font-semibold">
            공유하기
          </button>
        </div>
      </div>
    </div>
  );
} 