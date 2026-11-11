---
title: "Authentication — portfolio-hero-psi-lemon.vercel.app"
description: "How agents authenticate against portfolio-hero-psi-lemon.vercel.app: they don't. Every endpoint is public and read-only, except the chat API, which is origin-locked rather than key-based."
canonical: "https://portfolio-hero-psi-lemon.vercel.app/auth.md"
last-updated: "2026-11-11"
author: "Rishabh Sharma"
---

# Authentication

**Short version: there are no credentials to obtain.** portfolio-hero-psi-lemon.vercel.app issues no
API keys, runs no OAuth flow, and has no signup, token endpoint, or client
registration. If you are an agent looking for a way to authenticate, you do not
need one.

## Public endpoints — no authentication

Every read endpoint is open, unauthenticated, and side-effect free. Call them
directly:

| Endpoint | Method | Returns |
| --- | --- | --- |
| `/llms.txt` | GET | Structured context about Rishabh Sharma |
| `/index.md`, `/about.md`, `/contact.md`, `/privacy.md`, `/developers.md` | GET | Markdown with YAML frontmatter |
| `/sitemap.xml` | GET | Every canonical URL |
| `/blog/feed.xml` | GET | RSS feed of blog posts |
| `/openapi.json` | GET | OpenAPI 3.1 description of this API |
| `/.well-known/ai-catalog.json` | GET | Agentic Resource Discovery catalog |
| `/.well-known/api-catalog` | GET | RFC 9727 linkset |

Any canonical page also returns markdown when you send `Accept: text/markdown`,
append `.md`, add `?mode=agent`, or identify yourself with a known AI crawler
User-Agent.

## POST /api/chat — origin-locked, not key-authenticated

The one endpoint that consumes upstream model quota is protected by an origin
check rather than a credential:

```bash
curl -N -X POST https://portfolio-hero-psi-lemon.vercel.app/api/chat \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://portfolio-hero-psi-lemon.vercel.app' \
  -d '{"messages":[{"role":"user","content":"What has Rishabh built?"}]}'
```

Requests must carry an `Origin` or `Referer` header beginning with
`https://portfolio-hero-psi-lemon.vercel.app`. Anything else
returns `403 {"error":"Forbidden"}`. There is no key, token, or scope that
changes this — the check exists to keep the model quota attached to the site's
own UI.

The endpoint is rate limited to **10 requests per IP per minute**; exceeding it
returns `429`. Back off rather than retrying immediately.

## If you need unrestricted programmatic access

There is no self-serve path to it, deliberately. Email
**rishabhsharma14426@gmail.com** describing what you are building and the volume you
expect. That is the entire process — there is no developer account to create and
no dashboard to log into.

## What does not exist

To save you probing for them: no `/.well-known/oauth-authorization-server`, no
`/.well-known/oauth-protected-resource`, no token endpoint, no client
registration, no refresh tokens, no scopes, and no sandbox with separate
credentials. Every endpoint above is read-only, so production is safe to call
directly.
