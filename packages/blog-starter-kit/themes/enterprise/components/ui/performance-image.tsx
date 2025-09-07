'use client'

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { performanceMonitor, useImagePerformanceTracking } from '@/lib/performance-monitor';
import { validateAltText, checkImageAccessibility, ariaUtils } from '@/lib/accessibility-utils';

interface PerformanceImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (error: string) => void;
  fallbackSrc?: string;
  showLoadingIndicator?: boolean;
  enablePerformanceTracking?: boolean;
}

/**
 * Enhanced Image component with performance tracking and accessibility improvements
 */
export function PerformanceImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc,
  showLoadingIndicator = true,
  enablePerformanceTracking = true,
}: PerformanceImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const loadStartTime = useRef<number>(0);
  const { trackImageLoad, trackImageError } = useImagePerformanceTracking();

  // Validate alt text for accessibility
  const validateAltTextForComponent = useCallback((altText: string): boolean => {
    const validation = validateAltText(altText);
    if (!validation.isValid) {
      console.warn('Image accessibility issue:', validation.message);
      return false;
    }
    return true;
  }, []);

  // Handle image load start
  const handleLoadStart = useCallback(() => {
    if (enablePerformanceTracking) {
      loadStartTime.current = performance.now();
    }
    setIsLoading(true);
    setHasError(false);
  }, [enablePerformanceTracking]);

  // Handle successful image load
  const handleLoad = useCallback(() => {
    const endTime = performance.now();
    
    if (enablePerformanceTracking && loadStartTime.current > 0) {
      const loadTime = endTime - loadStartTime.current;
      trackImageLoad(currentSrc, loadStartTime.current, endTime);
    }

    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [currentSrc, enablePerformanceTracking, trackImageLoad, onLoad]);

  // Handle image load error
  const handleError = useCallback((error: string) => {
    const endTime = performance.now();
    
    if (enablePerformanceTracking && loadStartTime.current > 0) {
      trackImageError(currentSrc, error, loadStartTime.current);
    }

    setIsLoading(false);
    setHasError(true);
    onError?.(error);
  }, [currentSrc, enablePerformanceTracking, trackImageError, onError]);

  // Retry loading the image
  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setHasError(false);
      setIsLoading(true);
      
      // Add cache busting parameter for retry
      const separator = currentSrc.includes('?') ? '&' : '?';
      setCurrentSrc(`${currentSrc}${separator}_retry=${retryCount + 1}`);
    }
  }, [retryCount, currentSrc]);

  // Use fallback image if available
  const handleFallback = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setRetryCount(0);
    }
  }, [fallbackSrc, currentSrc]);

  // Validate alt text
  const isValidAlt = validateAltTextForComponent(alt);

  return (
    <div className={`relative ${className}`}>
      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center z-10">
          <div className="text-gray-400 text-sm flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading...
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div 
          id="image-error"
          className="absolute inset-0 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center z-10"
          role="alert"
          aria-live="polite"
        >
          <div className="text-gray-500 text-sm text-center p-4">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">{ariaUtils.errorLabel(alt)}</p>
            <p className="text-xs mt-1 mb-3">Please check the URL and try again</p>
            
            <div className="flex gap-2">
              {retryCount < 3 && (
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  aria-label={`Retry loading image: ${alt}`}
                >
                  Retry
                </button>
              )}
              {fallbackSrc && currentSrc !== fallbackSrc && (
                <button
                  onClick={handleFallback}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  aria-label={`Use fallback image for: ${alt}`}
                >
                  Use Fallback
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main image */}
      <Image
        src={currentSrc}
        alt={isValidAlt ? alt : 'Image'}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={loading}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={() => handleError('Network error or invalid image')}
        // Accessibility improvements
        role="img"
        aria-label={isLoading ? ariaUtils.loadingLabel(alt) : alt}
        aria-describedby={hasError ? 'image-error' : undefined}
        // Performance optimizations
        sizes={width ? `${width}px` : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      />

      {/* Accessibility warning for missing alt text */}
      {!isValidAlt && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-1 right-1 bg-yellow-100 border border-yellow-300 rounded px-2 py-1 text-xs text-yellow-800 z-20">
          ⚠️ Missing alt text
        </div>
      )}
    </div>
  );
}

/**
 * Progressive image loading component with multiple quality levels
 */
export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  lowQualitySrc,
  mediumQualitySrc,
  highQualitySrc,
  ...props
}: PerformanceImageProps & {
  lowQualitySrc?: string;
  mediumQualitySrc?: string;
  highQualitySrc?: string;
}) {
  const [currentQuality, setCurrentQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [isLoaded, setIsLoaded] = useState(false);

  const getSrcForQuality = (quality: 'low' | 'medium' | 'high') => {
    switch (quality) {
      case 'low': return lowQualitySrc || src;
      case 'medium': return mediumQualitySrc || src;
      case 'high': return highQualitySrc || src;
      default: return src;
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    
    // Progressively load higher quality images
    if (currentQuality === 'low' && (mediumQualitySrc || highQualitySrc)) {
      setTimeout(() => setCurrentQuality('medium'), 100);
    } else if (currentQuality === 'medium' && highQualitySrc) {
      setTimeout(() => setCurrentQuality('high'), 100);
    }
  };

  return (
    <PerformanceImage
      src={getSrcForQuality(currentQuality)}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${!isLoaded ? 'blur-sm' : 'blur-0'} transition-all duration-500`}
      onLoad={handleLoad}
      {...props}
    />
  );
}
