'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { calculateMaxPurchaseForLiving, calculateMaxPurchaseForInvestment, convertManToWon, calculateMonthlyPayment, calculateMonthlyInterestOnly } from '@/utils/calculator';
import Header from '@/components/Header';
import html2canvas from 'html2canvas';

// 카드 배경 스타일 정의
// const CARD_BACKGROUNDS = [
//   'linear-gradient(180deg, #EEF 0%, #FFF 50%, #EEF 100%)',
//   'linear-gradient(180deg, #FEC69E 0%, #FFF 50%, #FFF0E5 100%)',
//   'linear-gradient(180deg, #A6E9FF 0%, #FFF 50%, #DEF7FF 100%)',
//   'linear-gradient(180deg, #FFE799 0%, #FFF 50%, #FFF5D4 100%)'
// ];

// 가격별 이미지 및 배경 매핑
const HOUSE_STYLES = {
  HIGH_TIER: { // 50억 초과
    image: 'img_house_01.png',
    gradient: 'linear-gradient(180deg, #C6E8FF 0%, #FFF 50%, #C6E8FF 100%)'
  },
  UPPER_MID_TIER_A: { // 19억 초과 ~ 50억 이하
    image: 'img_house_02.png',
    gradient: 'linear-gradient(180deg, #C6E8FF 0%, #FFF 50%, #C6E8FF 100%)'
  },
  UPPER_MID_TIER_B: { // 9억 초과 ~ 19억 이하
    image: 'img_house_03.png',
    gradient: 'linear-gradient(180deg, #EEF 0%, #FFF 50%, #EEF 100%)'
  },
  MID_TIER: { // 3억 초과 ~ 9억 이하
    image: 'img_house_04.png',
    gradient: 'linear-gradient(180deg, #EEF 0%, #FFF 50%, #EEF 100%)'
  },
  LOWER_MID_TIER_A: { // 2억 초과 ~ 3억 이하
    image: 'img_house_05.png',
    gradient: 'linear-gradient(180deg, #FFD9D7 0%, #FFF 50%, #FFD9D7 100%)'
  },
  LOWER_MID_TIER_B: { // 1억 초과 ~ 2억 이하
    image: 'img_house_06.png',
    gradient: 'linear-gradient(180deg, #FFF0CE 0%, #FFF 50%, #FFF0CE 100%)'
  },
  LOW_TIER: { // 1억 이하
    image: 'img_house_07.png',
    gradient: 'linear-gradient(180deg, #FFF0CE 0%, #FFF 50%, #FFF0CE 100%)'
  }
};

// 가격별 이미지 및 배경 반환 함수
const getHouseStyleByPrice = (price: number): { imageName: string; backgroundGradient: string } => {
  // 가격은 만원 단위로 입력됨
  if (price <= 10000) { // 1억 원 이하
    return { imageName: HOUSE_STYLES.LOW_TIER.image, backgroundGradient: HOUSE_STYLES.LOW_TIER.gradient };
  } else if (price <= 20000) { // 1억 1만원~2억 원 사이
    return { imageName: HOUSE_STYLES.LOWER_MID_TIER_B.image, backgroundGradient: HOUSE_STYLES.LOWER_MID_TIER_B.gradient };
  } else if (price <= 30000) { // 2억 1만원~3억 원 사이
    return { imageName: HOUSE_STYLES.LOWER_MID_TIER_A.image, backgroundGradient: HOUSE_STYLES.LOWER_MID_TIER_A.gradient };
  } else if (price <= 90000) { // 3억 1만원~9억 원 사이
    return { imageName: HOUSE_STYLES.MID_TIER.image, backgroundGradient: HOUSE_STYLES.MID_TIER.gradient };
  } else if (price <= 190000) { // 9억 1만원~19억 원 사이
    return { imageName: HOUSE_STYLES.UPPER_MID_TIER_B.image, backgroundGradient: HOUSE_STYLES.UPPER_MID_TIER_B.gradient };
  } else if (price <= 500000) { // 19억 1만원~50억 원 사이
    return { imageName: HOUSE_STYLES.UPPER_MID_TIER_A.image, backgroundGradient: HOUSE_STYLES.UPPER_MID_TIER_A.gradient };
  } else { // 50억 1만원 이상
    return { imageName: HOUSE_STYLES.HIGH_TIER.image, backgroundGradient: HOUSE_STYLES.HIGH_TIER.gradient };
  }
};

