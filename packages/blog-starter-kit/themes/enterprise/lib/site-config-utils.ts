/**
 * Site Configuration Utilities
 * 
 * This module provides utilities for safely accessing and validating SITE_CONFIG
 * values with proper error handling and fallback mechanisms.
 * 
 * Addresses code review feedback from PR #37 about SITE_CONFIG usage:
 * - Error handling for missing or incorrect SITE_CONFIG values
 * - Config validation for required fields
 * - Consistent usage patterns across the application
 * - Security measures for configuration access
 */

import { SITE_CONFIG } from '../config/constants';
import { validateSiteConfig, getSafeConfigValue, logValidationResults } from './config-validation';

// Type definitions for safe config access
export interface SafeConfigResult<T> {
  value: T;
  isValid: boolean;
  source: 'config' | 'fallback' | 'error';
  error?: string;
}

export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
}

// Fallback values for critical configuration
const FALLBACK_VALUES = {
  DOMAIN: 'johnschibelli.dev',
  BASE_URL: 'https://johnschibelli.dev',
  EMAIL: {
    PRIMARY: 'john@johnschibelli.dev',
    CONTACT: 'john@johnschibelli.dev',
    BOOKING: 'john@johnschibelli.dev',
  },
  SOCIAL: {
    LINKEDIN: 'https://linkedin.com/in/johnschibelli',
    GITHUB: 'https://github.com/jschibelli',
    TWITTER: 'https://twitter.com/johnschibelli',
  },
  PERSONAL: {
    NAME: 'John Schibelli',
    TITLE: 'Senior Front-End Developer',
    LOCATION: 'Towaco, NJ',
    PHONE: '862.207.9004',
  },
  SEO: {
    DESCRIPTION: 'Senior Front-End Developer with 15+ years of experience building scalable, high-performance web applications.',
    KEYWORDS: ['John Schibelli', 'Front-End Developer', 'React Developer', 'Next.js Developer'],
  },
} as const;

/**
 * Safely gets a configuration value with fallback and validation
 */
