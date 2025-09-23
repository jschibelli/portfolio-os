Paste the following into Cursor as a single instruction. Cursor should generate files, install deps, run migrations, and scaffold the admin app and public blog routes. Use the exact file paths and code. Keep styles cohesive with Tailwind + shadcn.

---

# GOAL
Build a full‑control blog + admin in a Next.js 15 monorepo. Create a new app `packages/admin-dashboard` for the admin/editor and augment the existing site with a public `/blog` surface. Use:
- Next.js App Router, TypeScript, Tailwind.
- **Auth**: Auth.js (NextAuth) with Credentials provider + roles.
- **DB**: Prisma (PostgreSQL).
- **UI**: shadcn/ui shell + layout.
- **Editor**: Tiptap.
- **Tables**: TanStack Table.
- **Charts**: Tremor.
- **SEO**: dynamic OG endpoint, RSS, canonicals.
- **Jobs**: Vercel Cron to publish scheduled posts + revalidate routes.

# ACTIONS
1) Create `packages/admin-dashboard` Next.js app (App Router). Configure Tailwind + shadcn. Share UI tokens (if a `packages/ui` lib exists, import it; otherwise keep local and style with Tailwind).
2) Add Prisma to repo root if not present; otherwise extend. Generate schema below. Create seed that registers the first **admin** from env.
3) Implement Auth.js with Credentials (email/password). Store users in Prisma. Gate all `/admin` routes. Role = `ADMIN | EDITOR | AUTHOR`.
4) Scaffold admin routes: Overview (KPIs + charts), Articles list, New, Edit (Tiptap), Media library, Settings.
5) Public blog under `/app/blog` in the main app: list + article page, SEO, OG image endpoint, RSS.
6) API routes: articles CRUD, media upload (signed URL stub), revalidate, scheduler (cron) to publish scheduled posts → flips status + revalidates.
7) Provide a README with setup + commands.

# DEPENDENCIES (install)
At repo root and/or admin app:
```
# Core
npm i -D typescript @types/node
npm i next react react-dom

# Styling & UI
npm i tailwindcss postcss autoprefixer
npm i class-variance-authority clsx tailwind-merge
npm i lucide-react

# shadcn/ui
# (Initialize with Tailwind; include button, input, textarea, dialog, drawer, dropdown-menu, sheet, table, card, badge, tabs, tooltip, toast, navigation-menu, form)

# Data
npm i zod date-fns

# Prisma + DB
npm i prisma @prisma/client

# Auth
npm i next-auth @auth/prisma-adapter bcrypt

# Editor
npm i @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-code-block-lowlight lowlight @tiptap/extension-image @tiptap/extension-heading @tiptap/extension-task-list @tiptap/extension-task-item

# Tables
npm i @tanstack/react-table

# Charts
npm i @tremor/react
```

# ENVIRONMENT (.env.local at repo root)
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
AUTH_SECRET=change_me
# First admin bootstrap
AUTH_ADMIN_EMAIL=john@example.com
AUTH_ADMIN_PASSWORD=supersecurepassword
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

# PRISMA SCHEMA (create/merge as `/prisma/schema.prisma`)
```prisma
// generator + datasource
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

enum ArticleStatus { DRAFT SCHEDULED PUBLISHED ARCHIVED }
enum Visibility { PUBLIC UNLISTED PRIVATE MEMBERS }
enum Role { ADMIN EDITOR AUTHOR }
enum ReactionKind { LIKE CLAP HEART ROCKET }

model User {
  id        String  @id @default(cuid())
  name      String?
  email     String  @unique
  password  String  // bcrypt hash
  role      Role    @default(AUTHOR)
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  articles  Article[] @relation("AuthorArticles")
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  articles  ArticleTag[]
}

model Series {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  coverUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  articles    Article[]
}

model ImageAsset {
  id        String   @id @default(cuid())
  url       String
  width     Int?
  height    Int?
  alt       String?
  blurData  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  usedBy    Article[] @relation("CoverImage")
}

model Article {
  id           String        @id @default(cuid())
  title        String
  subtitle     String?
  slug         String        @unique
  status       ArticleStatus @default(DRAFT)
  visibility   Visibility    @default(PUBLIC)
  excerpt      String?
  authorId     String
  author       User          @relation("AuthorArticles", fields: [authorId], references: [id])
  seriesId     String?
  series       Series?       @relation(fields: [seriesId], references: [id])
  contentJson  Json?
  contentMdx   String?
  coverId      String?
  cover        ImageAsset?   @relation("CoverImage", fields: [coverId], references: [id])
  ogImageUrl   String?
  canonicalUrl String?
  canonicalSource String?
  noindex      Boolean       @default(false)
  publishedAt  DateTime?
  scheduledAt  DateTime?
  featured     Boolean       @default(false)
  allowComments Boolean      @default(true)
  paywalled    Boolean       @default(false)
  readingMinutes Int?
  views        Int           @default(0)
  tags         ArticleTag[]
  versions     ArticleVersion[]
  reactions    Reaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model ArticleTag {
  articleId String
  tagId     String
  assignedAt DateTime @default(now())
  article   Article @relation(fields: [articleId], references: [id])
  tag       Tag     @relation(fields: [tagId], references: [id])
  @@id([articleId, tagId])
}

model ArticleVersion {
  id          String   @id @default(cuid())
  articleId   String
  article     Article  @relation(fields: [articleId], references: [id])
  label       String?
  contentJson Json?
  contentMdx  String?
  note        String?
  createdAt   DateTime @default(now())
}

model Reaction {
  id        String       @id @default(cuid())
  articleId String
  kind      ReactionKind
  count     Int          @default(0)
  updatedAt DateTime     @updatedAt
  article   Article      @relation(fields: [articleId], references: [id])
}

model Redirect {
  id       String  @id @default(cuid())
  fromPath String  @unique
  toPath   String
  createdAt DateTime @default(now())
}
```

