"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { shareContent, getHomeShareData } from "@/utils/share";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // 지정된 순서로 이미지 배열 설정 (1>3>5>2>4)
  const [orderedImages] = useState<string[]>([
    "home-image-01.png",
    "home-image-03.png",
    "home-image-05.png",
    "home-image-02.png",
    "home-image-04.png",
  ]);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 공유 링크인지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const sharedParam = urlParams.get("shared");
    if (sharedParam === "true") {
      setIsShared(true);
      setShareUrl(window.location.href);
    }

    // Google sitemap ping (프로덕션에서만)
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
  }, []);

  // 공유하기 핸들러
  const handleShare = async () => {
    try {
      const shareData = getHomeShareData();
      await shareContent(shareData);
    } catch (error) {
      console.error("공유 오류:", error);
    }
  };

  return (
    <>
      <Head>
        <title>아파트 대출 계산기 - 내 자산으로 가능한 아파트 확인!</title>
        <meta
          name="description"
          content="연봉과 자산을 입력하면, 전세 활용 or 실거주 대출로 내게 맞는 아파트 금액을 계산해줍니다."
        />
        <meta
          name="keywords"
          content="아파트 대출 계산기, 아파트 구매 계산기, 서울 아파트 대출, 갭투자 계산기, 실거주 계산, 부동산 계산기, 아파트담보대출 계산, 내 집 마련 계산기"
        />
        <meta
          property="og:title"
          content="아파트 대출 계산기 - 내 자산으로 가능한 아파트 확인!"
        />
        <meta
          property="og:description"
          content="연봉과 자산을 입력하면, 전세 활용 or 실거주 대출로 내게 맞는 아파트 금액을 계산해줍니다."
        />
        <meta property="og:image" content="https://aptgugu.com/og.png" />
        <meta property="og:url" content="https://aptgugu.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="아파트 대출 계산기 - 내 자산으로 가능한 아파트 확인!"
        />
        <meta
          name="twitter:description"
          content="연봉과 자산을 입력하면, 전세 활용 or 실거주 대출로 내게 맞는 아파트 금액을 계산해줍니다."
        />
        <meta name="twitter:image" content="https://aptgugu.com/og.png" />
      </Head>
      <div className="min-h-screen bg-white flex flex-col items-center py-12 pb-32">
        {/* 상단 텍스트 */}
        <div className="w-full max-w-md text-center px-5">
          <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-2">
            내 소득으로 얼마까지
            <br />
            아파트를 살 수 있을까?
          </h1>
          <p className="text-grey-80 text-base font-medium leading-6 tracking-[-0.32px] mb-[60px]">
            투자와 실거주를 고려하여
            <br />
            내가 살 수 있는 아파트 가격을 계산해요
          </p>
        </div>

        {/* 이미지 슬라이더 - 좌우 패딩 없음 */}
        <div className="image-slider-container my-5 w-full">
          <div className="image-slider">
            {/* 첫 번째 세트 */}
            {orderedImages.map((imageName, index) => (
              <div key={`first-${index}`} className="image-card">
                <img
                  src={`/images/${imageName}`}
                  alt={`아파트 이미지 ${index + 1}`}
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            ))}
            {/* 두 번째 세트 (무한 루프용) */}
            {orderedImages.map((imageName, index) => (
              <div key={`second-${index}`} className="image-card">
                <img
                  src={`/images/${imageName}`}
                  alt={`아파트 이미지 ${index + 1}`}
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 수평형 광고 삽입 - iOS 앱에서는 제외됨 */}

        {/* 콘텐츠 섹션 */}
        <div className="w-full max-w-md px-5 my-6 mb-40">
          {/* 2025.10.15 최신 주택시장 안정화 대책 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <h2 className="text-blue-700 text-lg font-bold">
                주택시장 안정화 대책
              </h2>
            </div>
            <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
              <p className="text-blue-600 text-sm font-semibold mb-2">
                2025년 10월 15일 발표 시행
              </p>
              <p className="text-grey-80 text-sm leading-relaxed">
                투기 억제를 위한 강화된 규제로 규제지역 확대, 주담대 한도 제한, 스트레스 DSR 상향 등을 포함합니다.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-blue-700 font-semibold mb-1">
                  🏢 규제지역 확대
                </p>
                <p className="text-grey-80 text-xs">
                  서울 25개 전체 구역과 경기도 12개 주요 지역이 규제지역으로 지정되어 더욱 강화된 대출 심사가 적용됩니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-blue-700 font-semibold mb-1">
                  💰 가격구간별 주담대 한도 제한
                </p>
                <p className="text-grey-80 text-xs">
                  15억 이하 6억원, 15-25억 4억원, 25억 초과 2억원으로 가격구간별 차등 적용하여 고가 주택 투기를 억제합니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-blue-700 font-semibold mb-1">
                  📈 스트레스 DSR 3.0%로 상향
                </p>
                <p className="text-grey-80 text-xs">
                  기존 1.5%에서 3.0%로 상향 조정되어 금리 상승 리스크를 더욱 보수적으로 반영합니다.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-blue-700 font-semibold mb-1">
                  🏠 1주택자 전세대출 이자 DSR 차감
                </p>
                <p className="text-grey-80 text-xs">
                  1주택 보유자의 전세대출 이자를 DSR 계산 시 차감하여 실수요자를 지원합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-grey-100 text-lg font-bold mb-3">
              왜 아파트 가격 계산이 중요할까요?
            </h2>
            <div className="space-y-4 text-grey-80 text-sm leading-relaxed">
              <div>
                <p className="font-bold text-grey-100 mb-1">실거주 vs 갭투자</p>
                <p>각각 다른 대출 조건과 계산 방식이 적용돼요.</p>
              </div>
              <div>
                <p className="font-bold text-grey-100 mb-1">DSR 규제</p>
                <p>총부채원리금상환비율에 따라 대출 한도가 결정돼요.</p>
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-700 text-xs font-medium leading-relaxed">
                    📢{" "}
                    <span className="font-bold">
                      2025.10.15 최신 주택시장 안정화 대책 시행
                    </span>
                    <br />
                    스트레스 DSR 3.0%로 상향, 가격구간별 주담대 한도 제한으로 더욱 보수적인 대출 심사
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold text-grey-100 mb-1">LTV 한도</p>
                <p>주택담보대출비율은 일반적으로 70%까지 가능해요.</p>
              </div>
              <div>
                <p className="font-bold text-grey-100 mb-1">신용대출 활용</p>
                <p>투자 시 연소득의 120%까지 신용대출 이용 가능해요.</p>
              </div>
            </div>
          </div>

          {/* 추가 유용한 정보 섹션 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-grey-100 text-base font-bold mb-3">
              💡 계산기 활용 팁
            </h3>
            <div className="space-y-2 text-grey-80 text-sm">
              <p>
                • 배우자 소득도 함께 입력하면 더 정확한 결과를 얻을 수 있어요
              </p>
              <p>• 보유자산에는 예금, 적금, 주식 등을 모두 포함해주세요</p>
              <p>• 갭투자와 실거주 결과를 비교해서 최적의 선택을 하세요</p>
            </div>
          </div>

          {/* 콘텐츠 페이지 링크 섹션 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="text-grey-100 text-base font-bold mb-4">
              📚 더 많은 정보 보기
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/guide"
                className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="text-blue-600 text-lg mb-1">💡</div>
                <div className="text-blue-700 text-xs font-semibold">
                  구매 가이드
                </div>
              </Link>
              <Link
                href="/news"
                className="bg-green-50 rounded-lg p-3 text-center border border-green-200 hover:bg-green-100 transition-colors"
              >
                <div className="text-green-600 text-lg mb-1">📰</div>
                <div className="text-green-700 text-xs font-semibold">
                  부동산 뉴스
                </div>
              </Link>
              <Link
                href="/dictionary"
                className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <div className="text-purple-600 text-lg mb-1">📖</div>
                <div className="text-purple-700 text-xs font-semibold">
                  용어 사전
                </div>
              </Link>
              <Link
                href="/faq"
                className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200 hover:bg-orange-100 transition-colors"
              >
                <div className="text-orange-600 text-lg mb-1">❓</div>
                <div className="text-orange-700 text-xs font-semibold">
                  자주 묻는 질문
                </div>
              </Link>
            </div>
          </div>

          {/* 부동산 시장 정보 섹션 */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-grey-100 text-base font-bold mb-3">
              📊 2025년 부동산 시장 전망
            </h3>
            <div className="space-y-3 text-grey-80 text-sm">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-grey-100 font-semibold text-xs mb-1">
                  10.15 안정화 대책 영향
                </p>
                <p className="text-grey-80 text-xs">
                  규제지역 확대와 주담대 한도 제한으로 더욱 신중한 투자 계획 필요
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-grey-100 font-semibold text-xs mb-1">
                  금리 안정세 전망
                </p>
                <p className="text-grey-80 text-xs">
                  기준금리 3.5% 수준에서 유지될 것으로 예상
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-grey-100 font-semibold text-xs mb-1">
                  신규 공급 물량 증가
                </p>
                <p className="text-grey-80 text-xs">
                  수도권 중심으로 공급 확대 예정
                </p>
              </div>
            </div>
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
              className="flex-1 h-14 justify-center items-center gap-2.5 flex bg-[#7577FF] text-white rounded-[300px] font-semibold"
            >
              시작하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
