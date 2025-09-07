import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Hashnode integration (required)
  NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST: z.string().min(1, 'Hashnode publication host is required'),
  
  // Google Calendar OAuth2 (required for scheduling)
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required for calendar integration'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required for calendar integration'),
  GOOGLE_REDIRECT_URI: z.string().url('Invalid Google redirect URI format'),
  GOOGLE_OAUTH_REFRESH_TOKEN: z.string().min(1, 'Google OAuth refresh token is required'),
  GOOGLE_CALENDAR_ID: z.string().email('Invalid Google Calendar ID format'),
  
  // SSL/TLS fix
  FIX_SSL_ISSUES: z.string().transform(val => val === 'true').default('false'),
  
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
  
  // Security
  CRON_SECRET: z.string().min(32, 'CRON_SECRET must be at least 32 characters for security'),
  
  // Database
  DATABASE_URL: z.string().url('Invalid database URL format').optional(),
});

// Parse and validate environment variables
export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n📋 Required environment variables:');
      console.error('  - NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST');
      console.error('  - GOOGLE_CLIENT_ID');
      console.error('  - GOOGLE_CLIENT_SECRET');
      console.error('  - GOOGLE_REDIRECT_URI');
      console.error('  - GOOGLE_OAUTH_REFRESH_TOKEN');
      console.error('  - GOOGLE_CALENDAR_ID');
      console.error('  - CRON_SECRET');
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
  googleCalendar: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_OAUTH_REFRESH_TOKEN),
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
