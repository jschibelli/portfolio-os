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
  const [imageError, setImageError] = useState(false);
  const [currentLogoSrc, setCurrentLogoSrc] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to use based on theme
  const getLogoSrc = () => {
    // For dark backgrounds, use the regular logo (white/light logo)
    // For light backgrounds, use the black logo
    // Default to dark theme if theme is not resolved yet
    const theme = resolvedTheme || 'dark';
    if (theme === 'dark') {
      return '/assets/personal-logo.png';
    } else {
      return '/assets/personal-logo-black.png';
    }
  };

  const config = sizeConfig[size];
  const logoSrc = getLogoSrc();

  // Update current logo source when theme changes
  useEffect(() => {
    if (mounted) {
      console.log('PersonalLogo: Setting logo source', logoSrc, 'theme:', resolvedTheme);
      setCurrentLogoSrc(logoSrc);
      setImageError(false);
    }
  }, [mounted, logoSrc, resolvedTheme]);

  // Handle image error with fallback logic
  const handleImageError = () => {
    console.warn('PersonalLogo: Failed to load logo image', currentLogoSrc);
    
    if (!imageError) {
      // Try the alternative logo first
      const alternativeSrc = currentLogoSrc.includes('black') 
        ? '/assets/personal-logo.png' 
        : '/assets/personal-logo-black.png';
      
      console.log('PersonalLogo: Trying alternative logo', alternativeSrc);
      setCurrentLogoSrc(alternativeSrc);
      setImageError(true);
    } else {
      console.error('PersonalLogo: Both logos failed to load, showing fallback');
    }
  };

  // Show loading state while theme is being determined
  if (!mounted && showLoadingState) {
    return (
      <div className={`${config.className} ${className} flex items-center justify-center`}>
        <Image
          src={logoSrc}
          alt={alt}
          width={config.width}
          height={config.height}
          className="object-contain transition-opacity duration-200"
          priority
        />
      </div>
    );
  }

  // Show fallback if both logos failed to load
  if (imageError && currentLogoSrc) {
    return (
      <div className={`${config.className} ${className} flex items-center justify-center bg-stone-200 dark:bg-stone-700 rounded text-stone-600 dark:text-stone-300 font-semibold`}>
        JS
      </div>
    );
  }

  const logoElement = (
    <Image
      src={currentLogoSrc || logoSrc}
      alt={alt}
      width={config.width}
      height={config.height}
      className={`${config.className} ${className} object-contain transition-opacity duration-200`}
      priority
      onError={handleImageError}
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
