import type { VercelRequest, VercelResponse } from "@vercel/node";
import { LLMS_TXT } from "./_llms.js";
import { applyStats, getLiveStats } from "./_stats.js";

/** GET /llms.txt — the LLM context file, with live stats filled in. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Robots-Tag", "noarchive");
  return res.status(200).send(applyStats(LLMS_TXT, await getLiveStats()));
}
