# Hero Components Testing Suite

This directory contains comprehensive testing and validation for all hero components to ensure consistent behavior, accessibility compliance, and performance across all devices and browsers.

## Overview

The hero testing suite covers:
- **Typography Tests**: Font scaling, weight, line height, and color contrast
- **Spacing Tests**: Layout consistency, responsive spacing, and container standards
- **Accessibility Tests**: WCAG 2.1 AA compliance, keyboard navigation, and screen reader support
- **Performance Tests**: Core Web Vitals, animation performance, and memory usage

## Test Files

### Unit Tests (Jest)
- `typography.test.tsx` - Typography scaling and consistency tests
- `spacing.test.tsx` - Layout and spacing validation tests
- `accessibility.test.tsx` - Accessibility compliance tests
- `performance.test.tsx` - Performance and memory usage tests

### E2E Tests (Playwright)
- `tests/hero-visual-regression.spec.ts` - Visual regression testing
- `tests/hero-accessibility.spec.ts` - Accessibility testing
- `tests/hero-performance.spec.ts` - Performance testing

## Running Tests

### Run All Hero Tests
```bash
npm run test:hero
```

### Run Individual Test Suites
```bash
# Unit tests only
npm run test:hero:unit

# Visual regression tests
npm run test:hero:visual

# Accessibility tests
npm run test:hero:accessibility

# Performance tests
npm run test:hero:performance
```

### Run Tests in Watch Mode
```bash
npm run test:hero:unit -- --watch
```

## Test Coverage

### Typography Tests
- ✅ Title scaling at all breakpoints (mobile, tablet, desktop)
- ✅ Subtitle scaling at all breakpoints
- ✅ Description scaling at all breakpoints
- ✅ Font weight consistency
- ✅ Line height consistency
- ✅ Text color contrast validation

### Spacing Tests
- ✅ Section padding consistency
- ✅ Content spacing validation
- ✅ Container width standards
- ✅ Responsive spacing behavior
- ✅ Button spacing and alignment
- ✅ Layout consistency across devices

### Accessibility Tests
- ✅ Screen reader compatibility
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast ratios (WCAG 2.1 AA)
- ✅ ARIA labels and semantic structure
- ✅ Reduced motion support
- ✅ High contrast mode support

### Performance Tests
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ Animation performance
- ✅ Image loading optimization
- ✅ Bundle size impact
- ✅ Memory usage validation
- ✅ Network performance

## Test Results

After running tests, a comprehensive report is generated at `hero-test-report.md` with:
- Test status summary
- Detailed results for each test suite
- Performance metrics
- Accessibility compliance status
- Recommendations for improvements

## Device Testing

Tests are run across multiple devices:
- **Mobile**: iPhone SE, iPhone 12, Android devices
- **Tablet**: iPad, iPad Pro, Android tablets
- **Desktop**: 1920x1080, 2560x1440, 3840x2160

## Browser Testing

Tests are run across multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Continuous Integration

The hero testing suite is integrated into the CI/CD pipeline:
- Automated testing on pull requests
- Visual regression testing
- Performance monitoring
- Accessibility compliance checks

## Troubleshooting

### Common Issues

1. **Visual Regression Failures**
   - Update baselines if changes are intentional
   - Check for animation timing issues
   - Verify responsive breakpoints

2. **Accessibility Failures**
   - Review color contrast ratios
   - Check keyboard navigation
   - Verify ARIA labels

3. **Performance Issues**
   - Optimize image loading
   - Review bundle size
   - Check animation performance

### Debug Mode

Run tests in debug mode for detailed output:
```bash
npm run test:hero:unit -- --verbose
npm run test:hero:visual -- --debug
```

## Contributing

When adding new hero components:
1. Add corresponding unit tests
2. Update visual regression baselines
3. Verify accessibility compliance
4. Check performance impact

## Maintenance

- Update test baselines when design changes are intentional
- Monitor performance metrics over time
- Review accessibility compliance regularly
- Update device and browser test configurations as needed