# PRISMA SEED (`/prisma/seed.ts`)
```ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.AUTH_ADMIN_EMAIL!;
  const password = process.env.AUTH_ADMIN_PASSWORD!;
  if (!email || !password) throw new Error("Set AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD");
  const hash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: { email, password: hash, role: "ADMIN", name: "Admin" },
  });
  console.log("Seeded admin:", admin.email);
}

main().finally(() => prisma.$disconnect());
```

Add to package.json scripts:
```
"prisma:push": "prisma db push",
"prisma:migrate": "prisma migrate dev --name init",
"prisma:seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"
```

# AUTH.JS (NextAuth) at `apps/site/app/api/auth/[...nextauth]/route.ts` or similar in the primary app
```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user) return null;
        const ok = await bcrypt.compare(creds.password, user.password);
        return ok ? { id: user.id, email: user.email, name: user.name, role: user.role } as any : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      return session;
    },
  },
});
export { handler as GET, handler as POST };
```

# MIDDLEWARE to protect `/admin` (in admin app): `packages/admin-dashboard/middleware.ts`
```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token || !["ADMIN", "EDITOR", "AUTHOR"].includes((token as any).role)) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
```

# ADMIN APP LAYOUT (shadcn shell)
`packages/admin-dashboard/app/layout.tsx`
```tsx
export const metadata = { title: "Admin", description: "Admin Dashboard" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
          <aside className="hidden md:block border-r p-4">{/* nav */}</aside>
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

# ADMIN ROUTES
```
packages/admin-dashboard/app/page.tsx                 // Overview (KPIs + Tremor charts)
packages/admin-dashboard/app/admin/articles/page.tsx  // TanStack table list
packages/admin-dashboard/app/admin/articles/new/page.tsx
packages/admin-dashboard/app/admin/articles/[id]/page.tsx  // Tiptap editor + settings drawer
packages/admin-dashboard/app/admin/media/page.tsx
packages/admin-dashboard/app/admin/settings/page.tsx
packages/admin-dashboard/app/login/page.tsx           // Credentials login
```

Simple login page `app/login/page.tsx`:
```tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="mx-auto max-w-sm space-y-4 p-8 border rounded-xl">
      <h1 className="text-xl font-medium">Sign in</h1>
      <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full border rounded px-3 py-2" onClick={() => signIn("credentials", { email, password, callbackUrl: "/admin" })}>Sign in</button>
    </div>
  );
}
```

# TIPTAP EDITOR scaffold
`packages/admin-dashboard/components/editor/Editor.tsx`
```tsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

export function Editor({ initialContent, onChange }: { initialContent?: any; onChange?: (json:any)=>void }) {
  const editor = useEditor({
    extensions: [StarterKit, Link, Image, Placeholder.configure({ placeholder: "Write your article..." })],
    content: initialContent ?? { type: "doc", content: [] },
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
  });
  return <div className="prose max-w-none"><EditorContent editor={editor} /></div>;
}
```

# TANSTACK TABLE wrapper
`packages/admin-dashboard/components/admin/articles/table.tsx`
```tsx
"use client";
import { useMemo } from "react";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

