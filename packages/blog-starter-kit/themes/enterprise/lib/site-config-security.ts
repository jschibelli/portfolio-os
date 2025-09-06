/**
 * Site Configuration Security
 * 
 * This module provides security measures for SITE_CONFIG access including
 * access control, input sanitization, and audit logging.
 * 
 * Addresses code review feedback from PR #37 about ensuring sensitive
 * information in SITE_CONFIG is properly secured with access controls.
 */

import { SITE_CONFIG } from '../config/constants';
import { sanitizeInput } from './config-validation';

// Security levels for configuration access
export enum SecurityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  SENSITIVE = 'sensitive',
  RESTRICTED = 'restricted'
}

// Configuration field security mapping
const CONFIG_SECURITY_MAP = {
  // Public fields - safe to expose
  DOMAIN: SecurityLevel.PUBLIC,
  BASE_URL: SecurityLevel.PUBLIC,
  'PERSONAL.NAME': SecurityLevel.PUBLIC,
  'PERSONAL.TITLE': SecurityLevel.PUBLIC,
  'PERSONAL.LOCATION': SecurityLevel.PUBLIC,
  'SOCIAL.LINKEDIN': SecurityLevel.PUBLIC,
  'SOCIAL.GITHUB': SecurityLevel.PUBLIC,
  'SOCIAL.TWITTER': SecurityLevel.PUBLIC,
  'SEO.DESCRIPTION': SecurityLevel.PUBLIC,
  'SEO.KEYWORDS': SecurityLevel.PUBLIC,
  
  // Internal fields - server-side only
  'EMAIL.PRIMARY': SecurityLevel.INTERNAL,
  'EMAIL.CONTACT': SecurityLevel.INTERNAL,
  'EMAIL.BOOKING': SecurityLevel.INTERNAL,
  'PERSONAL.PHONE': SecurityLevel.INTERNAL,
  
  // Sensitive fields - restricted access
  'API_KEYS': SecurityLevel.SENSITIVE,
  'DATABASE_URL': SecurityLevel.SENSITIVE,
  'SECRET_KEYS': SecurityLevel.SENSITIVE,
  
  // Restricted fields - admin only
  'ADMIN_CREDENTIALS': SecurityLevel.RESTRICTED,
  'INTERNAL_TOKENS': SecurityLevel.RESTRICTED,
} as const;

// Access control interface
export interface AccessControl {
  level: SecurityLevel;
  allowedRoles: string[];
  requiresAuth: boolean;
  auditLog: boolean;
}

// Audit log entry
export interface AuditLogEntry {
  timestamp: string;
  userId?: string;
  action: string;
  field: string;
  securityLevel: SecurityLevel;
  success: boolean;
  error?: string;
  context?: Record<string, any>;
}

// Security manager class
export class SiteConfigSecurity {
  private auditLog: AuditLogEntry[] = [];
  private currentUser?: {
    id: string;
    roles: string[];
    isAuthenticated: boolean;
  };

  /**
   * Sets the current user context for access control
   */
  setCurrentUser(user: { id: string; roles: string[]; isAuthenticated: boolean }): void {
    this.currentUser = user;
  }

  /**
   * Gets the security level for a configuration field
   */
  getSecurityLevel(field: string): SecurityLevel {
    return CONFIG_SECURITY_MAP[field as keyof typeof CONFIG_SECURITY_MAP] || SecurityLevel.INTERNAL;
  }

  /**
   * Checks if the current user has access to a configuration field
   */
  hasAccess(field: string): boolean {
    const securityLevel = this.getSecurityLevel(field);
    const accessControl = this.getAccessControl(securityLevel);
    
    // Check authentication requirement
    if (accessControl.requiresAuth && !this.currentUser?.isAuthenticated) {
      this.logAccess(field, securityLevel, false, 'Authentication required');
      return false;
    }
    
    // Check role-based access
    if (accessControl.allowedRoles.length > 0) {
      const hasRole = this.currentUser?.roles.some(role => 
        accessControl.allowedRoles.includes(role)
      );
      if (!hasRole) {
        this.logAccess(field, securityLevel, false, 'Insufficient permissions');
        return false;
      }
    }
    
    this.logAccess(field, securityLevel, true);
    return true;
  }

  /**
   * Gets access control configuration for a security level
   */
  private getAccessControl(level: SecurityLevel): AccessControl {
    switch (level) {
      case SecurityLevel.PUBLIC:
        return {
          level,
          allowedRoles: [],
          requiresAuth: false,
          auditLog: false
        };
      
      case SecurityLevel.INTERNAL:
        return {
          level,
          allowedRoles: ['admin', 'developer'],
          requiresAuth: true,
          auditLog: true
        };
      
      case SecurityLevel.SENSITIVE:
        return {
          level,
          allowedRoles: ['admin'],
          requiresAuth: true,
          auditLog: true
        };
      
      case SecurityLevel.RESTRICTED:
        return {
          level,
          allowedRoles: ['admin'],
          requiresAuth: true,
          auditLog: true
        };
      
      default:
        return {
          level,
          allowedRoles: ['admin'],
          requiresAuth: true,
          auditLog: true
        };
    }
  }

