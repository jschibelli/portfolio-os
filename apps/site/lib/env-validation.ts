import { z } from 'zod';

/**
 * Environment Variable Validation
 * 
 * This module validates and type-checks all environment variables used in the application.
 * 
 * Key Features:
 * - Type-safe environment variables using Zod
 * - Graceful handling during build time
 * - Feature flags for optional integrations
 * - Comprehensive validation with helpful error messages
 * 
 * Usage:
 * - Import `env` for type-safe environment variables
 * - Import `features` to check if optional services are configured
 * - Import `isProduction`, `isDevelopment`, `isTest` for environment checks
 */

// Detect if we're in a build/deployment environment
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const isVercelDeployment = Boolean(process.env.VERCEL);
const _isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Environment Validation Schema
 * 
 * Defines validation rules for all environment variables.
 * Required variables will cause build failures if missing in production.
 * Optional variables enable features when provided.
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Hashnode integration (required)
  NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST: z.string().min(1, 'Hashnode publication host is required'),
  
  // Google Calendar OAuth2 (optional during build, required at runtime)
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required for calendar integration').optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required for calendar integration').optional(),
  GOOGLE_REDIRECT_URI: z.string().url('Invalid Google redirect URI format').optional(),
  GOOGLE_OAUTH_REFRESH_TOKEN: z.string().min(1, 'Google OAuth refresh token is required').optional(),
  GOOGLE_CALENDAR_ID: z.string().min(1, 'Google Calendar ID is required').optional(),
  
  // SSL/TLS fix
  FIX_SSL_ISSUES: z.string().transform(val => val === 'true').default('false'),
  
  // Email service (Resend) - optional during build, required for contact form
  // Get your API key from: https://resend.com/api-keys
  RESEND_API_KEY: z.string().min(1, 'Resend API key is required for email functionality. Get yours at https://resend.com/api-keys').optional(),
  EMAIL_FROM: z.string().email('Invalid EMAIL_FROM format. Must be a verified email address (e.g., noreply@yourdomain.com)').optional(),
  EMAIL_REPLY_TO: z.string().email('Invalid EMAIL_REPLY_TO format. Must be a valid email address').optional(),
  
  // Optional integrations
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // LinkedIn integration
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  
  // Facebook integration
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  FACEBOOK_PAGE_ID: z.string().optional(),
  
  // GitHub integration
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // Vercel integration
  VERCEL_API_TOKEN: z.string().optional(),
  
  // Analytics
  SENTRY_API_TOKEN: z.string().optional(),
  PLAUSIBLE_API_TOKEN: z.string().optional(),
  PLAUSIBLE_SITE_ID: z.string().optional(),
  
  // Security (optional during build, required at runtime)
  CRON_SECRET: z.string().min(32, 'CRON_SECRET must be at least 32 characters for security').optional(),
  
  // Authentication Security (required for production)
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters for security').optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security').optional(),
  AUTH_ADMIN_EMAIL: z.string().email('Invalid admin email format').optional(),
  AUTH_ADMIN_PASSWORD: z.string().min(12, 'Admin password must be at least 12 characters').optional(),
  
  // Database
  DATABASE_URL: z.string().url('Invalid database URL format').optional(),
});

// Parse and validate environment variables
export function validateEnv() {
  console.log('[env-validation] Starting validation...');
  try {
    const result = envSchema.parse(process.env);
    console.log('[env-validation] Validation successful');
    return result;
  } catch (error) {
    console.log('[env-validation] Validation error occurred');

    if (error instanceof z.ZodError) {
      // During build time, Vercel deployment, or development, be more lenient with missing variables
      if (isBuildTime || isVercelDeployment || _isDevelopment) {
        console.warn('Environment validation warnings (development mode):');
        error.errors.forEach((err) => {
          console.warn(`  - ${err.path.join('.')}: ${err.message}`);
        });
        console.warn('\nSome features may be disabled until environment variables are configured.');
        console.warn('See README.md for complete setup instructions.');
        
        // Return a partial environment object for build time
        return {
          NODE_ENV: process.env.NODE_ENV || 'development',
          NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || '',
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
          GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
          GOOGLE_OAUTH_REFRESH_TOKEN: process.env.GOOGLE_OAUTH_REFRESH_TOKEN || '',
          GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID || '',
          FIX_SSL_ISSUES: process.env.FIX_SSL_ISSUES === 'true',
          RESEND_API_KEY: process.env.RESEND_API_KEY || '',
          EMAIL_FROM: process.env.EMAIL_FROM || '',
          EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO || '',
          OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
          STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
          LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || '',
          LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET || '',
          FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
          FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || '',
          FACEBOOK_PAGE_ID: process.env.FACEBOOK_PAGE_ID || '',
          GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
          GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
          VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN || '',
          SENTRY_API_TOKEN: process.env.SENTRY_API_TOKEN || '',
          PLAUSIBLE_API_TOKEN: process.env.PLAUSIBLE_API_TOKEN || '',
          PLAUSIBLE_SITE_ID: process.env.PLAUSIBLE_SITE_ID || '',
          CRON_SECRET: process.env.CRON_SECRET || '',
          AUTH_SECRET: process.env.AUTH_SECRET || '',
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
          AUTH_ADMIN_EMAIL: process.env.AUTH_ADMIN_EMAIL || '',
          AUTH_ADMIN_PASSWORD: process.env.AUTH_ADMIN_PASSWORD || '',
          DATABASE_URL: process.env.DATABASE_URL || '',
        };
      }
      
      // In development, be strict about validation
      console.error('Environment validation failed:');
      console.error('================================================================');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\nRequired environment variables:');
      console.error('  Core:');
      console.error('    - NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST - Your Hashnode publication host');
      console.error('  Email (Contact Form):');
      console.error('    - RESEND_API_KEY - Get from https://resend.com/api-keys');
      console.error('    - EMAIL_FROM - Verified sender email (e.g., noreply@yourdomain.com)');
      console.error('    - EMAIL_REPLY_TO - Reply-to email address');
      console.error('  Google Calendar (Optional):');
      console.error('    - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET');
      console.error('    - GOOGLE_REDIRECT_URI, GOOGLE_OAUTH_REFRESH_TOKEN');
      console.error('    - GOOGLE_CALENDAR_ID');
      console.error('  Security (Production):');
      console.error('    - CRON_SECRET (min 32 chars)');
      console.error('    - AUTH_SECRET, NEXTAUTH_SECRET (min 32 chars)');
      console.error('    - AUTH_ADMIN_EMAIL, AUTH_ADMIN_PASSWORD (min 12 chars)');
      console.error('\nSetup instructions:');
      console.error('  1. Copy apps/site/env.template to apps/site/.env.local');
      console.error('  2. Fill in your API keys and credentials');
      console.error('  3. See README.md for detailed setup guide');
      console.error('================================================================\n');
      process.exit(1);
    }
    throw error;
  }
}

