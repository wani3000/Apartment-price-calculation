import type { Metadata } from 'next';

// 공통 메타데이터 설정
export const commonMetadata = {
  keywords: '아파트 대출 계산기, 아파트 구매 계산기, 서울 아파트 대출, 갭투자 계산기, 실거주 계산, 부동산 계산기, 아파트담보대출 계산, 내 집 마련 계산기',
  authors: [{ name: 'AptGugu' }],
  creator: 'AptGugu',
  publisher: 'AptGugu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aptgugu.com'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// 메인 페이지 메타데이터
export const homeMetadata: Metadata = {
  title: '아파트 대출 계산기 - 내 자산으로 가능한 아파트 확인!',
  description: '연봉과 자산을 입력하면, 전세 활용 or 실거주 대출로 내게 맞는 아파트 금액을 계산해줍니다.',
  ...commonMetadata,
  openGraph: {
    title: '아파트 대출 계산기 - 내 자산으로 가능한 아파트 확인!',
    description: '연봉과 자산을 입력하면, 전세 활용 or 실거주 대출로 내게 맞는 아파트 금액을 계산해줍니다.',
    url: 'https://aptgugu.com',
    siteName: 'AptGugu',
    images: [
      {
        url: 'https://aptgugu.com/og.png',
        width: 1200,
        height: 630,
        alt: '아파트 대출 계산기 - 내 자산으로 가능한 아파트 확인!',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '아파트 대출 계산기 - 내 자산으로 가능한 아파트 확인!',
    description: '연봉과 자산을 입력하면, 전세 활용 or 실거주 대출로 내게 맞는 아파트 금액을 계산해줍니다.',
    images: ['https://aptgugu.com/og.png'],
  },
};

// 계산기 페이지 메타데이터
export const calculatorMetadata: Metadata = {
  title: '서울 아파트 가격 계산기 - 대출 및 자산 기반 시뮬레이션',
  description: '현금 + 연봉으로 살 수 있는 서울 아파트 금액을 계산해보세요. 전세 or 실거주 대출 모드 제공.',
  ...commonMetadata,
  openGraph: {
    title: '서울 아파트 가격 계산기 - 대출 및 자산 기반 시뮬레이션',
    description: '현금 + 연봉으로 살 수 있는 서울 아파트 금액을 계산해보세요. 전세 or 실거주 대출 모드 제공.',
    url: 'https://aptgugu.com/calculator',
    siteName: 'AptGugu',
    images: [
      {
        url: 'https://aptgugu.com/og.png',
        width: 1200,
        height: 630,
        alt: '서울 아파트 가격 계산기 - 대출 및 자산 기반 시뮬레이션',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '서울 아파트 가격 계산기 - 대출 및 자산 기반 시뮬레이션',
    description: '현금 + 연봉으로 살 수 있는 서울 아파트 금액을 계산해보세요. 전세 or 실거주 대출 모드 제공.',
    images: ['https://aptgugu.com/og.png'],
  },
};

// 닉네임 페이지 메타데이터
export const nicknameMetadata: Metadata = {
  title: '닉네임 입력 - 아파트 대출 계산기',
  description: '당신만의 닉네임으로 계산 결과를 저장하고 공유해보세요!',
  ...commonMetadata,
  openGraph: {
    title: '닉네임 입력 - 아파트 대출 계산기',
    description: '당신만의 닉네임으로 계산 결과를 저장하고 공유해보세요!',
    url: 'https://aptgugu.com/nickname',
    siteName: 'AptGugu',
    images: [
      {
        url: 'https://aptgugu.com/og.png',
        width: 1200,
        height: 630,
        alt: '닉네임 입력 - 아파트 대출 계산기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '닉네임 입력 - 아파트 대출 계산기',
    description: '당신만의 닉네임으로 계산 결과를 저장하고 공유해보세요!',
    images: ['https://aptgugu.com/og.png'],
  },
};

// 결과 페이지 메타데이터
export const resultMetadata: Metadata = {
  title: '계산 결과 - 내 아파트 구매 가능 금액은?',
  description: '입력한 정보로 계산된 서울 아파트 매수 가능 금액을 확인하세요.',
  ...commonMetadata,
  openGraph: {
    title: '계산 결과 - 내 아파트 구매 가능 금액은?',
    description: '입력한 정보로 계산된 서울 아파트 매수 가능 금액을 확인하세요.',
    url: 'https://aptgugu.com/result',
    siteName: 'AptGugu',
    images: [
      {
        url: 'https://aptgugu.com/og.png',
        width: 1200,
        height: 630,
        alt: '계산 결과 - 내 아파트 구매 가능 금액은?',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '계산 결과 - 내 아파트 구매 가능 금액은?',
    description: '입력한 정보로 계산된 서울 아파트 매수 가능 금액을 확인하세요.',
    images: ['https://aptgugu.com/og.png'],
  },
};

// 투자 계획 페이지 메타데이터
export const planMetadata: Metadata = {
  title: '구매 자금 계획표 - 실거주 or 갭투자 전략',
  description: '내 자금 구성에 따라 어떤 방식으로 아파트를 매수할 수 있는지 계획표로 정리해드립니다.',
  ...commonMetadata,
  openGraph: {
    title: '구매 자금 계획표 - 실거주 or 갭투자 전략',
    description: '내 자금 구성에 따라 어떤 방식으로 아파트를 매수할 수 있는지 계획표로 정리해드립니다.',
    url: 'https://aptgugu.com/result/plan',
    siteName: 'AptGugu',
    images: [
      {
        url: 'https://aptgugu.com/og.png',
        width: 1200,
        height: 630,
        alt: '구매 자금 계획표 - 실거주 or 갭투자 전략',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '구매 자금 계획표 - 실거주 or 갭투자 전략',
    description: '내 자금 구성에 따라 어떤 방식으로 아파트를 매수할 수 있는지 계획표로 정리해드립니다.',
    images: ['https://aptgugu.com/og.png'],
  },
};

// 최종 결과 페이지 메타데이터
export const finalMetadata: Metadata = {
  title: '추천 아파트 결과 - 서울에서 가능한 아파트',
  description: '내 자산과 대출로 가능한 서울 아파트 리스트를 추천해드립니다.',
  ...commonMetadata,
  openGraph: {
    title: '추천 아파트 결과 - 서울에서 가능한 아파트',
    description: '내 자산과 대출로 가능한 서울 아파트 리스트를 추천해드립니다.',
    url: 'https://aptgugu.com/result/final',
    siteName: 'AptGugu',
    images: [
      {
        url: 'https://aptgugu.com/og.png',
        width: 1200,
        height: 630,
        alt: '추천 아파트 결과 - 서울에서 가능한 아파트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '추천 아파트 결과 - 서울에서 가능한 아파트',
    description: '내 자산과 대출로 가능한 서울 아파트 리스트를 추천해드립니다.',
    images: ['https://aptgugu.com/og.png'],
  },
}; 