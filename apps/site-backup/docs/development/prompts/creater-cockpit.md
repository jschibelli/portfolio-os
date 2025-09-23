# Cursor Prompt — "Creator Cockpit" (Personal Admin Control Center)

Repo: your Next.js App Router project (same branch you’re on).
Goal: Add a full "Control Center" with dockable panels and typed adapters for all integrations.
Keep it personal (single-user). Use shadcn/ui + Tailwind. Strong types, server actions, no any.

## Structure

### Routes & Layout
- /app/(admin)/control-center/layout.tsx                 # wraps all cockpit routes, header + left rail
- /app/(admin)/control-center/page.tsx                   # Today view dashboard
- /app/(admin)/control-center/composer/page.tsx
- /app/(admin)/control-center/email/page.tsx
- /app/(admin)/control-center/calendar/page.tsx
- /app/(admin)/control-center/social/page.tsx
- /app/(admin)/control-center/analytics/page.tsx
- /app/(admin)/control-center/devops/page.tsx
- /app/(admin)/control-center/finance/page.tsx
- /app/(admin)/control-center/notes/page.tsx
- /app/(admin)/settings/accounts/page.tsx

### UI Components (co-locate under each section)
- /app/(admin)/control-center/_components/CommandK.tsx
- /app/(admin)/control-center/_components/StatusStrip.tsx
- /app/(admin)/control-center/_components/Panel.tsx        # generic card w/ header, actions

- Composer:
  /app/(admin)/control-center/composer/Composer.tsx        # title, rich text, media, channel toggles
  /app/(admin)/control-center/composer/ChannelToggle.tsx
  /app/(admin)/control-center/composer/SchedulePicker.tsx

- Email:
  /app/(admin)/control-center/email/GmailList.tsx
  /app/(admin)/control-center/email/MessageSheet.tsx

- Calendar:
  /app/(admin)/control-center/calendar/WeekStrip.tsx
  /app/(admin)/control-center/calendar/QuickAdd.tsx

- Social:
  /app/(admin)/control-center/social/QueueTable.tsx
  /app/(admin)/control-center/social/ActivityList.tsx

- Analytics:
  /app/(admin)/control-center/analytics/Tiles.tsx

- DevOps:
  /app/(admin)/control-center/devops/GitHubPanel.tsx
  /app/(admin)/control-center/devops/VercelPanel.tsx
  /app/(admin)/control-center/devops/SentryPanel.tsx

- Finance:
  /app/(admin)/control-center/finance/StripePanel.tsx

- Notes:
  /app/(admin)/control-center/notes/NotesEditor.tsx         # markdown editor (Tiptap or simple)

### API Routes (server actions/handlers)
- /app/api/social/publish/route.ts                          # POST { channels[], body, media?, scheduledAt? }
- /app/api/gmail/send/route.ts                              # POST { to, subject, body, inReplyTo? }
- /app/api/gmail/list/route.ts                              # GET ?type=starred|unread
- /app/api/calendar/event/route.ts                          # POST { title, start, end, ... }
- /app/api/calendar/upcoming/route.ts                       # GET { limit? }
- /app/api/analytics/overview/route.ts                      # GET
- /app/api/devops/github/route.ts                           # GET { feed: "issues|prs|commits" }
- /app/api/devops/vercel/route.ts                           # GET { project? }
- /app/api/devops/sentry/route.ts                           # GET { project? }
- /app/api/finance/stripe/summary/route.ts                  # GET
- /app/api/notes/route.ts                                   # GET/POST for local notes
- /app/api/oauth/[provider]/route.ts                        # optional helper passthrough

