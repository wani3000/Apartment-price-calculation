"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function RegulationPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(""); // 초기값을 빈 문자열로 설정
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 기존 선택사항이 있다면 불러오기, 없으면 기본값 'new' 설정
    const savedRegulationOption = localStorage.getItem("regulationOption");
    if (savedRegulationOption) {
      setSelectedOption(savedRegulationOption);
    } else {
      setSelectedOption("latest"); // 기본값은 10.15 최신 정책
    }

    setIsLoading(false);
  }, []);

  const handleSubmit = () => {
    // 선택사항 저장
    localStorage.setItem("regulationOption", selectedOption);

    // 선택에 따라 다른 페이지로 이동
    if (selectedOption === "existing") {
      // 기존 LTV · DSR 적용하기 선택 시 기존 결과 페이지로
      router.push("/result");
    } else if (selectedOption === "new") {
      // 6.27 규제안 적용하기 선택 시 6.27 규제 페이지로
      router.push("/result/new-regulation");
    } else if (selectedOption === "latest") {
      // 10.15 최신 정책 적용하기 선택 시 자세한 결과 페이지로
      router.push("/result/final?regulation=latest");
    }
  };

  return (
    <div className="bg-white flex flex-col h-screen overflow-hidden">
      {/* 헤더 */}
      <Header backUrl="/calculator" />

      {/* 메인 컨텐츠 영역 */}
      <div
        className="flex-1 px-5"
        style={{
          paddingTop:
            "calc(var(--page-header-offset) + env(safe-area-inset-top))",
          paddingBottom:
            "calc(var(--page-bottom-cta-offset) + env(safe-area-inset-bottom))",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 타이틀 */}
        <div className="mb-6">
          <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px]">
            어떤 부동산 정책을
            <br />
            적용하여 계산할까요?
          </h1>
        </div>

        {/* 설명 */}
        <div className="mb-8">
          <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px]">
            2025년 10월 15일 발표된 최신 주택시장 안정화 대책이 시행되고 있어요.
            <br />
            <br />
            새로운 정책에는 규제지역 확대, 주담대 한도 제한 강화, 스트레스 DSR
            상향 등이 포함되어 있어요.
            <br />
            <br />
            가장 정확한 계산을 위해 최신 정책 적용을 권장해요.
          </p>
        </div>

        {/* 선택 옵션들 */}
        <div className="space-y-5">
          {/* 10.15 최신 정책 적용하기 (권장) */}
          <button
            onClick={() => !isLoading && setSelectedOption("latest")}
            disabled={isLoading}
            className={`w-full px-3 py-4 flex items-center justify-center rounded-lg border transition-colors relative ${
              isLoading
                ? "border-[#868E96] bg-white opacity-50"
                : selectedOption === "latest"
                  ? "border-[#000000] bg-gradient-to-r from-blue-50 to-indigo-50"
                  : "border-[#868E96] bg-white"
            }`}
          >
            {/* 추천 배지 */}
            <div className="absolute -top-2 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              최신
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col items-start">
                <span
                  className={`text-base font-bold leading-none tracking-[-0.16px] ${
                    selectedOption === "latest"
                      ? "text-[#000000]"
                      : "text-[#868E96]"
                  }`}
                >
                  10.15 최신 정책 적용하기
                </span>
                <span className="text-xs text-grey-70 mt-1">
                  규제지역 확대, 주담대 한도 제한 등 반영
                </span>
              </div>
              {selectedOption === "latest" && (
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.2 8.4L9.6 10.8L16.8 3.6"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* 6.27 규제안 적용하기 */}
          <button
            onClick={() => !isLoading && setSelectedOption("new")}
            disabled={isLoading}
            className={`w-full h-14 px-3 flex items-center justify-center rounded-lg border transition-colors ${
              isLoading
                ? "border-[#868E96] bg-white opacity-50"
                : selectedOption === "new"
                  ? "border-[#000000] bg-white"
                  : "border-[#868E96] bg-white"
            }`}
          >
            <div
              className="flex justify-between items-center w-full"
              style={{ minHeight: "24px" }}
            >
              <span
                className={`text-base font-bold leading-none tracking-[-0.16px] ${
                  selectedOption === "new" ? "text-[#000000]" : "text-[#868E96]"
                }`}
              >
                6.27 규제안 적용하기
              </span>
              {selectedOption === "new" && (
                <div
                  className="w-6 h-full flex items-center justify-center flex-shrink-0"
                  style={{ marginTop: "6px" }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.2 8.4L9.6 10.8L16.8 3.6"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* 기존 LTV · DSR 적용하기 */}
          <button
            onClick={() => !isLoading && setSelectedOption("existing")}
            disabled={isLoading}
            className={`w-full h-14 px-3 flex items-center justify-center rounded-lg border transition-colors ${
              isLoading
                ? "border-[#868E96] bg-white opacity-50"
                : selectedOption === "existing"
                  ? "border-[#000000] bg-white"
                  : "border-[#868E96] bg-white"
            }`}
          >
            <div
              className="flex justify-between items-center w-full"
              style={{ minHeight: "24px" }}
            >
              <span
                className={`text-base font-bold leading-none tracking-[-0.16px] ${
                  selectedOption === "existing"
                    ? "text-[#000000]"
                    : "text-[#868E96]"
                }`}
              >
                기존 LTV · DSR 적용하기
              </span>
              {selectedOption === "existing" && (
                <div
                  className="w-6 h-full flex items-center justify-center flex-shrink-0"
                  style={{ marginTop: "4px" }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.2 8.4L9.6 10.8L16.8 3.6"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 safe-area-inset-bottom"
        style={{ zIndex: 1000 }}
      >
        <button
          onClick={handleSubmit}
          disabled={isLoading || !selectedOption}
          className={`flex h-14 w-full justify-center items-center rounded-[300px] font-bold text-lg transition ${
            isLoading || !selectedOption
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#000000] text-white hover:bg-[#111111]"
          }`}
        >
          {isLoading ? "로딩 중..." : "다음"}
        </button>
      </div>
    </div>
  );
}
