import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '아파트 구매 계산기',
  description: '내 소득으로 살 수 있는 아파트 가격 계산하기',
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
      <body className="font-pretendard min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
} 