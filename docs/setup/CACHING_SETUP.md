# Enhanced Caching Setup Guide

This guide explains how to set up and optimize caching for the Mindware Blog project to achieve faster builds and better CI/CD performance.

## 🚀 Quick Start

### 1. Local Development Caching

The project is already configured with Turbo caching. Simply run:

```bash
# Build with local caching
pnpm turbo build --filter=@mindware-blog/site

# Or build all packages
pnpm turbo build
```

### 2. Remote Caching Setup (Recommended)

For the best performance, especially in CI/CD, set up remote caching:

#### Option A: Vercel Remote Cache (Recommended)

1. **Install Turbo CLI globally:**
   ```bash
   npm install -g turbo
   ```

2. **Login to Vercel:**
   ```bash
   npx turbo login
   ```

3. **Link your project:**
   ```bash
   npx turbo link
   ```

4. **Add secrets to GitHub repository:**
   - Go to your repository settings
   - Navigate to "Secrets and variables" → "Actions"
   - Add these secrets:
     - `TURBO_TOKEN`: Your Turbo token (from `npx turbo login`)
     - `TURBO_TEAM`: Your Vercel team ID (optional)

#### Option B: Self-Hosted Remote Cache

1. **Set up a remote cache server** (using Redis, S3, or similar)
2. **Configure environment variables:**
   ```bash
   export TURBO_REMOTE_CACHE_URL="your-cache-url"
   export TURBO_REMOTE_CACHE_TOKEN="your-token"
   ```

## 📊 Cache Configuration

### Enhanced turbo.json

The project now includes optimized caching configuration:

- **Global Dependencies**: Files that affect all tasks
- **Task-Specific Inputs**: Only relevant files for each task
- **Output Caching**: Build artifacts are cached and reused

### GitHub Actions Caching

The workflow now includes multiple cache layers:

1. **pnpm Cache**: Dependencies and package store
2. **Turbo Cache**: Build outputs and task results
3. **Node Modules Cache**: Installed packages
4. **Build Artifacts Cache**: Compiled outputs

## 🔧 Cache Verification

### Local Cache Status

```bash
# Check cache status
pnpm turbo build --filter=@mindware-blog/site --dry-run

# Clear cache if needed
pnpm turbo build --filter=@mindware-blog/site --force
```

### CI/CD Cache Monitoring

The workflow now includes cache statistics in the build logs:

- Turbo cache size
- pnpm cache size
- Node modules size
- Build output sizes

## 🎯 Performance Optimizations

### 1. Input Patterns

The enhanced `turbo.json` includes specific input patterns for each task:

- **Build**: Only watches source files, assets, and configuration
- **Lint**: Only watches source files and ESLint config
- **Test**: Only watches test files and test configuration
- **TypeCheck**: Only watches TypeScript files and config

### 2. Cache Invalidation

Caches are invalidated when:
- Source files change (for build tasks)
- Configuration files change (global dependencies)
- Lock files change (for dependency caches)

### 3. Parallel Execution

Tasks run in parallel when possible:
- Lint and typecheck can run simultaneously
- Tests can run in parallel with visual regression
- Build tasks respect dependencies but cache results

## 🚨 Troubleshooting

### Cache Not Working

1. **Check cache configuration:**
   ```bash
   pnpm turbo build --filter=@mindware-blog/site --dry-run
   ```

2. **Clear and rebuild:**
   ```bash
   pnpm turbo build --filter=@mindware-blog/site --force
   ```

3. **Verify file patterns in turbo.json**

### Remote Cache Issues

1. **Check authentication:**
   ```bash
   npx turbo login
   ```

2. **Verify team access:**
   ```bash
   npx turbo link
   ```

3. **Check environment variables in CI**

### Performance Issues

1. **Monitor cache hit rates** in CI logs
2. **Check cache sizes** in build statistics
3. **Verify input patterns** are not too broad

## 📈 Expected Performance Gains

With proper caching setup:

- **First build**: Normal speed
- **Subsequent builds**: 50-80% faster
- **CI/CD builds**: 60-90% faster with remote cache
- **Dependency installation**: 70-90% faster with pnpm cache

## 🔄 Cache Maintenance

### Regular Maintenance

1. **Clear old caches** periodically:
   ```bash
   pnpm turbo build --filter=@mindware-blog/site --force
   ```

2. **Update cache keys** when configuration changes significantly

3. **Monitor cache sizes** to avoid storage issues

### CI/CD Cache Management

- Caches are automatically managed by GitHub Actions
- Old caches are automatically cleaned up
- Cache keys include file hashes for automatic invalidation

## 📚 Additional Resources

- [Turbo Documentation](https://turbo.build/repo/docs)
- [Vercel Remote Cache](https://vercel.com/docs/concepts/monorepos/remote-caching)
- [GitHub Actions Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

## 🆘 Support

If you encounter issues with caching:

1. Check the build logs for cache statistics
2. Verify your turbo.json configuration
3. Ensure all required secrets are set in GitHub
4. Check the troubleshooting section above

For additional help, refer to the project documentation or create an issue in the repository.