  /**
   * Logs access attempts for audit purposes
   */
  private logAccess(
    field: string, 
    securityLevel: SecurityLevel, 
    success: boolean, 
    error?: string
  ): void {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId: this.currentUser?.id,
      action: 'config_access',
      field,
      securityLevel,
      success,
      error,
      context: {
        userRoles: this.currentUser?.roles,
        isAuthenticated: this.currentUser?.isAuthenticated
      }
    };
    
    this.auditLog.push(entry);
    
    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      const status = success ? '✅' : '❌';
      console.log(`${status} Config access: ${field} (${securityLevel}) - ${success ? 'allowed' : 'denied'}`);
      if (error) {
        console.log(`   Error: ${error}`);
      }
    }
  }

  /**
   * Gets audit log entries
   */
  getAuditLog(): AuditLogEntry[] {
    return [...this.auditLog];
  }

  /**
   * Clears audit log
   */
  clearAuditLog(): void {
    this.auditLog = [];
  }

  /**
   * Gets audit log summary
   */
  getAuditSummary(): Record<string, any> {
    const total = this.auditLog.length;
    const successful = this.auditLog.filter(entry => entry.success).length;
    const failed = this.auditLog.filter(entry => !entry.success).length;
    
    const byLevel = this.auditLog.reduce((acc, entry) => {
      acc[entry.securityLevel] = (acc[entry.securityLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      bySecurityLevel: byLevel
    };
  }
}

// Secure configuration access function
export function getSecureConfig<T>(
  field: string,
  getter: () => T,
  fallback: T,
  securityManager: SiteConfigSecurity
): { value: T; hasAccess: boolean; error?: string } {
  // Check access permissions
  if (!securityManager.hasAccess(field)) {
    return {
      value: fallback,
      hasAccess: false,
      error: 'Access denied'
    };
  }
  
  try {
    const value = getter();
    
    // Sanitize string values
    if (typeof value === 'string') {
      return {
        value: sanitizeInput(value) as T,
        hasAccess: true
      };
    }
    
    return {
      value,
      hasAccess: true
    };
  } catch (error) {
    return {
      value: fallback,
      hasAccess: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Public configuration filter
export function getPublicConfig(): Record<string, any> {
  const publicConfig: Record<string, any> = {};
  
  // Add public fields only
  Object.entries(CONFIG_SECURITY_MAP).forEach(([field, level]) => {
    if (level === SecurityLevel.PUBLIC) {
      const [section, key] = field.includes('.') ? field.split('.') : [field, null];
      
      if (key) {
        // Nested field
        if (!publicConfig[section]) {
          publicConfig[section] = {};
        }
        publicConfig[section][key] = (SITE_CONFIG as any)[section]?.[key];
      } else {
        // Top-level field
        publicConfig[field] = (SITE_CONFIG as any)[field];
      }
    }
  });
  
  return publicConfig;
}

// Environment-based configuration override
export function getEnvironmentConfig(): Record<string, any> {
  const envConfig: Record<string, any> = {};
  
  // Map environment variables to configuration
  const envMappings = {
    CONTACT_EMAIL: 'EMAIL.CONTACT',
    SITE_URL: 'BASE_URL',
    SITE_DOMAIN: 'DOMAIN',
  };
  
  Object.entries(envMappings).forEach(([envVar, configPath]) => {
    const value = process.env[envVar];
    if (value) {
      const [section, key] = configPath.includes('.') ? configPath.split('.') : [configPath, null];
      
      if (key) {
        if (!envConfig[section]) {
          envConfig[section] = {};
        }
        envConfig[section][key] = sanitizeInput(value);
      } else {
        envConfig[section] = sanitizeInput(value);
      }
    }
  });
  
  return envConfig;
}

// Configuration validation with security
export function validateConfigSecurity(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  securityIssues: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const securityIssues: string[] = [];
  
  // Check for sensitive data in public fields
  Object.entries(CONFIG_SECURITY_MAP).forEach(([field, level]) => {
    if (level === SecurityLevel.PUBLIC) {
      const [section, key] = field.includes('.') ? field.split('.') : [field, null];
      const value = key ? (SITE_CONFIG as any)[section]?.[key] : (SITE_CONFIG as any)[field];
      
      if (value && typeof value === 'string') {
        // Check for potential sensitive information
        if (value.includes('password') || value.includes('secret') || value.includes('key')) {
          securityIssues.push(`Potential sensitive data in public field: ${field}`);
        }
        
        // Check for email addresses in public fields
        if (value.includes('@') && !field.includes('EMAIL')) {
          warnings.push(`Email address found in public field: ${field}`);
        }
      }
    }
  });
  
  // Check for missing required fields
  const requiredFields = [
    'DOMAIN',
    'BASE_URL',
    'EMAIL.CONTACT',
    'PERSONAL.NAME',
    'PERSONAL.TITLE'
  ];
  
  requiredFields.forEach(field => {
    const [section, key] = field.includes('.') ? field.split('.') : [field, null];
    const value = key ? (SITE_CONFIG as any)[section]?.[key] : (SITE_CONFIG as any)[field];
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`Required field missing: ${field}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    securityIssues
  };
}

// Export singleton instance
export const siteConfigSecurity = new SiteConfigSecurity();

// Export default
export default SiteConfigSecurity;
