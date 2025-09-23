import bcrypt from 'bcrypt';
import { prisma } from './prisma';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // Maximum failed attempts
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

// In-memory rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number; lockedUntil?: number }>();

export interface AuthAttempt {
  email: string;
  ip: string;
  userAgent?: string;
  timestamp: Date;
  success: boolean;
}

export interface SecurityConfig {
  enableRateLimit: boolean;
  enableAccountLockout: boolean;
  enableTimingAttackProtection: boolean;
  maxAttempts: number;
  lockoutDuration: number;
  rateLimitWindow: number;
}

export const defaultSecurityConfig: SecurityConfig = {
  enableRateLimit: true,
  enableAccountLockout: true,
  enableTimingAttackProtection: true,
  maxAttempts: MAX_ATTEMPTS,
  lockoutDuration: LOCKOUT_DURATION,
  rateLimitWindow: RATE_LIMIT_WINDOW,
};

/**
 * Check if an IP/email combination is rate limited
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record) return false;
  
  // Check if locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return true;
  }
  
  // Reset if window has passed
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    rateLimitStore.delete(identifier);
    return false;
  }
  
  return record.attempts >= MAX_ATTEMPTS;
}

/**
 * Record a failed authentication attempt
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { attempts: 0, lastAttempt: now };
  
  record.attempts += 1;
  record.lastAttempt = now;
  
  // Lock account if max attempts reached
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION;
  }
  
  rateLimitStore.set(identifier, record);
}

/**
 * Clear failed attempts for successful authentication
 */
export function clearFailedAttempts(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Clear all rate limit data (for testing)
 */
export function clearAllRateLimitData(): void {
  rateLimitStore.clear();
}

/**
 * Get remaining lockout time in milliseconds
 */
export function getLockoutTimeRemaining(identifier: string): number {
  const record = rateLimitStore.get(identifier);
  if (!record?.lockedUntil) return 0;
  
  const remaining = record.lockedUntil - Date.now();
  return Math.max(0, remaining);
}

/**
 * Secure password comparison with timing attack protection
 */
export async function securePasswordCompare(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  try {
    // Always perform the comparison to prevent timing attacks
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    
    // Add a small random delay to further prevent timing attacks
    if (process.env.NODE_ENV === 'production') {
      const delay = Math.random() * 10; // 0-10ms random delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    return isValid;
  } catch (error) {
    console.error('Password comparison error:', error);
    // Return false on error to prevent information leakage
    return false;
  }
}

/**
 * Log authentication attempt for security monitoring
 */
export async function logAuthAttempt(attempt: AuthAttempt): Promise<void> {
  try {
    // In production, you might want to store this in a separate security log table
    console.log('Auth attempt:', {
      email: attempt.email,
      ip: attempt.ip,
      success: attempt.success,
      timestamp: attempt.timestamp,
      userAgent: attempt.userAgent?.substring(0, 100) // Truncate for storage
    });
    
    // You could also send to a security monitoring service
    // await sendToSecurityMonitoring(attempt);
  } catch (error) {
    console.error('Failed to log auth attempt:', error);
  }
}

/**
 * Generate a secure random string for tokens
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak patterns
  const commonPatterns = [
    /password/i,
    /admin/i,
    /123456/,
    /qwerty/i,
    /letmein/i,
    /welcome/i,
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common weak patterns');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 255); // Limit length
}

/**
 * Check if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

