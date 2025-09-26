# GitHub Actions CI/CD Setup Guide

This guide will help you set up a comprehensive CI/CD pipeline for your mindware-blog project using GitHub Actions.

## 🚀 Overview

The GitHub Actions workflow includes:

- **Linting & Type Checking**: ESLint and TypeScript validation
- **Testing**: Unit and integration tests (when added)
- **Building**: Next.js application build
- **Security Scanning**: Vulnerability scanning with Trivy
- **Deployment**: Automatic deployment to Vercel
- **Notifications**: Success/failure notifications

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Vercel Account**: For deployment
3. **GitHub Secrets**: For secure environment variables

## 🔧 Setup Steps

### 1. Vercel Configuration

First, you need to get your Vercel project details:

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Link your project** (run from the enterprise theme directory):

   ```bash
   cd packages/blog-starter-kit/themes/enterprise
   vercel link
   ```

4. **Get your project details**:
   ```bash
   vercel project ls
   ```

### 2. GitHub Secrets Setup

Go to your GitHub repository → Settings → Secrets and variables → Actions, then add these secrets:

#### Required Secrets:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here
VERCEL_PROJECT_ID=your_vercel_project_id_here
```

#### Optional Secrets (for enhanced features):

```bash
# Slack Notifications (optional)
SLACK_WEBHOOK_URL=your_slack_webhook_url

# Snyk Security Scanning (optional)
SNYK_TOKEN=your_snyk_token

# Database (if using external database)
DATABASE_URL=your_database_url
```

### 3. How to Get Vercel Secrets

#### Vercel Token:

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name like "GitHub Actions"
4. Copy the token

#### Vercel Org ID:

1. Go to [Vercel Dashboard](https://vercel.com/account)
2. Click on your organization
3. The Org ID is in the URL: `https://vercel.com/orgs/YOUR_ORG_ID`

#### Vercel Project ID:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "General"
3. Copy the "Project ID"

### 4. Environment Variables

The workflow uses these environment variables during build:

```bash
# Production build
NEXT_PUBLIC_MODE=production
```

You can add more environment variables in the workflow file under the "Build" job.

## 🔄 Workflow Triggers

The workflow runs on:

- **Push to main branch**: Deploys to production
- **Push to develop branch**: Runs all checks
- **Pull requests**: Creates preview deployments

## 📊 Workflow Jobs

### 1. Lint & Type Check

- Runs ESLint for code quality
- Runs TypeScript type checking
- Must pass before other jobs

### 2. Test

- Runs unit tests (when added)
- Runs integration tests (when added)
- Currently a placeholder

### 3. Build

- Builds the Next.js application
- Creates build artifacts
- Validates the build process

### 4. Security Scan

- Scans for vulnerabilities using Trivy
- Uploads results to GitHub Security tab
- Doesn't block deployment but provides insights

### 5. Deploy Production

- Deploys to Vercel production environment
- Only runs on main branch
- Uses production environment variables

### 6. Deploy Preview

- Creates preview deployments for pull requests
- Allows testing changes before merge
- Uses preview environment variables

### 7. Notify

- Provides success/failure notifications
- Can be extended with Slack/Discord integration

## 🧪 Adding Tests

To add real tests to your project:

1. **Install testing dependencies**:

   ```bash
   pnpm add -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
   ```

2. **Create Jest configuration** (`jest.config.js`):

   ```javascript
   module.exports = {
   	testEnvironment: 'jsdom',
   	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
   	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
   	moduleNameMapping: {
   		'^@/(.*)$': '<rootDir>/$1',
   	},
   };
   ```

3. **Create Jest setup** (`jest.setup.js`):

   ```javascript
   import '@testing-library/jest-dom';
   ```

4. **Update package.json test script**:

   ```json
   {
   	"scripts": {
   		"test": "jest",
   		"test:watch": "jest --watch",
   		"test:coverage": "jest --coverage"
   	}
   }
   ```

5. **Create test files** (e.g., `__tests__/components/Header.test.tsx`):

   ```typescript
   import { render, screen } from '@testing-library/react';
   import Header from '../components/Header';

   describe('Header', () => {
     it('renders correctly', () => {
       render(<Header />);
       expect(screen.getByRole('banner')).toBeInTheDocument();
     });
   });
   ```

## 🔒 Security Features

### Trivy Vulnerability Scanner

- Scans for known vulnerabilities in dependencies
- Scans for security issues in your code
- Results appear in GitHub Security tab

