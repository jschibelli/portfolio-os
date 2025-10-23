<p align="center">
  <a href="https://johnschibelli.dev">
    <img src="apps/site/public/assets/og.png" alt="John Schibelli — Portfolio OS" width="100%" />
  </a>
</p>

<h1 align="center">Portfolio OS</h1>
<p align="center">A self-documenting, AI-powered development platform — portfolio, blog, admin dashboard, and automation tools.</p>

<p align="center">
  <a href="https://github.com/jschibelli/portfolio-os/releases/tag/v1.1.0"><img alt="Version" src="https://img.shields.io/badge/version-1.1.0-blue.svg"></a>
  <a href="https://github.com/jschibelli/portfolio-os/blob/main/LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-green.svg"></a>
  <a href="https://johnschibelli.dev"><img alt="Live Site" src="https://img.shields.io/badge/Live-johnschibelli.dev-blueviolet"></a>
  <a href="https://docs.johnschibelli.dev"><img alt="Documentation" src="https://img.shields.io/badge/Docs-docs.johnschibelli.dev-orange"></a>
  <a href="https://vercel.com"><img alt="Deploys on Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black"></a>
</p>

<p align="center">
  <strong>🎉 v1.1.0 Released!</strong> | <a href="https://github.com/jschibelli/portfolio-os/releases/tag/v1.1.0">Release Notes</a> | <a href="apps/docs/CHANGELOG.md">Full Changelog</a>
</p>

## Overview

**Portfolio OS v1.1.0** is a production-ready, self-documenting development platform that showcases modern engineering practices through real automation and AI-assisted workflows.

Built over **4 months**, Portfolio OS demonstrates:

- 🤖 **Multi-Agent AI Development** - Jason & Chris agents handle parallel development workflows
- ⚡ **100+ PowerShell Scripts** - Comprehensive automation for PRs, issues, and project management
- 📊 **Enterprise-Grade Tooling** - CI/CD pipelines, automated testing, and quality checks
- 📝 **Self-Documenting** - Documentation that stays in sync with code
- 🎨 **Modern Tech Stack** - Next.js 15, TypeScript, Tailwind CSS, Turborepo

The platform includes a **content site**, **admin dashboard**, and **shared packages** for UI, utilities, and integrations. Content is sourced from Hashnode via GraphQL with optional headless mode.

## 📚 Documentation

**Complete documentation is available at**: http://localhost:3000 (when running `pnpm dev`)

For the full documentation map and navigation guide, see **[DOCS_MAP.md](./DOCS_MAP.md)**

**Quick Links**:
- [Getting Started](http://localhost:3000/docs/getting-started) - 10-minute setup guide
- [Developer Guide](http://localhost:3000/docs/developer-guide) - Architecture and best practices
- [Scripts Reference](http://localhost:3000/docs/scripts-reference) - PowerShell automation tools
- [Multi-Agent System](http://localhost:3000/docs/multi-agent) - Parallel development setup
- [API Reference](http://localhost:3000/docs/api-reference) - API documentation
- [Troubleshooting](http://localhost:3000/docs/troubleshooting) - Common issues and solutions

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

**Frontend:**
- Next.js 15 App Router, React 18, TypeScript
- Tailwind CSS, Radix UI, Lucide Icons
- Framer Motion for animations

**Backend & Data:**
- Prisma ORM, SQLite/PostgreSQL
- Vercel Blob, Upstash Redis
- Hashnode GraphQL API

**AI & Integrations:**
- OpenAI (GPT-4 for image + text generation)
- Resend (transactional email)
- Multi-agent automation (Jason/Chris)

**DevOps & Quality:**
- Turborepo monorepo, PNPM package manager
- GitHub Actions CI/CD
- Playwright (E2E), Jest (unit tests)
- ESLint, Prettier, TypeScript strict mode
- 100+ PowerShell automation scripts

## 📁 **Project Organization**

### **Scripts Directory** (`scripts/`)
Organized automation scripts for the Portfolio OS system:
- **`automation/`** - Core automation and orchestration scripts that handle GitHub Actions workflows, PR automation, and CI/CD pipeline management
- **`project-management/`** - GitHub project and board management utilities for tracking issues, PRs, and project status updates across multiple repositories
- **`analysis/`** - Code quality and system analysis tools including linting, type checking, dependency audits, and performance profiling
- **`utilities/`** - General purpose utilities and configuration helpers for common tasks like environment setup, file operations, and data transformations
- **`documentation/`** - Documentation generation and maintenance scripts that auto-generate API docs, README updates, and changelog entries
- **`shared/`** - Common utilities and helper functions used across multiple scripts including logging, error handling, and configuration management

### **Documentation Directory** (`docs/`)
Comprehensive documentation organized by category:
- **`automation/`** - Complete automation system documentation covering GitHub Actions, CI/CD pipelines, deployment strategies, and workflow automation patterns
- **`setup/`** - Setup guides and configuration documentation for local development, environment variables, database setup, and third-party integrations
- **`developer/`** - Developer guides covering architecture decisions, coding standards, testing strategies, and contribution guidelines
- **`troubleshooting/`** - Troubleshooting guides for common issues, debugging tips, and solutions to frequently encountered problems

### **Prompts Directory** (`prompts/`)
AI prompts and templates for automation:
- **`automation/`** - GitHub issue and project automation prompts for intelligent issue triage, PR analysis, and automated responses to common scenarios
- **`workflows/`** - End-to-end workflow automation prompts for multi-step processes like release management, code reviews, and deployment pipelines
- **`templates/`** - Reusable prompt templates and quick references for consistent AI-assisted development and documentation tasks

## Getting Started

### Prerequisites

1. **Node.js 18+**: Required for Next.js 14 and modern JavaScript features
   - Download from [nodejs.org](https://nodejs.org/) or use a version manager:
   ```bash
   # Using nvm (recommended)
   nvm install 18
   nvm use 18
   
   # Or using fnm
   fnm install 18
   fnm use 18
   ```

2. **PNPM**: Fast, disk space efficient package manager
   ```bash
   # Using npm
   npm install -g pnpm
   
   # Or using Homebrew (macOS)
   brew install pnpm
   
   # Or using Scoop (Windows)
   scoop install pnpm
   ```

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/jschibelli/portfolio-os.git
   cd portfolio-os
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   # Copy environment templates
   cp apps/site/.env.example apps/site/.env.local
   cp apps/dashboard/.env.example apps/dashboard/.env.local
   
   # Edit .env.local files with your API keys
   # Required: OPENAI_API_KEY, RESEND_API_KEY, NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST
   ```

3. **Generate Prisma client** (for dashboard database access)
   ```bash
   cd apps/dashboard
   pnpm prisma generate
   cd ../..
   ```

4. **Start development servers**
   ```bash
   pnpm dev
   ```
   - Site: `http://localhost:3000`
   - Dashboard: `http://localhost:3001` (or check console output)

### Common Setup Issues

- **PNPM command not found**: Restart your terminal after installation or add PNPM to your PATH
- **Module not found errors**: Run `pnpm install` again and ensure all dependencies are installed
- **Prisma errors**: Make sure you've run `pnpm prisma generate` in the dashboard directory
- **Port already in use**: Change ports in `next.config.js` or stop conflicting processes

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
