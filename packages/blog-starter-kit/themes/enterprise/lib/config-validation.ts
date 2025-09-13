/**
 * Configuration Validation Utilities
 * 
 * This module provides utilities for validating and sanitizing configuration values.
 * It ensures that configuration data meets security and format requirements.
 */

export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedValue?: any;
}

export interface SiteConfig {
  DOMAIN: string;
  BASE_URL: string;
  EMAIL: {
    FROM: string;
    REPLY_TO: string;
  };
  PHONE?: string;
  SOCIAL: {
    TWITTER?: string;
    LINKEDIN?: string;
    GITHUB?: string;
  };
}

/**
 * Validate site configuration
 */
export function validateSiteConfig(config: any): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config || typeof config !== 'object') {
    errors.push('Configuration must be an object');
    return { isValid: false, errors, warnings };
  }

  // Validate required fields
  if (!config.DOMAIN || typeof config.DOMAIN !== 'string') {
    errors.push('DOMAIN is required and must be a string');
  } else if (!validateDomain(config.DOMAIN)) {
    errors.push('DOMAIN must be a valid domain name');
  }

  if (!config.BASE_URL || typeof config.BASE_URL !== 'string') {
    errors.push('BASE_URL is required and must be a string');
  } else if (!validateUrl(config.BASE_URL)) {
    errors.push('BASE_URL must be a valid URL');
  }

  if (!config.EMAIL || typeof config.EMAIL !== 'object') {
    errors.push('EMAIL configuration is required');
  } else {
    if (!config.EMAIL.FROM || !validateEmail(config.EMAIL.FROM)) {
      errors.push('EMAIL.FROM must be a valid email address');
    }
    if (!config.EMAIL.REPLY_TO || !validateEmail(config.EMAIL.REPLY_TO)) {
      errors.push('EMAIL.REPLY_TO must be a valid email address');
    }
  }

  // Validate optional fields
  if (config.PHONE && !validatePhone(config.PHONE)) {
    warnings.push('PHONE format may be invalid');
  }

  if (config.SOCIAL) {
    Object.entries(config.SOCIAL).forEach(([key, value]) => {
      if (value && typeof value === 'string' && !validateUrl(value)) {
        warnings.push(`SOCIAL.${key} should be a valid URL`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedValue: errors.length === 0 ? sanitizeConfig(config) : undefined,
  };
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim();
  
  // Basic email regex that requires proper format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Additional checks for common invalid patterns
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return false;
  }
  
  // Check for spaces
  if (trimmedEmail.includes(' ')) {
    return false;
  }
  
  // Check that domain has at least one dot (TLD)
  const domain = trimmedEmail.split('@')[1];
  if (!domain || !domain.includes('.')) {
    return false;
  }
  
  return true;
}

/**
 * Validate and sanitize email address
 */
export function validateAndSanitizeEmail(email: string): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email must be a non-empty string');
    return { isValid: false, errors, warnings };
  }

  const sanitized = sanitizeInput(email.trim().toLowerCase());
  
  if (!validateEmail(sanitized)) {
    errors.push('Email format is invalid');
    return { isValid: false, errors, warnings };
  }

  if (sanitized !== email) {
    warnings.push('Email was sanitized');
  }

  return {
    isValid: true,
    errors,
    warnings,
    sanitizedValue: sanitized,
  };
}

/**
 * Validate URL
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Basic phone validation - allows various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  return phoneRegex.test(cleanPhone);
}

/**
 * Validate domain name
 */
export function validateDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') {
    return false;
  }

  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
}

/**
 * Get safe configuration value with fallback
 */
export function getSafeConfigValue<T>(value: T | undefined, fallback: T): T {
  return value !== undefined ? value : fallback;
}

/**
 * Sanitize input string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Sanitize configuration object
 */
export function sanitizeConfig(config: any): any {
  if (!config || typeof config !== 'object') {
    return config;
  }

  const sanitized: any = {};
  
  Object.entries(config).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeConfig(value);
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
}

/**
 * Log validation results
 */
export function logValidationResults(result: ConfigValidationResult, context: string = 'Configuration'): void {
  if (result.errors.length > 0) {
    console.error(`${context} validation failed:`, result.errors);
  }
  
  if (result.warnings.length > 0) {
    console.warn(`${context} validation warnings:`, result.warnings);
  }
  
  if (result.isValid) {
    console.log(`${context} validation passed`);
  }
}
