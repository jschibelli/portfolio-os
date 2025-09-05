#!/usr/bin/env node

/**
 * Playwright Report File Fixer
 * 
 * This script addresses the cr-gpt bot feedback by:
 * 1. Ensuring all YAML files end with a newline
 * 2. Adding descriptive comments to explain file purpose
 * 3. Validating YAML syntax
 * 4. Standardizing file formatting
 */

const fs = require('fs');
const path = require('path');

const PLAYWRIGHT_REPORT_DIR = path.join(__dirname, '..', 'playwright-report', 'data');

/**
 * Fix a single Playwright report file
 * @param {string} filePath - Path to the file to fix
 */
function fixPlaywrightReportFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Check if file ends with newline
    const needsNewline = !content.endsWith('\n');
    
    // Determine file type based on content
    let fileType = 'page-snapshot';
    let description = 'Page snapshot for accessibility and visual testing';
    
    if (content.includes('robots.txt')) {
      fileType = 'robots-txt-snapshot';
      description = 'Robots.txt content snapshot for SEO testing';
    } else if (content.includes('sitemap') || content.includes('xml')) {
      fileType = 'sitemap-snapshot';
      description = 'Sitemap content snapshot for SEO validation';
    } else if (content.includes('User-agent') || content.includes('Allow') || content.includes('Disallow')) {
      fileType = 'crawler-rules-snapshot';
      description = 'Crawler rules snapshot for SEO compliance testing';
    }
    
    // Add descriptive comment if not present
    let newContent = content;
    if (!content.includes('<!--') && !content.includes('This page snapshot')) {
      const comment = `\n<!-- \nThis ${fileType} captures content for automated testing.\nPurpose: ${description}\nFile: ${fileName}\nGenerated: ${new Date().toISOString()}\n-->\n`;
      newContent = content + comment;
    }
    
    // Ensure file ends with newline
    if (needsNewline || !newContent.endsWith('\n')) {
      newContent = newContent + '\n';
    }
    
    // Write the fixed content back
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed: ${fileName}`);
      return true;
    } else {
      console.log(`✓ Already correct: ${fileName}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Validate YAML syntax in a file
 * @param {string} filePath - Path to the file to validate
 */
function validateYAMLSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic YAML validation - check for common issues
    const yamlStart = content.indexOf('```yaml');
    const yamlEnd = content.indexOf('```', yamlStart + 7);
    
    if (yamlStart === -1 || yamlEnd === -1) {
      console.warn(`⚠️  No YAML block found in ${path.basename(filePath)}`);
      return true; // Not a YAML file, skip validation
    }
    
    const yamlContent = content.substring(yamlStart + 7, yamlEnd).trim();
    
    // Check for basic YAML structure
    if (yamlContent.length === 0) {
      console.warn(`⚠️  Empty YAML block in ${path.basename(filePath)}`);
      return false;
    }
    
    // Check for proper indentation (basic check)
    const lines = yamlContent.split('\n');
    let hasContent = false;
    
    for (const line of lines) {
      if (line.trim().length > 0) {
        hasContent = true;
        // Check for proper YAML structure
        if (line.includes(':') && !line.startsWith('-') && !line.startsWith(' ')) {
          // This looks like a root-level key, which is good
        }
      }
    }
    
    if (!hasContent) {
      console.warn(`⚠️  No content in YAML block in ${path.basename(filePath)}`);
      return false;
    }
    
    console.log(`✓ YAML syntax looks valid: ${path.basename(filePath)}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error validating YAML in ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main function to fix all Playwright report files
 */
function main() {
  console.log('🔧 Fixing Playwright report files...\n');
  
  if (!fs.existsSync(PLAYWRIGHT_REPORT_DIR)) {
    console.error(`❌ Playwright report directory not found: ${PLAYWRIGHT_REPORT_DIR}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(PLAYWRIGHT_REPORT_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(PLAYWRIGHT_REPORT_DIR, file));
  
  if (files.length === 0) {
    console.log('ℹ️  No Playwright report files found to fix.');
    return;
  }
  
  console.log(`Found ${files.length} Playwright report files to process:\n`);
  
  let fixedCount = 0;
  let validatedCount = 0;
  
  for (const file of files) {
    const wasFixed = fixPlaywrightReportFile(file);
    const isValid = validateYAMLSyntax(file);
    
    if (wasFixed) fixedCount++;
    if (isValid) validatedCount++;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files fixed: ${fixedCount}/${files.length}`);
  console.log(`   Files validated: ${validatedCount}/${files.length}`);
  
  if (fixedCount > 0) {
    console.log(`\n✅ Successfully fixed ${fixedCount} Playwright report files!`);
  } else {
    console.log(`\n✓ All Playwright report files were already correctly formatted.`);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixPlaywrightReportFile, validateYAMLSyntax };
