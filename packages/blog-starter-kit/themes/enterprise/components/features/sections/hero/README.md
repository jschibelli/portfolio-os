# Hero Components

A flexible, reusable hero component system that implements consistent typography and spacing systems while maintaining accessibility and performance standards.

## Overview

This hero component system provides three main variants (Large, Medium, Small) built on a flexible base component, each optimized for different use cases:

- **HeroLarge**: Main landing pages with largest typography and full feature set
- **HeroMedium**: Section headers with medium typography and focused content
- **HeroSmall**: Blog posts and smaller sections with compact typography

## Features

- ✅ **Consistent Typography System**: Implements Issue #139 typography standards
- ✅ **Standardized Spacing**: Implements Issue #140 spacing system
- ✅ **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- ✅ **Accessibility Compliance**: WCAG 2.1 AA standards with proper ARIA labels
- ✅ **Animation Support**: Framer Motion with reduced motion support
- ✅ **Performance Optimized**: Lazy loading, image optimization, and efficient rendering
- ✅ **TypeScript Support**: Full type safety with comprehensive interfaces

## Components

### BaseHero

The foundational component that all variants extend from.

```tsx
import { BaseHero } from '@/components/features/sections/hero';

<BaseHero
  variant="large"
  title="Your Title"
  subtitle="Your Subtitle"
  description="Your description"
  actions={[
    {
      href: '/contact',
      text: 'Get Started',
      variant: 'default'
    }
  ]}
  background={{
    type: 'gradient',
    gradient: {
      from: 'stone-900',
      to: 'stone-700',
      direction: 'to-br'
    }
  }}
/>
```

### HeroLarge

Optimized for main landing pages with largest typography and full feature set.

```tsx
import { HeroLarge } from '@/components/features/sections/hero';

<HeroLarge
  title="Building Smarter, Faster Web Applications"
  subtitle="John Schibelli"
  description="Transforming ideas into high-performance digital experiences."
  actions={exampleActions}
  showBadge={true}
  badgeText="New project available"
  showStats={true}
  stats={[
    { label: 'Projects', value: '50+' },
    { label: 'Clients', value: '25+' }
  ]}
/>
```

### HeroMedium

Perfect for section headers with medium typography and focused content.

```tsx
import { HeroMedium } from '@/components/features/sections/hero';

<HeroMedium
  title="Featured Projects"
  subtitle="Portfolio"
  description="Explore my latest work and case studies."
  showIcon={true}
  icon={<TrophyIcon className="h-8 w-8" />}
  showDivider={true}
  centered={true}
/>
```

### HeroSmall

Ideal for blog posts and smaller sections with compact typography.

```tsx
import { HeroSmall } from '@/components/features/sections/hero';

<HeroSmall
  title="Case Study: E-commerce Platform"
  subtitle="Project Overview"
  description="A comprehensive case study of building a scalable platform."
  showBreadcrumb={true}
  breadcrumbItems={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' }
  ]}
  showMeta={true}
  metaItems={[
    { label: 'Duration', value: '3 months' },
    { label: 'Team', value: '5 members' }
  ]}
/>
```

## Typography System

The hero components implement a comprehensive typography system with responsive scaling:

### Large Hero Typography
- **Mobile**: text-4xl (36px) title, text-lg (18px) subtitle
- **Tablet**: text-6xl (60px) title, text-xl (20px) subtitle  
- **Desktop**: text-7xl (72px) title, text-2xl (24px) subtitle

### Medium Hero Typography
- **Mobile**: text-3xl (30px) title, text-base (16px) subtitle
- **Tablet**: text-4xl (36px) title, text-lg (18px) subtitle
- **Desktop**: text-5xl (48px) title, text-xl (20px) subtitle

### Small Hero Typography
- **Mobile**: text-2xl (24px) title, text-sm (14px) subtitle
- **Tablet**: text-3xl (30px) title, text-base (16px) subtitle
- **Desktop**: text-4xl (36px) title, text-lg (18px) subtitle

