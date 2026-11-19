import { readOnlyJson } from "../_handler.js";
import { getLiveStats } from "../_stats.js";

/** GET /api/v1/stats — live LeetCode / GitHub numbers, refreshed hourly. */
export default readOnlyJson(async () => ({ data: await getLiveStats() }));
