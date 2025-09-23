# Hero Component Troubleshooting Guide

This comprehensive troubleshooting guide helps you identify and resolve common issues with hero components, ensuring optimal performance and user experience.

## Table of Contents

- [Common Issues](#common-issues)
- [Performance Problems](#performance-problems)
- [Accessibility Issues](#accessibility-issues)
- [Responsive Design Issues](#responsive-design-issues)
- [Animation Problems](#animation-problems)
- [Browser Compatibility](#browser-compatibility)
- [Debug Tools](#debug-tools)
- [Prevention Strategies](#prevention-strategies)

## Common Issues

### 1. Images Not Loading

**Symptoms**:
- Hero background images don't appear
- Broken image icons displayed
- Slow loading or timeouts

**Causes & Solutions**:

#### Incorrect Image Paths
```tsx
// ❌ Wrong - relative path issues
<Image src="./hero-bg.jpg" alt="Hero background" />

// ✅ Correct - absolute path from public directory
<Image src="/assets/hero/hero-bg.jpg" alt="Hero background" />
```

#### Missing Image Optimization
```tsx
// ❌ Wrong - no optimization
<img src="/hero-bg.jpg" alt="Hero background" />

// ✅ Correct - Next.js Image optimization
<Image
  src="/hero-bg.jpg"
  alt="Hero background"
  fill
  className="object-cover"
  priority
  quality={85}
/>
```

#### File Size Issues
```bash
# Check image file sizes
ls -la public/assets/hero/

# Optimize large images
npx @squoosh/cli --webp public/assets/hero/hero-bg.jpg
```

### 2. Animations Not Working

**Symptoms**:
- No entrance animations
- Stuttering or choppy animations
- Animations not triggering

**Causes & Solutions**:

#### Missing Framer Motion
```tsx
// ❌ Wrong - missing import
export default function Hero() {
  return <motion.div>Content</motion.div>;
}

// ✅ Correct - proper import
import { motion } from 'framer-motion';

export default function Hero() {
  return <motion.div>Content</motion.div>;
}
```

#### Animation Performance Issues
```tsx
// ❌ Wrong - heavy animations
<motion.div
  animate={{
    x: [0, 100, 0],
    y: [0, 100, 0],
    rotate: [0, 360, 0],
    scale: [1, 2, 1]
  }}
  transition={{ duration: 2, repeat: Infinity }}
>
  Content
</motion.div>

// ✅ Correct - optimized animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  Content
</motion.div>
```

#### Intersection Observer Issues
```tsx
// ❌ Wrong - observer not properly configured
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    // Missing threshold and rootMargin
  });
}, []);

// ✅ Correct - proper observer setup
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );
}, []);
```

### 3. Responsive Design Issues

**Symptoms**:
- Text too small on mobile
- Buttons not touch-friendly
- Layout breaks on certain screen sizes

**Causes & Solutions**:

#### Missing Responsive Classes
```tsx
// ❌ Wrong - fixed sizes
<h1 className="text-6xl font-bold">Title</h1>

// ✅ Correct - responsive typography
<h1 className="text-4xl font-bold sm:text-6xl md:text-8xl">Title</h1>
```

#### Touch Target Issues
```tsx
// ❌ Wrong - too small touch targets
<button className="px-2 py-1">Button</button>

// ✅ Correct - proper touch targets
<button className="min-h-[44px] min-w-[44px] px-4 py-2">Button</button>
```

#### Container Issues
```tsx
// ❌ Wrong - no responsive container
<div className="w-full max-w-4xl">Content</div>

// ✅ Correct - responsive container
<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">Content</div>
```

## Performance Problems

### 1. Slow Loading Times

**Diagnosis**:
```bash
# Check bundle size
npm run build
npm run analyze

# Check image sizes
du -sh public/assets/hero/
```

**Solutions**:

#### Image Optimization
```tsx
// Use WebP format
<Image
  src="/hero-bg.webp"
  alt="Hero background"
  fill
  className="object-cover"
  priority
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
/>
```

#### Code Splitting
```tsx
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyAnimation = lazy(() => import('./HeavyAnimation'));

export default function Hero() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyAnimation />
    </Suspense>
  );
}
```

#### Bundle Optimization
```tsx
// Import only needed functions
import { motion } from 'framer-motion';

// Instead of
import * as FramerMotion from 'framer-motion';
```

### 2. Animation Performance Issues

**Symptoms**:
- Choppy animations
- High CPU usage
- Frame drops

**Solutions**:

#### Hardware Acceleration
```css
/* Enable hardware acceleration */
.hero-animation {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

#### Optimize Animation Properties
```tsx
// Use transform and opacity only
const optimizedAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Avoid animating layout properties
const badAnimation = {
  initial: { width: 0 },
  animate: { width: '100%' }
};
```

#### Reduce Animation Complexity
```tsx
// Simple, performant animations
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### 3. Memory Leaks

**Symptoms**:
- Increasing memory usage
- Performance degradation over time
- Browser crashes

**Solutions**:

#### Cleanup Event Listeners
```tsx
useEffect(() => {
  const handleScroll = () => {
    // Scroll handling
  };

  window.addEventListener('scroll', handleScroll);
  
  // Cleanup
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

#### Cleanup Animations
```tsx
useEffect(() => {
  const animation = animate(element, { opacity: 1 });
  
  return () => {
    animation.stop();
  };
}, []);
```

## Accessibility Issues

### 1. Keyboard Navigation Problems

**Symptoms**:
- Can't navigate with keyboard
- Focus indicators missing
- Tab order incorrect

**Solutions**:

#### Focus Management
```tsx
// Ensure focusable elements
<button
  className="hero-button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Button
</button>
```

#### Focus Indicators
```css
/* Visible focus indicators */
.hero-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### 2. Screen Reader Issues

**Symptoms**:
- Content not announced
- Missing context
- Confusing navigation

**Solutions**:

#### Semantic HTML
```tsx
// Use proper semantic elements
<section role="banner" aria-labelledby="hero-title">
  <h1 id="hero-title">Hero Title</h1>
  <p>Hero description</p>
  <nav aria-label="Hero actions">
    <a href="/cta">Call to Action</a>
  </nav>
</section>
```

#### ARIA Labels
```tsx
<button
  aria-label="Start your project journey"
  aria-describedby="hero-description"
>
  Get Started
</button>
```

### 3. Color Contrast Issues

**Symptoms**:
- Text hard to read
- Insufficient contrast
- Accessibility violations

**Solutions**:

#### Check Contrast Ratios
```css
/* Ensure 4.5:1 contrast ratio */
.hero-text {
  color: #ffffff; /* White text */
  background: #1a1a1a; /* Dark background */
}

/* Large text needs 3:1 ratio */
.hero-title {
  color: #ffffff;
  background: #2a2a2a;
}
```

#### Color Independence
```tsx
// Don't rely solely on color
<button className="hero-button">
  <span className="text">Action Required</span>
  <span className="icon" aria-hidden="true">⚠️</span>
</button>
```

## Responsive Design Issues

### 1. Mobile Layout Problems

**Symptoms**:
- Text too small
- Buttons not touch-friendly
- Layout breaks

**Solutions**:

#### Mobile-First Design
```tsx
// Start with mobile styles
<div className="hero-container py-8 px-4">
  <h1 className="text-3xl font-bold sm:text-5xl md:text-7xl">
    Responsive Title
  </h1>
</div>
```

#### Touch-Friendly Targets
```tsx
// Minimum 44px touch targets
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Touch Target
</button>
```

### 2. Tablet Layout Issues

**Symptoms**:
- Awkward spacing
- Text sizing issues
- Button layout problems

**Solutions**:

#### Tablet-Specific Styles
```tsx
<div className="hero-container py-12 px-6 md:py-16 md:px-8">
  <h1 className="text-4xl font-bold md:text-6xl lg:text-8xl">
    Tablet Optimized
  </h1>
</div>
```

## Animation Problems

### 1. Animations Not Triggering

**Symptoms**:
- No entrance animations
- Staggered animations not working
- Intersection observer issues

**Solutions**:

#### Check Animation Setup
```tsx
// Ensure proper animation setup
const animationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

<motion.div {...animationVariants}>
  Content
</motion.div>
```

#### Intersection Observer Debug
```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      console.log('Intersection:', entry.isIntersecting); // Debug log
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { threshold: 0.1 }
  );

  const element = document.querySelector('.hero-container');
  if (element) {
    observer.observe(element);
  }

  return () => observer.disconnect();
}, []);
```

### 2. Animation Performance Issues

**Symptoms**:
- Choppy animations
- High CPU usage
- Frame drops

**Solutions**:

#### Use Hardware Acceleration
```css
.hero-animation {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

#### Optimize Animation Properties
```tsx
// Use transform and opacity only
const optimizedAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};
```

## Browser Compatibility

### 1. Internet Explorer Issues

**Symptoms**:
- Layout breaks
- Animations not working
- JavaScript errors

**Solutions**:

#### Polyfills
```tsx
// Add polyfills for IE
import 'intersection-observer';
import 'resize-observer-polyfill';
```

#### Graceful Degradation
```tsx
// Check for feature support
const supportsIntersectionObserver = 'IntersectionObserver' in window;

if (supportsIntersectionObserver) {
  // Use intersection observer
} else {
  // Fallback to immediate animation
}
```

### 2. Safari Issues

**Symptoms**:
- CSS Grid problems
- Animation issues
- Touch events not working

**Solutions**:

#### Safari-Specific Fixes
```css
/* Safari CSS Grid fixes */
.hero-grid {
  display: -webkit-grid;
  display: grid;
  -webkit-grid-template-columns: 1fr;
  grid-template-columns: 1fr;
}
```

#### Touch Event Handling
```tsx
// Handle Safari touch events
const handleTouch = (e) => {
  e.preventDefault();
  // Touch handling
};

<div
  onTouchStart={handleTouch}
  onTouchMove={handleTouch}
  onTouchEnd={handleTouch}
>
  Touch content
</div>
```

## Debug Tools

### 1. Browser DevTools

**Performance Tab**:
- Monitor Core Web Vitals
- Check animation performance
- Identify bottlenecks

**Accessibility Tab**:
- Run accessibility audits
- Check color contrast
- Validate ARIA labels

### 2. React DevTools

**Component Tree**:
- Inspect component props
- Check state changes
- Debug re-renders

### 3. Custom Debug Components

```tsx
// Debug component for development
export const HeroDebug = ({ children, ...props }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Hero Debug:', props);
  }
  
  return <div className="hero-debug">{children}</div>;
};
```

### 4. Performance Monitoring

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

## Prevention Strategies

### 1. Code Quality

**TypeScript**:
```tsx
// Use strict typing
interface HeroProps {
  title: string;
  description: string;
  buttons?: HeroButtonProps[];
}

// Validate props
const Hero = ({ title, description, buttons = [] }: HeroProps) => {
  if (!title) {
    console.warn('Hero component missing title');
  }
  
  return (
    <section className="hero">
      <h1>{title}</h1>
      <p>{description}</p>
      {buttons.map((button, index) => (
        <button key={index} {...button}>
          {button.text}
        </button>
      ))}
    </section>
  );
};
```

### 2. Testing

**Unit Tests**:
```tsx
import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero Component', () => {
  it('renders without errors', () => {
    render(<Hero title="Test" description="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

**Accessibility Tests**:
```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Hero title="Test" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 3. Performance Monitoring

**Regular Audits**:
- Monitor Core Web Vitals
- Check bundle size
- Test animation performance
- Validate accessibility

**Automated Testing**:
```tsx
// Performance test
describe('Hero Performance', () => {
  it('loads within acceptable time', async () => {
    const start = performance.now();
    render(<Hero title="Test" />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100); // 100ms threshold
  });
});
```

---

*This troubleshooting guide helps identify and resolve common hero component issues for optimal performance and user experience.*
*Last updated: January 2025*
