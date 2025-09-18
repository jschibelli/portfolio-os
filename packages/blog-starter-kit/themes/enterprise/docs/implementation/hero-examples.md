# Hero Component Implementation Examples

This document provides comprehensive examples for implementing different types of hero components across various use cases.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Advanced Examples](#advanced-examples)
- [Custom Styling](#custom-styling)
- [Animation Examples](#animation-examples)
- [Responsive Examples](#responsive-examples)
- [Accessibility Examples](#accessibility-examples)

## Basic Examples

### 1. Simple Default Hero

```tsx
import Hero from '@/components/features/sections/hero/default';

export default function LandingPage() {
  return (
    <Hero
      title="Welcome to Our Platform"
      description="Discover amazing features that will transform your workflow"
    />
  );
}
```

### 2. Hero with Call-to-Action Buttons

```tsx
import Hero from '@/components/features/sections/hero/default';
import { ArrowRightIcon, PlayIcon } from 'lucide-react';

export default function ProductPage() {
  return (
    <Hero
      title="Revolutionary Product"
      description="Experience the future of productivity with our cutting-edge solution"
      buttons={[
        {
          href: "/get-started",
          text: "Get Started",
          variant: "default",
          icon: <ArrowRightIcon className="mr-2 h-4 w-4" />
        },
        {
          href: "/demo",
          text: "Watch Demo",
          variant: "outline",
          icon: <PlayIcon className="mr-2 h-4 w-4" />
        }
      ]}
    />
  );
}
```

### 3. Hero with Badge and Mockup

```tsx
import Hero from '@/components/features/sections/hero/default';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon } from 'lucide-react';
import Screenshot from '@/components/ui/screenshot';

export default function ProductShowcase() {
  return (
    <Hero
      title="Next-Generation Platform"
      description="Built with modern technologies for maximum performance and scalability"
      badge={
        <Badge variant="outline" className="animate-appear">
          <span className="text-muted-foreground">New version available!</span>
          <a href="/updates" className="flex items-center gap-1">
            Learn more
            <ArrowRightIcon className="size-3" />
          </a>
        </Badge>
      }
      mockup={
        <Screenshot
          srcLight="/product-light.png"
          srcDark="/product-dark.png"
          alt="Product interface screenshot"
          width={1200}
          height={800}
          className="w-full"
        />
      }
    />
  );
}
```

## Advanced Examples

### 4. Homepage Hero with Custom Content

```tsx
import Hero from '@/components/features/homepage/hero';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      {/* Additional homepage content */}
    </div>
  );
}
```

### 5. Modern Hero with Intersection Observer

```tsx
import ModernHero from '@/components/features/homepage/modern-hero';

export default function ServicePage() {
  return (
    <ModernHero
      title="Professional Web Development"
      subtitle="Expert Solutions"
      description="Transform your digital presence with custom web applications built using modern technologies and best practices."
      ctaText="Start Your Project"
      ctaLink="/contact"
      imageUrl="/assets/service-hero.jpg"
    />
  );
}
```

### 6. Hero with Custom Background and Overlay

```tsx
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export default function CustomHero() {
  return (
    <section className="relative min-h-[600px] overflow-hidden">
      {/* Custom Background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/custom-hero-bg.jpg"
          alt="Custom hero background"
          fill
          className="object-cover"
          priority
        />
        {/* Custom Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/60 to-pink-900/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-6 md:text-7xl">
            Custom Hero Experience
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Create stunning hero sections with custom backgrounds and animations
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
```

## Custom Styling

### 7. Hero with Custom Theme

```tsx
import Hero from '@/components/features/sections/hero/default';
import { cn } from '@/lib/utils';

export default function ThemedHero() {
  return (
    <Hero
      title="Branded Experience"
      description="Custom styling that matches your brand identity"
      className={cn(
        // Custom background
        "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
        "dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950",
        // Custom spacing
        "py-20 md:py-32",
        // Custom text colors
        "text-blue-900 dark:text-blue-100"
      )}
    />
  );
}
```

### 8. Hero with Custom Typography

```tsx
import Hero from '@/components/features/sections/hero/default';

export default function TypographyHero() {
  return (
    <div className="hero-custom-typography">
      <Hero
        title="Custom Typography"
        description="Demonstrating custom font styling and spacing"
        className="
          [&_.hero-title]:font-serif
          [&_.hero-title]:tracking-wider
          [&_.hero-description]:text-lg
          [&_.hero-description]:leading-relaxed
        "
      />
    </div>
  );
}
```

## Animation Examples

### 9. Hero with Staggered Animations

```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, SparklesIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AnimatedHero() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <SparklesIcon className="mx-auto h-12 w-12 text-stone-600" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl font-bold text-stone-900 dark:text-stone-100 mb-6 md:text-7xl"
          >
            Animated Hero
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-stone-600 dark:text-stone-300 mb-8 max-w-2xl mx-auto"
          >
            Experience smooth, staggered animations that guide the user's attention
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex justify-center gap-4">
            <Button size="lg" className="group">
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

### 10. Hero with Scroll-Triggered Animations

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ScrollHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="h-full w-full bg-gradient-to-br from-blue-600 to-purple-600" />
      </motion.div>
      
      <div className="container relative z-10 mx-auto flex h-full items-center justify-center px-4">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6 md:text-8xl">
            Scroll Animation
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Watch as the hero transforms as you scroll down the page
          </p>
        </div>
      </div>
    </section>
  );
}
```

## Responsive Examples

### 11. Mobile-First Hero

```tsx
import Hero from '@/components/features/sections/hero/default';

export default function MobileHero() {
  return (
    <Hero
      title="Mobile Optimized"
      description="Designed with mobile-first principles for the best experience on all devices"
      className="
        // Mobile optimizations
        min-h-[400px] sm:min-h-[500px] md:min-h-[600px]
        py-8 sm:py-12 md:py-16 lg:py-20
        px-4 sm:px-6 md:px-8
      "
    />
  );
}
```

### 12. Hero with Responsive Images

```tsx
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ResponsiveImageHero() {
  return (
    <section className="relative min-h-[500px] overflow-hidden">
      {/* Responsive Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero-mobile.jpg"
          alt="Hero background"
          fill
          className="object-cover sm:hidden"
          priority
        />
        <Image
          src="/assets/hero-desktop.jpg"
          alt="Hero background"
          fill
          className="hidden object-cover sm:block"
          priority
        />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl text-center text-white"
        >
          <h1 className="text-4xl font-bold mb-6 sm:text-6xl md:text-7xl">
            Responsive Hero
          </h1>
          <p className="text-lg mb-8 sm:text-xl md:text-2xl">
            Optimized for every screen size
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

## Accessibility Examples

### 13. Accessible Hero with ARIA Labels

```tsx
import Hero from '@/components/features/sections/hero/default';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export default function AccessibleHero() {
  return (
    <Hero
      title="Accessible Design"
      description="Built with accessibility in mind for all users"
      buttons={[
        {
          href: "/accessible-features",
          text: "Explore Features",
          variant: "default",
          icon: <ArrowRightIcon className="mr-2 h-4 w-4" aria-hidden="true" />
        }
      ]}
      className="
        // Accessibility enhancements
        [&_h1]:focus:outline-2 [&_h1]:focus:outline-stone-500
        [&_button]:focus:ring-2 [&_button]:focus:ring-stone-500
      "
    />
  );
}
```

### 14. Hero with Reduced Motion Support

```tsx
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ReducedMotionHero() {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? { animate: { opacity: 1 } }
    : { 
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: 'easeOut' }
      };

  return (
    <section className="relative min-h-[500px] bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          {...animationProps}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-5xl font-bold text-stone-900 dark:text-stone-100 mb-6 md:text-7xl">
            Motion-Aware Hero
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-300 mb-8">
            Respects user motion preferences for inclusive design
          </p>
          <Button size="lg">
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
```

## Performance Examples

### 15. Optimized Hero with Lazy Loading

```tsx
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
const HeavyAnimation = lazy(() => import('./HeavyAnimation'));

export default function OptimizedHero() {
  return (
    <section className="relative min-h-[500px]">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-6 md:text-7xl">
            Performance Optimized
          </h1>
          <p className="text-xl mb-8">
            Lazy loading and code splitting for optimal performance
          </p>
          
          <Suspense fallback={<Skeleton className="h-12 w-48 mx-auto" />}>
            <HeavyAnimation />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
```

### 16. Hero with Image Optimization

```tsx
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function OptimizedImageHero() {
  return (
    <section className="relative min-h-[600px] overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero-optimized.webp"
          alt="Optimized hero background"
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl text-center text-white"
        >
          <h1 className="text-5xl font-bold mb-6 md:text-7xl">
            Optimized Performance
          </h1>
          <p className="text-xl mb-8">
            Fast loading with optimized images and efficient animations
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

## Best Practices Summary

1. **Performance**: Use Next.js Image component with proper optimization
2. **Accessibility**: Include proper ARIA labels and semantic HTML
3. **Responsive**: Design mobile-first with progressive enhancement
4. **Animations**: Respect user motion preferences
5. **SEO**: Use semantic HTML structure and proper heading hierarchy
6. **Loading**: Implement proper loading states and error handling

---

*This document provides comprehensive examples for implementing hero components across various use cases.*
*Last updated: January 2025*
