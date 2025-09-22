# Lib Directory

This directory contains utility functions, configurations, and shared logic used throughout the application.

## Directory Structure

### `/config`
Contains configuration files and environment-specific settings.

- **Site configuration**: Site metadata, navigation, and theme settings
- **Environment utilities**: Environment variable handling and validation

### `/structured-data`
Contains helper functions for generating JSON-LD structured data for SEO.

- **Person data**: Generate structured data for person/author information
- **Article data**: Generate structured data for blog posts and articles
- **Service data**: Generate structured data for service pages
- **Organization data**: Generate structured data for company information
- **Website data**: Generate structured data for website metadata
- **Breadcrumb data**: Generate structured data for navigation breadcrumbs

## File Organization

### Configuration Files
- `site.ts`: Site-wide configuration and metadata
- `env.ts`: Environment variable utilities and validation

### Utility Functions
- `case-study-blocks.tsx`: Case study content parsing and rendering
- `structured-data.ts`: JSON-LD structured data generation helpers

## Usage Guidelines

- Import configuration: `import { siteConfig } from '@/lib/config/site'`
- Import utilities: `import { generatePersonStructuredData } from '@/lib/structured-data'`
- Keep functions pure and testable
- Use TypeScript interfaces for all data structures
- Document complex functions with JSDoc comments

## Best Practices

1. **Pure Functions**: Utility functions should be pure and side-effect free
2. **Type Safety**: Use TypeScript interfaces for all data structures
3. **Error Handling**: Include proper error handling and validation
4. **Documentation**: Document complex functions and configurations
5. **Testing**: Write tests for utility functions where appropriate
