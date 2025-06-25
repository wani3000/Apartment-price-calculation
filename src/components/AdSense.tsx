'use client';

import React, { useEffect, useState } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  shouldShow?: boolean;
  contentReady?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const isDevelopment = typeof window !== 'undefined' 
  ? window.location.hostname === 'localhost' 
  : false;

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
  className = '',
  shouldShow = true,
  contentReady = true
}: AdSenseProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      // 개발 환경에서는 광고를 로드하지 않음
      if (isDevelopment) {
        return;
      }

      // 콘텐츠가 준비되지 않았거나 표시하지 않아야 할 때는 광고 로드하지 않음
      if (!contentReady || !shouldShow) {
        return;
      }

      // AdSense 스크립트가 로드된 후 광고 초기화
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);
      }
    } catch (error) {
      console.error('AdSense 오류:', error);
      setHasError(true);
    }
  }, [contentReady, shouldShow]);

  // 콘텐츠가 준비되지 않았거나 표시하지 않아야 할 때는 null 반환
  if (!shouldShow || !contentReady) {
    return null;
  }

  // 개발 환경에서는 placeholder 표시
  if (isDevelopment) {
    return (
      <div className={`adsense-container ${className}`} style={style}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            border: '1px dashed #dee2e6',
            borderRadius: '8px',
            minHeight: '100px',
            color: '#6c757d',
            fontSize: '14px',
            ...style 
          }}
        >
          AdSense 광고 (개발 모드)
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-6858835884991650"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-ad-status={isLoaded ? 'filled' : 'unfilled'}
      />
      {hasError && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            minHeight: '100px',
            color: '#6c757d',
            fontSize: '12px'
          }}
        >
          광고를 불러올 수 없습니다
        </div>
      )}
    </div>
  );
} 