### Server Libs (adapters with typed stubs; leave TODOs for exact API calls)
- /lib/crypto/secureStore.ts                # encrypt/decrypt tokens at rest
- /lib/oauth/providers/google.ts            # Auth.js config for Gmail + Calendar scopes
- /lib/oauth/providers/linkedin.ts
- /lib/oauth/providers/facebook.ts          # Pages/Graph
- /lib/oauth/providers/threads.ts           # Threads (Meta)
- /lib/oauth/providers/github.ts
- /lib/oauth/providers/vercel.ts
- /lib/oauth/providers/sentry.ts
- /lib/oauth/providers/stripe.ts
- /lib/oauth/providers/plaussible.ts        # if using API token; otherwise Vercel Analytics
- /lib/integrations/gmail.ts                # send, listStarred, listUnread, getMessage
- /lib/integrations/calendar.ts             # listUpcoming, createEvent, updateEvent
- /lib/integrations/linkedin.ts             # publishUGC, status
- /lib/integrations/facebook.ts             # publishPagePost, status
- /lib/integrations/threads.ts              # publish, status
- /lib/integrations/github.ts               # listIssues, listPRs, recentCommits
- /lib/integrations/vercel.ts               # deployments list/status
- /lib/integrations/sentry.ts               # issues, latest errors
- /lib/integrations/stripe.ts               # payouts, charges summary
- /lib/integrations/plaussible.ts           # visitors, pageviews, sources
- /lib/featureFlags.ts                      # FEATURE_* booleans
- /lib/types/controlCenter.ts               # enums, DTOs

### Prisma Models (add & migrate)
- ConnectedAccount {
    id           String @id @default(cuid())
    provider     String
    scopes       String
    accessTokenEnc   String
    refreshTokenEnc  String?
    expiresAt    DateTime?
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    userId       String
  }

- OutboundItem {
    id          String   @id @default(cuid())
    userId      String
    type        String   // 'email' | 'social' | 'calendar'
    channel     String   // 'gmail' | 'linkedin' | 'facebook' | 'threads'
    status      String   // 'SCHEDULED' | 'SENT' | 'FAILED'
    externalId  String?
    scheduledAt DateTime?
    payloadJson Json
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }

- Note {
    id        String   @id @default(cuid())
    userId    String
    title     String
    content   String   // markdown
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

### Feature Flags (read from env; fallback to true for personal build)
- FEATURE_GMAIL, FEATURE_CALENDAR, FEATURE_LINKEDIN, FEATURE_FACEBOOK, FEATURE_THREADS
- FEATURE_ANALYTICS, FEATURE_DEVOPS, FEATURE_STRIPE, FEATURE_NOTES

### Header & Command Palette
- Implement ⌘K command palette with:
  - "New Email", "New Event", "New Post", "New Note"
  - “Go to …” nav items for each zone
  - Quick search: notes titles, queued posts, upcoming events

### Today View Composition (/control-center/page.tsx)
- Panels (responsive grid):
  - Next events (10)
  - Starred + Unread (compact list + quick reply button)
  - Social Queue (scheduled)
  - Deploys (latest Vercel deploys with status)
  - Revenue snapshot (Stripe last 7/30 days)
  - Analytics tiles (visitors, top referrers)
  - Mini Tasks/Notes (last edited)

### Security & Auth
- Use Auth.js; strongly type Session. Store refresh tokens encrypted via secureStore.
- All integration calls run server-side (server actions or route handlers).
- Never expose tokens to client; adapters only return derived data.

### TODO Doc Links (leave as comments inside adapters)
- Gmail send (messages.send) and list: https://developers.google.com/workspace/gmail/api/guides
- Calendar events: https://developers.google.com/workspace/calendar/api/guides/create-events
- LinkedIn UGC: https://learn.microsoft.com/linkedin/consumer/integrations/self-serve/share-on-linkedin
- Facebook Pages posts: https://developers.facebook.com/docs/pages-api/posts/
- Threads API: https://developers.facebook.com/docs/threads/
- GitHub REST: https://docs.github.com/rest
- Vercel REST: https://vercel.com/docs/rest-api
- Sentry REST: https://docs.sentry.io/api/
- Plausible API: https://plausible.io/docs/stats-api
- Stripe balance/charges: https://stripe.com/docs/api

### DX / Styling
- Follow existing admin shell styles; keep panels minimal, keyboardable, and accessible.
- All new files include file path comments at top.
- Provide a README section "Control Center Setup" with required OAuth scopes, callback URLs, and env vars.
- Provide a seed script that creates a couple of Notes and a dummy scheduled OutboundItem (no external calls).

Deliverables:
1) New routes, components, and adapters scaffolded (typed stubs, no mock data).
2) Prisma migration for ConnectedAccount, OutboundItem, Note.
3) Feature flags checked in UI to hide sections if not connected.
4) README updates + .env.example keys for each provider.
