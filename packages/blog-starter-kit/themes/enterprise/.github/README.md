# GitHub Actions Workflow Documentation

This directory contains the GitHub Actions workflows and custom actions for the Mindware Blog project.

## 📁 Directory Structure

```
.github/
├── actions/
│   └── setup-pnpm/          # Custom action for pnpm setup with caching
│       └── action.yml
├── workflows/
│   └── main.yml             # Main CI/CD pipeline
└── README.md                # This documentation
```

## 🚀 Main CI/CD Pipeline

The main workflow (`main.yml`) provides a comprehensive CI/CD pipeline that handles:

- **Code Quality**: Linting and type checking
- **Testing**: Unit tests and visual regression tests
- **Security**: Vulnerability scanning with Trivy
- **Building**: Production-ready build artifacts
- **Deployment**: Automatic deployment to Vercel (production and preview)

### Workflow Triggers

- **Push Events**: Triggers on pushes to `main` and `develop` branches
- **Pull Requests**: Triggers on PRs targeting `main` and `development` branches

### Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_VERSION` | `18` | Node.js LTS version for better compatibility |
| `PNPM_VERSION` | `8` | Latest stable pnpm version |
| `PNPM_CACHE_PATH` | `~/.pnpm-store` | Cross-platform cache path |
| `WORKING_DIRECTORY` | `packages/blog-starter-kit/themes/enterprise` | Project root directory |

## 🔧 Custom Actions

### Setup pnpm Action

**Location**: `.github/actions/setup-pnpm/action.yml`

**Purpose**: Provides a reusable action for setting up Node.js, pnpm, and caching across all workflow jobs.

**Inputs**:
- `node-version` (required): Node.js version to use (default: `18`)
- `pnpm-version` (required): pnpm version to use (default: `8`)
- `cache-path` (optional): pnpm cache path (default: `~/.pnpm-store`)

**Features**:
- ✅ Cross-platform compatibility
- ✅ Optimized caching for faster builds
- ✅ Frozen lockfile installation for reproducible builds
- ✅ Comprehensive error handling

## 📋 Workflow Jobs

### 1. Workflow Validation
- **Purpose**: Validates all environment variables are properly configured
- **Dependencies**: None
- **Failure Impact**: Blocks all subsequent jobs

### 2. Lint & Type Check
- **Purpose**: Ensures code quality and type safety
- **Dependencies**: `validate-workflow`
- **Tools**: ESLint, TypeScript compiler
- **Failure Impact**: Blocks testing and building

### 3. Test
- **Purpose**: Runs unit and integration tests
- **Dependencies**: `lint-and-typecheck`
- **Environment**: CI mode enabled
- **Failure Impact**: Blocks building and deployment

### 4. Visual Regression Tests
- **Purpose**: Ensures UI consistency across changes
- **Dependencies**: `lint-and-typecheck`
- **Condition**: Only runs on PRs or when blog-related files are modified
- **Tools**: Playwright
- **Artifacts**: Test results and screenshots uploaded

### 5. Build
- **Purpose**: Creates production-ready build artifacts
- **Dependencies**: `lint-and-typecheck`, `test`
- **Condition**: Only runs if linting and tests pass
- **Artifacts**: Build files uploaded for deployment

### 6. Security Scan
- **Purpose**: Scans for vulnerabilities using Trivy
- **Dependencies**: `lint-and-typecheck`, `test`
- **Condition**: Only runs if linting and tests pass
- **Output**: SARIF file uploaded to GitHub Security tab

### 7. Deploy to Production
- **Purpose**: Deploys to production environment on Vercel
- **Dependencies**: `build`, `security`
- **Condition**: Only runs on `main` branch if build and security pass
- **Environment**: `production`

### 8. Deploy to Preview
- **Purpose**: Creates preview deployments for pull requests
- **Dependencies**: `build`, `security`
- **Condition**: Only runs on PRs if build and security pass
- **Environment**: `preview`

### 9. Workflow Status Summary
- **Purpose**: Provides comprehensive status report and notifications
- **Dependencies**: All previous jobs
- **Condition**: Always runs
- **Output**: PR comments with detailed status information