### Optional: Snyk Integration

To add Snyk security scanning:

1. **Get Snyk token** from [Snyk Dashboard](https://app.snyk.io/account)
2. **Add to GitHub secrets**: `SNYK_TOKEN`
3. **Uncomment Snyk step** in the workflow file

## 📱 Notifications

### Basic Notifications

The workflow provides basic console notifications for success/failure.

### Slack Integration (Optional)

To add Slack notifications:

1. **Create Slack webhook** in your Slack workspace
2. **Add to GitHub secrets**: `SLACK_WEBHOOK_URL`
3. **Uncomment Slack notification step** in the workflow file

## 🚨 Troubleshooting

### Enhanced Error Handling & Logging

The workflow now includes comprehensive error handling and detailed logging:

#### Environment Variable Validation
- **Automatic validation** of all required environment variables
- **Clear error messages** with emoji indicators (❌/✅)
- **Early failure detection** to prevent downstream issues
- **Detailed logging** for each validation step

#### Improved Job Error Handling
- **Comprehensive status reporting** for all workflow jobs
- **Detailed failure messages** with context
- **Graceful error recovery** where possible
- **Enhanced logging** throughout the build process

### Common Issues

#### Build Fails

- Check environment variables are set correctly (now auto-validated)
- Verify all dependencies are installed
- Check for TypeScript errors
- Review enhanced error logs for specific failure points

#### Deployment Fails

- Verify Vercel secrets are correct
- Check Vercel project is linked properly
- Ensure Vercel token has correct permissions
- Review deployment logs for detailed error information

#### Security Scan Fails

- Review vulnerability reports
- Update dependencies if needed
- Check for false positives
- Security scans now upload results to GitHub Security tab

#### Visual Regression Test Failures

- Check PR comments for detailed visual test results
- Review uploaded artifacts for screenshots and diffs
- Update baseline images if changes are intentional

### Debugging

1. **Check workflow logs** in GitHub Actions tab (now with enhanced detail)
2. **Review status reports** posted as PR comments
3. **Test locally** before pushing:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
4. **Verify secrets** are set correctly
5. **Check Vercel project** is properly configured
6. **Review visual test artifacts** for UI changes

## 🔄 Workflow Customization

### Adding New Jobs

To add new jobs to the workflow:

1. **Add job definition** in `.github/workflows/main.yml`
2. **Set dependencies** using `needs:`
3. **Configure triggers** using `if:`

### Environment-Specific Deployments

To add staging environment:

1. **Add staging job** similar to production
2. **Set different environment variables**
3. **Configure different Vercel project** if needed

### Performance Optimization

- **Cache dependencies** (already implemented)
- **Parallel jobs** where possible
- **Conditional job execution**

## 📈 Monitoring

### GitHub Actions Insights

- View workflow performance in Actions tab
- Monitor job success rates
- Track deployment times

### Vercel Analytics

- Monitor deployment performance
- Track build times
- Analyze deployment success rates

## 🎯 Best Practices

1. **Keep workflows fast**: Use caching and parallel jobs
2. **Fail fast**: Run quick checks first
3. **Security first**: Always run security scans
4. **Test thoroughly**: Add comprehensive tests
5. **Monitor deployments**: Set up alerts for failures
6. **Document changes**: Update this guide when modifying workflows
7. **Enhanced error handling**: Use detailed logging and validation
8. **Performance optimization**: Leverage Node.js caching and parallel execution

## 🧩 New Components

### FeatureGrid Component

The workflow now includes testing for the new FeatureGrid component system:

- **Comprehensive unit tests** covering all component scenarios
- **TypeScript interfaces** for type safety
- **Stone theme integration** following design system standards
- **Accessibility compliance** with proper ARIA attributes
- **Responsive design** with Tailwind CSS grid layouts

#### Usage Example

```tsx
import { FeatureGrid, Feature } from '@/components/projects';

const features: Feature[] = [
  {
    id: 'feature-1',
    title: 'Modern Design',
    description: 'Clean, contemporary interface...'
  }
];

<FeatureGrid 
  features={features}
  title="Why Choose Our Platform"
  description="Discover the key features..."
/>
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Actions documentation
3. Check Vercel deployment logs
4. Verify all secrets and environment variables

---

This setup provides a robust CI/CD pipeline that will automatically test, build, and deploy your mindware-blog project with every push to main!