export function DataTable({ rows }: { rows: any[] }) {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    { header: "Title", accessorKey: "title" },
    { header: "Status", accessorKey: "status" },
    { header: "Updated", accessorKey: "updatedAt" },
  ], []);
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });
  return (
    <table className="w-full text-sm">
      <thead>
        {table.getHeaderGroups().map(hg => (
          <tr key={hg.id}>{hg.headers.map(h => (<th key={h.id} className="text-left p-2">{flexRender(h.column.columnDef.header, h.getContext())}</th>))}</tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(r => (
          <tr key={r.id} className="border-t">
            {r.getVisibleCells().map(c => (<td key={c.id} className="p-2">{flexRender(c.column.columnDef.cell ?? (({ getValue }) => getValue()), c.getContext())}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

# TREMOR Overview page (`app/page.tsx`)
```tsx
import { Card, Metric, Text } from "@tremor/react";
export default async function Overview() {
  // TODO: fetch KPIs from DB
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card><Metric>12</Metric><Text>Active Articles</Text></Card>
      <Card><Metric>3</Metric><Text>Scheduled</Text></Card>
      <Card><Metric>98</Metric><Text>Reactions (30d)</Text></Card>
      <Card><Metric>1.2k</Metric><Text>Views (30d)</Text></Card>
    </div>
  );
}
```

# ARTICLES DATA functions (server) `packages/admin-dashboard/lib/data/articles.ts`
```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function getArticles(opts: { limit?: number } = {}) {
  return prisma.article.findMany({ orderBy: { updatedAt: "desc" }, take: opts.limit ?? 50, select: { id: true, title: true, status: true, updatedAt: true } });
}
```

# API ROUTES (in admin app)
- `app/api/articles/route.ts` → GET list, POST create
- `app/api/articles/[id]/route.ts` → GET, PATCH (content/metadata), DELETE
- `app/api/revalidate/route.ts` → POST { paths: string[] }
- `app/api/scheduler/publish/route.ts` → POST (cron): publish scheduled posts and revalidate
- `app/api/upload/route.ts` → stub for signed uploads (replace with your storage)

Example `app/api/articles/[id]/route.ts` (PATCH):
```ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ArticleStatus } from "@prisma/client";
const prisma = new PrismaClient();
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { title, slug, contentJson, excerpt, status, scheduledAt } = body;
  const updated = await prisma.article.update({
    where: { id: params.id },
    data: { title, slug, contentJson, excerpt, status, scheduledAt },
  });
  return NextResponse.json(updated);
}
```

# PUBLIC BLOG (in main app)
```
app/blog/page.tsx                 // fetch published articles from Prisma & render list
app/blog/[slug]/page.tsx          // server component renders article
app/blog/[slug]/opengraph-image.tsx // dynamic OG image
app/blog/rss.xml/route.ts         // RSS feed
```

Minimal `app/blog/page.tsx`:
```tsx
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function BlogIndex() {
  const posts = await prisma.article.findMany({ where: { status: "PUBLISHED", visibility: "PUBLIC" }, orderBy: { publishedAt: "desc" }, select: { title: true, slug: true, excerpt: true, publishedAt: true } });
  return (
    <div className="space-y-6">
      {posts.map(p => (
        <a key={p.slug} href={`/blog/${p.slug}`} className="block">
          <h2 className="text-xl font-medium">{p.title}</h2>
          <p className="text-sm opacity-80">{p.excerpt}</p>
        </a>
      ))}
    </div>
  );
}
```

# CRON PUBLISHER (Vercel Cron hits daily/hourly)
`app/api/scheduler/publish/route.ts`:
```ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST() {
  const now = new Date();
  const scheduled = await prisma.article.updateMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: now } },
    data: { status: "PUBLISHED", publishedAt: now },
  });
  // TODO: call revalidate API for /blog and affected slugs
  return NextResponse.json({ published: scheduled.count });
}
```

# README (put at repo root or /packages/admin-dashboard/README.md)
1. Set env vars. 2. `npx prisma migrate dev` then `npm run prisma:seed`. 3. Start DB and app(s). 4. Sign in at `/login` with AUTH_ADMIN_EMAIL/PASSWORD. 5. Create your first article in `/admin/articles/new`.

# NOTES
- Mark all client components that touch Tiptap/TanStack with `"use client"`.
- Keep styles unified with shadcn tokens and Tailwind. Avoid mixing external component kits.
- Use canonical URLs on `/blog/[slug]`; create `Redirect` entries for legacy paths and add a middleware to 301.
- Later: add Google/ GitHub OAuth providers if you want SSO; roles still enforced in session token.

# DONE CRITERIA
- I can log into `/login` using env‑seeded admin.
- `/admin` is gated by Auth.js.
- I can create/edit an article (JSON stored), flip to Scheduled/Published, and see it at `/blog/[slug]`.
- Overview shows basic KPIs from DB and a Tremor metric grid.
- RSS and dynamic OG image endpoint exist.
- Seeded admin account works; roles are persisted in JWT + session.

---

Execute all scaffolding, write files exactly as specified, and ensure the app runs with `npm run dev`. If a path already exists in the repo, update it rather than duplicating.

