import { ReactNode } from 'react';

/**
 * Base hero component props interface
 */
export interface BaseHeroProps {
  /** Unique identifier for the hero component */
  id?: string;
  /** Additional CSS classes */
  className?: string;
  /** Children components */
  children?: ReactNode;
  /** Accessibility label */
  'aria-label'?: string;
}

/**
 * Hero content interface for text content
 */
export interface HeroContent {
  /** Main headline text */
  title: string;
  /** Subtitle or tagline */
  subtitle?: string;
  /** Description paragraph */
  description?: string;
  /** Author or person name */
  authorName?: string;
  /** Professional title or role */
  professionalTitle?: string;
}

/**
 * Call-to-action button interface
 */
export interface HeroCTA {
  /** Button text */
  text: string;
  /** Button link URL */
  href: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'default' | 'sm' | 'md' | 'lg' | 'icon';
  /** Accessibility label */
  'aria-label'?: string;
  /** Icon component */
  icon?: ReactNode;
}

/**
 * Hero image interface
 */
export interface HeroImage {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Image quality (0-100) */
  quality?: number;
  /** Priority loading */
  priority?: boolean;
  /** Placeholder blur data URL */
  blurDataURL?: string;
  /** Responsive sizes */
  sizes?: string;
}

/**
 * Animation configuration interface
 */
export interface HeroAnimation {
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation easing function */
  ease?: string;
  /** Enable/disable animations */
  enabled?: boolean;
}

/**
 * Modern hero component props
 */
export interface ModernHeroProps extends BaseHeroProps {
  /** Hero content */
  content: HeroContent;
  /** Primary call-to-action */
  primaryCTA?: HeroCTA;
  /** Secondary call-to-action */
  secondaryCTA?: HeroCTA;
  /** Background image */
  backgroundImage?: HeroImage;
  /** Animation configuration */
  animation?: HeroAnimation;
  /** Enable intersection observer */
  enableIntersectionObserver?: boolean;
}

/**
 * Classic hero component props
 */
export interface ClassicHeroProps extends BaseHeroProps {
  /** Hero content */
  content: HeroContent;
  /** Call-to-action buttons */
  ctas?: HeroCTA[];
  /** Background image */
  backgroundImage?: HeroImage;
  /** Animation configuration */
  animation?: HeroAnimation;
  /** Enable gradient overlay */
  enableGradientOverlay?: boolean;
}

/**
 * Hero section variant types
 */
export type HeroVariant = 'modern' | 'classic' | 'minimal' | 'fullscreen' | 'split';

/**
 * Responsive breakpoint configuration
 */
export interface HeroBreakpoints {
  /** Mobile breakpoint (default: 640px) */
  mobile?: number;
  /** Tablet breakpoint (default: 768px) */
  tablet?: number;
  /** Desktop breakpoint (default: 1024px) */
  desktop?: number;
  /** Large desktop breakpoint (default: 1280px) */
  large?: number;
}

/**
 * Hero component configuration
 */
export interface HeroConfig {
  /** Component variant */
  variant: HeroVariant;
  /** Responsive breakpoints */
  breakpoints?: HeroBreakpoints;
  /** Default animation settings */
  defaultAnimation?: HeroAnimation;
  /** Enable accessibility features */
  enableAccessibility?: boolean;
  /** Enable performance optimizations */
  enablePerformanceOptimizations?: boolean;
}

/**
 * Hero component state interface
 */
export interface HeroState {
  /** Whether component is visible */
  isVisible: boolean;
  /** Whether animations are complete */
  animationsComplete: boolean;
  /** Current viewport size */
  viewportSize: 'mobile' | 'tablet' | 'desktop' | 'large';
  /** Loading state */
  isLoading: boolean;
}

/**
 * Hero component ref interface
 */
export interface HeroRef {
  /** Scroll to hero section */
  scrollToHero: () => void;
  /** Trigger animations */
  triggerAnimations: () => void;
  /** Reset animations */
  resetAnimations: () => void;
  /** Get current state */
  getState: () => HeroState;
}
