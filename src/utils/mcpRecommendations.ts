export type RecommendedApartment = {
  aptName: string;
  dong?: string;
  areaSqm?: number;
  floor?: number;
  tradeDate?: string;
  buildYear?: number;
  priceWon: number;
  gapWon: number;
};

const DEFAULT_PROXY_URL = "http://127.0.0.1:8787";

export async function fetchRecommendedApartmentsFromMcp(params: {
  budgetWon: number;
  siDo: string;
  siGunGu: string;
  limit?: number;
}): Promise<RecommendedApartment[]> {
  const endpoint =
    process.env.NEXT_PUBLIC_RECOMMEND_PROXY_URL || DEFAULT_PROXY_URL;

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
