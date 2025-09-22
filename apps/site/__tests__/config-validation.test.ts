/**
 * Unit Tests for Configuration Validation
 * 
 * This test suite validates the configuration validation utilities
 * to ensure they work correctly and handle edge cases properly.
 * 
 * Addresses code review feedback from PR #37:
 * - Unit tests for configuration validation functions
 * - Error handling validation
 * - Edge case testing
 */

import {
  validateSiteConfig,
  validateEmail,
  validateAndSanitizeEmail,
  validateUrl,
  validatePhone,
  validateDomain,
  getSafeConfigValue,
  sanitizeInput,
  logValidationResults,
  ConfigValidationResult,
} from '../lib/config-validation';

// Mock SITE_CONFIG for testing
const mockSiteConfig = {
  DOMAIN: 'test.example.com',
  BASE_URL: 'https://test.example.com',
  EMAIL: {
    PRIMARY: 'test@example.com',
    CONTACT: 'contact@example.com',
    BOOKING: 'booking@example.com',
  },
  SOCIAL: {
    LINKEDIN: 'https://linkedin.com/in/test',
    GITHUB: 'https://github.com/test',
    TWITTER: 'https://twitter.com/test',
  },
  PERSONAL: {
    NAME: 'Test User',
    TITLE: 'Test Developer',
    LOCATION: 'Test City',
    PHONE: '123-456-7890',
  },
  SEO: {
    DESCRIPTION: 'Test description',
    KEYWORDS: ['test', 'development', 'example'],
  },
};