export function getSafeConfig<T>(
  getter: () => T,
  fallback: T,
  fieldName: string,
  required: boolean = true
): SafeConfigResult<T> {
  try {
    const value = getter();
    
    // Check if value is valid
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      if (required) {
        console.warn(`⚠️ Required SITE_CONFIG field '${fieldName}' is missing or empty, using fallback`);
        return {
          value: fallback,
          isValid: false,
          source: 'fallback',
          error: `Required field '${fieldName}' is missing or empty`
        };
      } else {
        return {
          value: fallback,
          isValid: true,
          source: 'fallback'
        };
      }
    }
    
    return {
      value,
      isValid: true,
      source: 'config'
    };
  } catch (error) {
    console.error(`❌ Error accessing SITE_CONFIG field '${fieldName}':`, error);
    return {
      value: fallback,
      isValid: false,
      source: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Gets safe domain configuration
 */
export function getSafeDomain(): SafeConfigResult<string> {
  return getSafeConfig(
    () => SITE_CONFIG.DOMAIN,
    FALLBACK_VALUES.DOMAIN,
    'DOMAIN',
    true
  );
}

/**
 * Gets safe base URL configuration
 */
export function getSafeBaseUrl(): SafeConfigResult<string> {
  return getSafeConfig(
    () => SITE_CONFIG.BASE_URL,
    FALLBACK_VALUES.BASE_URL,
    'BASE_URL',
    true
  );
}

/**
 * Gets safe email configuration
 */
export function getSafeEmail(type: keyof typeof SITE_CONFIG.EMAIL = 'PRIMARY'): SafeConfigResult<string> {
  return getSafeConfig(
    () => SITE_CONFIG.EMAIL[type],
    FALLBACK_VALUES.EMAIL[type],
    `EMAIL.${type}`,
    true
  );
}

/**
 * Gets safe social media configuration
 */
export function getSafeSocial(type: keyof typeof SITE_CONFIG.SOCIAL): SafeConfigResult<string> {
  return getSafeConfig(
    () => SITE_CONFIG.SOCIAL[type],
    FALLBACK_VALUES.SOCIAL[type],
    `SOCIAL.${type}`,
    true
  );
}

/**
 * Gets safe personal information configuration
 */
export function getSafePersonal(type: keyof typeof SITE_CONFIG.PERSONAL): SafeConfigResult<string> {
  return getSafeConfig(
    () => SITE_CONFIG.PERSONAL[type],
    FALLBACK_VALUES.PERSONAL[type],
    `PERSONAL.${type}`,
    true
  );
}

/**
 * Gets safe SEO configuration
 */
export function getSafeSEO(type: keyof typeof SITE_CONFIG.SEO): SafeConfigResult<string | readonly string[]> {
  return getSafeConfig(
    () => SITE_CONFIG.SEO[type],
    FALLBACK_VALUES.SEO[type],
    `SEO.${type}`,
    true
  );
}

/**
 * Validates SITE_CONFIG and returns validation results
 */
export function validateSiteConfigSafe(): ConfigValidationResult {
  try {
    const validation = validateSiteConfig(SITE_CONFIG);
    logValidationResults(validation, 'SITE_CONFIG');
    return validation;
  } catch (error) {
    console.error('❌ SITE_CONFIG validation failed:', error);
    return {
      isValid: false,
      errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
      missingFields: []
    };
  }
}

/**
 * Gets all social media links safely
 */
export function getSafeSocialLinks(): Record<string, SafeConfigResult<string>> {
  return {
    linkedin: getSafeSocial('LINKEDIN'),
    github: getSafeSocial('GITHUB'),
    twitter: getSafeSocial('TWITTER'),
  };
}

/**
 * Gets all email addresses safely
 */
export function getSafeEmailAddresses(): Record<string, SafeConfigResult<string>> {
  return {
    primary: getSafeEmail('PRIMARY'),
    contact: getSafeEmail('CONTACT'),
    booking: getSafeEmail('BOOKING'),
  };
}

/**
 * Gets all personal information safely
 */
export function getSafePersonalInfo(): Record<string, SafeConfigResult<string>> {
  return {
    name: getSafePersonal('NAME'),
    title: getSafePersonal('TITLE'),
    location: getSafePersonal('LOCATION'),
    phone: getSafePersonal('PHONE'),
  };
}

/**
 * Gets SEO information safely
 */
export function getSafeSEOInfo(): Record<string, SafeConfigResult<string | readonly string[]>> {
  return {
    description: getSafeSEO('DESCRIPTION'),
    keywords: getSafeSEO('KEYWORDS'),
  };
}

/**
 * Creates a safe structured data object for person schema
 */
export function createSafePersonStructuredData() {
  const baseUrl = getSafeBaseUrl();
  const personal = getSafePersonalInfo();
  const social = getSafeSocialLinks();
  const seo = getSafeSEOInfo();
  
  return {
    name: personal.name.value,
    description: typeof seo.description.value === 'string' ? seo.description.value : '',
    url: baseUrl.value,
    jobTitle: personal.title.value,
    sameAs: [
      social.linkedin.value,
      social.github.value,
      social.twitter.value,
    ].filter(url => url && url.trim() !== ''),
    // Add validation metadata
    _metadata: {
      isValid: baseUrl.isValid && personal.name.isValid && personal.title.isValid,
      errors: [
        ...(baseUrl.error ? [baseUrl.error] : []),
        ...(personal.name.error ? [personal.name.error] : []),
        ...(personal.title.error ? [personal.title.error] : []),
      ],
      sources: {
        baseUrl: baseUrl.source,
        name: personal.name.source,
        title: personal.title.source,
      }
    }
  };
}

/**
 * Creates a safe structured data object for organization schema
 */
export function createSafeOrganizationStructuredData() {
  const baseUrl = getSafeBaseUrl();
  const personal = getSafePersonalInfo();
  const email = getSafeEmailAddresses();
  
  return {
    name: personal.name.value,
    url: baseUrl.value,
    logo: `${baseUrl.value}/logo.png`,
    contactPoint: {
      email: email.contact.value,
      telephone: personal.phone.value,
    },
    address: {
      addressLocality: personal.location.value,
    },
    // Add validation metadata
    _metadata: {
      isValid: baseUrl.isValid && personal.name.isValid && email.contact.isValid,
      errors: [
        ...(baseUrl.error ? [baseUrl.error] : []),
        ...(personal.name.error ? [personal.name.error] : []),
        ...(email.contact.error ? [email.contact.error] : []),
      ],
      sources: {
        baseUrl: baseUrl.source,
        name: personal.name.source,
        email: email.contact.source,
      }
    }
  };
}

/**
 * Validates and logs configuration health
 */
export function validateConfigurationHealth(): boolean {
  console.log('🔍 Validating SITE_CONFIG health...');
  
  const validation = validateSiteConfigSafe();
  const socialLinks = getSafeSocialLinks();
  const emails = getSafeEmailAddresses();
  const personal = getSafePersonalInfo();
  
  let hasErrors = false;
  
  // Check for critical errors
  if (!validation.isValid) {
    console.error('❌ SITE_CONFIG validation failed');
    hasErrors = true;
  }
  
  // Check social links
  Object.entries(socialLinks).forEach(([platform, result]) => {
    if (!result.isValid) {
      console.warn(`⚠️ Social link for ${platform} is invalid: ${result.error}`);
    }
  });
  
  // Check email addresses
  Object.entries(emails).forEach(([type, result]) => {
    if (!result.isValid) {
      console.warn(`⚠️ Email address for ${type} is invalid: ${result.error}`);
    }
  });
  
  // Check personal information
  Object.entries(personal).forEach(([field, result]) => {
    if (!result.isValid) {
      console.warn(`⚠️ Personal information for ${field} is invalid: ${result.error}`);
    }
  });
  
  if (!hasErrors) {
    console.log('✅ SITE_CONFIG health check passed');
  }
  
  return !hasErrors;
}

/**
 * Gets configuration summary for debugging
 */
export function getConfigurationSummary(): Record<string, any> {
  const validation = validateSiteConfigSafe();
  const socialLinks = getSafeSocialLinks();
  const emails = getSafeEmailAddresses();
  const personal = getSafePersonalInfo();
  const seo = getSafeSEOInfo();
  
  return {
    validation: {
      isValid: validation.isValid,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
      missingFields: validation.missingFields,
    },
    socialLinks: Object.fromEntries(
      Object.entries(socialLinks).map(([key, result]) => [key, {
        value: result.value,
        isValid: result.isValid,
        source: result.source
      }])
    ),
    emails: Object.fromEntries(
      Object.entries(emails).map(([key, result]) => [key, {
        value: result.value,
        isValid: result.isValid,
        source: result.source
      }])
    ),
    personal: Object.fromEntries(
      Object.entries(personal).map(([key, result]) => [key, {
        value: result.value,
        isValid: result.isValid,
        source: result.source
      }])
    ),
    seo: Object.fromEntries(
      Object.entries(seo).map(([key, result]) => [key, {
        value: result.value,
        isValid: result.isValid,
        source: result.source
      }])
    ),
  };
}

// Export default
export default {
  getSafeConfig,
  getSafeDomain,
  getSafeBaseUrl,
  getSafeEmail,
  getSafeSocial,
  getSafePersonal,
  getSafeSEO,
  validateSiteConfigSafe,
  getSafeSocialLinks,
  getSafeEmailAddresses,
  getSafePersonalInfo,
  getSafeSEOInfo,
  createSafePersonStructuredData,
  createSafeOrganizationStructuredData,
  validateConfigurationHealth,
  getConfigurationSummary,
};
