export type RecommendedApartment = {
  aptName: string;
  siDo?: string;
  siGunGu?: string;
  regionCode?: string;
  dong?: string;
  areaSqm?: number;
  floor?: number;
  tradeDate?: string;
  contractDate?: string;
  registrationDate?: string;
  buildYear?: number;
  householdCount?: number;
  priceWon: number;
  gapWon: number;
  rawFields?: Record<string, string | number | boolean>;
};

export type RecommendedRentApartment = RecommendedApartment & {
  depositWon?: number;
  monthlyRentWon?: number;
  rentType?: "jeonse" | "monthly";
};

export type ApartmentTradeHistory = {
  aptName: string;
  regionCode?: string;
  latestTrade?: RecommendedApartment | null;
  previousTrade?: RecommendedApartment | null;
  trades?: RecommendedApartment[];
};

export type ApartmentRentHistory = {
  aptName: string;
  regionCode?: string;
  jeonse?: RecommendedRentApartment[];
  monthly?: RecommendedRentApartment[];
  rents?: RecommendedRentApartment[];
};

const DEFAULT_LOCAL_PROXY_URL = "http://127.0.0.1:8787";
const DEFAULT_APP_PROXY_URL = "https://aptgugu.com/api";
const DEFAULT_PROD_PROXY_URL = "https://apartment-price-calculation-phi.vercel.app/api";
const REQUEST_TIMEOUT_MS = 35000;

const normalizeEndpoint = (endpoint: string) => endpoint.replace(/\/$/, "");
const normalizeApiPath = (path: string) => {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

const resolveProxyEndpoints = () => {
  const configured = process.env.NEXT_PUBLIC_RECOMMEND_PROXY_URL?.trim();
  if (configured) return [normalizeEndpoint(configured)];

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const host = window.location.hostname;

    // Capacitor/file 환경에서는 로컬 라우트가 없으므로 서비스 도메인 API 사용
    if (protocol !== "http:" && protocol !== "https:") {
      return [
        normalizeEndpoint(DEFAULT_APP_PROXY_URL),
        normalizeEndpoint(DEFAULT_PROD_PROXY_URL),
      ];
    }

    // 웹 운영 환경에서는 동일 오리진 API 우선 사용
    if (host !== "localhost" && host !== "127.0.0.1" && host !== "::1") {
      return [
        `${window.location.origin.replace(/\/$/, "")}/api`,
        normalizeEndpoint(DEFAULT_APP_PROXY_URL),
        normalizeEndpoint(DEFAULT_PROD_PROXY_URL),
      ];
    }

    return [
      normalizeEndpoint(DEFAULT_LOCAL_PROXY_URL),
      normalizeEndpoint(DEFAULT_APP_PROXY_URL),
      normalizeEndpoint(DEFAULT_PROD_PROXY_URL),
    ];
  }

  return process.env.NODE_ENV === "production"
    ? [normalizeEndpoint(DEFAULT_APP_PROXY_URL), normalizeEndpoint(DEFAULT_PROD_PROXY_URL)]
    : [
        normalizeEndpoint(DEFAULT_LOCAL_PROXY_URL),
        normalizeEndpoint(DEFAULT_APP_PROXY_URL),
        normalizeEndpoint(DEFAULT_PROD_PROXY_URL),
      ];
};

const isLocalProxyEndpoint = (endpoint: string) => {
  try {
    const url = new URL(endpoint);
    return (
      url.hostname === "127.0.0.1" ||
      url.hostname === "localhost" ||
      url.hostname === "::1"
    );
  } catch {
    return false;
  }
};

const createTimeoutSignal = () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  };
};

const withReadableNetworkError = (
  error: unknown,
  endpoints: string[],
  defaultMessage: string,
) => {
  const endpointLabel = endpoints.join(", ");
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return new Error(
        `추천 API 응답 시간이 초과되었어요(${REQUEST_TIMEOUT_MS / 1000}초). (${endpointLabel})`,
      );
    }
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("Load failed")
    ) {
      return new Error(
        `추천 API에 연결할 수 없어요. (${endpointLabel})`,
      );
    }
    return error;
  }
  return new Error(defaultMessage);
};