## 🔐 Security Features

- **Vulnerability Scanning**: Trivy scans for known vulnerabilities
- **SARIF Upload**: Results uploaded to GitHub Security tab
- **Minimal Permissions**: Each job has only the permissions it needs
- **Environment Protection**: Production deployments require environment approval

## 🚀 Deployment

### Production Deployment
- **Trigger**: Push to `main` branch
- **Requirements**: All tests pass, security scan passes
- **Environment**: `production`
- **Platform**: Vercel

### Preview Deployment
- **Trigger**: Pull request creation/update
- **Requirements**: All tests pass, security scan passes
- **Environment**: `preview`
- **Platform**: Vercel

## 📊 Monitoring & Notifications

### Visual Regression Tests
- Automatically comments on PRs with test results
- Uploads screenshots and diffs as artifacts
- Provides clear instructions for fixing issues

### Workflow Status
- Comprehensive status report posted to PRs
- Clear indication of which jobs passed/failed/skipped
- Helpful error messages for debugging

## 🛠️ Local Development

### Running Tests Locally

```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Run visual regression tests
pnpm test:visual

# Update visual regression baselines
pnpm test:visual:update
```

### Debugging Workflow Issues

1. **Check Environment Variables**: Ensure all required secrets are set in repository settings
2. **Review Job Logs**: Each job provides detailed logs for debugging
3. **Test Locally**: Reproduce issues locally using the commands above
4. **Check Dependencies**: Ensure all dependencies are properly configured

## 🔧 Configuration

### Required Secrets

| Secret | Description | Required For |
|--------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel deployment token | Deployment |
| `VERCEL_ORG_ID` | Vercel organization ID | Deployment |
| `VERCEL_PROJECT_ID` | Vercel project ID | Deployment |
| `NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT` | Hashnode GraphQL endpoint | Build (optional) |
| `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` | Hashnode publication host | Build (optional) |

### Environment Settings

- **Production Environment**: Requires manual approval for deployments
- **Preview Environment**: Automatic deployments for PRs

## 📈 Performance Optimizations

- **Caching**: pnpm cache is shared across all jobs
- **Parallel Execution**: Independent jobs run in parallel
- **Conditional Execution**: Visual tests only run when relevant files change
- **Artifact Retention**: Build artifacts retained for 7 days

## 🐛 Troubleshooting

### Common Issues

1. **Node.js Version Mismatch**
   - **Issue**: Build fails due to Node.js version incompatibility
   - **Solution**: Ensure local Node.js version matches workflow (18.x)

2. **Cache Issues**
   - **Issue**: Dependencies not installing correctly
   - **Solution**: Clear pnpm cache: `pnpm store prune`

3. **Visual Test Failures**
   - **Issue**: Screenshots don't match baseline
   - **Solution**: Review changes, update baselines if intentional

4. **Deployment Failures**
   - **Issue**: Vercel deployment fails
   - **Solution**: Check Vercel secrets and project configuration

### Getting Help

- Check workflow logs for detailed error messages
- Review this documentation for configuration requirements
- Test changes locally before pushing
- Use the workflow status comments for debugging

## 🔄 Maintenance

### Regular Updates

- **Action Versions**: Update to latest stable versions monthly
- **Node.js Version**: Update to latest LTS when available
- **Dependencies**: Keep project dependencies up to date
- **Security**: Review and update security configurations

### Monitoring

- Monitor workflow performance and duration
- Review security scan results regularly
- Check deployment success rates
- Update documentation as needed

---

## 📝 Changelog

### Latest Updates
- ✅ Fixed Node.js version from 20 to 18 LTS
- ✅ Updated all GitHub Actions to latest stable versions
- ✅ Added comprehensive error handling and notifications
- ✅ Enhanced documentation and comments
- ✅ Improved cross-platform compatibility
- ✅ Added security scanning with Trivy
- ✅ Implemented visual regression testing
- ✅ Added workflow status reporting

---

*This documentation is maintained alongside the workflow files. Please update it when making changes to the CI/CD pipeline.*
