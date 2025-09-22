# Cursor: Add YouTube Media Module (Playlists + Search + Sticky Player + Focus Mode)

Stack: Next.js App Router (TS), shadcn/ui, Auth.js (Google), Tailwind.
Goal: A "Media" section under Control Center that:
- Lists my YouTube playlists (private + public) and their videos
- Lets me search YouTube
- Plays videos in a sticky mini-player (IFrame Player API)
- Has a Focus Mode that auto-starts a chosen playlist for a timed block (Pomodoro-style)
- Caches API responses to reduce YouTube quota

Security:
- Server-only tokens. No secrets client-side.
- Use Google OAuth with added scope: https://www.googleapis.com/auth/youtube.readonly
- For public-only reads you MAY fall back to YOUTUBE_API_KEY, but default to OAuth for private playlists.

Update .env.example (don’t put real secrets):
- Add: YOUTUBE_API_KEY=optional-public-only
- Ensure we have GOOGLE_CLIENT_ID/SECRET set (already) and that we add youtube.readonly scope in the Google provider config.

────────────────────────────────────────────────────────────────────
1) LIB: YouTube adapter (server-only)
────────────────────────────────────────────────────────────────────
Create: /lib/integrations/youtube.ts
- Export typed functions using fetch:
  - getMyPlaylists({ pageToken?, pageSize?=25 }): Promise<{ items: Array<{ id, title, thumbnails, count }>, nextPageToken? }>
  - getPlaylistItems({ playlistId, pageToken?, pageSize?=25 }): Promise<{ items: Array<{ id, videoId, title, thumbnails, channelTitle, publishedAt }>, nextPageToken? }>
  - searchVideos({ q, pageToken?, pageSize?=25 }): Promise<{ items: Array<{ id, videoId, title, thumbnails, channelTitle, publishedAt }>, nextPageToken? }>
- Use OAuth Authorization: Bearer <access_token>. Get token from Auth.js session or token store.
- If no OAuth token is available AND YOUTUBE_API_KEY exists, support public-only reads via key param.
- Add lightweight in-memory cache (Map) with TTL (e.g., 60s) to reduce quota.

Add doc links as comments:
- Data API v3: https://developers.google.com/youtube/v3/docs
- Quotas note and pagination handling.

