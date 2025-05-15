'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { calculateMaxPurchaseForLiving, calculateMaxPurchaseForInvestment, convertManToWon } from '@/utils/calculator';
import Header from '@/components/Header';
import html2canvas from 'html2canvas';

// 카드 스타일 정의
const CARD_STYLES = [
  {
    id: 1,
    imageName: 'img_purple.png',
    background: 'linear-gradient(180deg, #EEF 0%, #FFF 50%, #EEF 100%)'
  },
  {
    id: 2,
    imageName: 'img_orange.png',
    background: 'linear-gradient(180deg, #FEC69E 0%, #FFF 50%, #FFF0E5 100%)'
  },
  {
    id: 3,
    imageName: 'img_blue.png',
    background: 'linear-gradient(180deg, #A6E9FF 0%, #FFF 50%, #DEF7FF 100%)'
  },
  {
    id: 4,
    imageName: 'img_yellow.png',
    background: 'linear-gradient(180deg, #FFE799 0%, #FFF 50%, #FFF5D4 100%)'
  }
];

export default function FinalResultPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('gap'); // 'gap' 또는 'live'
  
  // 각 탭별 카드 상태 관리
  const [gapCard, setGapCard] = useState<typeof CARD_STYLES[0] | null>(null);
  const [liveCard, setLiveCard] = useState<typeof CARD_STYLES[0] | null>(null);
  
  const [imageError, setImageError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 카드 요소에 대한 ref 추가
  const cardRef = useRef<HTMLDivElement>(null);

  const [loanOptions, setLoanOptions] = useState({
    ltv: 70,
    dsr: 40
  });
  const [calculationResult, setCalculationResult] = useState({
    income: 0,
    assets: 0,
    spouseIncome: 0,
    living: {
      maxPropertyPrice: 0,
      mortgageLimit: 0,
      creditLoan: 0
    },
    investment: {
      maxPropertyPrice: 0,
      creditLoan: 0,
      jeonseDeposit: 0
    }
  });
  
  // 계산 업데이트 여부 추적
  const [calculationUpdated, setCalculationUpdated] = useState(false);

  // 현재 활성화된 탭에 따라 선택된 카드 반환
  const getActiveCard = () => {
    return activeTab === 'gap' ? gapCard : liveCard;
  };

  // 랜덤 카드 선택 함수
  const selectRandomCard = (forTab: 'gap' | 'live') => {
    // 이미 선택된 다른 탭의 카드와 다른 카드 선택
    const otherTabCard = forTab === 'gap' ? liveCard : gapCard;
    
    let availableCards = [...CARD_STYLES];
    if (otherTabCard) {
      // 다른 탭에서 이미 선택된 카드를 제외
      availableCards = CARD_STYLES.filter(card => card.id !== otherTabCard.id);
    }
    
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const newCard = availableCards[randomIndex];
    
    if (forTab === 'gap') {
      setGapCard(newCard);
    } else {
      setLiveCard(newCard);
    }
    
    console.log(`Selected new card for ${forTab}:`, newCard);
    return newCard;
  };

  // 계산 데이터가 업데이트될 때마다 새로운 카드 선택
  useEffect(() => {
    if (calculationUpdated) {
      console.log('Calculation updated, selecting new cards');
      selectRandomCard('gap');
      selectRandomCard('live');
      setCalculationUpdated(false);
    }
  }, [calculationUpdated]);

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
      
      // 만 원 단위로 저장된 값을 원 단위로 변환
      const income = convertManToWon(calculatorData.income);
      const assets = convertManToWon(calculatorData.assets);
      const spouseIncome = convertManToWon(calculatorData.spouseIncome || 0);
      const totalIncome = income + spouseIncome;
      
      // 실거주 시나리오 계산
      const livingResult = calculateMaxPurchaseForLiving(
        totalIncome, 
        assets, 
        loanOptions.dsr, 
        3.5, // 금리 3.5%
        40,  // 대출 기간 40년
        loanOptions.ltv
      );
      
      // 갭투자 시나리오 계산
      const investmentResult = calculateMaxPurchaseForInvestment(
        totalIncome,
        assets,
        60 // 전세가율 60%
      );

      // 디버깅용 로그
      console.log('DSR 값:', loanOptions.dsr);
      console.log('연소득:', totalIncome);
      console.log('자산:', assets);
      console.log('실거주 최대 구매가능 금액:', livingResult.maxPropertyPrice);
      console.log('주택담보대출 한도:', livingResult.mortgageLimit);
      console.log('LTV로 계산한 최대 주택가격:', livingResult.mortgageLimit / (loanOptions.ltv / 100));
      
      setCalculationResult({
        income: calculatorData.income,
        assets: calculatorData.assets,
        spouseIncome: calculatorData.spouseIncome || 0,
        living: {
          maxPropertyPrice: Math.round(livingResult.maxPropertyPrice / 10000), // 만원 단위로 변환
          mortgageLimit: Math.round(livingResult.mortgageLimit / 10000),
          creditLoan: Math.round(livingResult.creditLoan / 10000)
        },
        investment: {
          maxPropertyPrice: Math.round(investmentResult.maxPropertyPrice / 10000),
          creditLoan: Math.round(investmentResult.creditLoan / 10000),
          jeonseDeposit: Math.round(investmentResult.jeonseDeposit / 10000)
        }
      });
      
      // 계산이 완료되면 새로운 카드를 선택하도록 플래그 설정
      setCalculationUpdated(true);
    }
  }, [loanOptions]);

  // 컴포넌트가 처음 마운트될 때 카드 초기화 (if no cards selected yet)
  useEffect(() => {
    if (!gapCard) {
      selectRandomCard('gap');
    }
    if (!liveCard) {
      selectRandomCard('live');
    }
  }, []);

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

  // 소득·자산 수정 버튼 핸들러
  const handleEditIncome = () => {
    router.push('/calculator');
  };

  // 이미지 로드 에러 핸들러
  const handleImageError = () => {
    const activeCard = getActiveCard();
    console.error('Image failed to load:', activeCard?.imageName);
    setImageError(true);
  };

  // 이미지 로드 성공 핸들러
  const handleImageLoad = () => {
    const activeCard = getActiveCard();
    console.log('Image loaded successfully:', activeCard?.imageName);
    setImageError(false);
  };

  // 카드 저장 함수
  const handleSaveCard = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsSaving(true);
      
      // 카드 엘리먼트의 스크린샷 캡처
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,  // 해상도 2배로 향상
        logging: false,
        useCORS: true  // 외부 이미지 로드를 위해
      });
      
      // 캔버스를 데이터 URL로 변환
      const dataUrl = canvas.toDataURL('image/png');
      
      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${username}_${activeTab === 'gap' ? '갭투자' : '실거주'}_카드.png`;
      document.body.appendChild(link);
      
      // 다운로드 링크 클릭 후 제거
      link.click();
      document.body.removeChild(link);
      
      // 저장 완료 메시지 표시 (선택 사항)
      alert('카드가 저장되었습니다.');
    } catch (error) {
      console.error('카드 저장 중 오류 발생:', error);
      alert('카드 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-12">
      {/* 헤더 - 뒤로가기 버튼과 수정 버튼 */}
      <Header 
        backUrl="/result" 
        rightAction={{
          label: "소득·자산 수정",
          onClick: handleEditIncome,
          className: "flex px-[10px] py-2 justify-center items-center gap-2.5 rounded-[4px] bg-[#F1F3F5]"
        }}
      />

      {/* 컨텐츠 영역 - flex-grow를 사용해 공간 확보 */}
      <div className="flex-grow flex flex-col">
        {/* 타이틀 */}
        <h1 className="text-[24px] font-bold leading-8 tracking-[-0.24px] mb-8">
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
          <div 
            ref={cardRef}
            className="w-[302px] p-[40px_0px] flex flex-col justify-center items-center rounded-xl"
            style={{ background: getActiveCard()?.background || 'linear-gradient(180deg, #EEF 0%, #FFF 50%, #EEF 100%)' }}
          >
            <p className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] text-center mb-4">
              {username} 님의 연봉과 자산으로<br />살 수 있는 아파트는
            </p>
            
            {/* 이미지 컨테이너 */}
            <div className="w-[274px] h-[190px] mb-2 flex items-center justify-center relative">
              {getActiveCard() && !imageError ? (
                <div data-property-1="Group 12" style={{width: '100%', height: '100%', position: 'relative'}}>
                  <div style={{width: 274, height: 190, left: 0, top: 0, position: 'absolute'}} />
                  <img 
                    style={{
                      width: 'calc(100% - 28px)', 
                      maxHeight: '100%', 
                      left: 14, 
                      top: 0, 
                      position: 'absolute',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      display: 'block',
                      margin: 'auto'
                    }} 
                    src={`/images/${getActiveCard()?.imageName}`}
                    alt="아파트 이미지"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-[#F8F9FA] rounded-md">
                  <span className="text-grey-60 text-sm">
                    {imageError ? "이미지 로드 실패" : "이미지 로딩 중..."}
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-grey-80 text-base font-medium leading-6 tracking-[-0.32px] text-center">
              {activeTab === 'gap' ? '갭투자 시' : '실거주 시'}
            </p>
            
            <p className="text-grey-100 text-[24px] font-bold leading-8 tracking-[-0.24px] text-center mb-6">
              {activeTab === 'gap' 
                ? formatToKorean(calculationResult.investment.maxPropertyPrice)
                : formatToKorean(calculationResult.living.maxPropertyPrice)
              }
            </p>
          </div>
        </div>
        
        {/* 자금계획 버튼을 카드 밖으로 이동 */}
        <button 
          onClick={() => window.location.href = `/result/plan?mode=${activeTab}`}
          className="flex w-full mt-6 px-5 py-4 justify-between items-center border border-[#E9ECEF] rounded-lg"
        >
          <span className="text-[#495057] text-base font-medium leading-6">
            자금계획
          </span>
          <div className="relative w-4 h-4 overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 3.33325L10.6667 7.99992L6 12.6666" stroke="#ADB5BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>

      {/* 하단 버튼 영역 - mt-auto 제거하고 명시적으로 padding 추가 */}
      <div className="grid grid-cols-2 gap-3 pt-8 mt-auto">
        <button
          className="flex h-14 justify-center items-center gap-2.5 border border-[#ADB5BD] rounded-[300px] text-grey-100 font-medium"
          onClick={handleSaveCard}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '카드 저장'}
        </button>
        <button
          className="flex h-14 justify-center items-center gap-2.5 bg-[#7577FF] text-white rounded-[300px] font-semibold"
        >
          공유하기
        </button>
      </div>
    </div>
  );
} 