#!/usr/bin/env node

/**
 * Lighthouse Performance Audit Script
 * 
 * This script runs Lighthouse audits to validate performance optimizations
 * and provides detailed reports on Core Web Vitals and other metrics.
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Performance thresholds based on Core Web Vitals
const THRESHOLDS = {
  performance: 90,
  accessibility: 90,
  bestPractices: 90,
  seo: 90,
  pwa: 50
};

// Core Web Vitals thresholds
const CORE_WEB_VITALS = {
  lcp: 2500, // 2.5 seconds
  fid: 100,  // 100 milliseconds
  cls: 0.1,  // 0.1
  fcp: 1800  // 1.8 seconds
};

/**
 * Launch Chrome and run Lighthouse audit
 */
async function runLighthouseAudit(url, options = {}) {
  console.log(`🔍 Running Lighthouse audit for: ${url}`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });
  
  const lighthouseOptions = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    ...options
  };
  
  try {
    const runnerResult = await lighthouse(url, lighthouseOptions);
    await chrome.kill();
    
    return runnerResult;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

/**
 * Extract Core Web Vitals from Lighthouse results
 */
function extractCoreWebVitals(results) {
  const audits = results.lhr.audits;
  
  return {
    lcp: audits['largest-contentful-paint']?.numericValue || null,
    fid: audits['max-potential-fid']?.numericValue || null,
    cls: audits['cumulative-layout-shift']?.numericValue || null,
    fcp: audits['first-contentful-paint']?.numericValue || null,
    ttfb: audits['server-response-time']?.numericValue || null
  };
}

/**
 * Validate Core Web Vitals against thresholds
 */
function validateCoreWebVitals(metrics) {
  const results = {
    passed: true,
    violations: []
  };
  
  Object.entries(CORE_WEB_VITALS).forEach(([metric, threshold]) => {
    const value = metrics[metric];
    if (value !== null && value !== undefined) {
      if (value > threshold) {
        results.passed = false;
        results.violations.push({
          metric: metric.toUpperCase(),
          value: Math.round(value),
          threshold: Math.round(threshold),
          status: 'FAIL'
        });
      } else {
        results.violations.push({
          metric: metric.toUpperCase(),
          value: Math.round(value),
          threshold: Math.round(threshold),
          status: 'PASS'
        });
      }
    }
  });
  
  return results;
}

/**
 * Generate Lighthouse report
 */
function generateReport(results, coreWebVitals, validation) {
  const report = {
    timestamp: new Date().toISOString(),
    url: results.lhr.finalUrl,
    scores: {
      performance: Math.round(results.lhr.categories.performance.score * 100),
      accessibility: Math.round(results.lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(results.lhr.categories['best-practices'].score * 100),
      seo: Math.round(results.lhr.categories.seo.score * 100)
    },
    coreWebVitals,
    validation,
    summary: {
      total: validation.violations.length,
      passed: validation.violations.filter(v => v.status === 'PASS').length,
      failed: validation.violations.filter(v => v.status === 'FAIL').length
    },
    recommendations: generateRecommendations(results, coreWebVitals, validation)
  };
  
  return report;
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(results, coreWebVitals, validation) {
  const recommendations = [];
  
  // Performance score recommendations
  if (results.lhr.categories.performance.score < 0.9) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      message: 'Performance score is below 90. Consider optimizing images, reducing JavaScript, and improving server response times.'
    });
  }
  
  // Core Web Vitals recommendations
  validation.violations
    .filter(v => v.status === 'FAIL')
    .forEach(violation => {
      switch (violation.metric) {
        case 'LCP':
          recommendations.push({
            type: 'lcp',
            priority: 'high',
            message: 'Largest Contentful Paint is too slow. Optimize images, preload critical resources, and improve server response times.'
          });
          break;
        case 'FID':
          recommendations.push({
            type: 'fid',
            priority: 'medium',
            message: 'First Input Delay is too high. Reduce JavaScript execution time and optimize third-party scripts.'
          });
          break;
        case 'CLS':
          recommendations.push({
            type: 'cls',
            priority: 'high',
            message: 'Cumulative Layout Shift is too high. Ensure images and ads have defined dimensions.'
          });
          break;
        case 'FCP':
          recommendations.push({
            type: 'fcp',
            priority: 'medium',
            message: 'First Contentful Paint is too slow. Optimize critical rendering path and reduce server response times.'
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
  const reportPath = path.join(__dirname, '..', 'test-results', 'lighthouse-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Lighthouse report saved to: ${reportPath}`);
}

/**
 * Print summary
 */
function printSummary(report) {
  console.log('\n📊 Lighthouse Audit Summary');
  console.log('==========================');
  
  // Print scores
  console.log('\n🎯 Performance Scores:');
  Object.entries(report.scores).forEach(([category, score]) => {
    const status = score >= 90 ? '✅' : score >= 50 ? '⚠️' : '❌';
    console.log(`${status} ${category}: ${score}/100`);
  });
  
  // Print Core Web Vitals
  console.log('\n⚡ Core Web Vitals:');
  report.validation.violations.forEach(violation => {
    const status = violation.status === 'PASS' ? '✅' : '❌';
    console.log(`${status} ${violation.metric}: ${violation.value}ms (threshold: ${violation.threshold}ms)`);
  });
  
  // Print recommendations
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`${priority} ${rec.message}`);
    });
  }
  
  console.log(`\n📈 Overall: ${report.summary.passed}/${report.summary.total} Core Web Vitals passed`);
}

/**
 * Main execution
 */
async function main() {
  const url = process.argv[2] || 'http://localhost:3000/blog';
  
  console.log('🚀 Lighthouse Performance Audit');
  console.log('===============================\n');
  
  try {
    // Run Lighthouse audit
    const results = await runLighthouseAudit(url);
    
    // Extract Core Web Vitals
    const coreWebVitals = extractCoreWebVitals(results);
    
    // Validate against thresholds
    const validation = validateCoreWebVitals(coreWebVitals);
    
    // Generate report
    const report = generateReport(results, coreWebVitals, validation);
    
    // Save report
    saveReport(report);
    
    // Print summary
    printSummary(report);
    
    // Exit with appropriate code
    process.exit(validation.passed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runLighthouseAudit,
  extractCoreWebVitals,
  validateCoreWebVitals,
  generateReport
};
