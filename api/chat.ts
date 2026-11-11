import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_ORIGINS = [
  "https://portfolio-hero-psi-lemon.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Simple in-memory rate limiter: 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): {
  limited: boolean;
  remaining: number;
  resetSeconds: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return {
      limited: false,
      remaining: RATE_LIMIT - 1,
      resetSeconds: RATE_WINDOW_MS / 1000,
    };
  }
  entry.count++;
  return {
    limited: entry.count > RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - entry.count),
    resetSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

/** RFC 9457 problem detail, so agents branch on `code` not on prose. */
function problem(
  res: VercelResponse,
  status: number,
  code: string,
  title: string,
  detail: string,
  extra: Record<string, unknown> = {}
) {
  res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
  return res.status(status).json({
    type: `https://portfolio-hero-psi-lemon.vercel.app/developers#${code}`,
    title,
    status,
    code,
    detail,
    ...extra,
  });
}

const SYSTEM_PROMPT = `You are an AI assistant on Rishabh Sharma's portfolio website. You represent Rishabh and answer questions about him in a helpful, friendly, slightly witty tone.

About Rishabh:
- Full name: Rishabh Sharma, 19 years old
- Education: B.Tech in Computer Science at GLA University, Mathura (2025–2028). Home town: Bulandshahr, Uttar Pradesh, India.
- Full-stack developer: React, Next.js, React Native, TypeScript, JavaScript, Node.js, Express.js, FastAPI, Python, Tailwind CSS, Supabase, PostgreSQL, Prisma, Vite, Expo, GSAP, GitHub Actions, Vercel, Render.
- Open source: 14 pull requests merged and 8 open across Jenkins, WordPress/Gutenberg and other projects.
- LeetCode: 212 problems solved (88 Easy, 99 Medium, 25 Hard).
- Products he built and shipped:
  - SecureGaurd — application security for every repository (https://secureguard-main.vercel.app)
  - SafeLife — emergency SOS app with live location tracking and guardian alerts (https://safelife-ai.vercel.app)
  - RailSync 2.0 — AI-powered railway block planning
  - Farmer Marketplace — farm-to-market platform with escrow payments (https://farmer-market-place-six.vercel.app)
  - LocalKart — campus marketplace for pre-loved essentials (https://localkart-jet.vercel.app)
  - Healthcare Hub — connected healthcare platform
  - MorphAI — AI-powered content tooling
- Tech creator: makes tech Reels about AI tools and coding as @cod.ehx on Instagram (https://www.instagram.com/cod.ehx). Runs a faceless history YouTube channel @UntoldHx.
- Skills include Video Editing (tech Reels).
- Contact: rishabhsharma14426@gmail.com | LinkedIn: linkedin.com/in/rishabh-sharma-342575438 | GitHub: github.com/r1shabhsharma05
- Open to: internships, open-source collaboration, freelance web development.

Rules:
- Answer only questions about Rishabh, his work, skills, and experience
- If asked about unrelated topics, politely redirect to portfolio-related conversation
- Keep responses concise (2-4 sentences unless more detail is requested)
- Be playful and use terminal/developer humor when appropriate
- Never make up information not provided above — never invent employment, internships, credentials, or project details`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-API-Version", "v1");
  res.setHeader("Vary", "Accept, Accept-Encoding");

  // Rate limit by IP. Signalled on every response so agents self-throttle
  // rather than discovering the limit by hitting a 429.
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  const { limited, remaining, resetSeconds } = checkRateLimit(ip);
  res.setHeader("RateLimit-Limit", String(RATE_LIMIT));
  res.setHeader("RateLimit-Remaining", String(remaining));
  res.setHeader("RateLimit-Reset", String(resetSeconds));
  res.setHeader("RateLimit-Policy", `${RATE_LIMIT};w=${RATE_WINDOW_MS / 1000}`);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return problem(
      res,
      405,
      "method_not_allowed",
      "Method not allowed",
      `This endpoint accepts POST, not ${req.method}.`
    );
  }

  // Origin check — only allow requests from the portfolio site
  const origin = req.headers.origin || req.headers.referer;
  const isAllowed =
    process.env.NODE_ENV === "development" ||
    (origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o)));
  if (!isAllowed) {
    return problem(
      res,
      403,
      "origin_not_allowed",
      "Forbidden",
      "This endpoint is origin-locked. Send an Origin or Referer header of https://portfolio-hero-psi-lemon.vercel.app. See /auth.md.",
      { documentation: "https://portfolio-hero-psi-lemon.vercel.app/auth.md" }
    );
  }

  if (limited) {
    res.setHeader("Retry-After", String(resetSeconds));
    return problem(
      res,
      429,
      "rate_limited",
      "Too many requests",
      `Rate limit exceeded. Retry after ${resetSeconds} seconds.`,
      { retryAfterSeconds: resetSeconds }
    );
  }

  const { messages } = req.body ?? {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return problem(
      res,
      400,
      "invalid_request",
      "Invalid request body",
      "`messages` must be a non-empty array of { role, content } objects.",
      { parameter: "messages" }
    );
  }

  const lastMsg = messages[messages.length - 1]?.content;
  if (typeof lastMsg === "string" && lastMsg.length > 500) {
    return problem(
      res,
      400,
      "message_too_long",
      "Message too long",
      "The final user message must be 500 characters or fewer.",
      { parameter: "messages", maxLength: 500 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return problem(
      res,
      500,
      "service_unconfigured",
      "AI service not configured",
      "The upstream model API key is missing. This is a server-side misconfiguration; retrying will not help."
    );
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      return problem(
        res,
        502,
        "upstream_error",
        "AI service returned an error",
        "The upstream model provider returned an error. This is usually transient — retry with backoff."
      );
    }

    // Stream SSE back to the client
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body?.getReader();
    if (!reader) {
      return problem(
        res,
        502,
        "upstream_error",
        "Empty upstream response",
        "The upstream model provider returned no response body. Retry with backoff."
      );
    }

    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              res.write("data: [DONE]\n\n");
            } else {
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
      }
    }

    res.end();
  } catch {
    return problem(
      res,
      500,
      "internal_error",
      "AI service unavailable",
      "An unexpected error occurred while generating a response. Retry with backoff."
    );
  }
}
