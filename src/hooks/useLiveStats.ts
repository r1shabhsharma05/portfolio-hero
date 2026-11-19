import { useEffect, useState } from "react";

/** Live profile numbers from /api/v1/stats (LeetCode, GitHub contributions,
 *  merged/open OSS PRs). Falls back to the last verified values baked in
 *  below — the same numbers the API itself falls back to — so the page is
 *  correct even before the fetch lands or if it fails. */

export interface LiveStats {
  leetcode: number;
  leetcodeEasy: number;
  leetcodeMedium: number;
  leetcodeHard: number;
  contributions: number;
  prsMerged: number;
  prsOpen: number;
  year: number;
}

export const FALLBACK_STATS: LiveStats = {
  leetcode: 221,
  leetcodeEasy: 92,
  leetcodeMedium: 102,
  leetcodeHard: 27,
  contributions: 1875,
  prsMerged: 24,
  prsOpen: 7,
  year: 2026,
};

let pending: Promise<LiveStats> | null = null;

function fetchStats(): Promise<LiveStats> {
  pending ??= fetch("/api/v1/stats")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((j) => ({ ...FALLBACK_STATS, ...(j?.data ?? {}) }) as LiveStats)
    .catch(() => FALLBACK_STATS);
  return pending;
}

export function useLiveStats(): LiveStats {
  const [stats, setStats] = useState<LiveStats>(FALLBACK_STATS);
  useEffect(() => {
    let live = true;
    fetchStats().then((s) => {
      if (live) setStats(s);
    });
    return () => {
      live = false;
    };
  }, []);
  return stats;
}

/** Fill {{TOKENS}} in a data string with live stats (mirrors api/_stats.js). */
export function fillStats(text: string, stats: LiveStats): string {
  const rep = (s: string, token: string, value: string) => s.split(token).join(value);
  let out = text;
  out = rep(out, "{{LEETCODE}}", String(stats.leetcode));
  out = rep(out, "{{LEETCODE_EASY}}", String(stats.leetcodeEasy));
  out = rep(out, "{{LEETCODE_MEDIUM}}", String(stats.leetcodeMedium));
  out = rep(out, "{{LEETCODE_HARD}}", String(stats.leetcodeHard));
  out = rep(out, "{{CONTRIBUTIONS}}", stats.contributions.toLocaleString("en-US"));
  out = rep(out, "{{PRS_MERGED}}", String(stats.prsMerged));
  out = rep(out, "{{PRS_OPEN}}", String(stats.prsOpen));
  out = rep(out, "{{YEAR}}", String(stats.year));
  return out;
}
