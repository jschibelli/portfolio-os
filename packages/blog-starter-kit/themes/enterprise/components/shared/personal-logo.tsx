'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PersonalLogoProps {
  /**
   * Size variant for the logo
   * - 'small': 120x40px (w-30 h-10)
   * - 'medium': 160x53px (w-40 h-13) 
   * - 'large': 200x67px (w-50 h-17)
   * - 'xlarge': 240x80px (w-60 h-20)
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Whether to include a link to home page
   */
  linkToHome?: boolean;
  /**
   * Custom className for additional styling
   */
  className?: string;
  /**
   * Alt text for the logo image
   */
  alt?: string;
  /**
   * Whether to show loading state while theme is being determined
   */
  showLoadingState?: boolean;
}

const sizeConfig = {
  small: {
    width: 120,
    height: 40,
    className: 'w-[120px] h-[40px]',
  },
  medium: {
    width: 160,
    height: 53,
    className: 'w-[160px] h-[53px]',
  },
  large: {
    width: 200,
    height: 67,
    className: 'w-[200px] h-[67px]',
  },
  xlarge: {
    width: 240,
    height: 80,
    className: 'w-[240px] h-[80px]',
  },
};

export const PersonalLogo = ({ 
  size = 'medium', 
  linkToHome = true, 
  className = '', 
  alt = 'John Schibelli',
  showLoadingState = true 
}: PersonalLogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to use based on theme
  const getLogoSrc = () => {
    // For dark backgrounds, use the regular logo (white/light logo)
    // For light backgrounds, use the black logo
    if (resolvedTheme === 'dark') {
      return '/assets/personal-logo.png';
    } else {
      return '/assets/personal-logo-black.png';
    }
  };

  const config = sizeConfig[size];
  const logoSrc = getLogoSrc();

  // Show loading state while theme is being determined
  if (!mounted && showLoadingState) {
    return (
      <div className={`${config.className} ${className} flex items-center justify-center`}>
        <div className="w-full h-full bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
      </div>
    );
  }

  const logoElement = (
    <Image
      src={logoSrc}
      alt={alt}
      width={config.width}
      height={config.height}
      className={`${config.className} ${className} object-contain transition-opacity duration-200`}
      priority={size === 'large' || size === 'xlarge'} // Prioritize loading for larger sizes
      quality={95} // High quality for crisp logo display
      onError={(e) => {
        console.warn('PersonalLogo: Failed to load logo image', logoSrc);
        // Fallback to a simple text logo if image fails
        e.currentTarget.style.display = 'none';
        // Show fallback text
        const fallback = document.createElement('div');
        fallback.className = `${config.className} ${className} flex items-center justify-center bg-stone-200 dark:bg-stone-700 rounded text-stone-600 dark:text-stone-300 font-semibold`;
        fallback.textContent = 'JS';
        e.currentTarget.parentNode?.appendChild(fallback);
      }}
    />
  );

  if (linkToHome) {
    return (
      <Link
        href="/"
        aria-label={`${alt} - Home page`}
        className="inline-block hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 rounded"
      >
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

// Convenience components for common use cases
export const PersonalLogoSmall = (props: Omit<PersonalLogoProps, 'size'>) => (
  <PersonalLogo {...props} size="small" />
);

export const PersonalLogoMedium = (props: Omit<PersonalLogoProps, 'size'>) => (
  <PersonalLogo {...props} size="medium" />
);

export const PersonalLogoLarge = (props: Omit<PersonalLogoProps, 'size'>) => (
  <PersonalLogo {...props} size="large" />
);

export const PersonalLogoXLarge = (props: Omit<PersonalLogoProps, 'size'>) => (
  <PersonalLogo {...props} size="xlarge" />
);
