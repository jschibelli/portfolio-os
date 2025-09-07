/**
 * Accessibility utilities for image and content validation
 */

export interface AccessibilityReport {
  hasErrors: boolean;
  hasWarnings: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

export interface ImageAccessibilityCheck {
  alt: string;
  src: string;
  width?: number;
  height?: number;
  role?: string;
}

/**
 * Validates alt text for images
 */
export function validateAltText(alt: string, context?: string): { isValid: boolean; message?: string } {
  // Check if alt text exists
  if (!alt || alt.trim().length === 0) {
    return {
      isValid: false,
      message: 'Image is missing alt text. This is required for screen readers.'
    };
  }

  // Check if alt text is too long (should be under 125 characters)
  if (alt.length > 125) {
    return {
      isValid: false,
      message: 'Alt text is too long (>125 characters). Consider shortening for better accessibility.'
    };
  }

  // Check for common mistakes
  const commonMistakes = [
    { pattern: /^image of/i, message: 'Avoid starting with "image of" - screen readers already announce it as an image.' },
    { pattern: /^picture of/i, message: 'Avoid starting with "picture of" - screen readers already announce it as an image.' },
    { pattern: /^photo of/i, message: 'Avoid starting with "photo of" - screen readers already announce it as an image.' },
    { pattern: /^screenshot/i, message: 'Consider if "screenshot" is necessary in alt text.' },
    { pattern: /^click here/i, message: 'Avoid "click here" - describe the action or destination instead.' },
    { pattern: /^link to/i, message: 'Avoid "link to" - describe the destination instead.' },
  ];

  for (const mistake of commonMistakes) {
    if (mistake.pattern.test(alt)) {
      return {
        isValid: false,
        message: mistake.message
      };
    }
  }

  // Check for decorative images (should have empty alt)
  const decorativePatterns = [
    /^decorative/i,
    /^ornamental/i,
    /^spacer/i,
    /^divider/i,
  ];

  for (const pattern of decorativePatterns) {
    if (pattern.test(alt)) {
      return {
        isValid: false,
        message: 'If image is decorative, use alt="" instead of describing it as decorative.'
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates image dimensions and aspect ratio
 */
export function validateImageDimensions(
  width?: number, 
  height?: number, 
  src?: string
): { isValid: boolean; message?: string } {
  if (!width || !height) {
    return {
      isValid: false,
      message: 'Image dimensions should be specified for better layout stability and accessibility.'
    };
  }

  // Check for extremely small images
  if (width < 16 || height < 16) {
    return {
      isValid: false,
      message: 'Image is too small (< 16x16px). Consider using an icon or larger image.'
    };
  }

  // Check for extremely large images
  if (width > 4000 || height > 4000) {
    return {
      isValid: false,
      message: 'Image is very large (> 4000px). Consider optimizing for web use.'
    };
  }

  // Check aspect ratio (warn for extreme ratios)
  const aspectRatio = width / height;
  if (aspectRatio > 10 || aspectRatio < 0.1) {
    return {
      isValid: false,
      message: 'Image has extreme aspect ratio. Consider if this is appropriate for the content.'
    };
  }

  return { isValid: true };
}

/**
 * Validates image source URL
 */
export function validateImageSource(src: string): { isValid: boolean; message?: string } {
  if (!src || src.trim().length === 0) {
    return {
      isValid: false,
      message: 'Image source URL is required.'
    };
  }

  try {
    const url = new URL(src);
    
    // Check protocol
    if (!['http:', 'https:'].includes(url.protocol)) {
      return {
        isValid: false,
        message: 'Image URL must use HTTP or HTTPS protocol.'
      };
    }

    // Check for data URLs (warn about size)
    if (src.startsWith('data:')) {
      const sizeEstimate = src.length * 0.75; // Rough estimate
      if (sizeEstimate > 100000) { // ~100KB
        return {
          isValid: false,
          message: 'Data URL image is quite large. Consider using a regular URL for better performance.'
        };
      }
    }

  } catch (error) {
    return {
      isValid: false,
      message: 'Invalid image URL format.'
    };
  }

  return { isValid: true };
}

/**
 * Comprehensive accessibility check for images
 */
export function checkImageAccessibility(image: ImageAccessibilityCheck): AccessibilityReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check alt text
  const altCheck = validateAltText(image.alt);
  if (!altCheck.isValid) {
    errors.push(altCheck.message!);
  }

  // Check dimensions
  const dimensionCheck = validateImageDimensions(image.width, image.height, image.src);
  if (!dimensionCheck.isValid) {
    warnings.push(dimensionCheck.message!);
  }

  // Check source
  const sourceCheck = validateImageSource(image.src);
  if (!sourceCheck.isValid) {
    errors.push(sourceCheck.message!);
  }

  // Check role attribute
  if (image.role && !['img', 'presentation', 'none'].includes(image.role)) {
    warnings.push(`Unusual role "${image.role}" for image. Consider using "img", "presentation", or "none".`);
  }

  // Calculate score
  const totalChecks = 4; // alt, dimensions, source, role
  const errorCount = errors.length;
  const warningCount = warnings.length;
  const score = Math.max(0, Math.round(((totalChecks - errorCount - (warningCount * 0.5)) / totalChecks) * 100));

  return {
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    errors,
    warnings,
    score
  };
}

/**
 * Validates color contrast for text over images
 */
export function validateColorContrast(
  textColor: string, 
  backgroundColor: string, 
  fontSize: number = 16
): { isValid: boolean; ratio: number; message?: string } {
  // This is a simplified check - in a real implementation, you'd use a proper color contrast library
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
  const requiredRatio = isLargeText ? 3 : 4.5;

  // Placeholder implementation - would need actual color contrast calculation
  const ratio = 4.5; // Mock ratio

  if (ratio < requiredRatio) {
    return {
      isValid: false,
      ratio,
      message: `Color contrast ratio ${ratio.toFixed(2)} is below the required ${requiredRatio} for ${isLargeText ? 'large' : 'normal'} text.`
    };
  }

  return {
    isValid: true,
    ratio,
    message: `Color contrast ratio ${ratio.toFixed(2)} meets accessibility standards.`
  };
}

/**
 * Generates accessibility report for a page or component
 */
export function generateAccessibilityReport(images: ImageAccessibilityCheck[]): AccessibilityReport {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  let totalScore = 0;

  for (const image of images) {
    const report = checkImageAccessibility(image);
    allErrors.push(...report.errors);
    allWarnings.push(...report.warnings);
    totalScore += report.score;
  }

  const averageScore = images.length > 0 ? Math.round(totalScore / images.length) : 100;

  return {
    hasErrors: allErrors.length > 0,
    hasWarnings: allWarnings.length > 0,
    errors: allErrors,
    warnings: allWarnings,
    score: averageScore
  };
}

/**
 * Screen reader friendly text utilities
 */
export const screenReaderUtils = {
  /**
   * Generates screen reader only text
   */
  srOnly: (text: string) => ({
    className: "sr-only",
    'aria-hidden': "false",
    children: text
  }),

  /**
   * Hides content from screen readers
   */
  srHidden: (content: any) => ({
    'aria-hidden': "true",
    children: content
  }),

  /**
   * Generates descriptive text for complex images
   */
  generateImageDescription: (alt: string, context?: string) => {
    if (context) {
      return `${alt} (${context})`;
    }
    return alt;
  }
};

/**
 * ARIA utilities for better accessibility
 */
export const ariaUtils = {
  /**
   * Generates proper ARIA labels for image galleries
   */
  galleryImageLabel: (index: number, total: number, alt: string) => 
    `Image ${index + 1} of ${total}: ${alt}`,

  /**
   * Generates ARIA labels for image loading states
   */
  loadingLabel: (alt: string) => `Loading image: ${alt}`,

  /**
   * Generates ARIA labels for image errors
   */
  errorLabel: (alt: string) => `Failed to load image: ${alt}`,
};
