#!/usr/bin/env node

/**
 * CSS Optimization and Validation Script
 * 
 * This script analyzes and optimizes CSS for performance and accessibility:
 * - Validates HSL color format consistency
 * - Checks for CSS specificity issues
 * - Optimizes CSS for Core Web Vitals
 * - Validates accessibility compliance
 * - Provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');

// CSS file to analyze
const CSS_FILE = path.join(__dirname, '..', 'styles', 'index.css');

// Performance and accessibility thresholds
const THRESHOLDS = {
  maxImportantUsage: 50, // Maximum number of !important declarations
  maxSpecificity: 100,   // Maximum CSS specificity score
  minContrastRatio: 4.5, // WCAG 2.1 AA minimum contrast ratio
  maxFileSize: 100 * 1024, // 100KB maximum CSS file size
  maxSelectors: 1000     // Maximum number of CSS selectors
};

/**
 * Analyze CSS file for optimization opportunities
 */
function analyzeCSS(cssContent) {
  const analysis = {
    fileSize: cssContent.length,
    lineCount: cssContent.split('\n').length,
    importantCount: (cssContent.match(/!important/g) || []).length,
    selectorCount: (cssContent.match(/\{[^}]*\}/g) || []).length,
    hslInconsistencies: [],
    specificityIssues: [],
    performanceIssues: [],
    accessibilityIssues: [],
    recommendations: []
  };

  // Check HSL format consistency
  const hslWithCommas = cssContent.match(/hsl\([^)]*,[^)]*\)/g) || [];
  hslWithCommas.forEach(match => {
    analysis.hslInconsistencies.push({
      type: 'hsl_format',
      issue: 'HSL values should use space-separated format',
      example: match,
      recommendation: 'Use hsl(h s% l%) instead of hsl(h, s%, l%)'
    });
  });

  // Check for excessive !important usage
  if (analysis.importantCount > THRESHOLDS.maxImportantUsage) {
    analysis.specificityIssues.push({
      type: 'excessive_important',
      issue: `Too many !important declarations (${analysis.importantCount})`,
      recommendation: 'Reduce !important usage by improving CSS specificity'
    });
  }

  // Check file size
  if (analysis.fileSize > THRESHOLDS.maxFileSize) {
    analysis.performanceIssues.push({
      type: 'large_file_size',
      issue: `CSS file is large (${Math.round(analysis.fileSize / 1024)}KB)`,
      recommendation: 'Consider CSS minification and unused style removal'
    });
  }

  // Check selector count
  if (analysis.selectorCount > THRESHOLDS.maxSelectors) {
    analysis.performanceIssues.push({
      type: 'many_selectors',
      issue: `High number of CSS selectors (${analysis.selectorCount})`,
      recommendation: 'Consider consolidating similar selectors'
    });
  }

  // Check for potential accessibility issues
  const lowContrastColors = cssContent.match(/hsl\([^)]*[0-9]{1,2}%[^)]*\)/g) || [];
  lowContrastColors.forEach(color => {
    const lightnessMatch = color.match(/(\d+)%/);
    if (lightnessMatch) {
      const lightness = parseInt(lightnessMatch[1]);
      if (lightness > 80 || lightness < 20) {
        analysis.accessibilityIssues.push({
          type: 'potential_contrast_issue',
          issue: `Color may have insufficient contrast: ${color}`,
          recommendation: 'Verify contrast ratio meets WCAG 2.1 AA standards (4.5:1)'
        });
      }
    }
  });

  return analysis;
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(analysis) {
  const recommendations = [];

  // HSL format consistency
  if (analysis.hslInconsistencies.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'consistency',
      title: 'Standardize HSL Color Format',
      description: 'Convert all HSL values to space-separated format for consistency',
      impact: 'Improves maintainability and reduces potential parsing issues',
      action: 'Replace hsl(h, s%, l%) with hsl(h s% l%) throughout the file'
    });
  }

  // Reduce !important usage
  if (analysis.importantCount > THRESHOLDS.maxImportantUsage) {
    recommendations.push({
      priority: 'high',
      category: 'specificity',
      title: 'Reduce !important Usage',
      description: `Currently using ${analysis.importantCount} !important declarations`,
      impact: 'Improves CSS maintainability and reduces specificity conflicts',
      action: 'Refactor CSS to use proper specificity instead of !important'
    });
  }

  // File size optimization
  if (analysis.fileSize > THRESHOLDS.maxFileSize) {
    recommendations.push({
      priority: 'medium',
      category: 'performance',
      title: 'Optimize CSS File Size',
      description: `CSS file is ${Math.round(analysis.fileSize / 1024)}KB`,
      impact: 'Reduces initial page load time and improves LCP',
      action: 'Remove unused styles, minify CSS, and consider critical CSS extraction'
    });
  }

  // Consolidate selectors
  if (analysis.selectorCount > THRESHOLDS.maxSelectors) {
    recommendations.push({
      priority: 'medium',
      category: 'performance',
      title: 'Consolidate CSS Selectors',
      description: `High number of selectors (${analysis.selectorCount})`,
      impact: 'Reduces CSS parsing time and improves FCP',
      action: 'Group similar selectors and use CSS variables for repeated values'
    });
  }

  // Accessibility improvements
  if (analysis.accessibilityIssues.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'accessibility',
      title: 'Improve Color Contrast',
      description: `${analysis.accessibilityIssues.length} potential contrast issues found`,
      impact: 'Ensures WCAG 2.1 AA compliance and better accessibility',
      action: 'Test all color combinations with contrast ratio tools'
    });
  }

  return recommendations;
}

