'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

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
    
    // 저장된 LTV, DSR 옵션 가져오기
    const loanOptionsStr = localStorage.getItem('loanOptions');
    if (loanOptionsStr) {
      const loanOptions = JSON.parse(loanOptionsStr);
      if (loanOptions.ltv) {
        setSelectedLTV(loanOptions.ltv);
      }
      if (loanOptions.dsr) {
        setSelectedDSR(loanOptions.dsr);
      }
    }
  }, []);

  // DSR 선택 시 즉시 저장
  useEffect(() => {
    // 선택된 LTV, DSR 값을 저장
    localStorage.setItem('loanOptions', JSON.stringify({
      ltv: selectedLTV,
      dsr: selectedDSR
    }));
  }, [selectedLTV, selectedDSR]);

  const handleSubmit = () => {
    // 선택된 값이 이미 저장되어 있으므로 바로 결과 페이지로 이동
    router.push('/result/loading');
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-4">
      {/* 헤더 컴포넌트 사용 */}
      <Header backUrl="/calculator" />

      {/* 타이틀 */}
      <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
        실거주 시 받을 수 있는 대출을<br />확인해요
      </h1>

        {/* 선택 옵션들 */}
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
          
          {/* 스트레스 DSR 3단계 안내 */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-800 text-sm font-bold leading-5 mb-1">
                  스트레스 DSR 3단계 시행 안내
                </h3>
                <div className="text-blue-700 text-xs leading-4 space-y-1">
                  <p><strong>시행일:</strong> 2025년 7월 1일부터</p>
                  <p><strong>변경사항:</strong> DSR 계산 시 스트레스 금리 추가 적용</p>
                  <p><strong>영향:</strong> 수도권 1.5%, 지방 0.75% 금리 가산으로 대출한도 감소</p>
                  <p className="text-blue-600 text-xs">※ 실제 대출금리는 변경되지 않으며, 한도 계산시만 적용됩니다.</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5">
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