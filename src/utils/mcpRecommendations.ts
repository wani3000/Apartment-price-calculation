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
  priceWon: number;
  gapWon: number;
  rawFields?: Record<string, string | number | boolean>;
};

export type ApartmentTradeHistory = {
  aptName: string;
  regionCode?: string;
  latestTrade?: RecommendedApartment | null;
  previousTrade?: RecommendedApartment | null;
  trades?: RecommendedApartment[];
};

const DEFAULT_LOCAL_PROXY_URL = "http://127.0.0.1:8787";
const DEFAULT_PROD_PROXY_URL = "https://apartment-price-calculation-phi.vercel.app/api";
const REQUEST_TIMEOUT_MS = 10000;

const resolveProxyEndpoint = () => {
  const configured = process.env.NEXT_PUBLIC_RECOMMEND_PROXY_URL?.trim();
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const host = window.location.hostname;

    // Capacitor/file 환경에서는 로컬 라우트가 없으므로 서비스 도메인 API 사용
    if (protocol !== "http:" && protocol !== "https:") {
      return DEFAULT_PROD_PROXY_URL;
    }

    // aptgugu.com 프로덕션 API가 미설정된 경우를 대비해 안정 API 도메인으로 우회
    if (host === "aptgugu.com" || host === "www.aptgugu.com") {
      return DEFAULT_PROD_PROXY_URL;
    }

    // 웹 운영 환경에서는 동일 오리진 API 우선 사용
    if (host !== "localhost" && host !== "127.0.0.1" && host !== "::1") {
      return `${window.location.origin.replace(/\/$/, "")}/api`;
    }

    return DEFAULT_LOCAL_PROXY_URL;
  }

  return process.env.NODE_ENV === "production"
    ? DEFAULT_PROD_PROXY_URL
    : DEFAULT_LOCAL_PROXY_URL;
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
  endpoint: string,
  defaultMessage: string,
) => {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return new Error(
        `추천 API 응답 시간이 초과되었어요(${REQUEST_TIMEOUT_MS / 1000}초). 프록시 서버 상태를 확인해주세요. (${endpoint})`,
      );
    }
    if (error.message.includes("Failed to fetch")) {
      return new Error(
        `추천 API에 연결할 수 없어요. 프록시 서버가 실행 중인지 확인해주세요. (${endpoint})`,
      );
    }
    return error;
  }
  return new Error(defaultMessage);
};

export async function fetchRecommendedApartmentsFromMcp(params: {
  budgetWon: number;
  siDo: string;
  siGunGu: string;
  limit?: number;
}): Promise<RecommendedApartment[]> {
  const endpoint = resolveProxyEndpoint();
  const isProdBuild = process.env.NODE_ENV === "production";
  if (isProdBuild && isLocalProxyEndpoint(endpoint)) {
    throw new Error(
      `추천 API URL이 로컬 주소(${endpoint})로 설정되어 있어 실사용에서 연결할 수 없어요. NEXT_PUBLIC_RECOMMEND_PROXY_URL을 배포 프록시 URL로 설정해주세요.`,
    );
  }

  const { signal, clear } = createTimeoutSignal();
  try {
    const response = await fetch(
      `${endpoint.replace(/\/$/, "")}/recommendations/apartments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budgetWon: params.budgetWon,
          region: {
            siDo: params.siDo,
            siGunGu: params.siGunGu,
          },
          limit: params.limit ?? 10,
        }),
        signal,
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "추천 아파트 조회에 실패했습니다.");
    }

    return Array.isArray(data?.recommended) ? data.recommended : [];
  } catch (error) {
    throw withReadableNetworkError(
      error,
      endpoint,
      "추천 아파트 조회 중 오류가 발생했습니다.",
    );
  } finally {
    clear();
  }
}

export async function fetchLatestRegionApartmentsFromMcp(params: {
  siDo: string;
  siGunGu: string;
  limit?: number;
}): Promise<RecommendedApartment[]> {
  const endpoint = resolveProxyEndpoint();
  const isProdBuild = process.env.NODE_ENV === "production";
  if (isProdBuild && isLocalProxyEndpoint(endpoint)) {
    throw new Error(
      `추천 API URL이 로컬 주소(${endpoint})로 설정되어 있어 실사용에서 연결할 수 없어요. NEXT_PUBLIC_RECOMMEND_PROXY_URL을 배포 프록시 URL로 설정해주세요.`,
    );
  }

  const { signal, clear } = createTimeoutSignal();
  try {
    const response = await fetch(
      `${endpoint.replace(/\/$/, "")}/region/latest-apartments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region: {
            siDo: params.siDo,
            siGunGu: params.siGunGu,
          },
          limit: params.limit ?? 5,
        }),
        signal,
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "최신 실거래 조회에 실패했습니다.");
    }

    return Array.isArray(data?.latest) ? data.latest : [];
  } catch (error) {
    throw withReadableNetworkError(
      error,
      endpoint,
      "최신 실거래 조회 중 오류가 발생했습니다.",
    );
  } finally {
    clear();
  }
}

export async function fetchApartmentTradeHistoryFromMcp(params: {
  aptName: string;
  siDo: string;
  siGunGu: string;
  dong?: string;
  floor?: number;
  areaSqm?: number;
}): Promise<ApartmentTradeHistory> {
  const endpoint = resolveProxyEndpoint();
  const isProdBuild = process.env.NODE_ENV === "production";
  if (isProdBuild && isLocalProxyEndpoint(endpoint)) {
    throw new Error(
      `추천 API URL이 로컬 주소(${endpoint})로 설정되어 있어 실사용에서 연결할 수 없어요. NEXT_PUBLIC_RECOMMEND_PROXY_URL을 배포 프록시 URL로 설정해주세요.`,
    );
  }

  const { signal, clear } = createTimeoutSignal();
  try {
    const response = await fetch(
      `${endpoint.replace(/\/$/, "")}/apartments/trade-history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aptName: params.aptName,
          region: {
            siDo: params.siDo,
            siGunGu: params.siGunGu,
          },
          dong: params.dong,
          floor: params.floor,
          areaSqm: params.areaSqm,
        }),
        signal,
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "거래 이력 조회에 실패했습니다.");
    }

    return {
      aptName: String(data?.aptName || params.aptName),
      regionCode: data?.regionCode,
      latestTrade: data?.latestTrade || null,
      previousTrade: data?.previousTrade || null,
      trades: Array.isArray(data?.trades) ? data.trades : [],
    };
  } catch (error) {
    throw withReadableNetworkError(
      error,
      endpoint,
      "거래 이력 조회 중 오류가 발생했습니다.",
    );
  } finally {
    clear();
  }
}
