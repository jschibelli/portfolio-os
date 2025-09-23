# Hero Component Best Practices

This document outlines best practices for implementing, maintaining, and optimizing hero components to ensure consistent performance, accessibility, and user experience.

## Table of Contents

- [Performance Best Practices](#performance-best-practices)
- [Accessibility Guidelines](#accessibility-guidelines)
- [SEO Optimization](#seo-optimization)
- [Responsive Design](#responsive-design)
- [Animation Guidelines](#animation-guidelines)
- [Code Quality](#code-quality)
- [Testing Strategies](#testing-strategies)
- [Maintenance Guidelines](#maintenance-guidelines)

## Performance Best Practices

### 1. Image Optimization

**Use Next.js Image Component**:
```tsx
import Image from 'next/image';

// Optimized image loading
<Image
  src="/hero-bg.jpg"
  alt="Hero background"
  fill
  className="object-cover"
  priority // For above-the-fold images
  quality={85} // Balance between quality and file size
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Image Format Selection**:
- **WebP**: Primary format for modern browsers
- **JPEG**: Fallback for older browsers
- **AVIF**: Future-proof format for cutting-edge browsers

### 2. Animation Performance

**Use Hardware Acceleration**:
```tsx
// Good: Uses transform and opacity
const animationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Avoid: Animating layout properties
const badAnimation = {
  initial: { width: 0 },
  animate: { width: '100%' } // Causes layout thrashing
};
```

**Optimize Animation Complexity**:
```tsx
// Good: Simple, performant animations
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Avoid: Complex animations with many properties
<motion.div
  initial={{ opacity: 0, x: -100, y: -100, scale: 0.5, rotate: 45 }}
  animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
  transition={{ duration: 2, ease: "easeInOut" }}
>
  Content
</motion.div>
```

### 3. Bundle Size Optimization

**Code Splitting**:
```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyAnimation = lazy(() => import('./HeavyAnimation'));

export default function OptimizedHero() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyAnimation />
    </Suspense>
  );
}
```

**Tree Shaking**:
```tsx
// Good: Import only what you need
import { motion } from 'framer-motion';

// Avoid: Importing entire libraries
import * as FramerMotion from 'framer-motion';
```

### 4. Loading Performance

**Critical Resource Prioritization**:
```tsx
// Prioritize above-the-fold content
<Image
  src="/hero-bg.jpg"
  alt="Hero background"
  priority // Loads immediately
  fetchPriority="high"
/>
```

**Lazy Loading for Below-the-Fold**:
```tsx
// Lazy load non-critical content
<Image
  src="/decorative-bg.jpg"
  alt="Decorative background"
  loading="lazy" // Loads when needed
/>
```

## Accessibility Guidelines

### 1. Semantic HTML Structure

**Proper Heading Hierarchy**:
```tsx
<section className="hero-section" role="banner">
  <h1 className="hero-title">Main Page Title</h1>
  <p className="hero-description">Supporting description</p>
  <nav className="hero-actions" aria-label="Primary actions">
    <a href="/cta" className="hero-button">Call to Action</a>
  </nav>
</section>
```

**ARIA Labels and Descriptions**:
```tsx
<Hero
  title="Accessible Hero"
  description="Hero with proper accessibility features"
  buttons={[
    {
      href: "/accessible-feature",
      text: "Learn More",
      'aria-label': "Learn more about accessible features"
    }
  ]}
/>
```

### 2. Keyboard Navigation

**Focus Management**:
```tsx
// Ensure all interactive elements are focusable
<button
  className="hero-button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Interactive Element
</button>
```

**Skip Links**:
```tsx
// Provide skip links for keyboard users
<a 
  href="#main-content" 
  className="skip-link"
  tabIndex={1}
>
  Skip to main content
</a>
```

### 3. Screen Reader Support

**Descriptive Alt Text**:
```tsx
<Image
  src="/hero-image.jpg"
  alt="Professional developer working on modern web application with multiple monitors showing code and design tools"
  // Not just: alt="Hero image"
/>
```

**Live Regions for Dynamic Content**:
```tsx
<div 
  aria-live="polite" 
  aria-label="Hero content updates"
  className="sr-only"
>
  {dynamicContent}
</div>
```

### 4. Color and Contrast

**WCAG AA Compliance**:
```css
/* Ensure 4.5:1 contrast ratio for normal text */
.hero-text {
  color: #ffffff; /* On dark backgrounds */
  background: #1a1a1a; /* Dark background */
}

/* Ensure 3:1 contrast ratio for large text */
.hero-title {
  color: #ffffff;
  background: #2a2a2a;
}
```

**Color Independence**:
```tsx
// Don't rely solely on color to convey information
<button className="hero-button">
  <span className="text">Action Required</span>
  <span className="icon" aria-hidden="true">⚠️</span>
</button>
```

## SEO Optimization

### 1. Structured Data

**Schema.org Markup**:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Hero Title",
      "description": "Hero description",
      "url": "https://example.com",
      "mainEntity": {
        "@type": "Organization",
        "name": "Company Name"
      }
    })
  }}
/>
```

### 2. Meta Tags

**Optimized Meta Tags**:
```tsx
import Head from 'next/head';

export default function HeroPage() {
  return (
    <>
      <Head>
        <title>Hero Title - Company Name</title>
        <meta name="description" content="Hero description for SEO" />
        <meta property="og:title" content="Hero Title" />
        <meta property="og:description" content="Hero description" />
        <meta property="og:image" content="/hero-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Hero title="Hero Title" description="Hero description" />
    </>
  );
}
```

### 3. Performance Metrics

**Core Web Vitals**:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Responsive Design

### 1. Mobile-First Approach

**Progressive Enhancement**:
```tsx
// Start with mobile styles
<div className="hero-container py-8 px-4">
  <h1 className="text-3xl font-bold">
    Mobile Title
  </h1>
  
  {/* Enhance for larger screens */}
  <h1 className="text-3xl font-bold sm:text-5xl md:text-7xl">
    Responsive Title
  </h1>
</div>
```

### 2. Touch-Friendly Design

**Touch Target Sizes**:
```tsx
// Ensure minimum 44px touch targets
<button className="hero-button min-h-[44px] min-w-[44px]">
  Touch Target
</button>
```

**Gesture Support**:
```tsx
// Support touch gestures
<div 
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  Touch-friendly content
</div>
```

### 3. Flexible Layouts

**CSS Grid and Flexbox**:
```tsx
// Use flexible layouts
<div className="hero-layout grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="hero-content">
    Content
  </div>
  <div className="hero-visual">
    Visual
  </div>
</div>
```

## Animation Guidelines

### 1. Motion Preferences

**Respect User Preferences**:
```tsx
import { useReducedMotion } from 'framer-motion';

export default function AccessibleHero() {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? { animate: { opacity: 1 } }
    : { 
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
      };

  return (
    <motion.div {...animationProps}>
      Content
    </motion.div>
  );
}
```

### 2. Animation Performance

**Use Transform and Opacity**:
```tsx
// Good: Hardware accelerated
const goodAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 }
};

// Avoid: Layout-triggering properties
const badAnimation = {
  initial: { width: 0 },
  animate: { width: '100%' }
};
```

### 3. Animation Timing

**Consistent Timing Functions**:
```tsx
// Use consistent easing
const timing = {
  fast: { duration: 0.3, ease: "easeOut" },
  normal: { duration: 0.5, ease: "easeOut" },
  slow: { duration: 0.8, ease: "easeOut" }
};
```

## Code Quality

### 1. TypeScript Best Practices

**Proper Type Definitions**:
```tsx
interface HeroProps {
  title: string;
  description: string;
  buttons?: HeroButtonProps[];
  className?: string;
}

interface HeroButtonProps {
  href: string;
  text: string;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: ReactNode;
  'aria-label'?: string;
}
```

**Type Safety**:
```tsx
// Use strict typing
const heroButtons: HeroButtonProps[] = [
  {
    href: "/contact",
    text: "Contact Us",
    variant: "default",
    'aria-label': "Contact us for more information"
  }
];
```

### 2. Component Composition

**Reusable Components**:
```tsx
// Create reusable hero components
export const HeroButton = ({ href, text, variant, ...props }: HeroButtonProps) => {
  return (
    <Button
      asChild
      variant={variant}
      className="hero-button"
      {...props}
    >
      <a href={href}>{text}</a>
    </Button>
  );
};
```

### 3. Error Handling

**Graceful Degradation**:
```tsx
export default function SafeHero({ title, description, ...props }: HeroProps) {
  try {
    return (
      <Hero
        title={title || "Default Title"}
        description={description || "Default description"}
        {...props}
      />
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return <div>Hero content unavailable</div>;
  }
}
```

## Testing Strategies

### 1. Unit Testing

**Component Testing**:
```tsx
import { render, screen } from '@testing-library/react';
import Hero from '@/components/features/sections/hero/default';

describe('Hero Component', () => {
  it('renders title and description', () => {
    render(
      <Hero
        title="Test Title"
        description="Test Description"
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
```

### 2. Integration Testing

**User Interaction Testing**:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Hero Interactions', () => {
  it('handles button clicks', async () => {
    const user = userEvent.setup();
    render(
      <Hero
        title="Test"
        buttons={[
          { href: "/test", text: "Test Button" }
        ]}
      />
    );
    
    const button = screen.getByText('Test Button');
    await user.click(button);
    
    // Test navigation or action
  });
});
```

### 3. Accessibility Testing

**Automated Accessibility Testing**:
```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Hero Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Hero title="Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Maintenance Guidelines

### 1. Regular Updates

**Dependency Management**:
```bash
# Regular dependency updates
npm update

# Security updates
npm audit fix
```

**Performance Monitoring**:
```tsx
// Monitor performance metrics
useEffect(() => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
    });
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
}, []);
```

### 2. Documentation Maintenance

**Keep Documentation Updated**:
- Update examples when components change
- Document new features and props
- Maintain migration guides
- Update accessibility guidelines

### 3. Performance Monitoring

**Regular Performance Audits**:
- Monitor Core Web Vitals
- Check bundle size impact
- Test animation performance
- Validate accessibility compliance

## Common Pitfalls to Avoid

### 1. Performance Issues

❌ **Don't**:
```tsx
// Heavy animations on every render
<div className="hero" style={{ animation: 'complex-animation 2s infinite' }}>
  Content
</div>
```

✅ **Do**:
```tsx
// Optimized animations with proper cleanup
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### 2. Accessibility Issues

❌ **Don't**:
```tsx
// Missing semantic structure
<div>
  <div>Title</div>
  <div>Description</div>
</div>
```

✅ **Do**:
```tsx
// Proper semantic structure
<section role="banner">
  <h1>Title</h1>
  <p>Description</p>
</section>
```

### 3. SEO Issues

❌ **Don't**:
```tsx
// Missing meta information
<Hero title="Untitled" />
```

✅ **Do**:
```tsx
// Proper SEO setup
<Head>
  <title>Proper Page Title</title>
  <meta name="description" content="Page description" />
</Head>
<Hero title="Proper Title" description="Proper description" />
```

---

*Following these best practices ensures optimal performance, accessibility, and maintainability of hero components.*
*Last updated: January 2025*
