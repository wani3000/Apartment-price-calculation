"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useClientSearchParams from "@/hooks/useClientSearchParams";

export default function SharedRedirect() {
  const router = useRouter();
  const searchParams = useClientSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get("username");
    const username = usernameParam ? decodeURIComponent(usernameParam) : "내";
    const title = `${username} 님이 살 수 있는 아파트는?`;
    const description = `${username} 님의 소득으로 살 수 있는 아파트를 확인해 보세요.`;

    document.title = title;
    const upsertMeta = (
      selector: string,
      attrName: "content",
      value: string,
      createAttr: { key: "name" | "property"; value: string },
    ) => {
      const el = document.querySelector(selector) || document.createElement("meta");
      el.setAttribute(attrName, value);
      if (!(el as Element).parentElement) {
        el.setAttribute(createAttr.key, createAttr.value);
        document.head.appendChild(el as Element);
      }
    };

    upsertMeta(
      'meta[property="og:title"]',
      "content",
      title,
      { key: "property", value: "og:title" },
    );
    upsertMeta(
      'meta[property="og:description"]',
      "content",
      description,
      { key: "property", value: "og:description" },
    );
    upsertMeta(
      'meta[name="twitter:title"]',
      "content",
      title,
      { key: "name", value: "twitter:title" },
    );
    upsertMeta(
      'meta[name="twitter:description"]',
      "content",
      description,
      { key: "name", value: "twitter:description" },
    );

    const query = searchParams.toString();
    const targetUrl = query
      ? `/result/final?${query}`
      : "/result/final?shared=true";
    router.replace(targetUrl);
  }, [router, searchParams]);

  return null;
}
