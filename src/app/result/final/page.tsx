'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { calculateMaxPurchaseForLiving, calculateMaxPurchaseForInvestment, convertManToWon, calculateMonthlyPayment, calculateMonthlyInterestOnly } from '@/utils/calculator';
import Header from '@/components/Header';
import html2canvas from 'html2canvas';
import { shareContent, getResultShareData } from '@/utils/share';

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
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('gap'); // 'gap' 또는 'live'
  
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
  
  // 컴포넌트 마운트 시 랜덤 이미지 선택
  useEffect(() => {
    const availableImages = ['img_house_01.png', 'img_house_02.png', 'img_house_03.png', 'img_house_04.png', 'img_house_05.png'];
    
    // 갭투자용 이미지 랜덤 선택
    const gapIndex = Math.floor(Math.random() * availableImages.length);
    const selectedGapImage = availableImages[gapIndex];
    
    // 실거주용 이미지는 갭투자용과 다르게 선택
    const remainingImages = availableImages.filter(img => img !== selectedGapImage);
    const liveIndex = Math.floor(Math.random() * remainingImages.length);
    const selectedLiveImage = remainingImages[liveIndex];
    
    setGapImageName(selectedGapImage);
    setLiveImageName(selectedLiveImage);
  }, []); // 빈 dependency array로 컴포넌트 마운트 시 한 번만 실행

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
    const imageName = activeTab === 'gap' ? gapImageName : liveImageName;
    console.error('Image failed to load:', imageName);
    setImageError(true);
  };

  // 이미지 로드 성공 핸들러
  const handleImageLoad = () => {
    const imageName = activeTab === 'gap' ? gapImageName : liveImageName;
    console.log('Image loaded successfully:', imageName);
    setImageError(false);
  };

  // 카드 저장 함수 (iOS 갤러리 저장 지원)
  const handleSaveCard = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsSaving(true);
      
      // 폰트 로딩 완료 대기
      await document.fonts.ready;
      
      // 추가 대기 시간 (폰트 완전 로딩 보장)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 카드 엘리먼트의 스크린샷 캡처
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#DFECFF',
        scale: 2,  // 해상도 2배로 향상
        logging: false,
        useCORS: true,  // 외부 이미지 로드를 위해
        allowTaint: true,
        foreignObjectRendering: false,  // 폰트 렌더링 문제 해결을 위해 false로 변경
        imageTimeout: 15000,  // 이미지 로딩 대기 시간
        onclone: (clonedDoc) => {
          // 클론된 문서의 모든 텍스트 요소에 시스템 폰트 적용
          const textElements = clonedDoc.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
          textElements.forEach((element) => {
            if (element instanceof HTMLElement) {
              element.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", sans-serif';
            }
          });
          
          // 폰트 로딩 완료 대기
          clonedDoc.fonts?.ready?.then(() => {
            console.log('Cloned document fonts ready');
          });
        }
      });
      
      // iOS 감지 (더 정확한 감지)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad on iOS 13+
      
      if (isIOS) {
        // iOS에서는 새 탭에서 이미지를 열어서 사용자가 길게 눌러서 저장할 수 있게 함
        const dataUrl = canvas.toDataURL('image/png');
        
        // 새 창에서 이미지 열기
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${username}님의 아파트 구매 가능 금액</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  background: #f5f5f5;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .instruction {
                  background: white;
                  padding: 15px 20px;
                  border-radius: 12px;
                  margin-bottom: 20px;
                  text-align: center;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  max-width: 300px;
                }
                .instruction h3 {
                  margin: 0 0 8px 0;
                  color: #007AFF;
                  font-size: 16px;
                }
                .instruction p {
                  margin: 0;
                  color: #666;
                  font-size: 14px;
                  line-height: 1.4;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
              </style>
            </head>
            <body>
              <div class="instruction">
                <h3>📱 갤러리에 저장하기</h3>
                <p>아래 이미지를 <strong>길게 눌러서</strong><br>"사진에 저장"을 선택하세요</p>
              </div>
              <img src="${dataUrl}" alt="아파트 구매 가능 금액 카드" />
            </body>
            </html>
          `);
          newWindow.document.close();
        }
        
        alert('새 탭에서 이미지를 길게 눌러서 "사진에 저장"을 선택하세요.');
      } else {
        // 다른 브라우저에서는 기존 다운로드 방식 사용
        fallbackDownload(canvas);
      }
    } catch (error) {
      console.error('카드 저장 중 오류 발생:', error);
      alert('카드 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 기존 다운로드 방식 (fallback)
  const fallbackDownload = (canvas: HTMLCanvasElement) => {
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
    
    alert('카드가 저장되었습니다.');
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
      const shareData = getResultShareData(username, amount, type);
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
                {activeTab === 'gap' 
                  ? formatToKorean(calculationResult.investment.maxPropertyPrice)
                  : formatToKorean(calculationResult.living.maxPropertyPrice)
                }
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
        
        {/* 자금계획 섹션 (24px 간격으로 변경) */}
        <div className="flex flex-col items-center">
          {/* 최대 금액 정보 */}
          <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF] mb-6 w-[302px]">
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
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF]">
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
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF]">
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
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF]">
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
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF]">
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
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF]">
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
                <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF]">
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
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF]">
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
          {isSharedLink ? (
            // 공유받은 링크일 때: 홈으로 이동 버튼만 표시
            <button 
              className="w-full h-14 justify-center items-center gap-2.5 flex bg-[#7577FF] text-white rounded-[300px] font-semibold"
              onClick={handleGoHome}
            >
              내 소득으로 아파트 계산해보기
            </button>
          ) : (
            // 일반 사용자일 때: 기존 버튼들 표시
            <>
              <button
                className="flex-1 h-14 justify-center items-center gap-2.5 flex border border-[#ADB5BD] rounded-[300px] text-grey-100 font-medium"
                onClick={handleSaveCard}
                disabled={isSaving}
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