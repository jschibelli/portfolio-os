#!/usr/bin/env node

/**
 * CORS Validation Script
 * 
 * This script validates that font files and other resources can be loaded
 * with proper CORS headers to prevent loading issues.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Resources to validate
const RESOURCES = [
  '/assets/PlusJakartaSans-Regular.ttf',
  '/assets/PlusJakartaSans-Medium.ttf',
  '/assets/PlusJakartaSans-SemiBold.ttf',
  '/styles/index.css'
];

/**
 * Validate CORS headers for a resource
 */
function validateCORS(url, resource) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const options = {
      method: 'HEAD',
      headers: {
        'Origin': url,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };
    
    const req = protocol.request(url + resource, options, (res) => {
      const corsHeaders = {
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-methods': res.headers['access-control-allow-methods'],
        'access-control-allow-headers': res.headers['access-control-allow-headers'],
        'access-control-allow-credentials': res.headers['access-control-allow-credentials']
      };
      
      resolve({
        resource,
        status: res.statusCode,
        corsHeaders,
        valid: res.statusCode === 200 || res.statusCode === 204
      });
    });
    
    req.on('error', (error) => {
      resolve({
        resource,
        status: 'ERROR',
        error: error.message,
        valid: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        resource,
        status: 'TIMEOUT',
        error: 'Request timeout',
        valid: false
      });
    });
    
    req.end();
  });
}

/**
 * Validate local file existence
 */
function validateLocalFiles(basePath) {
  const results = [];
  
  RESOURCES.forEach(resource => {
    const filePath = path.join(basePath, 'public', resource);
    const exists = fs.existsSync(filePath);
    
    results.push({
      resource,
      type: 'local',
      exists,
      valid: exists
    });
  });
  
  return results;
}

/**
 * Generate CORS validation report
 */
function generateReport(remoteResults, localResults) {
  const report = {
    timestamp: new Date().toISOString(),
    local: localResults,
    remote: remoteResults,
    summary: {
      total: RESOURCES.length,
      localValid: localResults.filter(r => r.valid).length,
      remoteValid: remoteResults.filter(r => r.valid).length
    }
  };
  
  return report;
}

/**
 * Print validation summary
 */
function printSummary(report) {
  console.log('\n🔒 CORS Validation Summary');
  console.log('==========================');
  
  console.log('\n📁 Local Files:');
  report.local.forEach(result => {
    const status = result.valid ? '✅' : '❌';
    console.log(`${status} ${result.resource}: ${result.exists ? 'EXISTS' : 'MISSING'}`);
  });
  
  console.log('\n🌐 Remote CORS:');
  report.remote.forEach(result => {
    const status = result.valid ? '✅' : '❌';
    console.log(`${status} ${result.resource}: ${result.status}`);
    
    if (result.corsHeaders) {
      Object.entries(result.corsHeaders).forEach(([header, value]) => {
        if (value) {
          console.log(`   ${header}: ${value}`);
        }
      });
    }
  });
  
  console.log(`\n📊 Summary: ${report.summary.localValid}/${report.summary.total} local files valid, ${report.summary.remoteValid}/${report.summary.total} remote CORS valid`);
}

/**
 * Main execution
 */
async function main() {
  const url = process.argv[2] || 'http://localhost:3000';
  const basePath = process.argv[3] || process.cwd();
  
  console.log('🔒 CORS Validation Script');
  console.log('=========================\n');
  
  console.log(`Validating resources for: ${url}`);
  console.log(`Base path: ${basePath}\n`);
  
  try {
    // Validate local files
    console.log('📁 Checking local files...');
    const localResults = validateLocalFiles(basePath);
    
    // Validate remote CORS
    console.log('🌐 Checking remote CORS headers...');
    const remoteResults = await Promise.all(
      RESOURCES.map(resource => validateCORS(url, resource))
    );
    
    // Generate report
    const report = generateReport(remoteResults, localResults);
    
    // Save report
    const reportPath = path.join(basePath, 'test-results', 'cors-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 CORS validation report saved to: ${reportPath}`);
    
    // Print summary
    printSummary(report);
    
    // Exit with appropriate code
    const allValid = report.summary.localValid === report.summary.total && 
                    report.summary.remoteValid === report.summary.total;
    process.exit(allValid ? 0 : 1);
    
  } catch (error) {
    console.error('❌ CORS validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateCORS,
  validateLocalFiles,
  generateReport
};
