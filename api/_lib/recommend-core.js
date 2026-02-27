import fs from "node:fs";
import path from "node:path";

const APT_TRADE_URL = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade";
const APT_RENT_URL = "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent";
const REGION_FILE = path.join(process.cwd(), "api", "_lib", "region_codes.txt");
const FALLBACK_SIGUNGU_BY_SIDO = {
  서울: "강남구",
  경기: "성남시",
  인천: "연수구",
  부산: "해운대구",
  대구: "수성구",
  광주: "서구",
  대전: "유성구",
  울산: "남구",
  세종: "세종시",
  강원: "춘천시",
  충북: "청주시",
  충남: "천안시",
  전북: "전주시",
  전남: "순천시",
  경북: "포항시",
  경남: "창원시",
  제주: "제주시",
};

let cachedRegionRows = null;
const TRADE_CACHE_TTL_MS = 5 * 60 * 1000;
const RECOMMEND_CACHE_TTL_MS = 3 * 60 * 1000;
const LATEST_CACHE_TTL_MS = 2 * 60 * 1000;
const HISTORY_CACHE_TTL_MS = 3 * 60 * 1000;
const RENT_CACHE_TTL_MS = 5 * 60 * 1000;
const RENT_HISTORY_CACHE_TTL_MS = 3 * 60 * 1000;

const getCacheStores = () => {
  const scoped = globalThis;
  if (!scoped.__aptguguCacheStore) {
    scoped.__aptguguCacheStore = {
      values: new Map(),
      inflight: new Map(),
    };
  }
  return scoped.__aptguguCacheStore;
};

const getCachedValue = (key) => {
  const store = getCacheStores().values;
  const row = store.get(key);
  if (!row) return null;
  if (Date.now() > row.expiresAt) {
    store.delete(key);
    return null;
  }
  return row.value;
};

const setCachedValue = (key, value, ttlMs) => {
  const store = getCacheStores().values;
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
};

const withInflightDedup = async (key, run) => {
  const inflight = getCacheStores().inflight;
  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    try {
      return await run();
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, promise);
  return promise;
};

const parseNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[^\d.-]/g, "");
    if (!normalized) return null;
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const monthShift = (yyyymm, shift) => {
  const year = Number(yyyymm.slice(0, 4));
  const month = Number(yyyymm.slice(4, 6));
  const date = new Date(Date.UTC(year, month - 1 + shift, 1));
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

const getCurrentYearMonthKst = () => {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
};

const decodeXmlEntities = (value) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const getTagValue = (xml, tag) => {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(re);
  return match ? decodeXmlEntities(String(match[1]).trim()) : "";
};

const getFirstTagValue = (xml, tags) => {
  for (const tag of tags) {
    const value = getTagValue(xml, tag);
    if (value) return value;
  }
  return "";
};

const parseItemsFromXml = (xmlText) => {
  const resultCode = getTagValue(xmlText, "resultCode");
  const resultMsg = getTagValue(xmlText, "resultMsg");
  if (resultCode && resultCode !== "000") {
    throw new Error(`공공데이터 API 오류(${resultCode}): ${resultMsg || "요청 실패"}`);
  }

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const aptName = getFirstTagValue(block, ["아파트", "aptNm"]);
    const dealAmount = getFirstTagValue(block, ["거래금액", "dealAmount"]);
    const areaText = getFirstTagValue(block, ["전용면적", "excluUseAr"]);
    const floorText = getFirstTagValue(block, ["층", "floor"]);
    const year = getFirstTagValue(block, ["년", "dealYear"]);
    const month = getFirstTagValue(block, ["월", "dealMonth"]);
    const day = getFirstTagValue(block, ["일", "dealDay"]);

    const price10k = parseNumber(dealAmount);
    const priceWon = price10k === null ? null : Math.round(price10k * 10000);
    if (!aptName || !priceWon) continue;

    const y = String(parseNumber(year) || "");
    const m = String(parseNumber(month) || "").padStart(2, "0");
    const d = String(parseNumber(day) || "").padStart(2, "0");
    const tradeDate = y && m && d ? `${y}-${m}-${d}` : undefined;

    const areaSqm = parseNumber(areaText);
    const floor = parseNumber(floorText);
    const buildYear = parseNumber(
      getFirstTagValue(block, ["건축년도", "buildYear"]),
    );
    const householdCount = parseNumber(
      getFirstTagValue(block, [
        "세대수",
        "총세대수",
        "totHshldCnt",
        "totHhldCnt",
        "totHouseHoldCnt",
        "kaptHshldCnt",
        "hshldCnt",
        "householdCount",
      ]),
    );
    const dong =
      getFirstTagValue(block, ["법정동", "umdNm", "dong"]) || undefined;

    const normalizedHouseholdCount =
      householdCount !== null && householdCount > 0 ? householdCount : undefined;

    items.push({
      aptName,
      dong,
      areaSqm: areaSqm === null ? undefined : areaSqm,
      floor: floor === null ? undefined : floor,
      buildYear: buildYear === null ? undefined : buildYear,
      householdCount: normalizedHouseholdCount,
      tradeDate,
      contractDate: tradeDate,
      registrationDate: undefined,
      priceWon,
      rawFields: {
        apartment_name: aptName,
        dong: dong || "",
        exclu_use_ar: areaSqm ?? "",
        floor: floor ?? "",
        build_year: buildYear ?? "",
        household_count: normalizedHouseholdCount ?? "",
        deal_amount: price10k ?? "",
        deal_year: y || "",
        deal_month: m || "",
        deal_day: d || "",
      },
    });
  }
  return items;
};

