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
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="font-pretendard">{children}</body>
    </html>
  );
} 