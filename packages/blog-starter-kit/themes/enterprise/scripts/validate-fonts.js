#!/usr/bin/env node

/**
 * Font Validation Script
 * 
 * This script validates font files to ensure they are properly formatted
 * and have correct MIME types for web use.
 */

const fs = require('fs');
const path = require('path');

// Font files to validate
const FONT_FILES = [
  'PlusJakartaSans-Regular.ttf',
  'PlusJakartaSans-Medium.ttf',
  'PlusJakartaSans-SemiBold.ttf',
  'PlusJakartaSans-Bold.ttf',
  'PlusJakartaSans-ExtraBold.ttf'
];

/**
 * Validate font file header
 */
function validateFontHeader(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Check TTF header (should start with specific bytes)
    if (buffer.length < 12) {
      return { valid: false, error: 'File too small to be a valid font' };
    }
    
    // TTF files should start with specific signature
    const signature = buffer.toString('ascii', 0, 4);
    if (signature === 'OTTO' || signature === 'ttcf' || buffer.readUInt32BE(0) === 0x00010000) {
      return { valid: true, type: 'TTF/OTF' };
    }
    
    // Check for WOFF signature
    if (buffer.toString('ascii', 0, 4) === 'wOFF') {
      return { valid: true, type: 'WOFF' };
    }
    
    // Check for WOFF2 signature
    if (buffer.toString('ascii', 0, 4) === 'wOF2') {
      return { valid: true, type: 'WOFF2' };
    }
    
    return { valid: false, error: 'Invalid font file signature' };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Validate font file size and properties
 */
function validateFontProperties(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const size = stats.size;
    
    // Check file size (fonts should be reasonable size)
    if (size < 1024) {
      return { valid: false, error: 'Font file too small' };
    }
    
    if (size > 10 * 1024 * 1024) { // 10MB
      return { valid: false, error: 'Font file too large' };
    }
    
    return {
      valid: true,
      size: size,
      sizeKB: Math.round(size / 1024),
      lastModified: stats.mtime
    };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Validate a single font file
 */
function validateFontFile(basePath, fontFile) {
  const filePath = path.join(basePath, 'public', 'assets', fontFile);
  const exists = fs.existsSync(filePath);
  
  if (!exists) {
    return {
      font: fontFile,
      exists: false,
      valid: false,
      error: 'File not found'
    };
  }
  
  const headerValidation = validateFontHeader(filePath);
  const propertiesValidation = validateFontProperties(filePath);
  
  return {
    font: fontFile,
    exists: true,
    valid: headerValidation.valid && propertiesValidation.valid,
    header: headerValidation,
    properties: propertiesValidation,
    path: filePath
  };
}

/**
 * Validate all font files
 */
function validateAllFonts(basePath) {
  return FONT_FILES.map(fontFile => validateFontFile(basePath, fontFile));
}

/**
 * Generate font validation report
 */
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    fonts: results,
    summary: {
      total: results.length,
      valid: results.filter(r => r.valid).length,
      missing: results.filter(r => !r.exists).length,
      invalid: results.filter(r => r.exists && !r.valid).length,
      totalSize: results
        .filter(r => r.exists && r.properties && r.properties.size)
        .reduce((sum, r) => sum + r.properties.size, 0)
    }
  };
  
  return report;
}

/**
 * Print font validation summary
 */
function printSummary(report) {
  console.log('\n🔤 Font Validation Summary');
  console.log('==========================');
  
  report.fonts.forEach(result => {
    const status = result.valid ? '✅' : '❌';
    console.log(`${status} ${result.font}`);
    
    if (result.exists) {
      if (result.header) {
        console.log(`   Type: ${result.header.type || 'Unknown'}`);
      }
      if (result.properties) {
        console.log(`   Size: ${result.properties.sizeKB} KB`);
        console.log(`   Modified: ${result.properties.lastModified.toISOString()}`);
      }
      if (result.header && !result.header.valid) {
        console.log(`   Error: ${result.header.error}`);
      }
      if (result.properties && !result.properties.valid) {
        console.log(`   Error: ${result.properties.error}`);
      }
    } else {
      console.log(`   Status: MISSING`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total fonts: ${report.summary.total}`);
  console.log(`   Valid: ${report.summary.valid}`);
  console.log(`   Missing: ${report.summary.missing}`);
  console.log(`   Invalid: ${report.summary.invalid}`);
  console.log(`   Total size: ${Math.round(report.summary.totalSize / 1024)} KB`);
  
  if (report.summary.missing > 0) {
    console.log(`\n❌ Critical: ${report.summary.missing} font files are missing!`);
  } else if (report.summary.invalid > 0) {
    console.log(`\n⚠️  Warning: ${report.summary.invalid} font files are invalid.`);
  } else {
    console.log(`\n✅ All font files are valid!`);
  }
}

/**
 * Generate font optimization recommendations
 */
function generateRecommendations(report) {
  const recommendations = [];
  
  // Missing fonts
  report.fonts
    .filter(r => !r.exists)
    .forEach(r => {
      recommendations.push({
        type: 'missing',
        priority: 'high',
        font: r.font,
        message: `Font file ${r.font} is missing. This will cause font loading failures.`
      });
    });
  
  // Invalid fonts
  report.fonts
    .filter(r => r.exists && !r.valid)
    .forEach(r => {
      recommendations.push({
        type: 'invalid',
        priority: 'high',
        font: r.font,
        message: `Font file ${r.font} is invalid: ${r.header?.error || r.properties?.error}`
      });
    });
  
  // Large fonts
  report.fonts
    .filter(r => r.exists && r.properties && r.properties.size > 500 * 1024) // > 500KB
    .forEach(r => {
      recommendations.push({
        type: 'size',
        priority: 'medium',
        font: r.font,
        message: `Font file ${r.font} is large (${r.properties.sizeKB} KB). Consider using WOFF2 format for better compression.`
      });
    });
  
  // Font format recommendations
  const ttfFonts = report.fonts.filter(r => r.exists && r.header?.type === 'TTF/OTF');
  if (ttfFonts.length > 0) {
    recommendations.push({
      type: 'format',
      priority: 'low',
      message: `Consider converting TTF fonts to WOFF2 format for better web performance and compression.`
    });
  }
  
  return recommendations;
}

/**
 * Main execution
 */
function main() {
  const basePath = process.argv[2] || process.cwd();
  
  console.log('🔤 Font Validation Script');
  console.log('=========================\n');
  
  console.log(`Validating fonts in: ${basePath}`);
  
  try {
    // Validate all fonts
    const results = validateAllFonts(basePath);
    
    // Generate report
    const report = generateReport(results);
    
    // Generate recommendations
    const recommendations = generateRecommendations(report);
    report.recommendations = recommendations;
    
    // Save report
    const reportPath = path.join(basePath, 'test-results', 'font-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Font validation report saved to: ${reportPath}`);
    
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
    const hasCriticalIssues = report.summary.missing > 0 || report.summary.invalid > 0;
    process.exit(hasCriticalIssues ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Font validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateFontFile,
  validateAllFonts,
  generateReport
};
