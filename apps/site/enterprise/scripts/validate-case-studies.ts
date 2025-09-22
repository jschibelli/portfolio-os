#!/usr/bin/env tsx

/**
 * Case Study Validation Script
 * 
 * This script validates all MDX case studies and provides detailed feedback
 * on any issues found. Run with: npx tsx scripts/validate-case-studies.ts
 */

import { validateAllCaseStudies } from '../lib/mdx-case-study-loader';

async function main() {
  console.log('🔍 Validating MDX case studies...\n');
  
  try {
    const results = await validateAllCaseStudies();
    
    // Print summary
    console.log('📊 Validation Summary:');
    console.log(`   Total case studies: ${results.summary.total}`);
    console.log(`   ✅ Valid: ${results.summary.valid}`);
    console.log(`   ❌ Invalid: ${results.summary.invalid}`);
    console.log(`   ⚠️  Total warnings: ${results.summary.warnings}\n`);
    
    // Print invalid case studies
    if (results.invalid.length > 0) {
      console.log('❌ Invalid Case Studies:');
      results.invalid.forEach(({ slug, errors, warnings }) => {
        console.log(`\n   📁 ${slug}.mdx`);
        errors.forEach(error => console.log(`      ❌ ${error}`));
        warnings.forEach(warning => console.log(`      ⚠️  ${warning}`));
      });
      console.log('');
    }
    
    // Print valid case studies with warnings
    const validWithWarnings = results.valid.filter(cs => {
      // We'd need to re-validate to get warnings for valid case studies
      // For now, just show the valid ones
      return true;
    });
    
    if (validWithWarnings.length > 0) {
      console.log('✅ Valid Case Studies:');
      results.valid.forEach(({ meta }) => {
        console.log(`   📁 ${meta.slug}.mdx - ${meta.title}`);
      });
      console.log('');
    }
    
    // Exit with error code if there are invalid case studies
    if (results.invalid.length > 0) {
      console.log('❌ Validation failed. Please fix the errors above.');
      process.exit(1);
    } else {
      console.log('✅ All case studies are valid!');
      if (results.summary.warnings > 0) {
        console.log(`⚠️  ${results.summary.warnings} warnings found. Consider addressing them for better quality.`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error during validation:', error);
    process.exit(1);
  }
}

// Run the validation
main();
