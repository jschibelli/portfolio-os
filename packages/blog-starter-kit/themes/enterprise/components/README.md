# Components Directory

This directory contains all React components organized by their purpose and scope.

## Directory Structure

### `/ui`
Contains all shadcn/ui components and basic UI primitives. These are reusable, atomic components that form the foundation of the design system.

- **shadcn/ui components**: Button, Card, Dialog, Input, etc.
- **Custom UI components**: ThemeToggle, Glow, Mockup, etc.
- **Barrel exports**: All components are exported through `index.ts` for clean imports

### `/features`
Contains feature-specific components organized by domain. These are complex components that implement specific business logic.

- **`/analytics`**: Analytics and tracking components
- **`/blog`**: Blog-related components (post cards, pagination, etc.)
- **`/booking`**: Booking and scheduling components
- **`/chatbot`**: AI chatbot components
- **`/contact`**: Contact form components
- **`/homepage`**: Homepage-specific components
- **`/navigation`**: Navigation and pagination components
- **`/newsletter`**: Newsletter subscription components
- **`/portfolio`**: Portfolio and case study components
- **`/screenshot`**: Screenshot and image capture components

### `/shared`
Contains shared components used across multiple pages and features.

- **Layout components**: Header, Footer, Container, etc.
- **SEO components**: SEOHead for meta tags and structured data
- **Analytics**: Analytics tracking and configuration

## Import Guidelines

- Use barrel exports from `/ui` for clean imports: `import { Button, Card } from '@/components/ui'`
- Import feature components directly: `import { ModernHero } from '@/components/features/homepage'`
- Import shared components directly: `import { Layout } from '@/components/shared'`

## Naming Conventions

- **Components**: PascalCase (e.g., `ModernHero.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **Directories**: kebab-case for feature folders

## Component Organization Principles

1. **Single Responsibility**: Each component should have one clear purpose
2. **Reusability**: UI components should be highly reusable
3. **Feature Cohesion**: Feature components should be grouped by domain
4. **Clear Hierarchy**: UI → Features → Shared → Pages
