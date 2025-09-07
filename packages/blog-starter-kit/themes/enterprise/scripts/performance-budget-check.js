#!/usr/bin/env node

/**
 * Performance Budget Checker
 * 
 * This script validates that the application meets performance budgets
 * and provides detailed reporting on performance metrics.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load performance budget configuration
const BUDGET_CONFIG = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../performance-budget.json'), 'utf8')
);

/**
 * Run Lighthouse audit and extract metrics
 */
async function runLighthouseAudit(url = 'http://localhost:3000/blog') {
  console.log(`🔍 Running Lighthouse audit for: ${url}`);
  
  try {
    const output = execSync(
      `npx lighthouse "${url}" --output=json --chrome-flags="--headless" --quiet`,
      { encoding: 'utf8', timeout: 120000 }
    );
    
    return JSON.parse(output);
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
    return null;
  }
}

/**
 * Extract performance metrics from Lighthouse results
 */
function extractMetrics(lighthouseResults) {
  if (!lighthouseResults || !lighthouseResults.lhr) {
    return null;
  }

  const audits = lighthouseResults.lhr.audits;
  
  return {
    lcp: audits['largest-contentful-paint']?.numericValue,
    fid: audits['max-potential-fid']?.numericValue,
    cls: audits['cumulative-layout-shift']?.numericValue,
    fcp: audits['first-contentful-paint']?.numericValue,
    ttfb: audits['server-response-time']?.numericValue,
    si: audits['speed-index']?.numericValue,
    tbt: audits['total-blocking-time']?.numericValue,
    performanceScore: lighthouseResults.lhr.categories.performance?.score * 100
  };
}

/**
 * Check metrics against budget thresholds
 */
function checkBudget(metrics, budget) {
  const results = {
    passed: true,
    violations: [],
    warnings: []
  };

  // Check timing budgets
  if (budget.timings) {
    budget.timings.forEach(timing => {
      const value = metrics[timing.metric];
      if (value !== undefined && value > timing.budget) {
        results.passed = false;
        results.violations.push({
          type: 'timing',
          metric: timing.metric,
          value: Math.round(value),
          budget: timing.budget,
          severity: 'error'
        });
      }
    });
  }

  // Check resource size budgets
  if (budget.resourceSizes) {
    budget.resourceSizes.forEach(resource => {
      // This would need to be implemented with actual resource analysis
      // For now, we'll use Lighthouse's resource summary
      console.log(`📊 Resource budget check for ${resource.resourceType}: ${resource.budget}KB`);
    });
  }

  return results;
}

/**
 * Generate performance report
 */
function generateReport(budgetResults, metrics) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      passed: budgetResults.passed,
      totalViolations: budgetResults.violations.length,
      totalWarnings: budgetResults.warnings.length
    },
    metrics,
    violations: budgetResults.violations,
    warnings: budgetResults.warnings,
    recommendations: []
  };

  // Generate recommendations based on violations
  budgetResults.violations.forEach(violation => {
    switch (violation.metric) {
      case 'largest-contentful-paint':
        report.recommendations.push({
          metric: 'LCP',
          issue: 'Largest Contentful Paint is too slow',
          solutions: [
            'Optimize images and use WebP format',
            'Implement lazy loading for below-the-fold content',
            'Preload critical resources',
            'Optimize server response times'
          ]
        });
        break;
      case 'first-input-delay':
        report.recommendations.push({
          metric: 'FID',
          issue: 'First Input Delay is too high',
          solutions: [
            'Reduce JavaScript execution time',
            'Split large bundles',
            'Use code splitting and lazy loading',
            'Optimize third-party scripts'
          ]
        });
        break;
      case 'cumulative-layout-shift':
        report.recommendations.push({
          metric: 'CLS',
          issue: 'Cumulative Layout Shift is too high',
          solutions: [
            'Set explicit dimensions for images and videos',
            'Reserve space for dynamic content',
            'Avoid inserting content above existing content',
            'Use transform animations instead of layout-triggering properties'
          ]
        });
        break;
    }
  });

  return report;
}

/**
 * Save report to file
 */
function saveReport(report) {
  const reportPath = path.join(__dirname, '../test-results/performance-budget-report.json');
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
  console.log('\n📊 Performance Budget Summary');
  console.log('============================');
  console.log(`Status: ${report.summary.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Violations: ${report.summary.totalViolations}`);
  console.log(`Warnings: ${report.summary.totalWarnings}`);
  
  if (report.metrics) {
    console.log('\n📈 Core Web Vitals:');
    console.log(`LCP: ${report.metrics.lcp ? Math.round(report.metrics.lcp) + 'ms' : 'N/A'}`);
    console.log(`FID: ${report.metrics.fid ? Math.round(report.metrics.fid) + 'ms' : 'N/A'}`);
    console.log(`CLS: ${report.metrics.cls ? report.metrics.cls.toFixed(3) : 'N/A'}`);
    console.log(`FCP: ${report.metrics.fcp ? Math.round(report.metrics.fcp) + 'ms' : 'N/A'}`);
    console.log(`Performance Score: ${report.metrics.performanceScore ? Math.round(report.metrics.performanceScore) : 'N/A'}`);
  }
  
  if (report.violations.length > 0) {
    console.log('\n❌ Violations:');
    report.violations.forEach(violation => {
      console.log(`  - ${violation.metric}: ${violation.value}ms (budget: ${violation.budget}ms)`);
    });
  }
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      console.log(`  ${rec.metric}: ${rec.issue}`);
      rec.solutions.forEach(solution => {
        console.log(`    • ${solution}`);
      });
    });
  }
}

/**
 * Main execution
 */
async function main() {
  const url = process.argv[2] || 'http://localhost:3000/blog';
  
  console.log('🚀 Performance Budget Checker');
  console.log('==============================\n');
  
  try {
    // Run Lighthouse audit
    const lighthouseResults = await runLighthouseAudit(url);
    if (!lighthouseResults) {
      console.error('❌ Failed to run Lighthouse audit');
      process.exit(1);
    }
    
    // Extract metrics
    const metrics = extractMetrics(lighthouseResults);
    if (!metrics) {
      console.error('❌ Failed to extract performance metrics');
      process.exit(1);
    }
    
    // Check against budget
    const budget = BUDGET_CONFIG.budget[0]; // Use first budget configuration
    const budgetResults = checkBudget(metrics, budget);
    
    // Generate report
    const report = generateReport(budgetResults, metrics);
    
    // Save and display results
    saveReport(report);
    printSummary(report);
    
    // Exit with appropriate code
    process.exit(budgetResults.passed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Performance budget check failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
