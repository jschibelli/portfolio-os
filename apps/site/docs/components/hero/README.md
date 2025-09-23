# Hero Components Documentation

This comprehensive guide covers the hero component system used throughout the portfolio website. The hero components are designed to create impactful landing sections with consistent styling, animations, and accessibility features.

## Table of Contents

- [Overview](#overview)
- [Component Types](#component-types)
- [Usage Guidelines](#usage-guidelines)
- [Design System](#design-system)
- [Implementation Examples](#implementation-examples)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)

## Overview

The hero component system provides three main variants designed for different use cases:

1. **Default Hero** (`components/features/sections/hero/default.tsx`) - Generic hero with mockup support
2. **Homepage Hero** (`components/features/homepage/hero.tsx`) - Portfolio-specific hero with background image
3. **Modern Hero** (`components/features/homepage/modern-hero.tsx`) - Intersection observer-based hero

All components follow the Stone design system and include:
- Consistent typography scales
- Framer Motion animations
- Responsive design patterns
- Accessibility compliance
- Performance optimizations

## Component Types

### Default Hero
**File**: `components/features/sections/hero/default.tsx`

A flexible hero component with support for:
- Custom titles and descriptions
- Optional badges and buttons
- Mockup/screenshot integration
- Stone theme styling

**Props**:
```typescript
interface HeroProps {
  title?: string;
  description?: string;
  mockup?: ReactNode | false;
  badge?: ReactNode | false;
  buttons?: HeroButtonProps[] | false;
  className?: string;
}
```

### Homepage Hero
**File**: `components/features/homepage/hero.tsx`

Portfolio-specific hero with:
- Background image support
- Professional messaging
- CTA button hierarchy
- Framer Motion animations

**Features**:
- Optimized image loading with blur placeholders
- Radial gradient overlays for text readability
- Staggered animation sequences
- Mobile-first responsive design

### Modern Hero
**File**: `components/features/homepage/modern-hero.tsx`

Intersection observer-based hero with:
- Performance-optimized animations
- Custom background images
- Flexible content structure
- Smooth entrance effects

**Props**:
```typescript
interface ModernHeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}
```

## Usage Guidelines

### When to Use Each Component

**Default Hero**: Use for generic landing pages, product showcases, or when you need maximum flexibility.

**Homepage Hero**: Use for personal portfolio homepages or professional landing pages.

**Modern Hero**: Use when you need performance-optimized animations and custom background images.

### Content Guidelines

1. **Title**: Keep under 60 characters for optimal readability
2. **Description**: Aim for 120-160 characters for best impact
3. **CTA Text**: Use action-oriented language (e.g., "Get Started", "Learn More")
4. **Images**: Use high-quality images with proper aspect ratios

### Responsive Considerations

All hero components are mobile-first and include:
- Responsive typography scales
- Flexible button layouts
- Optimized image loading
- Touch-friendly interactions

## Design System

### Typography Scale

```css
/* Hero Titles */
.hero-title {
  @apply text-4xl font-semibold leading-tight;
  @apply sm:text-6xl sm:leading-tight;
  @apply md:text-8xl md:leading-tight;
}

/* Hero Descriptions */
.hero-description {
  @apply text-md font-medium;
  @apply sm:text-xl;
}
```

### Color Palette

The hero components use the Stone design system:

- **Primary Text**: `text-white` (light backgrounds) / `text-foreground` (dark backgrounds)
- **Secondary Text**: `text-stone-200` / `text-stone-300`
- **Muted Text**: `text-muted-foreground`
- **Backgrounds**: Stone gradient system with opacity variations

### Spacing System

```css
/* Container Spacing */
.hero-container {
  @apply py-12 md:py-16;
}

/* Content Spacing */
.hero-content {
  @apply space-y-6 sm:space-y-12;
}
```

## Implementation Examples

### Basic Default Hero

```tsx
import Hero from '@/components/features/sections/hero/default';

export default function LandingPage() {
  return (
    <Hero
      title="Your Amazing Product"
      description="A brief description that explains the value proposition"
      buttons={[
        {
          href: "/get-started",
          text: "Get Started",
          variant: "default"
        }
      ]}
    />
  );
}
```

### Homepage Hero with Custom Content

```tsx
import Hero from '@/components/features/homepage/hero';

export default function HomePage() {
  return <Hero />;
}
```

### Modern Hero with Custom Props

```tsx
import ModernHero from '@/components/features/homepage/modern-hero';

export default function ServicePage() {
  return (
    <ModernHero
      title="Web Development Services"
      subtitle="Professional Solutions"
      description="Transform your ideas into high-performance digital experiences"
      ctaText="Start Your Project"
      ctaLink="/contact"
      imageUrl="/assets/service-hero.jpg"
    />
  );
}
```

## Migration Guide

### From Legacy Components

If migrating from older hero components:

1. **Update Imports**:
   ```tsx
   // Old
   import { HeroSection } from '@/components/legacy/hero';
   
   // New
   import Hero from '@/components/features/sections/hero/default';
   ```

2. **Update Props**:
   ```tsx
   // Old
   <HeroSection 
     heading="Title"
     subheading="Subtitle"
   />
   
   // New
   <Hero
     title="Title"
     description="Subtitle"
   />
   ```

3. **Update Styling**:
   - Remove custom CSS classes
   - Use component's built-in styling
   - Apply Stone theme classes if needed

### Breaking Changes

- `heading` prop renamed to `title`
- `subheading` prop renamed to `description`
- Custom animation classes removed in favor of built-in animations
- Background image handling updated for better performance

## Best Practices

### Performance

1. **Image Optimization**:
   ```tsx
   // Use Next.js Image component
   <Image
     src="/hero-bg.jpg"
     alt="Hero background"
     fill
     priority
     quality={85}
     placeholder="blur"
   />
   ```

2. **Animation Performance**:
   - Use `transform` and `opacity` for animations
   - Avoid animating layout properties
   - Use `will-change` sparingly

3. **Bundle Size**:
   - Import only needed components
   - Use dynamic imports for heavy animations

### SEO

1. **Semantic HTML**:
   ```tsx
   <header className="hero-section">
     <h1>Main Heading</h1>
     <p>Description</p>
   </header>
   ```

2. **Structured Data**:
   - Include proper heading hierarchy
   - Use descriptive alt text for images
   - Implement proper ARIA labels

### Accessibility

1. **Keyboard Navigation**:
   - Ensure all interactive elements are focusable
   - Provide visible focus indicators
   - Use proper tab order

2. **Screen Readers**:
   - Use semantic HTML elements
   - Provide descriptive alt text
   - Include ARIA labels where needed

3. **Motion Preferences**:
   ```tsx
   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
   
   const animationProps = prefersReducedMotion 
     ? { animate: { opacity: 1 } }
     : { animate: { opacity: 1, y: 0 } };
   ```

## Accessibility

### WCAG Compliance

All hero components meet WCAG 2.1 AA standards:

- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper semantic markup
- **Motion Sensitivity**: Respects `prefers-reduced-motion`

### Implementation Checklist

- [ ] Use semantic HTML elements (`<header>`, `<h1>`, `<p>`)
- [ ] Provide descriptive alt text for images
- [ ] Ensure proper heading hierarchy
- [ ] Test with keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Test with reduced motion preferences

## Troubleshooting

### Common Issues

**1. Images Not Loading**
```tsx
// Check image path and Next.js configuration
<Image
  src="/assets/hero/hero-bg.png" // Ensure correct path
  alt="Hero background"
  fill
  priority // Add for above-the-fold images
/>
```

**2. Animations Not Working**
```tsx
// Ensure Framer Motion is properly installed
import { motion } from 'framer-motion';

// Check for CSS conflicts
const animationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
```

**3. Responsive Issues**
```tsx
// Use Tailwind responsive classes
className="text-4xl sm:text-6xl md:text-8xl"

// Check container max-widths
className="max-w-container mx-auto"
```

**4. Performance Issues**
- Optimize images (WebP format, proper sizing)
- Use `priority` prop for above-the-fold images
- Implement lazy loading for below-the-fold content
- Minimize animation complexity

### Debug Mode

Enable debug mode for development:

```tsx
// Add to component props
<Hero
  title="Debug Hero"
  description="Testing component"
  className="debug-hero" // Add debug styling
/>
```

### Browser Support

- **Modern Browsers**: Full support with animations
- **Legacy Browsers**: Graceful degradation
- **Mobile**: Touch-optimized interactions
- **Screen Readers**: Full accessibility support

## Support

For additional help:

1. Check the [Component Library Documentation](../README.md)
2. Review [Design System Guidelines](../design-system/README.md)
3. Consult [Accessibility Guidelines](../accessibility/README.md)
4. Submit issues to the project repository

---

*Last updated: January 2025*
*Version: 1.0.0*
