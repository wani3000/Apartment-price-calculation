"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SharedRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const targetUrl = query
      ? `/result/final?${query}`
      : "/result/final?shared=true";
    router.replace(targetUrl);
  }, [router, searchParams]);

  return null;
}

