"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultRedirectPage({ params }: { params: { slug: string } }) {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        const res = await fetch(`/api/shorten/${params.slug}`);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        if (data?.longUrl) {
          window.location.href = data.longUrl;
        } else {
          alert("해당 URL이 존재하지 않습니다.");
          router.push("/");
        }
      } catch {
        alert("잘못된 URL입니다.");
        router.push("/");
      }
    };

    redirect();
  }, [params.slug, router]);

  return <p>🔗 잠시만 기다려주세요. 리다이렉트 중입니다...</p>;
} 