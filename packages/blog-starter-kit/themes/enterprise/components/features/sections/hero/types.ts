import { ReactNode } from 'react';

export type HeroVariant = 'large' | 'medium' | 'small';

export interface HeroAction {
  href: string;
  text: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
}

export interface HeroBackground {
  type: 'image' | 'gradient' | 'solid' | 'pattern';
  src?: string;
  alt?: string;
  gradient?: {
    from: string;
    via?: string;
    to: string;
    direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  };
  color?: string;
  pattern?: string;
  overlay?: {
    color: string;
    opacity: number;
  };
}

export interface BaseHeroProps {
  variant: HeroVariant;
  title: string;
  subtitle?: string;
  description?: string;
  actions?: HeroAction[];
  background?: HeroBackground;
  className?: string;
  children?: ReactNode;
  // Animation props
  animate?: boolean;
  animationDelay?: number;
  // Accessibility props
  ariaLabel?: string;
  role?: string;
}

export interface HeroTypographyConfig {
  title: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing?: string;
  };
  subtitle: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing?: string;
  };
  description: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing?: string;
  };
}

export interface HeroSpacingConfig {
  container: {
    padding: string;
    gap: string;
  };
  content: {
    gap: string;
    padding: string;
  };
  actions: {
    gap: string;
    margin: string;
  };
}

export interface HeroResponsiveConfig {
  mobile: {
    typography: HeroTypographyConfig;
    spacing: HeroSpacingConfig;
  };
  tablet: {
    typography: HeroTypographyConfig;
    spacing: HeroSpacingConfig;
  };
  desktop: {
    typography: HeroTypographyConfig;
    spacing: HeroSpacingConfig;
  };
}
