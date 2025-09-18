import { cn } from '@/lib/utils';
import { heroSpacing, getHeroSpacing, type HeroSpacingVariantType, type HeroSpacingSize } from '@/lib/design-tokens';

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
  return (
    <Component className={cn(getHeroSpacing.section(variant), className)}>
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
  return (
    <div className={cn(getHeroSpacing.container(variant), className)}>
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
  return (
    <Component className={cn(getHeroSpacing.content(variant), className)}>
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
  const gapClass = direction === 'horizontal' 
    ? `flex ${getHeroSpacing.gap(size)}`
    : `flex flex-col ${getHeroSpacing.gap(size)}`;
    
  return (
    <div className={cn(gapClass, className)}>
      {children}
    </div>
  );
}

/**
 * Hero Spacing Utility Classes
 * Pre-defined classes for common hero spacing patterns
 */
export const heroSpacingClasses = {
  // Section spacing
  section: {
    default: heroSpacing.hero.section,
    compact: 'py-12 md:py-16',
    large: 'py-16 md:py-20 lg:py-24',
  },
  
  // Content spacing
  content: {
    default: heroSpacing.hero.content,
    compact: 'space-y-4 md:space-y-6',
    large: 'space-y-8 md:space-y-10',
  },
  
  // Container spacing
  container: {
    default: heroSpacing.hero.container,
    narrow: 'max-w-3xl mx-auto px-4',
    wide: 'max-w-6xl mx-auto px-4',
  },
  
  // Gap spacing
  gap: {
    small: heroSpacing.hero.gap.small,
    medium: heroSpacing.hero.gap.medium,
    large: heroSpacing.hero.gap.large,
  },
} as const;

/**
 * Utility function to combine hero spacing classes
 */
export function getHeroSpacingClasses(options: {
  section?: HeroSpacingVariantType;
  content?: HeroSpacingVariantType;
  container?: 'default' | 'narrow' | 'wide';
  gap?: HeroSpacingSize;
}) {
  return {
    section: getHeroSpacing.section(options.section),
    content: getHeroSpacing.content(options.content),
    container: getHeroSpacing.container(options.container),
    gap: getHeroSpacing.gap(options.gap),
  };
}

/**
 * Hero Spacing Hook for dynamic spacing
 */
export function useHeroSpacing(variant: HeroSpacingVariantType = 'default') {
  return {
    section: getHeroSpacing.section(variant),
    content: getHeroSpacing.content(variant),
    container: getHeroSpacing.container('default'),
    gap: getHeroSpacing.gap('medium'),
  };
}
