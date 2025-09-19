/**
 * Design Tokens for Hero Typography and Spacing System
 * 
 * This file defines consistent typography scales, breakpoints, spacing values,
 * and design tokens for all hero components across the application.
 * 
 * @fileoverview Combined hero typography and spacing design tokens
 * @author Hero Design System
 * @version 2.0.0
 */

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

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

// ============================================================================
// SPACING SYSTEM
// ============================================================================

// Constants for variant types to prevent typos and ensure consistency
export const HERO_VARIANTS = {
  SECTION: ['default', 'compact', 'large'] as const,
  CONTENT: ['default', 'compact', 'large'] as const,
  CONTAINER: ['default', 'narrow', 'wide'] as const,
  GAP: ['small', 'medium', 'large'] as const,
} as const;

// Constants for spacing values to avoid magic strings
export const SPACING_VALUES = {
  SECTION: {
    DEFAULT: 'py-16 md:py-20',
    COMPACT: 'py-12 md:py-16',
    LARGE: 'py-16 md:py-20 lg:py-24',
  },
  CONTENT: {
    DEFAULT: 'space-y-6 md:space-y-8',
    COMPACT: 'space-y-4 md:space-y-6',
    LARGE: 'space-y-8 md:space-y-10',
  },
  CONTAINER: {
    DEFAULT: 'container mx-auto px-4',
    NARROW: 'max-w-3xl mx-auto px-4',
    WIDE: 'max-w-6xl mx-auto px-4',
  },
  GAP: {
    SMALL: 'gap-4',
    MEDIUM: 'gap-6 md:gap-8',
    LARGE: 'gap-8 md:gap-12',
  },
} as const;

export const heroSpacing = {
  // Section-level spacing
  section: {
    padding: 'py-16 md:py-20',
    paddingTop: 'pt-16 md:pt-20',
    paddingBottom: 'pb-16 md:pb-20',
  },
  
  // Content spacing within hero sections
  content: {
    spacing: 'space-y-6 md:space-y-8',
    gap: 'gap-6 md:gap-8',
    gapLarge: 'gap-8 md:gap-12',
    gapSmall: 'gap-4 md:gap-6',
  },
  
  // Container standards
  container: {
    base: 'container mx-auto px-4',
    maxWidth: 'max-w-4xl mx-auto',
    maxWidthLarge: 'max-w-5xl mx-auto',
    maxWidthContainer: 'max-w-container mx-auto',
  },
  
  // Responsive spacing patterns
  responsive: {
    section: 'py-12 md:py-16 lg:py-20',
    content: 'space-y-4 md:space-y-6 lg:space-y-8',
    gap: 'gap-4 md:gap-6 lg:gap-8',
  },
  
  // Hero-specific spacing
  hero: {
    section: 'py-16 md:py-20',
    content: 'space-y-6 md:space-y-8',
    container: 'container mx-auto px-4',
    maxWidth: 'max-w-4xl mx-auto',
    gap: {
      small: 'gap-4',
      medium: 'gap-6 md:gap-8',
      large: 'gap-8 md:gap-12',
    },
  },
} as const;

/**
 * Enhanced error handling for hero spacing utilities
 * @param type - The type of spacing (section, content, container, gap)
 * @param value - The provided value
 * @param validValues - Array of valid values
 * @returns Formatted error message
 */
function createValidationError(type: string, value: string, validValues: readonly string[]): string {
  return `Invalid ${type} variant: "${value}". Valid options are: ${validValues.join(', ')}. Using default.`;
}

/**
 * Validates and returns spacing values with enhanced error handling
 * @param variant - The spacing variant to validate
 * @param type - The type of spacing (section, content, container, gap)
 * @param validVariants - Array of valid variants
 * @param spacingMap - Map of variant to spacing value
 * @returns The validated spacing value
 */
function validateAndGetSpacing<T extends string>(
  variant: T,
  type: string,
  validVariants: readonly T[],
  spacingMap: Record<T, string>
): string {
  if (!validVariants.includes(variant)) {
    const errorMessage = createValidationError(type, variant as string, validVariants);
    console.warn(`[HeroSpacing] ${errorMessage}`);
    return spacingMap[validVariants[0] as T];
  }
  return spacingMap[variant];
}

/**
 * Hero spacing utility functions with enhanced validation and error handling
 * 
 * These functions provide type-safe access to hero spacing values with comprehensive
 * validation and informative error messages for debugging.
 * 
 * @example
 * ```typescript
 * const sectionClass = getHeroSpacing.section('compact');
 * const contentClass = getHeroSpacing.content('large');
 * ```
 */
