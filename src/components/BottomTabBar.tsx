"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const normalizedPath = pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
  const isHome = normalizedPath === "/";
  const isRecommend = normalizedPath === "/recommend";

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-40 border-t border-[#E9ECEF] bg-white">
      <div className="flex w-full max-w-md px-5 pt-1 pb-[env(safe-area-inset-bottom)] items-start justify-around">
        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[72px] py-1"
        >
          <svg
            width="24"
            height="24"
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
            className={`text-[11px] leading-4 tracking-[-0.11px] ${
              isHome ? "text-[#212529] font-semibold" : "text-[#868E96] font-medium"
            }`}
          >
            홈
          </span>
        </button>
        <button
          onClick={() => router.push("/recommend")}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[72px] py-1"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="3.5"
              width="16"
              height="17"
              rx="2"
              fill={isRecommend ? "#212529" : "none"}
              stroke={isRecommend ? "#212529" : "#868E96"}
              strokeWidth="2"
            />
            <rect
              x="7"
              y="7"
              width="3.2"
              height="3.2"
              rx="0.6"
              fill={isRecommend ? "#FFFFFF" : "#868E96"}
            />
            <rect
              x="13.8"
              y="7"
              width="3.2"
              height="3.2"
              rx="0.6"
              fill={isRecommend ? "#FFFFFF" : "#868E96"}
            />
            <rect
              x="7"
              y="12.3"
              width="3.2"
              height="3.2"
              rx="0.6"
              fill={isRecommend ? "#FFFFFF" : "#868E96"}
            />
            <rect
              x="13.8"
              y="12.3"
              width="3.2"
              height="3.2"
              rx="0.6"
              fill={isRecommend ? "#FFFFFF" : "#868E96"}
            />
          </svg>
          <span
            className={`text-[11px] leading-4 tracking-[-0.11px] ${
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
