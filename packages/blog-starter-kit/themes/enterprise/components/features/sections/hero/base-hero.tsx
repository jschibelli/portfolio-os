import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BaseHeroProps {
  /** Main title text */
  title?: string;
  /** Description/subtitle text */
  description?: string;
  /** Layout direction */
  layout?: 'left' | 'center' | 'right';
  /** Content alignment */
  contentAlignment?: 'left' | 'center' | 'right';
  /** Additional CSS classes for the hero container */
  className?: string;
  /** Additional CSS classes for the content area */
  contentClassName?: string;
  /** Additional CSS classes for the title */
  titleClassName?: string;
  /** Additional CSS classes for the description */
  descriptionClassName?: string;
  /** Custom content to render */
  customContent?: ReactNode;
  /** Children components */
  children?: ReactNode;
  /** Enable/disable animations */
  animate?: boolean;
  /** Unique identifier */
  id?: string;
  /** Accessibility label */
  'aria-label'?: string;
}

export default function BaseHero({
  title,
  description,
  layout = 'center',
  contentAlignment = 'center',
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
  customContent,
  children,
  animate = true,
  id,
  'aria-label': ariaLabel,
}: BaseHeroProps) {
  const layoutClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const alignmentClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  };

  return (
    <section
      id={id}
      className={cn(
        'relative flex min-h-[400px] w-full flex-col justify-center',
        layoutClasses[layout],
        className
      )}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          'flex w-full flex-col gap-6',
          alignmentClasses[contentAlignment],
          contentClassName
        )}
      >
        {/* Custom Content */}
        {customContent && (
          <div className="w-full">
            {customContent}
          </div>
        )}

        {/* Title */}
        {title && (
          <h1
            className={cn(
              'text-3xl font-bold leading-tight tracking-tight text-stone-900 dark:text-stone-100 md:text-4xl lg:text-5xl',
              titleClassName
            )}
          >
            {title}
          </h1>
        )}

        {/* Description */}
        {description && (
          <p
            className={cn(
              'text-lg leading-relaxed text-stone-600 dark:text-stone-400 md:text-xl',
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}

        {/* Children Content */}
        {children && (
          <div className="w-full">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
