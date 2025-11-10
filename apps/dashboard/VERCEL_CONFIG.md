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

## Version History

- **2025-11-10**: Removed echo warning messages to comply with 256 character limit
- **2025-11-08**: Initial configuration with dual Prisma schema support

