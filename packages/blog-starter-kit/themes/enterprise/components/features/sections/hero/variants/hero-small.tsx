import { ReactNode } from 'react';
import BaseHero from '../base';
import { BaseHeroProps } from '../types';

interface HeroSmallProps extends Omit<BaseHeroProps, 'variant'> {
  // Small hero specific props
  compact?: boolean;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{
    id?: string;
    label: string;
    href?: string;
  }>;
  showMeta?: boolean;
  metaItems?: Array<{
    id?: string;
    label: string;
    value: string;
  }>;
}

export default function HeroSmall({
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
  compact = false,
  showBreadcrumb = false,
  breadcrumbItems = [],
  showMeta = false,
  metaItems = [],
  ...props
}: HeroSmallProps) {
  const containerClasses = compact 
    ? 'min-h-[200px]' 
    : 'min-h-[300px]';

  return (
    <BaseHero
      variant="small"
      title={title}
      subtitle={subtitle}
      description={description}
      actions={actions}
      background={background}
      className={`${containerClasses} ${className || ''}`}
      animate={animate}
      animationDelay={animationDelay}
      ariaLabel={ariaLabel}
      {...props}
    >
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <nav className="animate-appear opacity-0 delay-100" aria-label="Breadcrumb">
          <ol className="flex items-center justify-center space-x-2 text-sm text-stone-300">
            {breadcrumbItems.map((item, index) => (
              <li key={item.id || `breadcrumb-${index}`} className="flex items-center">
                {index > 0 && (
                  <svg className="h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {item.href ? (
                  <a 
                    href={item.href}
                    className="hover:text-white transition-colors"
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-stone-400" aria-current="page">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      {showMeta && metaItems.length > 0 && (
        <div className="animate-appear opacity-0 delay-200 flex flex-wrap justify-center gap-4 text-sm text-stone-300" role="region" aria-label="Meta information">
          {metaItems.map((item, index) => (
            <div key={item.id || `meta-${index}`} className="flex items-center gap-1">
              <span className="font-medium">{item.label}:</span>
              <span className="text-stone-400" aria-label={`${item.label} is ${item.value}`}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {children}
    </BaseHero>
  );
}
