'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { calculateMaxPurchaseForLiving, calculateMaxPurchaseForLivingWithStressDSR, calculateMaxPurchaseForInvestment, calculateMaxPurchaseWithNewRegulation627, convertManToWon, calculateMonthlyPayment, calculateMonthlyInterestOnly } from '@/utils/calculator';
import Header from '@/components/Header';
import html2canvas from 'html2canvas';
import { shareContent, getResultShareData } from '@/utils/share';
import Head from 'next/head';

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

export default function FinalResultPage() {
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
  const [isNewRegulation627, setIsNewRegulation627] = useState(false);

  // 카드 요소에 대한 ref 추가
  const cardRef = useRef<HTMLDivElement>(null);

  // 계산 수행 공통 함수 (공유 링크용, 이미 원 단위로 받음)
  const performCalculation = (data: { income: number; assets: number; spouseIncome: number; ltv: number; dsr: number }, isNew627?: boolean) => {
    const { income, assets, spouseIncome, ltv, dsr } = data;
    const totalIncome = income + spouseIncome;
    
    // 6.27 규제 확인
    if (isNew627) {
      // 6.27 규제 적용 계산 (실제 금리, 수도권, 지방 3가지 모두 계산)
      // 실제 금리도 6억원 제한 적용 (DSR 기준으로 계산하되 6억원 제한)
      const actualRateResultBase = calculateMaxPurchaseForLiving(
        totalIncome,
        assets,
        40, // DSR 40%
        3.5, // 실제 금리 3.5%
        30, // 30년 만기
        70 // LTV 70%
      );
      
      // 6억원 제한 적용
      const maxLoanAmount = 600000000; // 6억원
      const actualRateResult = {
        maxPropertyPrice: assets + Math.min(actualRateResultBase.mortgageLimit, maxLoanAmount),
        mortgageLimit: Math.min(actualRateResultBase.mortgageLimit, maxLoanAmount),
        creditLoan: 0
      };
      
      // 수도권 기준 (6.27 규제 적용)
      const capitalAreaResult = calculateMaxPurchaseWithNewRegulation627(
        totalIncome,
        assets,
        true // 수도권 기준
      );
      
      // 지방 기준 (6.27 규제 적용)
      const localAreaResult = calculateMaxPurchaseWithNewRegulation627(
        totalIncome,
        assets,
        false // 지방 기준
      );
      
      // 갭투자는 6.27 규제에서 동일하게 처리
      const investmentResult = calculateMaxPurchaseForInvestment(
        totalIncome,
        assets,
        60 // 전세가율 60%
      );
      
      const investmentMonthlyRepayment = calculateMonthlyInterestOnly(investmentResult.creditLoan, 3.5);
      
      // 계산 결과 업데이트 (만원 단위로 변환)
      const newResult = {
        income: Math.round(income / 10000),
        assets: Math.round(assets / 10000),
        spouseIncome: Math.round(spouseIncome / 10000),
        living: {
          maxPropertyPrice: Math.round(capitalAreaResult.maxPropertyPrice / 10000), // 수도권 기준을 기본으로 사용
          mortgageLimit: Math.round(capitalAreaResult.mortgageLimit / 10000),
          creditLoan: 0, // 6.27 규제에서 신용대출은 없음
          monthlyRepayment: Math.round(capitalAreaResult.monthlyRepayment / 10000)
        },
        investment: {
          maxPropertyPrice: Math.round(investmentResult.maxPropertyPrice / 10000),
          creditLoan: Math.round(investmentResult.creditLoan / 10000),
          jeonseDeposit: Math.round(investmentResult.jeonseDeposit / 10000),
          monthlyRepayment: Math.round(investmentMonthlyRepayment / 10000)
        }
      };
      
      // 6.27 규제안용 3가지 금리 결과 저장
      const actualMonthlyRepayment = calculateMonthlyPayment(actualRateResult.mortgageLimit, 3.5, 30);
      
      setStressDSRResult({
        actual: { // 실제 금리
          mortgageLimit: Math.round(actualRateResult.mortgageLimit / 10000),
          maxPropertyPrice: Math.round(actualRateResult.maxPropertyPrice / 10000),
          monthlyRepayment: Math.round(actualMonthlyRepayment / 10000)
        },
        capital: { // 수도권
          mortgageLimit: Math.round(capitalAreaResult.mortgageLimit / 10000),
          maxPropertyPrice: Math.round(capitalAreaResult.maxPropertyPrice / 10000),
          monthlyRepayment: Math.round(capitalAreaResult.monthlyRepayment / 10000)
        },
        local: { // 지방
          mortgageLimit: Math.round(localAreaResult.mortgageLimit / 10000),
          maxPropertyPrice: Math.round(localAreaResult.maxPropertyPrice / 10000),
          monthlyRepayment: Math.round(localAreaResult.monthlyRepayment / 10000)
        }
      });
      
      setCalculationResult(newResult);
      setIsCalculated(true);
      return;
    }
    
    // 기존 규제 계산
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

    // 실제 금리 계산 (스트레스 DSR 비교용)
    const actualRateMonthlyRepayment = calculateMonthlyPayment(newResult.living.mortgageLimit, 3.5, 40);

    // 스트레스 DSR 결과 저장 (만원 단위로 변환)
    setStressDSRResult({
      actual: {
        mortgageLimit: Math.round(newResult.living.mortgageLimit / 10000),
        maxPropertyPrice: Math.round(newResult.living.maxPropertyPrice / 10000),
        monthlyRepayment: Math.round(actualRateMonthlyRepayment / 10000)
      },
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
  
  // 스트레스 DSR 계산 결과 상태 추가
  const [stressDSRResult, setStressDSRResult] = useState({
    actual: { mortgageLimit: 0, maxPropertyPrice: 0, monthlyRepayment: 0 }, // 실제 금리
    capital: { mortgageLimit: 0, maxPropertyPrice: 0, monthlyRepayment: 0 }, // 수도권
    local: { mortgageLimit: 0, maxPropertyPrice: 0, monthlyRepayment: 0 }    // 지방
  });
  const [isCalculated, setIsCalculated] = useState(false);
  
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

  // 공유받은 링크에서 탭 변경 시 계산 다시 수행
  useEffect(() => {
    if (isSharedLink && sharedCalculationData) {
      setIsCalculated(false); // 계산 중 상태로 변경
      // 약간의 지연을 두어 UI 업데이트 보장
      setTimeout(() => {
        const isNew627 = searchParams.get('regulation') === 'new627';
        performCalculation(sharedCalculationData, isNew627);
      }, 50);
    }
  }, [activeTab, sharedCalculationData, isSharedLink, searchParams]);

  useEffect(() => {
    // 공유된 링크인 경우 URL 파라미터에서 데이터 추출 및 계산
    if (isSharedLink) {
      const sharedUsername = searchParams.get('username');
      const sharedAmount = searchParams.get('amount');
      const sharedType = searchParams.get('type');
      const sharedIncome = searchParams.get('income');
      const sharedAssets = searchParams.get('assets');
      const sharedSpouseIncome = searchParams.get('spouseIncome');
      const sharedLtv = searchParams.get('ltv');
      const sharedDsr = searchParams.get('dsr');

      if (sharedUsername) setUsername(decodeURIComponent(sharedUsername));
      if (sharedType === 'gap' || sharedType === 'live') setActiveTab(sharedType);
      
      // 공유받은 데이터로 계산 수행
      if (sharedIncome && sharedAssets && sharedLtv && sharedDsr) {
        const income = parseInt(sharedIncome);
        const assets = parseInt(sharedAssets);
        const spouseIncome = parseInt(sharedSpouseIncome || '0');
        const ltv = parseInt(sharedLtv);
        const dsr = parseInt(sharedDsr);
        const totalIncome = income + spouseIncome;
        
        // 공유받은 계산 데이터 저장
        const calculationData = { income, assets, spouseIncome, ltv, dsr };
        setSharedCalculationData(calculationData);
        
        // 대출 옵션 설정
        setLoanOptions({ ltv, dsr });
        
        // 계산 수행 및 결과 저장
        const isNew627 = searchParams.get('regulation') === 'new627';
        performCalculation(calculationData, isNew627);
      }
      return; // 공유 링크인 경우 localStorage 로직을 건너뜁니다.
    }

    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 규제 유형 확인 - URL 파라미터가 있을 때만 6.27 규제 적용
    const regulationParam = searchParams.get('regulation');
    const isNew627 = regulationParam === 'new627';
    setIsNewRegulation627(isNew627);

    // LTV, DSR 옵션 가져오기
    const loanOptionsStr = localStorage.getItem('loanOptions');
    let currentLoanOptions = { ltv: 70, dsr: 40 }; // 기본값
    if (loanOptionsStr) {
      currentLoanOptions = JSON.parse(loanOptionsStr);
      setLoanOptions(currentLoanOptions);
    }

    // 계산 데이터 가져오기
    const calculatorDataStr = localStorage.getItem('calculatorData');
    if (calculatorDataStr) {
      const calculatorData = JSON.parse(calculatorDataStr);
      
      // localStorage에서 읽은 데이터를 만원 단위 그대로 저장 (공유 링크용)
      setCalculationResult({
        income: calculatorData.income,
        assets: calculatorData.assets,
        spouseIncome: calculatorData.spouseIncome || 0,
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

      // 계산 수행 (원 단위로 변환해서 계산 후 다시 만원 단위로 저장)
      const income = convertManToWon(calculatorData.income);
      const assets = convertManToWon(calculatorData.assets);
      const spouseIncome = convertManToWon(calculatorData.spouseIncome || 0);
      
      // 계산 수행 및 결과 저장
      performCalculation({ income, assets, spouseIncome, ltv: currentLoanOptions.ltv, dsr: currentLoanOptions.dsr }, isNew627);
    }
  }, [isSharedLink, searchParams]);

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
      
      // 폰트 로딩 완료 대기 (html2canvas 캡처 전)
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
          // 클론된 문서의 모든 텍스트 요소에 Pretendard 폰트 강제 적용
          const textElements = clonedDoc.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
          textElements.forEach((element) => {
            if (element instanceof HTMLElement) {
              element.style.fontFamily = 'Pretendard, sans-serif';
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
      // 1. 공유용 URL 생성
      const amount = formatToKorean(
        activeTab === 'gap' 
          ? calculationResult.investment.maxPropertyPrice
          : (isNewRegulation627 ? calculationResult.living.maxPropertyPrice : stressDSRResult.capital.maxPropertyPrice)
      );
      const type = activeTab === 'gap' ? 'gap' : 'live';
      const income = calculationResult.income * 10000;
      const assets = calculationResult.assets * 10000;
      const spouseIncome = calculationResult.spouseIncome * 10000;
      const ltv = loanOptions.ltv;
      const dsr = loanOptions.dsr;
      const sharedUrl = `https://aptgugu.com/result/final?shared=true&username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}&type=${type}&income=${income}&assets=${assets}&spouseIncome=${spouseIncome}&ltv=${ltv}&dsr=${dsr}`;

      // 2. 랜덤한 slug 생성
      const slug = Math.random().toString(36).substring(2, 8);
      
      // 3. /api/shorten에 POST 요청으로 저장 (절대경로, credentials: 'include')
      const apiUrl = `${window.location.origin}/api/shorten`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          slug,
          longUrl: sharedUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('단축 URL 생성 실패');
      }
      
      // 4. 저장 성공 시 shortUrl 생성
      const shortUrl = `https://aptgugu.com/result/${slug}`;
      
      // 5. 모바일: navigator.share 지원 시 공유 시트, 아니면 클립보드 복사 fallback
      const shareText = username ? `${username} 님이 살 수 있는 아파트 가격이에요!` : '이 링크에서 내 결과를 확인할 수 있어요!';
      if (navigator.share) {
        try {
          await navigator.share({
            title: '아파트 분석 결과',
            text: shareText,
            url: shortUrl,
          });
        } catch (err) {
          // 공유 시트에서 사용자가 취소한 경우 등
          console.warn('공유 실패', err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(shortUrl);
          alert('공유 링크가 복사되었습니다!');
        } catch (err) {
          alert(`공유 링크: ${shortUrl}\n(클립보드 복사에 실패했습니다. 직접 복사해 주세요.)`);
        }
      }
      
    } catch (error) {
      console.error('공유 오류:', error);
      alert('공유 링크 생성에 실패했습니다. 다시 시도해주세요.');
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

  // 뒤로가기 URL 동적 설정
  const getBackUrl = () => {
    const regulationParam = searchParams.get('regulation');
    if (regulationParam === 'new627') {
      return '/result/new-regulation';
    }
    return '/result';
  };

  return (
    <>
      <Head>
        <title>추천 아파트 결과 - 서울에서 가능한 아파트</title>
        <meta name="description" content="내 자산과 대출로 가능한 서울 아파트 리스트를 추천해드립니다." />
        <meta name="keywords" content="아파트 대출 계산기, 아파트 구매 계산기, 서울 아파트 대출, 갭투자 계산기, 실거주 계산, 부동산 계산기, 아파트담보대출 계산, 내 집 마련 계산기" />
        <meta property="og:title" content="추천 아파트 결과 - 서울에서 가능한 아파트" />
        <meta property="og:description" content="내 자산과 대출로 가능한 서울 아파트 리스트를 추천해드립니다." />
        <meta property="og:image" content="https://aptgugu.com/og.png" />
        <meta property="og:url" content="https://aptgugu.com/result/final" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="추천 아파트 결과 - 서울에서 가능한 아파트" />
        <meta name="twitter:description" content="내 자산과 대출로 가능한 서울 아파트 리스트를 추천해드립니다." />
        <meta name="twitter:image" content="https://aptgugu.com/og.png" />
      </Head>
      <div className="min-h-screen bg-white">
        <div className="flex-1 px-5 pt-6" style={{ paddingBottom: '40px' }}>
          {/* 헤더 - 공유받은 링크가 아닐 때만 표시 */}
          {!isSharedLink && (
            <div style={{ marginTop: '-5px' }}>
              <Header 
                backUrl={getBackUrl()} 
                rightAction={{
                  label: "소득·자산 수정",
                  onClick: handleEditIncome,
                  className: "flex px-[10px] py-2 justify-center items-center gap-2.5 rounded-[4px] bg-[#F1F3F5]"
                }}
              />
            </div>
          )}

          {/* 타이틀 */}
          <h1 className="text-[24px] font-bold leading-8 tracking-[-0.24px] mb-6">
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
                      : formatToKorean(isNewRegulation627 ? calculationResult.living.maxPropertyPrice : stressDSRResult.capital.maxPropertyPrice)
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
            
            {/* 최대 금액 정보 */}
            <div className="flex flex-col p-4 gap-2 rounded-xl bg-[#F6F7FF] mb-6 w-[302px]">
              <h2 className="text-black text-[18px] font-bold leading-[26px] tracking-[-0.18px]">
                {activeTab === 'gap' ? '갭투자 시' : '실거주 시'}
              </h2>
              <p className="text-black text-[22px] font-bold leading-7 tracking-[-0.22px]">
                최대 {formatToKorean(
                  activeTab === 'gap' 
                    ? calculationResult.investment.maxPropertyPrice 
                    : (isNewRegulation627 ? calculationResult.living.maxPropertyPrice : stressDSRResult.capital.maxPropertyPrice)
                )}
              </p>
              <div className="text-[#495057] text-sm font-normal leading-5 tracking-[-0.28px]">
                {activeTab === 'gap' 
                  ? '세입자의 전세금을 활용해 투자해요' 
                  : (isNewRegulation627 
                      ? '6.27 규제안 적용: 최대 6억원 대출 한도, 30년 만기, 지역별 스트레스 금리' 
                      : (
                          <>
                            • 주택 가격의 최대 70% 대출 가능<br/>
                            • 스트레스 DSR 3단계 적용 (수도권) + 보유자산
                          </>
                        )
                    )
                }
              </div>
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
                        전세가율 53%
                      </p>
                      <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                        {formatToKorean(calculationResult.investment.jeonseDeposit)}
                      </p>
                    </div>
                    <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                      KB국민은행 25년 6월 주택가격동향 통계에 따라 53%로 산정했어요. 고가 아파트는 전세가율이 53%보다 더 낮을 수 있어요
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
                  <div className="flex flex-col p-4 gap-3 rounded-xl bg-[#F6F7FF]">
                    {isNewRegulation627 ? (
                      /* 6.27 규제 강화 방안 적용 시 */
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                          <p className="text-blue-700 text-base font-bold leading-6">
                            6.27 가계부채 관리 강화 방안 적용
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] text-[15px] font-normal leading-[22px]">• 실제 금리 (3.5%)</span>
                            <span className="text-[#212529] text-[15px] font-medium leading-[22px]">{formatToKorean(stressDSRResult.actual.mortgageLimit)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] text-[15px] font-normal leading-[22px]">• 수도권 (3.5% + 1.5%)</span>
                            <span className="text-[#212529] text-[15px] font-medium leading-[22px]">{formatToKorean(stressDSRResult.capital.mortgageLimit)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] text-[15px] font-normal leading-[22px]">• 지방 (3.5% + 0.75%)</span>
                            <span className="text-[#212529] text-[15px] font-medium leading-[22px]">{formatToKorean(stressDSRResult.local.mortgageLimit)}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-[#E9ECEF]">
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] text-[14px] font-normal">감소율:</span>
                            <span className="text-red-600 text-[14px] font-medium">
                              수도권 {stressDSRResult.actual.mortgageLimit > 0 ? Math.round(((stressDSRResult.actual.mortgageLimit - stressDSRResult.capital.mortgageLimit) / stressDSRResult.actual.mortgageLimit) * 100) : 0}%, 
                              지방 {stressDSRResult.actual.mortgageLimit > 0 ? Math.round(((stressDSRResult.actual.mortgageLimit - stressDSRResult.local.mortgageLimit) / stressDSRResult.actual.mortgageLimit) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-blue-600 text-[13px] font-normal leading-[18px] tracking-[-0.26px] mt-2">
                          <p>2025년 6월 28일부터 시행되는 강화된 가계부채 관리 규제가 적용됩니다.</p>
                          <p>개인별 대출 한도는 6억 원으로 제한되며, 대출 만기는 30년으로 단축됩니다.</p>
                          <p>수도권 외 지역(비규제)은 6억 원 제한이 없으며, LTV는 최대 80%까지 적용 가능합니다.</p>
                        </div>
                      </>
                    ) : (
                      /* 기존 스트레스 DSR 3단계 적용 시 */
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                          <p className="text-blue-700 text-base font-bold leading-6">
                            스트레스 DSR 3단계 적용 시
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] text-[15px] font-normal leading-[22px]">• 실제 금리 (3.5%)</span>
                            <span className="text-[#212529] text-[15px] font-medium leading-[22px]">{formatToKorean(calculationResult.living.mortgageLimit)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] text-[15px] font-normal leading-[22px]">• 수도권 (3.5% + 1.5%)</span>
                            <span className="text-[#212529] text-[15px] font-medium leading-[22px]">{formatToKorean(stressDSRResult.capital.mortgageLimit)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] text-[15px] font-normal leading-[22px]">• 지방 (3.5% + 0.75%)</span>
                            <span className="text-[#212529] text-[15px] font-medium leading-[22px]">{formatToKorean(stressDSRResult.local.mortgageLimit)}</span>
                          </div>
                          
                          <div className="pt-2 border-t border-[#E9ECEF]">
                            <div className="flex justify-between items-center">
                              <span className="text-[#495057] text-[14px] font-normal">감소율:</span>
                              <span className="text-red-600 text-[14px] font-medium">
                                수도권 {calculationResult.living.mortgageLimit > 0 ? Math.round(((calculationResult.living.mortgageLimit - stressDSRResult.capital.mortgageLimit) / calculationResult.living.mortgageLimit) * 100) : 0}%, 
                                지방 {calculationResult.living.mortgageLimit > 0 ? Math.round(((calculationResult.living.mortgageLimit - stressDSRResult.local.mortgageLimit) / calculationResult.living.mortgageLimit) * 100) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-blue-600 text-[13px] font-normal leading-[18px] tracking-[-0.26px] mt-2">
                          <p>2025.7.1일부터 시행되며, 대출 한도 산정 시 실제 대출 금리에 스트레스 금리를 더하여 계산해요.</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* DSR 선택에 따른 금융권 구분 표시 */}
                  <div className="mt-3">
                    <div className="bg-[#F6F7FF] rounded-xl p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-4 h-4 bg-[#7577FF] rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">ℹ</span>
                        </div>
                        <p className="text-[#495057] text-[13px] font-medium leading-[18px] tracking-[-0.26px]">
                          {isNewRegulation627 
                            ? '6.27 규제안에 따라 모든 금융업권에 DSR 40% 규제가 통일 적용됩니다.' 
                            : (loanOptions.dsr === 50 
                                ? '2금융권 대출 (연소득의 50% 적용)을 가정한 결과에요.' 
                                : '1금융권 대출 (연소득의 40% 적용)을 가정한 결과에요.')
                          }
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-4 h-4 bg-[#868E96] rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">%</span>
                        </div>
                        <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                          {isNewRegulation627 
                            ? '실제 금리는 평균 변동금리인 3.5%로 설정하였으며, 개인의 신용도에 따라 달라질 수 있고 여기에 수도권 (3.5% + 1.5% 스트레스변동금리)를 더한 금리가 적용되어요.' 
                            : '실제 금리는 평균 변동금리인 3.5%로 설정하였으며, 개인의 신용도에 따라 달라질 수 있어요.'
                          }
                        </p>
                      </div>
                    </div>
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
                        {isNewRegulation627 ? '30년 만기' : '40년 만기'}
                      </p>
                      <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                        {isNewRegulation627 ? formatToKorean(calculationResult.living.mortgageLimit) : formatToKorean(stressDSRResult.capital.mortgageLimit)}
                      </p>
                    </div>
                    <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                      {isNewRegulation627 
                        ? '6.27 규제안 기준 (5.0% 스트레스 금리, 수도권)' 
                        : '스트레스 DSR 수도권 기준 (5.0% 금리)'
                      }
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
                        {isNewRegulation627 ? '30년 만기' : '40년 만기'}
                      </p>
                      <p className="text-[#212529] text-[15px] font-medium leading-[22px]">
                        {isNewRegulation627 ? formatToKorean(calculationResult.living.monthlyRepayment) : formatToKorean(stressDSRResult.capital.monthlyRepayment)}
                      </p>
                    </div>
                    <p className="text-[#868E96] text-[13px] font-normal leading-[18px] tracking-[-0.26px]">
                      {isNewRegulation627 
                        ? '6.27 규제안 기준 (5.0% 스트레스 금리, 수도권)' 
                        : '스트레스 DSR 수도권 기준 (5.0% 금리)'
                      }
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* 보유자산 섹션 - 공통 */}
            <div className="mb-40 w-[302px]">
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

            {/* 자금계획 버튼 제거 (내용을 직접 표시하므로) */}
          </div>
        </div>

        {/* 하단 버튼 영역 - 하단 고정 및 그라데이션 배경 적용 */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
          <div 
            className="flex w-full max-w-md px-5 pt-10 pb-[25px] gap-3 items-center"
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
        {/* 주택담보대출 섹션 바로 위에 광고 삽입 */}
<ins className="adsbygoogle"
     style={{ display: 'block' }}
     data-ad-client="ca-pub-6858835884991650"
     data-ad-slot="5915425592"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
      </div>
    </>
  );
}