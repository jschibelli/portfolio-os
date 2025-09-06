#!/usr/bin/env node

/**
 * Script Consistency Checker
 * 
 * This script validates script naming conventions, documentation standards,
 * and code structure consistency across all project scripts.
 * 
 * Addresses code review feedback from PR #37 about maintaining consistency
 * in script naming conventions and documentation.
 */

const fs = require('fs');
const path = require('path');

// Script naming conventions
const NAMING_CONVENTIONS = {
  // Script prefixes
  prefixes: {
    test: 'test-',
    performance: 'performance-',
    security: 'security-',
    validation: 'validate-',
    setup: 'setup-',
    build: 'build-',
    deploy: 'deploy-',
    utility: 'util-'
  },
  
  // Script suffixes
  suffixes: {
    checker: '-checker',
    manager: '-manager',
    monitor: '-monitor',
    audit: '-audit',
    report: '-report',
    validator: '-validator'
  },
  
  // File extensions
  extensions: ['.js', '.ts', '.mjs']
};

// Documentation standards
const DOCUMENTATION_STANDARDS = {
  requiredSections: [
    'title',
    'description',
    'usage',
    'parameters',
    'examples',
    'errorHandling'
  ],
  
  minDescriptionLength: 50,
  requireJSDoc: true,
  requireExamples: true,
  requireErrorHandling: true
};

// Code structure standards
const CODE_STRUCTURE_STANDARDS = {
  requireStrictMode: true,
  requireErrorHandling: true,
  requireLogging: true,
  requireValidation: true,
  maxFunctionLength: 50,
  maxFileLength: 500,
  requireComments: true
};

/**
 * Get all script files in the project
 */
function getAllScriptFiles() {
  const scriptsDir = path.join(__dirname, '..', 'scripts');
  const files = [];
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (stat.isFile() && NAMING_CONVENTIONS.extensions.some(ext => item.endsWith(ext))) {
        files.push({
          name: item,
          path: itemPath,
          relativePath: path.relative(scriptsDir, itemPath),
          size: stat.size,
          modified: stat.mtime
        });
      }
    });
  }
  
  scanDirectory(scriptsDir);
  return files;
}

/**
 * Validate script naming conventions
 */
