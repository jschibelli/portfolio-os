# Hero Typography and Spacing Standards

This document defines the typography scales, spacing systems, and design tokens used in the hero component system.

## Typography Scale

### Hero Titles

The hero title system uses a responsive typography scale optimized for readability and impact:

```css
/* Base Hero Title */
.hero-title {
  @apply text-4xl font-semibold leading-tight;
  @apply sm:text-6xl sm:leading-tight;
  @apply md:text-8xl md:leading-tight;
}

/* Large Hero Title (Homepage) */
.hero-title-large {
  @apply text-4xl font-bold tracking-tight leading-tight;
  @apply md:text-6xl md:leading-tight;
  @apply lg:text-7xl lg:leading-tight;
}

/* Modern Hero Title */
.hero-title-modern {
  @apply text-3xl font-bold tracking-tight;
  @apply sm:text-4xl;
  @apply md:text-5xl;
  @apply lg:text-6xl;
  @apply xl:text-7xl;
}
```

### Hero Descriptions

Description text follows a consistent scale for optimal readability:

```css
/* Hero Description */
.hero-description {
  @apply text-md font-medium leading-relaxed;
  @apply sm:text-xl;
}

/* Hero Subtitle */
.hero-subtitle {
  @apply text-xl font-semibold;
  @apply md:text-2xl;
  @apply lg:text-3xl;
}

/* Hero Tagline */
.hero-tagline {
  @apply text-lg font-semibold;
  @apply md:text-xl;
  @apply lg:text-2xl;
}
```

### Typography Hierarchy

```css
/* Complete Typography Scale */
.hero-hierarchy {
  /* H1 - Main Title */
  .hero-title {
    @apply text-4xl font-semibold leading-tight;
    @apply sm:text-6xl sm:leading-tight;
    @apply md:text-8xl md:leading-tight;
  }
  
  /* H2 - Subtitle */
  .hero-subtitle {
    @apply text-xl font-semibold;
    @apply md:text-2xl;
    @apply lg:text-3xl;
  }
  
  /* H3 - Tagline */
  .hero-tagline {
    @apply text-lg font-semibold;
    @apply md:text-xl;
    @apply lg:text-2xl;
  }
  
  /* P - Description */
  .hero-description {
    @apply text-md font-medium leading-relaxed;
    @apply sm:text-xl;
  }
  
  /* Small - Meta Text */
  .hero-meta {
    @apply text-sm font-medium;
    @apply sm:text-base;
  }
}
```

## Spacing System

### Container Spacing

```css
/* Hero Container */
.hero-container {
  @apply py-12 md:py-16;
}

/* Hero Section */
.hero-section {
  @apply pt-16 sm:pt-24;
}

/* Hero Content */
.hero-content {
  @apply space-y-6 sm:space-y-12;
}
```

### Content Spacing

```css
/* Vertical Spacing */
.hero-spacing {
  /* Small spacing */
  .space-y-3 { @apply space-y-3; }
  
  /* Medium spacing */
  .space-y-6 { @apply space-y-6; }
  
  /* Large spacing */
  .space-y-12 { @apply space-y-12; }
  
  /* Extra large spacing */
  .space-y-24 { @apply space-y-24; }
}

/* Horizontal Spacing */
.hero-horizontal {
  /* Button spacing */
  .gap-4 { @apply gap-4; }
  .gap-6 { @apply gap-6; }
  
  /* Content spacing */
  .gap-12 { @apply gap-12; }
}
```

### Responsive Spacing

```css
/* Responsive Spacing Scale */
.hero-responsive-spacing {
  /* Mobile First */
  .hero-mobile {
    @apply py-12 space-y-6;
  }
  
  /* Tablet */
  .hero-tablet {
    @apply sm:py-16 sm:space-y-12;
  }
  
  /* Desktop */
  .hero-desktop {
    @apply md:py-20 md:space-y-16;
  }
  
  /* Large Desktop */
  .hero-large {
    @apply lg:py-24 lg:space-y-20;
  }
}
```

## Color System

### Stone Theme Colors

The hero components use the Stone design system for consistent theming:

```css
/* Stone Color Palette */
:root {
  /* Primary Colors */
  --stone-50: #fafaf9;
  --stone-100: #f5f5f4;
  --stone-200: #e7e5e4;
  --stone-300: #d6d3d1;
  --stone-400: #a8a29e;
  --stone-500: #78716c;
  --stone-600: #57534e;
  --stone-700: #44403c;
  --stone-800: #292524;
  --stone-900: #1c1917;
  --stone-950: #0c0a09;
}

/* Dark Mode Colors */
.dark {
  --stone-50: #0c0a09;
  --stone-100: #1c1917;
  --stone-200: #292524;
  --stone-300: #44403c;
  --stone-400: #57534e;
  --stone-500: #78716c;
  --stone-600: #a8a29e;
  --stone-700: #d6d3d1;
  --stone-800: #e7e5e4;
  --stone-900: #f5f5f4;
  --stone-950: #fafaf9;
}
```

