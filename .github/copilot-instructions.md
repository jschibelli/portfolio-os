# GitHub Copilot Instructions for Portfolio OS

## Project Overview

Portfolio OS is a modern, production-grade monorepo powering [johnschibelli.dev](https://johnschibelli.dev). It's built with Next.js 14, TypeScript, and Tailwind CSS, featuring a portfolio site, blog, admin dashboard, and AI-powered tools.

## Repository Structure

This is a **monorepo** using Turborepo and PNPM with the following structure:

### Apps
- `apps/site`: Public portfolio, blog, projects, case studies, and API routes
- `apps/dashboard`: Admin dashboard and content management system
- `apps/documentation-portfolio-os`: Internal documentation (optional)

### Packages
- `packages/ui`: Shared UI components (React + Tailwind)
- `packages/lib`: Domain logic and shared services
- `packages/utils`: Utility functions
- `packages/emails`: Transactional email templates (Resend)
- `packages/db`: Prisma schema and database access
- `packages/hashnode`: Hashnode client helpers
- `packages/chatbot`: AI chatbot functionality
- `packages/tsconfig`, `packages/eslint-config-custom`: Tooling configs

## Tech Stack

### Core Technologies
- **Frontend**: Next.js 14 App Router, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Database**: Prisma ORM with PostgreSQL
- **Deployment**: Vercel with Vercel Blob storage
- **Caching**: Upstash Redis
- **AI Services**: OpenAI (GPT-4o-mini, image generation, TTS)
- **Email**: Resend for transactional emails
- **Monorepo**: Turborepo with PNPM package manager

### Development Tools
- **Testing**: Jest, Playwright, Testing Library
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Build**: Turbo for parallel builds and caching
- **CI/CD**: GitHub Actions (see `.github/workflows/`)

## Code Standards and Conventions

### File Structure Patterns
- Use App Router structure: `app/[route]/page.tsx`, `app/[route]/layout.tsx`
- Components: PascalCase filenames (e.g., `UserProfile.tsx`)
- Utilities: camelCase filenames (e.g., `dateUtils.ts`)
- API routes: `app/api/[route]/route.ts`

### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use type definitions from `types/` directory
- Export types alongside implementations

### Component Patterns
- Use functional components with hooks
- Implement proper TypeScript props interfaces
- Follow Radix UI patterns for accessible components
- Use Tailwind CSS for styling (avoid CSS modules)
- Implement proper error boundaries and loading states

### API Route Patterns
- Use Next.js App Router API routes (`route.ts`)
- Implement proper error handling and HTTP status codes
- Use OpenAI function calling for AI integrations
- Validate inputs with TypeScript and runtime checks

## Package Management

### Commands
- `pnpm i` - Install dependencies
- `pnpm dev` - Run all apps in development
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Run linting across workspace
- `pnpm test` - Run all tests
- `pnpm typecheck` - Type check all packages

### Adding Dependencies
- Add shared dependencies to root `package.json`
- Add app-specific dependencies to individual app directories
- Use `pnpm add <package>` in the appropriate directory
- Update `pnpm-workspace.yaml` if adding new packages

## Development Workflow

### Getting Started
1. Install PNPM and Node 18+
2. Copy environment examples: `cp apps/site/.env.example apps/site/.env.local`
3. Install dependencies: `pnpm i`
4. Generate Prisma client: `cd apps/dashboard && pnpm prisma generate`
5. Run development: `pnpm dev`

### Environment Variables
- Site runs on `http://localhost:3000`
- Dashboard port varies by setup
- Required: `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST`, `OPENAI_API_KEY`, `RESEND_API_KEY`
- Optional: Redis, database, and integration keys

### Branch Naming
Follow the pattern: `TYPE-DESCRIPTION`
- `feat-adds-profile-section`
- `fix-auth-redirect-bug`
- `refactor-api-error-handling`

## AI and Integration Features

### Chatbot System
- Location: `packages/chatbot` and API routes in `apps/site/app/api/chat/`
- Uses OpenAI GPT-4o-mini with function calling
- Features: Calendar scheduling, GitHub integration, case study generation
- Tools system in `apps/site/app/api/chat/tools.ts`

### Content Management
- Hashnode integration for blog content
- GitHub integration for article management
- Dynamic OG image generation
- SEO optimization with Next.js metadata API

### Admin Dashboard
- Full-featured admin interface
- Content management system
- Analytics and monitoring
- User management (when applicable)

## Testing Strategy

### Unit Testing
- Jest with Testing Library for components
- Test utilities and business logic
- Mock external API calls appropriately

### Integration Testing
- Playwright for end-to-end testing
- Test critical user journeys
- Accessibility testing with axe-core

### Performance Testing
- Monitor Core Web Vitals
- Test build performance with Turbo cache
- Optimize for mobile and desktop

## Documentation

### Prompt Templates
- Extensive collection in `apps/site-backup/docs/development/prompts/`
- Templates for common development tasks
- AI-assisted workflows and debugging

### Implementation Guides
- GitHub setup guide for integrations
- Chatbot comprehensive documentation
- Case study and content templates

## Common Tasks and Patterns

### Adding a New Component
1. Create in appropriate package (`packages/ui` for shared, or app-specific)
2. Use TypeScript interface for props
3. Implement with Tailwind CSS and Radix UI patterns
4. Add to package exports if shared
5. Write tests and update documentation

### Adding API Routes
1. Create in `apps/site/app/api/[route]/route.ts`
2. Implement HTTP methods (GET, POST, etc.)
3. Add proper error handling and validation
4. Use OpenAI function calling if AI-powered
5. Test with appropriate HTTP status codes

### Database Changes
1. Update schema in `packages/db/prisma/schema.prisma`
2. Generate migration: `pnpm prisma migrate dev`
3. Update TypeScript types
4. Test in development environment

### Adding Dependencies
- Shared UI components → `packages/ui`
- Business logic → `packages/lib`
- Database operations → `packages/db`
- Email templates → `packages/emails`

## Best Practices

### Performance
- Use Next.js App Router for optimal performance
- Implement proper caching strategies (Redis, Vercel)
- Optimize images with Next.js Image component
- Use Turbo for build performance

### Security
- Never expose API keys in client code
- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Validate all inputs server-side

### Accessibility
- Use Radix UI for accessible components
- Test with axe-core and screen readers
- Implement proper ARIA labels and roles
- Ensure keyboard navigation works

### SEO
- Use Next.js metadata API
- Generate dynamic OG images
- Implement proper sitemap generation
- Optimize Core Web Vitals

## Error Handling
- Use proper HTTP status codes in API routes
- Implement error boundaries in React components
- Log errors appropriately (but avoid sensitive data)
- Provide meaningful error messages to users

When working on this codebase, always consider the monorepo structure, follow the established patterns, and maintain the high code quality standards. The project has extensive documentation and prompt templates to guide development workflows.