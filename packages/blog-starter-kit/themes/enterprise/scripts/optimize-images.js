const fs = require('fs');
const path = require('path');

// Simple image optimization script
// This will help us identify which images need optimization

const heroDir = path.join(__dirname, '../public/assets/hero');
const blogDir = path.join(__dirname, '../public/assets/blog');

function getFileSizeInMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

function analyzeImages() {
  console.log('🔍 Analyzing images for optimization...\n');
  
  // Analyze hero images
  console.log('📸 Hero Images:');
  const heroFiles = fs.readdirSync(heroDir);
  heroFiles.forEach(file => {
    const filePath = path.join(heroDir, file);
    const size = getFileSizeInMB(filePath);
    const needsOptimization = parseFloat(size) > 0.5; // Flag files > 500KB
    console.log(`  ${file}: ${size}MB ${needsOptimization ? '⚠️  NEEDS OPTIMIZATION' : '✅ OK'}`);
  });
  
  console.log('\n📝 Blog Images:');
  // Analyze blog images recursively
  function analyzeBlogDir(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        analyzeBlogDir(filePath, prefix + file + '/');
      } else {
        const size = getFileSizeInMB(filePath);
        const needsOptimization = parseFloat(size) > 0.2; // Flag files > 200KB
        console.log(`  ${prefix}${file}: ${size}MB ${needsOptimization ? '⚠️  NEEDS OPTIMIZATION' : '✅ OK'}`);
      }
    });
  }
  
  analyzeBlogDir(blogDir);
  
  console.log('\n💡 Recommendations:');
  console.log('1. Convert PNG images to WebP format for better compression');
  console.log('2. Use Next.js Image component with optimization enabled');
  console.log('3. Implement lazy loading for non-critical images');
  console.log('4. Consider using responsive images with different sizes');
}

analyzeImages();
