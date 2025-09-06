# Performance Testing Scripts Documentation

This document provides comprehensive documentation for all performance testing scripts in the blog starter kit.

## 📋 Overview

The performance testing suite includes multiple scripts for comprehensive performance validation, monitoring, and optimization. Each script is designed to be run independently or as part of the complete testing pipeline.

## 🚀 Available Scripts

### 1. **Performance Monitor** (`scripts/performance-monitor.js`)

**Purpose**: Monitors Core Web Vitals and performance metrics for the blog application.

**Usage**:
```bash
npm run test:performance:monitor
```

**Features**:
- Runs Playwright performance tests
- Extracts Core Web Vitals metrics (LCP, FID, CLS, FCP)
- Validates metrics against performance thresholds
- Generates detailed performance reports
- Includes security validation and error handling

**Output**: 
- Console summary with pass/fail status
- JSON report saved to `test-results/performance-report.json`

**Security Features**:
- Environment validation (prevents production execution)
- Dependency validation
- File permission checks
- Suspicious environment variable detection

### 2. **Lighthouse Audit** (`scripts/lighthouse-audit.js`)

**Purpose**: Runs comprehensive Lighthouse audits for performance analysis.

**Usage**:
```bash
npm run test:performance:lighthouse
```

**Features**:
- Launches Chrome browser for Lighthouse audit
- Generates comprehensive performance report
- Saves HTML and JSON reports
- Configurable audit categories

**Output**:
- HTML report: `test-results/lighthouse-report.html`
- JSON report: `test-results/lighthouse-report.json`

### 3. **CORS Validation** (`scripts/validate-cors.js`)

**Purpose**: Validates CORS headers for font and resource loading.

**Usage**:
```bash
npm run test:performance:cors
```

**Features**:
- Checks CORS headers for critical resources
- Validates font loading permissions
- Tests cross-origin resource sharing
- Provides detailed CORS analysis

**Output**:
- Console summary with CORS status
- JSON report saved to `test-results/cors-validation-report.json`

### 4. **Resource Validation** (`scripts/validate-resources.js`)

**Purpose**: Validates resource paths and file types for all referenced assets.

**Usage**:
```bash
npm run test:performance:resources
```

**Features**:
- Validates existence of all referenced resources
- Checks file types and MIME types
- Provides size and modification date information
- Generates optimization recommendations

**Output**:
- Console summary with resource status
- JSON report saved to `test-results/resource-validation-report.json`

### 5. **Font Validation** (`scripts/validate-fonts.js`)

**Purpose**: Validates font files and their formats for web compatibility.

**Usage**:
```bash
npm run test:performance:fonts
```

**Features**:
- Validates font file headers and signatures
- Checks font file integrity
- Provides format recommendations (TTF vs WOFF2)
- Analyzes font file sizes and optimization opportunities

**Output**:
- Console summary with font validation status
- JSON report saved to `test-results/font-validation-report.json`

### 6. **CSS Optimization** (`scripts/optimize-css.js`)

**Purpose**: Analyzes and optimizes CSS for performance and accessibility.

**Usage**:
```bash
npm run test:performance:css
```

**Features**:
- Validates HSL color format consistency
- Checks for CSS specificity issues
- Analyzes performance optimization opportunities
- Validates accessibility compliance
- Provides optimization recommendations

**Output**:
- Console summary with optimization score
- JSON report saved to `test-results/css-optimization-report.json`

### 7. **Comprehensive Testing Suite** (`scripts/run-all-performance-tests.js`)

**Purpose**: Runs all performance tests and validations in sequence.

**Usage**:
```bash
npm run test:performance:all
```

**Features**:
- Executes all performance testing scripts
- Provides comprehensive pass/fail summary
- Generates overall performance assessment
- Includes critical vs optional test categorization

**Output**:
- Console summary with overall status
- JSON report saved to `test-results/comprehensive-performance-report.json`

## 🔧 Configuration

### Environment Variables

- `NODE_ENV`: Set to 'production' to prevent test execution in production
- `ALLOW_PROD_TESTS`: Set to 'true' to allow tests in production (use with caution)
- `LIGHTHOUSE_URL`: Override default URL for Lighthouse audits

### Performance Thresholds

Default thresholds are defined in each script:

```javascript
const THRESHOLDS = {
  LCP: 2500, // 2.5 seconds
  FID: 100,  // 100 milliseconds
  CLS: 0.1,  // 0.1
  FCP: 1800  // 1.8 seconds
};
```

## 📊 Report Structure

All scripts generate JSON reports with the following structure:

```json
{
  "timestamp": "2025-01-XX...",
  "summary": {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "criticalFailures": 0
  },
  "details": {
    // Script-specific data
  },
  "recommendations": [
    {
      "type": "performance",
      "priority": "high",
      "message": "Description of recommendation"
    }
  ]
}
```

## 🚨 Error Handling

All scripts include comprehensive error handling:

- **Timeout Protection**: 5-minute timeout for long-running operations
- **Graceful Degradation**: Scripts continue execution even if individual tests fail
- **Detailed Error Messages**: Clear error descriptions with troubleshooting hints
- **Exit Codes**: Proper exit codes for CI/CD integration

## 🔒 Security Features

All scripts include security validation:

- **Environment Checks**: Prevents execution in production environments
- **Dependency Validation**: Ensures required modules are available
- **File Permission Checks**: Validates script file permissions
- **Suspicious Variable Detection**: Checks for potentially malicious environment variables

## 🧪 Testing Integration

### Local Development

```bash
# Run individual tests
npm run test:performance:monitor
npm run test:performance:lighthouse
npm run test:performance:cors

# Run comprehensive suite
npm run test:performance:all
```

### CI/CD Integration

The scripts are integrated into GitHub Actions workflow:

```yaml
- name: Run performance tests
  run: npm run test:performance:all
```

### Docker Integration

Scripts can be run in Docker containers:

```dockerfile
RUN npm run test:performance:all
```

## 📈 Performance Monitoring

### Metrics Tracked

- **Core Web Vitals**: LCP, FID, CLS, FCP
- **Resource Loading**: Font loading, CSS loading, image optimization
- **CORS Compliance**: Cross-origin resource sharing validation
- **File Integrity**: Resource and font file validation

### Monitoring Recommendations

1. **Regular Testing**: Run performance tests on every deployment
2. **Threshold Monitoring**: Set up alerts for threshold violations
3. **Trend Analysis**: Track performance metrics over time
4. **Resource Optimization**: Use recommendations to optimize assets

## 🛠️ Troubleshooting

### Common Issues

1. **Script Timeout**: Increase timeout values for slow environments
2. **Missing Dependencies**: Ensure all required packages are installed
3. **Permission Errors**: Check file permissions and execution context
4. **Environment Issues**: Verify NODE_ENV and other environment variables

### Debug Mode

Enable debug mode by setting environment variables:

```bash
DEBUG=1 npm run test:performance:monitor
```

## 📚 Additional Resources

- [Core Web Vitals Documentation](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Playwright Documentation](https://playwright.dev/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 🔄 Maintenance

### Regular Updates

- Update performance thresholds based on industry standards
- Review and update dependencies regularly
- Monitor for new performance testing tools and techniques
- Update documentation as scripts evolve

### Version Compatibility

Scripts are tested with:
- Node.js 18+
- Playwright 1.40+
- Lighthouse 10+
- Next.js 14+

---

*Last updated: January 2025*
*For questions or issues, please refer to the project's issue tracker.*
