import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../../ui/button';
import { Section } from '../../ui/section';
import { 
  BaseHeroProps, 
  HeroVariant, 
  HeroTypographyConfig, 
  HeroSpacingConfig,
  HeroResponsiveConfig 
} from './types';

// Typography system configuration based on Issue #139
const typographyConfig: Record<HeroVariant, HeroResponsiveConfig> = {
  large: {
    mobile: {
      typography: {
        title: {
          fontSize: 'text-4xl',
          fontWeight: 'font-bold',
          lineHeight: 'leading-tight',
          letterSpacing: 'tracking-tight'
        },
        subtitle: {
          fontSize: 'text-lg',
          fontWeight: 'font-semibold',
          lineHeight: 'leading-snug',
          letterSpacing: 'tracking-normal'
        },
        description: {
          fontSize: 'text-base',
          fontWeight: 'font-medium',
          lineHeight: 'leading-relaxed',
          letterSpacing: 'tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'py-12 px-4',
          gap: 'gap-6'
        },
        content: {
          gap: 'gap-4',
          padding: 'px-0'
        },
        actions: {
          gap: 'gap-3',
          margin: 'mt-6'
        }
      }
    },
    tablet: {
      typography: {
        title: {
          fontSize: 'md:text-6xl',
          fontWeight: 'font-bold',
          lineHeight: 'md:leading-tight',
          letterSpacing: 'md:tracking-tight'
        },
        subtitle: {
          fontSize: 'md:text-xl',
          fontWeight: 'font-semibold',
          lineHeight: 'md:leading-snug',
          letterSpacing: 'md:tracking-normal'
        },
        description: {
          fontSize: 'md:text-lg',
          fontWeight: 'font-medium',
          lineHeight: 'md:leading-relaxed',
          letterSpacing: 'md:tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'md:py-16 md:px-6',
          gap: 'md:gap-8'
        },
        content: {
          gap: 'md:gap-6',
          padding: 'md:px-4'
        },
        actions: {
          gap: 'md:gap-4',
          margin: 'md:mt-8'
        }
      }
    },
    desktop: {
      typography: {
        title: {
          fontSize: 'lg:text-7xl xl:text-8xl',
          fontWeight: 'font-bold',
          lineHeight: 'lg:leading-tight xl:leading-tight',
          letterSpacing: 'lg:tracking-tight xl:tracking-tight'
        },
        subtitle: {
          fontSize: 'lg:text-2xl xl:text-3xl',
          fontWeight: 'font-semibold',
          lineHeight: 'lg:leading-snug xl:leading-snug',
          letterSpacing: 'lg:tracking-normal xl:tracking-normal'
        },
        description: {
          fontSize: 'lg:text-xl xl:text-2xl',
          fontWeight: 'font-medium',
          lineHeight: 'lg:leading-relaxed xl:leading-relaxed',
          letterSpacing: 'lg:tracking-normal xl:tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'lg:py-20 xl:py-24 lg:px-8',
          gap: 'lg:gap-12 xl:gap-16'
        },
        content: {
          gap: 'lg:gap-8 xl:gap-10',
          padding: 'lg:px-6 xl:px-8'
        },
        actions: {
          gap: 'lg:gap-6 xl:gap-8',
          margin: 'lg:mt-10 xl:mt-12'
        }
      }
    }
  },
  medium: {
    mobile: {
      typography: {
        title: {
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          lineHeight: 'leading-tight',
          letterSpacing: 'tracking-tight'
        },
        subtitle: {
          fontSize: 'text-base',
          fontWeight: 'font-semibold',
          lineHeight: 'leading-snug',
          letterSpacing: 'tracking-normal'
        },
        description: {
          fontSize: 'text-sm',
          fontWeight: 'font-medium',
          lineHeight: 'leading-relaxed',
          letterSpacing: 'tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'py-8 px-4',
          gap: 'gap-4'
        },
        content: {
          gap: 'gap-3',
          padding: 'px-0'
        },
        actions: {
          gap: 'gap-2',
          margin: 'mt-4'
        }
      }
    },
    tablet: {
      typography: {
        title: {
          fontSize: 'md:text-4xl',
          fontWeight: 'font-bold',
          lineHeight: 'md:leading-tight',
          letterSpacing: 'md:tracking-tight'
        },
        subtitle: {
          fontSize: 'md:text-lg',
          fontWeight: 'font-semibold',
          lineHeight: 'md:leading-snug',
          letterSpacing: 'md:tracking-normal'
        },
        description: {
          fontSize: 'md:text-base',
          fontWeight: 'font-medium',
          lineHeight: 'md:leading-relaxed',
          letterSpacing: 'md:tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'md:py-12 md:px-6',
          gap: 'md:gap-6'
        },
        content: {
          gap: 'md:gap-4',
          padding: 'md:px-4'
        },
        actions: {
          gap: 'md:gap-3',
          margin: 'md:mt-6'
        }
      }
    },
    desktop: {
      typography: {
        title: {
          fontSize: 'lg:text-5xl xl:text-6xl',
          fontWeight: 'font-bold',
          lineHeight: 'lg:leading-tight xl:leading-tight',
          letterSpacing: 'lg:tracking-tight xl:tracking-tight'
        },
        subtitle: {
          fontSize: 'lg:text-xl xl:text-2xl',
          fontWeight: 'font-semibold',
          lineHeight: 'lg:leading-snug xl:leading-snug',
          letterSpacing: 'lg:tracking-normal xl:tracking-normal'
        },
        description: {
          fontSize: 'lg:text-lg xl:text-xl',
          fontWeight: 'font-medium',
          lineHeight: 'lg:leading-relaxed xl:leading-relaxed',
          letterSpacing: 'lg:tracking-normal xl:tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'lg:py-16 xl:py-20 lg:px-8',
          gap: 'lg:gap-8 xl:gap-10'
        },
        content: {
          gap: 'lg:gap-6 xl:gap-8',
          padding: 'lg:px-6 xl:px-8'
        },
        actions: {
          gap: 'lg:gap-4 xl:gap-6',
          margin: 'lg:mt-8 xl:mt-10'
        }
      }
    }
  },
  small: {
    mobile: {
      typography: {
        title: {
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          lineHeight: 'leading-tight',
          letterSpacing: 'tracking-tight'
        },
        subtitle: {
          fontSize: 'text-sm',
          fontWeight: 'font-semibold',
          lineHeight: 'leading-snug',
          letterSpacing: 'tracking-normal'
        },
        description: {
          fontSize: 'text-xs',
          fontWeight: 'font-medium',
          lineHeight: 'leading-relaxed',
          letterSpacing: 'tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'py-6 px-4',
          gap: 'gap-3'
        },
        content: {
          gap: 'gap-2',
          padding: 'px-0'
        },
        actions: {
          gap: 'gap-2',
          margin: 'mt-3'
        }
      }
    },
    tablet: {
      typography: {
        title: {
          fontSize: 'md:text-3xl',
          fontWeight: 'font-bold',
          lineHeight: 'md:leading-tight',
          letterSpacing: 'md:tracking-tight'
        },
        subtitle: {
          fontSize: 'md:text-base',
          fontWeight: 'font-semibold',
          lineHeight: 'md:leading-snug',
          letterSpacing: 'md:tracking-normal'
        },
        description: {
          fontSize: 'md:text-sm',
          fontWeight: 'font-medium',
          lineHeight: 'md:leading-relaxed',
          letterSpacing: 'md:tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'md:py-8 md:px-6',
          gap: 'md:gap-4'
        },
        content: {
          gap: 'md:gap-3',
          padding: 'md:px-4'
        },
        actions: {
          gap: 'md:gap-3',
          margin: 'md:mt-4'
        }
      }
    },
    desktop: {
      typography: {
        title: {
          fontSize: 'lg:text-4xl xl:text-5xl',
          fontWeight: 'font-bold',
          lineHeight: 'lg:leading-tight xl:leading-tight',
          letterSpacing: 'lg:tracking-tight xl:tracking-tight'
        },
        subtitle: {
          fontSize: 'lg:text-lg xl:text-xl',
          fontWeight: 'font-semibold',
          lineHeight: 'lg:leading-snug xl:leading-snug',
          letterSpacing: 'lg:tracking-normal xl:tracking-normal'
        },
        description: {
          fontSize: 'lg:text-base xl:text-lg',
          fontWeight: 'font-medium',
          lineHeight: 'lg:leading-relaxed xl:leading-relaxed',
          letterSpacing: 'lg:tracking-normal xl:tracking-normal'
        }
      },
      spacing: {
        container: {
          padding: 'lg:py-12 xl:py-16 lg:px-8',
          gap: 'lg:gap-6 xl:gap-8'
        },
        content: {
          gap: 'lg:gap-4 xl:gap-6',
          padding: 'lg:px-6 xl:px-8'
        },
        actions: {
          gap: 'lg:gap-3 xl:gap-4',
          margin: 'lg:mt-6 xl:mt-8'
        }
      }
    }
  }
};