────────────────────────────────────────────────────────────────────
2) API Routes (server handlers)
────────────────────────────────────────────────────────────────────
Create handlers under /app/api/media/youtube/*

Files:
- /app/api/media/youtube/playlists/route.ts
  GET -> query: pageToken?
  Returns paged playlists from getMyPlaylists().
- /app/api/media/youtube/playlist/route.ts
  GET -> query: id=<playlistId>&pageToken?
  Returns paged playlist items from getPlaylistItems().
- /app/api/media/youtube/search/route.ts
  GET -> query: q=<term>&pageToken?
  Returns paged search results from searchVideos().

All handlers:
- Validate auth (single-user ok).
- Wrap in try/catch; return { error } with 4xx/5xx on failure.
- Strong types; no any.

────────────────────────────────────────────────────────────────────
3) UI: Media pages + components
────────────────────────────────────────────────────────────────────
Routes:
- /app/(admin)/control-center/media/page.tsx   # Playlists view (default)
- /app/(admin)/control-center/media/search/page.tsx
- /app/(admin)/control-center/media/_components/PlaylistCard.tsx
- /app/(admin)/control-center/media/_components/VideoRow.tsx
- /app/(admin)/control-center/media/_components/StickyPlayer.tsx
- /app/(admin)/control-center/media/_components/FocusBar.tsx

Behavior:
- Media “home” shows your playlists as cards (title, count, thumbnail). Click -> loads videos below (or navigate to /media?playlistId=...).
- Each video row has Play (loads into StickyPlayer), “Open on YouTube” link, and a “Queue” button (queue is client-only in state for now).
- Search page lets you search videos and play/queue results.
- StickyPlayer: a client component that mounts once (on Media routes), embeds the IFrame Player API, shows title + basic controls (Play/Pause/Next from queue).
- FocusBar: pick a playlist, choose 25/50/75m (Pomodoro-ish), Start -> shows a countdown; when starts, auto-plays the first video and keeps queue rolling; optional desktop notification at end.

Styling:
- Keep it minimal: shadcn Card/List, compact spacing, keyboardable.

────────────────────────────────────────────────────────────────────
4) Google OAuth scope update
────────────────────────────────────────────────────────────────────
Update Google provider config to include "https://www.googleapis.com/auth/youtube.readonly".
- File: /lib/oauth/providers/google.ts (or wherever your Auth.js Google provider lives)
- Comment why: access private playlists/liked videos.

────────────────────────────────────────────────────────────────────
5) Types + utils
────────────────────────────────────────────────────────────────────
- Add /lib/youtube/types.ts with mapped response types you actually use.
- Add /lib/time/format.ts for mm:ss formatter and a simple countdown hook (client).

────────────────────────────────────────────────────────────────────
6) Code: Generate files (put file path comments on top)
────────────────────────────────────────────────────────────────────

# /lib/integrations/youtube.ts
# (server-only adapter with small in-memory cache + OAuth or API key fallback)
# Include: getOAuthAccessToken() stub that reads from Auth.js session or token store.

# /app/api/media/youtube/playlists/route.ts
# /app/api/media/youtube/playlist/route.ts
# /app/api/media/youtube/search/route.ts

# /app/(admin)/control-center/media/page.tsx
# Server component: fetch playlists via API; render grid; when playlistId present (searchParams), fetch and render that playlist’s items below the grid.
# Include a right-aligned link “Search” to /control-center/media/search.

# /app/(admin)/control-center/media/_components/PlaylistCard.tsx
# UI card for a playlist (title, count, thumbnail, onClick).

# /app/(admin)/control-center/media/_components/VideoRow.tsx
# Renders title, channel, publishedAt, small thumb, Play, Queue, Open on YouTube.

# /app/(admin)/control-center/media/_components/StickyPlayer.tsx
# Client component that:
# - Loads YouTube IFrame API (once)
# - Creates player in a fixed bottom bar
# - Exposes play(url|videoId), pause, next from a local queue (zustand or simple context)
# - Shows current title, a tiny progress bar (optional), and transport buttons.
# - Hides completely when queue is empty.

# /app/(admin)/control-center/media/_components/FocusBar.tsx
# Client component at top of Media pages:
# - Dropdown: pick a playlist (pre-fetched minimal list)
# - Duration buttons: 25 / 50 / 75
# - Start/Stop: on Start, fetch first N videos of selected playlist, push to player queue, start countdown
# - Shows remaining time; at 0, pauses and fires a toast/notification.

# /app/(admin)/control-center/media/search/page.tsx
# Client/server hybrid:
# - Input for query; on submit, fetch /api/media/youtube/search?q=...
# - Paginate with nextPageToken
# - Video rows with Play/Queue

# /lib/youtube/types.ts
# Define only the fields we use from YouTube API.

# /lib/time/format.ts
# export const formatDuration = (ms:number)=>"...";
# export const secondsToHMS = (s:number)=>"...";

────────────────────────────────────────────────────────────────────
7) Minimal player state (client)
────────────────────────────────────────────────────────────────────
Create a tiny zustand store (or React context) under /app/(admin)/control-center/media/_state/playerStore.ts:
- queue: Array<{ videoId, title }>
- currentIndex: number
- actions: playNow(video), queue(video), next(), prev(), clear()

StickyPlayer subscribes to this store and controls the iframe.

────────────────────────────────────────────────────────────────────
8) Nice-to-haves (light stubs now)
────────────────────────────────────────────────────────────────────
- “Save for later” list stored locally in DB (optional): add model SavedVideo { id, videoId, title, addedAt } and a /api/media/youtube/saved route.
- Pre-roll volume cap to avoid blasting audio at load.
- Respect prefers-reduced-motion by disabling progress animations.

Deliverables:
- Working Media section with playlists, playlist items, search
- StickyPlayer with queue controls
- FocusBar with auto-play + countdown
- OAuth scope added + comments
- Strong types, clean UI
