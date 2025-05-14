'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NicknamePage() {
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      // 닉네임을 localStorage에 저장 (나중에 표시용)
      localStorage.setItem('username', nickname.trim());
      router.push('/calculator');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5">
      {/* 타이틀 */}
      <h1 className="text-grey-100 text-2xl font-bold leading-8 tracking-[-0.24px] mb-12 mt-6">
        닉네임을 알려주세요
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow justify-between">
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

        {/* 버튼은 항상 하단에 고정 */}
        <div className="mt-auto pb-10">
          <button
            type="submit"
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
      </form>
    </div>
  );
} 