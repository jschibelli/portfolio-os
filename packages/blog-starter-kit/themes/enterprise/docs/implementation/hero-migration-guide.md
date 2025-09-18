# Hero Component Migration Guide

This guide helps you migrate from legacy hero components to the new hero component system, ensuring a smooth transition while maintaining functionality and improving performance.

## Table of Contents

- [Migration Overview](#migration-overview)
- [Pre-Migration Checklist](#pre-migration-checklist)
- [Step-by-Step Migration](#step-by-step-migration)
- [Breaking Changes](#breaking-changes)
- [Compatibility Notes](#compatibility-notes)
- [Testing Checklist](#testing-checklist)
- [Rollback Plan](#rollback-plan)

## Migration Overview

The new hero component system provides:
- **Consistent Design**: Unified Stone theme across all components
- **Better Performance**: Optimized animations and image loading
- **Enhanced Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Type Safety**: Full TypeScript support with proper interfaces

## Pre-Migration Checklist

Before starting the migration, ensure you have:

- [ ] **Backup**: Create a backup of your current implementation
- [ ] **Dependencies**: Update to required package versions
- [ ] **Testing**: Set up testing environment for validation
- [ ] **Documentation**: Review current hero component usage
- [ ] **Assets**: Prepare optimized images and assets

### Required Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^10.16.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "tailwindcss": "^3.3.0"
  }
}
```

## Step-by-Step Migration

### Step 1: Update Imports

**Before (Legacy)**:
```tsx
import { HeroSection } from '@/components/legacy/hero';
import { HeroBanner } from '@/components/old/hero-banner';
import { AnimatedHero } from '@/components/custom/animated-hero';
```

**After (New System)**:
```tsx
import Hero from '@/components/features/sections/hero/default';
import HomepageHero from '@/components/features/homepage/hero';
import ModernHero from '@/components/features/homepage/modern-hero';
```

### Step 2: Update Component Props

#### Legacy Hero Section

**Before**:
```tsx
<HeroSection 
  heading="Welcome to Our Platform"
  subheading="Discover amazing features"
  backgroundImage="/hero-bg.jpg"
  ctaText="Get Started"
  ctaLink="/get-started"
  showAnimation={true}
  customClass="custom-hero"
/>
```

**After**:
```tsx
<Hero
  title="Welcome to Our Platform"
  description="Discover amazing features"
  buttons={[
    {
      href: "/get-started",
      text: "Get Started",
      variant: "default"
    }
  ]}
  className="custom-hero"
/>
```

#### Legacy Hero Banner

**Before**:
```tsx
<HeroBanner
  title="Product Launch"
  subtitle="New Features Available"
  description="Experience the latest updates"
  primaryButton={{
    text: "Learn More",
    href: "/features"
  }}
  secondaryButton={{
    text: "Watch Demo",
    href: "/demo"
  }}
/>
```

**After**:
```tsx
<Hero
  title="Product Launch"
  description="Experience the latest updates with new features"
  buttons={[
    {
      href: "/features",
      text: "Learn More",
      variant: "default"
    },
    {
      href: "/demo",
      text: "Watch Demo",
      variant: "outline"
    }
  ]}
/>
```

### Step 3: Update Styling

#### Remove Custom CSS

**Before**:
```css
/* Remove these custom styles */
.legacy-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 0;
}

.legacy-hero h1 {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
}

.legacy-hero p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
}
```

**After**:
```tsx
// Use built-in Stone theme styling
<Hero
  title="Your Title"
  description="Your description"
  className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800"
/>
```

#### Update Custom Classes

**Before**:
```tsx
<HeroSection 
  customClass="my-custom-hero"
  // ... other props
/>
```

**After**:
```tsx
<Hero
  className="my-custom-hero"
  // ... other props
/>
```

### Step 4: Update Animation Handling

#### Legacy Animation System

**Before**:
```tsx
<AnimatedHero
  animationType="fadeInUp"
  delay={300}
  duration={800}
  stagger={true}
/>
```

**After**:
```tsx
// Animations are built-in and optimized
<Hero
  title="Animated Title"
  description="Smooth animations included"
/>
```

#### Custom Animations

**Before**:
```tsx
import { motion } from 'framer-motion';

const customVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

<HeroSection
  customAnimation={customVariants}
/>
```

**After**:
```tsx
import { motion } from 'framer-motion';

// Use Framer Motion directly for custom animations
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  <Hero
    title="Custom Animation"
    description="Use Framer Motion for advanced animations"
  />
</motion.div>
```

### Step 5: Update Image Handling

#### Legacy Image System

**Before**:
```tsx
<HeroSection
  backgroundImage="/hero-bg.jpg"
  backgroundSize="cover"
  backgroundPosition="center"
/>
```

**After**:
```tsx
// Use Next.js Image component for optimization
import Image from 'next/image';

<section className="relative min-h-[600px]">
  <div className="absolute inset-0">
    <Image
      src="/hero-bg.jpg"
      alt="Hero background"
      fill
      className="object-cover"
      priority
    />
  </div>
  <Hero
    title="Optimized Images"
    description="Better performance with Next.js Image"
  />
</section>
```

### Step 6: Update Button Handling

#### Legacy Button System

**Before**:
```tsx
<HeroSection
  primaryButton={{
    text: "Get Started",
    href: "/start",
    variant: "primary",
    size: "large"
  }}
  secondaryButton={{
    text: "Learn More",
    href: "/learn",
    variant: "secondary",
    size: "medium"
  }}
/>
```

**After**:
```tsx
<Hero
  buttons={[
    {
      href: "/start",
      text: "Get Started",
      variant: "default"
    },
    {
      href: "/learn",
      text: "Learn More",
      variant: "outline"
    }
  ]}
/>
```

## Breaking Changes

### 1. Prop Name Changes

| Legacy Prop | New Prop | Notes |
|-------------|----------|-------|
| `heading` | `title` | Direct replacement |
| `subheading` | `description` | Direct replacement |
| `customClass` | `className` | Direct replacement |
| `backgroundImage` | Not supported | Use custom implementation |
| `showAnimation` | Built-in | Animations are always enabled |
| `primaryButton` | `buttons[0]` | Array format |
| `secondaryButton` | `buttons[1]` | Array format |

### 2. Styling Changes

- **Custom CSS**: Remove all custom hero-related CSS
- **Theme System**: Use Stone theme classes instead of custom colors
- **Responsive**: Mobile-first approach replaces desktop-first
- **Animations**: Built-in animations replace custom animation props

### 3. Component Structure

**Before**:
```tsx
<HeroSection>
  <HeroContent>
    <HeroTitle />
    <HeroDescription />
    <HeroButtons />
  </HeroContent>
</HeroSection>
```

**After**:
```tsx
<Hero
  title="Title"
  description="Description"
  buttons={[...]}
/>
```

## Compatibility Notes

### Browser Support

- **Modern Browsers**: Full support with all features
- **Legacy Browsers**: Graceful degradation for older browsers
- **Mobile**: Optimized for touch interactions
- **Screen Readers**: Enhanced accessibility support

### Performance Considerations

- **Bundle Size**: New components are more optimized
- **Loading**: Improved image loading with Next.js optimization
- **Animations**: Hardware-accelerated animations
- **Memory**: Reduced memory usage with better cleanup

### Migration Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Phase 1** | 1-2 days | Update imports and basic props |
| **Phase 2** | 2-3 days | Update styling and animations |
| **Phase 3** | 1-2 days | Testing and validation |
| **Phase 4** | 1 day | Performance optimization |

## Testing Checklist

### Functional Testing

- [ ] **Component Rendering**: All hero components render correctly
- [ ] **Props Validation**: All props work as expected
- [ ] **Button Functionality**: CTA buttons work properly
- [ ] **Navigation**: Links navigate correctly
- [ ] **Images**: Background images load and display properly

### Visual Testing

- [ ] **Responsive Design**: Test on mobile, tablet, and desktop
- [ ] **Theme Support**: Light and dark themes work correctly
- [ ] **Animations**: Animations are smooth and performant
- [ ] **Typography**: Text scales properly across devices
- [ ] **Spacing**: Layout spacing is consistent

### Accessibility Testing

- [ ] **Keyboard Navigation**: All interactive elements are accessible
- [ ] **Screen Readers**: Content is properly announced
- [ ] **Color Contrast**: Text meets WCAG AA standards
- [ ] **Focus Management**: Focus indicators are visible
- [ ] **Motion Preferences**: Respects reduced motion settings

### Performance Testing

- [ ] **Loading Speed**: Components load quickly
- [ ] **Image Optimization**: Images are properly optimized
- [ ] **Animation Performance**: Animations don't cause jank
- [ ] **Memory Usage**: No memory leaks detected
- [ ] **Bundle Size**: No significant size increase

### Cross-Browser Testing

- [ ] **Chrome**: Latest version
- [ ] **Firefox**: Latest version
- [ ] **Safari**: Latest version
- [ ] **Edge**: Latest version
- [ ] **Mobile Browsers**: iOS Safari, Chrome Mobile

## Rollback Plan

### Quick Rollback

If issues arise during migration:

1. **Revert Code Changes**:
   ```bash
   git revert <commit-hash>
   ```

2. **Restore Dependencies**:
   ```bash
   npm install <previous-versions>
   ```

3. **Restore Assets**:
   ```bash
   git checkout HEAD~1 -- public/assets/
   ```

### Partial Rollback

If only specific components need rollback:

1. **Identify Problematic Components**
2. **Revert Individual Files**
3. **Update Imports Temporarily**
4. **Test Incrementally**

### Emergency Rollback

For critical issues:

1. **Deploy Previous Version**
2. **Disable New Features**
3. **Monitor Performance**
4. **Plan Fix Strategy**

## Migration Examples

### Example 1: Simple Hero Migration

**Before**:
```tsx
import { HeroSection } from '@/components/legacy/hero';

export default function LandingPage() {
  return (
    <HeroSection
      heading="Welcome"
      subheading="Get started today"
      ctaText="Sign Up"
      ctaLink="/signup"
    />
  );
}
```

**After**:
```tsx
import Hero from '@/components/features/sections/hero/default';

export default function LandingPage() {
  return (
    <Hero
      title="Welcome"
      description="Get started today"
      buttons={[
        {
          href: "/signup",
          text: "Sign Up",
          variant: "default"
        }
      ]}
    />
  );
}
```

### Example 2: Complex Hero Migration

**Before**:
```tsx
import { HeroBanner } from '@/components/old/hero-banner';

export default function ProductPage() {
  return (
    <HeroBanner
      title="New Product"
      subtitle="Revolutionary Features"
      description="Experience the future"
      backgroundImage="/product-hero.jpg"
      primaryButton={{
        text: "Buy Now",
        href: "/purchase",
        variant: "primary"
      }}
      secondaryButton={{
        text: "Learn More",
        href: "/features",
        variant: "secondary"
      }}
      customClass="product-hero"
    />
  );
}
```

**After**:
```tsx
import Hero from '@/components/features/sections/hero/default';
import Image from 'next/image';

export default function ProductPage() {
  return (
    <section className="relative min-h-[600px]">
      <div className="absolute inset-0">
        <Image
          src="/product-hero.jpg"
          alt="Product hero background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <Hero
        title="New Product"
        description="Experience the future with revolutionary features"
        buttons={[
          {
            href: "/purchase",
            text: "Buy Now",
            variant: "default"
          },
          {
            href: "/features",
            text: "Learn More",
            variant: "outline"
          }
        ]}
        className="product-hero"
      />
    </section>
  );
}
```

## Support and Resources

### Documentation

- [Hero Components Documentation](../components/hero/README.md)
- [Design System Guidelines](../design-system/hero-typography.md)
- [Implementation Examples](./hero-examples.md)

### Community Support

- **GitHub Issues**: Report bugs and request features
- **Discord**: Join the community discussion
- **Stack Overflow**: Tag questions with `hero-components`

### Professional Support

- **Consulting**: Custom migration assistance
- **Training**: Team training sessions
- **Code Review**: Expert code review services

---

*This migration guide ensures a smooth transition to the new hero component system.*
*Last updated: January 2025*