const parseRentItemsFromXml = (xmlText) => {
  const resultCode = getTagValue(xmlText, "resultCode");
  const resultMsg = getTagValue(xmlText, "resultMsg");
  if (resultCode && resultCode !== "000") {
    throw new Error(`공공데이터 API 오류(${resultCode}): ${resultMsg || "요청 실패"}`);
  }

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const aptName = getFirstTagValue(block, ["아파트", "aptNm"]);
    const depositAmount = getFirstTagValue(block, ["보증금액", "deposit", "depositAmount"]);
    const monthlyRentAmount = getFirstTagValue(block, ["월세금액", "monthlyRent", "monthlyRentAmount"]);
    const areaText = getFirstTagValue(block, ["전용면적", "excluUseAr"]);
    const floorText = getFirstTagValue(block, ["층", "floor"]);
    const year = getFirstTagValue(block, ["년", "dealYear"]);
    const month = getFirstTagValue(block, ["월", "dealMonth"]);
    const day = getFirstTagValue(block, ["일", "dealDay"]);

    const deposit10k = parseNumber(depositAmount);
    const monthlyRent10k = parseNumber(monthlyRentAmount);
    const depositWon = deposit10k === null ? null : Math.round(deposit10k * 10000);
    const monthlyRentWon = monthlyRent10k === null ? 0 : Math.round(monthlyRent10k * 10000);
    if (!aptName || !depositWon) continue;

    const y = String(parseNumber(year) || "");
    const m = String(parseNumber(month) || "").padStart(2, "0");
    const d = String(parseNumber(day) || "").padStart(2, "0");
    const tradeDate = y && m && d ? `${y}-${m}-${d}` : undefined;

    const areaSqm = parseNumber(areaText);
    const floor = parseNumber(floorText);
    const buildYear = parseNumber(
      getFirstTagValue(block, ["건축년도", "buildYear"]),
    );
    const dong =
      getFirstTagValue(block, ["법정동", "umdNm", "dong"]) || undefined;
    const rentType = monthlyRentWon > 0 ? "monthly" : "jeonse";

    items.push({
      aptName,
      dong,
      areaSqm: areaSqm === null ? undefined : areaSqm,
      floor: floor === null ? undefined : floor,
      buildYear: buildYear === null ? undefined : buildYear,
      tradeDate,
      contractDate: tradeDate,
      registrationDate: undefined,
      priceWon: depositWon,
      depositWon,
      monthlyRentWon,
      rentType,
      rawFields: {
        apartment_name: aptName,
        dong: dong || "",
        exclu_use_ar: areaSqm ?? "",
        floor: floor ?? "",
        build_year: buildYear ?? "",
        deposit_amount: deposit10k ?? "",
        monthly_rent_amount: monthlyRent10k ?? "",
        deal_year: y || "",
        deal_month: m || "",
        deal_day: d || "",
      },
    });
  }
  return items;
};

