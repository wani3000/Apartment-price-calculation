import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '서울 아파트 최대 구매 가능 금액 계산기 | AptGugu',
  description: '연소득과 자산을 입력하면 실거주 기준 최대 얼마까지 아파트를 살 수 있는지 계산해드립니다. 서울 아파트 투자 분석까지 한번에!',
  keywords: '서울 아파트 계산기, 실거주 아파트, 갭투자, 주택 구매 가능 금액, 부동산 계산기, aptgugu',
  authors: [{ name: 'AptGugu' }],
  creator: 'AptGugu',
  publisher: 'AptGugu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aptgugu.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '내가 살 수 있는 아파트는? | AptGugu',
    description: '연봉과 자산으로 내 집 마련 가능 금액을 바로 확인하세요.',
    url: 'https://aptgugu.com',
    siteName: 'AptGugu',
    images: [
      {
        url: 'https://aptgugu.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AptGugu - 아파트 구매 가능 금액 계산기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AptGugu | 내가 살 수 있는 아파트 계산기',
    description: '서울 부동산, 지금 얼마나 가능한지 확인해보세요.',
    images: ['https://aptgugu.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // 구글 서치콘솔 인증 코드로 교체 필요
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link rel="icon" href="/favicon.png" />
        {/* Google AdSense Auto Ads */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6858835884991650" crossOrigin="anonymous"></script>
      </head>
      <body className="font-pretendard">{children}</body>
    </html>
  );
} 