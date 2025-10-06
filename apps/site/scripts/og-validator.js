#!/usr/bin/env node

/**
 * Open Graph Validator
 * 
 * Comprehensive Open Graph metadata validator with detailed reporting
 * and recommendations for optimal social media sharing.
 * 
 * Usage:
 *   node scripts/og-validator.js --url https://your-site.com
 *   node scripts/og-validator.js --validate-all
 *   node scripts/og-validator.js --generate-report
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Validation rules and recommendations
const VALIDATION_RULES = {
  'og:title': {
    required: true,
    minLength: 10,
    maxLength: 95,
    recommendedLength: 60,
    description: 'Page title for social sharing'
  },
  'og:description': {
    required: true,
    minLength: 120,
    maxLength: 200,
    recommendedLength: 160,
    description: 'Page description for social sharing'
  },
  'og:type': {
    required: true,
    validValues: ['website', 'article', 'profile', 'book', 'music.song', 'video.movie'],
    default: 'website',
    description: 'Content type for social platforms'
  },
  'og:url': {
    required: true,
    mustBeAbsolute: true,
    mustBeHTTPS: true,
    description: 'Canonical URL of the page'
  },
  'og:image': {
    required: true,
    mustBeAbsolute: true,
    mustBeHTTPS: true,
    validExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    description: 'Image URL for social sharing'
  },
  'og:image:width': {
    required: false,
    recommended: true,
    minValue: 600,
    optimalValue: 1200,
    description: 'Image width in pixels'
  },
  'og:image:height': {
    required: false,
    recommended: true,
    minValue: 315,
    optimalValue: 630,
    description: 'Image height in pixels'
  },
  'og:image:alt': {
    required: false,
    recommended: true,
    minLength: 10,
    maxLength: 125,
    description: 'Alt text for the OG image'
  },
  'og:site_name': {
    required: false,
    recommended: true,
    description: 'Name of the website'
  },
  'og:locale': {
    required: false,
    recommended: true,
    default: 'en_US',
    validValues: ['en_US', 'en_GB', 'en_CA', 'es_ES', 'fr_FR', 'de_DE'],
    description: 'Locale of the content'
  }
};

const TWITTER_RULES = {
  'twitter:card': {
    required: true,
    validValues: ['summary', 'summary_large_image', 'app', 'player'],
    recommended: 'summary_large_image',
    description: 'Type of Twitter card'
  },
  'twitter:title': {
    required: false,
    maxLength: 70,
    description: 'Twitter-specific title (falls back to og:title)'
  },
  'twitter:description': {
    required: false,
    maxLength: 200,
    description: 'Twitter-specific description (falls back to og:description)'
  },
  'twitter:image': {
    required: false,
    description: 'Twitter-specific image (falls back to og:image)'
  },
  'twitter:image:alt': {
    required: false,
    description: 'Alt text for Twitter image'
  },
  'twitter:creator': {
    required: false,
    recommended: true,
    format: '@username',
    description: 'Twitter handle of content creator'
  },
  'twitter:site': {
    required: false,
    recommended: true,
    format: '@username',
    description: 'Twitter handle of website'
  }
};

class OpenGraphValidator {
  constructor(baseUrl = 'https://johnschibelli.dev') {
    this.baseUrl = baseUrl;
    this.validationResults = [];
  }

  /**
   * Fetch HTML content from URL
   */
  async fetchHTML(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      
      const request = protocol.get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400) {
          // Handle redirects
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            this.fetchHTML(redirectUrl).then(resolve).catch(reject);
            return;
          }
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }
        
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(data));
      });
      
      request.on('error', reject);
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  /**
   * Extract meta tags from HTML
   */
  extractMetaTags(html) {
    const metaTags = {};
    const metaRegex = /<meta[^>]+>/gi;
    let match;

    while ((match = metaRegex.exec(html)) !== null) {
      const metaTag = match[0];
      
      // Extract property or name
      const propertyMatch = metaTag.match(/property=["']([^"']+)["']/i);
      const nameMatch = metaTag.match(/name=["']([^"']+)["']/i);
      const contentMatch = metaTag.match(/content=["']([^"']*)["']/i);
      
      if (contentMatch) {
        const key = propertyMatch ? propertyMatch[1] : nameMatch ? nameMatch[1] : null;
        if (key) {
          metaTags[key] = contentMatch[1];
        }
      }
    }

    return metaTags;
  }

  /**
   * Validate Open Graph tags
   */
  validateOpenGraphTags(metaTags) {
    const results = {
      score: 0,
      maxScore: 0,
      tags: {},
      errors: [],
      warnings: [],
      recommendations: []
    };

    Object.entries(VALIDATION_RULES).forEach(([tag, rules]) => {
      const tagResult = this.validateTag(tag, metaTags[tag], rules);
      results.tags[tag] = tagResult;
      
      if (rules.required || rules.recommended) {
        results.maxScore += 1;
        if (tagResult.valid) {
          results.score += 1;
        }
      }
      
      if (tagResult.errors.length > 0) {
        results.errors.push(...tagResult.errors);
      }
      if (tagResult.warnings.length > 0) {
        results.warnings.push(...tagResult.warnings);
      }
      if (tagResult.recommendations.length > 0) {
        results.recommendations.push(...tagResult.recommendations);
      }
    });

    // Additional validations
    this.validateImageDimensions(metaTags, results);
    this.validateAspectRatio(metaTags, results);
    this.validateConsistency(metaTags, results);

    return results;
  }

  /**
   * Validate Twitter Card tags
   */
  validateTwitterTags(metaTags) {
    const results = {
      score: 0,
      maxScore: 0,
      tags: {},
      errors: [],
      warnings: [],
      recommendations: []
    };

    Object.entries(TWITTER_RULES).forEach(([tag, rules]) => {
      const tagResult = this.validateTag(tag, metaTags[tag], rules);
      results.tags[tag] = tagResult;
      
      if (rules.required || rules.recommended) {
        results.maxScore += 1;
        if (tagResult.valid) {
          results.score += 1;
        }
      }
      
      if (tagResult.errors.length > 0) {
        results.errors.push(...tagResult.errors);
      }
      if (tagResult.warnings.length > 0) {
        results.warnings.push(...tagResult.warnings);
      }
      if (tagResult.recommendations.length > 0) {
        results.recommendations.push(...tagResult.recommendations);
      }
    });

    return results;
  }

  /**
   * Validate individual tag
   */
  validateTag(tag, value, rules) {
    const result = {
      present: !!value,
      value,
      valid: false,
      errors: [],
      warnings: [],
      recommendations: []
    };

    if (!value) {
      if (rules.required) {
        result.errors.push(`${tag} is required but missing`);
      } else if (rules.recommended) {
        result.warnings.push(`${tag} is recommended but missing`);
      }
      return result;
    }

    // Check length constraints
    if (rules.minLength && value.length < rules.minLength) {
      result.errors.push(`${tag} is too short (${value.length}/${rules.minLength} chars)`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      result.warnings.push(`${tag} is too long (${value.length}/${rules.maxLength} chars)`);
    }
    if (rules.recommendedLength && Math.abs(value.length - rules.recommendedLength) > 10) {
      result.recommendations.push(`${tag} length (${value.length}) should be close to ${rules.recommendedLength} characters`);
    }

    // Check valid values
    if (rules.validValues && !rules.validValues.includes(value)) {
      result.errors.push(`${tag} value "${value}" is not valid. Options: ${rules.validValues.join(', ')}`);
    }

    // Check URL requirements
    if (rules.mustBeAbsolute || rules.mustBeHTTPS) {
      try {
        const url = new URL(value);
        if (rules.mustBeHTTPS && url.protocol !== 'https:') {
          result.errors.push(`${tag} must use HTTPS`);
        }
      } catch {
        if (rules.mustBeAbsolute) {
          result.errors.push(`${tag} must be an absolute URL`);
        }
      }
    }

    // Check image extensions
    if (rules.validExtensions && tag.includes('image')) {
      const hasValidExtension = rules.validExtensions.some(ext => 
        value.toLowerCase().endsWith(ext)
      );
      if (!hasValidExtension) {
        result.errors.push(`${tag} must have a valid image extension: ${rules.validExtensions.join(', ')}`);
      }
    }

    // Check numeric values
    if (rules.minValue || rules.optimalValue) {
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        result.errors.push(`${tag} must be a valid number`);
      } else {
        if (rules.minValue && numValue < rules.minValue) {
          result.warnings.push(`${tag} (${numValue}) should be at least ${rules.minValue}`);
        }
        if (rules.optimalValue && numValue !== rules.optimalValue) {
          result.recommendations.push(`${tag} (${numValue}) optimal value is ${rules.optimalValue}`);
        }
      }
    }

    // Check format
    if (rules.format === '@username' && !value.startsWith('@')) {
      result.warnings.push(`${tag} should start with @ for Twitter handles`);
    }

    result.valid = result.errors.length === 0;
    return result;
  }

  /**
   * Validate image dimensions
   */
  validateImageDimensions(metaTags, results) {
    const width = parseInt(metaTags['og:image:width']) || 0;
    const height = parseInt(metaTags['og:image:height']) || 0;

    if (width && height) {
      if (width < 600 || height < 315) {
        results.errors.push(`OG image dimensions (${width}x${height}) are too small. Minimum: 600x315`);
      } else if (width < 1200 || height < 630) {
        results.warnings.push(`OG image dimensions (${width}x${height}) are below optimal. Recommended: 1200x630`);
      }
    } else {
      results.warnings.push('OG image dimensions not specified');
    }
  }

  /**
   * Validate aspect ratio
   */
  validateAspectRatio(metaTags, results) {
    const width = parseInt(metaTags['og:image:width']) || 0;
    const height = parseInt(metaTags['og:image:height']) || 0;

    if (width && height) {
      const aspectRatio = width / height;
      const optimalRatio = 1200 / 630; // 1.91
      
      if (Math.abs(aspectRatio - optimalRatio) > 0.1) {
        results.recommendations.push(
          `OG image aspect ratio (${aspectRatio.toFixed(2)}) should be close to 1.91:1 for best results`
        );
      }
    }
  }

  /**
   * Validate consistency between OG and Twitter tags
   */
  validateConsistency(metaTags, results) {
    // Check if Twitter tags fall back to OG tags appropriately
    if (!metaTags['twitter:title'] && !metaTags['og:title']) {
      results.errors.push('Neither twitter:title nor og:title is present');
    }
    if (!metaTags['twitter:description'] && !metaTags['og:description']) {
      results.errors.push('Neither twitter:description nor og:description is present');
    }
    if (!metaTags['twitter:image'] && !metaTags['og:image']) {
      results.errors.push('Neither twitter:image nor og:image is present');
    }

    // Check for conflicting values
    if (metaTags['twitter:title'] && metaTags['og:title'] && 
        metaTags['twitter:title'] !== metaTags['og:title']) {
      results.warnings.push('twitter:title and og:title have different values');
    }
  }

  /**
   * Validate a single page
   */
  async validatePage(url) {
    console.log(`\n🔍 Validating: ${url}`);
    
    try {
      const html = await this.fetchHTML(url);
      const metaTags = this.extractMetaTags(html);
      
      const ogResults = this.validateOpenGraphTags(metaTags);
      const twitterResults = this.validateTwitterTags(metaTags);
      
      const pageResult = {
        url,
        metaTags,
        openGraph: ogResults,
        twitter: twitterResults,
        timestamp: new Date().toISOString()
      };

      this.printValidationResults(pageResult);
      return pageResult;
      
    } catch (error) {
      console.error(`❌ Error validating ${url}:`, error.message);
      return {
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Print validation results
   */
  printValidationResults(result) {
    if (result.error) {
      console.log(`❌ Validation failed: ${result.error}`);
      return;
    }

    // Open Graph Score
    const ogScore = result.openGraph.score;
    const ogMaxScore = result.openGraph.maxScore;
    const ogPercentage = Math.round((ogScore / ogMaxScore) * 100);
    
    console.log(`\n📊 Open Graph Score: ${ogScore}/${ogMaxScore} (${ogPercentage}%)`);
    
    if (result.openGraph.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      result.openGraph.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (result.openGraph.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      result.openGraph.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    if (result.openGraph.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`);
      result.openGraph.recommendations.forEach(rec => console.log(`   • ${rec}`));
    }

    // Twitter Score
    const twitterScore = result.twitter.score;
    const twitterMaxScore = result.twitter.maxScore;
    const twitterPercentage = twitterMaxScore > 0 ? Math.round((twitterScore / twitterMaxScore) * 100) : 0;
    
    console.log(`\n🐦 Twitter Score: ${twitterScore}/${twitterMaxScore} (${twitterPercentage}%)`);
    
    if (result.twitter.errors.length > 0) {
      console.log(`\n❌ Twitter Errors:`);
      result.twitter.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (result.twitter.warnings.length > 0) {
      console.log(`\n⚠️  Twitter Warnings:`);
      result.twitter.warnings.forEach(warning => console.log(`   • ${warning}`));
    }

    // Overall assessment
    const totalErrors = result.openGraph.errors.length + result.twitter.errors.length;
    const totalWarnings = result.openGraph.warnings.length + result.twitter.warnings.length;
    
    if (totalErrors === 0 && totalWarnings === 0) {
      console.log(`\n✅ Excellent! No issues found.`);
    } else if (totalErrors === 0) {
      console.log(`\n✅ Good! Only minor warnings to address.`);
    } else {
      console.log(`\n❌ Issues found that should be fixed.`);
    }
  }

  /**
   * Generate comprehensive report
   */
  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      totalPages: results.length,
      summary: {
        totalErrors: 0,
        totalWarnings: 0,
        averageOGScore: 0,
        averageTwitterScore: 0
      },
      pages: results
    };

    // Calculate summary statistics
    const validResults = results.filter(r => !r.error);
    if (validResults.length > 0) {
      report.summary.totalErrors = validResults.reduce((sum, r) => 
        sum + r.openGraph.errors.length + r.twitter.errors.length, 0);
      report.summary.totalWarnings = validResults.reduce((sum, r) => 
        sum + r.openGraph.warnings.length + r.twitter.warnings.length, 0);
      report.summary.averageOGScore = Math.round(
        validResults.reduce((sum, r) => sum + (r.openGraph.score / r.openGraph.maxScore), 0) / validResults.length * 100
      );
      report.summary.averageTwitterScore = Math.round(
        validResults.reduce((sum, r) => sum + (r.twitter.score / r.twitter.maxScore), 0) / validResults.length * 100
      );
    }

    return report;
  }

  /**
   * Save report to JSON file
   */
  async saveReport(report, filename = 'og-validation-report.json') {
    const fs = require('fs').promises;
    const path = require('path');
    
    const reportPath = path.join(__dirname, filename);
    
    try {
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
      console.log(`\n📄 Validation report saved to: ${reportPath}`);
    } catch (error) {
      console.error(`❌ Error saving report: ${error.message}`);
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const urlArg = args.find(arg => arg.startsWith('--url='));
  const validateAll = args.includes('--validate-all');
  const generateReport = args.includes('--generate-report');
  
  let baseUrl = 'https://johnschibelli.dev';
  if (urlArg) {
    baseUrl = urlArg.split('=')[1];
  }

  const validator = new OpenGraphValidator(baseUrl);
  const results = [];

  if (validateAll) {
    const testPages = ['/', '/projects', '/case-studies', '/blog', '/about'];
    
    console.log(`🚀 Starting comprehensive Open Graph validation for ${baseUrl}`);
    
    for (const page of testPages) {
      const result = await validator.validatePage(`${baseUrl}${page}`);
      results.push(result);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (generateReport) {
      const report = validator.generateReport(results);
      await validator.saveReport(report);
    }
    
  } else if (urlArg) {
    const result = await validator.validatePage(baseUrl);
    results.push(result);
    
  } else {
    console.log(`🔍 Open Graph Validator`);
    console.log(`Usage:`);
    console.log(`  node scripts/og-validator.js --url=https://your-site.com`);
    console.log(`  node scripts/og-validator.js --validate-all`);
    console.log(`  node scripts/og-validator.js --validate-all --generate-report`);
    console.log(`\nOptions:`);
    console.log(`  --url=<URL>        Validate specific page URL`);
    console.log(`  --validate-all     Validate all configured pages`);
    console.log(`  --generate-report  Save detailed JSON report`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { OpenGraphValidator };
