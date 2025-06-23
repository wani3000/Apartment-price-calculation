'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { calculateMaxPurchaseForLiving, calculateMaxPurchaseForLivingWithStressDSR, calculateMaxPurchaseForInvestment, convertManToWon, calculateMonthlyPayment, calculateMonthlyInterestOnly } from '@/utils/calculator';
import Header from '@/components/Header';
import html2canvas from 'html2canvas';
import { shareContent, getResultShareData } from '@/utils/share';
import AdSense from '@/components/AdSense';

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
    image: 'img_house_04.png',
    gradient: 'linear-gradient(180deg, #FFF0CE 0%, #FFF 50%, #FFF0CE 100%)'
  },
  LOW_TIER: { // 1억 이하
    image: 'img_house_05.png',
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

export default function FinalResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('live'); // 'gap' 또는 'live'
  const [sharedCalculationData, setSharedCalculationData] = useState<{
    income: number;
    assets: number;
    spouseIncome: number;
    ltv: number;
    dsr: number;
  } | null>(null);

  
  // 공유받은 링크인지 확인
  const isSharedLink = searchParams.get('shared') === 'true';
  
  // 디버깅용 로그
  useEffect(() => {
    console.log('isSharedLink:', isSharedLink);
    console.log('searchParams.get("shared"):', searchParams.get('shared'));
  }, [isSharedLink, searchParams]);
  
  // 카드 배경 스타일 및 이미지 이름 상태
  const [gapImageName, setGapImageName] = useState('img_house_01.png'); // 갭투자용 이미지
  const [liveImageName, setLiveImageName] = useState('img_house_02.png'); // 실거주용 이미지
  
  const [imageError, setImageError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 카드 요소에 대한 ref 추가
  const cardRef = useRef<HTMLDivElement>(null);

  // 계산 수행 공통 함수 (공유 링크용, 이미 원 단위로 받음)
  const performCalculation = (data: { income: number; assets: number; spouseIncome: number; ltv: number; dsr: number }) => {
    const { income, assets, spouseIncome, ltv, dsr } = data;
    const totalIncome = income + spouseIncome;
    
    // 실거주 시나리오 계산
    const livingResult = calculateMaxPurchaseForLiving(
      totalIncome, 
      assets, 
      dsr, 
      3.5, // 금리 3.5%
      40,  // 대출 기간 40년
      ltv
    );
    
    // 스트레스 DSR 3단계 계산 (수도권)
    const stressCapitalResult = calculateMaxPurchaseForLivingWithStressDSR(
      totalIncome,
      assets,
      dsr,
      true, // 수도권
      3.5,
      40,
      ltv
    );
    
    // 스트레스 DSR 3단계 계산 (지방)
    const stressLocalResult = calculateMaxPurchaseForLivingWithStressDSR(
      totalIncome,
      assets,
      dsr,
      false, // 지방
      3.5,
      40,
      ltv
    );
    
    // 갭투자 시나리오 계산
    const investmentResult = calculateMaxPurchaseForInvestment(
      totalIncome,
      assets,
      60 // 전세가율 60%
    );

    // 월 상환액 계산
    const livingMonthlyRepayment = calculateMonthlyPayment(livingResult.mortgageLimit, 3.5, 40);
    const investmentMonthlyRepayment = calculateMonthlyInterestOnly(investmentResult.creditLoan, 3.5);

    // 계산 결과 업데이트 (만원 단위로 변환)
    const newResult = {
      income: Math.round(income / 10000),
      assets: Math.round(assets / 10000),
      spouseIncome: Math.round(spouseIncome / 10000),
      living: {
        maxPropertyPrice: Math.round(livingResult.maxPropertyPrice / 10000),
        mortgageLimit: Math.round(livingResult.mortgageLimit / 10000),
        creditLoan: Math.round(livingResult.creditLoan / 10000),
        monthlyRepayment: Math.round(livingMonthlyRepayment / 10000)
      },
      investment: {
        maxPropertyPrice: Math.round(investmentResult.maxPropertyPrice / 10000),
        creditLoan: Math.round(investmentResult.creditLoan / 10000),
        jeonseDeposit: Math.round(investmentResult.jeonseDeposit / 10000),
        monthlyRepayment: Math.round(investmentMonthlyRepayment / 10000)
      }
    };
    
    setCalculationResult(newResult);
    
    // 스트레스 DSR 월 상환액 계산
    const stressCapitalMonthlyRepayment = calculateMonthlyPayment(stressCapitalResult.mortgageLimit, stressCapitalResult.effectiveRate, 40);
    const stressLocalMonthlyRepayment = calculateMonthlyPayment(stressLocalResult.mortgageLimit, stressLocalResult.effectiveRate, 40);

    // 스트레스 DSR 결과 저장 (만원 단위로 변환)
    setStressDSRResult({
      capital: {
        mortgageLimit: Math.round(stressCapitalResult.mortgageLimit / 10000),
        maxPropertyPrice: Math.round(stressCapitalResult.maxPropertyPrice / 10000),
        monthlyRepayment: Math.round(stressCapitalMonthlyRepayment / 10000)
      },
      local: {
        mortgageLimit: Math.round(stressLocalResult.mortgageLimit / 10000),
        maxPropertyPrice: Math.round(stressLocalResult.maxPropertyPrice / 10000),
        monthlyRepayment: Math.round(stressLocalMonthlyRepayment / 10000)
      }
    });
    
    setIsCalculated(true);
  };

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

  const [stressDSRResult, setStressDSRResult] = useState({
    capital: {
      mortgageLimit: 0,
      maxPropertyPrice: 0,
      monthlyRepayment: 0
    },
    local: {
      mortgageLimit: 0,
      maxPropertyPrice: 0,
      monthlyRepayment: 0
    }
  });

  const [isCalculated, setIsCalculated] = useState(false);

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    if (isSharedLink) {
      // 공유받은 링크인 경우 URL 파라미터에서 데이터 추출
      const urlUsername = searchParams.get('username');
      const urlIncome = searchParams.get('income');
      const urlAssets = searchParams.get('assets');
      const urlSpouseIncome = searchParams.get('spouseIncome');
      const urlLtv = searchParams.get('ltv');
      const urlDsr = searchParams.get('dsr');

      if (urlUsername && urlIncome && urlAssets) {
        setUsername(decodeURIComponent(urlUsername));
        
        const calculationData = {
          income: parseInt(urlIncome, 10),
          assets: parseInt(urlAssets, 10),
          spouseIncome: parseInt(urlSpouseIncome || '0', 10),
          ltv: parseInt(urlLtv || '70', 10),
          dsr: parseInt(urlDsr || '40', 10)
        };
        
        setSharedCalculationData(calculationData);
        setLoanOptions({
          ltv: calculationData.ltv,
          dsr: calculationData.dsr
        });
        
        // 계산 수행
        performCalculation(calculationData);
      }
    } else {
      // 일반적인 경우 로컬 스토리지에서 데이터 가져오기
      const savedUsername = localStorage.getItem('username');
      const calculatorDataStr = localStorage.getItem('calculatorData');
      
      if (savedUsername && calculatorDataStr) {
        setUsername(savedUsername);
        const calculatorData = JSON.parse(calculatorDataStr);
        
        // 원 단위를 만원 단위로 변환하여 계산 수행
        const calculationData = {
          income: calculatorData.income * 10000, // 만원 -> 원
          assets: calculatorData.assets * 10000, // 만원 -> 원
          spouseIncome: calculatorData.spouseIncome * 10000, // 만원 -> 원
          ltv: 70,
          dsr: 40
        };
        
        performCalculation(calculationData);
      } else {
        // 데이터가 없으면 홈으로 이동
        router.push('/');
      }
    }
  }, [isSharedLink, searchParams, router]);

  // 이미지 이름 설정 (계산 완료 후 실행)
  useEffect(() => {
    if (isCalculated) {
      // 갭투자 이미지 설정
      const gapStyle = getHouseStyleByPrice(calculationResult.investment.maxPropertyPrice);
      setGapImageName(gapStyle.imageName);
      
      // 실거주 이미지 설정 (스트레스 DSR 기준)
      const liveStyle = getHouseStyleByPrice(stressDSRResult.capital.maxPropertyPrice);
      setLiveImageName(liveStyle.imageName);
    }
  }, [isCalculated, calculationResult, stressDSRResult]);

  // 숫자를 한글 표기로 변환 (예: 12000 -> 1억 2,000만 원)
  const formatToKorean = (num: number) => {
    if (!num || num === 0) return '0원';
    
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

  // 소득·자산 수정 핸들러
  const handleEditIncome = () => {
    router.push('/calculator');
  };

  // 이미지 에러 핸들러
  const handleImageError = () => {
    console.log('이미지 로드 실패');
    setImageError(true);
  };

  // 이미지 로드 핸들러
  const handleImageLoad = () => {
    console.log('이미지 로드 성공');
    setImageError(false);
  };

  // 카드 저장 핸들러
  const handleSaveCard = async () => {
    if (!cardRef.current || isSaving) return;
    
    setIsSaving(true);
    
    try {
      // 카드 요소를 캔버스로 변환
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#DFECFF', // 카드 배경색 설정
        scale: 2, // 고해상도를 위한 스케일 설정
        width: 298,
        height: 380,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // 클론된 문서에서 이미지 요소들을 찾아 crossOrigin 속성 설정
          const images = clonedDoc.querySelectorAll('img');
          images.forEach((img) => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      // 캔버스를 이미지로 변환
      canvas.toBlob((blob) => {
        if (blob) {
          // 모바일 환경 감지
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          if (isMobile) {
            // 모바일: 새 탭에서 이미지 열기
            const url = URL.createObjectURL(blob);
            const newWindow = window.open(url, '_blank');
            
            if (!newWindow) {
              // 팝업이 차단된 경우 fallback
              fallbackDownload(canvas);
            }
          } else {
            // 데스크톱: 파일 다운로드
            fallbackDownload(canvas);
          }
        }
        setIsSaving(false);
      }, 'image/png', 0.9);

    } catch (error) {
      console.error('카드 저장 오류:', error);
      setIsSaving(false);
      alert('카드 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // Fallback 다운로드 함수
  const fallbackDownload = (canvas: HTMLCanvasElement) => {
    try {
      const link = document.createElement('a');
      link.download = `${username}_아파트_계산결과.png`;
      link.href = canvas.toDataURL('image/png');
      
      // 임시로 DOM에 추가하고 클릭 후 제거
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Fallback 다운로드 실패:', error);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  // 공유하기 핸들러
  const handleShare = async () => {
    try {
      const amount = formatToKorean(
        activeTab === 'gap' 
          ? calculationResult.investment.maxPropertyPrice
          : calculationResult.living.maxPropertyPrice
      );
      const type = activeTab === 'gap' ? '갭투자' : '실거주';
      
      // 상세 정보 포함한 공유 데이터 생성
      const currentUrl = new URL(window.location.origin + '/result/final');
      currentUrl.searchParams.set('shared', 'true');
      currentUrl.searchParams.set('username', encodeURIComponent(username));
      currentUrl.searchParams.set('amount', encodeURIComponent(amount));
      currentUrl.searchParams.set('type', type === '갭투자' ? 'gap' : 'live');
      
      // 계산에 필요한 원본 데이터도 URL에 포함 (만원 단위를 원 단위로 변환)
      currentUrl.searchParams.set('income', (calculationResult.income * 10000).toString());
      currentUrl.searchParams.set('assets', (calculationResult.assets * 10000).toString());
      currentUrl.searchParams.set('spouseIncome', (calculationResult.spouseIncome * 10000).toString());
      currentUrl.searchParams.set('ltv', loanOptions.ltv.toString());
      currentUrl.searchParams.set('dsr', loanOptions.dsr.toString());
      
      const shareData = {
        title: `${username}님의 아파트 구매 가능 금액`,
        text: `${username}님이 ${type} 시 살 수 있는 아파트: ${amount}`,
        url: currentUrl.toString()
      };
      
      await shareContent(shareData);
    } catch (error) {
      console.error('공유 오류:', error);
    }
  };

  // 홈으로 이동 핸들러
  const handleGoHome = () => {
    console.log('홈으로 이동 버튼 클릭됨');
    console.log('현재 URL:', window.location.href);
    console.log('searchParams:', Object.fromEntries(searchParams.entries()));
    console.log('isSharedLink:', isSharedLink);
    
    // 직접 window.location 사용
    console.log('홈으로 이동 시작');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-12 relative">
      {/* 헤더 - 공유받은 링크가 아닐 때만 표시 */}
      {!isSharedLink && (
        <Header 
          backUrl="/result" 
          rightAction={{
            label: "소득·자산 수정",
            onClick: handleEditIncome,
            className: "flex px-[10px] py-2 justify-center items-center gap-2.5 rounded-[4px] bg-[#F1F3F5]"
          }}
        />
      )}

      {/* 컨텐츠 영역 - flex-grow를 사용해 공간 확보 */}
      <div className="flex-grow flex flex-col pb-32">
        {/* 타이틀 */}
        <h1 className="text-[24px] font-bold leading-8 tracking-[-0.24px] mb-8">
          <span className="text-[#7577FF]">{username}</span> 님의 소득과 자산,<br />
          투자와 실거주를 모두 고려했어요
        </h1>

        {/* 탭 */}
        <div className="flex border-b border-grey-40 mb-10">
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
        </div>

        {/* 결과 카드 */}
        <div className="flex flex-col items-center mb-6">
          <div 
            ref={cardRef}
            style={{
              display: 'flex',
              width: '298px',
              height: '380px',
              padding: '20px 20px 0px 20px',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '12px',
              background: '#DFECFF'
            }}
          >
            {/* 상단 텍스트들 */}
            <div className="flex flex-col items-start w-full">
              {/* 상단 텍스트 */}
              <p 
                style={{
                  color: 'var(--grey-100, #212529)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", sans-serif',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: '700',
                  lineHeight: '24px',
                  letterSpacing: '-0.16px',
                  marginBottom: '8px'
                }}
              >
                <span style={{ fontWeight: '700' }}>{username}</span> 님이<br />살 수 있는 아파트는
              </p>
              
              {/* 금액 텍스트 */}
              <p 
                style={{
                  color: 'var(--grey-100, #212529)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", sans-serif',
                  fontSize: '24px',
                  fontStyle: 'normal',
                  fontWeight: '700',
                  lineHeight: '32px',
                  letterSpacing: '-0.24px',
                  marginBottom: '4px'
                }}
              >
                {isSharedLink && !isCalculated ? '계산 중...' : (
                  activeTab === 'gap'
                    ? formatToKorean(calculationResult.investment.maxPropertyPrice)
                    : formatToKorean(stressDSRResult.capital.maxPropertyPrice)
                )}
              </p>
              
              {/* 실거주시/갭투자시 작은 텍스트 */}
              <p 
                style={{
                  color: 'var(--Gray-60, #707075)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", sans-serif',
                  fontSize: '13px',
                  fontStyle: 'normal',
                  fontWeight: '700',
                  lineHeight: '20px',
                  letterSpacing: '-0.13px'
                }}
              >
                {activeTab === 'gap' ? '갭투자 시 최대' : '실거주 시 최대'}
              </p>
            </div>
            
            {/* 이미지 */}
            <div 
              style={{
                display: 'flex',
                width: '298px',
                height: '238px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: '0',
                aspectRatio: '149/119'
              }}
            >
              {!imageError ? (
                <img 
                  className="w-full h-full object-contain"
                  src={`/images/${activeTab === 'gap' ? gapImageName : liveImageName}`}
                  alt="아파트 이미지"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F6F7FF]">
                  <span className="text-grey-60 text-sm">
                    {imageError ? "이미지 로드 실패" : "이미지 로딩 중..."}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 자금계획 섹션 */}
        <div className="flex flex-col items-center">
            {/* AdSense 광고 - 이미지 카드 바로 아래 */}
            <div className="mb-6 w-[302px]">
              <AdSense
                adSlot="1234567890"
                adFormat="horizontal"
                style={{ minHeight: '100px' }}
                className="rounded-lg overflow-hidden"
              />
            </div>
          
          {/* 자금계획 카드 */}
          <div className="w-[302px] p-5 bg-white border border-grey-40 rounded-xl mb-6">
            <h3 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-4">
              자금계획
            </h3>
            
            {activeTab === 'gap' ? (
              // 갭투자 자금계획
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-grey-80 text-sm font-medium leading-[18px] tracking-[-0.26px]">아파트 가격</span>
                  <span className="text-grey-100 text-sm font-bold leading-[18px] tracking-[-0.26px]">
                    {formatToKorean(calculationResult.investment.maxPropertyPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-grey-80 text-sm font-medium leading-[18px] tracking-[-0.26px]">전세보증금</span>
                  <span className="text-grey-100 text-sm font-bold leading-[18px] tracking-[-0.26px]">
                    {formatToKorean(calculationResult.investment.jeonseDeposit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-grey-80 text-sm font-medium leading-[18px] tracking-[-0.26px]">신용대출</span>
                  <span className="text-grey-100 text-sm font-bold leading-[18px] tracking-[-0.26px]">
                    {formatToKorean(calculationResult.investment.creditLoan)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-grey-30">
                  <span className="text-grey-80 text-sm font-medium leading-[18px] tracking-[-0.26px]">월 이자</span>
                  <span className="text-primary text-sm font-bold leading-[18px] tracking-[-0.26px]">
                    {formatToKorean(calculationResult.investment.monthlyRepayment)}
                  </span>
                </div>
              </div>
            ) : (
              // 실거주 자금계획
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-grey-80 text-sm font-medium leading-[18px] tracking-[-0.26px]">아파트 가격</span>
                  <span className="text-grey-100 text-sm font-bold leading-[18px] tracking-[-0.26px]">
                    {formatToKorean(stressDSRResult.capital.maxPropertyPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-grey-80 text-sm font-medium leading-[18px] tracking-[-0.26px]">주택담보대출</span>
                  <span className="text-grey-100 text-sm font-bold leading-[18px] tracking-[-0.26px]">
                    {formatToKorean(stressDSRResult.capital.mortgageLimit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-grey-80 text-sm font-medium leading-[18px] tracking-[-0.26px]">자기자본</span>
                  <span className="text-grey-100 text-sm font-bold leading-[18px] tracking-[-0.26px]">
                    {formatToKorean(calculationResult.assets)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-grey-30">
                  <span className="text-grey-80 text-sm font-medium leading-[18px] tracking-[-0.26px]">월 상환액</span>
                  <span className="text-primary text-sm font-bold leading-[18px] tracking-[-0.26px]">
                    {formatToKorean(stressDSRResult.capital.monthlyRepayment)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 실거주 시 설명 카드 */}
          {activeTab === 'live' && (
            <div className="w-[302px] p-4 bg-[#F6F7FF] rounded-xl mb-6">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-[#7577FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">ℹ</span>
                </div>
                <div>
                  <p className="text-[#495057] text-xs font-medium leading-[18px] tracking-[-0.24px]">
                    • 주택 가격의 최대 70% 대출 가능<br/>
                    • 스트레스 DSR 3단계 적용 (수도권) + 보유자산
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DSR 섹션 */}
          <div className="w-[302px] space-y-4 mb-6">
            {/* 금융권 구분 정보 박스 */}
            <div className="p-4 bg-[#F6F7FF] rounded-xl">
              <div className="flex items-start gap-2 mb-3">
                <div className="w-4 h-4 bg-[#7577FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">%</span>
                </div>
                <div>
                  <p className="text-[#495057] text-xs font-bold leading-[18px] tracking-[-0.24px] mb-1">
                    1금융권 대출 (연소득의 40% 적용)을 가정한 결과에요.
                  </p>
                  <p className="text-[#868E96] text-xs font-medium leading-[18px] tracking-[-0.24px]">
                    • 실제 금리는 평균 변동금리인 3.5%로 설정하였으며, 개인의 신용도에 따라 달라질 수 있어요.
                  </p>
                </div>
              </div>
            </div>

            {/* 스트레스 DSR 정보 박스 */}
            <div className="p-4 bg-[#F6F7FF] rounded-xl">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-[#868E96] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">ℹ</span>
                </div>
                <div>
                  <p className="text-[#495057] text-xs font-bold leading-[18px] tracking-[-0.24px] mb-2">
                    스트레스 DSR 3단계
                  </p>
                  <div className="space-y-1 text-[#868E96] text-xs font-medium leading-[18px] tracking-[-0.24px]">
                    <p>• 실제 금리: 3.5%</p>
                    <p>• 수도권 (3.5% + 1.5%)</p>
                    <p>• 지방 (3.5% + 0.75%)</p>
                  </div>
                  <p className="text-[#868E96] text-xs font-medium leading-[18px] tracking-[-0.24px] mt-2">
                    2025.7.1일부터 시행되며, 대출 한도 산정 시 실제 대출 금리에 스트레스 금리를 더하여 계산해요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
        <div 
          className="flex w-full max-w-md px-5 pt-10 pb-[25px] gap-3 items-center"
          style={{ 
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 31.25%)'
          }}
        >
          {/* 공유받은 링크인 경우 */}
          {isSharedLink ? (
            <>
              <button
                onClick={handleGoHome}
                className="flex-1 h-14 justify-center items-center gap-2.5 flex border border-[#ADB5BD] rounded-[300px] text-grey-100 font-medium"
              >
                나도 계산하기
              </button>
              <button
                onClick={handleShare}
                className="flex-1 h-14 justify-center items-center gap-2.5 flex bg-[#7577FF] text-white rounded-[300px] font-semibold"
              >
                공유하기
              </button>
            </>
          ) : (
            /* 일반적인 경우 */
            <>
              <button
                onClick={handleSaveCard}
                disabled={isSaving}
                className="flex-1 h-14 justify-center items-center gap-2.5 flex border border-[#ADB5BD] rounded-[300px] text-grey-100 font-medium disabled:opacity-50"
              >
                {isSaving ? '저장 중...' : '카드 저장'}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 h-14 justify-center items-center gap-2.5 flex bg-[#7577FF] text-white rounded-[300px] font-semibold"
              >
                공유하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 