function validateNamingConventions(files) {
  const issues = [];
  
  files.forEach(file => {
    const fileName = file.name;
    const baseName = path.basename(fileName, path.extname(fileName));
    
    // Check for kebab-case naming
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(baseName)) {
      issues.push({
        type: 'naming',
        severity: 'warning',
        file: file.relativePath,
        message: `Script name should use kebab-case: ${fileName}`,
        suggestion: `Consider renaming to: ${baseName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      });
    }
    
    // Check for appropriate prefixes
    const hasValidPrefix = Object.values(NAMING_CONVENTIONS.prefixes).some(prefix => 
      baseName.startsWith(prefix)
    );
    
    if (!hasValidPrefix) {
      issues.push({
        type: 'naming',
        severity: 'info',
        file: file.relativePath,
        message: `Script name should have a descriptive prefix`,
        suggestion: `Consider using one of: ${Object.values(NAMING_CONVENTIONS.prefixes).join(', ')}`
      });
    }
    
    // Check for appropriate suffixes
    const hasValidSuffix = Object.values(NAMING_CONVENTIONS.suffixes).some(suffix => 
      baseName.endsWith(suffix)
    );
    
    if (baseName.length > 20 && !hasValidSuffix) {
      issues.push({
        type: 'naming',
        severity: 'info',
        file: file.relativePath,
        message: `Long script names should have descriptive suffixes`,
        suggestion: `Consider using one of: ${Object.values(NAMING_CONVENTIONS.suffixes).join(', ')}`
      });
    }
  });
  
  return issues;
}

/**
 * Validate script documentation
 */
function validateDocumentation(files) {
  const issues = [];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const lines = content.split('\n');
      
      // Check for file header documentation
      const hasHeader = lines.slice(0, 10).some(line => 
        line.includes('*') && (line.includes('Script') || line.includes('Module'))
      );
      
      if (!hasHeader) {
        issues.push({
          type: 'documentation',
          severity: 'warning',
          file: file.relativePath,
          message: 'Script lacks proper header documentation',
          suggestion: 'Add a comprehensive header comment block'
        });
      }
      
      // Check for description
      const hasDescription = lines.some(line => 
        line.includes('description') || line.includes('Description')
      );
      
      if (!hasDescription) {
        issues.push({
          type: 'documentation',
          severity: 'warning',
          file: file.relativePath,
          message: 'Script lacks description documentation',
          suggestion: 'Add a description section in the header'
        });
      }
      
      // Check for usage examples
      const hasUsage = lines.some(line => 
        line.includes('usage') || line.includes('Usage') || line.includes('example')
      );
      
      if (!hasUsage) {
        issues.push({
          type: 'documentation',
          severity: 'info',
          file: file.relativePath,
          message: 'Script lacks usage examples',
          suggestion: 'Add usage examples in the documentation'
        });
      }
      
      // Check for JSDoc comments on functions
      const functionLines = lines.filter(line => 
        line.trim().startsWith('function ') || 
        line.trim().startsWith('async function ') ||
        line.includes('= function') ||
        line.includes('=>')
      );
      
      const jsdocLines = lines.filter(line => line.trim().startsWith('/**'));
      
      if (functionLines.length > 0 && jsdocLines.length === 0) {
        issues.push({
          type: 'documentation',
          severity: 'info',
          file: file.relativePath,
          message: 'Script functions lack JSDoc documentation',
          suggestion: 'Add JSDoc comments for all functions'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'documentation',
        severity: 'error',
        file: file.relativePath,
        message: `Error reading file: ${error.message}`,
        suggestion: 'Check file permissions and encoding'
      });
    }
  });
  
  return issues;
}

/**
 * Validate code structure
 */
function validateCodeStructure(files) {
  const issues = [];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const lines = content.split('\n');
      
      // Check for strict mode
      if (!content.includes('"use strict"') && !content.includes("'use strict'")) {
        issues.push({
          type: 'structure',
          severity: 'warning',
          file: file.relativePath,
          message: 'Script should use strict mode',
          suggestion: 'Add "use strict"; at the top of the file'
        });
      }
      
      // Check for error handling
      const hasErrorHandling = content.includes('try') && content.includes('catch');
      if (!hasErrorHandling) {
        issues.push({
          type: 'structure',
          severity: 'warning',
          file: file.relativePath,
          message: 'Script lacks error handling',
          suggestion: 'Add try-catch blocks for error handling'
        });
      }
      
      // Check for logging
      const hasLogging = content.includes('console.log') || 
                        content.includes('console.error') || 
                        content.includes('console.warn');
      if (!hasLogging) {
        issues.push({
          type: 'structure',
          severity: 'info',
          file: file.relativePath,
          message: 'Script lacks logging statements',
          suggestion: 'Add console logging for debugging and monitoring'
        });
      }
      
      // Check for validation
      const hasValidation = content.includes('validate') || 
                           content.includes('check') || 
                           content.includes('assert');
      if (!hasValidation) {
        issues.push({
          type: 'structure',
          severity: 'info',
          file: file.relativePath,
          message: 'Script lacks input validation',
          suggestion: 'Add input validation and parameter checking'
        });
      }
      
      // Check file length
      if (lines.length > CODE_STRUCTURE_STANDARDS.maxFileLength) {
        issues.push({
          type: 'structure',
          severity: 'warning',
          file: file.relativePath,
          message: `Script is too long (${lines.length} lines)`,
          suggestion: `Consider splitting into smaller modules (max ${CODE_STRUCTURE_STANDARDS.maxFileLength} lines)`
        });
      }
      
      // Check for comments
      const commentLines = lines.filter(line => 
        line.trim().startsWith('//') || 
        line.trim().startsWith('/*') || 
        line.trim().startsWith('*')
      );
      
      const commentRatio = commentLines.length / lines.length;
      if (commentRatio < 0.1) {
        issues.push({
          type: 'structure',
          severity: 'info',
          file: file.relativePath,
          message: 'Script has low comment density',
          suggestion: 'Add more inline comments for better maintainability'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'structure',
        severity: 'error',
        file: file.relativePath,
        message: `Error analyzing file structure: ${error.message}`,
        suggestion: 'Check file syntax and encoding'
      });
    }
  });
  
  return issues;
}

/**
 * Generate consistency report
 */
function generateConsistencyReport(namingIssues, documentationIssues, structureIssues) {
  const allIssues = [...namingIssues, ...documentationIssues, ...structureIssues];
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: getAllScriptFiles().length,
      totalIssues: allIssues.length,
      critical: allIssues.filter(issue => issue.severity === 'error').length,
      warnings: allIssues.filter(issue => issue.severity === 'warning').length,
      info: allIssues.filter(issue => issue.severity === 'info').length
    },
    issues: {
      naming: namingIssues,
      documentation: documentationIssues,
      structure: structureIssues
    },
    recommendations: generateRecommendations(allIssues),
    consistencyScore: calculateConsistencyScore(allIssues)
  };
  
  return report;
}

/**
 * Generate recommendations based on issues
 */
function generateRecommendations(issues) {
  const recommendations = [];
  
  // Group issues by type
  const issuesByType = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});
  
  // Naming recommendations
  if (issuesByType.naming) {
    const namingIssues = issuesByType.naming;
    recommendations.push({
      type: 'naming',
      priority: 'medium',
      message: `${namingIssues.length} naming convention issues found`,
      action: 'Standardize script naming using kebab-case with descriptive prefixes/suffixes',
      examples: namingIssues.slice(0, 3).map(issue => issue.suggestion)
    });
  }
  
  // Documentation recommendations
  if (issuesByType.documentation) {
    const docIssues = issuesByType.documentation;
    recommendations.push({
      type: 'documentation',
      priority: 'high',
      message: `${docIssues.length} documentation issues found`,
      action: 'Add comprehensive documentation including headers, descriptions, and usage examples',
      examples: docIssues.slice(0, 3).map(issue => issue.suggestion)
    });
  }
  
  // Structure recommendations
  if (issuesByType.structure) {
    const structureIssues = issuesByType.structure;
    recommendations.push({
      type: 'structure',
      priority: 'high',
      message: `${structureIssues.length} code structure issues found`,
      action: 'Improve code structure with error handling, logging, and validation',
      examples: structureIssues.slice(0, 3).map(issue => issue.suggestion)
    });
  }
  
  return recommendations;
}

/**
 * Calculate consistency score
 */
function calculateConsistencyScore(issues) {
  const totalFiles = getAllScriptFiles().length;
  if (totalFiles === 0) return 100;
  
  const criticalIssues = issues.filter(issue => issue.severity === 'error').length;
  const warningIssues = issues.filter(issue => issue.severity === 'warning').length;
  const infoIssues = issues.filter(issue => issue.severity === 'info').length;
  
  // Calculate score (100 - penalties)
  let score = 100;
  score -= criticalIssues * 20; // 20 points per critical issue
  score -= warningIssues * 10;  // 10 points per warning
  score -= infoIssues * 2;      // 2 points per info issue
  
  return Math.max(0, score);
}

/**
 * Save consistency report
 */
function saveConsistencyReport(report) {
  const reportPath = path.join(__dirname, '..', 'test-results', 'script-consistency-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Consistency report saved to: ${reportPath}`);
}

/**
 * Print consistency summary
 */
function printConsistencySummary(report) {
  console.log('\n📋 Script Consistency Summary');
  console.log('==============================');
  
  console.log(`\n📊 Consistency Score: ${report.consistencyScore}/100`);
  console.log(`📁 Total Scripts: ${report.summary.totalFiles}`);
  console.log(`🔍 Total Issues: ${report.summary.totalIssues}`);
  
  console.log('\n📈 Issue Breakdown:');
  console.log(`  🚨 Critical: ${report.summary.critical}`);
  console.log(`  ⚠️ Warnings: ${report.summary.warnings}`);
  console.log(`  ℹ️ Info: ${report.summary.info}`);
  
  // Print issues by category
  Object.entries(report.issues).forEach(([category, issues]) => {
    if (issues.length > 0) {
      console.log(`\n📂 ${category.toUpperCase()} Issues (${issues.length}):`);
      issues.slice(0, 5).forEach(issue => {
        const icon = issue.severity === 'error' ? '🚨' : 
                     issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`  ${icon} ${issue.file}: ${issue.message}`);
      });
      if (issues.length > 5) {
        console.log(`  ... and ${issues.length - 5} more`);
      }
    }
  });
  
  // Print recommendations
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      const icon = rec.priority === 'high' ? '🔴' : 
                   rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`  ${icon} ${rec.message}`);
      console.log(`     Action: ${rec.action}`);
      if (rec.examples && rec.examples.length > 0) {
        console.log(`     Examples: ${rec.examples.join(', ')}`);
      }
    });
  }
  
  // Overall status
  if (report.consistencyScore >= 90) {
    console.log('\n✅ Overall Status: EXCELLENT');
  } else if (report.consistencyScore >= 70) {
    console.log('\n⚠️ Overall Status: GOOD (needs improvement)');
  } else if (report.consistencyScore >= 50) {
    console.log('\n🔶 Overall Status: FAIR (requires attention)');
  } else {
    console.log('\n🚨 Overall Status: POOR (needs significant work)');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('📋 Script Consistency Checker');
  console.log('==============================\n');
  
  try {
    // Get all script files
    const files = getAllScriptFiles();
    console.log(`📁 Found ${files.length} script files`);
    
    if (files.length === 0) {
      console.log('⚠️ No script files found in the scripts directory');
      return;
    }
    
    // Validate naming conventions
    console.log('\n🔍 Checking naming conventions...');
    const namingIssues = validateNamingConventions(files);
    
    // Validate documentation
    console.log('📝 Checking documentation...');
    const documentationIssues = validateDocumentation(files);
    
    // Validate code structure
    console.log('🏗️ Checking code structure...');
    const structureIssues = validateCodeStructure(files);
    
    // Generate report
    const report = generateConsistencyReport(namingIssues, documentationIssues, structureIssues);
    
    // Save report
    saveConsistencyReport(report);
    
    // Print summary
    printConsistencySummary(report);
    
    // Exit with appropriate code
    const exitCode = report.summary.critical > 0 ? 1 : 0;
    process.exit(exitCode);
    
  } catch (error) {
    console.error('❌ Consistency check failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateNamingConventions,
  validateDocumentation,
  validateCodeStructure,
  generateConsistencyReport
};
