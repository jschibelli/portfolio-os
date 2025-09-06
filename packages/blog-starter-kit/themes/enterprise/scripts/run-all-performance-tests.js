#!/usr/bin/env node

/**
 * Comprehensive Performance Testing Script
 * 
 * This script runs all performance tests and validations in sequence,
 * providing a complete performance assessment of the application.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test scripts to run
const TEST_SCRIPTS = [
  {
    name: 'Resource Validation',
    command: 'npm run test:performance:resources',
    critical: true
  },
  {
    name: 'Font Validation',
    command: 'npm run test:performance:fonts',
    critical: true
  },
  {
    name: 'CORS Validation',
    command: 'npm run test:performance:cors',
    critical: false
  },
  {
    name: 'Performance Tests',
    command: 'npm run test:performance',
    critical: true
  },
  {
    name: 'Performance Monitoring',
    command: 'npm run test:performance:monitor',
    critical: false
  },
  {
    name: 'Lighthouse Audit',
    command: 'npm run test:performance:lighthouse',
    critical: false
  },
  {
    name: 'CSS Optimization',
    command: 'npm run test:performance:css',
    critical: false
  },
  {
    name: 'Code Quality (ESLint)',
    command: 'npm run test:performance:lint',
    critical: true
  }
];

/**
 * Run a single test script
 */
function runTest(test) {
  console.log(`\n🧪 Running ${test.name}...`);
  console.log(`Command: ${test.command}`);
  
  try {
    const startTime = Date.now();
    const output = execSync(test.command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 300000 // 5 minute timeout
    });
    const duration = Date.now() - startTime;
    
    console.log(`✅ ${test.name} completed in ${duration}ms`);
    return {
      name: test.name,
      status: 'PASS',
      duration,
      output: output.trim()
    };
    
  } catch (error) {
    console.log(`❌ ${test.name} failed: ${error.message}`);
    return {
      name: test.name,
      status: 'FAIL',
      error: error.message,
      critical: test.critical
    };
  }
}

/**
 * Run all performance tests
 */
function runAllTests() {
  console.log('🚀 Comprehensive Performance Testing');
  console.log('====================================\n');
  
  const results = [];
  let hasCriticalFailures = false;
  
  for (const test of TEST_SCRIPTS) {
    const result = runTest(test);
    results.push(result);
    
    if (result.status === 'FAIL' && test.critical) {
      hasCriticalFailures = true;
    }
  }
  
  return { results, hasCriticalFailures };
}

/**
 * Generate comprehensive report
 */
function generateReport(testResults) {
  const report = {
    timestamp: new Date().toISOString(),
    tests: testResults.results,
    summary: {
      total: testResults.results.length,
      passed: testResults.results.filter(r => r.status === 'PASS').length,
      failed: testResults.results.filter(r => r.status === 'FAIL').length,
      criticalFailures: testResults.results.filter(r => r.status === 'FAIL' && r.critical).length,
      totalDuration: testResults.results
        .filter(r => r.duration)
        .reduce((sum, r) => sum + r.duration, 0)
    },
    overallStatus: testResults.hasCriticalFailures ? 'FAIL' : 'PASS'
  };
  
  return report;
}

/**
 * Save comprehensive report
 */
function saveReport(report) {
  const reportPath = path.join(__dirname, '..', 'test-results', 'comprehensive-performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📊 Comprehensive performance report saved to: ${reportPath}`);
}

/**
 * Print comprehensive summary
 */
function printSummary(report) {
  console.log('\n📊 Comprehensive Performance Test Summary');
  console.log('==========================================');
  
  console.log('\n🧪 Test Results:');
  report.tests.forEach(test => {
    const status = test.status === 'PASS' ? '✅' : '❌';
    const critical = test.critical ? '(CRITICAL)' : '(OPTIONAL)';
    const duration = test.duration ? ` (${test.duration}ms)` : '';
    
    console.log(`${status} ${test.name} ${critical}${duration}`);
    
    if (test.status === 'FAIL') {
      console.log(`   Error: ${test.error}`);
    }
  });
  
  console.log(`\n📈 Summary:`);
  console.log(`   Total tests: ${report.summary.total}`);
  console.log(`   Passed: ${report.summary.passed}`);
  console.log(`   Failed: ${report.summary.failed}`);
  console.log(`   Critical failures: ${report.summary.criticalFailures}`);
  console.log(`   Total duration: ${report.summary.totalDuration}ms`);
  
  console.log(`\n🎯 Overall Status: ${report.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
  
  if (report.summary.criticalFailures > 0) {
    console.log(`\n🚨 Critical Issues Found:`);
    report.tests
      .filter(t => t.status === 'FAIL' && t.critical)
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.error}`);
      });
  }
  
  if (report.overallStatus === 'PASS') {
    console.log(`\n🎉 All critical performance tests passed! The application is ready for production.`);
  } else {
    console.log(`\n⚠️  Critical performance issues found. Please address them before deploying to production.`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Comprehensive Performance Testing Suite');
  console.log('==========================================\n');
  
  try {
    // Run all tests
    const testResults = runAllTests();
    
    // Generate report
    const report = generateReport(testResults);
    
    // Save report
    saveReport(report);
    
    // Print summary
    printSummary(report);
    
    // Exit with appropriate code
    process.exit(testResults.hasCriticalFailures ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Comprehensive performance testing failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runAllTests,
  generateReport
};