export const getHeroSpacing = {
  /**
   * Get section spacing classes based on variant
   * @param variant - Section spacing variant
   * @returns Tailwind CSS classes for section spacing
   */
  section: (variant: 'default' | 'compact' | 'large' = 'default') => {
    const spacingMap = {
      default: SPACING_VALUES.SECTION.DEFAULT,
      compact: SPACING_VALUES.SECTION.COMPACT,
      large: SPACING_VALUES.SECTION.LARGE,
    } as const;
    
    return validateAndGetSpacing(variant, 'section', HERO_VARIANTS.SECTION, spacingMap);
  },
  
  /**
   * Get content spacing classes based on variant
   * @param variant - Content spacing variant
   * @returns Tailwind CSS classes for content spacing
   */
  content: (variant: 'default' | 'compact' | 'large' = 'default') => {
    const spacingMap = {
      default: SPACING_VALUES.CONTENT.DEFAULT,
      compact: SPACING_VALUES.CONTENT.COMPACT,
      large: SPACING_VALUES.CONTENT.LARGE,
    } as const;
    
    return validateAndGetSpacing(variant, 'content', HERO_VARIANTS.CONTENT, spacingMap);
  },
  
  /**
   * Get container spacing classes based on variant
   * @param variant - Container spacing variant
   * @returns Tailwind CSS classes for container spacing
   */
  container: (variant: 'default' | 'narrow' | 'wide' = 'default') => {
    const spacingMap = {
      default: SPACING_VALUES.CONTAINER.DEFAULT,
      narrow: SPACING_VALUES.CONTAINER.NARROW,
      wide: SPACING_VALUES.CONTAINER.WIDE,
    } as const;
    
    return validateAndGetSpacing(variant, 'container', HERO_VARIANTS.CONTAINER, spacingMap);
  },
  
  /**
   * Get gap spacing classes based on size
   * @param size - Gap spacing size
   * @returns Tailwind CSS classes for gap spacing
   */
  gap: (size: 'small' | 'medium' | 'large' = 'medium') => {
    const spacingMap = {
      small: SPACING_VALUES.GAP.SMALL,
      medium: SPACING_VALUES.GAP.MEDIUM,
      large: SPACING_VALUES.GAP.LARGE,
    } as const;
    
    return validateAndGetSpacing(size, 'gap', HERO_VARIANTS.GAP, spacingMap);
  },
};

/**
 * CSS Custom Properties for Hero Spacing
 * 
 * These CSS custom properties provide an alternative to Tailwind utility classes
 * for scenarios where you need:
 * - Dynamic theming support
 * - CSS-in-JS integration
 * - Runtime value manipulation
 * - Cross-framework compatibility
 * 
 * Usage:
 * ```css
 * .hero-section {
 *   padding: var(--hero-section-padding);
 * }
 * ```
 * 
 * Or in CSS-in-JS:
 * ```javascript
 * const styles = {
 *   padding: heroSpacingCSS['--hero-section-padding']
 * };
 * ```
 * 
 * Note: These are separate from the utility functions above and serve different purposes.
 * Use utility functions for Tailwind-based components, use CSS custom properties for
 * custom CSS or CSS-in-JS scenarios.
 */
export const heroSpacingCSS = {
  '--hero-section-padding': '4rem',
  '--hero-section-padding-md': '5rem',
  '--hero-content-spacing': '1.5rem',
  '--hero-content-spacing-md': '2rem',
  '--hero-container-padding': '1rem',
  '--hero-gap-small': '1rem',
  '--hero-gap-medium': '1.5rem',
  '--hero-gap-large': '2rem',
} as const;

/**
 * Theme configuration interface for dynamic theming support
 * @interface HeroTheme
 */
export interface HeroTheme {
  section?: {
    default?: string;
    compact?: string;
    large?: string;
  };
  content?: {
    default?: string;
    compact?: string;
    large?: string;
  };
  container?: {
    default?: string;
    narrow?: string;
    wide?: string;
  };
  gap?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

/**
 * Creates a themed version of hero spacing utilities
 * @param theme - Custom theme configuration
 * @returns Themed spacing utilities
 * 
 * @example
 * ```typescript
 * const customTheme = {
 *   section: {
 *     default: 'py-20 md:py-24',
 *     compact: 'py-16 md:py-20'
 *   }
 * };
 * const themedSpacing = createThemedHeroSpacing(customTheme);
 * ```
 */
export function createThemedHeroSpacing(theme: HeroTheme) {
  return {
    section: (variant: 'default' | 'compact' | 'large' = 'default') => {
      const customValue = theme.section?.[variant];
      return customValue || getHeroSpacing.section(variant);
    },
    content: (variant: 'default' | 'compact' | 'large' = 'default') => {
      const customValue = theme.content?.[variant];
      return customValue || getHeroSpacing.content(variant);
    },
    container: (variant: 'default' | 'narrow' | 'wide' = 'default') => {
      const customValue = theme.container?.[variant];
      return customValue || getHeroSpacing.container(variant);
    },
    gap: (size: 'small' | 'medium' | 'large' = 'medium') => {
      const customValue = theme.gap?.[size];
      return customValue || getHeroSpacing.gap(size);
    },
  };
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Typography types
export type Breakpoint = keyof typeof breakpoints;
export type TypographyScale = keyof typeof typographyScale;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type TypographyPreset = keyof typeof typographyPresets;

// Spacing types
export type HeroSpacingVariant = keyof typeof heroSpacing;
export type HeroSpacingSize = 'small' | 'medium' | 'large';
export type HeroSpacingVariantType = 'default' | 'compact' | 'large';
