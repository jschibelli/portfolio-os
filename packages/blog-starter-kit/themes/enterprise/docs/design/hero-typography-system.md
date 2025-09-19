# Hero Typography System

## Overview

The Hero Typography System provides consistent typography scales, spacing, and visual hierarchy across all hero components in the application. This system ensures a cohesive user experience and maintains design consistency.

## Problem Solved

Previously, hero components had inconsistent typography:
- Title sizes ranged from `text-3xl` to `text-8xl`
- Mixed font weights (`font-semibold`, `font-bold`, `font-medium`)
- Inconsistent line heights and tracking
- Different responsive breakpoint strategies

## Implementation

### Design Tokens (`lib/design-tokens.ts`)

The typography system is built on a foundation of design tokens that define:

- **Breakpoints**: Mobile, tablet, desktop, large, and xlarge
- **Typography Scales**: Consistent sizing for titles, subtitles, and descriptions
- **Font Weights**: Standardized weight hierarchy
- **Line Heights**: Optimized for readability
- **Letter Spacing**: Consistent tracking values

### Typography Components (`components/ui/typography.tsx`)

Reusable typography components that implement the design token system:

- `HeroTitle` - Main hero titles
- `HeroSubtitle` - Hero subtitles and names
- `HeroDescription` - Hero descriptions
- `SectionHeading` - Section headings
- `CardTitle` - Card titles
- `Typography` - Generic component with preset support

### Tailwind Configuration

Enhanced Tailwind configuration with:

- **Custom Font Sizes**: Hero-specific typography scale
- **Line Heights**: Optimized for hero content
- **Letter Spacing**: Consistent tracking values
- **Utility Classes**: Pre-built typography combinations

## Usage

### Using Typography Components

```tsx
import { HeroTitle, HeroSubtitle, HeroDescription } from '@/components/ui/typography';

function Hero() {
  return (
    <div>
      <HeroTitle>Building Smarter, Faster Web Applications</HeroTitle>
      <HeroSubtitle>John Schibelli</HeroSubtitle>
      <HeroDescription>
        Transforming ideas into high-performance digital experiences.
      </HeroDescription>
    </div>
  );
}
```

### Using Utility Classes

```tsx
function Hero() {
  return (
    <div>
      <h1 className="hero-title text-white">
        Building Smarter, Faster Web Applications
      </h1>
      <p className="hero-subtitle text-stone-200">
        John Schibelli
      </p>
      <p className="hero-description text-stone-300">
        Transforming ideas into high-performance digital experiences.
      </p>
    </div>
  );
}
```

### Using Design Tokens Directly

```tsx
import { typographyPresets, heroTypography } from '@/lib/design-tokens';

function Hero() {
  return (
    <h1 className={typographyPresets.heroTitle}>
      Building Smarter, Faster Web Applications
    </h1>
  );
}
```

## Typography Scale

### Hero Title Scale
- **Mobile**: `text-4xl` (2.5rem / 40px)
- **Tablet**: `text-5xl` (3rem / 48px)
- **Desktop**: `text-6xl` (3.75rem / 60px)
- **Large**: `text-7xl` (4.5rem / 72px)
- **XLarge**: `text-8xl` (6rem / 96px)

### Hero Subtitle Scale
- **Mobile**: `text-lg` (1.125rem / 18px)
- **Tablet**: `text-xl` (1.25rem / 20px)
- **Desktop**: `text-2xl` (1.5rem / 24px)
- **Large**: `text-3xl` (1.875rem / 30px)

### Hero Description Scale
- **Mobile**: `text-base` (1rem / 16px)
- **Tablet**: `text-lg` (1.125rem / 18px)
- **Desktop**: `text-xl` (1.25rem / 20px)
- **Large**: `text-2xl` (1.5rem / 24px)

## Font Weight Hierarchy

- **Hero Titles**: `font-bold` (700)
- **Hero Subtitles**: `font-semibold` (600)
- **Hero Descriptions**: `font-medium` (500)
- **Section Headings**: `font-bold` (700)
- **Card Titles**: `font-semibold` (600)

## Line Height Standards

- **Hero Titles**: `leading-tight` (1.25)
- **Hero Subtitles**: `leading-relaxed` (1.625)
- **Hero Descriptions**: `leading-relaxed` (1.625)
- **Section Headings**: `leading-tight` (1.25)
- **Card Content**: `leading-snug` (1.375)

## Responsive Strategy

The typography system uses a mobile-first approach with consistent breakpoints:

- **Mobile**: 0px - 639px
- **Tablet**: 640px - 767px
- **Desktop**: 768px - 1023px
- **Large**: 1024px - 1279px
- **XLarge**: 1280px+

## Best Practices

1. **Use Typography Components**: Prefer components over utility classes for better maintainability
2. **Consistent Hierarchy**: Follow the established font weight and size hierarchy
3. **Responsive Design**: Always test across all breakpoints
4. **Accessibility**: Ensure sufficient color contrast and readable font sizes
5. **Performance**: Use the pre-built utility classes for better performance

## Migration Guide

### Before (Inconsistent)
```tsx
<h1 className="text-4xl font-bold tracking-tight text-white leading-tight md:text-6xl lg:text-7xl md:leading-tight lg:leading-tight">
  Title
</h1>
```

### After (Consistent)
```tsx
<HeroTitle className="text-white">
  Title
</HeroTitle>
```

Or using utility classes:
```tsx
<h1 className="hero-title text-white">
  Title
</h1>
```

## Testing

The typography system has been tested across:
- All hero components
- Multiple breakpoints
- Different content lengths
- Various color schemes
- Accessibility requirements

## Future Enhancements

- Additional typography variants
- Dark mode optimizations
- Print stylesheet considerations
- Advanced responsive typography features
