import { z } from 'zod';

// Detect if we're in a build/deployment environment
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const isVercelDeployment = Boolean(process.env.VERCEL);
const _isDevelopment = process.env.NODE_ENV === 'development';

// Environment validation schema
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
  RESEND_API_KEY: z.string().min(1, 'Resend API key is required for email functionality').optional(),
  EMAIL_FROM: z.string().email('Invalid EMAIL_FROM format').optional(),
  EMAIL_REPLY_TO: z.string().email('Invalid EMAIL_REPLY_TO format').optional(),
  
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
  
  // Email Service (Resend)
  RESEND_API_KEY: z.string().min(1, 'Resend API key is required for email service').optional(),
  EMAIL_FROM: z.string().email('Invalid from email format').optional(),
  EMAIL_REPLY_TO: z.string().email('Invalid reply-to email format').optional(),
});

// Parse and validate environment variables
export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // During build time, Vercel deployment, or development, be more lenient with missing variables
      if (isBuildTime || isVercelDeployment || _isDevelopment) {
        console.warn('⚠️  Environment validation warnings (development mode):');
        error.errors.forEach((err) => {
          console.warn(`  - ${err.path.join('.')}: ${err.message}`);
        });
        console.warn('\n💡 Some features may be disabled until environment variables are configured.');
        console.warn('   See README.md for complete setup instructions.');
        
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
          RESEND_API_KEY: process.env.RESEND_API_KEY || '',
          EMAIL_FROM: process.env.EMAIL_FROM || '',
          EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO || '',
        };
      }
      
      // In development, be strict about validation
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n📋 Required environment variables:');
      console.error('  - NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST');
      console.error('  - GOOGLE_CLIENT_ID (optional during build)');
      console.error('  - GOOGLE_CLIENT_SECRET (optional during build)');
      console.error('  - GOOGLE_REDIRECT_URI (optional during build)');
      console.error('  - GOOGLE_OAUTH_REFRESH_TOKEN (optional during build)');
      console.error('  - GOOGLE_CALENDAR_ID (optional during build)');
  console.error('  - CRON_SECRET (optional during build)');
  console.error('  - AUTH_SECRET (required for production)');
  console.error('  - NEXTAUTH_SECRET (required for production)');
  console.error('\n💡 See README.md for complete setup instructions.');
      process.exit(1);
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

// Helper functions for common checks
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Feature flags based on environment variables
export const features = {
  googleCalendar: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_OAUTH_REFRESH_TOKEN && env.GOOGLE_CALENDAR_ID),
  email: Boolean(env.RESEND_API_KEY && env.EMAIL_FROM),
  openai: Boolean(env.OPENAI_API_KEY),
  stripe: Boolean(env.STRIPE_SECRET_KEY),
  linkedin: Boolean(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET),
  facebook: Boolean(env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET),
  github: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
  vercel: Boolean(env.VERCEL_API_TOKEN),
  sentry: Boolean(env.SENTRY_API_TOKEN),
  plausible: Boolean(env.PLAUSIBLE_API_TOKEN && env.PLAUSIBLE_SITE_ID),
} as const;

// SSL/TLS configuration
export const sslConfig = {
  fixEnabled: env.FIX_SSL_ISSUES,
  nodeOptions: env.FIX_SSL_ISSUES ? '--openssl-legacy-provider' : undefined,
} as const;
