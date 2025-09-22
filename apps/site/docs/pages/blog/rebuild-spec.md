# Blog Page Rebuild Specification

## Overview

The Blog page (`/blog`) serves as the main content hub for the publication, displaying featured posts, latest articles, and providing navigation to individual blog posts. It implements a modern, responsive design with scroll-triggered animations and comprehensive SEO optimization.

### Purpose
- **Primary**: Display featured and latest blog posts in an engaging, accessible format
- **Secondary**: Provide newsletter subscription functionality
- **Tertiary**: Showcase social media presence and RSS feed access

### Key User Flows
1. **Browse Posts**: Users can scroll through featured post and latest posts grid
2. **Read Articles**: Click on post cards to navigate to individual articles
3. **Subscribe**: Use newsletter signup form to subscribe to updates
4. **Social Engagement**: Access social media profiles and RSS feed

### Data Sources
- **Hashnode GraphQL API**: Primary source for publication and post data
- **Static Generation**: Posts fetched at build time with ISR (revalidate: 1)
- **Fallback Data**: Graceful degradation when API is unavailable

## Routes & Data

### Route Structure
```
/blog - Main blog listing page
```

### Data Model Fields

#### PostFragment (from generated/graphql.ts)
```typescript
export type PostFragment = {
  __typename?: 'Post';
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  slug: string;
  brief: string;
  author: {
    __typename?: 'User';
    name: string;
    profilePicture?: string | null;
  };
  coverImage?: {
    __typename?: 'PostCoverImage';
    url: string;
  } | null;
};
```

#### PublicationFragment
```typescript
export type PublicationFragment = {
  id: string;
  title: string;
  displayTitle?: string | null;
  url: string;
  descriptionSEO?: string | null;
  author: {
    name: string;
    profilePicture?: string | null;
  };
  preferences: {
    logo?: string | null;
  };
  followersCount: number;
  isTeam: boolean;
  favicon?: string | null;
  ogMetaData?: {
    image?: string | null;
  } | null;
};
```

### Data Fetching
- **File**: `pages/blog.tsx` (lines 300-428)
- **Method**: `getStaticProps` with GraphQL query
- **Endpoint**: `process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT` (default: 'https://gql.hashnode.com/')
- **Query**: `PostsByPublication` with pagination support
- **Revalidation**: 1 second (ISR)

## Theme & Tokens (Authoritative)

### Design System
- **Base**: shadcn/ui with "new-york" style
- **Color Scheme**: Rose-based with CSS variables
- **Typography**: Plus Jakarta Sans font family
- **Spacing**: Tailwind's default scale with custom extensions

### Color Tokens (from styles/index.css)

#### Light Mode
```css
:root {
  --background: 0 0% 100%;           /* #ffffff */
  --foreground: 240 10% 3.9%;        /* #0f0f0f */
  --card: 0 0% 100%;                 /* #ffffff */
  --card-foreground: 240 10% 3.9%;   /* #0f0f0f */
  --primary: 346.8 77.2% 49.8%;      /* #e11d48 */
  --primary-foreground: 355.7 100% 97.3%; /* #fdf2f8 */
  --secondary: 240 4.8% 95.9%;       /* #f4f4f5 */
  --secondary-foreground: 240 5.9% 10%; /* #18181b */
  --muted: 240 4.8% 95.9%;           /* #f4f4f5 */
  --muted-foreground: 240 3.8% 46.1%; /* #71717a */
  --accent: 240 4.8% 95.9%;          /* #f4f4f5 */
  --accent-foreground: 240 5.9% 10%; /* #18181b */
  --destructive: 0 84.2% 60.2%;      /* #ef4444 */
  --destructive-foreground: 0 0% 98%; /* #fafafa */
  --border: 240 5.9% 90%;            /* #e4e4e7 */
  --input: 240 5.9% 90%;             /* #e4e4e7 */
  --ring: 346.8 77.2% 49.8%;         /* #e11d48 */
  --radius: 0.5rem;                  /* 8px */
}
```

