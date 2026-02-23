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

export default function RegionPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<
    "regulated" | "non-regulated"
  >("regulated");
  const [siDo, setSiDo] = useState("서울");
  const [siGunGu, setSiGunGu] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showRegionInfoModal, setShowRegionInfoModal] = useState(false);

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
        gu: "",
      }),
    );
  }, [siDo, siGunGu]);

  useEffect(() => {
    const options = REGION_OPTIONS[siDo] || [];
    if (options.length === 0) {
      setSiGunGu("");
      return;
    }

    if (!options.includes(siGunGu)) {
      setSiGunGu(options[0]);
    }
  }, [siDo, siGunGu]);

  const handleSubmit = () => {
    // 다음 페이지(정책 선택 페이지)로 이동
    router.push("/regulation");
  };

  return (
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden">
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

            <div className="mt-8 pt-6 border-t border-grey-40">
              <h3 className="text-[18px] font-bold text-grey-100 mb-3">
                정책 정확도 향상을 위한 지역 상세 입력
              </h3>
              <p className="text-[15px] text-grey-80 leading-[22px] mb-6">
                10.15 정책 계산 시 규제지역 판정을 더 정확히 하기 위한
                선택값이에요.
              </p>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="siDo"
                    className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2"
                  >
                    시/도
                  </label>
                  <select
                    id="siDo"
                    value={siDo}
                    onChange={(e) => setSiDo(e.target.value)}
                    onFocus={() => setFocusedField("siDo")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-14 px-3 py-2.5 rounded-lg bg-white text-grey-100 text-base outline-none transition-colors ${
                      focusedField === "siDo"
                        ? "border-2 border-primary"
                        : "border border-grey-40"
                    }`}
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
                  <label
                    htmlFor="siGunGu"
                    className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2"
                  >
                    시/군/구
                  </label>
                  <select
                    id="siGunGu"
                    value={siGunGu}
                    onChange={(e) => setSiGunGu(e.target.value)}
                    onFocus={() => setFocusedField("siGunGu")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-14 px-3 py-2.5 rounded-lg bg-white text-grey-100 text-base outline-none transition-colors ${
                      focusedField === "siGunGu"
                        ? "border-2 border-primary"
                        : "border border-grey-40"
                    }`}
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

              </div>
            </div>

            {/* 규제지역 안내 모달 트리거 */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowRegionInfoModal(true)}
                className="inline-flex items-center gap-1 text-[15px] font-semibold leading-[22px] text-grey-100"
              >
                <span>규제지역이 무엇인가요?</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 규제지역 설명 모달 */}
      {showRegionInfoModal && (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/40">
          <div className="w-full bg-white rounded-t-2xl p-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
            <h3 className="text-grey-100 text-base font-bold mb-3">
              규제지역과 비규제지역 안내
            </h3>
            <div className="space-y-2">
              <p className="text-grey-80 text-sm leading-6">
                <span className="font-semibold text-grey-100">규제지역</span>은
                투기과열지구, 조정대상지역처럼 정부가 대출과 세제를 더 엄격하게
                관리하는 지역이에요. 그래서 일반적으로 LTV, DSR, 대출 한도
                조건이 더 보수적으로 적용됩니다.
              </p>
              <p className="text-grey-80 text-sm leading-6">
                <span className="font-semibold text-grey-100">비규제지역</span>
                은 규제지역보다 대출 요건이 상대적으로 완화되어 같은 소득과
                자산 조건에서도 가능한 대출 한도가 더 크게 나올 수 있어요.
              </p>
            </div>
            <p className="text-grey-70 text-xs leading-5 mt-3">
              ※ 지역별 규제는 정책에 따라 수시로 변경될 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => setShowRegionInfoModal(false)}
              className="mt-4 flex h-14 w-full justify-center items-center rounded-[300px] bg-primary text-white font-semibold text-base"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 safe-area-inset-bottom">
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
