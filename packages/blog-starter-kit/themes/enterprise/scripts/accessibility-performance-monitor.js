#!/usr/bin/env node

/**
 * Accessibility-Performance Monitoring Script
 * 
 * This script combines accessibility testing with performance monitoring
 * to provide comprehensive user experience validation.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Thresholds for combined UX scoring
const UX_THRESHOLDS = {
  accessibility: {
    minScore: 90,
    maxViolations: 0,
    maxWarnings: 5
  },
  performance: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    loadTime: 15000
  },
  combined: {
    minUXScore: 85
  }
};

/**
 * Run accessibility-performance tests
 */
function runAccessibilityPerformanceTests() {
  console.log('🔍 Running accessibility-performance tests...');
  
  try {
    const output = execSync('npm run test:accessibility-performance -- --reporter=json', {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 300000 // 5 minute timeout
    });
    
    console.log('✅ Accessibility-performance tests completed');
    return output;
  } catch (error) {
    console.error('❌ Accessibility-performance tests failed:', error.message);
    
    if (error.status) {
      console.error(`Exit code: ${error.status}`);
    }
    if (error.stderr) {
      console.error('Error output:', error.stderr);
    }
    
    return '{}';
  }
}

/**
 * Parse test results and extract metrics
 */
function parseTestResults(testOutput) {
  try {
    const results = JSON.parse(testOutput);
    const metrics = {
      accessibility: {
        score: null,
        violations: 0,
        warnings: 0,
        passes: 0
      },
      performance: {
        lcp: null,
        fid: null,
        cls: null,
        fcp: null,
        loadTime: null
      },
      combined: {
        uxScore: null
      }
    };
    
    // Extract metrics from test results
    results.suites?.forEach(suite => {
      suite.specs?.forEach(spec => {
        if (spec.title.includes('accessibility and performance')) {
          spec.tests?.forEach(test => {
            if (test.results?.[0]?.stdout) {
              const stdout = test.results[0].stdout;
              
              // Parse accessibility metrics
              const accessibilityMatch = stdout.match(/accessibility.*?score.*?(\d+)/);
              if (accessibilityMatch) {
                metrics.accessibility.score = parseInt(accessibilityMatch[1]);
              }
              
              // Parse performance metrics
              const performanceMatch = stdout.match(/performance.*?({.*?})/s);
              if (performanceMatch) {
                try {
                  const perfData = JSON.parse(performanceMatch[1]);
                  Object.assign(metrics.performance, perfData);
                } catch (e) {
                  console.warn('Failed to parse performance data:', e.message);
                }
              }
              
              // Parse UX score
              const uxMatch = stdout.match(/Overall UX Score.*?(\d+)%/);
              if (uxMatch) {
                metrics.combined.uxScore = parseInt(uxMatch[1]);
              }
            }
          });
        }
      });
    });
    
    return metrics;
  } catch (error) {
    console.error('❌ Failed to parse test results:', error.message);
    return null;
  }
}

/**
 * Validate accessibility metrics
 */
function validateAccessibility(metrics) {
  const results = {
    passed: true,
    violations: []
  };

  if (metrics.accessibility.score !== null) {
    if (metrics.accessibility.score < UX_THRESHOLDS.accessibility.minScore) {
      results.passed = false;
      results.violations.push({
        type: 'accessibility',
        metric: 'score',
        value: metrics.accessibility.score,
        threshold: UX_THRESHOLDS.accessibility.minScore,
        message: `Accessibility score ${metrics.accessibility.score}% is below threshold of ${UX_THRESHOLDS.accessibility.minScore}%`
      });
    }
  }

  if (metrics.accessibility.violations > UX_THRESHOLDS.accessibility.maxViolations) {
    results.passed = false;
    results.violations.push({
      type: 'accessibility',
      metric: 'violations',
      value: metrics.accessibility.violations,
      threshold: UX_THRESHOLDS.accessibility.maxViolations,
      message: `${metrics.accessibility.violations} accessibility violations exceed threshold of ${UX_THRESHOLDS.accessibility.maxViolations}`
    });
  }

  return results;
}

/**
 * Validate performance metrics
 */
function validatePerformance(metrics) {
  const results = {
    passed: true,
    violations: []
  };

  const performanceChecks = [
    { key: 'lcp', threshold: UX_THRESHOLDS.performance.lcp, name: 'LCP' },
    { key: 'fid', threshold: UX_THRESHOLDS.performance.fid, name: 'FID' },
    { key: 'cls', threshold: UX_THRESHOLDS.performance.cls, name: 'CLS' },
    { key: 'fcp', threshold: UX_THRESHOLDS.performance.fcp, name: 'FCP' },
    { key: 'loadTime', threshold: UX_THRESHOLDS.performance.loadTime, name: 'Load Time' }
  ];

  performanceChecks.forEach(check => {
    const value = metrics.performance[check.key];
    if (value !== null && value !== undefined && value > check.threshold) {
      results.passed = false;
      results.violations.push({
        type: 'performance',
        metric: check.name,
        value: value,
        threshold: check.threshold,
        message: `${check.name} ${value}ms exceeds threshold of ${check.threshold}ms`
      });
    }
  });

  return results;
}

