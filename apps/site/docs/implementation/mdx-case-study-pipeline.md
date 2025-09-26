# MDX Case Study Pipeline Implementation

This document describes the implementation of the MDX case study pipeline as requested in [GitHub Issue #57](https://github.com/jschibelli/mindware-blog/issues/57).

## Overview

The MDX case study pipeline allows for dedicated MDX pages for longform case studies, providing a more flexible and powerful content authoring experience compared to traditional markdown or database-stored content.

## Implementation Details

### 1. Directory Structure

```
content/
└── case-studies/
    ├── .gitkeep
    └── tendril.mdx
```

### 2. Core Components

#### MDX Case Study Loader (`lib/mdx-case-study-loader.ts`)

- **Purpose**: Handles loading and parsing MDX case study files with frontmatter
- **Key Functions**:
  - `getAllCaseStudySlugs()`: Returns all available MDX case study slugs
  - `getCaseStudyBySlug(slug)`: Loads a specific case study by slug
  - `getAllCaseStudies()`: Loads all case studies with metadata
  - `getPublishedCaseStudies()`: Filters for published case studies only

#### ProjectMeta Interface

Maps MDX frontmatter to the existing CaseStudy database model:

```typescript
interface ProjectMeta {
  // Basic info
  title: string;
  slug: string;
  excerpt?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  visibility?: 'PUBLIC' | 'PRIVATE';
  publishedAt?: string;
  featured?: boolean;
  
  // Project details
  client?: string;
  industry?: string;
  duration?: string;
  teamSize?: string;
  technologies?: string[];
  challenges?: string;
  solution?: string;
  results?: string;
  metrics?: Record<string, any>;
  lessonsLearned?: string;
  nextSteps?: string;
  
  // Media and SEO
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  
  // Engagement
  allowComments?: boolean;
  allowReactions?: boolean;
  views?: number;
  
  // Tags and categories
  tags?: string[];
  category?: string;
  
  // Author
  author?: {
    name?: string;
    email?: string;
  };
}
```

#### Simple MDX Renderer (`lib/mdx-simple-renderer.tsx`)

- **Purpose**: Provides basic MDX-like functionality using existing markdown rendering
- **Features**:
  - Custom components (InfoCard, Callout, StatBadge)
  - Integration with existing CaseStudyMarkdown component
  - Stone theme styling consistency

### 3. Routing Integration

#### Updated Case Study Page (`pages/case-studies/[slug].tsx`)

The case study page now supports both MDX and traditional case studies:

1. **Priority System**: MDX files take priority over API-fetched case studies
2. **Fallback Support**: Falls back to existing API-based case studies if MDX file not found
3. **Unified Interface**: Both types render through the same UI components
4. **Server-Side Rendering**: All content is rendered server-side without client-only errors

#### getServerSideProps Logic

```typescript
// First, try to load MDX case study
const mdxCaseStudy = await getCaseStudyBySlug(slug);

if (mdxCaseStudy) {
  return {
    props: {
      caseStudy: null,
      mdxCaseStudy,
      publication: siteConfig,
    },
  };
}

// Fallback to API case study
const response = await fetch(`${process.env.NEXTAUTH_URL}/api/case-studies/${slug}`);
// ... handle API response
```

### 4. Example Implementation

#### tendril.mdx

A comprehensive example case study demonstrating:

- **Rich Frontmatter**: Complete ProjectMeta mapping
- **Structured Content**: Following the standardized case study structure
- **Custom Components**: Usage of InfoCard and other MDX components
- **SEO Optimization**: Proper meta tags and structured data
- **Stone Theme**: Consistent styling with the rest of the site

Key sections include:
- Problem Statement
- Research & Analysis  
- Solution Design
- Implementation
- Results & Metrics
- Lessons Learned
- Next Steps

## Features

### ✅ Implemented

1. **MDX File Support**: Dedicated MDX pages for case studies
2. **Frontmatter Mapping**: Complete ProjectMeta interface mapping
3. **Routing Integration**: Seamless integration with existing case study routes
4. **Server-Side Rendering**: No client-only errors, builds on server
5. **Fallback Support**: Graceful fallback to existing API-based case studies
6. **Custom Components**: InfoCard, Callout, StatBadge components
7. **Stone Theme**: Consistent styling with existing design system
8. **SEO Optimization**: Proper meta tags and structured data
9. **Example Content**: Comprehensive tendril.mdx example

### 🔄 Future Enhancements

1. **Full MDX Support**: Integration with next-mdx-remote for advanced MDX features
2. **Contentlayer Integration**: Optional Contentlayer for enhanced content management
3. **Advanced Components**: More custom MDX components (charts, interactive elements)
4. **Content Validation**: Automated validation of case study structure
5. **Preview Mode**: Draft preview functionality

## Usage

### Creating a New MDX Case Study

1. Create a new `.mdx` file in `content/case-studies/`
2. Add frontmatter following the ProjectMeta interface
3. Write content using markdown and custom components
4. The case study will be automatically available at `/case-studies/[slug]`

### Example Frontmatter

```yaml
---
title: "Your Case Study Title"
slug: "your-case-study-slug"
excerpt: "Brief description of the case study"
status: "PUBLISHED"
visibility: "PUBLIC"
publishedAt: "2025-01-10"
featured: true
client: "Client Name"
industry: "Industry"
duration: "6 months"
teamSize: "3 developers"
technologies: ["Next.js", "TypeScript", "Prisma"]
tags: ["SaaS", "AI", "Multi-tenant"]
coverImage: "https://example.com/image.jpg"
author:
  name: "Author Name"
  email: "author@example.com"
---
```

### Custom Components

```jsx
<InfoCard title="Key Metric">
  Our revenue increased by **150%** within the first 6 months.
</InfoCard>

<Callout variant="success" title="Success">
  The project exceeded all initial expectations.
</Callout>

<StatBadge label="User Retention" value="91%" />
```

## Testing

The implementation has been tested and verified:

- ✅ MDX file parsing and frontmatter extraction
- ✅ Server-side rendering without client errors
- ✅ Routing integration with existing case study system
- ✅ Fallback to API-based case studies
- ✅ Custom component rendering
- ✅ Stone theme consistency

## Acceptance Criteria Met

- ✅ MDX renders under `/case-studies/[slug]`
- ✅ Builds on server without client-only errors
- ✅ Frontmatter mapped to ProjectMeta where relevant
- ✅ tendril.mdx example provided
- ✅ Proper headings structure maintained

The MDX case study pipeline is now fully functional and ready for use.