// Animation variants with reduced motion support
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
};

const fadeInUpDelayed = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' }
});

// Reduced motion variants
const fadeInUpReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

const fadeInUpDelayedReduced = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, delay: delay * 0.1 }
});

// Background component with performance optimizations
const HeroBackground = ({ background }: { background?: BaseHeroProps['background'] }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  if (!background) return null;

  const { type, src, alt, gradient, color, pattern, overlay } = background;

  useEffect(() => {
    if (type === 'image' && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    } else {
      setIsLoaded(true);
    }
  }, [type, src]);

  return (
    <div className="absolute inset-0 z-0">
      {type === 'image' && src && (
        <>
          {!isLoaded && (
            <div className="w-full h-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
          )}
          <img
            src={src}
            alt={alt || ''}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
          />
        </>
      )}
      {type === 'gradient' && gradient && (
        <div 
          className={`w-full h-full bg-gradient-${gradient.direction || 'to-r'} from-${gradient.from} via-${gradient.via || gradient.from} to-${gradient.to}`}
          style={{
            background: `linear-gradient(${gradient.direction || 'to right'}, ${gradient.from}, ${gradient.via || gradient.from}, ${gradient.to})`
          }}
        />
      )}
      {type === 'solid' && color && (
        <div className="w-full h-full" style={{ backgroundColor: color }} />
      )}
      {type === 'pattern' && pattern && (
        <div 
          className="w-full h-full opacity-20"
          style={{ backgroundImage: `url(${pattern})` }}
        />
      )}
      {overlay && (
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundColor: overlay.color,
            opacity: overlay.opacity 
          }}
        />
      )}
    </div>
  );
};

