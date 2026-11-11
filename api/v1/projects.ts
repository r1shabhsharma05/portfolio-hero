import { readOnlyJson } from "../_handler.js";
import { PROJECTS } from "../_data.js";

const CATEGORIES = ["web", "mobile", "ai", "game"];

/** GET /api/v1/projects — projects built by Rishabh, optionally filtered. */
export default readOnlyJson((req) => {
  const category = req.query.category as string | undefined;
  if (category && !CATEGORIES.includes(category)) {
    return {
      error: {
        status: 400,
        code: "invalid_parameter",
        title: "Invalid category",
        detail: `Unknown category "${category}". Valid values: ${CATEGORIES.join(", ")}.`,
        extra: { parameter: "category", allowedValues: CATEGORIES },
      },
    };
  }
  const items = category
    ? PROJECTS.filter((p) => p.category === category)
    : PROJECTS;
  return {
    data: items,
    meta: { total: items.length, category: category ?? null, categories: CATEGORIES },
  };
});
