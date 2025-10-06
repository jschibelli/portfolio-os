#!/usr/bin/env node

/**
 * Social Media Testing Suite
 * 
 * This script provides comprehensive testing for social media sharing metadata
 * across Facebook, Twitter, LinkedIn, and general Open Graph validation.
 * 
 * Usage:
 *   node scripts/social-media-testing.js
 *   node scripts/social-media-testing.js --url https://your-site.com
 *   node scripts/social-media-testing.js --all-pages
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const DEFAULT_BASE_URL = 'https://johnschibelli.dev';
const TEST_PAGES = [
  '/',
  '/projects',
  '/case-studies',
  '/blog',
  '/about',
  '/contact'
];

// Testing utilities
class SocialMediaTester {
  constructor(baseUrl = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.results = [];
  }

  /**
   * Fetch HTML content from a URL
   */
  async fetchHTML(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      
      protocol.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  /**
   * Extract meta tags from HTML
   */
  extractMetaTags(html) {
    const metaTags = {};
    const metaRegex = /<meta[^>]+>/g;
    let match;

    while ((match = metaRegex.exec(html)) !== null) {
      const metaTag = match[0];
      
      // Extract property or name
      const propertyMatch = metaTag.match(/property=["']([^"']+)["']/);
      const nameMatch = metaTag.match(/name=["']([^"']+)["']/);
      const contentMatch = metaTag.match(/content=["']([^"']+)["']/);
      
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
  validateOpenGraph(metaTags) {
    const required = [
      'og:title',
      'og:description', 
      'og:type',
      'og:url',
      'og:image'
    ];

    const recommended = [
      'og:site_name',
      'og:locale',
      'og:image:width',
      'og:image:height',
      'og:image:alt'
    ];

    const results = {
      required: {},
      recommended: {},
      errors: [],
      warnings: []
    };

    // Check required tags
    required.forEach(tag => {
      if (metaTags[tag]) {
        results.required[tag] = {
          present: true,
          value: metaTags[tag],
          valid: this.validateTagValue(tag, metaTags[tag])
        };
      } else {
        results.required[tag] = {
          present: false,
          value: null,
          valid: false
        };
        results.errors.push(`Missing required OG tag: ${tag}`);
      }
    });

    // Check recommended tags
    recommended.forEach(tag => {
      if (metaTags[tag]) {
        results.recommended[tag] = {
          present: true,
          value: metaTags[tag],
          valid: this.validateTagValue(tag, metaTags[tag])
        };
      } else {
        results.recommended[tag] = {
          present: false,
          value: null,
          valid: false
        };
        results.warnings.push(`Missing recommended OG tag: ${tag}`);
      }
    });

    // Validate OG image dimensions
    if (metaTags['og:image']) {
      this.validateOGImage(metaTags, results);
    }

    return results;
  }

  /**
   * Validate Twitter Card tags
   */
  validateTwitterCards(metaTags) {
    const required = [
      'twitter:card',
      'twitter:title',
      'twitter:description'
    ];

    const recommended = [
      'twitter:image',
      'twitter:image:alt',
      'twitter:creator',
      'twitter:site'
    ];

    const results = {
      required: {},
      recommended: {},
      errors: [],
      warnings: []
    };

    // Check required tags
    required.forEach(tag => {
      if (metaTags[tag]) {
        results.required[tag] = {
          present: true,
          value: metaTags[tag],
          valid: this.validateTagValue(tag, metaTags[tag])
        };
      } else {
        results.required[tag] = {
          present: false,
          value: null,
          valid: false
        };
        results.errors.push(`Missing required Twitter tag: ${tag}`);
      }
    });

    // Check recommended tags
    recommended.forEach(tag => {
      if (metaTags[tag]) {
        results.recommended[tag] = {
          present: true,
          value: metaTags[tag],
          valid: this.validateTagValue(tag, metaTags[tag])
        };
      } else {
        results.recommended[tag] = {
          present: false,
          value: null,
          valid: false
        };
        results.warnings.push(`Missing recommended Twitter tag: ${tag}`);
      }
    });

    return results;
  }

  /**
   * Validate specific tag values
   */
  validateTagValue(tag, value) {
    switch (tag) {
      case 'og:title':
        return value.length >= 10 && value.length <= 95;
      case 'og:description':
        return value.length >= 120 && value.length <= 200;
      case 'og:type':
        return ['website', 'article', 'profile'].includes(value);
      case 'og:url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      case 'og:image':
        try {
          new URL(value);
          return value.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        } catch {
          return false;
        }
      case 'og:image:width':
        return parseInt(value) >= 600;
      case 'og:image:height':
        return parseInt(value) >= 315;
      case 'twitter:card':
        return ['summary', 'summary_large_image', 'app', 'player'].includes(value);
      default:
        return true;
    }
  }

  /**
   * Validate OG image requirements
   */
  validateOGImage(metaTags, results) {
    const imageUrl = metaTags['og:image'];
    const width = parseInt(metaTags['og:image:width']) || 0;
    const height = parseInt(metaTags['og:image:height']) || 0;

    // Check dimensions
    if (width < 1200 || height < 630) {
      results.warnings.push(`OG image dimensions (${width}x${height}) should be at least 1200x630 for optimal display`);
    }

    // Check aspect ratio (1.91:1 is optimal)
    if (width && height) {
      const aspectRatio = width / height;
      if (aspectRatio < 1.8 || aspectRatio > 2.0) {
        results.warnings.push(`OG image aspect ratio (${aspectRatio.toFixed(2)}) should be close to 1.91:1 for best results`);
      }
    }
  }

  /**
   * Test a single page
   */
  async testPage(path) {
    const url = `${this.baseUrl}${path}`;
    console.log(`\n🔍 Testing: ${url}`);
    
    try {
      const html = await this.fetchHTML(url);
      const metaTags = this.extractMetaTags(html);
      
      const ogResults = this.validateOpenGraph(metaTags);
      const twitterResults = this.validateTwitterCards(metaTags);
      
      const pageResult = {
        url,
        path,
        metaTags,
        openGraph: ogResults,
        twitterCards: twitterResults,
        success: ogResults.errors.length === 0
      };

      this.results.push(pageResult);
      this.printPageResults(pageResult);
      
      return pageResult;
    } catch (error) {
      console.error(`❌ Error testing ${url}:`, error.message);
      return {
        url,
        path,
        error: error.message,
        success: false
      };
    }
  }

  /**
   * Print results for a single page
   */
  printPageResults(result) {
    if (result.error) {
      console.log(`❌ Failed to test page: ${result.error}`);
      return;
    }

    console.log(`✅ Page loaded successfully`);
    
    // Open Graph results
    console.log(`\n📘 Open Graph Tags:`);
    console.log(`   Required: ${Object.values(result.openGraph.required).filter(r => r.present).length}/${Object.keys(result.openGraph.required).length}`);
    console.log(`   Recommended: ${Object.values(result.openGraph.recommended).filter(r => r.present).length}/${Object.keys(result.openGraph.recommended).length}`);
    
    if (result.openGraph.errors.length > 0) {
      console.log(`   ❌ Errors: ${result.openGraph.errors.join(', ')}`);
    }
    
    if (result.openGraph.warnings.length > 0) {
      console.log(`   ⚠️  Warnings: ${result.openGraph.warnings.join(', ')}`);
    }

    // Twitter Cards results
    console.log(`\n🐦 Twitter Cards:`);
    console.log(`   Required: ${Object.values(result.twitterCards.required).filter(r => r.present).length}/${Object.keys(result.twitterCards.required).length}`);
    console.log(`   Recommended: ${Object.values(result.twitterCards.recommended).filter(r => r.present).length}/${Object.keys(result.twitterCards.recommended).length}`);
    
    if (result.twitterCards.errors.length > 0) {
      console.log(`   ❌ Errors: ${result.twitterCards.errors.join(', ')}`);
    }
    
    if (result.twitterCards.warnings.length > 0) {
      console.log(`   ⚠️  Warnings: ${result.twitterCards.warnings.join(', ')}`);
    }
  }

  /**
   * Test all configured pages
   */
  async testAllPages() {
    console.log(`🚀 Starting social media metadata testing for ${this.baseUrl}`);
    console.log(`📋 Testing ${TEST_PAGES.length} pages...`);

    for (const path of TEST_PAGES) {
      await this.testPage(path);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.printSummary();
  }

  /**
   * Print overall summary
   */
  printSummary() {
    console.log(`\n📊 TESTING SUMMARY`);
    console.log(`==================`);
    
    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    console.log(`✅ Successful: ${successful}/${total} pages`);
    
    if (successful < total) {
      console.log(`❌ Failed pages:`);
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.url}: ${r.error}`);
      });
    }

    // Generate testing URLs for external tools
    console.log(`\n🔗 External Testing Tools:`);
    console.log(`=======================`);
    
    this.results.filter(r => r.success).forEach(result => {
      console.log(`\n📄 ${result.path}:`);
      console.log(`   Facebook Debugger: https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(result.url)}`);
      console.log(`   Twitter Validator: https://cards-dev.twitter.com/validator?url=${encodeURIComponent(result.url)}`);
      console.log(`   LinkedIn Inspector: https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(result.url)}`);
      console.log(`   Open Graph Preview: https://www.opengraph.xyz/?url=${encodeURIComponent(result.url)}`);
    });
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const urlArg = args.find(arg => arg.startsWith('--url='));
  const testAll = args.includes('--all-pages');
  
  let baseUrl = DEFAULT_BASE_URL;
  if (urlArg) {
    baseUrl = urlArg.split('=')[1];
  }

  const tester = new SocialMediaTester(baseUrl);

  if (testAll) {
    await tester.testAllPages();
  } else if (urlArg) {
    const url = new URL(baseUrl);
    await tester.testPage(url.pathname + url.search + url.hash);
  } else {
    console.log(`Usage:`);
    console.log(`  node scripts/social-media-testing.js --url=https://your-site.com`);
    console.log(`  node scripts/social-media-testing.js --all-pages`);
    console.log(`  node scripts/social-media-testing.js --all-pages --url=https://your-site.com`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SocialMediaTester };