#### Dark Mode
```css
.dark {
  --background: 20 14.3% 4.1%;       /* #0c0a09 */
  --foreground: 0 0% 95%;            /* #f2f2f2 */
  --card: 24 9.8% 10%;               /* #1c1917 */
  --card-foreground: 0 0% 95%;       /* #f2f2f2 */
  --primary: 346.8 77.2% 49.8%;      /* #e11d48 */
  --primary-foreground: 355.7 100% 97.3%; /* #fdf2f8 */
  --secondary: 240 3.7% 15.9%;       /* #27272a */
  --secondary-foreground: 0 0% 98%;  /* #fafafa */
  --muted: 0 0% 15%;                 /* #262626 */
  --muted-foreground: 240 5% 64.9%;  /* #a1a1aa */
  --accent: 12 6.5% 15.1%;           /* #292524 */
  --accent-foreground: 0 0% 98%;     /* #fafafa */
  --destructive: 0 62.8% 30.6%;      /* #dc2626 */
  --destructive-foreground: 0 85.7% 97.3%; /* #fef2f2 */
  --border: 240 3.7% 15.9%;          /* #27272a */
  --input: 240 3.7% 15.9%;           /* #27272a */
  --ring: 346.8 77.2% 49.8%;         /* #e11d48 */
}
```

### Typography Scale
- **Font Family**: Plus Jakarta Sans (Regular, Medium, SemiBold, Bold, ExtraBold)
- **Base Size**: 16px (1rem)
- **Line Height**: 1.5 (default), 1.2 (tight)
- **Letter Spacing**: -0.04em (tighter)

#### Font Sizes (from tailwind.config.js)
```javascript
fontSize: {
  '5xl': '2.5rem',    // 40px
  '6xl': '2.75rem',   // 44px
  '7xl': '4.5rem',    // 72px
  '8xl': '6.25rem',   // 100px
}
```

### Spacing Scale
- **Base**: Tailwind's default (0.25rem increments)
- **Custom**: 28: '7rem' (112px)
- **Container**: max-width: 1200px

### Border Radius
- **Base**: 0.5rem (8px) via --radius CSS variable
- **Variants**: 
  - lg: var(--radius) (8px)
  - md: calc(var(--radius) - 2px) (6px)
  - sm: calc(var(--radius) - 4px) (4px)

### Shadows
```javascript
boxShadow: {
  sm: '0 5px 10px rgba(0, 0, 0, 0.12)',
  md: '0 8px 30px rgba(0, 0, 0, 0.12)',
}
```

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Layout & Grid

### Container Structure
```tsx
<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
  {/* Content sections */}
</Container>
```

### Grid Systems

#### Featured Post Section
- **Desktop**: 2-column grid (lg:grid-cols-2)
- **Mobile**: Single column (grid-cols-1)
- **Gap**: 8 (2rem/32px)
- **Image Aspect Ratio**: 600x500 (1.2:1)

#### Latest Posts Grid
- **Desktop**: 3 columns (lg:grid-cols-3)
- **Tablet**: 2 columns (md:grid-cols-2)
- **Mobile**: 1 column (grid-cols-1)
- **Gap**: 6 (1.5rem/24px)

#### Social Media Icons
- **Layout**: Flexbox with gap-4 (1rem/16px)
- **Icon Size**: h-5 w-5 (1.25rem/20px)
- **Padding**: p-3 (0.75rem/12px)

### Card Specifications

#### ModernPostCard
- **Image Height**: h-48 (12rem/192px)
- **Border Radius**: rounded-xl (0.75rem/12px)
- **Shadow**: shadow-lg
- **Hover Scale**: scale-[1.02] (2% increase)
- **Transition**: duration-500 ease-out

#### FeaturedPost
- **Image Height**: h-[400px] (25rem/400px) on mobile, lg:h-[500px] (31.25rem/500px) on desktop
- **Background**: bg-stone-50 dark:bg-stone-900
- **Padding**: py-8 (2rem/32px)

### Text Truncation
- **Excerpt**: line-clamp-3 (3 lines maximum)
- **Title**: No truncation (full text displayed)
- **Tags**: Limited to 3 visible tags

## Components & States

### Component Inventory

#### 1. ModernHeader
- **File**: `components/features/navigation/modern-header.tsx`
- **Props**: `{ publication: PublicationFragment }`
- **States**: 
  - Default: Sticky header with navigation
  - Mobile: Sheet-based mobile menu
  - Hover: Color transitions on nav links
- **Accessibility**: ARIA labels, role attributes, focus management

#### 2. ModernHero
- **File**: `components/features/homepage/modern-hero.tsx`
- **Props**: 
  ```typescript
  {
    title: string;
    subtitle: string;
    description: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
  }
  ```
