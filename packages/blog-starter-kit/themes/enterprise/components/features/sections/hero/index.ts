// Base hero component
export { default as BaseHero } from './base';

// Hero variants
export { default as HeroLarge } from './variants/hero-large';
export { default as HeroMedium } from './variants/hero-medium';
export { default as HeroSmall } from './variants/hero-small';

// Types
export type {
  BaseHeroProps,
  HeroVariant,
  HeroAction,
  HeroBackground,
  HeroTypographyConfig,
  HeroSpacingConfig,
  HeroResponsiveConfig
} from './types';