const postWithFallback = async (
  path: string,
  body: unknown,
  defaultMessage: string,
) => {
  const normalizedPath = normalizeApiPath(path);
  const endpoints = resolveProxyEndpoints();
  const isProdBuild = process.env.NODE_ENV === "production";
  const availableEndpoints = endpoints.filter(
    (endpoint) => !(isProdBuild && isLocalProxyEndpoint(endpoint)),
  );

  if (availableEndpoints.length === 0) {
    throw new Error(
      "추천 API URL이 로컬 주소로만 설정되어 있어 실사용에서 연결할 수 없어요.",
    );
  }

  let lastError: unknown = null;
  for (const endpoint of availableEndpoints) {
    const { signal, clear } = createTimeoutSignal();
    try {
      const response = await fetch(`${endpoint}${normalizedPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal,
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;
      if (!response.ok) {
        throw new Error((data as { error?: string } | null)?.error || defaultMessage);
      }
      return data;
    } catch (error) {
      lastError = error;
    } finally {
      clear();
    }
  }

  throw withReadableNetworkError(
    lastError,
    availableEndpoints,
    defaultMessage,
  );
};

export async function fetchRecommendedApartmentsFromMcp(params: {
  budgetWon: number;
  siDo: string;
  siGunGu: string;
  limit?: number;
}): Promise<RecommendedApartment[]> {
  const data = await postWithFallback(
    "/recommendations/apartments",
    {
      budgetWon: params.budgetWon,
      region: {
        siDo: params.siDo,
        siGunGu: params.siGunGu,
      },
      limit: params.limit ?? 10,
    },
    "추천 아파트 조회에 실패했습니다.",
  );
  return Array.isArray(data?.recommended) ? data.recommended : [];
}

export async function fetchLatestRegionApartmentsFromMcp(params: {
  siDo: string;
  siGunGu: string;
  limit?: number;
}): Promise<RecommendedApartment[]> {
  const data = await postWithFallback(
    "/region/latest-apartments",
    {
      region: {
        siDo: params.siDo,
        siGunGu: params.siGunGu,
      },
      limit: params.limit ?? 5,
    },
    "최신 실거래 조회에 실패했습니다.",
  );
  return Array.isArray(data?.latest) ? data.latest : [];
}

export async function fetchApartmentTradeHistoryFromMcp(params: {
  aptName: string;
  siDo: string;
  siGunGu: string;
  dong?: string;
  floor?: number;
  areaSqm?: number;
}): Promise<ApartmentTradeHistory> {
  const data = await postWithFallback(
    "/apartments/trade-history",
    {
      aptName: params.aptName,
      region: {
        siDo: params.siDo,
        siGunGu: params.siGunGu,
      },
      dong: params.dong,
      floor: params.floor,
      areaSqm: params.areaSqm,
    },
    "거래 이력 조회에 실패했습니다.",
  );

  return {
    aptName: String(data?.aptName || params.aptName),
    regionCode: data?.regionCode,
    latestTrade: data?.latestTrade || null,
    previousTrade: data?.previousTrade || null,
    trades: Array.isArray(data?.trades) ? data.trades : [],
  };
}

export async function fetchApartmentRentHistoryFromMcp(params: {
  aptName: string;
  siDo: string;
  siGunGu: string;
  dong?: string;
  floor?: number;
  areaSqm?: number;
}): Promise<ApartmentRentHistory> {
  const data = await postWithFallback(
    "/apartments/rent-history",
    {
      aptName: params.aptName,
      region: {
        siDo: params.siDo,
        siGunGu: params.siGunGu,
      },
      dong: params.dong,
      floor: params.floor,
      areaSqm: params.areaSqm,
    },
    "전세/월세 이력 조회에 실패했습니다.",
  );

  return {
    aptName: String(data?.aptName || params.aptName),
    regionCode: data?.regionCode,
    jeonse: Array.isArray(data?.jeonse) ? data.jeonse : [],
    monthly: Array.isArray(data?.monthly) ? data.monthly : [],
    rents: Array.isArray(data?.rents) ? data.rents : [],
  };
}
