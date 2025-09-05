# Deployment Guide

**Last Updated**: January 2025  
**Version**: 2.0.0

## Overview

This guide covers the deployment process for the Mindware Blog platform across different environments. The application is designed to be deployed on Vercel with automatic CI/CD pipelines.

## Deployment Environments

### Development Environment

- **URL**: `http://localhost:3000`
- **Purpose**: Local development and testing
- **Database**: Local PostgreSQL or SQLite
- **Features**: Hot reloading, debug mode, development tools

### Preview Environment

- **URL**: `https://mindware-blog-git-branch-name.vercel.app`
- **Purpose**: Testing pull requests and feature branches
- **Database**: Preview database instance
- **Features**: Production-like environment for testing

### Production Environment

- **URL**: `https://mindware.hashnode.dev`
- **Purpose**: Live application serving real users
- **Database**: Production PostgreSQL database
- **Features**: Full performance optimization, monitoring, analytics

## Prerequisites

### Required Accounts

- **Vercel Account**: For hosting and deployment
- **GitHub Account**: For source code management
- **Database Provider**: PostgreSQL (Vercel Postgres, Supabase, or Railway)
- **Domain Provider**: For custom domain setup

### Required Environment Variables

See [Environment Configuration](../.env.example) for complete list of required variables.

## Deployment Process

### 1. Initial Setup

#### Connect Repository to Vercel

1. **Import Project**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link project
   vercel link
   ```

2. **Configure Project Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/blog-starter-kit/themes/enterprise`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Database Setup

1. **Create Database**
   ```bash
   # Using Vercel Postgres
   vercel postgres create mindware-blog-db
   
   # Get connection string
   vercel postgres connection-string mindware-blog-db
   ```

2. **Run Migrations**
   ```bash
   # Set database URL
   export DATABASE_URL="postgresql://..."
   
   # Run migrations
   npm run db:push
   npm run db:seed
   ```

### 2. Environment Configuration

#### Production Environment Variables

Set the following variables in Vercel dashboard:

```bash
# Core Application
NEXT_PUBLIC_BASE_URL=https://mindware.hashnode.dev
NEXT_PUBLIC_SITE_NAME="Mindware Blog"
NEXT_PUBLIC_SITE_DESCRIPTION="Technology & Development Blog"
NEXT_PUBLIC_SITE_URL=https://mindware.hashnode.dev

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
NEXTAUTH_URL=https://mindware.hashnode.dev
NEXTAUTH_SECRET=your-secure-secret-key

# Hashnode Integration
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST=mindware.hashnode.dev
NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT=https://gql.hashnode.com/

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key

# Email Services
RESEND_API_KEY=re_your-resend-api-key
FROM_EMAIL=noreply@mindware.dev

# Google Services
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://mindware.hashnode.dev/api/google/oauth/callback

# Social Media
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PLAUSIBLE_API_TOKEN=your-plausible-api-token
PLAUSIBLE_SITE_ID=your-site-id

# Monitoring
SENTRY_DSN=your-sentry-dsn
SENTRY_API_TOKEN=your-sentry-api-token

# Feature Flags
FEATURE_GMAIL=true
FEATURE_CALENDAR=true
FEATURE_SOCIAL=true
FEATURE_DEVOPS=true
FEATURE_ANALYTICS=true
FEATURE_FINANCE=true
FEATURE_CHATBOT=true
FEATURE_NEWSLETTER=true

# Security
CRON_SECRET=your-secure-cron-secret
```

### 3. Domain Configuration

#### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add `mindware.hashnode.dev`
   - Add `www.mindware.hashnode.dev` (redirects to main domain)

2. **DNS Configuration**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Certificate is valid for both apex and www domains

