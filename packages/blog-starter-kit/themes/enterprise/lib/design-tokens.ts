/**
 * Design Tokens for Hero Typography System
 * 
 * This file defines consistent typography scales, breakpoints, and design tokens
 * for all hero components across the application.
 */

// Breakpoint definitions
export const breakpoints = {
  mobile: '0px',
  tablet: '640px',   // sm
  desktop: '768px',  // md
  large: '1024px',   // lg
  xlarge: '1280px',  // xl
} as const;

// Typography scale values
export const typographyScale = {
  // Hero title scale
  heroTitle: {
    mobile: 'text-4xl',
    tablet: 'sm:text-5xl',
    desktop: 'md:text-6xl',
    large: 'lg:text-7xl',
    xlarge: 'xl:text-8xl',
  },
  
  // Hero subtitle scale
  heroSubtitle: {
    mobile: 'text-lg',
    tablet: 'sm:text-xl',
    desktop: 'md:text-2xl',
    large: 'lg:text-3xl',
  },
  
  // Hero description scale
  heroDescription: {
    mobile: 'text-base',
    tablet: 'sm:text-lg',
    desktop: 'md:text-xl',
    large: 'lg:text-2xl',
  },
  
  // Section heading scale
  sectionHeading: {
    mobile: 'text-2xl',
    tablet: 'sm:text-3xl',
    desktop: 'md:text-4xl',
    large: 'lg:text-5xl',
  },
  
  // Card title scale
  cardTitle: {
    mobile: 'text-lg',
    tablet: 'sm:text-xl',
    desktop: 'md:text-2xl',
  },
} as const;

// Font weight standards
export const fontWeights = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
} as const;

// Line height ratios
export const lineHeights = {
  tight: 'leading-tight',      // 1.25
  snug: 'leading-snug',        // 1.375
  normal: 'leading-normal',    // 1.5
  relaxed: 'leading-relaxed',  // 1.625
  loose: 'leading-loose',      // 2
} as const;

// Letter spacing standards
export const letterSpacing = {
  tighter: 'tracking-tighter',  // -0.05em
  tight: 'tracking-tight',      // -0.025em
  normal: 'tracking-normal',   // 0em
  wide: 'tracking-wide',        // 0.025em
  wider: 'tracking-wider',      // 0.05em
  widest: 'tracking-widest',    // 0.1em
} as const;

// Hero typography system configuration
export const heroTypography = {
  title: {
    mobile: 'text-4xl font-bold leading-tight tracking-tight',
    tablet: 'sm:text-5xl sm:leading-tight sm:tracking-tight',
    desktop: 'md:text-6xl md:leading-tight md:tracking-tight',
    large: 'lg:text-7xl lg:leading-tight lg:tracking-tight',
    xlarge: 'xl:text-8xl xl:leading-tight xl:tracking-tight',
  },
  subtitle: {
    mobile: 'text-lg font-semibold leading-relaxed tracking-normal',
    tablet: 'sm:text-xl sm:leading-relaxed sm:tracking-normal',
    desktop: 'md:text-2xl md:leading-relaxed md:tracking-normal',
    large: 'lg:text-3xl lg:leading-relaxed lg:tracking-normal',
  },
  description: {
    mobile: 'text-base font-medium leading-relaxed tracking-normal',
    tablet: 'sm:text-lg sm:leading-relaxed sm:tracking-normal',
    desktop: 'md:text-xl md:leading-relaxed md:tracking-normal',
    large: 'lg:text-2xl lg:leading-relaxed lg:tracking-normal',
  },
} as const;

