# Blog Page Component Inventory

## Overview

This document provides a comprehensive inventory of all components used on the Blog page, including their props, variants, file paths, and usage patterns.

## Component Hierarchy

```
Blog Page (/blog)
├── AppProvider (Context)
├── Layout
│   ├── Meta
│   ├── Scripts
│   └── Footer
├── ModernHeader
│   ├── Logo
│   ├── Desktop Navigation
│   ├── Mobile Menu (Sheet)
│   └── Theme Toggle
├── ModernHero
│   ├── Background Image
│   ├── Title & Subtitle
│   ├── Description
│   └── CTA Buttons
├── Social Media Icons
│   ├── Facebook
│   ├── GitHub
│   ├── LinkedIn
│   ├── Bluesky
│   └── RSS
├── FeaturedPost
│   ├── Image
│   ├── Metadata
│   ├── Title
│   ├── Excerpt
│   ├── Tags
│   └── CTA Link
├── ModernPostCard (×3)
│   ├── Image
│   ├── Metadata
│   ├── Title
│   ├── Excerpt
│   ├── Tags
│   └── Read More
├── NewsletterCTA
│   ├── Title
│   ├── Email Input
│   ├── Subscribe Button
│   └── Status Messages
└── Chatbot
```

## Core Components

### 1. AppProvider
- **File**: `components/contexts/appContext.tsx`
- **Purpose**: Provides publication data to child components
- **Props**: `{ publication: PublicationFragment, children: ReactNode }`
- **Usage**: Wraps entire blog page content
- **Dependencies**: None

### 2. Layout
- **File**: `components/shared/layout.tsx`
- **Purpose**: Main page layout wrapper
- **Props**: `{ children: ReactNode }`
- **Usage**: Wraps all page content
- **Dependencies**: Meta, Scripts, Footer, Integrations

### 3. Container
- **File**: `components/shared/container.tsx`
- **Purpose**: Responsive container with max-width
- **Props**: `{ children?: ReactNode, className?: string }`
- **Usage**: Wraps main content sections
- **Dependencies**: None

## Navigation Components

### 4. ModernHeader
- **File**: `components/features/navigation/modern-header.tsx`
- **Purpose**: Main site navigation with mobile menu
- **Props**:
  ```typescript
  {
    publication: {
      title: string;
      displayTitle?: string | null;
      logo?: { url: string } | null;
    };
  }
  ```
- **Variants**: Desktop navigation, Mobile sheet menu
- **States**: 
  - Default: Sticky header with navigation
  - Mobile: Sheet-based mobile menu
  - Hover: Color transitions on nav links
- **Dependencies**: Button, Sheet, ThemeToggle, Social Icons
- **Accessibility**: ARIA labels, role attributes, focus management

### 5. ThemeToggle
- **File**: `components/ui/theme-toggle.tsx`
- **Purpose**: Dark/light mode toggle
- **Props**: Standard button props
- **Usage**: In header actions
- **Dependencies**: Button, Sun/Moon icons

## Hero Section Components

### 6. ModernHero
- **File**: `components/features/homepage/modern-hero.tsx`
- **Purpose**: Hero section with background image and CTA
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
- **Variants**: Responsive text sizing
- **States**:
  - Loading: Intersection observer triggers animations
  - Visible: Staggered fade-in animations
  - Hover: Button scale effects
- **Dependencies**: Button, ArrowRightIcon
- **Animations**: Staggered entrance animations with delays

## Blog Content Components

### 7. FeaturedPost
- **File**: `components/features/blog/featured-post.tsx`
- **Purpose**: Large featured post display
- **Props**:
  ```typescript
  {
    post: PostFragment;
    coverImage: string;
    readTime: string;
    tags: string[];
  }
  ```
- **Variants**: Responsive layout (1-col mobile, 2-col desktop)
- **States**:
  - Loading: Motion animations with delays
  - Error: Image fallback with error message
  - Hover: Image scale and overlay effects
- **Dependencies**: Badge, ArrowRightIcon, CalendarIcon, ClockIcon, motion
- **Animations**: Framer Motion entrance animations

### 8. ModernPostCard
- **File**: `components/features/blog/modern-post-card.tsx`
- **Purpose**: Individual post card in grid
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
- **Variants**: Responsive grid item
- **States**:
  - Loading: Intersection observer animation
  - Error: Image fallback
  - Hover: Card scale, image zoom, overlay effects
  - Focus: Ring outline for accessibility
- **Dependencies**: Badge, Card, CardContent, CardHeader, format (date-fns)
- **Animations**: Intersection observer with staggered delays

## Social Media Components

### 9. Social Media Icons
- **Files**: `components/icons/svgs/*.js`
- **Purpose**: Social media and RSS links
- **Icons**: FacebookSVG, GithubSVG, LinkedinSVG, BlueskySVG, RssSVG
- **Props**: Standard SVG props with className
- **Usage**: In header and social section
- **States**: Hover effects with color transitions
- **Dependencies**: None

## Newsletter Components

