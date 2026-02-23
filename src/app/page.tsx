"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { shareContent, getHomeShareData } from "@/utils/share";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const [orderedImages] = useState<string[]>([
    "home-image-01.png",
    "home-image-03.png",
    "home-image-05.png",
    "home-image-02.png",
    "home-image-04.png",
  ]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const sharedParam = urlParams.get("shared");
    const manualHomeParam = urlParams.get("manualHome");
    if (sharedParam === "true") {
      setIsShared(true);
      setShareUrl(window.location.href);
    }
    if (manualHomeParam !== "1" && sharedParam !== "true") {
      const hasCalculatedData = Boolean(localStorage.getItem("calculatorData"));
      if (hasCalculatedData) {
        router.replace("/result/final");
        return;
      }
    }

    if (process.env.NODE_ENV === "production") {
      fetch(
        "https://www.google.com/ping?sitemap=https://aptgugu.com/sitemap.xml",
      )
        .then((response) => {
          if (response.ok) {
            console.log("✅ Google sitemap ping successful");
          } else {
            console.log("❌ Google sitemap ping failed:", response.status);
          }
        })
        .catch((error) => {
          console.error("❌ Error sending Google sitemap ping:", error);
        });
    }
  }, [router]);

  const handleShare = async () => {
    try {
      const shareData = getHomeShareData();
      await shareContent(shareData);
    } catch (error) {
      console.error("공유 오류:", error);
    }
  };

  return (
    <div
      className="h-[100dvh] bg-white flex flex-col items-center"
      style={{
        paddingTop: "48px",
        paddingBottom: "env(safe-area-inset-bottom)",
        overflow: "hidden",
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
      }}
    >
      {/* 상단 메뉴 버튼 */}
      <Header showBack={false} showBorder={false} logoLink="/" />

      {/* 상단 텍스트 */}
      <div className="w-full max-w-md text-center px-5 mt-8">
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
          내 소득으로 얼마까지
          <br />
          아파트를 살 수 있을까?
        </h1>
        <p className="text-grey-80 text-base font-medium leading-6 tracking-[-0.32px] mb-8">
          투자와 실거주를 고려하여
          <br />
          내가 살 수 있는 아파트 가격을 계산해요
        </p>
      </div>

      {/* 이미지 슬라이더 */}
      <div className="image-slider-container my-5 w-full">
        <div className="image-slider">
              {orderedImages.map((imageName, index) => (
                <div key={`first-${index}`} className="image-card">
                  <Image
                    src={`/images/${imageName}`}
                    alt={`아파트 이미지 ${index + 1}`}
                    width={320}
                    height={220}
                    sizes="(max-width: 768px) 80vw, 320px"
                    unoptimized
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              ))}
              {orderedImages.map((imageName, index) => (
                <div key={`second-${index}`} className="image-card">
                  <Image
                    src={`/images/${imageName}`}
                    alt={`아파트 이미지 ${index + 1}`}
                    width={320}
                    height={220}
                    sizes="(max-width: 768px) 80vw, 320px"
                    unoptimized
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              ))}
        </div>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
        <div
          className="flex w-full max-w-md px-5 pt-10 pb-[25px] gap-3 items-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 31.25%)",
          }}
        >
          <button
            onClick={handleShare}
            className="flex-1 h-14 justify-center items-center gap-2.5 flex border border-[#ADB5BD] rounded-[300px] text-grey-100 font-medium"
          >
            공유하기
          </button>
          <button
            onClick={() => router.push("/nickname")}
            className="flex-1 h-14 justify-center items-center gap-2.5 flex bg-[#000000] text-white rounded-[300px] font-semibold"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
