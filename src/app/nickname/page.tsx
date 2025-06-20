'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function NicknamePage() {
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setNickname(savedUsername);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      // 닉네임을 localStorage에 저장 (나중에 표시용)
      localStorage.setItem('username', nickname.trim());
      router.push('/calculator');
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-4">
      {/* 헤더 컴포넌트 사용 */}
      <Header backUrl="/" />

      {/* 타이틀 */}
      <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-12">
        닉네임을 알려주세요
      </h1>

        {/* 입력 필드 */}
        <div>
          <label htmlFor="nickname" className="block text-grey-100 text-sm font-medium mb-2">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5">
          <button
          onClick={handleSubmit}
            disabled={!nickname.trim()}
            className={`flex h-14 w-full justify-center items-center rounded-[300px] font-semibold text-base transition ${
              nickname.trim() 
                ? 'bg-primary text-white hover:bg-indigo-600' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
    </div>
  );
} 