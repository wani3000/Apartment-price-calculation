import { apartmentTradeHistory } from "../_lib/recommend-core.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  return apartmentTradeHistory(req, res);
}
