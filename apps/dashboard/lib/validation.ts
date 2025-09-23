/**
 * Validation utilities for the dashboard application
 * 
 * This module provides comprehensive input validation and sanitization
 * functions to ensure data integrity and security.
 */

import { z } from 'zod'

// Article ID validation schema
const articleIdSchema = z.string().uuid('Invalid article ID format')

// Input sanitization regex patterns
const SANITIZATION_PATTERNS = {
  // Remove potentially dangerous characters
  dangerousChars: /[<>'"&]/g,
  // Remove excessive whitespace
  excessiveWhitespace: /\s+/g,
  // Remove non-printable characters
  nonPrintable: /[\x00-\x1F\x7F]/g,
} as const

/**
 * Validates if a string is a valid article ID (UUID format)
 * @param id - The article ID to validate
 * @returns true if valid, false otherwise
 */
export function validateArticleId(id: string): boolean {
  try {
    articleIdSchema.parse(id)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitizes input string by removing dangerous characters and normalizing whitespace
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .replace(SANITIZATION_PATTERNS.dangerousChars, '')
    .replace(SANITIZATION_PATTERNS.nonPrintable, '')
    .replace(SANITIZATION_PATTERNS.excessiveWhitespace, ' ')
    .trim()
}

/**
 * Validates and sanitizes article title
 * @param title - The article title to validate
 * @returns Sanitized title or empty string if invalid
 */
export function validateArticleTitle(title: string): string {
  const sanitized = sanitizeInput(title)
  
  if (sanitized.length < 1 || sanitized.length > 200) {
    return ''
  }
  
  return sanitized
}

/**
 * Validates and sanitizes article slug
 * @param slug - The article slug to validate
 * @returns Sanitized slug or empty string if invalid
 */
export function validateArticleSlug(slug: string): string {
  const sanitized = sanitizeInput(slug)
  
  // Check if slug contains only valid characters (letters, numbers, hyphens, underscores)
  if (!/^[a-zA-Z0-9-_]+$/.test(sanitized)) {
    return ''
  }
  
  if (sanitized.length < 1 || sanitized.length > 100) {
    return ''
  }
  
  return sanitized
}

/**
 * Validates and sanitizes tag names
 * @param tagName - The tag name to validate
 * @returns Sanitized tag name or empty string if invalid
 */
export function validateTagName(tagName: string): string {
  const sanitized = sanitizeInput(tagName)
  
  if (sanitized.length < 1 || sanitized.length > 50) {
    return ''
  }
  
  return sanitized
}

/**
 * Validates email format
 * @param email - The email to validate
 * @returns true if valid email format, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates user role
 * @param role - The role to validate
 * @returns true if valid role, false otherwise
 */
export function validateUserRole(role: string): boolean {
  const validRoles = ['admin', 'editor', 'author', 'guest']
  return validRoles.includes(role)
}

/**
 * Comprehensive input validation for article data
 * @param data - The article data to validate
 * @returns Validation result with sanitized data or errors
 */
export function validateArticleData(data: {
  title: string
  slug: string
  content: any
  tags?: string[]
}) {
  const errors: string[] = []
  
  const validatedTitle = validateArticleTitle(data.title)
  if (!validatedTitle) {
    errors.push('Invalid article title')
  }
  
  const validatedSlug = validateArticleSlug(data.slug)
  if (!validatedSlug) {
    errors.push('Invalid article slug')
  }
  
  const validatedTags = data.tags?.map(validateTagName).filter(Boolean) || []
  
  return {
    isValid: errors.length === 0,
    errors,
    data: {
      title: validatedTitle,
      slug: validatedSlug,
      content: data.content,
      tags: validatedTags
    }
  }
}
