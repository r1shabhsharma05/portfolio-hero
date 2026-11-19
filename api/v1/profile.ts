import { readOnlyJson } from "../_handler.js";
import { PROFILE } from "../_data.js";
import { applyStatsDeep, getLiveStats } from "../_stats.js";

/** GET /api/v1/profile — structured facts about Rishabh Sharma. */
export default readOnlyJson(async () => ({ data: applyStatsDeep(PROFILE, await getLiveStats()) }));
