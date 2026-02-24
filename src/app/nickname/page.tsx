"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function NicknamePage() {
  const [nickname, setNickname] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setNickname(savedUsername);
      setIsEditMode(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      // 닉네임을 localStorage에 저장 (나중에 표시용)
      localStorage.setItem("username", nickname.trim());
      router.push(isEditMode ? "/" : "/calculator");
    }
  };

  return (
    <div className="bg-white flex flex-col h-[100dvh] overflow-hidden">
      {/* 헤더 */}
      <Header backUrl="/" />

      {/* 메인 컨텐츠 영역 */}
      <div
        className="flex-1 flex flex-col px-5"
        style={{
          paddingTop:
            "calc(var(--page-header-offset) + env(safe-area-inset-top))",
          paddingBottom:
            "var(--page-content-bottom-safe)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 타이틀 */}
        <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-12">
          닉네임을 알려주세요
        </h1>

        {/* 입력 필드 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-grey-100 text-sm font-medium mb-2"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className="w-full px-4 py-3 rounded-xl border border-grey-60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
          />
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="bottom-cta-container">
        <div
          className="bottom-cta-surface"
        >
          <button
            onClick={handleSubmit}
            disabled={!nickname.trim()}
            className={`flex h-14 w-full justify-center items-center rounded-[300px] font-semibold text-base transition ${
              nickname.trim()
                ? "bg-primary text-white hover:bg-[#111111]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isEditMode ? "확인" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}