/**
 * Validate combined UX score
 */
function validateUXScore(metrics) {
  const results = {
    passed: true,
    violations: []
  };

  if (metrics.combined.uxScore !== null) {
    if (metrics.combined.uxScore < UX_THRESHOLDS.combined.minUXScore) {
      results.passed = false;
      results.violations.push({
        type: 'combined',
        metric: 'UX Score',
        value: metrics.combined.uxScore,
        threshold: UX_THRESHOLDS.combined.minUXScore,
        message: `Combined UX score ${metrics.combined.uxScore}% is below threshold of ${UX_THRESHOLDS.combined.minUXScore}%`
      });
    }
  }

  return results;
}

/**
 * Generate comprehensive report
 */
function generateReport(metrics, accessibilityResults, performanceResults, uxResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      passed: accessibilityResults.passed && performanceResults.passed && uxResults.passed,
      accessibilityPassed: accessibilityResults.passed,
      performancePassed: performanceResults.passed,
      uxPassed: uxResults.passed,
      totalViolations: [
        ...accessibilityResults.violations,
        ...performanceResults.violations,
        ...uxResults.violations
      ].length
    },
    metrics,
    violations: [
      ...accessibilityResults.violations,
      ...performanceResults.violations,
      ...uxResults.violations
    ],
    recommendations: generateRecommendations(metrics, [
      ...accessibilityResults.violations,
      ...performanceResults.violations,
      ...uxResults.violations
    ])
  };

  return report;
}

/**
 * Generate recommendations based on violations
 */
function generateRecommendations(metrics, violations) {
  const recommendations = [];

  violations.forEach(violation => {
    switch (violation.type) {
      case 'accessibility':
        recommendations.push({
          category: 'Accessibility',
          issue: violation.message,
          solutions: [
            'Run axe-core accessibility audit',
            'Check for proper ARIA labels and roles',
            'Ensure keyboard navigation works properly',
            'Validate color contrast ratios',
            'Test with screen readers'
          ]
        });
        break;
      case 'performance':
        recommendations.push({
          category: 'Performance',
          issue: violation.message,
          solutions: [
            'Optimize images and use WebP format',
            'Implement lazy loading for below-the-fold content',
            'Minimize JavaScript bundle size',
            'Use code splitting and dynamic imports',
            'Optimize server response times'
          ]
        });
        break;
      case 'combined':
        recommendations.push({
          category: 'User Experience',
          issue: violation.message,
          solutions: [
            'Balance performance optimizations with accessibility requirements',
            'Test with real users and assistive technologies',
            'Monitor both metrics continuously',
            'Implement progressive enhancement',
            'Use semantic HTML and proper ARIA attributes'
          ]
        });
        break;
    }
  });

  return recommendations;
}

/**
 * Save report to file
 */
function saveReport(report) {
  const reportPath = path.join(__dirname, '../test-results/accessibility-performance-report.json');
  const reportDir = path.dirname(reportPath);
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Report saved to: ${reportPath}`);
}

/**
 * Print summary to console
 */
function printSummary(report) {
  console.log('\n🎯 Accessibility-Performance Summary');
  console.log('=====================================');
  console.log(`Overall Status: ${report.summary.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Accessibility: ${report.summary.accessibilityPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Performance: ${report.summary.performancePassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`UX Score: ${report.summary.uxPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Total Violations: ${report.summary.totalViolations}`);
  
  if (report.metrics) {
    console.log('\n📊 Metrics:');
    if (report.metrics.accessibility.score !== null) {
      console.log(`Accessibility Score: ${report.metrics.accessibility.score}%`);
    }
    if (report.metrics.combined.uxScore !== null) {
      console.log(`Combined UX Score: ${report.metrics.combined.uxScore}%`);
    }
    if (report.metrics.performance.lcp !== null) {
      console.log(`LCP: ${Math.round(report.metrics.performance.lcp)}ms`);
    }
    if (report.metrics.performance.fcp !== null) {
      console.log(`FCP: ${Math.round(report.metrics.performance.fcp)}ms`);
    }
  }
  
  if (report.violations.length > 0) {
    console.log('\n❌ Violations:');
    report.violations.forEach(violation => {
      console.log(`  - ${violation.type.toUpperCase()}: ${violation.message}`);
    });
  }
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      console.log(`  ${rec.category}: ${rec.issue}`);
      rec.solutions.forEach(solution => {
        console.log(`    • ${solution}`);
      });
    });
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Accessibility-Performance Monitor');
  console.log('====================================\n');
  
  try {
    // Run tests
    const testOutput = runAccessibilityPerformanceTests();
    
    // Parse results
    const metrics = parseTestResults(testOutput);
    if (!metrics) {
      console.error('❌ Failed to parse test results');
      process.exit(1);
    }
    
    // Validate metrics
    const accessibilityResults = validateAccessibility(metrics);
    const performanceResults = validatePerformance(metrics);
    const uxResults = validateUXScore(metrics);
    
    // Generate report
    const report = generateReport(metrics, accessibilityResults, performanceResults, uxResults);
    
    // Save and display results
    saveReport(report);
    printSummary(report);
    
    // Exit with appropriate code
    process.exit(report.summary.passed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Accessibility-performance monitoring failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
