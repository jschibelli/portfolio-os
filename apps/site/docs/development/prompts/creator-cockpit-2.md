# Cursor: Wire up the Creator Cockpit — real adapters, API routes, scheduler, and UI

Repo: Next.js App Router (TypeScript), shadcn/ui, Auth.js. Personal, single-user.
Goal: Make the Control Center feature-rich with real integrations:
- Gmail (list Starred/Unread, quick reply/send)
- Google Calendar (list upcoming, quick add)
- LinkedIn (UGC publish)
- Facebook Pages (publish)
- Threads (publish)
- GitHub (issues/PRs/commits assigned to me)
- Vercel (latest deployments + statuses)
- Sentry (latest issues)
- Plausible (visitors/referrers/top pages)
- Stripe (revenue snapshot, recent payouts/charges)
- Queue + scheduler for social/email posts (immediate or scheduled)
- Webhooks where available (Stripe events; optional others later)
- Global error/ratelimit handling + retries

Guardrails:
- Server-only for tokens. No secrets client-side.
- Typed adapters per provider under /lib/integrations/* with doc links in comments.
- Minimal deps. Use built-ins + fetch. If needed, use tiny utilities only.
- Keep UI minimal, accessible, and fast. Don’t block rendering on slow networks.
- Feature flags respected (env FEATURE_*). Panels hide gracefully if disabled or not connected.

────────────────────────────────────────────────────────────────────
1) LIB ADAPTERS (server-only)
────────────────────────────────────────────────────────────────────
Create files with typed functions and TODO notes for any missing edge cases.

# /lib/integrations/gmail.ts
// Docs: https://developers.google.com/workspace/gmail/api/guides
// Functions:
// - listStarred(limit: number): Promise<Array<{id, threadId, subject, from, snippet, internalDate}>>
// - listUnread(limit: number): Promise<same-as-above>
// - getMessage(id: string): Promise<{ headers, bodyHtml?, bodyText? }>
// - sendRawEmail({ to, subject, bodyHtml?, bodyText?, inReplyTo? }): Promise<{ id }>
// Use OAuth user token via Auth.js session; use base64url RFC822 for send (messages.send).

# /lib/integrations/calendar.ts
// Docs: https://developers.google.com/workspace/calendar/api/guides/create-events
// Functions:
// - listUpcoming({ calendarId, maxResults }): Promise<Array<{ id, summary, start, end, hangoutLink? }>> 
// - createEvent({ calendarId, title, start, end, location?, attendees? }): Promise<{ id, htmlLink }>

# /lib/integrations/linkedin.ts
// Docs: https://learn.microsoft.com/linkedin/consumer/integrations/self-serve/share-on-linkedin
// Functions:
// - publishUGC({ text, media? }): Promise<{ id }>
// Use w_member_social; author = "urn:li:person:{id}" from /me. If media not implemented yet, support text-first.

# /lib/integrations/facebook.ts
// Docs: https://developers.facebook.com/docs/pages-api/posts/
// Functions:
// - publishPagePost({ pageId, message, link? }): Promise<{ id }>
// Exchange user token -> page token if needed; store page token server-side.

# /lib/integrations/threads.ts
// Docs: https://developers.facebook.com/docs/threads/
// Functions:
// - publishThread({ text, mediaUrl? }): Promise<{ id }>

# /lib/integrations/github.ts
// Docs: https://docs.github.com/rest
// Functions:
// - listAssignedIssues({ owner, repo, state }): Promise<Array<{ id, number, title, url }>>
// - listAssignedPRs({ owner, repo, state }): Promise<Array<{ id, number, title, url }>>
// - listRecentCommits({ owner, repo, branch?, limit? }): Promise<Array<{ sha, msg, url, author, date }>>

# /lib/integrations/vercel.ts
// Docs: https://vercel.com/docs/rest-api
// Functions:
// - listDeployments({ projectId?, limit? }): Promise<Array<{ uid, url, state, createdAt }>>

# /lib/integrations/sentry.ts
// Docs: https://docs.sentry.io/api/
// Functions:
// - listIssues({ org, project, limit? }): Promise<Array<{ id, title, culprit, permalink, lastSeen }>>

# /lib/integrations/plausible.ts
// Docs: https://plausible.io/docs/stats-api
// Functions:
// - overview({ site, period }): Promise<{ visitors, pageviews, bounce_rate, visit_duration }>
// - topReferrers({ site, period, limit? }): Promise<Array<{ source, visitors }>> 
// - topPages({ site, period, limit? }): Promise<Array<{ page, visitors }>>

# /lib/integrations/stripe.ts
// Docs: https://stripe.com/docs/api
// Functions:
// - revenueSnapshot({ days }): Promise<{ total, currency }>
// - recentPayouts({ limit? }): Promise<Array<{ id, amount, arrival_date, status }>>
// - recentCharges({ limit? }): Promise<Array<{ id, amount, created, status, description }>>


────────────────────────────────────────────────────────────────────
2) DB MODELS (Prisma) — queue + activity + notes you already have
────────────────────────────────────────────────────────────────────
Add or update schema to include a Job queue and Activity log.

# prisma/schema.prisma (append)
model Job {
  id          String   @id @default(cuid())
  type        String   // 'email' | 'social'
  payloadJson Json
  runAt       DateTime
  status      String   // 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED'
  attempts    Int      @default(0)
  lastError   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Activity {
  id          String   @id @default(cuid())
  kind        String   // 'EMAIL_SENT' | 'POST_PUBLISHED' | 'EVENT_CREATED' | 'DEPLOY_COMPLETE' | etc.
  channel     String?  // 'gmail' | 'linkedin' | 'facebook' | 'threads' | 'calendar' | ...
  externalId  String?
  meta        Json?
  createdAt   DateTime @default(now())
}

Run migration.

────────────────────────────────────────────────────────────────────
3) API ROUTES (App Router — route handlers)
────────────────────────────────────────────────────────────────────
Implement typed handlers that call the adapters.

# /app/api/gmail/list/route.ts
// GET ?type=starred|unread&limit=25
// Returns lightweight message summaries.

# /app/api/gmail/send/route.ts
// POST { to, subject, bodyHtml?, bodyText?, inReplyTo? }
// Sends via gmail.sendRawEmail; logs Activity.

# /app/api/calendar/upcoming/route.ts
// GET { limit=10, calendarId=env.GOOGLE_CALENDAR_ID }
// Returns next events.

# /app/api/calendar/event/route.ts
// POST { title, start, end, location?, attendees? } -> createEvent; logs Activity.

# /app/api/social/publish/route.ts
// POST { channels: string[], body: string, media?: { type: 'image'|'link', url?: string }, scheduledAt?: string|null }
// If scheduledAt in future => create Job; else publish immediately via adapters.
// For each published channel, write Activity with externalId.

# /app/api/devops/github/route.ts
// GET { feed: "issues"|"prs"|"commits", state?, branch?, limit? }

# /app/api/devops/vercel/route.ts
// GET { projectId?, limit? }

# /app/api/devops/sentry/route.ts
// GET { project?, limit? }

# /app/api/analytics/overview/route.ts
// GET -> Plausible overview + topReferrers + topPages summarized.

# /app/api/finance/stripe/summary/route.ts
// GET -> revenueSnapshot + recentPayouts + recentCharges.


────────────────────────────────────────────────────────────────────
4) QUEUE + SCHEDULER
────────────────────────────────────────────────────────────────────
Add a tiny cron + executor. Use Vercel Cron (or a local Node cron) to poll due Jobs.

# /app/api/cron/run-jobs/route.ts
// GET or POST (Vercel Cron friendly)
// 1) Find jobs with runAt <= now and status == 'QUEUED' (limit e.g. 10).
// 2) Mark RUNNING, execute per type via adapters (email/social).
// 3) On success -> SUCCESS + Activity rows; on failure -> increment attempts; if attempts < 5, reschedule with backoff; else mark FAILED with lastError.
// IMPORTANT: protect this route via a secret header (CRON_SECRET). Validate before running.

Add env: CRON_SECRET=replace-me
Create /lib/queue/backoff.ts util (e.g., exponential with jitter).


────────────────────────────────────────────────────────────────────
5) WEBHOOKS
────────────────────────────────────────────────────────────────────
Start with Stripe. Others can follow later.

# /app/api/webhooks/stripe/route.ts
// Verify signature (STRIPE_WEBHOOK_SECRET).
// On events (payout.paid, charge.succeeded, charge.refunded):
//   -> write Activity with relevant metadata.
// Return 200 JSON.

Update README with the endpoint and add it in Stripe dashboard (test mode first).

────────────────────────────────────────────────────────────────────
6) UI WIRING (panels that actually talk to routes)
────────────────────────────────────────────────────────────────────
Enhance the Control Center pages to fetch from new API routes and render real data.

# /app/(admin)/control-center/page.tsx  (Today)
- Server component loads:
  - next events (calendar/upcoming)
  - gmail starred+unread counts (just fetch totals)
  - social queue (Jobs with type 'social' and runAt > now)
  - vercel latest deploys
  - stripe revenue snapshot
  - plausible overview
- Render fast tiles with skeletons; link into each dedicated section.

# /app/(admin)/control-center/email/page.tsx
- Server component + client parts:
  - Fetch starred/unread lists via /api/gmail/list.
  - Show MessageSheet on click (call /api/gmail/get?id=... if you add it; otherwise inline body from getMessage).
  - Quick reply posts to /api/gmail/send and shows toast + Activity.

# /app/(admin)/control-center/calendar/page.tsx
- Week strip (client) + server data for upcoming list.
- Quick Add form hitting /api/calendar/event (server action or fetch).
- Toast on success.

# /app/(admin)/control-center/composer/page.tsx
- Single surface:
  - Title (optional), Body (rich or textarea), optional media URL/link.
  - Channel toggles: Gmail (as draft email to yourself or target), LinkedIn, Facebook, Threads.
  - When “Post now” -> POST /api/social/publish with channels/body/media.
  - When “Schedule” -> pick datetime -> same POST with scheduledAt -> Job queued.
  - Show a right-rail “Activity” list (last 10) with per-channel result IDs.

# /app/(admin)/control-center/social/page.tsx
- QueueTable shows future Jobs; allow cancel (DELETE /app/api/jobs/[id]).
- ActivityList shows recent posts with links out to the networks when possible.

# /app/(admin)/control-center/devops/page.tsx
- Tabs for GitHub (issues/PRs/commits), Vercel (deployments), Sentry (issues).
- All read-only to start; include URLs to jump out.

# /app/(admin)/control-center/analytics/page.tsx
- Overview tiles from Plausible: visitors, pageviews, bounce, duration.
- Top referrers/pages tables (limit 5–10). Period selector (7d/30d).

# /app/(admin)/control-center/finance/page.tsx
- Stripe revenue snapshot (7d/30d), payouts list, recent charges.

# /app/(admin)/control-center/_components/StatusStrip.tsx
- Tiny status row for header: latest deploy state, queue length, unread/starred counts.

────────────────────────────────────────────────────────────────────
7) ERROR / RATELIMIT / RETRIES
────────────────────────────────────────────────────────────────────
Add a tiny fetch wrapper with:
- Per-provider base URL + headers
- 429/backoff handling (Retry-After or exponential)
- Structured errors bubbled to route handlers

# /lib/net/fetchJson.ts
export async function fetchJson(url: string, init?: RequestInit & { retry?: number }): Promise<any> {
  // implement retry w/ exponential backoff + jitter for 429/5xx
}

Use it in all adapters.

────────────────────────────────────────────────────────────────────
8) SECURITY
────────────────────────────────────────────────────────────────────
- Use Auth.js session server-side to get user (single-user, but future-proof).
- Never return raw tokens in responses.
- Cron route must check CRON_SECRET header.
- Webhook must verify signatures.

────────────────────────────────────────────────────────────────────
9) README UPDATES
────────────────────────────────────────────────────────────────────
Append a "Control Center Setup" section:
- Required env vars (reference .env.example you already created).
- OAuth callback URLs for Google/LinkedIn/Facebook/Threads/GitHub.
- Stripe webhook URL and events to enable.
- Vercel Cron example (run /api/cron/run-jobs every minute or five).
- Scope notes and links to the official docs.

Deliverables for this task:
- All adapters with real calls (where possible without extra SDKs).
- All API routes returning typed JSON.
- Job model + cron executor + backoff.
- Stripe webhook writing Activity.
- Updated UI panels reading from these routes with skeletons + toasts.
- README updates.

When codegen, include file path comments above each snippet you emit.
Use strong TypeScript types for responses. No `any`.
