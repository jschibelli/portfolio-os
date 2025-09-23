import { ReactNode } from 'react';
import { motion } from 'framer-motion';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const MotionSection = animate ? motion.section : 'section';
  const MotionDiv = animate ? motion.div : 'div';

  return (
    <MotionSection
      id={id}
      className={cn(
        'relative flex min-h-[400px] w-full flex-col justify-center',
        layoutClasses[layout],
        className
      )}
      aria-label={ariaLabel}
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
    >
      <MotionDiv
        className={cn(
          'flex w-full flex-col gap-6',
          alignmentClasses[contentAlignment],
          contentClassName
        )}
        variants={animate ? itemVariants : undefined}
      >
        {/* Custom Content */}
        {customContent && (
          <MotionDiv className="w-full" variants={animate ? itemVariants : undefined}>
            {customContent}
          </MotionDiv>
        )}

        {/* Title */}
        {title && (
          <MotionDiv variants={animate ? itemVariants : undefined}>
            <h1
              className={cn(
                'text-3xl font-bold leading-tight tracking-tight text-stone-900 dark:text-stone-100 md:text-4xl lg:text-5xl',
                titleClassName
              )}
            >
              {title}
            </h1>
          </MotionDiv>
        )}

        {/* Description */}
        {description && (
          <MotionDiv variants={animate ? itemVariants : undefined}>
            <p
              className={cn(
                'text-lg leading-relaxed text-stone-600 dark:text-stone-400 md:text-xl',
                descriptionClassName
              )}
            >
              {description}
            </p>
          </MotionDiv>
        )}

        {/* Children Content */}
        {children && (
          <MotionDiv className="w-full" variants={animate ? itemVariants : undefined}>
            {children}
          </MotionDiv>
        )}
      </MotionDiv>
    </MotionSection>
  );
}
