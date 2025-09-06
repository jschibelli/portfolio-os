#!/usr/bin/env node

/**
 * Resource Validation Script
 * 
 * This script validates that all referenced resources (fonts, CSS, images)
 * exist and have correct file types and paths.
 */

const fs = require('fs');
const path = require('path');

// Resources to validate
const RESOURCES = [
  {
    path: '/assets/PlusJakartaSans-Regular.ttf',
    type: 'font/ttf',
    required: true
  },
  {
    path: '/assets/PlusJakartaSans-Medium.ttf',
    type: 'font/ttf',
    required: true
  },
  {
    path: '/assets/PlusJakartaSans-SemiBold.ttf',
    type: 'font/ttf',
    required: true
  },
  {
    path: '/assets/PlusJakartaSans-Bold.ttf',
    type: 'font/ttf',
    required: false
  },
  {
    path: '/assets/PlusJakartaSans-ExtraBold.ttf',
    type: 'font/ttf',
    required: false
  },
  {
    path: '/styles/index.css',
    type: 'text/css',
    required: true
  }
];

/**
 * Validate a single resource
 */
function validateResource(basePath, resource) {
  const fullPath = path.join(basePath, 'public', resource.path);
  const exists = fs.existsSync(fullPath);
  
  let fileType = null;
  let size = null;
  let lastModified = null;
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    size = stats.size;
    lastModified = stats.mtime;
    
    // Determine file type from extension
    const ext = path.extname(fullPath).toLowerCase();
    switch (ext) {
      case '.ttf':
        fileType = 'font/ttf';
        break;
      case '.woff':
        fileType = 'font/woff';
        break;
      case '.woff2':
        fileType = 'font/woff2';
        break;
      case '.css':
        fileType = 'text/css';
        break;
      case '.js':
        fileType = 'application/javascript';
        break;
      default:
        fileType = 'unknown';
    }
  }
  
  return {
    resource: resource.path,
    exists,
    expectedType: resource.type,
    actualType: fileType,
    size,
    lastModified,
    required: resource.required,
    valid: exists && (fileType === resource.type || !resource.required)
  };
}

/**
 * Validate all resources
 */
function validateAllResources(basePath) {
  return RESOURCES.map(resource => validateResource(basePath, resource));
}

/**
 * Generate validation report
 */
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    resources: results,
    summary: {
      total: results.length,
      valid: results.filter(r => r.valid).length,
      missing: results.filter(r => !r.exists).length,
      typeMismatch: results.filter(r => r.exists && r.actualType !== r.expectedType).length,
      requiredMissing: results.filter(r => r.required && !r.exists).length
    }
  };
  
  return report;
}

/**
 * Print validation summary
 */
function printSummary(report) {
  console.log('\n📁 Resource Validation Summary');
  console.log('==============================');
  
  report.resources.forEach(result => {
    const status = result.valid ? '✅' : '❌';
    const required = result.required ? '(REQUIRED)' : '(OPTIONAL)';
    
    console.log(`${status} ${result.resource} ${required}`);
    
    if (result.exists) {
      console.log(`   Type: ${result.actualType} (expected: ${result.expectedType})`);
      console.log(`   Size: ${(result.size / 1024).toFixed(2)} KB`);
      console.log(`   Modified: ${result.lastModified.toISOString()}`);
    } else {
      console.log(`   Status: MISSING`);
    }
    
    if (result.exists && result.actualType !== result.expectedType) {
      console.log(`   ⚠️  Type mismatch: expected ${result.expectedType}, got ${result.actualType}`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total resources: ${report.summary.total}`);
  console.log(`   Valid: ${report.summary.valid}`);
  console.log(`   Missing: ${report.summary.missing}`);
  console.log(`   Type mismatches: ${report.summary.typeMismatch}`);
  console.log(`   Required missing: ${report.summary.requiredMissing}`);
  
  if (report.summary.requiredMissing > 0) {
    console.log(`\n❌ Critical: ${report.summary.requiredMissing} required resources are missing!`);
  } else if (report.summary.typeMismatch > 0) {
    console.log(`\n⚠️  Warning: ${report.summary.typeMismatch} resources have type mismatches.`);
  } else {
    console.log(`\n✅ All resources are valid!`);
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations(report) {
  const recommendations = [];
  
  // Missing required resources
  report.resources
    .filter(r => r.required && !r.exists)
    .forEach(r => {
      recommendations.push({
        type: 'missing',
        priority: 'high',
        resource: r.resource,
        message: `Required resource ${r.resource} is missing. This will cause font loading failures.`
      });
    });
  
  // Type mismatches
  report.resources
    .filter(r => r.exists && r.actualType !== r.expectedType)
    .forEach(r => {
      recommendations.push({
        type: 'type_mismatch',
        priority: 'medium',
        resource: r.resource,
        message: `Resource ${r.resource} has type mismatch. Expected ${r.expectedType}, got ${r.actualType}.`
      });
    });
  
  // Large files
  report.resources
    .filter(r => r.exists && r.size > 500 * 1024) // > 500KB
    .forEach(r => {
      recommendations.push({
        type: 'size',
        priority: 'low',
        resource: r.resource,
        message: `Resource ${r.resource} is large (${(r.size / 1024).toFixed(2)} KB). Consider optimization.`
      });
    });
  
  return recommendations;
}

/**
 * Main execution
 */
function main() {
  const basePath = process.argv[2] || process.cwd();
  
  console.log('📁 Resource Validation Script');
  console.log('=============================\n');
  
  console.log(`Validating resources in: ${basePath}`);
  
  try {
    // Validate all resources
    const results = validateAllResources(basePath);
    
    // Generate report
    const report = generateReport(results);
    
    // Generate recommendations
    const recommendations = generateRecommendations(report);
    report.recommendations = recommendations;
    
    // Save report
    const reportPath = path.join(basePath, 'test-results', 'resource-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Resource validation report saved to: ${reportPath}`);
    
    // Print summary
    printSummary(report);
    
    // Print recommendations
    if (recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      recommendations.forEach(rec => {
        const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`${priority} ${rec.message}`);
      });
    }
    
    // Exit with appropriate code
    const hasCriticalIssues = report.summary.requiredMissing > 0;
    process.exit(hasCriticalIssues ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Resource validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateResource,
  validateAllResources,
  generateReport
};