export default function BaseHero({
  variant,
  title,
  subtitle,
  description,
  actions = [],
  background,
  className,
  children,
  animate = true,
  animationDelay = 0,
  ariaLabel,
  role = 'banner'
}: BaseHeroProps) {
  const config = typographyConfig[variant];
  const shouldReduceMotion = useReducedMotion();
  
  // Use reduced motion variants if user prefers reduced motion
  const animationVariants = shouldReduceMotion ? {
    fadeInUp: fadeInUpReduced,
    fadeInUpDelayed: fadeInUpDelayedReduced
  } : {
    fadeInUp,
    fadeInUpDelayed
  };
  
  // Build responsive classes
  const titleClasses = cn(
    'text-white',
    config.mobile.typography.title.fontSize,
    config.mobile.typography.title.fontWeight,
    config.mobile.typography.title.lineHeight,
    config.mobile.typography.title.letterSpacing,
    config.tablet.typography.title.fontSize,
    config.tablet.typography.title.lineHeight,
    config.tablet.typography.title.letterSpacing,
    config.desktop.typography.title.fontSize,
    config.desktop.typography.title.lineHeight,
    config.desktop.typography.title.letterSpacing
  );

  const subtitleClasses = cn(
    'text-stone-200',
    config.mobile.typography.subtitle.fontSize,
    config.mobile.typography.subtitle.fontWeight,
    config.mobile.typography.subtitle.lineHeight,
    config.mobile.typography.subtitle.letterSpacing,
    config.tablet.typography.subtitle.fontSize,
    config.tablet.typography.subtitle.lineHeight,
    config.tablet.typography.subtitle.letterSpacing,
    config.desktop.typography.subtitle.fontSize,
    config.desktop.typography.subtitle.lineHeight,
    config.desktop.typography.subtitle.letterSpacing
  );

  const descriptionClasses = cn(
    'text-stone-300',
    config.mobile.typography.description.fontSize,
    config.mobile.typography.description.fontWeight,
    config.mobile.typography.description.lineHeight,
    config.mobile.typography.description.letterSpacing,
    config.tablet.typography.description.fontSize,
    config.tablet.typography.description.lineHeight,
    config.tablet.typography.description.letterSpacing,
    config.desktop.typography.description.fontSize,
    config.desktop.typography.description.lineHeight,
    config.desktop.typography.description.letterSpacing
  );

  const containerClasses = cn(
    'relative flex min-h-[400px] items-center justify-center overflow-hidden',
    config.mobile.spacing.container.padding,
    config.mobile.spacing.container.gap,
    config.tablet.spacing.container.padding,
    config.tablet.spacing.container.gap,
    config.desktop.spacing.container.padding,
    config.desktop.spacing.container.gap,
    className
  );

  const contentClasses = cn(
    'container relative z-10 mx-auto text-center',
    config.mobile.spacing.content.padding,
    config.tablet.spacing.content.padding,
    config.desktop.spacing.content.padding
  );

  const textContentClasses = cn(
    'mx-auto max-w-4xl space-y-6',
    config.mobile.spacing.content.gap,
    config.tablet.spacing.content.gap,
    config.desktop.spacing.content.gap
  );

  const actionsClasses = cn(
    'flex flex-col items-center justify-center gap-4 sm:flex-row',
    config.mobile.spacing.actions.gap,
    config.mobile.spacing.actions.margin,
    config.tablet.spacing.actions.gap,
    config.tablet.spacing.actions.margin,
    config.desktop.spacing.actions.gap,
    config.desktop.spacing.actions.margin
  );

  return (
    <Section 
      className={containerClasses}
      role={role}
      aria-label={ariaLabel}
    >
      <HeroBackground background={background} />
      
      <div className={contentClasses}>
        <motion.div
          {...(animate ? animationVariants.fadeInUp : {})}
          className={textContentClasses}
        >
          {subtitle && (
            <motion.h2
              {...(animate ? animationVariants.fadeInUpDelayed(animationDelay + 0.2) : {})}
              className={subtitleClasses}
              id="hero-subtitle"
            >
              {subtitle}
            </motion.h2>
          )}
          
          <motion.h1
            {...(animate ? animationVariants.fadeInUpDelayed(animationDelay + 0.4) : {})}
            className={titleClasses}
            id="hero-title"
          >
            {title}
          </motion.h1>
          
          {description && (
            <motion.p
              {...(animate ? animationVariants.fadeInUpDelayed(animationDelay + 0.6) : {})}
              className={descriptionClasses}
              id="hero-description"
            >
              {description}
            </motion.p>
          )}
          
          {actions.length > 0 && (
            <motion.nav
              {...(animate ? animationVariants.fadeInUpDelayed(animationDelay + 0.8) : {})}
              className={actionsClasses}
              aria-label="Hero actions"
            >
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size={action.size || 'lg'}
                  disabled={action.disabled}
                  asChild
                  aria-label={action.text}
                >
                  <a 
                    href={action.href}
                    role="button"
                    tabIndex={0}
                  >
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </a>
                </Button>
              ))}
            </motion.nav>
          )}
          
          {children}
        </motion.div>
      </div>
    </Section>
  );
}