### 4. CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: packages/blog-starter-kit/themes/enterprise/package-lock.json
      
      - name: Install dependencies
        run: |
          cd packages/blog-starter-kit/themes/enterprise
          npm ci
      
      - name: Run tests
        run: |
          cd packages/blog-starter-kit/themes/enterprise
          npm run test
          npm run test:accessibility
          npm run test:seo
      
      - name: Build application
        run: |
          cd packages/blog-starter-kit/themes/enterprise
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: packages/blog-starter-kit/themes/enterprise
```

#### Required Secrets

Set these secrets in GitHub repository settings:

- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### 5. Database Migrations

#### Production Migration Process

1. **Create Migration**
   ```bash
   # Create new migration
   npx prisma migrate dev --name add-new-feature
   ```

2. **Review Migration**
   ```bash
   # Review generated SQL
   cat prisma/migrations/YYYYMMDD_add_new_feature/migration.sql
   ```

3. **Deploy Migration**
   ```bash
   # Deploy to production
   npx prisma migrate deploy
   ```

4. **Verify Migration**
   ```bash
   # Check migration status
   npx prisma migrate status
   ```

### 6. Monitoring Setup

#### Vercel Analytics

1. **Enable Analytics**
   - Go to Project Settings → Analytics
   - Enable Web Analytics
   - Configure custom events

2. **Performance Monitoring**
   - Core Web Vitals tracking
   - Real User Monitoring (RUM)
   - Error tracking and reporting

#### Sentry Integration

1. **Configure Sentry**
   ```typescript
   // sentry.client.config.ts
   import * as Sentry from '@sentry/nextjs';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

2. **Error Tracking**
   - Automatic error capture
   - Performance monitoring
   - Release tracking

## Deployment Commands

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
vercel --target production --git-branch main
```

### Database Operations

```bash
# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Build and Test

```bash
# Local build
npm run build

# Run tests
npm run test
npm run test:accessibility
npm run test:seo

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Rollback Procedures

### Application Rollback

1. **Vercel Rollback**
   ```bash
   # List deployments
   vercel ls
   
   # Rollback to previous deployment
   vercel rollback [deployment-url]
   ```

2. **Database Rollback**
   ```bash
   # List migrations
   npx prisma migrate status
   
   # Rollback last migration
   npx prisma migrate resolve --rolled-back [migration-name]
   ```

### Emergency Procedures

1. **Immediate Rollback**
   - Use Vercel dashboard to rollback to last known good deployment
   - Disable problematic features using feature flags
   - Notify team via Slack/Discord

2. **Database Emergency**
   - Restore from latest backup
   - Contact database provider support
   - Implement read-only mode if necessary

## Health Checks

### Application Health

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    services: {
      database: await checkDatabase(),
      openai: await checkOpenAI(),
      stripe: await checkStripe(),
    },
  };
  
  return NextResponse.json(health);
}
```

### Monitoring Endpoints

- **Health Check**: `/api/health`
- **Readiness**: `/api/ready`
- **Liveness**: `/api/live`

## Performance Optimization

### Build Optimization

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};
```

### Caching Strategy

```typescript
// API route caching
export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

## Security Considerations

### Environment Security

- Never commit sensitive environment variables
- Use Vercel's secure environment variable storage
- Rotate secrets regularly
- Use different secrets for different environments

### Database Security

- Use connection pooling
- Enable SSL connections
- Implement proper access controls
- Regular security updates

### Application Security

- Enable HTTPS only
- Implement proper CORS policies
- Use security headers
- Regular dependency updates

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Environment Variable Issues**
   - Verify all required variables are set
   - Check variable names and values
   - Ensure proper formatting

3. **Database Connection Issues**
   - Verify database URL format
   - Check network connectivity
   - Confirm database is accessible

### Debug Commands

```bash
# Check deployment logs
vercel logs [deployment-url]

# Local debugging
npm run dev -- --inspect

# Database debugging
npx prisma studio
npx prisma migrate status
```

## Maintenance

### Regular Tasks

- **Weekly**: Review performance metrics and error logs
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and optimize database performance
- **Annually**: Review and update deployment procedures

### Backup Procedures

- **Database**: Automated daily backups
- **Code**: Git repository with multiple remotes
- **Assets**: CDN with redundancy
- **Configuration**: Version-controlled environment templates

## Support and Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Prisma Deployment**: [prisma.io/docs/guides/deployment](https://prisma.io/docs/guides/deployment)
- **Emergency Contact**: [devops@mindware.dev](mailto:devops@mindware.dev)
