"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isRecommend = pathname === "/recommend";

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-40 border-t border-[#E9ECEF] bg-white">
      <div className="flex w-full max-w-md px-5 pt-1 pb-[calc(4px+env(safe-area-inset-bottom))] items-start justify-around">
        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center justify-center gap-1 min-w-[88px] py-1"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
              fill={isHome ? "#212529" : "none"}
              stroke={isHome ? "#212529" : "#868E96"}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M9 21V13H15V21"
              stroke={isHome ? "#FFFFFF" : "#868E96"}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`text-[14px] leading-5 tracking-[-0.14px] ${
              isHome ? "text-[#212529] font-semibold" : "text-[#868E96] font-medium"
            }`}
          >
            홈
          </span>
        </button>
        <button
          onClick={() => router.push("/recommend")}
          className="flex flex-col items-center justify-center gap-1 min-w-[88px] py-1"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="17"
              rx="2.5"
              fill={isRecommend ? "#212529" : "none"}
              stroke={isRecommend ? "#212529" : "#868E96"}
              strokeWidth="2"
            />
            <rect
              x="6.5"
              y="7.5"
              width="4.2"
              height="4.2"
              rx="0.8"
              fill={isRecommend ? "#FFFFFF" : "#868E96"}
            />
            <rect
              x="13.3"
              y="7.5"
              width="4.2"
              height="4.2"
              rx="0.8"
              fill={isRecommend ? "#FFFFFF" : "#868E96"}
            />
            <rect
              x="6.5"
              y="13.2"
              width="4.2"
              height="4.2"
              rx="0.8"
              fill={isRecommend ? "#FFFFFF" : "#868E96"}
            />
            <rect
              x="13.3"
              y="13.2"
              width="4.2"
              height="4.2"
              rx="0.8"
              fill={isRecommend ? "#FFFFFF" : "#868E96"}
            />
          </svg>
          <span
            className={`text-[14px] leading-5 tracking-[-0.14px] ${
              isRecommend
                ? "text-[#212529] font-semibold"
                : "text-[#868E96] font-medium"
            }`}
          >
            추천아파트
          </span>
        </button>
      </div>
    </div>
  );
}
