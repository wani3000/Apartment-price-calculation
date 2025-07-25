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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ textAlign: 'center', fontSize: '18px', color: '#212529', lineHeight: '1.6' }}>
        소득과 자산, 투자와 실거주를 고려한 아파트 가격을 계산중이에요!
      </p>
    </div>
  );
} 