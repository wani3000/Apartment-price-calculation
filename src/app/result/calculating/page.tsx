"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Capacitor } from "@capacitor/core";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || "";
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_CALCULATING || "";

export default function CalculatingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const policy = searchParams.get("policy") || "latest";
  const [isNativeIos, setIsNativeIos] = useState(false);
  const isAdsenseReady = Boolean(ADSENSE_CLIENT && ADSENSE_SLOT);

  const targetPath = useMemo(() => {
    if (policy === "existing") return "/result";
    if (policy === "new") return "/result/new-regulation";
    return "/result/final?regulation=latest";
  }, [policy]);

  useEffect(() => {
    setIsNativeIos(Capacitor.getPlatform() === "ios" && Capacitor.isNativePlatform());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace(targetPath);
    }, 1700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router, targetPath]);

  useEffect(() => {
    if (isNativeIos || !isAdsenseReady) return;
    try {
      ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // ignore ad init error
    }
  }, [isNativeIos, isAdsenseReady]);

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      <div
        className="flex-1 flex flex-col items-center justify-center px-5"
        style={{
          paddingTop: "max(16px, env(safe-area-inset-top))",
          paddingBottom: "calc(120px + env(safe-area-inset-bottom))",
        }}
      >
        <svg
          className="animate-spin mb-4"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="loading"
        >
          <circle cx="12" cy="12" r="9" stroke="#DEE2E6" strokeWidth="3" />
          <path
            d="M21 12A9 9 0 0 0 12 3"
            stroke="#212529"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <h1 className="text-[#212529] text-[20px] font-bold leading-7 tracking-[-0.2px] text-center">
          내가 살 수 있는 아파트 가격을 계산중이에요!
        </h1>
      </div>

      <div
        className="w-full max-w-md mx-auto px-5 pb-4"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
      >
        {!isNativeIos && isAdsenseReady ? (
          <>
            <Script
              id="adsense-calculating-script"
              strategy="afterInteractive"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
            <ins
              className="adsbygoogle block w-full rounded-2xl overflow-hidden"
              style={{ minHeight: "90px", background: "#F8F9FA" }}
              data-ad-client={ADSENSE_CLIENT}
              data-ad-slot={ADSENSE_SLOT}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          </>
        ) : (
          <div className="w-full h-[90px] rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center text-[#868E96] text-[12px]">
            광고 영역
          </div>
        )}
      </div>
    </div>
  );
}