### 10. NewsletterCTA
- **File**: `components/features/newsletter/newsletter-cta.tsx`
- **Purpose**: Newsletter subscription form
- **Props**:
  ```typescript
  {
    title?: string;
    buttons?: CTAButtonProps[] | false;
    className?: string;
    showNewsletterForm?: boolean;
  }
  ```
- **Variants**: With/without newsletter form
- **States**:
  - Default: Email input and subscribe button
  - Loading: Spinner animation
  - Success: Confirmation message
  - Error: Error message display
- **Dependencies**: Button, Section, GraphQL mutations
- **Animations**: Form state transitions

### 11. SubscribeForm
- **File**: `components/features/newsletter/subscribe-form.tsx`
- **Purpose**: Newsletter subscription form (dynamic import)
- **Props**: Standard form props
- **Usage**: Dynamically imported in NewsletterCTA
- **Dependencies**: GraphQL mutations

## UI Components

### 12. Button
- **File**: `components/ui/button.tsx`
- **Purpose**: Reusable button component
- **Props**:
  ```typescript
  {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
    // ... standard button props
  }
  ```
- **Variants**: 6 variants, 4 sizes
- **States**: Default, hover, focus, active, disabled
- **Dependencies**: Slot (Radix UI), class-variance-authority

### 13. Badge
- **File**: `components/ui/badge.tsx`
- **Purpose**: Small status/tag indicators
- **Props**:
  ```typescript
  {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    // ... standard div props
  }
  ```
- **Variants**: 4 variants
- **Usage**: Tags, status indicators
- **Dependencies**: class-variance-authority

### 14. Card
- **File**: `components/ui/card.tsx`
- **Purpose**: Container for related content
- **Components**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Props**: Standard div props with className
- **Usage**: Post cards, content containers
- **Dependencies**: None

### 15. Sheet
- **File**: `components/ui/sheet.tsx`
- **Purpose**: Mobile navigation drawer
- **Components**: Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
- **Props**: Radix UI Sheet props
- **Usage**: Mobile menu
- **Dependencies**: Radix UI Sheet

## Icon Components

### 16. Lucide Icons
- **File**: `lucide-react` package
- **Icons Used**: ArrowRightIcon, CalendarIcon, ClockIcon, Menu
- **Props**: Standard SVG props
- **Usage**: Navigation, metadata, actions
- **Dependencies**: lucide-react package

### 17. Custom Icons
- **File**: `components/icons/svgs/*.js`
- **Icons**: ArticleSVG, Social media SVGs
- **Props**: Standard SVG props
- **Usage**: Empty states, social links
- **Dependencies**: None

## Utility Components

### 18. SEOHead
- **File**: `components/shared/seo-head.tsx`
- **Purpose**: SEO meta tags and structured data
- **Props**:
  ```typescript
  {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile';
    // ... additional SEO props
  }
  ```
- **Usage**: Page-level SEO
- **Dependencies**: Next.js Head

### 19. Meta
- **File**: `components/shared/meta.tsx`
- **Purpose**: Global meta tags
- **Props**: None
- **Usage**: Global meta information
- **Dependencies**: None

### 20. Scripts
- **File**: `components/shared/scripts.tsx`
- **Purpose**: Global scripts
- **Props**: None
- **Usage**: Analytics, third-party scripts
- **Dependencies**: None

## Component Usage Patterns

### Grid Layouts
```tsx
// Latest Posts Grid
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {posts.map((post, index) => (
    <ModernPostCard key={post.id} {...post} />
  ))}
</div>

// Featured Post Grid
<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
  <FeaturedPost {...featuredPost} />
</div>
```

### Animation Patterns
```tsx
// Intersection Observer Animation
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { threshold: 0.1 }
  );
  // ... observer logic
}, []);

// Animation Classes
className={`transition-all duration-1000 ease-out ${
  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
}`}
```

### Responsive Patterns
```tsx
// Responsive Text Sizing
className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl"

// Responsive Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Responsive Spacing
className="px-4 sm:px-6 lg:px-8"
```

## Component Dependencies

### External Dependencies
- **Next.js**: Image, Link, Head
- **React**: useState, useEffect, ReactNode
- **Framer Motion**: motion, animations
- **Radix UI**: Slot, Sheet components
- **Lucide React**: Icons
- **date-fns**: format function
- **class-variance-authority**: Component variants

### Internal Dependencies
- **GraphQL**: Generated types and queries
- **Utils**: cn function for className merging
- **Context**: AppProvider for publication data
- **Config**: Site configuration

## Component Testing Considerations

### Unit Testing
- Props validation
- State management
- Event handlers
- Conditional rendering

### Integration Testing
- Component interactions
- Context usage
- GraphQL data flow
- Animation triggers

### Visual Testing
- Responsive layouts
- Dark/light mode
- Hover states
- Loading states

## Performance Considerations

### Code Splitting
- Newsletter form dynamically imported
- Heavy components lazy loaded
- Route-based splitting

### Optimization
- Image optimization with Next.js Image
- Intersection observer for animations
- Memoization for expensive calculations
- Proper key props for lists

---

*This component inventory was generated on $(date) and should be updated whenever components are modified or added.*
