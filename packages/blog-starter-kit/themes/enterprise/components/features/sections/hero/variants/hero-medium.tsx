import { ReactNode } from 'react';
import BaseHero from '../base';
import { BaseHeroProps } from '../types';

interface HeroMediumProps extends Omit<BaseHeroProps, 'variant'> {
  // Medium hero specific props
  showIcon?: boolean;
  icon?: ReactNode;
  showDivider?: boolean;
  centered?: boolean;
}

export default function HeroMedium({
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
  showIcon = false,
  icon,
  showDivider = false,
  centered = true,
  ...props
}: HeroMediumProps) {
  // Validate that icon is provided when showIcon is true
  if (showIcon && !icon) {
    console.warn('HeroMedium: showIcon is true but no icon provided');
  }
  const containerClasses = centered 
    ? 'text-center' 
    : 'text-left max-w-none';

  return (
    <BaseHero
      variant="medium"
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
      {showIcon && icon && (
        <div className="animate-appear opacity-0 delay-100 flex justify-center" role="img" aria-label="Hero icon">
          <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
            {icon}
          </div>
        </div>
      )}
      
      {showDivider && (
        <div className="animate-appear opacity-0 delay-200 flex justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-stone-400 to-transparent" />
        </div>
      )}
      
      <div className={containerClasses}>
        {children}
      </div>
    </BaseHero>
  );
}
