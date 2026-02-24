import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT || 8787);
const MCP_URL = process.env.REAL_ESTATE_MCP_URL || "http://127.0.0.1:8011/mcp";
const MCP_PROTOCOL_VERSION = "2025-03-26";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const parseJson = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
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

const parseSseResult = (raw) => {
  const lines = raw.split("\n");
  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    const json = line.slice(5).trim();
    const parsed = parseJson(json);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  }
  return null;
};

const parseMcpHttpResult = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await response.json();
  }
  const text = await response.text();
  if (contentType.includes("text/event-stream")) {
    const parsed = parseSseResult(text);
    if (parsed) return parsed;
  }
  return parseJson(text) || { error: { message: "Unknown MCP response format" } };
};

const parseToolPayload = (result) => {
  if (!result || typeof result !== "object") return {};
  const structured = parseJson(result.structuredContent);
  if (structured) return structured;
  const content = Array.isArray(result.content) ? result.content : [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const parsed = parseJson(block.text);
    if (parsed) return parsed;
  }
  return {};
};

const monthShift = (yyyymm, shift) => {
  const year = Number(yyyymm.slice(0, 4));
  const month = Number(yyyymm.slice(4, 6));
  const date = new Date(Date.UTC(year, month - 1 + shift, 1));
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

const normalizeTradeDate = (item) => {
  const direct = [
    item.trade_date,
    item.deal_date,
    item.contract_date,
    item["거래일자"],
    item["계약일"],
  ];
  for (const value of direct) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  const year = parseNumber(item.deal_year ?? item.year ?? item["년"]);
  const month = parseNumber(item.deal_month ?? item.month ?? item["월"]);
  const day = parseNumber(item.deal_day ?? item.day ?? item["일"]);
  if (!year || !month || !day) return "";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const parseTradePriceWon = (item) => {
  const wonKeys = ["price_won", "priceWon", "deal_price_won", "dealAmountWon"];
  for (const key of wonKeys) {
    const num = parseNumber(item[key]);
    if (num !== null) return Math.round(num);
  }
  const manKeys = [
    "price_10k",
    "price10k",
    "deal_amount",
    "dealAmount",
    "거래금액",
  ];
  for (const key of manKeys) {
    const num = parseNumber(item[key]);
    if (num !== null) return Math.round(num * 10000);
  }
  return null;
};

const extractTradeList = (payload) => {
  const candidates = [
    payload.items,
    payload.item,
    payload.data,
    payload.results,
    payload.response?.items,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
};

const createMcpClient = async () => {
  let sequence = 1;
  let sessionId = "";

  const rpc = async (method, params) => {
    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
        ...(sessionId ? { "mcp-session-id": sessionId } : {}),
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: sequence++,
        method,
        params,
      }),
    });
    const currentSessionId =
      response.headers.get("mcp-session-id") || response.headers.get("x-mcp-session-id");
    if (currentSessionId) sessionId = currentSessionId;

    const data = await parseMcpHttpResult(response);
    if (!response.ok || data?.error) {
      const message = data?.error?.message || `MCP ${method} failed`;
      throw new Error(String(message));
    }
    return data.result;
  };

  await rpc("initialize", {
    protocolVersion: MCP_PROTOCOL_VERSION,
    capabilities: {},
    clientInfo: {
      name: "aptgugu-recommend-proxy",
      version: "1.0.0",
    },
  });

  return {
    async callTool(name, args) {
      const result = await rpc("tools/call", {
        name,
        arguments: args,
      });
      return parseToolPayload(result);
    },
  };
};

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/recommendations/apartments", async (req, res) => {
  try {
    const budgetWon = Number(req.body?.budgetWon || 0);
    const limit = Math.min(Math.max(Number(req.body?.limit || 10), 1), 10);
    const siDo = String(req.body?.region?.siDo || "").trim();
    const siGunGu = String(req.body?.region?.siGunGu || "").trim();

    if (!budgetWon || !siDo || !siGunGu) {
      return res.status(400).json({
        error: "budgetWon, region.siDo, region.siGunGu가 필요합니다.",
      });
    }

    const mcp = await createMcpClient();
    const regionPayload = await mcp.callTool("get_region_code", {
      query: `${siDo} ${siGunGu}`,
    });
    const regionCode = String(
      regionPayload.region_code || regionPayload.regionCode || regionPayload.code || "",
    ).trim();
    if (!regionCode) {
      return res.status(404).json({ error: "지역코드를 찾지 못했습니다." });
    }

    const currentPayload = await mcp.callTool("get_current_year_month", {});
    const currentYm = String(currentPayload.year_month || "").trim();
    if (!/^\d{6}$/.test(currentYm)) {
      return res.status(500).json({ error: "기준 연월 조회에 실패했습니다." });
    }

    const rawTrades = [];
    const dedupe = new Set();
    for (let offset = 0; offset < 6; offset += 1) {
      const ym = monthShift(currentYm, -offset);
      const tradePayload = await mcp.callTool("get_apartment_trades", {
        region_code: regionCode,
        year_month: ym,
        num_of_rows: 200,
        page_no: 1,
      });
      const items = extractTradeList(tradePayload);
      for (const item of items) {
        const aptName = String(item.apt_name || item.apartment_name || item["아파트"] || "").trim();
        const priceWon = parseTradePriceWon(item);
        if (!aptName || !priceWon) continue;
        const key = `${aptName}|${item.dong || ""}|${item.exclu_use_ar || item.area_sqm || ""}|${item.floor || ""}|${normalizeTradeDate(item)}|${priceWon}`;
        if (dedupe.has(key)) continue;
        dedupe.add(key);
        rawTrades.push(item);
      }
      if (rawTrades.length >= 300) break;
    }

    const recommended = rawTrades
      .map((item) => {
        const aptName = String(item.apt_name || item.apartment_name || item["아파트"] || "").trim();
        const priceWon = parseTradePriceWon(item);
        if (!aptName || !priceWon) return null;
        const dong = String(item.dong || item["법정동"] || "").trim() || undefined;
        const areaSqm = parseNumber(item.area_sqm || item.exclu_use_ar || item["전용면적"]);
        const floor = parseNumber(item.floor || item["층"]);
        const buildYear = parseNumber(item.build_year || item.buildYear || item["건축년도"]);
        const tradeDate = normalizeTradeDate(item) || undefined;

        return {
          aptName,
          dong,
          areaSqm: areaSqm === null ? undefined : areaSqm,
          floor: floor === null ? undefined : floor,
          buildYear: buildYear === null ? undefined : buildYear,
          tradeDate,
          priceWon,
          gapWon: Math.abs(budgetWon - priceWon),
        };
      })
      .filter((item) => item !== null)
      .filter((item) => item.priceWon <= budgetWon)
      .sort((a, b) => {
        if (a.gapWon !== b.gapWon) return a.gapWon - b.gapWon;
        return (b.tradeDate || "").localeCompare(a.tradeDate || "");
      })
      .slice(0, limit);

    return res.status(200).json({
      regionCode,
      budgetWon,
      recommended,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "추천 목록 조회 중 오류가 발생했습니다.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`[recommendation-proxy] listening on :${PORT}`);
  console.log(`[recommendation-proxy] MCP_URL=${MCP_URL}`);
});
