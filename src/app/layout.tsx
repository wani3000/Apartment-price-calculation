import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아파트 구구 - 아파트 구매 대출 계산기",
  description:
    "연봉과 자산을 입력하면, 갭투자 또는 실거주에 적합한 아파트 매수 가능 금액을 계산해드립니다.",
  keywords:
    "아파트 대출 계산기, 아파트 구매 계산기, 서울 아파트 대출, 갭투자 계산기, 실거주 계산, 부동산 계산기, 아파트담보대출 계산, 내 집 마련 계산기",
  authors: [{ name: "AptGugu" }],
  creator: "AptGugu",
  publisher: "AptGugu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aptgugu.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "아파트 구구 - 아파트 구매 대출 계산기",
    description:
      "연봉과 자산을 입력하면, 갭투자 또는 실거주에 적합한 아파트 매수 가능 금액을 계산해드립니다.",
    url: "https://aptgugu.com",
    siteName: "AptGugu",
    images: [
      {
        url: "https://aptgugu.com/og.png",
        width: 1200,
        height: 630,
        alt: "아파트 구구 - 아파트 구매 대출 계산기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "아파트 구구 - 아파트 구매 대출 계산기",
    description:
      "연봉과 자산을 입력하면, 갭투자 또는 실거주에 적합한 아파트 매수 가능 금액을 계산해드립니다.",
    images: ["https://aptgugu.com/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
        {/* Google AdSense는 정적 빌드 시 제외됨 - iOS 앱에서는 표시 안 됨 */}
      </head>
      <body className="font-pretendard">{children}</body>
    </html>
  );
}
