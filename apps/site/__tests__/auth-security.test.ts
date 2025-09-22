import { 
  isRateLimited, 
  recordFailedAttempt, 
  clearFailedAttempts, 
  clearAllRateLimitData,
  getLockoutTimeRemaining,
  securePasswordCompare,
  validatePasswordStrength,
  sanitizeInput,
  generateSecureToken
} from '../lib/auth-security';
import { validateEmail } from '../lib/config-validation';
import bcrypt from 'bcrypt';

describe('Authentication Security', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    clearAllRateLimitData();
    jest.clearAllMocks();
  });

  describe('Rate Limiting', () => {
    it('should not rate limit new identifiers', () => {
      expect(isRateLimited('test@example.com:192.168.1.1')).toBe(false);
    });

    it('should rate limit after max attempts', () => {
      const identifier = 'test@example.com:192.168.1.1';
      
      // Record 5 failed attempts
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(identifier);
      }
      
      expect(isRateLimited(identifier)).toBe(true);
    });

    it('should clear failed attempts', () => {
      const identifier = 'test@example.com:192.168.1.1';
      
      // Record failed attempts
      recordFailedAttempt(identifier);
      recordFailedAttempt(identifier);
      
      expect(isRateLimited(identifier)).toBe(false); // Still under limit
      
      // Clear attempts
      clearFailedAttempts(identifier);
      
      // Should not be rate limited anymore
      expect(isRateLimited(identifier)).toBe(false);
    });

    it('should return correct lockout time remaining', () => {
      const identifier = 'test@example.com:192.168.1.1';
      
      // Record max attempts to trigger lockout
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(identifier);
      }
      
      const remaining = getLockoutTimeRemaining(identifier);
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(30 * 60 * 1000); // 30 minutes max
    });
  });

  describe('Password Security', () => {
    it('should validate strong passwords', async () => {
      const strongPassword = 'StrongPass123!@#';
      const result = validatePasswordStrength(strongPassword);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        '123', // Too short
        'password', // No numbers, special chars
        'PASSWORD', // No lowercase, numbers, special chars
        'Password', // No numbers, special chars
        'Password123', // No special chars
        'admin123', // Common pattern
      ];

      weakPasswords.forEach(password => {
        const result = validatePasswordStrength(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should perform secure password comparison', async () => {
      const password = 'testpassword123';
      const hash = await bcrypt.hash(password, 12);
      
      // Valid password should return true
      const isValid = await securePasswordCompare(password, hash);
      expect(isValid).toBe(true);
      
      // Invalid password should return false
      const isInvalid = await securePasswordCompare('wrongpassword', hash);
      expect(isInvalid).toBe(false);
    });

    it('should handle timing attacks', async () => {
      const password = 'testpassword123';
      const hash = await bcrypt.hash(password, 12);
      
      // Measure time for valid password
      const startValid = Date.now();
      await securePasswordCompare(password, hash);
      const timeValid = Date.now() - startValid;
      
      // Measure time for invalid password
      const startInvalid = Date.now();
      await securePasswordCompare('wrongpassword', hash);
      const timeInvalid = Date.now() - startInvalid;
      
      // Times should be similar (within 50ms tolerance)
      expect(Math.abs(timeValid - timeInvalid)).toBeLessThan(50);
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize user input', () => {
      const maliciousInput = '<script>alert("xss")</script>test@example.com';
      const sanitized = sanitizeInput(maliciousInput);
      
      expect(sanitized).toBe('scriptalert("xss")/scripttest@example.com');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should limit input length', () => {
      const longInput = 'a'.repeat(300);
      const sanitized = sanitizeInput(longInput);
      
      expect(sanitized.length).toBeLessThanOrEqual(255);
    });

    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin+test@company.org'
      ];

      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user..name@domain.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('Token Generation', () => {
    it('should generate secure tokens', () => {
      const token1 = generateSecureToken(32);
      const token2 = generateSecureToken(32);
      
      expect(token1).toHaveLength(32);
      expect(token2).toHaveLength(32);
      expect(token1).not.toBe(token2); // Should be different
      
      // Should contain only valid characters
      expect(token1).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should generate tokens of specified length', () => {
      const lengths = [16, 32, 64, 128];
      
      lengths.forEach(length => {
        const token = generateSecureToken(length);
        expect(token).toHaveLength(length);
      });
    });
  });

  describe('Security Configuration', () => {
    it('should have secure default configuration', () => {
      const { defaultSecurityConfig } = require('../lib/auth-security');
      
      expect(defaultSecurityConfig.enableRateLimit).toBe(true);
      expect(defaultSecurityConfig.enableAccountLockout).toBe(true);
      expect(defaultSecurityConfig.enableTimingAttackProtection).toBe(true);
      expect(defaultSecurityConfig.maxAttempts).toBe(5);
      expect(defaultSecurityConfig.lockoutDuration).toBe(30 * 60 * 1000); // 30 minutes
      expect(defaultSecurityConfig.rateLimitWindow).toBe(15 * 60 * 1000); // 15 minutes
    });
  });
});

describe('Authentication Integration Tests', () => {
  // These would be integration tests that test the full auth flow
  // with the enhanced security features
  
  it('should handle authentication with rate limiting', async () => {
    // This would test the full NextAuth flow with rate limiting
    // Implementation would require setting up a test server
  });

  it('should log authentication attempts', async () => {
    // This would test that auth attempts are properly logged
    // Implementation would require setting up logging infrastructure
  });

  it('should enforce admin-only access', async () => {
    // This would test that only admin users can access admin routes
    // Implementation would require setting up test users and routes
  });
});
