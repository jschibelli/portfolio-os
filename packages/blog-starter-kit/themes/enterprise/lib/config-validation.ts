/**
 * Configuration Validation Utilities
 * 
 * This module provides comprehensive validation for SITE_CONFIG and other
 * configuration objects to ensure data integrity and prevent runtime errors.
 * 
 * Addresses code review feedback from PR #37:
 * - Config validation for missing or incorrect SITE_CONFIG values
 * - Error handling for configuration-related issues
 * - Type safety improvements for configuration objects
 */

import { SITE_CONFIG } from '../config/constants';

// Type definitions for configuration validation
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
}

export interface EmailConfig {
  PRIMARY: string;
  CONTACT: string;
  BOOKING: string;
}

export interface SocialConfig {
  LINKEDIN: string;
  GITHUB: string;
  TWITTER: string;
}

export interface PersonalConfig {
  NAME: string;
  TITLE: string;
  LOCATION: string;
  PHONE: string;
}

export interface SEOConfig {
  DESCRIPTION: string;
  KEYWORDS: readonly string[];
}

export interface SiteConfigType {
  DOMAIN: string;
  BASE_URL: string;
  EMAIL: EmailConfig;
  SOCIAL: SocialConfig;
  PERSONAL: PersonalConfig;
  SEO: SEOConfig;
}

// Validation rules and patterns
const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^[\d\s\-\(\)\+\.]+$/,
  DOMAIN: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
} as const;

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return VALIDATION_PATTERNS.EMAIL.test(email.trim());
}

/**
 * Validates and sanitizes email address
 */
export function validateAndSanitizeEmail(email: string): { isValid: boolean; email: string; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, email: '', error: 'Email is required' };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.length === 0) {
    return { isValid: false, email: '', error: 'Email cannot be empty' };
  }
  
  if (trimmedEmail.length > 254) {
    return { isValid: false, email: '', error: 'Email is too long' };
  }
  
  if (!validateEmail(trimmedEmail)) {
    return { isValid: false, email: '', error: 'Invalid email format' };
  }
  
  return { isValid: true, email: trimmedEmail };
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): boolean {
  return VALIDATION_PATTERNS.URL.test(url);
}

/**
 * Validates phone number format
 */
export function validatePhone(phone: string): boolean {
  return VALIDATION_PATTERNS.PHONE.test(phone);
}

/**
 * Validates domain format
 */
export function validateDomain(domain: string): boolean {
  return VALIDATION_PATTERNS.DOMAIN.test(domain);
}

/**
 * Comprehensive validation of the entire SITE_CONFIG object
 */
export function validateSiteConfig(config: SiteConfigType = SITE_CONFIG): ConfigValidationResult {
  const result: ConfigValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    missingFields: [],
  };

  try {
    // Validate domain
    if (!config.DOMAIN || !validateDomain(config.DOMAIN)) {
      result.isValid = false;
      result.errors.push('Invalid or missing domain configuration');
    }

    // Validate base URL
    if (!config.BASE_URL || !validateUrl(config.BASE_URL)) {
      result.isValid = false;
      result.errors.push('Invalid or missing base URL configuration');
    }

    // Validate email configuration
    if (config.EMAIL) {
      Object.entries(config.EMAIL).forEach(([key, email]) => {
        if (!email || email.trim() === '') {
          result.isValid = false;
          result.missingFields.push(`EMAIL.${key}`);
          result.errors.push(`Email ${key} is required`);
        } else if (!validateEmail(email)) {
          result.isValid = false;
          result.errors.push(`Invalid email format for ${key}: ${email}`);
        }
      });
    } else {
      result.isValid = false;
      result.errors.push('Email configuration is missing');
    }

    // Validate social configuration
    if (config.SOCIAL) {
      Object.entries(config.SOCIAL).forEach(([key, url]) => {
        if (!url || url.trim() === '') {
          result.isValid = false;
          result.missingFields.push(`SOCIAL.${key}`);
          result.errors.push(`Social ${key} URL is required`);
        } else if (!validateUrl(url)) {
          result.isValid = false;
          result.errors.push(`Invalid URL format for ${key}: ${url}`);
        }
      });
    } else {
      result.isValid = false;
      result.errors.push('Social configuration is missing');
    }

    // Validate personal configuration
    if (config.PERSONAL) {
      Object.entries(config.PERSONAL).forEach(([key, value]) => {
        if (!value || value.toString().trim() === '') {
          result.isValid = false;
          result.missingFields.push(`PERSONAL.${key}`);
          result.errors.push(`Personal ${key} is required`);
        }
      });

      // Validate phone number format
      if (config.PERSONAL.PHONE && !validatePhone(config.PERSONAL.PHONE)) {
        result.isValid = false;
        result.errors.push(`Invalid phone number format: ${config.PERSONAL.PHONE}`);
      }
    } else {
      result.isValid = false;
      result.errors.push('Personal configuration is missing');
    }

    // Validate SEO configuration
    if (config.SEO) {
      if (!config.SEO.DESCRIPTION || config.SEO.DESCRIPTION.trim() === '') {
        result.isValid = false;
        result.missingFields.push('SEO.DESCRIPTION');
        result.errors.push('SEO description is required');
      } else if (config.SEO.DESCRIPTION.length > 160) {
        result.warnings.push('SEO description is longer than recommended 160 characters');
      }

      if (!config.SEO.KEYWORDS || !Array.isArray(config.SEO.KEYWORDS) || config.SEO.KEYWORDS.length === 0) {
        result.isValid = false;
        result.missingFields.push('SEO.KEYWORDS');
        result.errors.push('SEO keywords are required');
      }
    } else {
      result.isValid = false;
      result.errors.push('SEO configuration is missing');
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Configuration validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Gets a safe configuration value with fallback
 */
export function getSafeConfigValue<T>(
  value: T | undefined | null,
  fallback: T,
  fieldName: string
): T {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    console.warn(`Configuration warning: ${fieldName} is missing or empty, using fallback value`);
    return fallback;
  }
  return value;
}

/**
 * Sanitizes input for security
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Logs configuration validation results
 */
export function logValidationResults(result: ConfigValidationResult, context: string = 'Configuration'): void {
  if (result.isValid) {
    console.log(`✅ ${context} validation passed`);
  } else {
    console.error(`❌ ${context} validation failed:`);
    result.errors.forEach(error => console.error(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.warn(`⚠️ ${context} validation warnings:`);
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  if (result.missingFields.length > 0) {
    console.warn(`📝 Missing fields: ${result.missingFields.join(', ')}`);
  }
}