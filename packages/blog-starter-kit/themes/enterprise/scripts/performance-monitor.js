#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * 
 * This script helps monitor Core Web Vitals and performance metrics
 * for the blog application. It can be run locally or in CI/CD pipelines.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance thresholds based on Core Web Vitals
const THRESHOLDS = {
  LCP: 2500, // 2.5 seconds
  FID: 100,  // 100 milliseconds
  CLS: 0.1,  // 0.1
  FCP: 1800  // 1.8 seconds
};

/**
 * Run performance tests and extract metrics
 */
function runPerformanceTests() {
  console.log('🚀 Running performance tests...');
  
  try {
    // Run the performance test suite
    const output = execSync('npm run test:performance -- --reporter=json', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ Performance tests completed');
    return output;
  } catch (error) {
    console.error('❌ Performance tests failed:', error.message);
    return null;
  }
}

/**
 * Parse test results and extract performance metrics
 */
function parseTestResults(testOutput) {
  try {
    const results = JSON.parse(testOutput);
    const metrics = {};
    
    // Extract metrics from test results
    results.suites?.forEach(suite => {
      suite.specs?.forEach(spec => {
        if (spec.title.includes('Core Web Vitals')) {
          // Parse Core Web Vitals metrics
          spec.tests?.forEach(test => {
            if (test.results?.[0]?.stdout) {
              const stdout = test.results[0].stdout;
              const metricsMatch = stdout.match(/Performance metrics: ({.*})/);
              if (metricsMatch) {
                Object.assign(metrics, JSON.parse(metricsMatch[1]));
              }
            }
          });
        }
      });
    });
    
    return metrics;
  } catch (error) {
    console.error('❌ Failed to parse test results:', error.message);
    return {};
  }
}

/**
 * Validate performance metrics against thresholds
 */
function validateMetrics(metrics) {
  const results = {
    passed: true,
    violations: []
  };
  
  Object.entries(THRESHOLDS).forEach(([metric, threshold]) => {
    const value = metrics[metric.toLowerCase()];
    if (value !== null && value !== undefined) {
      if (value > threshold) {
        results.passed = false;
        results.violations.push({
          metric,
          value,
          threshold,
          status: 'FAIL'
        });
      } else {
        results.violations.push({
          metric,
          value,
          threshold,
          status: 'PASS'
        });
      }
    }
  });
  
  return results;
}

/**
 * Generate performance report
 */
function generateReport(metrics, validation) {
  const report = {
    timestamp: new Date().toISOString(),
    metrics,
    validation,
    summary: {
      total: validation.violations.length,
      passed: validation.violations.filter(v => v.status === 'PASS').length,
      failed: validation.violations.filter(v => v.status === 'FAIL').length
    }
  };
  
  // Save report to file
  const reportPath = path.join(__dirname, '..', 'test-results', 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  return report;
}

/**
 * Print performance summary
 */
function printSummary(report) {
  console.log('\n📊 Performance Summary');
  console.log('====================');
  
  report.validation.violations.forEach(violation => {
    const status = violation.status === 'PASS' ? '✅' : '❌';
    console.log(`${status} ${violation.metric}: ${violation.value}ms (threshold: ${violation.threshold}ms)`);
  });
  
  console.log(`\n📈 Overall: ${report.summary.passed}/${report.summary.total} metrics passed`);
  
  if (!report.validation.passed) {
    console.log('\n⚠️  Performance issues detected. Consider optimizing:');
    report.validation.violations
      .filter(v => v.status === 'FAIL')
      .forEach(violation => {
        console.log(`   - ${violation.metric}: ${violation.value}ms > ${violation.threshold}ms`);
      });
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Performance Monitoring Script');
  console.log('================================\n');
  
  // Run performance tests
  const testOutput = runPerformanceTests();
  if (!testOutput) {
    process.exit(1);
  }
  
  // Parse results
  const metrics = parseTestResults(testOutput);
  if (Object.keys(metrics).length === 0) {
    console.log('⚠️  No performance metrics found in test results');
    return;
  }
  
  // Validate metrics
  const validation = validateMetrics(metrics);
  
  // Generate report
  const report = generateReport(metrics, validation);
  
  // Print summary
  printSummary(report);
  
  // Exit with appropriate code
  process.exit(validation.passed ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runPerformanceTests,
  parseTestResults,
  validateMetrics,
  generateReport
};