// Section typography system
export const sectionTypography = {
  heading: {
    mobile: 'text-2xl font-bold leading-tight tracking-tight',
    tablet: 'sm:text-3xl sm:leading-tight sm:tracking-tight',
    desktop: 'md:text-4xl md:leading-tight md:tracking-tight',
    large: 'lg:text-5xl lg:leading-tight lg:tracking-tight',
  },
  subheading: {
    mobile: 'text-lg font-semibold leading-snug tracking-normal',
    tablet: 'sm:text-xl sm:leading-snug sm:tracking-normal',
    desktop: 'md:text-2xl md:leading-snug md:tracking-normal',
  },
  body: {
    mobile: 'text-base font-normal leading-relaxed tracking-normal',
    tablet: 'sm:text-lg sm:leading-relaxed sm:tracking-normal',
    desktop: 'md:text-xl md:leading-relaxed md:tracking-normal',
  },
} as const;

// Card typography system
export const cardTypography = {
  title: {
    mobile: 'text-lg font-semibold leading-snug tracking-normal',
    tablet: 'sm:text-xl sm:leading-snug sm:tracking-normal',
    desktop: 'md:text-2xl md:leading-snug md:tracking-normal',
  },
  subtitle: {
    mobile: 'text-sm font-medium leading-normal tracking-normal',
    tablet: 'sm:text-base sm:leading-normal sm:tracking-normal',
    desktop: 'md:text-lg md:leading-normal md:tracking-normal',
  },
  description: {
    mobile: 'text-sm font-normal leading-relaxed tracking-normal',
    tablet: 'sm:text-base sm:leading-relaxed sm:tracking-normal',
    desktop: 'md:text-lg md:leading-relaxed md:tracking-normal',
  },
} as const;

// Utility function to combine typography classes
export function combineTypographyClasses(
  base: string,
  responsive: Record<string, string>
): string {
  const responsiveClasses = Object.entries(responsive)
    .map(([breakpoint, classes]) => `${breakpoint}:${classes}`)
    .join(' ');
  
  return `${base} ${responsiveClasses}`.trim();
}

// Pre-built typography combinations for common use cases
export const typographyPresets = {
  heroTitle: combineTypographyClasses(
    heroTypography.title.mobile,
    {
      'sm': heroTypography.title.tablet.split(' ').slice(1).join(' '),
      'md': heroTypography.title.desktop.split(' ').slice(1).join(' '),
      'lg': heroTypography.title.large.split(' ').slice(1).join(' '),
      'xl': heroTypography.title.xlarge.split(' ').slice(1).join(' '),
    }
  ),
  
  heroSubtitle: combineTypographyClasses(
    heroTypography.subtitle.mobile,
    {
      'sm': heroTypography.subtitle.tablet.split(' ').slice(1).join(' '),
      'md': heroTypography.subtitle.desktop.split(' ').slice(1).join(' '),
      'lg': heroTypography.subtitle.large.split(' ').slice(1).join(' '),
    }
  ),
  
  heroDescription: combineTypographyClasses(
    heroTypography.description.mobile,
    {
      'sm': heroTypography.description.tablet.split(' ').slice(1).join(' '),
      'md': heroTypography.description.desktop.split(' ').slice(1).join(' '),
      'lg': heroTypography.description.large.split(' ').slice(1).join(' '),
    }
  ),
  
  sectionHeading: combineTypographyClasses(
    sectionTypography.heading.mobile,
    {
      'sm': sectionTypography.heading.tablet.split(' ').slice(1).join(' '),
      'md': sectionTypography.heading.desktop.split(' ').slice(1).join(' '),
      'lg': sectionTypography.heading.large.split(' ').slice(1).join(' '),
    }
  ),
  
  cardTitle: combineTypographyClasses(
    cardTypography.title.mobile,
    {
      'sm': cardTypography.title.tablet.split(' ').slice(1).join(' '),
      'md': cardTypography.title.desktop.split(' ').slice(1).join(' '),
    }
  ),
} as const;

// Type definitions for better TypeScript support
export type Breakpoint = keyof typeof breakpoints;
export type TypographyScale = keyof typeof typographyScale;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type TypographyPreset = keyof typeof typographyPresets;
