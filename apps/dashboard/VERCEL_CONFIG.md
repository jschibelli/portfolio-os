# Dashboard Vercel Configuration

This document explains the Vercel deployment configuration for the Dashboard application.

## Configuration Overview

The `vercel.json` file contains the following key configurations:

### Build Command

```bash
cd ../.. && pnpm exec prisma generate --schema=packages/db/prisma/schema.prisma && pnpm exec prisma generate --schema=apps/dashboard/prisma/schema.prisma && pnpm turbo run build --filter=@mindware-blog/dashboard...
```

**Purpose**: Builds the dashboard application with required Prisma client generation.

**Steps**:
1. Navigate to the monorepo root (`cd ../..`)
2. Generate Prisma clients for both the shared database package and dashboard-specific schema
3. Use Turborepo to build the dashboard and its dependencies

**Why this approach**:
- Prisma clients must be generated before the build to ensure TypeScript types are available
- The monorepo structure requires building from the root with Turborepo
- Using `--filter` ensures only dashboard and its dependencies are built, optimizing build time

### Install Command

```bash
pnpm install --frozen-lockfile
```

**Purpose**: Install dependencies using PNPM with lockfile validation.

**Why `--frozen-lockfile`**:
- Ensures reproducible builds by preventing lockfile modifications
- Fails if package.json and pnpm-lock.yaml are out of sync
- Critical for production deployments to avoid unexpected dependency updates

### API Function Configuration

```json
"functions": {
  "app/api/**/*.ts": {
    "maxDuration": 30
  }
}
```

**Purpose**: Sets maximum execution time for API routes.

**Why 30 seconds**:
- Dashboard API endpoints may perform complex database operations
- Allows time for article creation, updates, and external API calls
- Vercel's default is 10s; this provides additional headroom for admin operations

## Deployment Considerations

### Environment Variables Required

Ensure these are set in Vercel:
- `DATABASE_URL` - PostgreSQL connection string
- `HASHNODE_PUBLICATION_ID` - Hashnode publication ID
- `HASHNODE_API_TOKEN` - Hashnode API authentication token
- `NEXT_PUBLIC_SITE_URL` - Public site URL for webhooks

### Database Schema Updates

When Prisma schemas change:
1. Update the schema file
2. Generate migrations: `pnpm prisma migrate dev`
3. Commit both schema and migration files
4. Vercel will automatically generate clients during build

### Troubleshooting

**Build fails on Prisma generate**:
- Verify both schema files exist and are valid
- Check that `@prisma/client` is in dependencies (not devDependencies)

**Function timeout errors**:
- Review API endpoint performance
- Consider increasing `maxDuration` if operations legitimately take longer
- Optimize database queries and external API calls

## Security Considerations

### API Token Management

**Critical**: Never commit sensitive data to version control.

- All API tokens MUST be stored in Vercel environment variables
- Use separate tokens for development/staging/production environments
- Rotate tokens regularly (recommended: every 90 days)
- Implement token expiration monitoring

### Security Headers

The configuration includes security headers for API routes:

```json
"headers": [
  {
    "source": "/api/(.*)",
    "headers": [
      {"key": "X-Content-Type-Options", "value": "nosniff"},
      {"key": "X-Frame-Options", "value": "DENY"},
      {"key": "X-XSS-Protection", "value": "1; mode=block"},
      {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"}
    ]
  }
]
```

**Purpose**: Protect against common web vulnerabilities (XSS, clickjacking, MIME sniffing).

### Input Validation

All API endpoints should implement:
- Request body schema validation using Zod or similar
- Rate limiting to prevent abuse
- CORS configuration for allowed origins
- Authentication/authorization checks before processing

## Testing Strategy

### Pre-Deployment Testing

Before deploying changes:

```bash
# 1. Run all tests locally
pnpm test --filter=@mindware-blog/dashboard

# 2. Type checking
pnpm typecheck --filter=@mindware-blog/dashboard

# 3. Linting
pnpm lint --filter=@mindware-blog/dashboard

# 4. Build verification
pnpm build --filter=@mindware-blog/dashboard
```

### Automated Testing

The CI/CD pipeline runs:
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Security scanning for vulnerabilities

### Vercel Preview Deployments

Every PR creates a preview deployment:
1. Automated tests run against preview URL
2. Manual QA on preview environment
3. Performance benchmarking
4. Security audit results reviewed

## Performance Optimization Strategies

### Build Optimization

```json
{
  "buildCommand": "cd ../.. && pnpm exec prisma generate --schema=packages/db/prisma/schema.prisma && pnpm exec prisma generate --schema=apps/dashboard/prisma/schema.prisma && pnpm turbo run build --filter=@mindware-blog/dashboard..."
}
```

**Optimization techniques**:
- Turborepo caching reduces build time by ~60% for incremental changes
- Prisma client generation runs before build to ensure type safety
- Filter flag (`--filter`) builds only dashboard and its dependencies

### Runtime Performance

- **Edge Functions**: Consider moving lightweight API routes to edge
- **Database Connection Pooling**: Use connection pooling to reduce database overhead
- **Caching Strategy**: Implement Redis caching for frequently accessed data
- **CDN Integration**: Static assets automatically served from Vercel CDN

### Monitoring

Implement performance monitoring:
- Vercel Analytics for web vitals (LCP, FID, CLS)
- Database query performance tracking
- API endpoint response time monitoring
- Error rate tracking with alerts

## Error Handling

### Build Errors

The build process includes error handling for common failures:

**Prisma Generate Failures**:
```bash
# Check schema syntax
pnpm prisma validate --schema=apps/dashboard/prisma/schema.prisma

# Ensure @prisma/client is in dependencies
pnpm why @prisma/client
```

**Dependency Issues**:
```bash
# Clean install if lockfile issues occur
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Type Errors**:
```bash
# Run type checking before build
pnpm typecheck --filter=@mindware-blog/dashboard
```

### Runtime Error Handling

API routes should implement comprehensive error handling:

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // API logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error for monitoring
    console.error('API Error:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
```

### Logging and Monitoring

Implement structured logging:
- Use Winston or Pino for structured logs
- Include request IDs for tracing
- Set up log aggregation (Datadog, Logtail, etc.)
- Configure alerts for critical errors

## API Interaction Examples

### Creating an Article

```typescript
// POST /api/articles/create
const response = await fetch('/api/articles/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Example Article',
    content: 'Article content here',
    publishedAt: new Date().toISOString()
  })
});

const data = await response.json();
if (!response.ok) {
  console.error('Error creating article:', data.error);
}
```

### Importing from Hashnode

```typescript
// POST /api/articles/import-hashnode
const response = await fetch('/api/articles/import-hashnode', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    hashnodeUrl: 'https://hashnode.dev/@username/article-slug'
  })
});

const data = await response.json();
```

## CI/CD Integration

### GitHub Actions Workflow

The project uses GitHub Actions for CI/CD:

```yaml
name: Deploy Dashboard
on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/dashboard/**'
      - 'packages/db/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Run tests
        run: pnpm test --filter=@mindware-blog/dashboard
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Deployment Environments

- **Production**: Deploys from `main` branch
- **Staging**: Deploys from `develop` branch
- **Preview**: Automatic for all PRs

## Version History

- **2025-11-11**: Added security, testing, performance, and error handling sections
- **2025-11-10**: Removed echo warning messages to comply with 256 character limit
- **2025-11-08**: Initial configuration with dual Prisma schema support

