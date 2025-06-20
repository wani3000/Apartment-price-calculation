import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '내 연봉으로 살 수 있는 아파트 가격은 얼마일까?',
  description: '내 연봉으로 살 수 있는 아파트 가격을 계산해 보세요!',
  openGraph: {
    title: '내 연봉으로 살 수 있는 아파트 가격은 얼마일까?',
    description: '내 연봉으로 살 수 있는 아파트 가격을 계산해 보세요!',
    // 여기에 대표 이미지 URL을 추가할 수 있습니다.
    // images: ['/og-image.png'],
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
        {/* Google AdSense 사이트 소유권 확인용 메타 태그 */}
        <meta name="google-adsense-account" content="ca-pub-6858835884991650" />
        
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* Google AdSense 스크립트 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6858835884991650"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-pretendard">{children}</body>
    </html>
  );
} 