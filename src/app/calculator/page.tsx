'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default function CalculatorPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [income, setIncome] = useState('');
  const [assets, setAssets] = useState('');
  const [showSpouseIncome, setShowSpouseIncome] = useState(false);
  const [spouseIncome, setSpouseIncome] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 저장된 계산기 데이터 가져오기
    const calculatorDataStr = localStorage.getItem('calculatorData');
    if (calculatorDataStr) {
      const calculatorData = JSON.parse(calculatorDataStr);
      
      // 저장된 값이 있으면 폼에 채우기
      if (calculatorData.income) {
        setIncome(calculatorData.income.toString());
      }
      
      if (calculatorData.assets) {
        setAssets(calculatorData.assets.toString());
      }
      
      if (calculatorData.spouseIncome) {
        setSpouseIncome(calculatorData.spouseIncome.toString());
        setShowSpouseIncome(true);
      }
    }
  }, []);

  // 숫자를 한글 표기로 변환 (예: 12000 -> 1억 2,000만 원)
  const formatToKorean = (num: string) => {
    if (!num || num === '0') return '';
    
    const parsed = parseInt(num, 10);
    if (isNaN(parsed)) return '';
    
    if (parsed < 10000) {
      return `${parsed.toLocaleString()}만 원`;
    } else {
      const eok = Math.floor(parsed / 10000);
      const man = parsed % 10000;
      
      if (man === 0) {
        return `${eok.toLocaleString()}억 원`;
      } else {
        return `${eok.toLocaleString()}억 ${man.toLocaleString()}만 원`;
      }
    }
  };

  // 숫자만 입력 가능하도록 처리
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    // 숫자만 허용 (빈 문자열도 허용)
    if (value === '' || /^[0-9]+$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 저장
    const calculatorData = {
      income: parseInt(income || '0'),
      assets: parseInt(assets || '0'),
      spouseIncome: showSpouseIncome ? parseInt(spouseIncome || '0') : 0
    };
    
    localStorage.setItem('calculatorData', JSON.stringify(calculatorData));
    router.push('/result');
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-4 overflow-y-auto">
      {/* 헤더 사용 */}
      <Header backUrl="/nickname" />

      {/* 타이틀 */}
      <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-10">
        내 연 소득과 현재 보유자산이<br />얼마인가요?
      </h1>

        {/* 입력 필드들 */}
        <div className="space-y-6">
          {/* 연소득 입력 */}
          <div>
            <label htmlFor="income" className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              연소득 (만 원)
            </label>
            <div className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
              focusedField === 'income' ? 'border-2 border-primary' : 'border border-grey-40'
            }`}>
              <input
                id="income"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={income}
                onChange={(e) => handleNumberInput(e, setIncome)}
                onFocus={() => setFocusedField('income')}
                onBlur={() => setFocusedField(null)}
                placeholder="0"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium leading-[18px] tracking-[-0.26px] whitespace-nowrap">만 원</span>
            </div>
            {income && (
              <p className="text-primary text-[13px] font-medium leading-[18px] tracking-[-0.26px] mt-1">
                {formatToKorean(income)}
              </p>
            )}
          </div>

          {/* 현재 보유자산 입력 */}
          <div>
            <label htmlFor="assets" className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2">
              현재 보유자산 (만 원)
            </label>
            <div className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
              focusedField === 'assets' ? 'border-2 border-primary' : 'border border-grey-40'
            }`}>
              <input
                id="assets"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={assets}
                onChange={(e) => handleNumberInput(e, setAssets)}
                onFocus={() => setFocusedField('assets')}
                onBlur={() => setFocusedField(null)}
                placeholder="0"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium leading-[18px] tracking-[-0.26px] whitespace-nowrap">만 원</span>
            </div>
            {assets && (
              <p className="text-primary text-[13px] font-medium leading-[18px] tracking-[-0.26px] mt-1">
                {formatToKorean(assets)}
              </p>
            )}
          </div>

          {/* 배우자 소득 추가/표시 */}
          {!showSpouseIncome ? (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => setShowSpouseIncome(true)}
                className="flex px-4 py-2.5 justify-center items-center gap-2.5 rounded-[300px] border border-grey-40 text-grey-80 text-[15px] font-medium leading-[22px]"
              >
                배우자 소득도 추가할게요
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <label htmlFor="spouseIncome" className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                배우자 연소득 (만 원)
              </label>
              <div className="flex items-center gap-2">
                <div className={`flex flex-1 h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                  focusedField === 'spouseIncome' ? 'border-2 border-primary' : 'border border-grey-40'
                }`}>
                  <input
                    id="spouseIncome"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={spouseIncome}
                    onChange={(e) => handleNumberInput(e, setSpouseIncome)}
                    onFocus={() => setFocusedField('spouseIncome')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0"
                    className="w-full h-full outline-none text-grey-100 text-base"
                  />
                  <span className="text-grey-70 text-sm font-medium leading-[18px] tracking-[-0.26px] whitespace-nowrap">만 원</span>
                </div>
              </div>
              
              {/* 파란색 금액 표시를 입력 필드 바로 아래로 이동 */}
              {spouseIncome && (
                <p className="text-primary text-[13px] font-medium leading-[18px] tracking-[-0.26px] mt-1">
                  {formatToKorean(spouseIncome)}
                </p>
              )}
              
              {/* 배우자 소득 삭제 버튼은 제일 아래에 위치 */}
              <div className="mt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpouseIncome(false);
                    setSpouseIncome('');
                  }}
                  className="flex px-3 py-2.5 justify-center items-center rounded-[300px] border border-grey-40"
                >
                  <span className="text-grey-80 text-[13px] font-medium leading-[18px] tracking-[-0.26px]">
                    배우자 소득 삭제
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
        </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5">
          <button
          onClick={handleSubmit}
            disabled={!income.trim() || !assets.trim()}
            className={`flex h-14 w-full justify-center items-center rounded-[300px] font-semibold text-base transition ${
              income.trim() && assets.trim()
                ? 'bg-primary text-white hover:bg-indigo-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
    </div>
  );
} 