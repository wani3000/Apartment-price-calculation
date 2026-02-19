"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function CalculatorPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [income, setIncome] = useState("");
  const [assets, setAssets] = useState("");
  const [showSpouseIncome, setShowSpouseIncome] = useState(false);
  const [spouseIncome, setSpouseIncome] = useState("");
  const [spouseAssets, setSpouseAssets] = useState("");
  const [spouseHomeOwnerCount, setSpouseHomeOwnerCount] = useState<number>(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // 2025.10.15 정책 관련 새로운 상태들
  const [homeOwnerCount, setHomeOwnerCount] = useState<number>(0);
  const [isTenant, setIsTenant] = useState<boolean>(false);
  const [hasJeonseLoan, setHasJeonseLoan] = useState<boolean>(false);
  const [jeonseLoanPrincipal, setJeonseLoanPrincipal] = useState("");
  const [jeonseLoanRate, setJeonseLoanRate] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // 저장된 계산기 데이터 가져오기
    const calculatorDataStr = localStorage.getItem("calculatorData");
    if (calculatorDataStr) {
      const calculatorData = JSON.parse(calculatorDataStr);

      // 저장된 값이 있으면 폼에 채우기
      if (calculatorData.income) {
        setIncome(calculatorData.income.toString());
      }

      // myAssets가 있으면 개별 자산 사용, 없으면 기존 assets 사용 (하위 호환성)
      if (calculatorData.myAssets !== undefined) {
        setAssets(calculatorData.myAssets.toString());
      } else if (calculatorData.assets) {
        setAssets(calculatorData.assets.toString());
      }

      if (calculatorData.spouseIncome) {
        setSpouseIncome(calculatorData.spouseIncome.toString());
        setShowSpouseIncome(true);
      }

      if (calculatorData.spouseAssets) {
        setSpouseAssets(calculatorData.spouseAssets.toString());
        setShowSpouseIncome(true);
      }
      if (calculatorData.spouseHomeOwnerCount !== undefined) {
        setSpouseHomeOwnerCount(calculatorData.spouseHomeOwnerCount);
        setShowSpouseIncome(true);
      }

      // 새로운 정책 관련 필드들 로드
      if (calculatorData.homeOwnerCount !== undefined) {
        setHomeOwnerCount(calculatorData.homeOwnerCount);
      }
      if (calculatorData.isTenant !== undefined) {
        setIsTenant(calculatorData.isTenant);
      }
      if (calculatorData.hasJeonseLoan !== undefined) {
        setHasJeonseLoan(calculatorData.hasJeonseLoan);
      }
      if (calculatorData.jeonseLoanPrincipal) {
        setJeonseLoanPrincipal(calculatorData.jeonseLoanPrincipal.toString());
      }
      if (calculatorData.jeonseLoanRate !== undefined) {
        setJeonseLoanRate(calculatorData.jeonseLoanRate.toString());
      }
    }
  }, []);

  // 숫자를 한글 표기로 변환 (예: 12000 -> 1억 2,000만 원)
  const formatToKorean = (num: string) => {
    if (!num || num === "0") return "";

    const parsed = parseInt(num, 10);
    if (isNaN(parsed)) return "";

    if (parsed < 10000) {
      return `${parsed.toLocaleString()}만 원`;
    } else {
      const eok = Math.floor(parsed / 10000);
      const man = parsed % 10000;

      if (man === 0) {
        return `${eok.toLocaleString()}억 원`;
      } else {
        return `${eok.toLocaleString()}억 ${man.toLocaleString()}만 원`;
      }
    }
  };

  // 숫자만 입력 가능하도록 처리
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const value = e.target.value;
    // 숫자만 허용 (빈 문자열도 허용)
    if (value === "" || /^[0-9]+$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 총 보유자산 계산 (내 자산 + 배우자 자산)
    const myAssets = parseInt(assets || "0");
    const spouseAssetsValue = showSpouseIncome
      ? parseInt(spouseAssets || "0")
      : 0;
    const totalAssets = myAssets + spouseAssetsValue;

    // 입력값 저장
    const calculatorData = {
      income: parseInt(income || "0"),
      assets: totalAssets, // 총 보유자산으로 저장
      myAssets: myAssets, // 내 자산 별도 저장
      spouseAssets: spouseAssetsValue, // 배우자 자산 별도 저장
      spouseIncome: showSpouseIncome ? parseInt(spouseIncome || "0") : 0,
      spouseHomeOwnerCount: showSpouseIncome ? spouseHomeOwnerCount : 0,
      // 새로운 정책 관련 필드들
      homeOwnerCount: homeOwnerCount,
      isTenant: isTenant,
      hasJeonseLoan: hasJeonseLoan,
      jeonseLoanPrincipal: hasJeonseLoan
        ? parseInt(jeonseLoanPrincipal || "0")
        : 0,
      jeonseLoanRate: hasJeonseLoan ? parseFloat(jeonseLoanRate || "0") : 0,
    };

    localStorage.setItem("calculatorData", JSON.stringify(calculatorData));
    router.push("/region");
  };

  // 모바일 환경 감지 함수
  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768;
  };

  return (
    <div className="bg-white flex flex-col h-screen overflow-hidden">
      {/* 헤더 */}
      <Header backUrl="/nickname" />

      {/* 메인 컨텐츠 영역 */}
      <div
        className="flex-1 px-5"
        style={{
          paddingTop: "calc(max(16px, env(safe-area-inset-top)) + 60px)",
          paddingBottom: "calc(120px + env(safe-area-inset-bottom))",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 타이틀 */}
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-10">
          내 연 소득과 현재 보유자산이
          <br />
          얼마인가요?
        </h1>

        {/* 입력 필드들 */}
        <div className="space-y-6">
          {/* 연소득 입력 */}
          <div>
            <label
              htmlFor="income"
              className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2"
            >
              연소득 (만 원)
            </label>
            <div
              className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                focusedField === "income"
                  ? "border-2 border-primary"
                  : "border border-grey-40"
              }`}
            >
              <input
                id="income"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={income}
                onChange={(e) => handleNumberInput(e, setIncome)}
                onFocus={() => setFocusedField("income")}
                onBlur={() => setFocusedField(null)}
                placeholder="0"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium leading-[18px] tracking-[-0.26px] whitespace-nowrap">
                만 원
              </span>
            </div>
            {income && (
              <p className="text-primary text-[13px] font-medium leading-[18px] tracking-[-0.26px] mt-1">
                {formatToKorean(income)}
              </p>
            )}
          </div>

          {/* 현재 보유자산 입력 */}
          <div>
            <label
              htmlFor="assets"
              className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2"
            >
              현재 보유자산 (만 원)
            </label>
            <div
              className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                focusedField === "assets"
                  ? "border-2 border-primary"
                  : "border border-grey-40"
              }`}
            >
              <input
                id="assets"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={assets}
                onChange={(e) => handleNumberInput(e, setAssets)}
                onFocus={() => setFocusedField("assets")}
                onBlur={() => setFocusedField(null)}
                placeholder="0"
                className="w-full h-full outline-none text-grey-100 text-base"
              />
              <span className="text-grey-70 text-sm font-medium leading-[18px] tracking-[-0.26px] whitespace-nowrap">
                만 원
              </span>
            </div>
            {assets && (
              <p className="text-primary text-[13px] font-medium leading-[18px] tracking-[-0.26px] mt-1">
                {formatToKorean(assets)}
              </p>
            )}
          </div>

          {/* 본인 주택 보유 현황 */}
          <div>
            <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-3">
              현재 보유하고 있는 주택이 있나요?
            </label>
            <div className="flex gap-2">
              {[0, 1, 2].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setHomeOwnerCount(count)}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                    homeOwnerCount === count
                      ? "border-primary bg-primary bg-opacity-5 text-primary font-medium"
                      : "border-grey-40 text-grey-80"
                  }`}
                >
                  {count === 2 ? "2주택 이상" : `${count}주택`}
                </button>
              ))}
            </div>
          </div>

          {/* 배우자 소득 추가/표시 */}
          {!showSpouseIncome ? (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => setShowSpouseIncome(true)}
                className="flex px-4 py-2.5 justify-center items-center gap-2.5 rounded-[300px] border border-grey-40 text-grey-80 text-[15px] font-medium leading-[22px]"
              >
                배우자 소득과 자산도 추가할게요
              </button>
            </div>
          ) : (
            <div className="mt-4 mb-12" style={{ paddingBottom: "120px" }}>
              {/* 배우자 연소득 입력 */}
              <div className="mb-6">
                <label
                  htmlFor="spouseIncome"
                  className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2"
                >
                  배우자 연소득 (만 원)
                </label>
                <div
                  className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                    focusedField === "spouseIncome"
                      ? "border-2 border-primary"
                      : "border border-grey-40"
                  }`}
                >
                  <input
                    id="spouseIncome"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={spouseIncome}
                    onChange={(e) => handleNumberInput(e, setSpouseIncome)}
                    onFocus={() => setFocusedField("spouseIncome")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0"
                    className="w-full h-full outline-none text-grey-100 text-base"
                  />
                  <span className="text-grey-70 text-sm font-medium leading-[18px] tracking-[-0.26px] whitespace-nowrap">
                    만 원
                  </span>
                </div>
                {spouseIncome && (
                  <p className="text-primary text-[13px] font-medium leading-[18px] tracking-[-0.26px] mt-1">
                    {formatToKorean(spouseIncome)}
                  </p>
                )}
              </div>

              {/* 배우자 보유자산 입력 */}
              <div className="mb-6">
                <label
                  htmlFor="spouseAssets"
                  className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-2"
                >
                  배우자 보유자산 (만 원)
                </label>
                <div
                  className={`flex h-14 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                    focusedField === "spouseAssets"
                      ? "border-2 border-primary"
                      : "border border-grey-40"
                  }`}
                >
                  <input
                    id="spouseAssets"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={spouseAssets}
                    onChange={(e) => handleNumberInput(e, setSpouseAssets)}
                    onFocus={() => setFocusedField("spouseAssets")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0"
                    className="w-full h-full outline-none text-grey-100 text-base"
                  />
                  <span className="text-grey-70 text-sm font-medium leading-[18px] tracking-[-0.26px] whitespace-nowrap">
                    만 원
                  </span>
                </div>
                {spouseAssets && (
                  <p className="text-primary text-[13px] font-medium leading-[18px] tracking-[-0.26px] mt-1">
                    {formatToKorean(spouseAssets)}
                  </p>
                )}
              </div>

              {/* 배우자 주택 보유 현황 */}
              <div className="mb-6">
                <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-3">
                  배우자 보유 주택이 있나요?
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2].map((count) => (
                    <button
                      key={`spouse-home-${count}`}
                      type="button"
                      onClick={() => setSpouseHomeOwnerCount(count)}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                        spouseHomeOwnerCount === count
                          ? "border-primary bg-primary bg-opacity-5 text-primary font-medium"
                          : "border-grey-40 text-grey-80"
                      }`}
                    >
                      {count === 2 ? "2주택 이상" : `${count}주택`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 총 보유자산 표시 */}
              {(assets || spouseAssets) && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="text-grey-100 text-sm font-medium mb-1">
                    총 보유자산
                  </div>
                  <div className="text-primary text-lg font-bold">
                    {formatToKorean(
                      (
                        parseInt(assets || "0") + parseInt(spouseAssets || "0")
                      ).toString(),
                    )}
                  </div>
                </div>
              )}

              {/* 배우자 정보 삭제 버튼 */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpouseIncome(false);
                    setSpouseIncome("");
                    setSpouseAssets("");
                    setSpouseHomeOwnerCount(0);
                  }}
                  className="flex px-3 py-2.5 justify-center items-center rounded-[300px] border border-grey-40"
                >
                  <span className="text-grey-80 text-[13px] font-medium leading-[18px] tracking-[-0.26px]">
                    배우자 정보 삭제
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 2025.10.15 정책 관련 추가 정보 */}
          <div className="mt-8 pt-6 border-t border-grey-40">
            <h3 className="text-[18px] font-bold text-grey-100 mb-3">
              정확한 계산을 위한 추가 정보
            </h3>
            <p className="text-[15px] text-grey-80 leading-[22px] mb-6">
              2025년 10월 15일 시행되는 새로운 부동산 정책이 정확히 반영됩니다.
            </p>

            {/* 임차 여부 (1주택자인 경우만 표시) */}
            {homeOwnerCount === 1 && (
              <div className="mb-6">
                <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-3">
                  현재 다른 곳에서 세입자로 거주 중인가요?
                </label>
                <div className="flex gap-2">
                  {[
                    { value: false, label: "자가 거주" },
                    { value: true, label: "전월세 거주" },
                  ].map((option) => (
                    <button
                      key={option.value.toString()}
                      type="button"
                      onClick={() => {
                        setIsTenant(option.value);
                        if (!option.value) {
                          setHasJeonseLoan(false);
                          setJeonseLoanPrincipal("");
                          setJeonseLoanRate("");
                        }
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                        isTenant === option.value
                          ? "border-primary bg-primary bg-opacity-5 text-primary font-medium"
                          : "border-grey-40 text-grey-80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 전세대출 정보 (1주택자 + 세입자인 경우만 표시) */}
            {homeOwnerCount === 1 && isTenant && (
              <div className="mb-6">
                <label className="block text-grey-100 text-base font-bold leading-6 tracking-[-0.16px] mb-3">
                  현재 전세대출을 받고 계신가요?
                </label>
                <div className="flex gap-2 mb-4">
                  {[
                    { value: false, label: "전세대출 없음" },
                    { value: true, label: "전세대출 있음" },
                  ].map((option) => (
                    <button
                      key={option.value.toString()}
                      type="button"
                      onClick={() => {
                        setHasJeonseLoan(option.value);
                        if (!option.value) {
                          setJeonseLoanPrincipal("");
                          setJeonseLoanRate("");
                        }
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                        hasJeonseLoan === option.value
                          ? "border-primary bg-primary bg-opacity-5 text-primary font-medium"
                          : "border-grey-40 text-grey-80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {hasJeonseLoan && (
                  <div className="space-y-4">
                    {/* 전세대출 원금 */}
                    <div>
                      <label
                        htmlFor="jeonseLoanPrincipal"
                        className="block text-grey-80 text-sm font-medium leading-5 tracking-[-0.14px] mb-2"
                      >
                        전세대출 원금 (만 원)
                      </label>
                      <div
                        className={`flex h-12 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                          focusedField === "jeonseLoanPrincipal"
                            ? "border-2 border-primary"
                            : "border border-grey-40"
                        }`}
                      >
                        <input
                          id="jeonseLoanPrincipal"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={jeonseLoanPrincipal}
                          onChange={(e) =>
                            handleNumberInput(e, setJeonseLoanPrincipal)
                          }
                          onFocus={() => setFocusedField("jeonseLoanPrincipal")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="0"
                          className="w-full h-full outline-none text-grey-100 text-sm"
                        />
                        <span className="text-grey-70 text-xs font-medium whitespace-nowrap">
                          만 원
                        </span>
                      </div>
                      {jeonseLoanPrincipal && (
                        <p className="text-primary text-xs font-medium mt-1">
                          {formatToKorean(jeonseLoanPrincipal)}
                        </p>
                      )}
                    </div>

                    {/* 전세대출 금리 */}
                    <div>
                      <label
                        htmlFor="jeonseLoanRate"
                        className="block text-grey-80 text-sm font-medium leading-5 tracking-[-0.14px] mb-2"
                      >
                        전세대출 금리 (%)
                      </label>
                      <div
                        className={`flex h-12 px-3 py-2.5 justify-between items-center rounded-lg transition-colors ${
                          focusedField === "jeonseLoanRate"
                            ? "border-2 border-primary"
                            : "border border-grey-40"
                        }`}
                      >
                        <input
                          id="jeonseLoanRate"
                          type="text"
                          inputMode="decimal"
                          value={jeonseLoanRate}
                          onChange={(e) => {
                            const value = e.target.value;
                            // 숫자와 소수점만 허용
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              setJeonseLoanRate(value);
                            }
                          }}
                          onFocus={() => setFocusedField("jeonseLoanRate")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="3.5"
                          className="w-full h-full outline-none text-grey-100 text-sm"
                        />
                        <span className="text-grey-70 text-xs font-medium whitespace-nowrap">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 정책 설명 박스 */}
            <div className="mt-6">
              <h4 className="text-[16px] font-bold text-grey-100 mb-3">
                2025.10.15 새로운 정책이 반영됩니다
              </h4>
              <ul className="space-y-2">
                <li className="text-[15px] text-grey-80 leading-[22px]">
                  • 규제지역 확대: 서울 전체 + 경기 12개 지역
                </li>
                <li className="text-[15px] text-grey-80 leading-[22px]">
                  • 주담대 한도 제한: 가격대별 차등 적용
                </li>
                <li className="text-[15px] text-grey-80 leading-[22px]">
                  • 스트레스 DSR 상향: 3.0% 적용
                </li>
                <li className="text-[15px] text-grey-80 leading-[22px]">
                  • 1주택자 전세대출 DSR 반영
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 safe-area-inset-bottom"
        style={{ zIndex: 1000 }}
      >
        <button
          onClick={handleSubmit}
          disabled={
            !income.trim() ||
            (homeOwnerCount === 1 &&
              isTenant &&
              hasJeonseLoan &&
              (!jeonseLoanPrincipal.trim() || !jeonseLoanRate.trim()))
          }
          className={`flex h-14 w-full justify-center items-center rounded-[300px] font-semibold text-base transition ${
            income.trim() &&
            !(
              homeOwnerCount === 1 &&
              isTenant &&
              hasJeonseLoan &&
              (!jeonseLoanPrincipal.trim() || !jeonseLoanRate.trim())
            )
              ? "bg-primary text-white hover:bg-[#111111]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
