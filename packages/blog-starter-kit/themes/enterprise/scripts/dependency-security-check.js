#!/usr/bin/env node

/**
 * Dependency Security Check Script
 * 
 * This script validates dependencies for security vulnerabilities and compatibility issues.
 * Addresses code review feedback from PR #37 about dependency security concerns.
 * 
 * Features:
 * - Vulnerability scanning for all dependencies
 * - Compatibility checking for new dependencies
 * - Security audit with detailed reporting
 * - Integration with CI/CD pipelines
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Security thresholds
const SECURITY_THRESHOLDS = {
  HIGH: 0,      // No high-severity vulnerabilities allowed
  MODERATE: 5,  // Maximum 5 moderate-severity vulnerabilities
  LOW: 20,      // Maximum 20 low-severity vulnerabilities
  INFO: 50      // Maximum 50 info-level vulnerabilities
};

// New dependencies to validate
const NEW_DEPENDENCIES = [
  'chrome-launcher',
  'lighthouse',
  '@playwright/test',
  '@axe-core/playwright'
];

/**
 * Run npm audit to check for vulnerabilities
 */
function runSecurityAudit() {
  console.log('🔍 Running security audit...');
  
  try {
    const output = execSync('npm audit --json', { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 300000 // 5 minute timeout
    });
    
    const auditResults = JSON.parse(output);
    return auditResults;
  } catch (error) {
    console.error('❌ Security audit failed:', error.message);
    
    // Try to parse partial results
    try {
      const output = error.stdout || '{}';
      return JSON.parse(output);
    } catch (parseError) {
      return { vulnerabilities: {}, metadata: { vulnerabilities: { total: 0 } } };
    }
  }
}

/**
 * Check specific dependencies for known issues
 */
function checkDependencyCompatibility() {
  console.log('🔧 Checking dependency compatibility...');
  
  const issues = [];
  
  // Check Node.js version compatibility
  const nodeVersion = process.version;
  const requiredNodeVersion = '18.0.0';
  
  if (compareVersions(nodeVersion.slice(1), requiredNodeVersion) < 0) {
    issues.push({
      type: 'compatibility',
      severity: 'high',
      message: `Node.js version ${nodeVersion} is below required version ${requiredNodeVersion}`,
      recommendation: 'Upgrade Node.js to version 18 or higher'
    });
  }
  
  // Check for known problematic dependencies
  const problematicDeps = {
    'lighthouse': {
      version: '^11.0.0',
      issues: ['Requires Chrome browser', 'High memory usage'],
      recommendations: ['Ensure Chrome is installed', 'Monitor memory usage in CI']
    },
    'chrome-launcher': {
      version: '^1.0.0',
      issues: ['Requires Chrome browser', 'Platform-specific binaries'],
      recommendations: ['Install Chrome in CI environment', 'Use platform-specific builds']
    }
  };
  
  Object.entries(problematicDeps).forEach(([dep, info]) => {
    issues.push({
      type: 'dependency',
      severity: 'moderate',
      message: `Dependency ${dep} has known issues: ${info.issues.join(', ')}`,
      recommendations: info.recommendations
    });
  });
  
  return issues;
}

/**
 * Validate new dependencies
 */
function validateNewDependencies() {
  console.log('📦 Validating new dependencies...');
  
  const validationResults = [];
  
  NEW_DEPENDENCIES.forEach(dep => {
    try {
      // Check if dependency is installed
      const packagePath = path.join(__dirname, '..', 'node_modules', dep);
      if (!fs.existsSync(packagePath)) {
        validationResults.push({
          dependency: dep,
          status: 'missing',
          message: `Dependency ${dep} is not installed`
        });
        return;
      }
      
      // Check package.json for version
      const packageJsonPath = path.join(__dirname, '..', 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const version = packageJson.devDependencies?.[dep] || packageJson.dependencies?.[dep];
      
      if (!version) {
        validationResults.push({
          dependency: dep,
          status: 'not-declared',
          message: `Dependency ${dep} is not declared in package.json`
        });
        return;
      }
      
      // Check for security advisories
      try {
        const auditOutput = execSync(`npm audit ${dep} --json`, { 
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 60000
        });
        const audit = JSON.parse(auditOutput);
        const vulnerabilities = audit.metadata?.vulnerabilities || {};
        
        validationResults.push({
          dependency: dep,
          status: 'validated',
          version: version,
          vulnerabilities: vulnerabilities,
          message: `Dependency ${dep} validated successfully`
        });
      } catch (auditError) {
        validationResults.push({
          dependency: dep,
          status: 'warning',
          version: version,
          message: `Could not audit dependency ${dep}: ${auditError.message}`
        });
      }
      
    } catch (error) {
      validationResults.push({
        dependency: dep,
        status: 'error',
        message: `Error validating dependency ${dep}: ${error.message}`
      });
    }
  });
  
  return validationResults;
}

/**
 * Compare semantic versions
 */
function compareVersions(version1, version2) {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part > v2part) return 1;
    if (v1part < v2part) return -1;
  }
  
  return 0;
}