export default function FinalResultPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('gap'); // 'gap' 또는 'live'
  
  // 카드 배경 스타일 및 이미지 이름 상태
  const [cardBackground, setCardBackground] = useState(HOUSE_STYLES.LOW_TIER.gradient); // 기본값
  const [currentImageName, setCurrentImageName] = useState(HOUSE_STYLES.LOW_TIER.image); // 기본값
  
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
      creditLoan: 0,
      monthlyRepayment: 0
    },
    investment: {
      maxPropertyPrice: 0,
      creditLoan: 0,
      jeonseDeposit: 0,
      monthlyRepayment: 0
    }
  });
  
  // 현재 활성화된 탭의 가격에 따른 이미지 파일 이름 및 배경 업데이트
  useEffect(() => {
    const price = activeTab === 'gap' 
      ? calculationResult.investment.maxPropertyPrice
      : calculationResult.living.maxPropertyPrice;
    
    if (price > 0) { // 계산 결과가 있고 0보다 클 때만 업데이트
      const style = getHouseStyleByPrice(price);
      setCurrentImageName(style.imageName);
      setCardBackground(style.backgroundGradient);
    } else {
      // 가격 정보가 없거나 0일 경우 기본값 설정 (또는 다른 로직)
      setCurrentImageName(HOUSE_STYLES.LOW_TIER.image);
      setCardBackground(HOUSE_STYLES.LOW_TIER.gradient);
    }
  }, [activeTab, calculationResult]);

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

      // 월 상환액 계산
      // 실거주 시: 원리금균등상환 (40년)
      const livingMonthlyRepayment = calculateMonthlyPayment(livingResult.mortgageLimit, 3.5, 40);
      
      // 갭투자 시: 만기일시상환 (이자만 상환)
      const investmentMonthlyRepayment = calculateMonthlyInterestOnly(investmentResult.creditLoan, 3.5);

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
          creditLoan: Math.round(livingResult.creditLoan / 10000),
          monthlyRepayment: Math.round(livingMonthlyRepayment / 10000) // 만원 단위로 변환
        },
        investment: {
          maxPropertyPrice: Math.round(investmentResult.maxPropertyPrice / 10000),
          creditLoan: Math.round(investmentResult.creditLoan / 10000),
          jeonseDeposit: Math.round(investmentResult.jeonseDeposit / 10000),
          monthlyRepayment: Math.round(investmentMonthlyRepayment / 10000) // 만원 단위로 변환
        }
      });
    }
  }, [loanOptions]);

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
    console.error('Image failed to load:', currentImageName);
    setImageError(true);
  };

  // 이미지 로드 성공 핸들러
  const handleImageLoad = () => {
    console.log('Image loaded successfully:', currentImageName);
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
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-12 relative">
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
      <div className="flex-grow flex flex-col pb-32">
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
        <div className="flex flex-col items-center mb-6">
          <div 
            ref={cardRef}
            className="relative w-[302px] h-[335px] rounded-xl overflow-hidden"
            style={{ background: cardBackground }} // 동적 배경 적용
          >
            {/* 이미지 (카드 위에 겹침) */}
            {!imageError ? (
              <img 
                className="absolute top-0 left-0 w-full h-full object-cover z-10"
                src={`/images/${currentImageName}`} // 동적 이미지 적용
                alt="아파트 이미지"
                onError={handleImageError}
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
              />
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#F8F9FA] z-10">
                <span className="text-grey-60 text-sm">
                  {imageError ? "이미지 로드 실패" : "이미지 로딩 중..."}
                </span>
              </div>
            )}
            
            {/* 텍스트 (이미지 위에 위치) */}
            <div className="absolute top-[30px] left-[30px] right-[30px] z-20 flex flex-col items-start w-[calc(100%-60px)] gap-2">
              {/* 금액 먼저 표시 */}
              <p className="w-full text-left text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px]">
                {activeTab === 'gap' 
                  ? formatToKorean(calculationResult.investment.maxPropertyPrice)
                  : formatToKorean(calculationResult.living.maxPropertyPrice)
                }
              </p>
              
              {/* 닉네임 텍스트 작게 표시 */}
              <p className="w-full text-left text-grey-100 text-sm font-bold leading-5 tracking-[-0.14px]">
                {username} 님이<br />살 수 있는 아파트
              </p>
            </div>
          </div>
        </div>
        
        {/* 자금계획 섹션 (24px 간격으로 변경) */}
        <div className="flex flex-col items-center">
          {/* 최대 금액 정보 */}
          <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA] mb-6 w-[302px]">
            <h2 className="text-black text-[18px] font-bold leading-[26px] tracking-[-0.18px]">
              {activeTab === 'gap' ? '갭투자 시' : '실거주 시'}
            </h2>
            <p className="text-black text-[22px] font-bold leading-7 tracking-[-0.22px]">
              최대 {formatToKorean(
                activeTab === 'gap' 
                  ? calculationResult.investment.maxPropertyPrice 
                  : calculationResult.living.maxPropertyPrice
              )}
            </p>
            <p className="text-[#495057] text-sm font-normal leading-5 tracking-[-0.28px]">
              {activeTab === 'gap' 
                ? '세입자의 전세금을 활용해 투자해요' 
                : '주택 가격의 70%까지 대출받을 수 있어요'}
            </p>
          </div>

          {activeTab === 'gap' ? (
            <>
              {/* 신용대출 섹션 - 갭투자 시 */}
              <div className="mb-6 w-[302px]">
                <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                  신용대출
                </h3>
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      연소득의 120%
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatToKorean(calculationResult.investment.creditLoan)}
                    </p>
                  </div>
                  <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                    금리 3.5% 기준이에요
                  </p>
                </div>
              </div>

              {/* 월 상환액 섹션 - 갭투자 시 */}
              <div className="mb-6 w-[302px]">
                <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                  월 상환액 (이자)
                </h3>
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      1년 만기
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatToKorean(calculationResult.investment.monthlyRepayment)}
                    </p>
                  </div>
                  <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                    이자만 내며 매년 연장하는 만기일시상환 기준이에요
                  </p>
                </div>
              </div>

              {/* 전세금 섹션 - 갭투자 시 */}
              <div className="mb-6 w-[302px]">
                <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                  전세금
                </h3>
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      전세가율 60%
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatToKorean(calculationResult.investment.jeonseDeposit)}
                    </p>
                  </div>
                  <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                    서울 아파트 평균 전세가율이에요
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* DSR 섹션 - 실거주 시 */}
              <div className="mb-6 w-[302px]">
                <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                  DSR (총부채원리금상환비율)
                </h3>
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      {loanOptions.dsr}% 기준
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      최대 {formatToKorean(calculationResult.living.mortgageLimit)}
                    </p>
                  </div>
                  <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                    주택담보대출+신용대출
                  </p>
                </div>
              </div>

              {/* 주택담보대출 섹션 - 실거주 시 */}
              <div className="mb-6 w-[302px]">
                <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                  주택담보대출
                </h3>
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      40년 만기
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatToKorean(calculationResult.living.mortgageLimit)}
                    </p>
                  </div>
                  <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                    금리 3.5% 기준이에요
                  </p>
                </div>
              </div>

              {/* 월 상환액 섹션 - 실거주 시 */}
              <div className="mb-6 w-[302px]">
                <h3 className="text-[#212529] text-base font-bold leading-6 tracking-[-0.16px] mb-2">
                  월 상환액 (원금+이자)
                </h3>
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F8F9FA]">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#495057] text-[15px] font-normal leading-[22px] tracking-[-0.3px]">
                      40년 만기
                    </p>
                    <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                      {formatToKorean(calculationResult.living.monthlyRepayment)}
                    </p>
                  </div>
                  <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                    원금과 이자를 함께 갚는 원리금균등상환 기준이에요
                  </p>
                </div>
              </div>
            </>
          )}

          {/* 보유자산 섹션 - 공통 */}
          <div className="mb-6 w-[302px]">
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

        {/* 자금계획 버튼 제거 (내용을 직접 표시하므로) */}
      </div>

      {/* 하단 버튼 영역 - 하단 고정 및 그라데이션 배경 적용 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center">
        <div 
          className="flex w-[360px] px-5 pt-10 pb-12 gap-3 items-center"
          style={{ 
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 31.25%)'
          }}
        >
          <button
            className="flex-1 h-14 justify-center items-center gap-2.5 flex border border-[#ADB5BD] rounded-[300px] text-grey-100 font-medium"
            onClick={handleSaveCard}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '카드 저장'}
          </button>
          <button
            className="flex-1 h-14 justify-center items-center gap-2.5 flex bg-[#7577FF] text-white rounded-[300px] font-semibold"
          >
            공유하기
          </button>
        </div>
      </div>
    </div>
  );
} 