// Lazy-loaded validated environment variables
let _env: any = null;

function getEnv() {
  if (!_env) {
    console.log('[env-validation] Initializing environment variables...');
    _env = validateEnv();
    console.log('[env-validation] Environment variables initialized');
  }
  return _env;
}

// Export validated environment variables with lazy evaluation
// Using a simpler approach that's more compatible with Next.js edge runtime
export const env = new Proxy({} as any, {
  get(_target, prop) {
    const envVars = getEnv();
    return envVars[prop];
  },
  has(_target, prop) {
    const envVars = getEnv();
    return prop in envVars;
  }
});

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

/**
 * Environment helper functions
 * 
 * Use these to check the current environment:
 * - isProduction: Running in production mode
 * - isDevelopment: Running in development mode
 * - isTest: Running in test mode
 */
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';

/**
 * Feature flags based on environment variables
 * 
 * These flags indicate whether optional services are properly configured:
 * - googleCalendar: Google Calendar OAuth integration
 * - email: Resend email service for contact form
 * - openai: OpenAI API for AI features
 * - stripe: Stripe payment processing
 * - linkedin: LinkedIn OAuth integration
 * - facebook: Facebook API integration
 * - github: GitHub OAuth integration
 * - vercel: Vercel API integration
 * - sentry: Sentry error tracking
 * - plausible: Plausible analytics
 * 
 * @example
 * if (features.email) {
 *   // Send email
 * }
 */
export const features = new Proxy({} as any, {
  get(_target, prop) {
    try {
      const e = getEnv();
      switch (prop) {
        case 'googleCalendar':
          return Boolean(e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET && e.GOOGLE_OAUTH_REFRESH_TOKEN && e.GOOGLE_CALENDAR_ID);
        case 'email':
          return Boolean(e.RESEND_API_KEY && e.EMAIL_FROM);
        case 'openai':
          return Boolean(e.OPENAI_API_KEY);
        case 'stripe':
          return Boolean(e.STRIPE_SECRET_KEY);
        case 'linkedin':
          return Boolean(e.LINKEDIN_CLIENT_ID && e.LINKEDIN_CLIENT_SECRET);
        case 'facebook':
          return Boolean(e.FACEBOOK_APP_ID && e.FACEBOOK_APP_SECRET);
        case 'github':
          return Boolean(e.GITHUB_CLIENT_ID && e.GITHUB_CLIENT_SECRET);
        case 'vercel':
          return Boolean(e.VERCEL_API_TOKEN);
        case 'sentry':
          return Boolean(e.SENTRY_API_TOKEN);
        case 'plausible':
          return Boolean(e.PLAUSIBLE_API_TOKEN && e.PLAUSIBLE_SITE_ID);
        default:
          return undefined;
      }
    } catch (error) {
      console.error(`[env-validation] Error accessing feature.${String(prop)}:`, error);
      return false;
    }
  }
});

// SSL/TLS configuration (lazy-loaded)
export const sslConfig = new Proxy({} as any, {
  get(_target, prop) {
    try {
      const e = getEnv();
      if (prop === 'fixEnabled') {
        return e.FIX_SSL_ISSUES;
      }
      if (prop === 'nodeOptions') {
        return e.FIX_SSL_ISSUES ? '--openssl-legacy-provider' : undefined;
      }
      return undefined;
    } catch (error) {
      console.error(`[env-validation] Error accessing sslConfig.${String(prop)}:`, error);
      return undefined;
    }
  }
});