describe('Configuration Validation', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateAndSanitizeEmail', () => {
    it('should validate and sanitize correct email formats', () => {
      const result1 = validateAndSanitizeEmail('test@example.com');
      expect(result1.isValid).toBe(true);
      expect(result1.email).toBe('test@example.com');

      const result2 = validateAndSanitizeEmail('  USER.NAME@DOMAIN.CO.UK  ');
      expect(result2.isValid).toBe(true);
      expect(result2.email).toBe('user.name@domain.co.uk');

      const result3 = validateAndSanitizeEmail('Test+Tag@Example.Org');
      expect(result3.isValid).toBe(true);
      expect(result3.email).toBe('test+tag@example.org');
    });

    it('should reject invalid email formats with appropriate errors', () => {
      const result1 = validateAndSanitizeEmail('invalid-email');
      expect(result1.isValid).toBe(false);
      expect(result1.email).toBe('');
      expect(result1.error).toBe('Invalid email format');

      const result2 = validateAndSanitizeEmail('@example.com');
      expect(result2.isValid).toBe(false);
      expect(result2.email).toBe('');
      expect(result2.error).toBe('Invalid email format');

      const result3 = validateAndSanitizeEmail('test@');
      expect(result3.isValid).toBe(false);
      expect(result3.email).toBe('');
      expect(result3.error).toBe('Invalid email format');
    });

    it('should handle edge cases', () => {
      const result1 = validateAndSanitizeEmail('');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toBe('Email cannot be empty');

      const result2 = validateAndSanitizeEmail('   ');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBe('Email cannot be empty');

      const result3 = validateAndSanitizeEmail(null as any);
      expect(result3.isValid).toBe(false);
      expect(result3.error).toBe('Email is required');

      const result4 = validateAndSanitizeEmail(undefined as any);
      expect(result4.isValid).toBe(false);
      expect(result4.error).toBe('Email is required');

      const longEmail = 'a'.repeat(250) + '@example.com';
      const result5 = validateAndSanitizeEmail(longEmail);
      expect(result5.isValid).toBe(false);
      expect(result5.error).toBe('Email is too long');
    });

    it('should handle non-string input', () => {
      const result = validateAndSanitizeEmail(123 as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URL formats', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://test.example.org')).toBe(true);
      expect(validateUrl('https://subdomain.example.com/path')).toBe(true);
    });

    it('should reject invalid URL formats', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone formats', () => {
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('(123) 456-7890')).toBe(true);
      expect(validatePhone('+1 123 456 7890')).toBe(true);
      expect(validatePhone('123.456.7890')).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      expect(validatePhone('abc-def-ghij')).toBe(false);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('validateDomain', () => {
    it('should validate correct domain formats', () => {
      expect(validateDomain('example.com')).toBe(true);
      expect(validateDomain('test.example.org')).toBe(true);
      expect(validateDomain('subdomain.example.co.uk')).toBe(true);
    });

    it('should reject invalid domain formats', () => {
      expect(validateDomain('not-a-domain')).toBe(false);
      expect(validateDomain('.example.com')).toBe(false);
      expect(validateDomain('example.')).toBe(false);
      expect(validateDomain('')).toBe(false);
    });
  });

  describe('validateSiteConfig', () => {
    it('should validate a complete and correct configuration', () => {
      const result = validateSiteConfig(mockSiteConfig);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing domain', () => {
      const config = { ...mockSiteConfig, DOMAIN: '' };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid or missing domain configuration');
    });

    it('should detect invalid base URL', () => {
      const config = { ...mockSiteConfig, BASE_URL: 'not-a-url' };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid or missing base URL configuration');
    });

    it('should detect missing email configuration', () => {
      const config = { ...mockSiteConfig, EMAIL: undefined as any };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email configuration is missing');
    });

    it('should detect invalid email formats', () => {
      const config = {
        ...mockSiteConfig,
        EMAIL: { ...mockSiteConfig.EMAIL, PRIMARY: 'invalid-email' }
      };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Invalid email format'))).toBe(true);
    });

    it('should detect missing social configuration', () => {
      const config = { ...mockSiteConfig, SOCIAL: undefined as any };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Social configuration is missing');
    });

    it('should detect invalid social URLs', () => {
      const config = {
        ...mockSiteConfig,
        SOCIAL: { ...mockSiteConfig.SOCIAL, GITHUB: 'not-a-url' }
      };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Invalid URL format'))).toBe(true);
    });

    it('should detect missing personal configuration', () => {
      const config = { ...mockSiteConfig, PERSONAL: undefined as any };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Personal configuration is missing');
    });

    it('should detect invalid phone number', () => {
      const config = {
        ...mockSiteConfig,
        PERSONAL: { ...mockSiteConfig.PERSONAL, PHONE: 'invalid-phone' }
      };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Invalid phone number format'))).toBe(true);
    });

    it('should detect missing SEO configuration', () => {
      const config = { ...mockSiteConfig, SEO: undefined as any };
      const result = validateSiteConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('SEO configuration is missing');
    });

    it('should warn about long SEO descriptions', () => {
      const config = {
        ...mockSiteConfig,
        SEO: {
          ...mockSiteConfig.SEO,
          DESCRIPTION: 'A'.repeat(200) // Longer than 160 characters
        }
      };
      const result = validateSiteConfig(config);
      expect(result.warnings.some(warning => warning.includes('longer than recommended'))).toBe(true);
    });

    it('should handle validation errors gracefully', () => {
      // Mock a function that throws an error
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      const result = validateSiteConfig(null as any);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Configuration validation failed'))).toBe(true);
      
      console.error = originalConsoleError;
    });
  });

  describe('getSafeConfigValue', () => {
    it('should return the value when it exists', () => {
      const result = getSafeConfigValue('test-value', 'fallback', 'test-field');
      expect(result).toBe('test-value');
    });

    it('should return fallback for undefined value', () => {
      const result = getSafeConfigValue(undefined, 'fallback', 'test-field');
      expect(result).toBe('fallback');
    });

    it('should return fallback for null value', () => {
      const result = getSafeConfigValue(null, 'fallback', 'test-field');
      expect(result).toBe('fallback');
    });

    it('should return fallback for empty string', () => {
      const result = getSafeConfigValue('', 'fallback', 'test-field');
      expect(result).toBe('fallback');
    });

    it('should return fallback for whitespace-only string', () => {
      const result = getSafeConfigValue('   ', 'fallback', 'test-field');
      expect(result).toBe('fallback');
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML tags', () => {
      const result = sanitizeInput('<script>alert("test")</script>');
      expect(result).toBe('scriptalert("test")/script');
    });

    it('should remove javascript: protocol', () => {
      const result = sanitizeInput('javascript:alert("test")');
      expect(result).toBe('alert("test")');
    });

    it('should remove event handlers', () => {
      const result = sanitizeInput('onclick="alert(\'test\')"');
      expect(result).toBe('"alert(\'test\')"');
    });

    it('should limit input length', () => {
      const longInput = 'a'.repeat(2000);
      const result = sanitizeInput(longInput);
      expect(result.length).toBe(1000);
    });

    it('should handle non-string input', () => {
      const result = sanitizeInput(123 as any);
      expect(result).toBe('');
    });

    it('should trim whitespace', () => {
      const result = sanitizeInput('  test  ');
      expect(result).toBe('test');
    });
  });

  describe('logValidationResults', () => {
    let consoleSpy: {
      log: jest.SpyInstance;
      error: jest.SpyInstance;
      warn: jest.SpyInstance;
    };

    beforeEach(() => {
      consoleSpy = {
        log: jest.spyOn(console, 'log').mockImplementation(),
        error: jest.spyOn(console, 'error').mockImplementation(),
        warn: jest.spyOn(console, 'warn').mockImplementation(),
      };
    });

    afterEach(() => {
      Object.values(consoleSpy).forEach(spy => spy.mockRestore());
    });

    it('should log success for valid configuration', () => {
      const result: ConfigValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        missingFields: [],
      };

      logValidationResults(result, 'Test Config');
      expect(consoleSpy.log).toHaveBeenCalledWith('✅ Test Config validation passed');
    });

    it('should log errors for invalid configuration', () => {
      const result: ConfigValidationResult = {
        isValid: false,
        errors: ['Test error 1', 'Test error 2'],
        warnings: [],
        missingFields: [],
      };

      logValidationResults(result, 'Test Config');
      expect(consoleSpy.error).toHaveBeenCalledWith('❌ Test Config validation failed:');
      expect(consoleSpy.error).toHaveBeenCalledWith('  - Test error 1');
      expect(consoleSpy.error).toHaveBeenCalledWith('  - Test error 2');
    });

    it('should log warnings', () => {
      const result: ConfigValidationResult = {
        isValid: true,
        errors: [],
        warnings: ['Test warning 1', 'Test warning 2'],
        missingFields: [],
      };

      logValidationResults(result, 'Test Config');
      expect(consoleSpy.warn).toHaveBeenCalledWith('⚠️ Test Config validation warnings:');
      expect(consoleSpy.warn).toHaveBeenCalledWith('  - Test warning 1');
      expect(consoleSpy.warn).toHaveBeenCalledWith('  - Test warning 2');
    });

    it('should log missing fields', () => {
      const result: ConfigValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        missingFields: ['field1', 'field2'],
      };

      logValidationResults(result, 'Test Config');
      expect(consoleSpy.warn).toHaveBeenCalledWith('📝 Missing fields: field1, field2');
    });
  });
});