- **States**:
  - Loading: Intersection observer triggers animations
  - Visible: Staggered fade-in animations
  - Hover: Button scale effects

#### 3. FeaturedPost
- **File**: `components/features/blog/featured-post.tsx`
- **Props**:
  ```typescript
  {
    post: PostFragment;
    coverImage: string;
    readTime: string;
    tags: string[];
  }
  ```
- **States**:
  - Loading: Motion animations with delays
  - Error: Image fallback with error message
  - Hover: Image scale and overlay effects

#### 4. ModernPostCard
- **File**: `components/features/blog/modern-post-card.tsx`
- **Props**:
  ```typescript
  {
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    slug: string;
    readTime?: string;
    tags?: string[];
  }
  ```
- **States**:
  - Loading: Intersection observer animation
  - Error: Image fallback
  - Hover: Card scale, image zoom, overlay effects
  - Focus: Ring outline for accessibility

#### 5. NewsletterCTA
- **File**: `components/features/newsletter/newsletter-cta.tsx`
- **Props**:
  ```typescript
  {
    title?: string;
    buttons?: CTAButtonProps[] | false;
    className?: string;
    showNewsletterForm?: boolean;
  }
  ```
- **States**:
  - Default: Email input and subscribe button
  - Loading: Spinner animation
  - Success: Confirmation message
  - Error: Error message display

### Loading States
- **Skeleton**: Not implemented (uses intersection observer animations)
- **Empty State**: Custom empty state with icon and message
- **Error State**: Graceful fallback with error messages

### Hover/Focus/Active States
- **Cards**: scale-[1.02], shadow-xl, border-primary/30
- **Buttons**: scale-105, shadow-lg
- **Links**: Color transitions, underline effects
- **Focus**: Ring outline (2px solid --ring)

## Interactions & Animations

### Scroll Animations
- **Trigger**: Intersection Observer with 0.1 threshold
- **Animation**: translate-y-8 to translate-y-0, opacity-0 to opacity-100
- **Duration**: 1000ms ease-out
- **Delays**: Staggered delays (200ms, 300ms, 400ms, etc.)

### Hover Effects
- **Cards**: Scale transform (1.02), shadow enhancement
- **Images**: Scale transform (1.05-1.1), overlay opacity
- **Buttons**: Scale transform (1.05), shadow enhancement
- **Icons**: Translate effects (translate-x-1)

### Transition Properties
- **Duration**: 300ms (default), 500ms (cards), 1000ms (sections)
- **Easing**: ease-out (default), cubic-bezier for complex animations
- **Properties**: transform, opacity, color, shadow

### Keyboard Navigation
- **Tab Order**: Logical flow through interactive elements
- **Focus Indicators**: 2px solid ring with 2px offset
- **Skip Links**: Available but not visible in current implementation
- **ARIA**: Proper labeling and roles throughout

## Accessibility (WCAG AA)

### Landmark Roles
- **Header**: `<header role="banner">`
- **Navigation**: `<nav role="navigation" aria-label="Main navigation">`
- **Main**: `<main role="main" id="main-content">`
- **Footer**: Implicit footer role

### Headings Hierarchy
- **H1**: Page title (in SEOHead)
- **H2**: Section titles ("Featured Post", "Latest Posts")
- **H3**: Post titles in cards

### ARIA Labels
- **Social Links**: Descriptive aria-labels with "external website, opens in new tab"
- **Mobile Menu**: aria-expanded, aria-controls, aria-modal
- **Form Elements**: Proper labeling and error associations

### Color Contrast
- **Primary Text**: 4.5:1 ratio (WCAG AA compliant)
- **Secondary Text**: 3:1 ratio minimum
- **Interactive Elements**: 3:1 ratio for non-text elements

### Focus Management
- **Visible Focus**: 2px solid outline with 2px offset
- **Focus Trap**: Not implemented (not needed for current layout)
- **Focus Order**: Logical tab sequence

### Screen Reader Support
- **Alt Text**: Descriptive alt text for all images
- **Hidden Text**: Screen reader only content with .sr-only class
- **Live Regions**: Not implemented (not needed for current functionality)

## SEO

### Title Template
```typescript
title={`Blog - ${publication.displayTitle || publication.title || 'John Schibelli'}`}
```

### Meta Description
```typescript
description={`Read insights, tutorials, and thoughts on modern web development, React, Next.js, TypeScript, and technology from ${publication.author.name}.`}
```

