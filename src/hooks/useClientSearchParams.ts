"use client";

import { useEffect, useState } from "react";

export default function useClientSearchParams() {
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );

  useEffect(() => {
    const updateParams = () => {
      setParams(new URLSearchParams(window.location.search));
    };

    updateParams();
    window.addEventListener("popstate", updateParams);
    return () => {
      window.removeEventListener("popstate", updateParams);
    };
  }, []);

  return params;
}
