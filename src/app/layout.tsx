import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '아파트 계산기 | aptgugu',
  description: '내 자산과 연봉으로 살 수 있는 서울 아파트를 계산해보세요.',
  openGraph: {
    title: '아파트 계산기 | aptgugu',
    description: '내 자산과 연봉으로 살 수 있는 서울 아파트를 계산해보세요.',
    url: 'https://aptgugu.com',
    siteName: 'aptgugu',
    images: [
      {
        url: 'https://aptgugu.com/og.png',
        width: 1200,
        height: 630,
        alt: 'aptgugu',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
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