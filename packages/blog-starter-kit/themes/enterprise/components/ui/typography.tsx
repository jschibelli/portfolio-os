/**
 * Typography Components
 * 
 * Reusable typography components that implement the design token system
 * for consistent typography across all hero and section components.
 */

import { cn } from '@/lib/utils';
import { 
  typographyPresets, 
  heroTypography, 
  sectionTypography, 
  cardTypography,
  type TypographyPreset 
} from '@/lib/design-tokens';
import { ReactNode } from 'react';

// Base typography component props
interface BaseTypographyProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Hero title component
interface HeroTitleProps extends BaseTypographyProps {
  variant?: 'default' | 'large' | 'extra-large';
}

export function HeroTitle({ 
  children, 
  className, 
  as: Component = 'h1',
  variant = 'default' 
}: HeroTitleProps) {
  const variantClasses = {
    default: typographyPresets.heroTitle,
    large: heroTypography.title.large,
    'extra-large': heroTypography.title.xlarge,
  };

  return (
    <Component 
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </Component>
  );
}

// Hero subtitle component
interface HeroSubtitleProps extends BaseTypographyProps {
  variant?: 'default' | 'large';
}

export function HeroSubtitle({ 
  children, 
  className, 
  as: Component = 'h2',
  variant = 'default' 
}: HeroSubtitleProps) {
  const variantClasses = {
    default: typographyPresets.heroSubtitle,
    large: heroTypography.subtitle.large,
  };

  return (
    <Component 
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </Component>
  );
}

// Hero description component
interface HeroDescriptionProps extends BaseTypographyProps {
  variant?: 'default' | 'large';
}

export function HeroDescription({ 
  children, 
  className, 
  as: Component = 'p',
  variant = 'default' 
}: HeroDescriptionProps) {
  const variantClasses = {
    default: typographyPresets.heroDescription,
    large: heroTypography.description.large,
  };

  return (
    <Component 
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </Component>
  );
}

// Section heading component
interface SectionHeadingProps extends BaseTypographyProps {
  variant?: 'default' | 'large';
}

export function SectionHeading({ 
  children, 
  className, 
  as: Component = 'h2',
  variant = 'default' 
}: SectionHeadingProps) {
  const variantClasses = {
    default: typographyPresets.sectionHeading,
    large: sectionTypography.heading.large,
  };

  return (
    <Component 
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </Component>
  );
}

// Section subheading component
interface SectionSubheadingProps extends BaseTypographyProps {
  variant?: 'default' | 'large';
}

export function SectionSubheading({ 
  children, 
  className, 
  as: Component = 'h3',
  variant = 'default' 
}: SectionSubheadingProps) {
  const variantClasses = {
    default: sectionTypography.subheading.mobile,
    large: sectionTypography.subheading.desktop,
  };

  return (
    <Component 
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </Component>
  );
}

// Card title component
interface CardTitleProps extends BaseTypographyProps {
  variant?: 'default' | 'large';
}

export function CardTitle({ 
  children, 
  className, 
  as: Component = 'h3',
  variant = 'default' 
}: CardTitleProps) {
  const variantClasses = {
    default: typographyPresets.cardTitle,
    large: cardTypography.title.desktop,
  };

  return (
    <Component 
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </Component>
  );
}

// Card subtitle component
interface CardSubtitleProps extends BaseTypographyProps {
  variant?: 'default' | 'large';
}

export function CardSubtitle({ 
  children, 
  className, 
  as: Component = 'h4',
  variant = 'default' 
}: CardSubtitleProps) {
  const variantClasses = {
    default: cardTypography.subtitle.mobile,
    large: cardTypography.subtitle.desktop,
  };

  return (
    <Component 
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </Component>
  );
}

// Card description component
interface CardDescriptionProps extends BaseTypographyProps {
  variant?: 'default' | 'large';
}

export function CardDescription({ 
  children, 
  className, 
  as: Component = 'p',
  variant = 'default' 
}: CardDescriptionProps) {
  const variantClasses = {
    default: cardTypography.description.mobile,
    large: cardTypography.description.desktop,
  };

  return (
    <Component 
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </Component>
  );
}

// Generic typography component with preset support
interface TypographyProps extends BaseTypographyProps {
  preset?: TypographyPreset;
  variant?: 'default' | 'large' | 'extra-large';
}

export function Typography({ 
  children, 
  className, 
  as: Component = 'p',
  preset = 'heroTitle',
  variant = 'default' 
}: TypographyProps) {
  const presetClasses = typographyPresets[preset];
  
  return (
    <Component 
      className={cn(presetClasses, className)}
    >
      {children}
    </Component>
  );
}

// Utility function to get typography classes
export function getTypographyClasses(preset: TypographyPreset): string {
  return typographyPresets[preset];
}

// Export all typography components
export {
  HeroTitle,
  HeroSubtitle,
  HeroDescription,
  SectionHeading,
  SectionSubheading,
  CardTitle,
  CardSubtitle,
  CardDescription,
  Typography,
  getTypographyClasses,
};