const getApiKey = () => {
  const key = (process.env.DATA_GO_KR_API_KEY || "").trim();
  if (!key) {
    throw new Error("DATA_GO_KR_API_KEY 환경변수가 필요합니다.");
  }
  // decoding 키/encoding 키 모두 허용
  return /%[0-9A-Fa-f]{2}/.test(key) ? key : encodeURIComponent(key);
};

const fetchApartmentTrades = async (regionCode, yearMonth, numOfRows = 200, pageNo = 1) => {
  const cacheKey = `trade:${regionCode}:${yearMonth}:${numOfRows}:${pageNo}`;
  const cached = getCachedValue(cacheKey);
  if (cached) return cached;

  return withInflightDedup(cacheKey, async () => {
    const serviceKey = getApiKey();
    const url = `${APT_TRADE_URL}?serviceKey=${serviceKey}&LAWD_CD=${encodeURIComponent(regionCode)}&DEAL_YMD=${encodeURIComponent(yearMonth)}&numOfRows=${encodeURIComponent(String(numOfRows))}&pageNo=${encodeURIComponent(String(pageNo))}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/xml, text/xml;q=0.9, */*;q=0.8" },
    });
    if (!response.ok) {
      throw new Error(`실거래가 API HTTP 오류: ${response.status}`);
    }
    const xmlText = await response.text();
    const items = parseItemsFromXml(xmlText);
    setCachedValue(cacheKey, items, TRADE_CACHE_TTL_MS);
    return items;
  });
};

const fetchApartmentRents = async (regionCode, yearMonth, numOfRows = 200, pageNo = 1) => {
  const cacheKey = `rent:${regionCode}:${yearMonth}:${numOfRows}:${pageNo}`;
  const cached = getCachedValue(cacheKey);
  if (cached) return cached;

  return withInflightDedup(cacheKey, async () => {
    const serviceKey = getApiKey();
    const url = `${APT_RENT_URL}?serviceKey=${serviceKey}&LAWD_CD=${encodeURIComponent(regionCode)}&DEAL_YMD=${encodeURIComponent(yearMonth)}&numOfRows=${encodeURIComponent(String(numOfRows))}&pageNo=${encodeURIComponent(String(pageNo))}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/xml, text/xml;q=0.9, */*;q=0.8" },
    });
    if (!response.ok) {
      throw new Error(`전월세 API HTTP 오류: ${response.status}`);
    }
    const xmlText = await response.text();
    const items = parseRentItemsFromXml(xmlText);
    setCachedValue(cacheKey, items, RENT_CACHE_TTL_MS);
    return items;
  });
};

const loadRegionRows = () => {
  if (cachedRegionRows) return cachedRegionRows;

  const text = fs.readFileSync(REGION_FILE, "utf-8");
  const lines = text.split(/\r?\n/);
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line) continue;
    const parts = line.split("\t");
    if (parts.length < 3) continue;
    const [code, name, status] = parts;
    if (status === "존재") rows.push({ code, name });
  }
  cachedRegionRows = rows;
  return rows;
};

const isGuGunCode = (tenDigitCode) => tenDigitCode.slice(5) === "00000";
const toApiCode = (tenDigitCode) => tenDigitCode.slice(0, 5);

const searchRegionCode = (query) => {
  const trimmed = String(query || "").trim();
  if (!trimmed) throw new Error("지역명이 비어 있어요.");

  const rows = loadRegionRows();
  const tokens = trimmed.split(/\s+/);
  const matched = rows.filter((row) => tokens.every((tok) => row.name.includes(tok)));
  if (!matched.length) {
    throw new Error(`지역코드를 찾지 못했습니다: ${trimmed}`);
  }

  matched.sort((a, b) => {
    const aGu = isGuGunCode(a.code) ? 0 : 1;
    const bGu = isGuGunCode(b.code) ? 0 : 1;
    if (aGu !== bGu) return aGu - bGu;
    return a.code.localeCompare(b.code);
  });

  const best = matched.find((m) => isGuGunCode(m.code)) || matched[0];
  return {
    regionCode: toApiCode(best.code),
    fullName: best.name,
    matches: matched.slice(0, 20),
  };
};

const toTradeTimestamp = (value) => {
  if (!value || typeof value !== "string") return 0;
  const digits = value.replace(/[^\d]/g, "");
  if (digits.length < 8) return 0;
  return Number(digits.slice(0, 8));
};

const normalizeSiGunGu = (siDo, siGunGuRaw) => {
  const siGunGu = String(siGunGuRaw || "").trim();
  if (!siGunGu || siGunGu.includes("전체")) {
    return FALLBACK_SIGUNGU_BY_SIDO[String(siDo || "").trim()] || "강남구";
  }
  return siGunGu;
};

const collectRecentTrades = async ({
  regionCode,
  currentYm,
  monthCount,
  numOfRows,
  pageNo = 1,
  maxTrades = Infinity,
}) => {
  const months = [];
  for (let offset = 0; offset < monthCount; offset += 1) {
    months.push(monthShift(currentYm, -offset));
  }

  const settled = await Promise.allSettled(
    months.map((ym) => fetchApartmentTrades(regionCode, ym, numOfRows, pageNo)),
  );

  const dedupe = new Set();
  const merged = [];
  for (let i = 0; i < settled.length; i += 1) {
    const result = settled[i];
    if (result.status !== "fulfilled") continue;
    const items = result.value;
    for (const item of items) {
      const key = `${item.aptName}|${item.dong || ""}|${item.areaSqm || ""}|${item.floor || ""}|${item.tradeDate || ""}|${item.priceWon}`;
      if (dedupe.has(key)) continue;
      dedupe.add(key);
      merged.push(item);
      if (merged.length >= maxTrades) return merged;
    }
  }
  return merged;
};

export const health = (_req, res) => {
  res.status(200).json({ ok: true });
};

export const recommendApartments = async (req, res) => {
  try {
    const budgetWon = Number(req.body?.budgetWon || 0);
    const limit = Math.min(Math.max(Number(req.body?.limit || 50), 1), 200);
    const siDo = String(req.body?.region?.siDo || "").trim();
    const siGunGu = normalizeSiGunGu(siDo, req.body?.region?.siGunGu);

    if (!budgetWon || !siDo || !siGunGu) {
      return res.status(400).json({ error: "budgetWon, region.siDo, region.siGunGu가 필요합니다." });
    }

    const { regionCode } = searchRegionCode(`${siDo} ${siGunGu}`);
    const responseCacheKey = `recommend:${regionCode}:${budgetWon}:${limit}`;
    const cachedResponse = getCachedValue(responseCacheKey);
    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }

    const currentYm = getCurrentYearMonthKst();
    const rawTrades = await collectRecentTrades({
      regionCode,
      currentYm,
      monthCount: 6,
      numOfRows: 200,
      maxTrades: 300,
    });

    const recommended = rawTrades
      .map((item) => ({ ...item, siDo, siGunGu, regionCode, gapWon: Math.abs(budgetWon - item.priceWon) }))
      .filter((item) => item.priceWon <= budgetWon)
      .sort((a, b) => {
        if (a.gapWon !== b.gapWon) return a.gapWon - b.gapWon;
        return (b.tradeDate || "").localeCompare(a.tradeDate || "");
      })
      .slice(0, limit);

    const payload = { regionCode, budgetWon, recommended };
    setCachedValue(responseCacheKey, payload, RECOMMEND_CACHE_TTL_MS);
    return res.status(200).json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "추천 목록 조회 중 오류가 발생했습니다." });
  }
};

export const latestApartments = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.body?.limit || 5), 1), 10);
    const siDo = String(req.body?.region?.siDo || "").trim();
    const siGunGu = normalizeSiGunGu(siDo, req.body?.region?.siGunGu);
    if (!siDo || !siGunGu) {
      return res.status(400).json({ error: "region.siDo, region.siGunGu가 필요합니다." });
    }

    const { regionCode } = searchRegionCode(`${siDo} ${siGunGu}`);
    const responseCacheKey = `latest:${regionCode}:${limit}`;
    const cachedResponse = getCachedValue(responseCacheKey);
    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }

    const currentYm = getCurrentYearMonthKst();
    const rawTrades = await collectRecentTrades({
      regionCode,
      currentYm,
      monthCount: 6,
      numOfRows: 200,
      maxTrades: 500,
    });

    const latest = rawTrades
      .map((item) => ({ ...item, siDo, siGunGu, regionCode }))
      .sort((a, b) => (b.tradeDate || "").localeCompare(a.tradeDate || ""))
      .slice(0, limit);

    const payload = { regionCode, latest };
    setCachedValue(responseCacheKey, payload, LATEST_CACHE_TTL_MS);
    return res.status(200).json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "최신 실거래 조회 중 오류가 발생했습니다." });
  }
};

export const apartmentTradeHistory = async (req, res) => {
  try {
    const aptName = String(req.body?.aptName || "").trim();
    const siDo = String(req.body?.region?.siDo || "").trim();
    const siGunGu = normalizeSiGunGu(siDo, req.body?.region?.siGunGu);
    const dong = String(req.body?.dong || "").trim();
    const floor = parseNumber(req.body?.floor);
    const areaSqm = parseNumber(req.body?.areaSqm);

    if (!aptName || !siDo || !siGunGu) {
      return res.status(400).json({ error: "aptName, region.siDo, region.siGunGu가 필요합니다." });
    }

    const { regionCode } = searchRegionCode(`${siDo} ${siGunGu}`);
    const historyCacheKey = `history:${regionCode}:${aptName}:${dong}:${String(floor ?? "")}:${String(areaSqm ?? "")}`;
    const cachedHistory = getCachedValue(historyCacheKey);
    if (cachedHistory) {
      return res.status(200).json(cachedHistory);
    }

    const currentYm = getCurrentYearMonthKst();
    const recentTrades = await collectRecentTrades({
      regionCode,
      currentYm,
      monthCount: 60,
      numOfRows: 300,
      maxTrades: 1200,
    });

    const rawTrades = [];
    const dedupe = new Set();
    for (const item of recentTrades) {
      if (item.aptName !== aptName) continue;
      if (dong && item.dong && item.dong !== dong) continue;
      if (areaSqm !== null && item.areaSqm !== undefined && Math.abs(item.areaSqm - areaSqm) > 0.3) continue;

      const key = `${item.aptName}|${item.dong || ""}|${item.areaSqm || ""}|${item.floor || ""}|${item.tradeDate || ""}|${item.priceWon}`;
      if (dedupe.has(key)) continue;
      dedupe.add(key);
      rawTrades.push({ ...item, siDo, siGunGu, regionCode });
      if (rawTrades.length >= 100) break;
    }

    const sorted = rawTrades.sort((a, b) => {
      const byDate = toTradeTimestamp(b.tradeDate || "") - toTradeTimestamp(a.tradeDate || "");
      if (byDate !== 0) return byDate;
      if (floor !== null) {
        const floorDiff = Math.abs((a.floor || 0) - floor) - Math.abs((b.floor || 0) - floor);
        if (floorDiff !== 0) return floorDiff;
      }
      return b.priceWon - a.priceWon;
    });

    const latestTrade = sorted[0] || null;
    const previousTrade = sorted[1] || null;
    const payload = { aptName, regionCode, latestTrade, previousTrade, trades: sorted.slice(0, 10) };
    setCachedValue(historyCacheKey, payload, HISTORY_CACHE_TTL_MS);
    return res.status(200).json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "아파트 거래 이력 조회 중 오류가 발생했습니다." });
  }
};

export const apartmentRentHistory = async (req, res) => {
  try {
    const aptName = String(req.body?.aptName || "").trim();
    const siDo = String(req.body?.region?.siDo || "").trim();
    const siGunGu = normalizeSiGunGu(siDo, req.body?.region?.siGunGu);
    const dong = String(req.body?.dong || "").trim();
    const floor = parseNumber(req.body?.floor);
    const areaSqm = parseNumber(req.body?.areaSqm);

    if (!aptName || !siDo || !siGunGu) {
      return res.status(400).json({ error: "aptName, region.siDo, region.siGunGu가 필요합니다." });
    }

    const { regionCode } = searchRegionCode(`${siDo} ${siGunGu}`);
    const historyCacheKey = `rentHistory:${regionCode}:${aptName}:${dong}:${String(floor ?? "")}:${String(areaSqm ?? "")}`;
    const cachedHistory = getCachedValue(historyCacheKey);
    if (cachedHistory) {
      return res.status(200).json(cachedHistory);
    }

    const currentYm = getCurrentYearMonthKst();
    const months = [];
    for (let offset = 0; offset < 60; offset += 1) {
      months.push(monthShift(currentYm, -offset));
    }
    const settled = await Promise.allSettled(
      months.map((ym) => fetchApartmentRents(regionCode, ym, 300, 1)),
    );

    const dedupe = new Set();
    const rows = [];
    for (const result of settled) {
      if (result.status !== "fulfilled") continue;
      for (const item of result.value) {
        if (item.aptName !== aptName) continue;
        if (dong && item.dong && item.dong !== dong) continue;
        if (areaSqm !== null && item.areaSqm !== undefined && Math.abs(item.areaSqm - areaSqm) > 0.3) continue;
        const key = `${item.aptName}|${item.dong || ""}|${item.areaSqm || ""}|${item.floor || ""}|${item.tradeDate || ""}|${item.depositWon || item.priceWon}|${item.monthlyRentWon || 0}`;
        if (dedupe.has(key)) continue;
        dedupe.add(key);
        rows.push({ ...item, siDo, siGunGu, regionCode });
        if (rows.length >= 120) break;
      }
      if (rows.length >= 120) break;
    }

    const sorted = rows.sort((a, b) => {
      const byDate = toTradeTimestamp(b.tradeDate || "") - toTradeTimestamp(a.tradeDate || "");
      if (byDate !== 0) return byDate;
      if (floor !== null) {
        const floorDiff = Math.abs((a.floor || 0) - floor) - Math.abs((b.floor || 0) - floor);
        if (floorDiff !== 0) return floorDiff;
      }
      return (b.depositWon || b.priceWon || 0) - (a.depositWon || a.priceWon || 0);
    });

    const jeonse = sorted.filter((item) => !item.monthlyRentWon || item.monthlyRentWon <= 0).slice(0, 10);
    const monthly = sorted.filter((item) => item.monthlyRentWon && item.monthlyRentWon > 0).slice(0, 10);
    const payload = { aptName, regionCode, jeonse, monthly, rents: sorted.slice(0, 10) };
    setCachedValue(historyCacheKey, payload, RENT_HISTORY_CACHE_TTL_MS);
    return res.status(200).json(payload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "전세/월세 이력 조회 중 오류가 발생했습니다." });
  }
};
