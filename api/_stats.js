/**
 * Live profile stats — LeetCode solved, GitHub contributions (current year),
 * and open-source PR counts, fetched from the public sources so the numbers
 * on the site update themselves. Every source falls back to the last
 * verified value below if its fetch fails; results are cached in memory for
 * an hour (the CDN s-maxage on the endpoints does the rest).
 *
 * Source texts carry {{TOKENS}}; applyStats() fills them in.
 */

export const FALLBACK_STATS = {
  leetcode: 221,
  leetcodeEasy: 92,
  leetcodeMedium: 102,
  leetcodeHard: 27,
  contributions: 1875,
  prsMerged: 24,
  prsOpen: 7,
  year: 2026,
};

const LEETCODE_USER = "rishabh_sharma__";
const GITHUB_USER = "r1shabhsharma05";
const TTL_MS = 60 * 60 * 1000;

let cache = { at: 0, data: null };

async function fetchLeetCode() {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: `https://leetcode.com/u/${LEETCODE_USER}/`,
    },
    body: JSON.stringify({
      query:
        "query($u:String!){matchedUser(username:$u){submitStatsGlobal{acSubmissionNum{difficulty count}}}}",
      variables: { u: LEETCODE_USER },
    }),
    signal: AbortSignal.timeout(5000),
  });
  const json = await res.json();
  const rows = json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
  if (!Array.isArray(rows)) throw new Error("leetcode: bad shape");
  const by = Object.fromEntries(rows.map((r) => [r.difficulty, r.count]));
  return {
    leetcode: by.All,
    leetcodeEasy: by.Easy,
    leetcodeMedium: by.Medium,
    leetcodeHard: by.Hard,
  };
}

async function fetchPrCount(query) {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "rishabh-portfolio-stats",
      },
      signal: AbortSignal.timeout(5000),
    }
  );
  const json = await res.json();
  if (typeof json?.total_count !== "number") throw new Error("github search: bad shape");
  return json.total_count;
}

async function fetchContributions(year) {
  const res = await fetch(
    `https://github.com/users/${GITHUB_USER}/contributions?from=${year}-01-01&to=${year}-12-31`,
    {
      headers: { "User-Agent": "rishabh-portfolio-stats" },
      signal: AbortSignal.timeout(5000),
    }
  );
  const html = await res.text();
  const m = html.match(/([\d,]+)\s+contributions\s+in\s+\d{4}/);
  if (!m) throw new Error("contributions: total not found");
  return Number(m[1].replace(/,/g, ""));
}

export async function getLiveStats() {
  const now = Date.now();
  if (cache.data && now - cache.at < TTL_MS) return cache.data;
  const year = new Date().getFullYear();
  const [lc, merged, open, contrib] = await Promise.allSettled([
    fetchLeetCode(),
    fetchPrCount(`author:${GITHUB_USER} type:pr is:merged -user:${GITHUB_USER}`),
    fetchPrCount(`author:${GITHUB_USER} type:pr is:open -user:${GITHUB_USER}`),
    fetchContributions(year),
  ]);
  const data = {
    ...FALLBACK_STATS,
    year,
    ...(lc.status === "fulfilled" ? lc.value : {}),
    ...(merged.status === "fulfilled" ? { prsMerged: merged.value } : {}),
    ...(open.status === "fulfilled" ? { prsOpen: open.value } : {}),
    ...(contrib.status === "fulfilled" ? { contributions: contrib.value } : {}),
  };
  cache = { at: now, data };
  return data;
}

/** Fill {{TOKENS}} in a text with the given stats. */
export function applyStats(text, stats) {
  return text
    .replaceAll("{{LEETCODE}}", String(stats.leetcode))
    .replaceAll("{{LEETCODE_EASY}}", String(stats.leetcodeEasy))
    .replaceAll("{{LEETCODE_MEDIUM}}", String(stats.leetcodeMedium))
    .replaceAll("{{LEETCODE_HARD}}", String(stats.leetcodeHard))
    .replaceAll("{{CONTRIBUTIONS}}", stats.contributions.toLocaleString("en-US"))
    .replaceAll("{{PRS_MERGED}}", String(stats.prsMerged))
    .replaceAll("{{PRS_OPEN}}", String(stats.prsOpen))
    .replaceAll("{{YEAR}}", String(stats.year));
}

/** applyStats over every string in a plain object/array tree. */
export function applyStatsDeep(value, stats) {
  if (typeof value === "string") return applyStats(value, stats);
  if (Array.isArray(value)) return value.map((v) => applyStatsDeep(v, stats));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, applyStatsDeep(v, stats)])
    );
  }
  return value;
}
