"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

const REGION_OPTIONS: Record<string, string[]> = {
  서울: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  경기: [
    "과천시",
    "광명시",
    "의왕시",
    "하남시",
    "성남시",
    "수원시",
    "안양시",
    "용인시",
  ],
  인천: [],
  부산: [],
  대구: [],
  광주: [],
  대전: [],
  울산: [],
  세종: [],
  강원: [],
  충북: [],
  충남: [],
  전북: [],
  전남: [],
  경북: [],
  경남: [],
  제주: [],
};

const GYEONGGI_GU_OPTIONS: Record<string, string[]> = {
  성남시: ["분당구", "수정구", "중원구"],
  수원시: ["영통구", "장안구", "팔달구"],
  안양시: ["동안구"],
  용인시: ["수지구"],
};

export default function RegionPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<
    "regulated" | "non-regulated"
  >("regulated");
  const [siDo, setSiDo] = useState("서울");
  const [siGunGu, setSiGunGu] = useState("");
  const [gu, setGu] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 저장된 지역 옵션 가져오기
    const savedRegion = localStorage.getItem("selectedRegion");
    if (savedRegion) {
      setSelectedRegion(savedRegion as "regulated" | "non-regulated");
    }

    const savedPolicyRegionDetails = localStorage.getItem(
      "policyRegionDetails",
    );
    if (savedPolicyRegionDetails) {
      const parsed = JSON.parse(savedPolicyRegionDetails);
      setSiDo(parsed.siDo || "서울");
      setSiGunGu(parsed.siGunGu || "");
      setGu(parsed.gu || "");
    }
  }, []);

  // 지역 선택 시 즉시 저장
  useEffect(() => {
    localStorage.setItem("selectedRegion", selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    localStorage.setItem(
      "policyRegionDetails",
      JSON.stringify({
        siDo,
        siGunGu,
        gu,
      }),
    );
  }, [siDo, siGunGu, gu]);

  useEffect(() => {
    const options = REGION_OPTIONS[siDo] || [];
    if (options.length === 0) {
      setSiGunGu("");
      setGu("");
      return;
    }

    if (!options.includes(siGunGu)) {
      setSiGunGu(options[0]);
      setGu("");
    }
  }, [siDo, siGunGu]);

  useEffect(() => {
    const guOptions = GYEONGGI_GU_OPTIONS[siGunGu] || [];
    if (guOptions.length === 0) {
      if (gu) setGu("");
      return;
    }
    if (!guOptions.includes(gu)) {
      setGu(guOptions[0]);
    }
  }, [siGunGu, gu]);

  const handleSubmit = () => {
    // 다음 페이지(정책 선택 페이지)로 이동
    router.push("/regulation");
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* 메인 컨텐츠 영역 */}
      <div
        className="flex-1 flex flex-col px-5"
        style={{
          paddingTop:
            "calc(var(--page-header-offset) + env(safe-area-inset-top))",
          paddingBottom: "calc(120px + env(safe-area-inset-bottom))",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 헤더 컴포넌트 사용 */}
        <Header backUrl="/calculator" />

        {/* 타이틀 */}
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-6">
          25년 10월 15일 부동산 정책에 따라
          <br />
          규제지역이 추가되었어요
        </h1>

        {/* 선택 옵션들 */}
        <div className="space-y-8">
          {/* 지역 선택 섹션 */}
          <div>
            <h2 className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-1">
              규제 지역 여부
            </h2>
            <p className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mb-4">
              규제지역과 비규제지역은 대출 한도와 조건이 달라요.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                className={`flex px-5 py-4 justify-between items-center rounded-xl border-2 ${
                  selectedRegion === "regulated"
                    ? "border-[#000000] bg-[#F8F9FA]"
                    : "border-grey-40 bg-white"
                }`}
                onClick={() => setSelectedRegion("regulated")}
              >
                <div className="flex flex-col items-start">
                  <span className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px]">
                    규제지역
                  </span>
                  <span className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mt-1">
                    서울, 경기 일부 (투기과열지구, 조정대상지역 등)
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRegion === "regulated"
                      ? "border-[#000000] bg-[#000000]"
                      : "border-grey-40 bg-white"
                  }`}
                >
                  {selectedRegion === "regulated" && (
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5L5 9L13 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>

              <button
                className={`flex px-5 py-4 justify-between items-center rounded-xl border-2 ${
                  selectedRegion === "non-regulated"
                    ? "border-[#000000] bg-[#F8F9FA]"
                    : "border-grey-40 bg-white"
                }`}
                onClick={() => setSelectedRegion("non-regulated")}
              >
                <div className="flex flex-col items-start">
                  <span className="text-grey-100 text-base font-bold leading-6 tracking-[-0.16px]">
                    비규제지역
                  </span>
                  <span className="text-grey-80 text-sm font-normal leading-5 tracking-[-0.28px] mt-1">
                    지방 및 비규제 지역
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRegion === "non-regulated"
                      ? "border-[#000000] bg-[#000000]"
                      : "border-grey-40 bg-white"
                  }`}
                >
                  {selectedRegion === "non-regulated" && (
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5L5 9L13 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-grey-100 text-sm font-bold leading-5 mb-2">
                정책 정확도 향상을 위한 지역 상세 입력
              </h3>
              <p className="text-grey-80 text-xs leading-4 mb-3">
                10.15 정책 계산 시 규제지역 판정을 더 정확히 하기 위한
                선택값이에요.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-grey-100 text-xs font-semibold mb-1">
                    시/도
                  </label>
                  <select
                    value={siDo}
                    onChange={(e) => setSiDo(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-grey-40 bg-white text-grey-100 text-sm outline-none"
                  >
                    <option value="서울">서울</option>
                    <option value="경기">경기</option>
                    <option value="인천">인천</option>
                    <option value="부산">부산</option>
                    <option value="대구">대구</option>
                    <option value="광주">광주</option>
                    <option value="대전">대전</option>
                    <option value="울산">울산</option>
                    <option value="세종">세종</option>
                    <option value="강원">강원</option>
                    <option value="충북">충북</option>
                    <option value="충남">충남</option>
                    <option value="전북">전북</option>
                    <option value="전남">전남</option>
                    <option value="경북">경북</option>
                    <option value="경남">경남</option>
                    <option value="제주">제주</option>
                  </select>
                </div>

                <div>
                  <label className="block text-grey-100 text-xs font-semibold mb-1">
                    시/군/구
                  </label>
                  <select
                    value={siGunGu}
                    onChange={(e) => setSiGunGu(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-grey-40 bg-white text-grey-100 text-sm outline-none"
                    disabled={(REGION_OPTIONS[siDo] || []).length === 0}
                  >
                    {(REGION_OPTIONS[siDo] || []).length === 0 ? (
                      <option value="">해당 없음</option>
                    ) : (
                      (REGION_OPTIONS[siDo] || []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-grey-100 text-xs font-semibold mb-1">
                    구(선택)
                  </label>
                  <select
                    value={gu}
                    onChange={(e) => setGu(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-grey-40 bg-white text-grey-100 text-sm outline-none"
                    disabled={(GYEONGGI_GU_OPTIONS[siGunGu] || []).length === 0}
                  >
                    {(GYEONGGI_GU_OPTIONS[siGunGu] || []).length === 0 ? (
                      <option value="">선택 안함</option>
                    ) : (
                      (GYEONGGI_GU_OPTIONS[siGunGu] || []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* 규제지역 안내 */}
            <div className="mt-4">
              <h3 className="text-[16px] font-bold text-grey-100 mb-3">
                규제지역과 비규제지역의 차이
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-[15px] font-semibold text-grey-100 min-w-[100px]">
                    규제지역
                  </span>
                  <span className="text-[15px] text-grey-80 leading-[22px]">
                    LTV/DSR 제한이 강화되어 대출 한도가 줄어들어요
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-[15px] font-semibold text-grey-100 min-w-[100px]">
                    비규제지역
                  </span>
                  <span className="text-[15px] text-grey-80 leading-[22px]">
                    상대적으로 완화된 조건으로 더 많은 대출이 가능해요
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-grey-70 mt-3">
                ※ 지역별 규제는 정부 정책에 따라 변동될 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5">
        <button
          onClick={handleSubmit}
          className="flex h-14 w-full justify-center items-center rounded-[300px] bg-primary text-white font-semibold text-base"
        >
          다음
        </button>
      </div>
    </div>
  );
}
