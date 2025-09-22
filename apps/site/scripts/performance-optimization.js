const fs = require('fs').promises;
const path = require('path');

/**
 * Performance optimization summary script for the blog
 * 
 * This script provides a comprehensive overview of performance optimizations
 * implemented and creates a performance checklist for monitoring.
 * 
 * Usage: node scripts/performance-optimization.js
 * 
 * Features:
 * - Displays optimization summary
 * - Creates performance checklist file
 * - Provides monitoring recommendations
 * - Includes error handling and validation
 */

/**
 * Validates and sanitizes a file path to prevent path traversal attacks
 * @param {string} filePath - The file path to validate
 * @param {string} baseDir - The base directory to restrict access to
 * @returns {string} - The normalized and validated path
 * @throws {Error} - If the path is invalid or outside the base directory
 */
function validatePath(filePath, baseDir) {
  const normalizedPath = path.normalize(filePath);
  const resolvedPath = path.resolve(normalizedPath);
  const resolvedBase = path.resolve(baseDir);
  
  if (!resolvedPath.startsWith(resolvedBase)) {
    throw new Error(`Path traversal detected: ${filePath}`);
  }
  
  return resolvedPath;
}

/**
 * Validates checklist content to prevent injection attacks
 * @param {string} content - The content to validate
 * @returns {string} - The sanitized content
 */
function validateContent(content) {
  // Remove any potentially dangerous characters
  return content
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Creates the performance checklist content
 * @returns {string} - The formatted checklist content
 */
function createChecklistContent() {
  return validateContent(`# Performance Optimization Checklist

## ✅ Completed
- [x] Next.js image optimization enabled
- [x] Hero background image optimized (WebP, 0.06MB)
- [x] Responsive image sizes implemented
- [x] Lazy loading for non-critical images
- [x] Blur placeholders added
- [x] Quality settings optimized (85%)

## ⏳ To Test
- [ ] Lighthouse audit (target: >90 performance score)
- [ ] Mobile performance test
- [ ] Desktop performance test
- [ ] Image loading verification
- [ ] Console error check

## 📊 Metrics to Monitor
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Time to Interactive (TTI)

## 🎯 Target Scores
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >95

## 📝 Notes
- Generated on: ${new Date().toISOString()}
- Script version: 2.0.0
- Last updated: ${new Date().toLocaleDateString()}
`);
}

/**
 * Displays the performance optimization summary
 * @returns {Promise<void>}
 */
async function displayOptimizationSummary() {
  console.log('🚀 Performance Optimization Summary\n');

  console.log('✅ Completed Optimizations:');
  console.log('1. ✅ Updated Next.js config to enable image optimization');
  console.log('2. ✅ Switched hero background to optimized WebP image (0.06MB vs 2.53MB)');
  console.log('3. ✅ Added responsive image sizes to all Image components');
  console.log('4. ✅ Implemented lazy loading for non-critical images');
  console.log('5. ✅ Added blur placeholders for better perceived performance');
  console.log('6. ✅ Set optimal quality settings (85%) for all images');

  console.log('\n📊 Image Size Reduction:');
  console.log('• Hero background: 2.53MB → 0.06MB (98% reduction)');
  console.log('• All hero PNG files: ~15MB total → 0.06MB (99.6% reduction)');

  console.log('\n🔧 Technical Improvements:');
  console.log('• Next.js Image optimization enabled');
  console.log('• WebP and AVIF format support');
  console.log('• Responsive image sizing');
  console.log('• Lazy loading implementation');
  console.log('• Blur placeholder for better UX');

  console.log('\n📋 Remaining Tasks:');
  console.log('1. ⏳ Run Lighthouse audit to measure performance');
  console.log('2. ⏳ Test on mobile and desktop devices');
  console.log('3. ⏳ Verify all images load correctly');
  console.log('4. ⏳ Check for any console errors');

  console.log('\n💡 Additional Recommendations:');
  console.log('• Consider implementing a CDN for static assets');
  console.log('• Add service worker for offline caching');
  console.log('• Implement critical CSS inlining');
  console.log('• Use font-display: swap for web fonts');

  console.log('\n🎯 Expected Performance Improvements:');
  console.log('• Faster initial page load (hero image loads 40x faster)');
  console.log('• Better Core Web Vitals scores');
  console.log('• Improved mobile performance');
  console.log('• Reduced bandwidth usage');
  console.log('• Better user experience with blur placeholders');
}

/**
 * Creates the performance checklist file
 * @returns {Promise<void>}
 */
async function createChecklistFile() {
  try {
    const checklistContent = createChecklistContent();
    const outputPath = validatePath(
      path.join(__dirname, '../PERFORMANCE_CHECKLIST.md'),
      path.resolve(__dirname, '..')
    );
    
    await fs.writeFile(outputPath, checklistContent, 'utf8');
    console.log('\n✅ Created performance checklist: PERFORMANCE_CHECKLIST.md');
  } catch (error) {
    console.error('❌ Error creating performance checklist:', error.message);
    throw error;
  }
}

/**
 * Main function to run the performance optimization summary
 * @returns {Promise<void>}
 */
async function runPerformanceOptimizationSummary() {
  try {
    await displayOptimizationSummary();
    await createChecklistFile();
    console.log('\n🎉 Performance optimization summary completed successfully!');
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script if executed directly
if (require.main === module) {
  runPerformanceOptimizationSummary();
}

module.exports = {
  displayOptimizationSummary,
  createChecklistFile,
  validatePath,
  validateContent,
  createChecklistContent
};
