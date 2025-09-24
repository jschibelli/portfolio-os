<p align="center">
  <a href="https://schibelli.dev">
    <img src="apps/site/public/assets/og.png" alt="John Schibelli — Portfolio OS" width="100%" />
  </a>
</p>

<h1 align="center">Portfolio OS</h1>
<p align="center">A modern, production-grade monorepo powering <a href="https://schibelli.dev">schibelli.dev</a> — portfolio, blog, admin dashboard, and AI tools.</p>

<p align="center">
  <a href="https://github.com/johnschibelli/portfolio-os/blob/main/LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-black.svg"></a>
  <a href="https://schibelli.dev"><img alt="Live Site" src="https://img.shields.io/badge/Live-schibelli.dev-black"></a>
  <a href="https://vercel.com"><img alt="Deploys on Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black"></a>
</p>

## Overview

Portfolio OS is a Next.js 14 monorepo built with TypeScript, Tailwind CSS, and Turborepo. It includes a content site, a dashboard with admin tooling, and shared packages for UI, utilities, and integrations. Content is sourced from Hashnode via GraphQL with optional headless mode.

### Apps

- `apps/site`: Public portfolio, blog, projects, case studies, and API routes
- `apps/dashboard`: Admin dashboard and content management
- `apps/documentation-portfolio-os`: Internal docs (optional)

### Packages

- `packages/ui`: Shared UI components
- `packages/lib`: Domain logic and shared services
- `packages/utils`: Utilities
- `packages/emails`: Transactional email templates (Resend)
- `packages/db`: Prisma schema and database access (used by dashboard)
- `packages/hashnode`: Hashnode client helpers
- `packages/tsconfig`, `packages/eslint-config-custom`: Tooling

## Tech Stack

- Next.js 14 App Router, React 18, TypeScript
- Tailwind CSS, Radix UI, Lucide Icons
- Prisma, Vercel Blob, Upstash Redis
- OpenAI (image + text), Resend (email)
- Turborepo monorepo, PNPM

## Getting Started

1. Install PNPM and Node 18+
2. Copy env examples and install deps

```bash
pnpm i
cp apps/site/.env.example apps/site/.env.local || true
cp apps/dashboard/.env.example apps/dashboard/.env.local || true
```

3. Generate Prisma client (dashboard)

```bash
cd apps/dashboard && pnpm prisma generate && cd ../../
```

4. Run all apps

```bash
pnpm dev
```

Visit `http://localhost:3000` for `apps/site`. Dashboard port may vary by your setup.

## Environment Variables (core)

Set these for local dev:

```bash
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
OPENAI_API_KEY=sk-...
RESEND_API_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Optional:

```bash
NEXT_PUBLIC_BASE_URL=/
NEXT_PUBLIC_MODE=development
```

## SEO & Open Graph

- Default OG/Twitter image is `apps/site/public/assets/og.png`.
- Page-level OG is generated dynamically for projects via `app/projects/[slug]/opengraph-image.tsx` and for blog posts via `generateMetadata` in `app/blog/[slug]/page.tsx`.
- Update global metadata in `apps/site/app/layout.tsx`.

## Scripts

```bash
pnpm dev         # Run all apps
pnpm build       # Build all packages/apps
pnpm lint        # Lint workspace
pnpm test        # Run tests
pnpm typecheck   # Type check
```

## Folder Structure (high-level)

```
.
├─ apps
│  ├─ site
│  └─ dashboard
├─ packages
│  ├─ ui
│  ├─ lib
│  ├─ utils
│  ├─ emails
│  ├─ db
│  ├─ hashnode
│  ├─ tsconfig
│  └─ eslint-config-custom
└─ temp_backup
```

## Contributing

Internal project. PRs welcome for issues you spot in the README or general improvements.

## License

MIT © John Schibelli
