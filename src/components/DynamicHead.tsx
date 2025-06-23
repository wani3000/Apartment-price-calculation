'use client';

import { useEffect } from 'react';

interface DynamicHeadProps {
  username: string;
  maxPrice: string;
  type: 'gap' | 'live';
  income: string;
  assets: string;
  cardElement?: HTMLElement | null; // 카드 요소 참조
}

export default function DynamicHead({ username, maxPrice, type, income, assets, cardElement }: DynamicHeadProps) {
  useEffect(() => {
    // 동적으로 메타 태그 업데이트
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 맞춤형 타이틀과 서브텍스트 설정
    const title = `${username} 님의 연봉과 자산으로 살 수 있는 아파트는?`;
    const description = `내가 살 수 있는 아파트 금액을 지금 확인해보세요!`;
    
    // 페이지 제목 업데이트
    document.title = title;
    
    // Open Graph 메타 태그 업데이트
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'website');
    
    // Twitter 메타 태그 업데이트
    updateMetaName('twitter:title', title);
    updateMetaName('twitter:description', description);
    updateMetaName('twitter:card', 'summary_large_image');
    
    // 일반 메타 태그 업데이트
    updateMetaName('description', description);

    // 카드 이미지가 있으면 OG 이미지로 설정
    if (cardElement && typeof window !== 'undefined') {
      const generateOGImage = async () => {
        try {
          const html2canvas = (await import('html2canvas')).default;
          const canvas = await html2canvas(cardElement, {
            backgroundColor: '#DFECFF',
            scale: 2,
            width: 298,
            height: 380,
            useCORS: true,
            allowTaint: true
          });
          
          // Canvas를 blob으로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              updateMetaTag('og:image', url);
              updateMetaName('twitter:image', url);
            }
          }, 'image/png', 0.9);
        } catch (error) {
          console.log('OG 이미지 생성 실패:', error);
        }
      };

      // 이미지 로드 후 실행
      setTimeout(generateOGImage, 1000);
    }
    
  }, [username, maxPrice, type, income, assets, cardElement]);

  return null; // 이 컴포넌트는 렌더링하지 않음
} 