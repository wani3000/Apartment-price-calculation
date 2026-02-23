import type { Metadata } from "next";
import Link from "next/link";
import SharedRedirect from "./SharedRedirect";

export const metadata: Metadata = {
  title: "공유 결과 확인 - 아파트 구구",
  description: "공유받은 아파트 구매 가능 금액 결과를 확인해보세요.",
  openGraph: {
    title: "공유 결과 확인 - 아파트 구구",
    description: "공유받은 아파트 구매 가능 금액 결과를 확인해보세요.",
    url: "https://aptgugu.com/result/shared",
    siteName: "AptGugu",
    images: [
      {
        url: "https://aptgugu.com/og.png",
        width: 1200,
        height: 630,
        alt: "공유 결과 확인 - 아파트 구구",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "공유 결과 확인 - 아파트 구구",
    description: "공유받은 아파트 구매 가능 금액 결과를 확인해보세요.",
    images: ["https://aptgugu.com/og.png"],
  },
};

export default function SharedResultPage() {
  return (
    <main className="min-h-[100dvh] bg-white flex items-center justify-center px-6">
      <SharedRedirect />
      <div className="w-full max-w-md rounded-2xl border border-[#E9ECEF] p-6">
        <h1 className="text-[#212529] text-[22px] font-bold leading-8 tracking-[-0.22px] mb-2">
          공유 결과를 불러오는 중입니다
        </h1>
        <p className="text-[#495057] text-[15px] leading-6 tracking-[-0.15px] mb-6">
          자동으로 이동하지 않으면 아래 버튼을 눌러 결과를 확인하세요.
        </p>
        <Link
          href="/nickname"
          className="w-full h-14 bg-black text-white rounded-[300px] flex items-center justify-center text-[16px] font-semibold"
        >
          내가 살 수 있는 아파트 계산하기
        </Link>
      </div>
    </main>
  );
}