### Hero Color Usage

```css
/* Text Colors */
.hero-text-colors {
  /* Primary Text */
  .text-primary { @apply text-white; }
  .text-primary-dark { @apply text-stone-900; }
  
  /* Secondary Text */
  .text-secondary { @apply text-stone-200; }
  .text-secondary-dark { @apply text-stone-700; }
  
  /* Muted Text */
  .text-muted { @apply text-stone-300; }
  .text-muted-dark { @apply text-stone-600; }
  
  /* Accent Text */
  .text-accent { @apply text-stone-400; }
  .text-accent-dark { @apply text-stone-500; }
}

/* Background Colors */
.hero-background-colors {
  /* Light Backgrounds */
  .bg-hero-light { @apply bg-gradient-to-br from-stone-50 via-white to-stone-100; }
  
  /* Dark Backgrounds */
  .bg-hero-dark { @apply bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800; }
  
  /* Overlay Backgrounds */
  .bg-hero-overlay { @apply bg-stone-900/80; }
  .bg-hero-overlay-light { @apply bg-stone-900/60; }
  .bg-hero-overlay-dark { @apply bg-stone-900/40; }
}
```

## Animation Guidelines

### Entrance Animations

```css
/* Fade In Up Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Staggered Animation Delays */
.hero-animations {
  .animate-appear { @apply animate-fadeInUp; }
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
  .delay-700 { animation-delay: 700ms; }
}
```

### Performance Optimizations

```css
/* Animation Performance */
.hero-performance {
  /* Use transform and opacity for smooth animations */
  .animate-smooth {
    will-change: transform, opacity;
  }
  
  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .animate-smooth {
      animation: none;
      transform: none;
    }
  }
}
```

## Responsive Breakpoints

### Breakpoint System

```css
/* Tailwind Breakpoints */
.hero-breakpoints {
  /* Mobile First */
  .mobile { @apply text-4xl; }
  
  /* Small (640px+) */
  .sm { @apply sm:text-6xl; }
  
  /* Medium (768px+) */
  .md { @apply md:text-8xl; }
  
  /* Large (1024px+) */
  .lg { @apply lg:text-9xl; }
  
  /* Extra Large (1280px+) */
  .xl { @apply xl:text-10xl; }
}
```

### Container Sizes

```css
/* Container System */
.hero-containers {
  /* Max Width Container */
  .max-w-container { @apply max-w-7xl; }
  
  /* Content Container */
  .max-w-content { @apply max-w-4xl; }
  
  /* Text Container */
  .max-w-text { @apply max-w-3xl; }
  
  /* Button Container */
  .max-w-buttons { @apply max-w-2xl; }
}
```

## Design Tokens

### CSS Custom Properties

```css
/* Hero Design Tokens */
:root {
  /* Typography */
  --hero-title-size: 4rem;
  --hero-title-size-sm: 6rem;
  --hero-title-size-md: 8rem;
  
  /* Spacing */
  --hero-padding-y: 3rem;
  --hero-padding-y-md: 4rem;
  --hero-gap: 1.5rem;
  --hero-gap-sm: 3rem;
  
  /* Colors */
  --hero-bg-gradient: linear-gradient(135deg, #fafaf9 0%, #ffffff 50%, #f5f5f4 100%);
  --hero-text-primary: #ffffff;
  --hero-text-secondary: #e7e5e4;
  
  /* Animations */
  --hero-duration: 0.8s;
  --hero-delay: 0.2s;
  --hero-ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Usage Examples

```css
/* Using Design Tokens */
.hero-custom {
  font-size: var(--hero-title-size);
  padding: var(--hero-padding-y) 0;
  background: var(--hero-bg-gradient);
  color: var(--hero-text-primary);
  transition: all var(--hero-duration) var(--hero-ease);
}
```

## Accessibility Standards

### Color Contrast

```css
/* WCAG AA Compliant Contrast Ratios */
.hero-contrast {
  /* Primary text on dark background */
  .text-primary-dark-bg {
    color: #ffffff; /* 21:1 contrast ratio */
  }
  
  /* Secondary text on dark background */
  .text-secondary-dark-bg {
    color: #e7e5e4; /* 4.5:1 contrast ratio */
  }
  
  /* Primary text on light background */
  .text-primary-light-bg {
    color: #1c1917; /* 21:1 contrast ratio */
  }
}
```

### Focus States

```css
/* Focus Indicators */
.hero-focus {
  .focus-visible {
    @apply outline-2 outline-offset-2 outline-stone-500;
  }
  
  .focus-ring {
    @apply ring-2 ring-stone-500 ring-offset-2;
  }
}
```

---

*This document is part of the Hero Components Documentation system.*
*Last updated: January 2025*
