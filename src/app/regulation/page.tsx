'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default function RegulationPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(''); // 초기값을 빈 문자열로 설정
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 기존 선택사항이 있다면 불러오기, 없으면 기본값 'new' 설정
    const savedRegulationOption = localStorage.getItem('regulationOption');
    if (savedRegulationOption) {
      setSelectedOption(savedRegulationOption);
    } else {
      setSelectedOption('new'); // 기본값은 6.27 규제안
    }
    
    setIsLoading(false);
  }, []);

  const handleSubmit = () => {
    // 선택사항 저장
    localStorage.setItem('regulationOption', selectedOption);
    
    // 선택에 따라 다른 페이지로 이동
    if (selectedOption === 'existing') {
      // 기존 LTV · DSR 적용하기 선택 시 기존 결과 페이지로
      router.push('/result');
    } else {
      // 6.27 규제안 적용하기 선택 시 새로운 규제 페이지로
      router.push('/result/new-regulation');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 px-5 pt-6 pb-32">
        {/* 헤더 */}
        <Header backUrl="/calculator" />

        {/* 타이틀 */}
        <div className="mb-6">
          <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px]">
            2025년 6월 27일<br />가계부채 관리 강화 방안 안내
          </h1>
        </div>

        {/* 설명 */}
        <div className="mb-8">
          <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px]">
            2025년 6월 28일부터는 수도권 및 규제지역을 중심으로 주택담보대출의 여신 한도를 최대 6억 원으로 제한하고, 대출 만기는 최대 30년까지만 허용해요.
            <br /><br />
            또한, LTV 및 DSR 규제를 강화하고, 생활안정자금 목적의 대출도 제한했어요.
            <br /><br />
            이와 함께, 전세대출에 대한 규제도 강화되어, 보다 엄격한 가계부채 관리 기준이 적용돼요.
          </p>
        </div>

        {/* 선택 옵션들 */}
        <div className="space-y-5">
          {/* 6.27 규제안 적용하기 */}
          <button
            onClick={() => !isLoading && setSelectedOption('new')}
            disabled={isLoading}
            className={`w-full h-14 px-3 flex items-center justify-center rounded-lg border transition-colors ${
              isLoading
                ? 'border-[#868E96] bg-white opacity-50'
                : selectedOption === 'new'
                ? 'border-[#7577FF] bg-white'
                : 'border-[#868E96] bg-white'
            }`}
          >
            <div className="flex justify-between items-center w-full" style={{ minHeight: '24px' }}>
              <span 
                className={`text-base font-bold leading-none tracking-[-0.16px] ${
                  selectedOption === 'new' ? 'text-[#7577FF]' : 'text-[#868E96]'
                }`}
              >
                6.27 규제안 적용하기
              </span>
              {selectedOption === 'new' && (
                <div className="w-6 h-full flex items-center justify-center flex-shrink-0" style={{ marginTop: '6px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M7.2 8.4L9.6 10.8L16.8 3.6" 
                      stroke="#7577FF" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* 기존 LTV · DSR 적용하기 */}
          <button
            onClick={() => !isLoading && setSelectedOption('existing')}
            disabled={isLoading}
            className={`w-full h-14 px-3 flex items-center justify-center rounded-lg border transition-colors ${
              isLoading
                ? 'border-[#868E96] bg-white opacity-50'
                : selectedOption === 'existing'
                ? 'border-[#7577FF] bg-white'
                : 'border-[#868E96] bg-white'
            }`}
          >
            <div className="flex justify-between items-center w-full" style={{ minHeight: '24px' }}>
              <span 
                className={`text-base font-bold leading-none tracking-[-0.16px] ${
                  selectedOption === 'existing' ? 'text-[#7577FF]' : 'text-[#868E96]'
                }`}
              >
                기존 LTV · DSR 적용하기
              </span>
              {selectedOption === 'existing' && (
                <div className="w-6 h-full flex items-center justify-center flex-shrink-0" style={{ marginTop: '4px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M7.2 8.4L9.6 10.8L16.8 3.6" 
                      stroke="#7577FF" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>


      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-5 safe-area-inset-bottom">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !selectedOption}
          className={`flex h-14 w-full justify-center items-center rounded-[300px] font-bold text-lg transition ${
            isLoading || !selectedOption
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#7577FF] text-white hover:bg-indigo-600'
          }`}
        >
          {isLoading ? '로딩 중...' : '다음'}
        </button>
      </div>
    </div>
  );
} 