## Spacing System

Consistent spacing system with responsive breakpoints:

### Container Spacing
- **Mobile**: py-12 px-4 (48px vertical, 16px horizontal)
- **Tablet**: py-16 px-6 (64px vertical, 24px horizontal)
- **Desktop**: py-20 px-8 (80px vertical, 32px horizontal)

### Content Spacing
- **Mobile**: gap-6 (24px between elements)
- **Tablet**: gap-8 (32px between elements)
- **Desktop**: gap-12 (48px between elements)

## Background Options

Support for multiple background types:

```tsx
// Image background
background={{
  type: 'image',
  src: '/hero-bg.jpg',
  alt: 'Hero background image',
  overlay: {
    color: 'rgba(0, 0, 0, 0.5)',
    opacity: 0.6
  }
}}

// Gradient background
background={{
  type: 'gradient',
  gradient: {
    from: 'stone-900',
    via: 'stone-800',
    to: 'stone-700',
    direction: 'to-br'
  }
}}

// Solid color background
background={{
  type: 'solid',
  color: '#1f2937'
}}

// Pattern background
background={{
  type: 'pattern',
  pattern: '/patterns/dots.svg',
  overlay: {
    color: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.7
  }
}}
```

## Actions

Flexible action system with multiple button variants:

```tsx
const actions: HeroAction[] = [
  {
    href: '/contact',
    text: 'Get Started',
    variant: 'default',
    size: 'lg',
    icon: <ArrowRightIcon className="mr-2 h-4 w-4" />,
    iconRight: <StarIcon className="ml-2 h-4 w-4" />
  },
  {
    href: '/projects',
    text: 'View Work',
    variant: 'outline',
    size: 'lg'
  }
];
```

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Semantic HTML**: Correct heading hierarchy (h1, h2, etc.)
- **Focus Management**: Keyboard navigation support
- **Reduced Motion**: Respects user's motion preferences
- **Color Contrast**: Meets WCAG 2.1 AA standards
- **Screen Reader Support**: Descriptive text and labels

## Performance Optimizations

- **Lazy Loading**: Images load only when needed
- **Image Optimization**: Proper sizing and format selection
- **Reduced Motion**: Respects user preferences
- **Efficient Rendering**: Optimized re-renders
- **Loading States**: Smooth transitions and feedback

## Animation System

Built-in animation system with Framer Motion:

```tsx
// Custom animation timing
<BaseHero
  animate={true}
  animationDelay={0.2}
  // ... other props
/>

// Disable animations
<BaseHero
  animate={false}
  // ... other props
/>
```

## Usage Examples

See `examples/hero-showcase.tsx` for comprehensive usage examples of all hero variants and features.

## TypeScript Support

Full TypeScript support with comprehensive interfaces:

```tsx
import type {
  BaseHeroProps,
  HeroVariant,
  HeroAction,
  HeroBackground,
  HeroTypographyConfig,
  HeroSpacingConfig
} from '@/components/features/sections/hero';
```

## Best Practices

1. **Use appropriate variants**: Large for main pages, Medium for sections, Small for blog posts
2. **Optimize images**: Use appropriate sizes and formats for backgrounds
3. **Test accessibility**: Ensure proper contrast and screen reader support
4. **Consider performance**: Use lazy loading for images and optimize animations
5. **Maintain consistency**: Use the same typography and spacing across similar components

## Migration Guide

If migrating from existing hero components:

1. Replace existing hero components with appropriate variants
2. Update props to match new interfaces
3. Test responsive behavior across breakpoints
4. Verify accessibility compliance
5. Optimize images and animations

## Contributing

When adding new features or variants:

1. Follow the existing TypeScript interfaces
2. Maintain accessibility standards
3. Test across all breakpoints
4. Update documentation
5. Add comprehensive examples
