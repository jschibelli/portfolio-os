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