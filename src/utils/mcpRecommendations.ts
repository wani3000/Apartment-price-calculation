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

const DEFAULT_PROXY_URL = "http://127.0.0.1:8787";

const resolveProxyEndpoint = () => {
  const configured = process.env.NEXT_PUBLIC_RECOMMEND_PROXY_URL?.trim();
  if (configured) return configured;
  return DEFAULT_PROXY_URL;
};

export async function fetchRecommendedApartmentsFromMcp(params: {
  budgetWon: number;
  siDo: string;
  siGunGu: string;
  limit?: number;
}): Promise<RecommendedApartment[]> {
  const endpoint = resolveProxyEndpoint();

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
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "추천 아파트 조회에 실패했습니다.");
  }

  return Array.isArray(data?.recommended) ? data.recommended : [];
}

export async function fetchLatestRegionApartmentsFromMcp(params: {
  siDo: string;
  siGunGu: string;
  limit?: number;
}): Promise<RecommendedApartment[]> {
  const endpoint = resolveProxyEndpoint();

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
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "최신 실거래 조회에 실패했습니다.");
  }

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
  const endpoint = resolveProxyEndpoint();

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
}
