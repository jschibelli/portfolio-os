# Visual Regression Testing Troubleshooting Guide

## Overview

This guide provides comprehensive troubleshooting steps for visual regression testing issues, addressing common problems and providing solutions for maintaining a robust testing environment.

## Common Issues and Solutions

### 1. False Positive Test Failures

#### **Issue**: Tests fail due to minor rendering differences
- **Symptoms**: Tests fail with small pixel differences (< 1%)
- **Causes**: Font rendering differences, anti-aliasing variations, browser differences
- **Solutions**:
  ```bash
  # Review the diff images in test-results/
  # If changes are acceptable, update baselines
  pnpm test:visual:update
  
  # For specific test only
  npx playwright test tests/visual/blog-page.spec.ts --update-snapshots
  ```

#### **Issue**: Animation interference
- **Symptoms**: Inconsistent screenshots due to animations
- **Causes**: CSS animations not properly disabled
- **Solutions**:
  - Animations are disabled in test environment via `beforeEach` hook
  - If issues persist, check for JavaScript-based animations
  - Add additional wait times for complex animations

### 2. Environment-Specific Issues

#### **Issue**: Tests pass locally but fail in CI
- **Symptoms**: Different results between local and CI environments
- **Causes**: Different browser versions, system fonts, rendering engines
- **Solutions**:
  ```bash
  # Run tests with same browser as CI
  npx playwright test --project=chromium
  
  # Check browser versions
  npx playwright --version
  
  # Update browsers
  npx playwright install
  ```

#### **Issue**: Timing-related failures
- **Symptoms**: Tests fail intermittently due to loading issues
- **Causes**: Network latency, slow resource loading
- **Solutions**:
  - Tests wait for `networkidle` state
  - Additional 1-second timeout for stability
  - If issues persist, increase timeout:
    ```typescript
    await page.waitForTimeout(2000); // Increase from 1000ms
    ```

### 3. Baseline Management Issues

#### **Issue**: Baseline images are outdated
- **Symptoms**: All tests fail after design changes
- **Causes**: Intentional design changes not reflected in baselines
- **Solutions**:
  ```bash
  # Update all baselines
  pnpm test:visual:update
  
  # Review changes before committing
  git diff test-results/
  
  # Commit updated baselines with clear message
  git add test-results/
  git commit -m "Update visual regression baselines after design changes"
  ```

#### **Issue**: Baseline images are corrupted
- **Symptoms**: Tests fail with unexpected image formats
- **Causes**: File corruption, incorrect image processing
- **Solutions**:
  ```bash
  # Delete corrupted baselines
  rm -rf test-results/
  
  # Regenerate all baselines
  pnpm test:visual:update
  
  # Verify baseline images
  ls -la test-results/
  ```

### 4. CI/CD Integration Issues

#### **Issue**: Visual tests not running in CI
- **Symptoms**: No visual regression job in GitHub Actions
- **Causes**: Incorrect file path triggers, workflow configuration
- **Solutions**:
  - Check workflow triggers in `.github/workflows/main.yml`
  - Ensure files are in correct paths: `/app/blog/`, `/components/blog/`, `/pages/blog`
  - Verify workflow permissions

#### **Issue**: PR comments not appearing
- **Symptoms**: Tests run but no feedback in PR
- **Causes**: GitHub token permissions, script errors
- **Solutions**:
  - Check GitHub Actions logs for errors
  - Verify `GITHUB_TOKEN` permissions
  - Review the PR comment script in workflow

### 5. Performance Issues

#### **Issue**: Tests run slowly
- **Symptoms**: Long execution times for visual tests
- **Causes**: Large viewport sizes, complex page rendering
- **Solutions**:
  ```bash
  # Run tests in parallel (default)
  npx playwright test --workers=4
  
  # Run specific tests only
  npx playwright test tests/visual/blog-page.spec.ts
  
  # Use UI mode for debugging
  pnpm test:visual:ui
  ```

#### **Issue**: High memory usage
- **Symptoms**: CI runs out of memory
- **Causes**: Large screenshots, multiple browser instances
- **Solutions**:
  - Tests use single worker in CI (`workers: 1`)
  - Screenshots only on failure (`screenshot: 'only-on-failure'`)
  - Videos only on failure (`video: 'retain-on-failure'`)

## Debugging Commands

### **Local Debugging**
```bash
# Run with debug output
DEBUG=pw:api pnpm test:visual

# Run with headed browser (see what's happening)
npx playwright test tests/visual/blog-page.spec.ts --headed

# Run with trace for detailed debugging
npx playwright test tests/visual/blog-page.spec.ts --trace on

# Run specific test with UI
npx playwright test tests/visual/blog-page.spec.ts --ui
```

### **CI Debugging**
```bash
# Check workflow logs in GitHub Actions
# Look for specific error messages in the visual-regression job

# Download artifacts for local analysis
# GitHub Actions uploads test results and screenshots
```

## Best Practices for Maintenance

### **Regular Maintenance Tasks**
1. **Weekly**: Review failed tests and update baselines if needed
2. **Monthly**: Check for Playwright updates and browser compatibility
3. **Quarterly**: Audit baseline images for accuracy and relevance

### **When to Update Baselines**
- ✅ **Update**: Intentional design changes, new features, bug fixes
- ❌ **Don't Update**: Accidental changes, regressions, temporary issues

### **Baseline Update Process**
1. Make your changes
2. Run tests locally: `pnpm test:visual`
3. Review any failures
4. If changes are intentional: `pnpm test:visual:update`
5. Review updated baselines: `git diff test-results/`
6. Commit with clear message
7. Create PR with description of visual changes

## Error Recovery Procedures

### **Complete Test Reset**
```bash
# If tests are completely broken
rm -rf test-results/
pnpm test:visual:update
git add test-results/
git commit -m "Reset visual regression baselines"
```

### **Selective Test Reset**
```bash
# Reset specific test baselines
rm test-results/blog-page-desktop.png
npx playwright test tests/visual/blog-page.spec.ts --update-snapshots
```

### **Emergency Bypass**
```bash
# Temporarily disable visual tests (not recommended)
# Comment out visual-regression job in .github/workflows/main.yml
# Or add [skip visual] to commit message
```

## Monitoring and Alerts

### **Key Metrics to Monitor**
- Test execution time (should be < 5 minutes)
- False positive rate (should be < 5%)
- Baseline update frequency (should be intentional)
- CI failure rate (should be < 10%)

### **Alert Conditions**
- Tests failing consistently (> 3 consecutive failures)
- Execution time > 10 minutes
- Multiple baseline updates in single PR
- CI job not running on relevant PRs

## Getting Help

### **Internal Resources**
- Review this troubleshooting guide
- Check existing documentation in `/docs/pages/blog/`
- Review test plan and implementation guides

### **External Resources**
- [Playwright Documentation](https://playwright.dev/docs/test-snapshots)
- [Visual Regression Testing Best Practices](https://playwright.dev/docs/test-snapshots#best-practices)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### **Escalation Process**
1. Check this troubleshooting guide
2. Review GitHub Actions logs
3. Test locally to reproduce issues
4. Create issue with detailed error information
5. Include screenshots, logs, and reproduction steps

---

*This troubleshooting guide is maintained alongside the visual regression testing implementation and should be updated when new issues are discovered or resolved.*
