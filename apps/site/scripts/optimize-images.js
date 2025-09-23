const fs = require('fs').promises;
const path = require('path');

/**
 * Image optimization analysis script
 * 
 * This script analyzes images in the project to identify optimization opportunities.
 * It checks file sizes and provides recommendations for better performance.
 * 
 * Usage: node scripts/optimize-images.js
 * 
 * Configuration:
 * - heroThreshold: Maximum size in MB for hero images (default: 0.5)
 * - blogThreshold: Maximum size in MB for blog images (default: 0.2)
 * - maxDepth: Maximum directory recursion depth (default: 10)
 */

// Configuration constants
const CONFIG = {
  heroThreshold: 0.5, // MB
  blogThreshold: 0.2, // MB
  maxDepth: 10,
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
};

const heroDir = path.join(__dirname, '../public/assets/hero');
const blogDir = path.join(__dirname, '../public/assets/blog');

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
 * Gets file size in MB with error handling
 * @param {string} filePath - Path to the file
 * @returns {Promise<number>} - File size in MB
 */
async function getFileSizeInMB(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return (stats.size / (1024 * 1024)).toFixed(2);
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Checks if a file is a supported image format
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if it's a supported image format
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return CONFIG.supportedExtensions.includes(ext);
}

/**
 * Analyzes images in a directory recursively with depth limit
 * @param {string} dir - Directory path to analyze
 * @param {string} prefix - Prefix for display purposes
 * @param {number} currentDepth - Current recursion depth
 * @param {number} threshold - Size threshold for optimization flag
 * @returns {Promise<void>}
 */
async function analyzeBlogDir(dir, prefix = '', currentDepth = 0, threshold = CONFIG.blogThreshold) {
  try {
    // Prevent infinite recursion
    if (currentDepth >= CONFIG.maxDepth) {
      console.warn(`⚠️  Maximum depth reached for directory: ${dir}`);
      return;
    }

    // Validate path for security
    const validatedDir = validatePath(dir, path.resolve(__dirname, '../public'));
    
    const files = await fs.readdir(validatedDir);
    
    for (const file of files) {
      try {
        const filePath = path.join(validatedDir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          await analyzeBlogDir(filePath, prefix + file + '/', currentDepth + 1, threshold);
        } else if (isImageFile(file)) {
          const size = await getFileSizeInMB(filePath);
          const needsOptimization = parseFloat(size) > threshold;
          console.log(`  ${prefix}${file}: ${size}MB ${needsOptimization ? '⚠️  NEEDS OPTIMIZATION' : '✅ OK'}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

/**
 * Main function to analyze images for optimization opportunities
 * @returns {Promise<void>}
 */
async function analyzeImages() {
  try {
    console.log('🔍 Analyzing images for optimization...\n');
    
    // Analyze hero images
    console.log('📸 Hero Images:');
    try {
      const heroFiles = await fs.readdir(heroDir);
      for (const file of heroFiles) {
        if (isImageFile(file)) {
          const filePath = path.join(heroDir, file);
          const size = await getFileSizeInMB(filePath);
          const needsOptimization = parseFloat(size) > CONFIG.heroThreshold;
          console.log(`  ${file}: ${size}MB ${needsOptimization ? '⚠️  NEEDS OPTIMIZATION' : '✅ OK'}`);
        }
      }
    } catch (error) {
      console.error(`Error analyzing hero images:`, error.message);
    }
    
    console.log('\n📝 Blog Images:');
    await analyzeBlogDir(blogDir);
    
    console.log('\n💡 Recommendations:');
    console.log('1. Convert PNG images to WebP format for better compression');
    console.log('2. Use Next.js Image component with optimization enabled');
    console.log('3. Implement lazy loading for non-critical images');
    console.log('4. Consider using responsive images with different sizes');
    console.log('5. Run this script regularly to monitor image sizes');
    
  } catch (error) {
    console.error('Error during image analysis:', error.message);
    process.exit(1);
  }
}

// Run the analysis if this script is executed directly
if (require.main === module) {
  analyzeImages().catch(error => {
    console.error('Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  analyzeImages,
  getFileSizeInMB,
  validatePath,
  isImageFile,
  CONFIG
};
