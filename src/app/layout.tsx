import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' // 실제 도메인으로 변경 필요
    : 'http://localhost:3000'
  ),
  title: '내 연봉으로 살 수 있는 아파트 가격은 얼마일까?',
  description: '내 연봉으로 살 수 있는 아파트 가격을 계산해 보세요!',
  openGraph: {
    title: '내 연봉으로 살 수 있는 아파트 가격은 얼마일까?',
    description: '내 연봉으로 살 수 있는 아파트 가격을 계산해 보세요!',
    type: 'website',
    siteName: '아파트 가격 계산기',
    locale: 'ko_KR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '아파트 가격 계산기 - 내 연봉으로 살 수 있는 아파트 가격을 계산해보세요',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '내 연봉으로 살 수 있는 아파트 가격은 얼마일까?',
    description: '내 연봉으로 살 수 있는 아파트 가격을 계산해 보세요!',
    images: ['/og-image.png'],
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
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* Google AdSense Auto Ads */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6858835884991650" crossOrigin="anonymous"></script>
      </head>
      <body className="font-pretendard">{children}</body>
    </html>
  );
} 