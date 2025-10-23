/**
 * Input validation utilities for security and data integrity
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

/**
 * Validates a single value against rules
 */
export function validateValue(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = []

  // Required check
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push('This field is required')
  }

  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return { isValid: true, errors: [] }
  }

  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`)
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength} characters`)
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    errors.push('Invalid format')
  }

  // Custom validation
  if (rules.custom) {
    const customResult = rules.custom(value)
    if (customResult !== true) {
      errors.push(typeof customResult === 'string' ? customResult : 'Invalid value')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates an object against a schema
 */
export function validateObject<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, ValidationRule>
): ValidationResult {
  const errors: string[] = []
  let isValid = true

  for (const [key, rules] of Object.entries(schema)) {
    const result = validateValue(data[key], rules)
    if (!result.isValid) {
      isValid = false
      errors.push(...result.errors.map(error => `${key}: ${error}`))
    }
  }

  return { isValid, errors }
}

/**
 * Common validation rules
 */
export const commonRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value.includes('@')) return 'Invalid email format'
      if (value.length > 254) return 'Email is too long'
      return true
    }
  },
  url: {
    required: true,
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    custom: (value: string) => {
      try {
        new URL(value.startsWith('http') ? value : `https://${value}`)
        return true
      } catch {
        return 'Invalid URL format'
      }
    }
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    custom: (value: string) => {
      if (value.length < 8) return 'Password must be at least 8 characters'
      if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter'
      if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter'
      if (!/\d/.test(value)) return 'Password must contain number'
      if (!/[@$!%*?&]/.test(value)) return 'Password must contain special character'
      return true
    }
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
    custom: (value: string) => {
      if (value.includes(' ')) return 'Username cannot contain spaces'
      if (value.startsWith('-') || value.endsWith('-')) return 'Username cannot start or end with dash'
      return true
    }
  },
  text: {
    maxLength: 1000,
    custom: (value: string) => {
      // Basic XSS prevention
      if (/<script|javascript:|on\w+=/i.test(value)) {
        return 'Invalid characters detected'
      }
      return true
    }
  },
  html: {
    maxLength: 10000,
    custom: (value: string) => {
      // More comprehensive XSS prevention
      const dangerousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /<object[^>]*>.*?<\/object>/gi,
        /<embed[^>]*>.*?<\/embed>/gi
      ]
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(value)) {
          return 'Potentially dangerous content detected'
        }
      }
      return true
    }
  }
}

/**
 * Sanitizes HTML content to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags and event handlers
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
}

/**
 * Validates and sanitizes user input
 */
export function validateAndSanitizeInput(
  input: string,
  rules: ValidationRule
): { isValid: boolean; sanitizedValue: string; errors: string[] } {
  const validation = validateValue(input, rules)
  
  let sanitizedValue = input
  if (rules.pattern === commonRules.html.pattern || rules.custom === commonRules.html.custom) {
    sanitizedValue = sanitizeHtml(input)
  }
  
  return {
    isValid: validation.isValid,
    sanitizedValue,
    errors: validation.errors
  }
}

/**
 * Validates an article ID format and returns sanitized ID or null
 * Supports multiple ID formats commonly used in web applications
 * 
 * @param id - The article ID to validate
 * @returns The sanitized ID if valid, null otherwise
 * 
 * @example
 * // MongoDB ObjectID (24 hex characters representing 12 bytes)
 * validateArticleId('507f1f77bcf86cd799439011') // returns '507f1f77bcf86cd799439011'
 * 
 * // UUID v4 format
 * validateArticleId('550e8400-e29b-41d4-a716-446655440000') // returns '550e8400-e29b-41d4-a716-446655440000'
 * 
 * // Simple alphanumeric ID with hyphens/underscores
 * validateArticleId('article-123') // returns 'article-123'
 */
export function validateArticleId(id: string): string | null {
  if (!id || typeof id !== 'string') {
    return null
  }
  
  const sanitized = id.trim()
  
  // Pattern 1: MongoDB ObjectID format (24 hexadecimal characters = 12 bytes)
  // Example: 507f1f77bcf86cd799439011
  const mongoIdPattern = /^[a-f\d]{24}$/i
  
  // Pattern 2: UUID format (8-4-4-4-12 hexadecimal characters with hyphens)
  // Example: 550e8400-e29b-41d4-a716-446655440000
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  
  // Pattern 3: Simple alphanumeric ID with optional hyphens and underscores
  // Example: article-123, post_456, item789
  const simpleIdPattern = /^[a-zA-Z0-9_-]+$/
  
  if (mongoIdPattern.test(sanitized) || uuidPattern.test(sanitized) || simpleIdPattern.test(sanitized)) {
    return sanitized
  }
  
  return null
}

/**
 * Sanitizes user input by removing potentially dangerous content
 * while preserving safe formatting characters
 * 
 * @param input - The user input string to sanitize
 * @returns The sanitized string with dangerous characters removed
 * 
 * @example
 * sanitizeInput('Hello\x00World') // returns 'HelloWorld' (null byte removed)
 * sanitizeInput('  Test\n\t ') // returns 'Test\n\t' (preserves newlines/tabs, trims whitespace)
 * 
 * Security features:
 * - Removes null bytes (\0) that can cause string termination issues
 * - Removes control characters that can cause rendering/security issues
 * - Preserves newline (\n), tab (\t), and carriage return (\r) for legitimate formatting
 * - Trims leading/trailing whitespace
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Step 1: Remove null bytes (\0) - can cause string termination vulnerabilities
  let sanitized = input.replace(/\0/g, '')
  
  // Step 2: Remove control characters (0x00-0x1F, 0x7F) except:
  // - 0x09 (tab), 0x0A (newline), 0x0D (carriage return)
  // This prevents injection of dangerous control sequences
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Step 3: Trim leading and trailing whitespace
  sanitized = sanitized.trim()
  
  return sanitized
}

/**
 * Rate limiting validation
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs)
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false
    }
    
    // Record this attempt
    recentAttempts.push(now)
    this.attempts.set(identifier, recentAttempts)
    
    return true
  }
  
  getRemainingAttempts(identifier: string): number {
    const attempts = this.attempts.get(identifier) || []
    const now = Date.now()
    const recentAttempts = attempts.filter(time => now - time < this.windowMs)
    
    return Math.max(0, this.maxAttempts - recentAttempts.length)
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}