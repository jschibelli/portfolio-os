/**
 * Design Tokens for Hero Spacing System
 * Provides consistent spacing values for all hero components
 * 
 * This module centralizes all hero spacing values to ensure consistency
 * across the application and make future updates easier to manage.
 * 
 * @fileoverview Hero spacing design tokens and utility functions
 * @author Hero Spacing System
 * @version 1.0.0
 */

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

// Type definitions for better TypeScript support
export type HeroSpacingVariant = keyof typeof heroSpacing;
export type HeroSpacingSize = 'small' | 'medium' | 'large';
export type HeroSpacingVariantType = 'default' | 'compact' | 'large';

// Typography presets (stub exports for backwards compatibility with UI components)
export interface TypographyPreset {
  fontSize: string;
  lineHeight: string;
  fontWeight: string | number;
  letterSpacing?: string;
}

export const typographyPresets = {
  'hero-xl': { fontSize: '4.5rem', lineHeight: '1.1', fontWeight: '800' },
  'hero-lg': { fontSize: '3.75rem', lineHeight: '1.15', fontWeight: '700' },
  'hero-md': { fontSize: '3rem', lineHeight: '1.2', fontWeight: '700' },
  'section-title': { fontSize: '2.25rem', lineHeight: '1.25', fontWeight: '600' },
  'card-title': { fontSize: '1.5rem', lineHeight: '1.3', fontWeight: '600' },
} as const;

export const heroTypography = typographyPresets;
export const sectionTypography = typographyPresets;
export const cardTypography = typographyPresets;