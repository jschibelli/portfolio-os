import { ReactNode } from 'react';
import BaseHero from '../base';
import { BaseHeroProps } from '../types';

interface HeroLargeProps extends Omit<BaseHeroProps, 'variant'> {
  // Large hero specific props
  showBadge?: boolean;
  badgeText?: string;
  badgeLink?: string;
  mockup?: ReactNode;
  showStats?: boolean;
  stats?: Array<{
    id?: string;
    label: string;
    value: string;
  }>;
}

export default function HeroLarge({
  title,
  subtitle,
  description,
  actions,
  background,
  className,
  children,
  animate = true,
  animationDelay = 0,
  ariaLabel,
  showBadge = false,
  badgeText,
  badgeLink,
  mockup,
  showStats = false,
  stats = [],
  ...props
}: HeroLargeProps) {
  return (
    <BaseHero
      variant="large"
      title={title}
      subtitle={subtitle}
      description={description}
      actions={actions}
      background={background}
      className={className}
      animate={animate}
      animationDelay={animationDelay}
      ariaLabel={ariaLabel}
      {...props}
    >
      {showBadge && badgeText && (
        <div className="animate-appear opacity-0 delay-100">
          <a 
            href={badgeLink || '#'}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/10 px-4 py-2 text-sm font-medium text-stone-200 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
            aria-label={badgeText}
          >
            {badgeText}
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
      
      {showStats && stats.length > 0 && (
        <div className="animate-appear opacity-0 delay-300 grid grid-cols-2 gap-4 sm:grid-cols-4" role="region" aria-label="Statistics">
          {stats.map((stat, index) => (
            <div key={stat.id || `stat-${index}`} className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl" aria-label={`${stat.value} ${stat.label}`}>
                {stat.value}
              </div>
              <div className="text-sm text-stone-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {mockup && (
        <div className="animate-appear opacity-0 delay-500 relative w-full pt-8">
          <div className="mx-auto max-w-4xl">
            {mockup}
          </div>
        </div>
      )}
      
      {children}
    </BaseHero>
  );
}