### Keywords
```typescript
keywords={[
  'Web Development Blog',
  'React Tutorials',
  'Next.js Tips',
  'TypeScript Guides',
  'Front-End Development',
  'Web Performance',
  'SEO Best Practices',
  'Accessibility',
  'Modern Web Technologies',
  'Development Tips',
]}
```

### Canonical URL
```typescript
canonical="/blog"
```

### Open Graph Tags
- **Type**: website
- **Image**: Auto-generated publication OG image
- **Title**: Dynamic based on publication title
- **Description**: Dynamic based on publication description

### Twitter Card
- **Type**: summary_large_image
- **Creator**: @johnschibelli
- **Site**: @johnschibelli

### Structured Data
- **Type**: WebSite schema
- **Generated by**: `generateWebSiteStructuredData()` function
- **Location**: `lib/structured-data.ts`

### OG Image Generation
- **Path**: Auto-generated via `getAutogeneratedPublicationOG(publication)`
- **Template**: Uses publication data for dynamic generation
- **Fallback**: Default OG image if generation fails

## Analytics

### Pageview Tracking
- **Implementation**: Not currently implemented
- **Recommended**: Google Analytics 4 or similar
- **Location**: Should be added to Layout component

### Event Tracking
- **Newsletter Subscription**: Track successful subscriptions
- **Post Clicks**: Track which posts are clicked
- **Social Media Clicks**: Track external link clicks
- **Scroll Depth**: Track how far users scroll

### Example Implementation
```typescript
// In Layout component
useEffect(() => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
}, []);
```

## Performance & Budgets

### Core Web Vitals Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Image Optimization
- **Next.js Image**: Used for all post images
- **Sizes**: Responsive sizing with sizes attribute
- **Format**: WebP preferred, fallback to original
- **Loading**: Lazy loading with intersection observer

### Font Loading Strategy
- **Font Family**: Plus Jakarta Sans (local files)
- **Loading**: Font-display: swap (recommended)
- **Preload**: Critical fonts should be preloaded

### Bundle Optimization
- **Dynamic Imports**: Newsletter form loaded dynamically
- **Code Splitting**: Automatic via Next.js
- **Tree Shaking**: Enabled via webpack

### Caching Strategy
- **Static Generation**: ISR with 1-second revalidation
- **CDN**: Recommended for static assets
- **Browser Cache**: Proper cache headers for assets

## Acceptance Criteria

### Visual Accuracy
- **Pixel Perfect**: ≤ 0.1% visual diff threshold
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: All breakpoints (mobile, tablet, desktop)
- **Dark Mode**: Proper theme switching

### Functional Parity
- [ ] All post cards render correctly
- [ ] Featured post displays with proper styling
- [ ] Newsletter form functions properly
- [ ] Social media links work correctly
- [ ] Mobile navigation functions
- [ ] Theme toggle works
- [ ] All animations trigger properly
- [ ] SEO meta tags are correct
- [ ] Accessibility standards met

### Performance Benchmarks
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] All images load properly

## Recovery Steps

### If Blog Page is Overwritten

1. **Restore from Git**
   ```bash
   git checkout main -- pages/blog.tsx
   git checkout main -- components/features/blog/
   git checkout main -- components/features/homepage/modern-hero.tsx
   git checkout main -- components/features/navigation/modern-header.tsx
   git checkout main -- components/features/newsletter/newsletter-cta.tsx
   ```

2. **Verify Dependencies**
   ```bash
   npm install
   npm run build
   ```

3. **Run Tests**
   ```bash
   npm run test
   npm run test:e2e
   ```

4. **Visual Regression Testing**
   ```bash
   npm run test:visual
   ```

5. **Accessibility Testing**
   ```bash
   npm run test:a11y
   ```

### Key Files to Monitor
- `pages/blog.tsx` - Main page component
- `components/features/blog/` - Blog-specific components
- `components/features/homepage/modern-hero.tsx` - Hero section
- `components/features/navigation/modern-header.tsx` - Header
- `components/features/newsletter/newsletter-cta.tsx` - Newsletter
- `tailwind.config.js` - Theme configuration
- `styles/index.css` - CSS variables and animations

### Automated Recovery
Consider implementing:
- Pre-commit hooks to prevent overwrites
- Automated visual regression testing
- Component snapshot testing
- Accessibility testing in CI/CD

---

*This specification was generated on $(date) and should be updated whenever the Blog page is modified.*
