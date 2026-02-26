import { health } from "./_lib/recommend-core.js";
import { applyCors } from "./_lib/cors.js";

export default function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  return health(req, res);
}
