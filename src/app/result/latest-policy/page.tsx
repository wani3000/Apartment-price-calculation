'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import {
  calculateMaxPurchaseForInvestment,
  calculateMaxPurchaseWithPolicy20251015,
  determinePolicyFlags,
  convertManToWon,
  calculateMonthlyPayment,
  PolicyFlags
} from '@/utils/calculator';

interface CalculatorData {
  income: number;
  assets: number;
  myAssets: number;
  spouseAssets: number;
  spouseIncome: number;
  homeOwnerCount: number;
  isTenant: boolean;
  hasJeonseLoan: boolean;
  jeonseLoanPrincipal: number;
  jeonseLoanRate: number;
}

interface CalculationResult {
  living: {
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
  };
  investment: {
    maxPropertyPrice: number;
    creditLoan: number;
    jeonseDeposit: number;
    monthlyRepayment: number;
  };
  policyFlags: PolicyFlags;
}

export default function LatestPolicyPage() {
  const router = useRouter();
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'living' | 'investment'>('living');

  useEffect(() => {
    // 저장된 사용자 이름과 계산기 데이터 불러오기
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    const calculatorDataStr = localStorage.getItem('calculatorData');
    if (calculatorDataStr) {
      const data = JSON.parse(calculatorDataStr) as CalculatorData;
      setCalculatorData(data);

      // 계산 수행
      performCalculation(data);
    } else {
      // 데이터가 없으면 계산기 페이지로 리다이렉트
      router.push('/calculator');
    }
  }, [router]);

  const performCalculation = (data: CalculatorData) => {
    const incomeWon = convertManToWon(data.income);
    const assetsWon = convertManToWon(data.assets);

    // 서울 강남구로 가정하여 정책 플래그 결정 (실제로는 아파트별로 다르게 적용)
    const policyFlags = determinePolicyFlags('서울', '강남구');

    // DSR 40% 고정 (최신 정책)
    const dsrRatio = 40;
    const mockPriceAsking = 1000000000; // 10억원으로 가정 (실제로는 각 아파트의 호가)

    // 실거주 계산 (최신 정책 적용)
    const livingResult = calculateMaxPurchaseWithPolicy20251015(
      incomeWon,
      assetsWon,
      mockPriceAsking,
      policyFlags,
      dsrRatio,
      {
        homeOwnerCount: data.homeOwnerCount,
        isTenant: data.isTenant,
        hasJeonseLoan: data.hasJeonseLoan,
        jeonseLoanPrincipal: data.hasJeonseLoan ? convertManToWon(data.jeonseLoanPrincipal) : 0,
        jeonseLoanRate: data.hasJeonseLoan ? data.jeonseLoanRate : 0,
      }
    );

    // 갭투자 계산
    const investmentResult = calculateMaxPurchaseForInvestment(incomeWon, assetsWon, 50);

    // 갭투자 월 상환액 (신용대출 이자만)
    const creditInterestMonthly = (investmentResult.creditLoan * 0.035) / 12;

    const calculationResult: CalculationResult = {
      living: livingResult,
      investment: {
        ...investmentResult,
        monthlyRepayment: creditInterestMonthly
      },
      policyFlags
    };

    setResult(calculationResult);

    // 결과 저장
    localStorage.setItem('calculationResult', JSON.stringify(calculationResult));
  };

  const formatCurrency = (amount: number) => {
    const eok = Math.floor(amount / 100000000);
    const man = Math.floor((amount % 100000000) / 10000);

    if (eok === 0) {
      return `${man.toLocaleString()}만원`;
    } else if (man === 0) {
      return `${eok.toLocaleString()}억원`;
    } else {
      return `${eok.toLocaleString()}억 ${man.toLocaleString()}만원`;
    }
  };

  const handleGoToFinal = () => {
    // regulation 옵션 저장 후 final 페이지로 이동
    localStorage.setItem('regulationOption', 'latest');
    router.push('/result/final');
  };

  const handleEditCalculator = () => {
    router.push('/calculator');
  };

  if (!calculatorData || !result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-grey-80">계산 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 px-5 pt-6 pb-32">
        {/* 헤더 */}
        <Header
          backUrl="/regulation"
          title="최신 정책 계산 결과"
          rightAction={{
            label: "수정",
            onClick: handleEditCalculator,
            className: "text-primary text-sm font-medium"
          }}
        />

        {/* 안내 메시지 */}
        <div className="mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-blue-800 font-semibold text-sm mb-1">
                  2025.10.15 최신 정책이 반영되었습니다
                </h3>
                <ul className="text-blue-700 text-xs space-y-1">
                  {result.living.policyNotes.map((note, index) => (
                    <li key={index}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex mb-6 bg-grey-40 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('living')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'living'
                ? 'bg-white text-primary shadow-sm'
                : 'text-grey-70 hover:text-grey-100'
            }`}
          >
            실거주
          </button>
          <button
            onClick={() => setActiveTab('investment')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'investment'
                ? 'bg-white text-primary shadow-sm'
                : 'text-grey-70 hover:text-grey-100'
            }`}
          >
            갭투자
          </button>
        </div>

        {/* 결과 카드 */}
        {activeTab === 'living' ? (
          <div className="space-y-4">
            {/* 최대 구매 가능 금액 */}
            <div className="bg-white border border-grey-40 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="text-grey-100 text-lg font-bold mb-2">최대 구매 가능 금액</h3>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(result.living.maxPropertyPrice)}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-grey-40">
                <div className="flex justify-between">
                  <span className="text-grey-80 text-sm">보유자산</span>
                  <span className="text-grey-100 font-semibold">{formatCurrency(convertManToWon(calculatorData.assets))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey-80 text-sm">주택담보대출 한도</span>
                  <span className="text-grey-100 font-semibold">{formatCurrency(result.living.mortgageLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey-80 text-sm">월 상환액</span>
                  <span className="text-grey-100 font-semibold">{formatCurrency(result.living.monthlyRepayment)}</span>
                </div>
              </div>
            </div>

            {/* 정책 적용 상세 */}
            {(result.living.policyApplied.mortgageCapApplied ||
              result.living.policyApplied.stressRateApplied ||
              result.living.policyApplied.jeonseInterestInDsr) && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h4 className="text-orange-800 font-semibold text-sm mb-3">적용된 정책 규제</h4>
                <div className="space-y-2">
                  {result.living.policyApplied.stressRateApplied && (
                    <div className="flex items-center text-orange-700 text-xs">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                      스트레스 DSR 3.0% 적용
                    </div>
                  )}
                  {result.living.policyApplied.mortgageCapApplied && (
                    <div className="flex items-center text-orange-700 text-xs">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                      주담대 한도 캡 적용: {formatCurrency(result.living.policyApplied.mortgageCapAmount!)}
                    </div>
                  )}
                  {result.living.policyApplied.jeonseInterestInDsr && (
                    <div className="flex items-center text-orange-700 text-xs">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                      1주택자 전세대출 이자 DSR 차감
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* 갭투자 최대 구매 가능 금액 */}
            <div className="bg-white border border-grey-40 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="text-grey-100 text-lg font-bold mb-2">최대 구매 가능 금액 (갭투자)</h3>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(result.investment.maxPropertyPrice)}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-grey-40">
                <div className="flex justify-between">
                  <span className="text-grey-80 text-sm">보유자산</span>
                  <span className="text-grey-100 font-semibold">{formatCurrency(convertManToWon(calculatorData.assets))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey-80 text-sm">신용대출 한도</span>
                  <span className="text-grey-100 font-semibold">{formatCurrency(result.investment.creditLoan)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey-80 text-sm">전세보증금 (50%)</span>
                  <span className="text-grey-100 font-semibold">{formatCurrency(result.investment.jeonseDeposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey-80 text-sm">월 이자 상환액</span>
                  <span className="text-grey-100 font-semibold">{formatCurrency(result.investment.monthlyRepayment)}</span>
                </div>
              </div>
            </div>

            {/* 갭투자 주의사항 */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="text-red-800 font-semibold text-sm mb-2">갭투자 주의사항</h4>
              <ul className="text-red-700 text-xs space-y-1">
                <li>• 전세가율 변동 및 공실 위험이 있습니다</li>
                <li>• 신용대출 금리 상승 시 수익성이 악화될 수 있습니다</li>
                <li>• 대출 규제 변동에 따른 리스크를 고려하세요</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 safe-area-inset-bottom">
        <button
          onClick={handleGoToFinal}
          className="flex h-14 w-full justify-center items-center rounded-[300px] bg-primary text-white font-semibold text-base hover:bg-indigo-600 transition"
        >
          자세한 결과 보기
        </button>
      </div>
    </div>
  );
}