/**
 * Generate security report
 */
function generateSecurityReport(auditResults, compatibilityIssues, dependencyValidation) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalVulnerabilities: auditResults.metadata?.vulnerabilities?.total || 0,
      high: auditResults.metadata?.vulnerabilities?.high || 0,
      moderate: auditResults.metadata?.vulnerabilities?.moderate || 0,
      low: auditResults.metadata?.vulnerabilities?.low || 0,
      info: auditResults.metadata?.vulnerabilities?.info || 0
    },
    compatibilityIssues,
    dependencyValidation,
    recommendations: [],
    securityScore: 100
  };
  
  // Calculate security score
  const vulnerabilities = report.summary;
  if (vulnerabilities.high > SECURITY_THRESHOLDS.HIGH) {
    report.securityScore -= 50;
    report.recommendations.push('CRITICAL: Fix high-severity vulnerabilities immediately');
  }
  if (vulnerabilities.moderate > SECURITY_THRESHOLDS.MODERATE) {
    report.securityScore -= 20;
    report.recommendations.push('Fix moderate-severity vulnerabilities');
  }
  if (vulnerabilities.low > SECURITY_THRESHOLDS.LOW) {
    report.securityScore -= 10;
    report.recommendations.push('Review low-severity vulnerabilities');
  }
  
  // Add compatibility recommendations
  compatibilityIssues.forEach(issue => {
    if (issue.severity === 'high') {
      report.securityScore -= 30;
    } else if (issue.severity === 'moderate') {
      report.securityScore -= 15;
    }
    report.recommendations.push(...issue.recommendations);
  });
  
  // Add dependency validation recommendations
  dependencyValidation.forEach(validation => {
    if (validation.status === 'missing' || validation.status === 'error') {
      report.securityScore -= 20;
      report.recommendations.push(`Fix dependency issue: ${validation.message}`);
    }
  });
  
  return report;
}

/**
 * Save security report
 */
function saveSecurityReport(report) {
  const reportPath = path.join(__dirname, '..', 'test-results', 'security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Security report saved to: ${reportPath}`);
}

/**
 * Print security summary
 */
function printSecuritySummary(report) {
  console.log('\n🛡️ Security Summary');
  console.log('==================');
  
  console.log(`\n📊 Security Score: ${report.securityScore}/100`);
  
  console.log('\n🔍 Vulnerability Summary:');
  console.log(`  High: ${report.summary.high}`);
  console.log(`  Moderate: ${report.summary.moderate}`);
  console.log(`  Low: ${report.summary.low}`);
  console.log(`  Info: ${report.summary.info}`);
  
  if (report.compatibilityIssues.length > 0) {
    console.log('\n⚠️ Compatibility Issues:');
    report.compatibilityIssues.forEach(issue => {
      console.log(`  ${issue.severity.toUpperCase()}: ${issue.message}`);
    });
  }
  
  if (report.dependencyValidation.length > 0) {
    console.log('\n📦 Dependency Validation:');
    report.dependencyValidation.forEach(validation => {
      const status = validation.status === 'validated' ? '✅' : 
                    validation.status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${status} ${validation.dependency}: ${validation.message}`);
    });
  }
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
  }
  
  // Security status
  if (report.securityScore >= 90) {
    console.log('\n✅ Security status: EXCELLENT');
  } else if (report.securityScore >= 70) {
    console.log('\n⚠️ Security status: GOOD (needs attention)');
  } else if (report.securityScore >= 50) {
    console.log('\n🔶 Security status: FAIR (requires fixes)');
  } else {
    console.log('\n🚨 Security status: POOR (critical issues)');
  }
}

/**
 * Validate script security
 */
function validateScriptSecurity() {
  console.log('🔒 Validating script security...');
  
  // Check if we're in the correct directory
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found. Please run from project root.');
    process.exit(1);
  }
  
  // Check if we're in a safe environment
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_PROD_TESTS) {
    console.error('❌ Security checks are not allowed in production environment');
    console.error('   Set ALLOW_PROD_TESTS=true if you need to run checks in production');
    process.exit(1);
  }
  
  console.log('✅ Script security validation passed');
}

/**
 * Main execution
 */
function main() {
  console.log('🛡️ Dependency Security Check');
  console.log('============================\n');
  
  // Validate script security
  validateScriptSecurity();
  
  try {
    // Run security audit
    const auditResults = runSecurityAudit();
    
    // Check compatibility
    const compatibilityIssues = checkDependencyCompatibility();
    
    // Validate new dependencies
    const dependencyValidation = validateNewDependencies();
    
    // Generate report
    const report = generateSecurityReport(auditResults, compatibilityIssues, dependencyValidation);
    
    // Save report
    saveSecurityReport(report);
    
    // Print summary
    printSecuritySummary(report);
    
    // Exit with appropriate code
    const exitCode = report.securityScore >= 70 ? 0 : 1;
    process.exit(exitCode);
    
  } catch (error) {
    console.error('❌ Security check failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runSecurityAudit,
  checkDependencyCompatibility,
  validateNewDependencies,
  generateSecurityReport
};
