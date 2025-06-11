'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { shareContent, getHomeShareData } from '@/utils/share';

// 무한 슬라이드 애니메이션을 위한 CSS를 포함하는 컴포넌트
const ImageSlider = () => {
  // 1>4>6>7>2>3>5 순서
  const orderedImages = [
    'home-image-01.png',
    'home-image-04.png',
    'home-image-06.png',
    'home-image-07.png',
    'home-image-02.png',
    'home-image-03.png',
    'home-image-05.png',
  ];

  return (
    <div className="image-slider-container w-full overflow-hidden my-5">
      <div className="image-slider flex">
        {[...orderedImages, ...orderedImages].map((imageName, index) => (
          <div key={index} className="image-card flex-shrink-0 w-[265px] h-auto mx-2">
            <img 
              src={`/images/${imageName}`} 
              alt={`아파트 이미지 ${index + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const NicknameForm = ({ nickname, onNicknameChange, onSubmit }: any) => (
  <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 px-5 mt-10">
    <input
      type="text"
      value={nickname}
      onChange={onNicknameChange}
      placeholder="닉네임을 입력하세요"
      className="flex h-14 w-full items-center gap-2.5 rounded-[8px] bg-white text-grey-100 p-4 text-center placeholder:text-grey-60 focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <button
      type="submit"
      disabled={!nickname.trim()}
      className="flex h-14 w-full justify-center items-center gap-2.5 bg-primary text-white rounded-[300px] font-semibold text-base disabled:bg-grey-40 disabled:cursor-not-allowed hover:bg-indigo-600 transition"
    >
      시작하기
    </button>
  </form>
);

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nickname.trim()) {
      localStorage.setItem('username', nickname.trim());
      router.push('/calculator');
    }
  };

  const handleShare = async () => {
    const shareData = getHomeShareData();
    await shareContent(shareData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#7577FF] to-white flex flex-col items-center justify-between text-grey-100 p-5 pt-16">
      <div className="w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          내 연봉으로 살 수 있는 아파트,
        </h1>
        <h2 className="text-3xl font-bold text-white mb-10">
          어디까지 가능할까?
        </h2>
      </div>

      <ImageSlider />
      
      <NicknameForm
        nickname={nickname}
        onNicknameChange={handleNicknameChange}
        onSubmit={handleSubmit}
      />

      <div className="w-full max-w-md mt-auto pt-10">
        <button
          onClick={handleShare}
          className="w-full flex justify-center items-center text-white opacity-50 text-sm"
        >
          <Image
            src="/images/icon_share.svg"
            alt="공유 아이콘"
            width={20}
            height={20}
            className="mr-2"
          />
          이 페이지 공유하기
        </button>
      </div>
    </main>
  );
} 