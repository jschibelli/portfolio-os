import { cn } from '../../lib/utils';
import { heroSpacing, getHeroSpacing, type HeroSpacingVariantType, type HeroSpacingSize } from '../../lib/design-tokens';

/**
 * Hero Section Component with standardized spacing
 */
interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: HeroSpacingVariantType;
  as?: 'section' | 'div' | 'header';
}

export function HeroSection({ 
  children, 
  className, 
  variant = 'default',
  as: Component = 'section'
}: HeroSectionProps) {
  // Validate variant and provide fallback
  const validVariants: HeroSpacingVariantType[] = ['default', 'compact', 'large'];
  const validatedVariant = validVariants.includes(variant) ? variant : 'default';
  
  if (!validVariants.includes(variant)) {
    console.warn(`Invalid HeroSection variant: ${variant}. Using default.`);
  }

  return (
    <Component className={cn(getHeroSpacing.section(validatedVariant), className)}>
      {children}
    </Component>
  );
}

/**
 * Hero Container Component with standardized container spacing
 */
interface HeroContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide';
}

export function HeroContainer({ 
  children, 
  className, 
  variant = 'default'
}: HeroContainerProps) {
  // Validate variant and provide fallback
  const validVariants = ['default', 'narrow', 'wide'];
  const validatedVariant = validVariants.includes(variant) ? variant : 'default';
  
  if (!validVariants.includes(variant)) {
    console.warn(`Invalid HeroContainer variant: ${variant}. Using default.`);
  }

  return (
    <div className={cn(getHeroSpacing.container(validatedVariant), className)}>
      {children}
    </div>
  );
}

/**
 * Hero Content Component with standardized content spacing
 */
interface HeroContentProps {
  children: React.ReactNode;
  className?: string;
  variant?: HeroSpacingVariantType;
  as?: 'div' | 'main' | 'article';
}

export function HeroContent({ 
  children, 
  className, 
  variant = 'default',
  as: Component = 'div'
}: HeroContentProps) {
  // Validate variant and provide fallback
  const validVariants: HeroSpacingVariantType[] = ['default', 'compact', 'large'];
  const validatedVariant = validVariants.includes(variant) ? variant : 'default';
  
  if (!validVariants.includes(variant)) {
    console.warn(`Invalid HeroContent variant: ${variant}. Using default.`);
  }

  return (
    <Component className={cn(getHeroSpacing.content(validatedVariant), className)}>
      {children}
    </Component>
  );
}

/**
 * Hero Gap Component for consistent gap spacing
 */
interface HeroGapProps {
  children: React.ReactNode;
  className?: string;
  size?: HeroSpacingSize;
  direction?: 'horizontal' | 'vertical';
}

export function HeroGap({ 
  children, 
  className, 
  size = 'medium',
  direction = 'vertical'
}: HeroGapProps) {
  // Validate size and direction parameters
  const validSizes: HeroSpacingSize[] = ['small', 'medium', 'large'];
  const validDirections = ['horizontal', 'vertical'];
  
  const validatedSize = validSizes.includes(size) ? size : 'medium';
  const validatedDirection = validDirections.includes(direction) ? direction : 'vertical';
  
  if (!validSizes.includes(size)) {
    console.warn(`Invalid HeroGap size: ${size}. Using medium.`);
  }
  
  if (!validDirections.includes(direction)) {
    console.warn(`Invalid HeroGap direction: ${direction}. Using vertical.`);
  }

  const gapClass = validatedDirection === 'horizontal' 
    ? `flex ${getHeroSpacing.gap(validatedSize)}`
    : `flex flex-col ${getHeroSpacing.gap(validatedSize)}`;
    
  return (
    <div className={cn(gapClass, className)}>
      {children}
    </div>
  );
}

/**
 * Hero Spacing Utility Classes
 * Pre-defined classes for common hero spacing patterns
 * 
 * Note: These classes are derived from the design tokens to maintain consistency
 * and avoid duplication. Use getHeroSpacing utility functions for dynamic values.
 */
export const heroSpacingClasses = {
  // Section spacing - using utility functions to avoid duplication
  section: {
    default: getHeroSpacing.section('default'),
    compact: getHeroSpacing.section('compact'),
    large: getHeroSpacing.section('large'),
  },
  
  // Content spacing - using utility functions to avoid duplication
  content: {
    default: getHeroSpacing.content('default'),
    compact: getHeroSpacing.content('compact'),
    large: getHeroSpacing.content('large'),
  },
  
  // Container spacing - using utility functions to avoid duplication
  container: {
    default: getHeroSpacing.container('default'),
    narrow: getHeroSpacing.container('narrow'),
    wide: getHeroSpacing.container('wide'),
  },
  
  // Gap spacing - using utility functions to avoid duplication
  gap: {
    small: getHeroSpacing.gap('small'),
    medium: getHeroSpacing.gap('medium'),
    large: getHeroSpacing.gap('large'),
  },
} as const;

/**
 * Utility function to combine hero spacing classes
 * 
 * @param options - Configuration object for spacing variants
 * @param options.section - Section spacing variant
 * @param options.content - Content spacing variant  
 * @param options.container - Container spacing variant
 * @param options.gap - Gap spacing size
 * @returns Object containing all spacing classes
 */
export function getHeroSpacingClasses(options: {
  section?: HeroSpacingVariantType;
  content?: HeroSpacingVariantType;
  container?: 'default' | 'narrow' | 'wide';
  gap?: HeroSpacingSize;
} = {}) {
  // Validate options and provide defaults
  const validatedOptions = {
    section: options.section || 'default',
    content: options.content || 'default',
    container: options.container || 'default',
    gap: options.gap || 'medium',
  };

  return {
    section: getHeroSpacing.section(validatedOptions.section),
    content: getHeroSpacing.content(validatedOptions.content),
    container: getHeroSpacing.container(validatedOptions.container),
    gap: getHeroSpacing.gap(validatedOptions.gap),
  };
}

/**
 * Hero Spacing Hook for dynamic spacing
 * 
 * @param variant - The spacing variant to use for section and content
 * @returns Object containing spacing classes for all hero elements
 * 
 * @example
 * ```tsx
 * const spacing = useHeroSpacing('compact');
 * return <div className={spacing.section}>...</div>;
 * ```
 */
export function useHeroSpacing(variant: HeroSpacingVariantType = 'default') {
  // Validate variant parameter
  const validVariants: HeroSpacingVariantType[] = ['default', 'compact', 'large'];
  const validatedVariant = validVariants.includes(variant) ? variant : 'default';
  
  if (!validVariants.includes(variant)) {
    console.warn(`Invalid hero spacing variant: ${variant}. Using default.`);
  }

  return {
    section: getHeroSpacing.section(validatedVariant),
    content: getHeroSpacing.content(validatedVariant),
    container: getHeroSpacing.container('default'),
    gap: getHeroSpacing.gap('medium'),
  };
}
