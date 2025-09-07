# Performance Testing Guide

This guide provides comprehensive information about the performance testing setup and monitoring tools for the blog application.

## Overview

The performance testing suite is designed to ensure the application meets Core Web Vitals standards and provides optimal user experience. It includes automated testing, monitoring, and reporting capabilities.

## Prerequisites

Before running performance tests, ensure you have the required dependencies installed:

```bash
# Validate all dependencies
npm run validate:dependencies

# Install missing dependencies if needed
npm install --save-dev lighthouse@^11.0.0 chrome-launcher@^1.0.0 @playwright/test@^1.55.0 @axe-core/playwright@^4.8.5
```

## Available Test Scripts

### Core Performance Testing

- `npm run test:performance` - Run Core Web Vitals tests using Playwright
- `npm run test:performance:monitor` - Run performance monitoring with detailed reporting
- `npm run test:performance:lighthouse` - Run Lighthouse audit for comprehensive analysis
- `npm run test:performance:budget` - Validate against performance budgets

### Accessibility-Performance Integration

- `npm run test:accessibility` - Run accessibility tests only
- `npm run test:accessibility-performance` - Combined accessibility and performance testing
- `npm run test:accessibility-performance:monitor` - Comprehensive UX monitoring

### Resource Validation

- `npm run test:performance:cors` - Validate CORS headers for font and resource loading
- `npm run test:performance:resources` - Validate resource paths and file types
- `npm run test:performance:fonts` - Validate font files and their formats
- `npm run test:performance:css` - CSS optimization validation

### Comprehensive Testing

- `npm run test:performance:all` - Run all performance tests in sequence
- `npm run test:all` - Run all testing suites (performance, security, automation)

## Performance Budgets

The application uses performance budgets defined in `performance-budget.json` to prevent regressions:

### Core Web Vitals Thresholds

- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8 seconds

### Resource Budgets

- **JavaScript**: < 500KB total
- **CSS**: < 200KB total
- **Images**: < 1000KB total
- **Total Page Weight**: < 2000KB

## Test Structure

### Performance Tests (`tests/blog-performance.spec.ts`)

1. **Core Web Vitals Testing**
   - LCP, FID, CLS, FCP measurement
   - Threshold validation
   - Error handling for missing metrics

2. **Page Load Performance**
   - Load time measurement
   - Console error detection
   - Network idle state validation

3. **Cross-Browser Testing**
   - Chromium, Firefox, WebKit
   - Mobile Chrome, Mobile Safari
   - Accessibility testing mode

### Accessibility-Performance Tests (`tests/accessibility-performance.spec.ts`)

1. **Combined UX Testing**
   - Simultaneous accessibility and performance validation
   - UX score calculation
   - Real-time metrics collection

2. **Component-Specific Testing**
   - Homepage accessibility during performance optimization
   - Case study pages validation
   - Chatbot accessibility and performance

## Monitoring Scripts

### Performance Monitor (`scripts/performance-monitor.js`)

- Runs Playwright performance tests
- Extracts Core Web Vitals metrics
- Validates against thresholds
- Generates detailed reports
- Includes security validation

### Lighthouse Audit (`scripts/lighthouse-audit.js`)

- Launches Chrome browser for comprehensive audit
- Generates HTML and JSON reports
- Configurable audit categories
- Performance score validation

### Budget Checker (`scripts/performance-budget-check.js`)

- Validates against performance budgets
- Provides detailed violation reporting
- Generates actionable recommendations
- Enhanced error handling and validation

### Accessibility-Performance Monitor (`scripts/accessibility-performance-monitor.js`)

- Combined accessibility and performance validation
- Unified reporting with UX scoring
- Trend analysis and recommendations
- Production-ready monitoring

## Real User Monitoring (RUM)

The application includes production RUM capabilities:

### Features

- **Core Web Vitals Collection**: LCP, FID, CLS, FCP tracking
- **Accessibility Monitoring**: Assistive technology detection
- **Error Tracking**: JavaScript errors and unhandled rejections
- **User Experience Metrics**: Combined UX scoring

### Configuration

RUM is automatically enabled in production environments with:
- 10% sampling rate
- Secure data transmission
- Privacy-compliant data collection

## Mock Data System

The application uses an enhanced mock data system for performance testing:

### Features

- **Dynamic Generation**: Configurable scenarios (minimal, standard, heavy)
- **Environment Awareness**: Different data sets for test vs production
- **Performance Optimization**: Eliminates database bottlenecks during testing
- **Realistic Data**: Maintains performance characteristics

### Usage

```typescript
import { generateMockPosts, PERFORMANCE_SCENARIOS } from '../../lib/mock-data-generator';

// Use minimal data for testing
const mockPosts = generateMockPosts(PERFORMANCE_SCENARIOS.minimal);

// Use standard data for development
const mockPosts = generateMockPosts(PERFORMANCE_SCENARIOS.standard);
```

## Caching Strategy

The application implements comprehensive caching for performance optimization:

### Cache Types

- **Memory Cache**: Fast access for frequently used data
- **HTTP Cache Headers**: Optimized browser caching
- **Service Worker**: Offline-first caching strategy
- **Image Optimization**: Next.js Image component with lazy loading

### Configuration

Cache strategies are defined in `lib/cache-strategy.ts` with:
- TTL (Time To Live) configuration
- Size limits and cleanup
- Cache invalidation strategies
- Performance monitoring

## Best Practices

### Development

1. **Use Mock Data**: Always use mock data for performance testing
2. **Optimize Images**: Use Next.js Image component with proper sizing
3. **Lazy Loading**: Implement lazy loading for below-the-fold content
4. **Code Splitting**: Use dynamic imports for large components

### Testing

1. **Run Budget Checks**: Always validate against performance budgets
2. **Monitor Trends**: Track performance metrics over time
3. **Test Real Scenarios**: Use realistic data and user interactions
4. **Cross-Browser Testing**: Validate across different browsers

### Production

1. **Enable RUM**: Monitor real user performance metrics
2. **Set Up Alerts**: Configure alerts for performance violations
3. **Regular Audits**: Schedule regular Lighthouse audits
4. **Performance Reviews**: Include performance in code reviews

## Troubleshooting

### Common Issues

1. **Lighthouse Timeout**
   - Ensure development server is running
   - Check for slow-loading resources
   - Increase timeout in configuration

2. **Missing Dependencies**
   - Run `npm run validate:dependencies`
   - Install missing packages
   - Check Node.js version compatibility

3. **Performance Violations**
   - Review performance budget configuration
   - Optimize identified bottlenecks
   - Use performance monitoring tools

### Getting Help

- Check the test output for specific error messages
- Review the generated reports in `test-results/`
- Consult the performance budget configuration
- Run dependency validation for setup issues

## Continuous Integration

The performance testing suite is designed to work in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Performance Tests
  run: |
    npm run validate:dependencies
    npm run test:performance:budget
    npm run test:accessibility-performance
```

## Reporting

All performance tests generate detailed reports:

- **JSON Reports**: Machine-readable metrics
- **HTML Reports**: Human-readable visualizations
- **Console Output**: Real-time feedback
- **Dashboard Integration**: Admin dashboard for monitoring

Reports are saved to `test-results/` directory with timestamps for historical tracking.
