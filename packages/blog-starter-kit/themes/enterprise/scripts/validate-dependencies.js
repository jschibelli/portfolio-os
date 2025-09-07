#!/usr/bin/env node

/**
 * Dependency Validation Script
 * 
 * This script validates that all required dependencies for performance testing
 * are properly installed and compatible with the current environment.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Required dependencies for performance testing
const REQUIRED_DEPENDENCIES = {
  'lighthouse': {
    version: '^11.0.0',
    purpose: 'Performance auditing and Core Web Vitals measurement',
    command: 'lighthouse --version'
  },
  'chrome-launcher': {
    version: '^1.0.0',
    purpose: 'Chrome browser automation for Lighthouse',
    command: 'node -e "console.log(require(\'chrome-launcher\').version || \'installed\')"'
  },
  '@playwright/test': {
    version: '^1.55.0',
    purpose: 'End-to-end testing and performance monitoring',
    command: 'npx playwright --version'
  },
  '@axe-core/playwright': {
    version: '^4.8.5',
    purpose: 'Accessibility testing integration with Playwright',
    command: 'node -e "console.log(require(\'@axe-core/playwright\').version || \'installed\')"'
  }
};

/**
 * Check if a dependency is installed and working
 */
function checkDependency(name, config) {
  console.log(`🔍 Checking ${name}...`);
  
  try {
    const output = execSync(config.command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 10000
    });
    
    console.log(`✅ ${name} is installed and working`);
    console.log(`   Purpose: ${config.purpose}`);
    console.log(`   Version: ${output.trim()}`);
    return { name, status: 'installed', version: output.trim() };
  } catch (error) {
    console.log(`❌ ${name} is not properly installed`);
    console.log(`   Purpose: ${config.purpose}`);
    console.log(`   Error: ${error.message}`);
    return { name, status: 'missing', error: error.message };
  }
}

/**
 * Validate package.json dependencies
 */
function validatePackageJson() {
  console.log('📦 Validating package.json dependencies...');
  
  const packageJsonPath = path.join(__dirname, '../package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  let allValid = true;
  
  Object.entries(REQUIRED_DEPENDENCIES).forEach(([name, config]) => {
    if (!allDeps[name]) {
      console.log(`❌ ${name} is missing from package.json`);
      console.log(`   Required version: ${config.version}`);
      allValid = false;
    } else {
      console.log(`✅ ${name} is listed in package.json (${allDeps[name]})`);
    }
  });
  
  return allValid;
}

/**
 * Check Node.js version compatibility
 */
function checkNodeVersion() {
  console.log('🔍 Checking Node.js version...');
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    console.log(`❌ Node.js version ${nodeVersion} is not supported`);
    console.log('   Required: Node.js 16 or higher');
    return false;
  }
  
  console.log(`✅ Node.js version ${nodeVersion} is compatible`);
  return true;
}

/**
 * Check if Chrome/Chromium is available
 */
function checkChromeAvailability() {
  console.log('🔍 Checking Chrome/Chromium availability...');
  
  try {
    execSync('google-chrome --version', { stdio: 'pipe' });
    console.log('✅ Google Chrome is available');
    return true;
  } catch (error) {
    try {
      execSync('chromium --version', { stdio: 'pipe' });
      console.log('✅ Chromium is available');
      return true;
    } catch (error2) {
      console.log('❌ Neither Google Chrome nor Chromium is available');
      console.log('   Please install Chrome or Chromium for Lighthouse testing');
      return false;
    }
  }
}

/**
 * Generate installation recommendations
 */
function generateRecommendations(results) {
  const missing = results.filter(r => r.status === 'missing');
  
  if (missing.length === 0) {
    console.log('\n🎉 All dependencies are properly installed!');
    return;
  }
  
  console.log('\n💡 Installation Recommendations:');
  console.log('================================');
  
  missing.forEach(dep => {
    const config = REQUIRED_DEPENDENCIES[dep.name];
    console.log(`\n${dep.name}:`);
    console.log(`  Purpose: ${config.purpose}`);
    console.log(`  Install: npm install --save-dev ${dep.name}@${config.version}`);
  });
  
  console.log('\n📋 Complete installation command:');
  const installCommand = missing.map(dep => `${dep.name}@${REQUIRED_DEPENDENCIES[dep.name].version}`).join(' ');
  console.log(`npm install --save-dev ${installCommand}`);
}

/**
 * Main validation function
 */
function main() {
  console.log('🚀 Dependency Validation for Performance Testing');
  console.log('================================================\n');
  
  const results = [];
  
  // Check Node.js version
  if (!checkNodeVersion()) {
    process.exit(1);
  }
  
  // Validate package.json
  if (!validatePackageJson()) {
    console.log('\n❌ Package.json validation failed');
    process.exit(1);
  }
  
  // Check Chrome availability
  if (!checkChromeAvailability()) {
    console.log('\n⚠️  Chrome/Chromium not available - some tests may fail');
  }
  
  // Check individual dependencies
  console.log('\n🔍 Checking individual dependencies...');
  Object.entries(REQUIRED_DEPENDENCIES).forEach(([name, config]) => {
    const result = checkDependency(name, config);
    results.push(result);
  });
  
  // Generate recommendations
  generateRecommendations(results);
  
  // Summary
  const installed = results.filter(r => r.status === 'installed').length;
  const total = results.length;
  
  console.log(`\n📊 Summary: ${installed}/${total} dependencies are properly installed`);
  
  if (installed === total) {
    console.log('✅ All dependencies are ready for performance testing!');
    process.exit(0);
  } else {
    console.log('❌ Some dependencies need to be installed');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
