# Documentation Site Vercel Configuration

This document explains the Vercel deployment configuration for the Documentation application.

## Configuration Overview

The `vercel.json` file contains the following key configurations:

### Build Command

```bash
cd ../.. && npx pnpm@10.14.0 build --filter=@portfolio/docs
```

**Purpose**: Builds the documentation site from the monorepo root.

**Steps**:
1. Navigate to the monorepo root (`cd ../..`)
2. Use npx to ensure PNPM version 10.14.0 is used
3. Build only the docs package and its dependencies using Turborepo filter

**Why pinned PNPM version (10.14.0)**:
- Ensures consistent builds across all environments (local, CI, Vercel)
- Prevents breaking changes from newer PNPM versions
- Vercel may not have the latest PNPM version pre-installed
- Using `npx` downloads the specific version if not already available

**Version Selection Rationale**:
- Version 10.14.0 was the stable release at project initialization
- Tested and verified with the monorepo workspace structure
- Should be periodically updated to leverage improvements and security patches

### Install Command

```bash
npx pnpm@10.14.0 install
```

**Purpose**: Install dependencies using the pinned PNPM version.

**Why not `--frozen-lockfile`**:
- The docs app has minimal dependencies
- Flexibility allows for automatic patch updates
- Consider adding `--frozen-lockfile` for stricter control in the future

**Why use npx**:
- Ensures the exact PNPM version is used for installation
- Prevents version mismatches between install and build steps
- Downloads the specified version if not present in the Vercel environment

### Framework Configuration

```json
"framework": "nextjs",
"outputDirectory": ".next"
```

**Purpose**: Tells Vercel this is a Next.js application.

**Output Directory**:
- Standard Next.js build output location
- Vercel needs this to know where to find the built application
- Should not be changed unless Next.js configuration is modified

## Deployment Considerations

### Environment Variables

The documentation site is static and requires minimal environment variables:
- `NEXT_PUBLIC_SITE_URL` (optional) - Base URL for canonical links
- `NEXT_PUBLIC_ALGOLIA_*` (optional) - Search integration if enabled

### Build Optimization

The documentation site:
- Uses static generation where possible
- Minimal API routes (if any)
- Content is markdown-based and compiled at build time
- Build time typically under 2 minutes

### PNPM Version Updates

When updating PNPM version:
1. Test locally with the new version
2. Update both `buildCommand` and `installCommand` in `vercel.json`
3. Update this documentation with the new version and reason for update
4. Verify successful deployment on Vercel preview before merging

### Troubleshooting

**Build fails with PNPM errors**:
- Verify the pinned version (10.14.0) is still supported by Vercel
- Check if workspace configuration has changed
- Try running build locally with same PNPM version

**Output directory not found**:
- Verify Next.js is building successfully
- Check that `outputDirectory` matches Next.js config
- Ensure build command is running from correct directory

**Missing dependencies**:
- Verify `pnpm-lock.yaml` is committed to repository
- Check that workspace references are correct in `package.json`
- Ensure shared packages are properly built before docs

## Performance Optimizations

The docs build is optimized for:
- **Fast builds**: Filter ensures only docs dependencies are processed
- **Reproducibility**: Pinned PNPM version eliminates version drift
- **Reliability**: Explicit version prevents unexpected breaking changes

## Version History

- **2025-11-10**: Removed echo warning messages to comply with 256 character limit
- **2025-11-10**: Added $schema for better IDE support
- **2025-11-08**: Initial configuration with pinned PNPM version 10.14.0

## Future Improvements

Consider these enhancements:
- Add `--frozen-lockfile` flag for stricter dependency control
- Implement caching strategy for faster builds
- Add build analytics to monitor performance
- Set up deployment notifications for build status
- Consider incremental static regeneration for large doc sets

