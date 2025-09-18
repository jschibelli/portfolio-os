/**
 * Design Tokens for Hero Spacing System
 * Provides consistent spacing values for all hero components
 * 
 * This module centralizes all hero spacing values to ensure consistency
 * across the application and make future updates easier to manage.
 */

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
 * Hero spacing utility functions with validation
 * 
 * @param variant - The spacing variant to use
 * @returns The corresponding spacing classes
 * @throws Error if invalid variant is provided
 */
export const getHeroSpacing = {
  section: (variant: 'default' | 'compact' | 'large' = 'default') => {
    const variants = {
      default: heroSpacing.hero.section,
      compact: 'py-12 md:py-16',
      large: 'py-16 md:py-20 lg:py-24',
    };
    
    if (!(variant in variants)) {
      console.warn(`Invalid section variant: ${variant}. Using default.`);
      return variants.default;
    }
    
    return variants[variant];
  },
  
  content: (variant: 'default' | 'compact' | 'large' = 'default') => {
    const variants = {
      default: heroSpacing.hero.content,
      compact: 'space-y-4 md:space-y-6',
      large: 'space-y-8 md:space-y-10',
    };
    
    if (!(variant in variants)) {
      console.warn(`Invalid content variant: ${variant}. Using default.`);
      return variants.default;
    }
    
    return variants[variant];
  },
  
  container: (variant: 'default' | 'narrow' | 'wide' = 'default') => {
    const variants = {
      default: heroSpacing.hero.container,
      narrow: 'max-w-3xl mx-auto px-4',
      wide: 'max-w-6xl mx-auto px-4',
    };
    
    if (!(variant in variants)) {
      console.warn(`Invalid container variant: ${variant}. Using default.`);
      return variants.default;
    }
    
    return variants[variant];
  },
  
  gap: (size: 'small' | 'medium' | 'large' = 'medium') => {
    if (!(size in heroSpacing.hero.gap)) {
      console.warn(`Invalid gap size: ${size}. Using medium.`);
      return heroSpacing.hero.gap.medium;
    }
    
    return heroSpacing.hero.gap[size];
  },
};

/**
 * CSS Custom Properties for Hero Spacing
 * These can be used in CSS-in-JS or CSS files
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

export type HeroSpacingVariant = keyof typeof heroSpacing;
export type HeroSpacingSize = 'small' | 'medium' | 'large';
export type HeroSpacingVariantType = 'default' | 'compact' | 'large';
