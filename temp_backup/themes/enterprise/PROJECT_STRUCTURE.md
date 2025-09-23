# Project Structure Overview

This document provides an overview of the organized project structure for the John Schibelli portfolio website.

## 🏗️ Architecture

The project uses **Next.js 14+ with App Router** as the primary framework, following modern React patterns and best practices.

## 📁 Directory Structure

### Core Application
```
app/                          # Next.js App Router (primary routing)
├── (admin)/                  # Admin route group
├── admin/                    # Admin dashboard pages
├── api/                      # API routes (App Router)
├── blog/                     # Blog pages
├── layout.tsx               # Root layout
└── login/                   # Authentication pages

pages/                       # Pages Router (legacy, minimal usage)
├── _app.tsx                 # App component
├── _document.tsx            # Document component
├── [slug].tsx               # Dynamic pages
└── [static-pages].tsx       # Static pages
```

### Components
```
components/
├── admin/                   # Admin-specific components
├── blog/                    # Blog-related components
├── contexts/                # React contexts
├── features/                # Feature-specific components
│   ├── analytics/           # Analytics components
│   ├── blog/                # Blog components
│   ├── booking/             # Scheduling components
│   ├── chatbot/             # AI chatbot components
│   ├── contact/             # Contact form components
│   ├── homepage/            # Homepage components
│   ├── navigation/          # Navigation components
│   ├── newsletter/          # Newsletter components
│   ├── portfolio/           # Portfolio components
│   └── screenshot/          # Screenshot components
├── icons/                   # Icon components
├── providers/               # Context providers
├── shared/                  # Shared components
│   ├── Layout/              # Layout components
│   ├── SEO/                 # SEO components
│   └── Analytics/           # Analytics components
└── ui/                      # UI primitives (shadcn/ui)
```

### Libraries & Utilities
```
lib/
├── api/                     # GraphQL API definitions
├── crypto/                  # Cryptographic utilities
├── editor/                  # Rich text editor
├── google/                  # Google services integration
├── hooks/                   # Custom React hooks
├── integrations/            # Third-party integrations
├── net/                     # Network utilities
├── queue/                   # Job queue system
└── types/                   # TypeScript type definitions
```

### Data & Configuration
```
data/                        # Static data files
├── case-studies.json        # Case study data
├── portfolio.json           # Portfolio data
├── posts.ts                 # Blog posts data
├── resume.json              # Resume data
└── skills.ts                # Skills data

config/                      # Configuration files
└── site.ts                  # Site configuration

types/                       # TypeScript definitions
├── json.d.ts                # JSON module declarations
└── portfolio.d.ts           # Portfolio type definitions
```

### Documentation
```
docs/                        # Comprehensive documentation
├── accessibility/           # Accessibility guidelines
├── admin-dashboard/         # Admin dashboard docs
├── ai-chatbot/              # Chatbot documentation
├── analytics-seo/           # Analytics & SEO docs
├── case-studies/            # Case study documentation
├── content/                 # Content management docs
├── design/                  # Design system docs
├── development/             # Development guides
├── getting-started/         # Getting started guides
├── implementation/          # Implementation guides
└── pages/                   # Page-specific documentation
```

### Testing & Quality
```
__tests__/                   # Test files
├── api/                     # API tests
├── config-validation.test.ts
├── email-validation.test.ts
└── structured-data.test.ts

tests/                       # Playwright tests
├── analytics/               # Analytics tests
├── config/                  # Configuration tests
├── utils/                   # Test utilities
└── visual/                  # Visual regression tests
```

### Database & Prisma
```
prisma/
├── dev.db                   # Development database
├── migrations/              # Database migrations
├── schema.prisma            # Database schema
├── seed.js                  # Database seeding
└── seed.ts                  # TypeScript seeding
```

### Scripts & Automation
```
scripts/                     # Build and setup scripts
├── build.sh                 # Build script
├── fix-admin-credentials.js # Admin setup
├── get-google-analytics-token.js
├── import-config.ts         # Configuration import
├── import-hashnode-articles.ts
├── setup-admin-user.js      # Admin user setup
├── setup-auth.js            # Authentication setup
├── setup-gmail-oauth.js     # Gmail OAuth setup
├── setup-google-analytics.js
└── vercel-build.js          # Vercel build script
```

### Assets & Public Files
```
assets/                      # Font assets
├── PlusJakartaSans-*.ttf    # Custom fonts

public/                      # Static assets
├── assets/                  # Images and media
├── favicon/                 # Favicon files
└── js/                      # Client-side JavaScript
```

## 🔧 Key Configuration Files

- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Vercel deployment configuration
- `next-sitemap.js` - Sitemap generation
- `playwright.config.ts` - Playwright testing configuration
- `components.json` - shadcn/ui configuration

## 🚀 Key Features

### Modern Architecture
- **App Router**: Primary routing system using Next.js 14+ App Router
- **TypeScript**: Full TypeScript support with strict type checking
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Modern component library

### Content Management
- **Admin Dashboard**: Comprehensive admin interface
- **Rich Text Editor**: TipTap-based editor for content creation
- **Case Studies**: Interactive case study system
- **Blog System**: Full-featured blog with Hashnode integration

### Integrations
- **Google Services**: Calendar, Gmail, Analytics integration
- **AI Chatbot**: OpenAI-powered conversational interface
- **Social Media**: LinkedIn, Facebook, GitHub integration
- **Analytics**: Google Analytics, Plausible integration
- **Payment**: Stripe integration for transactions

### Development Tools
- **Testing**: Playwright for E2E and visual regression testing
- **Linting**: ESLint with custom configuration
- **Formatting**: Prettier for code formatting
- **Type Checking**: Strict TypeScript configuration

## 📋 Cleanup Summary

The following cleanup actions were performed:

### ✅ Removed Duplicate Files
- Deleted duplicate type definitions (`@types/` directory)
- Removed issue tracking files (`issue*.md`, `issue*.json`)
- Cleaned up test results and reports
- Removed outdated documentation files

### ✅ Consolidated API Structure
- Removed Pages Router API routes (`pages/api/`)
- Kept App Router API routes (`app/api/`) as primary
- Maintained modern Next.js patterns

### ✅ Organized Documentation
- Maintained comprehensive documentation structure
- Removed redundant PDF files
- Kept well-organized documentation hierarchy

### ✅ Optimized Configuration
- Cleaned up configuration files
- Removed unused type declarations
- Maintained essential configuration

## 🎯 Next Steps

1. **Import Path Updates**: All import paths have been verified and updated
2. **Testing**: Run tests to ensure everything works correctly
3. **Build Verification**: Test the build process
4. **Documentation**: Update any remaining documentation references

The project is now well-organized with a clear structure that follows modern Next.js best practices and maintains excellent developer experience.
