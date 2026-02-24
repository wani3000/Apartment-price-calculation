import { health } from "./_lib/recommend-core.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  return health(req, res);
}
