'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [selectedLTV, setSelectedLTV] = useState(70);
  const [selectedDSR, setSelectedDSR] = useState(40);
  const [calculatorData, setCalculatorData] = useState({
    income: 0,
    assets: 0,
    spouseIncome: 0
  });

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 계산 데이터 가져오기
    const calculatorDataStr = localStorage.getItem('calculatorData');
    if (calculatorDataStr) {
      setCalculatorData(JSON.parse(calculatorDataStr));
    }
  }, []);

  const handleSubmit = () => {
    // 선택된 LTV, DSR 값을 저장
    localStorage.setItem('loanOptions', JSON.stringify({
      ltv: selectedLTV,
      dsr: selectedDSR
    }));
    
    // 로딩 페이지로 이동
    router.push('/result/loading');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-[72px]">
      {/* 타이틀 */}
      <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
        실거주 시 받을 수 있는 대출을<br />확인해요
      </h1>

      <div className="space-y-8">
        {/* LTV 섹션 */}
        <div>
          <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
            LTV (주택담보대출비율)
          </h2>
          <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
            주택 가격 대비 대출 가능한 금액의 비율이에요.
          </p>
          <div className="flex space-x-2">
            <button
              className={`flex w-16 px-4 py-2.5 justify-center items-center rounded-[300px] ${
                selectedLTV === 70 
                  ? 'bg-[#7577FF] text-white' 
                  : 'border border-grey-40 bg-white text-grey-100'
              }`}
              onClick={() => setSelectedLTV(70)}
            >
              <span className="text-sm font-medium leading-5 tracking-[-0.14px]">70%</span>
            </button>
          </div>
        </div>

        {/* DSR 섹션 */}
        <div>
          <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
            DSR (총부채원리금상환비율)
          </h2>
          <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
            1금융권은 연소득의 40%, 2금융권은 연소득의 50%까지 대출을 받을 수 있어요.
          </p>
          <div className="flex space-x-2">
            <button
              className={`flex w-16 px-4 py-2.5 justify-center items-center rounded-[300px] ${
                selectedDSR === 40 
                  ? 'bg-[#7577FF] text-white' 
                  : 'border border-grey-40 bg-white text-grey-100'
              }`}
              onClick={() => setSelectedDSR(40)}
            >
              <span className="text-sm font-medium leading-5 tracking-[-0.14px]">40%</span>
            </button>
            <button
              className={`flex w-16 px-4 py-2.5 justify-center items-center rounded-[300px] ${
                selectedDSR === 50 
                  ? 'bg-[#7577FF] text-white' 
                  : 'border border-grey-40 bg-white text-grey-100'
              }`}
              onClick={() => setSelectedDSR(50)}
            >
              <span className="text-sm font-medium leading-5 tracking-[-0.14px]">50%</span>
            </button>
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto pb-5">
        <button
          onClick={handleSubmit}
          className="flex h-14 w-full justify-center items-center rounded-[300px] bg-primary text-white font-semibold text-base"
        >
          다음
        </button>
      </div>
    </div>
  );
} 