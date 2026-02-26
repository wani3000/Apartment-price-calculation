"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const PROTECTED_PATHS = [
  "/calculator",
  "/region",
  "/regulation",
  "/result",
  "/result/final",
  "/result/new-regulation",
  "/result/plan",
  "/result/schedule",
];

const isProtectedPath = (pathname: string) =>
  PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export default function RouteAccessGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !isProtectedPath(pathname)) {
      return;
    }

    const username = (localStorage.getItem("username") || "").trim();
    if (username) {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const isSharedResult =
      pathname === "/result/final" && searchParams.get("shared") === "true";
    if (isSharedResult) {
      return;
    }

    router.replace("/nickname");
  }, [pathname, router]);

  return null;
}