/**
 * Generate CSS optimization report
 */
function generateReport(analysis, recommendations) {
  const report = {
    timestamp: new Date().toISOString(),
    file: CSS_FILE,
    analysis: {
      fileSize: analysis.fileSize,
      fileSizeKB: Math.round(analysis.fileSize / 1024),
      lineCount: analysis.lineCount,
      importantCount: analysis.importantCount,
      selectorCount: analysis.selectorCount,
      hslInconsistencies: analysis.hslInconsistencies.length,
      specificityIssues: analysis.specificityIssues.length,
      performanceIssues: analysis.performanceIssues.length,
      accessibilityIssues: analysis.accessibilityIssues.length
    },
    issues: {
      hslInconsistencies: analysis.hslInconsistencies,
      specificityIssues: analysis.specificityIssues,
      performanceIssues: analysis.performanceIssues,
      accessibilityIssues: analysis.accessibilityIssues
    },
    recommendations: recommendations,
    summary: {
      totalIssues: analysis.hslInconsistencies.length + 
                   analysis.specificityIssues.length + 
                   analysis.performanceIssues.length + 
                   analysis.accessibilityIssues.length,
      criticalIssues: recommendations.filter(r => r.priority === 'high').length,
      optimizationScore: calculateOptimizationScore(analysis, recommendations)
    }
  };

  return report;
}

/**
 * Calculate CSS optimization score
 */
function calculateOptimizationScore(analysis, recommendations) {
  let score = 100;
  
  // Deduct points for issues
  score -= analysis.hslInconsistencies.length * 5;
  score -= analysis.specificityIssues.length * 10;
  score -= analysis.performanceIssues.length * 8;
  score -= analysis.accessibilityIssues.length * 15;
  
  // Deduct points for file size
  if (analysis.fileSize > THRESHOLDS.maxFileSize) {
    score -= 20;
  }
  
  // Deduct points for excessive !important usage
  if (analysis.importantCount > THRESHOLDS.maxImportantUsage) {
    score -= 25;
  }
  
  return Math.max(0, Math.round(score));
}

/**
 * Print optimization summary
 */
function printSummary(report) {
  console.log('\n🎨 CSS Optimization Analysis');
  console.log('============================\n');
  
  console.log(`📁 File: ${path.basename(report.file)}`);
  console.log(`📊 Size: ${report.analysis.fileSizeKB}KB (${report.analysis.lineCount} lines)`);
  console.log(`🎯 Selectors: ${report.analysis.selectorCount}`);
  console.log(`⚠️  !important: ${report.analysis.importantCount}`);
  console.log(`🔧 Optimization Score: ${report.summary.optimizationScore}/100`);
  
  console.log(`\n📈 Issues Found:`);
  console.log(`   HSL Inconsistencies: ${report.analysis.hslInconsistencies}`);
  console.log(`   Specificity Issues: ${report.analysis.specificityIssues}`);
  console.log(`   Performance Issues: ${report.analysis.performanceIssues}`);
  console.log(`   Accessibility Issues: ${report.analysis.accessibilityIssues}`);
  console.log(`   Total Issues: ${report.summary.totalIssues}`);
  
  if (report.recommendations.length > 0) {
    console.log(`\n💡 Recommendations:`);
    report.recommendations.forEach((rec, index) => {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`${priority} ${index + 1}. ${rec.title}`);
      console.log(`   ${rec.description}`);
      console.log(`   Action: ${rec.action}\n`);
    });
  }
  
  if (report.summary.optimizationScore >= 80) {
    console.log('✅ CSS is well-optimized!');
  } else if (report.summary.optimizationScore >= 60) {
    console.log('⚠️  CSS needs some optimization.');
  } else {
    console.log('❌ CSS requires significant optimization.');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 CSS Optimization Script');
  console.log('==========================\n');
  
  try {
    // Read CSS file
    if (!fs.existsSync(CSS_FILE)) {
      console.error('❌ CSS file not found:', CSS_FILE);
      process.exit(1);
    }
    
    const cssContent = fs.readFileSync(CSS_FILE, 'utf8');
    console.log(`📁 Analyzing: ${CSS_FILE}`);
    
    // Analyze CSS
    const analysis = analyzeCSS(cssContent);
    
    // Generate recommendations
    const recommendations = generateRecommendations(analysis);
    
    // Generate report
    const report = generateReport(analysis, recommendations);
    
    // Save report
    const reportPath = path.join(__dirname, '..', 'test-results', 'css-optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 CSS optimization report saved to: ${reportPath}`);
    
    // Print summary
    printSummary(report);
    
    // Exit with appropriate code
    const hasCriticalIssues = report.summary.criticalIssues > 0;
    process.exit(hasCriticalIssues ? 1 : 0);
    
  } catch (error) {
    console.error('❌ CSS optimization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeCSS,
  generateRecommendations,
  generateReport
};
